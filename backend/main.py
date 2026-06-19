"""
FastAPI backend — SSE streaming endpoint for ResearchMind.

Matches the real agents.py / tools.py:
  - web_search(query)  -> @tool, returns one string: "Title: ..\nURL: ..\nSnippet: ..\n" blocks
                           joined by "\n----\n"
  - scrape_url(url)    -> @tool, returns a plain text string (already truncated to 1500 chars)
  - writer_chain        = writer_prompt | llm | StrOutputParser(), invoked with
                           {"topic": str, "research": str} -> plain string, supports .astream
  - critic_chain        = critic_prompt | llm | StrOutputParser(), invoked with
                           {"report": str} -> plain text block:
                             "Score: X/10\n\nStrengths:\n- ..\n\nAreas to Improve:\n- ..\n\nOne line verdict:\n.."

This file parses those raw strings into the SSE event contract src/App.jsx expects:
  - node        { key, state }
  - sources     { search: [{title, url, snippet}], scraped: str }
  - token       { word }
  - critique    { score, verdict, strengths, areas_to_improve }
  - done        {}
  - error_event { message }
"""

import asyncio
import json
import re
from typing import AsyncGenerator

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from tools import web_search, scrape_url
from agents import writer_chain, critic_chain

app = FastAPI(title="ResearchMind API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def sse(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"


def parse_search_results(raw: str) -> list[dict]:
    """Turn 'Title: ..\\nURL: ..\\nSnippet: ..\\n' blocks (joined by ----) into a list of dicts."""
    results = []
    for block in raw.split("----"):
        title = re.search(r"Title:\s*(.*)", block)
        url = re.search(r"URL:\s*(.*)", block)
        snippet = re.search(r"Snippet:\s*(.*)", block)
        if title and url:
            results.append({
                "title": title.group(1).strip(),
                "url": url.group(1).strip(),
                "snippet": snippet.group(1).strip() if snippet else "",
            })
    return results


def parse_critique(raw: str) -> dict:
    """Turn the critic chain's plain-text block into a structured dict."""
    score_match = re.search(r"Score:\s*([\d.]+)\s*/\s*10", raw)
    strengths_match = re.search(r"Strengths:\s*(.*?)(?:Areas to Improve:|$)", raw, re.S)
    areas_match = re.search(r"Areas to Improve:\s*(.*?)(?:One line verdict:|$)", raw, re.S)
    verdict_match = re.search(r"One line verdict:\s*(.*)", raw, re.S)

    return {
        "score": float(score_match.group(1)) if score_match else 0.0,
        "strengths": strengths_match.group(1).strip() if strengths_match else "",
        "areas_to_improve": areas_match.group(1).strip() if areas_match else "",
        "verdict": verdict_match.group(1).strip() if verdict_match else "",
    }


async def run_pipeline(topic: str) -> AsyncGenerator[str, None]:
    try:
        # ---- 1. Search Agent ----
        yield sse("node", {"key": "search", "state": "active"})
        search_raw = await asyncio.to_thread(web_search.invoke, {"query": topic})
        results = parse_search_results(search_raw)
        yield sse("sources", {"search": results, "scraped": ""})
        yield sse("node", {"key": "search", "state": "done"})

        if not results:
            yield sse("error_event", {"message": "No search results found for this topic."})
            return

        # ---- 2. Reader Agent ----
        yield sse("node", {"key": "reader", "state": "active"})
        best_url = results[0]["url"]
        scraped = await asyncio.to_thread(scrape_url.invoke, {"url": best_url})
        yield sse("sources", {"search": results, "scraped": scraped})
        yield sse("node", {"key": "reader", "state": "done"})

        # ---- 3. Writer Chain (streamed word by word) ----
        yield sse("node", {"key": "writer", "state": "active"})
        research_text = (
            f"Search Results:\n{search_raw}\n\n"
            f"Scraped Content from {best_url}:\n{scraped}"
        )

        full_report = ""
        async for chunk in writer_chain.astream({"topic": topic, "research": research_text}):
            text = chunk if isinstance(chunk, str) else getattr(chunk, "content", str(chunk))
            if not text:
                continue
            for word in text.split(" "):
                if not word:
                    continue
                piece = word + " "
                full_report += piece
                yield sse("token", {"word": piece})
                await asyncio.sleep(0.02)  # gentle pacing for the streaming effect
        yield sse("node", {"key": "writer", "state": "done"})

        # ---- 4. Critic Chain ----
        yield sse("node", {"key": "critic", "state": "active"})
        critique_raw = await asyncio.to_thread(
            critic_chain.invoke, {"report": full_report[:2000]}
        )
        critique = parse_critique(critique_raw)
        yield sse("critique", critique)
        yield sse("node", {"key": "critic", "state": "done"})

        yield sse("done", {})

    except Exception as exc:  # noqa: BLE001
        yield sse("error_event", {"message": str(exc)})


@app.get("/api/research/stream")
async def research_stream(topic: str = Query(..., min_length=1)):
    return StreamingResponse(
        run_pipeline(topic),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@app.get("/api/health")
async def health():
    return {"status": "ok"}
