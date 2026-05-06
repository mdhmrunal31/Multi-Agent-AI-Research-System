from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import asyncio
import json

from agents import build_search_agent, build_reader_agent, writer_chain, critic_chain

app = FastAPI(title="ResearchMind API", version="1.0.0")

origins = [
    "https://multi-agent-ai-research-system.vercel.app",
    "https://multi-agent-ai-research-system-3gxqb3rgr-mdhmrunal31s-projects.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def send(payload: dict) -> str:
    return f"data: {json.dumps(payload)}\n\n"


@app.get("/api/research/stream")
async def stream_research(topic: str):
    async def generate():
        try:
            # ── Step 1 : Search Agent ─────────────────────────────────────────
            yield send({"type": "step", "step": 0, "status": "active"})

            search_agent = build_search_agent()
            search_result = await asyncio.to_thread(
                search_agent.invoke,
                {"messages": [("user", f"Find recent, reliable and detailed information about: {topic}")]}
            )
            search_results = search_result["messages"][-1].content[:500]

            yield send({"type": "step", "step": 0, "status": "done", "data": search_results})
            await asyncio.sleep(0.3)

            # ── Step 2 : Reader Agent ─────────────────────────────────────────
            yield send({"type": "step", "step": 1, "status": "active"})

            reader_agent = build_reader_agent()
            reader_result = await asyncio.to_thread(
                reader_agent.invoke,
                {"messages": [("user",
                    f"Based on the following search results about '{topic}', "
                    f"pick the most relevant URL and scrape it for deeper content.\n\n"
                    f"Search Results:\n{search_results[:500]}"
                )]}
            )
            scraped_content = reader_result["messages"][-1].content[:1000]

            yield send({"type": "step", "step": 1, "status": "done", "data": scraped_content})
            await asyncio.sleep(0.3)

            # ── Step 3 : Writer Chain ─────────────────────────────────────────
            yield send({"type": "step", "step": 2, "status": "active"})

            research_combined = (
                f"SEARCH RESULTS:\n{search_results}\n\n"
                f"DETAILED SCRAPED CONTENT:\n{scraped_content}"
            )
            report = await asyncio.to_thread(
                writer_chain.invoke,
                {"topic": topic, "research": research_combined}
            )

            yield send({"type": "step", "step": 2, "status": "done"})
            await asyncio.sleep(0.2)

            # Stream report word by word
            yield send({"type": "report_start"})
            for word in report.split(" "):
                yield send({"type": "report_token", "token": word + " "})
                await asyncio.sleep(0.025)

            # ── Step 4 : Critic Chain ─────────────────────────────────────────
            yield send({"type": "step", "step": 3, "status": "active"})

            feedback = await asyncio.to_thread(
                critic_chain.invoke,
                {"report": report[:2000]}
            )

            yield send({"type": "step", "step": 3, "status": "done"})
            await asyncio.sleep(0.2)

            # ── Final payload ─────────────────────────────────────────────────
            yield send({
                "type": "done",
                "feedback":        feedback,
                "search_results":  search_results,
                "scraped_content": scraped_content,
                "report":          report,
            })

        except Exception as e:
            yield send({"type": "error", "message": str(e)})

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control":     "no-cache",
            "X-Accel-Buffering": "no",
            "Connection":        "keep-alive",
        },
    )


@app.get("/health")
async def health():
    return {"status": "ok", "service": "ResearchMind API"}