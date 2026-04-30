<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=32&duration=3000&pause=1000&color=F5A623&center=true&vCenter=true&width=600&lines=🧠+ResearchMind;Multi-Agent+AI+Research+System;Search+%E2%86%92+Read+%E2%86%92+Write+%E2%86%92+Critique" alt="Typing SVG" />

<br/>

**An autonomous multi-agent AI pipeline that searches the web, reads sources, writes structured research reports, and critiques them — all in one click.**

<br/>

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-Agents-FF6B6B?style=for-the-badge&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-LCEL-1C3C3C?style=for-the-badge&logo=chainlink&logoColor=white)
![Streamlit](https://img.shields.io/badge/Streamlit-UI-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-2.0_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Tavily](https://img.shields.io/badge/Tavily-Search_API-00C897?style=for-the-badge)

<br/>

> 🚀 Enter any research topic → Get a full structured report with a quality score in minutes.

</div>

---

## 📌 Overview

**ResearchMind** is a multi-agent AI system built using **LangGraph** and **LangChain LCEL**. It orchestrates 4 specialized AI agents/chains that work in sequence to autonomously:

1. 🔍 **Search** the web for recent, reliable information
2. 📄 **Scrape** the most relevant source for deeper content
3. ✍️ **Write** a detailed, structured research report
4. 🧐 **Critique** the report and assign a quality score

The entire pipeline is wrapped in a beautiful **Streamlit UI** with real-time step tracking, animated status indicators, and a one-click report download.

---

## 🎯 Pipeline Architecture

```
                        ┌─────────────────────────────┐
                        │       User Input (Topic)     │
                        └──────────────┬──────────────┘
                                       │
                                       ▼
                        ┌─────────────────────────────┐
                        │      🔍  Search Agent        │
                        │  Tool: web_search (Tavily)   │
                        │  → Finds top 3 web results   │
                        └──────────────┬──────────────┘
                                       │
                                       ▼
                        ┌─────────────────────────────┐
                        │      📄  Reader Agent        │
                        │  Tool: scrape_url (BS4)      │
                        │  → Scrapes best URL deeply   │
                        └──────────────┬──────────────┘
                                       │
                                       ▼
                        ┌─────────────────────────────┐
                        │      ✍️  Writer Chain         │
                        │  LangChain LCEL Runnable     │
                        │  → Writes structured report  │
                        └──────────────┬──────────────┘
                                       │
                                       ▼
                        ┌─────────────────────────────┐
                        │      🧐  Critic Chain         │
                        │  LangChain LCEL Runnable     │
                        │  → Scores & reviews report   │
                        └──────────────┬──────────────┘
                                       │
                                       ▼
                        ┌─────────────────────────────┐
                        │   📊 Final Report + Score    │
                        └─────────────────────────────┘
```

---

## 🤖 Agents & Chains Explained

| Component | Type | Role | Tool / Model |
|---|---|---|---|
| **Search Agent** | LangGraph ReAct Agent | Searches web for recent, reliable info on the topic | `web_search` via Tavily API |
| **Reader Agent** | LangGraph ReAct Agent | Picks the best URL from search results and scrapes it | `scrape_url` via BeautifulSoup4 |
| **Writer Chain** | LangChain LCEL Chain | Combines search + scraped data → writes Intro, Key Findings, Conclusion, Sources | Gemini 2.0 Flash |
| **Critic Chain** | LangChain LCEL Chain | Reviews the report → gives Score/10, Strengths, Areas to Improve, Verdict | Gemini 2.0 Flash |

---

## 🗂️ Project Structure

```
Multi-Agent-AI-Research-System/
│
├── 📄 agents.py            # LLM setup, agent builders, writer & critic chains
├── 📄 tools.py             # web_search and scrape_url tool definitions
├── 📄 pipeline.py          # Orchestrates the full 4-step agent pipeline
├── 📄 app.py               # Streamlit UI — dark theme, live step tracker
│
├── 📄 .env                 # API keys — never pushed to GitHub ❌
├── 📄 .env.example         # Safe template — push this ✅
├── 📄 .gitignore           # Ignores .env, .venv, __pycache__
├── 📄 requirements.txt     # All Python dependencies
└── 📄 README.md            # You are here
```

---

## 🖥️ Streamlit UI Features

- ⬡ **Dark editorial design** — amber/gold accent, Playfair Display + JetBrains Mono fonts
- 📊 **Live 4-step pipeline tracker** — cards animate idle → active → done in real time
- ⚡ **Animated pulsing status bar** — tells you exactly what's happening at each step
- 📋 **4 collapsible result panels** — Search Results, Scraped Content, Report, Critic Review
- 🏆 **Critic score ring** — auto-extracts X/10 score and renders it in a circular badge
- ⬇️ **Download button** — saves the final report as a `.txt` file

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| **LLM** | Google Gemini 2.0 Flash (Google AI Studio) |
| **Agent Framework** | LangGraph — `create_react_agent` |
| **Chain Framework** | LangChain LCEL — `ChatPromptTemplate` + `StrOutputParser` |
| **Web Search** | Tavily Search API |
| **Web Scraping** | BeautifulSoup4 + Requests |
| **UI** | Streamlit |
| **Environment** | Python-dotenv |
| **Logging** | Rich |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- API keys for Tavily and Google AI Studio (or OpenRouter)

---

### 1. Clone the repository

```bash
git clone https://github.com/mdhmrunal31/Multi-Agent-AI-Research-System.git
cd Multi-Agent-AI-Research-System
```

### 2. Create and activate virtual environment

```bash
python -m venv .venv
```

```bash
# Windows
.venv\Scripts\activate

# Mac / Linux
source .venv/bin/activate
```

### 3. Install all dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure your API keys

```bash
cp .env.example .env
```

Open `.env` and fill in your keys:

```env
TAVILY_API_KEY=your_tavily_key_here
GOOGLE_API_KEY=your_google_api_key_here
OPENROUTER_API_KEY=your_openrouter_key_here
```

| Key | Free Plan | Get it from |
|---|---|---|
| `TAVILY_API_KEY` | ✅ Yes | [app.tavily.com](https://app.tavily.com) |
| `GOOGLE_API_KEY` | ✅ Yes | [aistudio.google.com](https://aistudio.google.com) |
| `OPENROUTER_API_KEY` | ✅ Yes | [openrouter.ai/settings/keys](https://openrouter.ai/settings/keys) |

### 5. Run the Streamlit app

```bash
streamlit run app.py
```

Open your browser at `http://localhost:8501` and enter any research topic.

---

## 📸 Sample Report Output Structure

```
📝 Research Report: "Impact of LLMs on Software Engineering"

Introduction
────────────
Large Language Models have fundamentally shifted how software...

Key Findings
────────────
1. Developer Productivity — Studies show 30-55% increase in...
2. Code Quality Tradeoffs — While LLMs accelerate development...
3. Job Market Shifts — Demand for prompt engineering and...

Conclusion
──────────
The integration of LLMs into software workflows is inevitable...

Sources
───────
• https://example.com/llm-study-2025
• https://research.google/llm-productivity
```

```
🧐 Critic Review

Score: 8/10

Strengths:
- Well-structured with clear section separation
- Backed by cited sources with URLs

Areas to Improve:
- Key Finding 2 could use more quantitative data
- Conclusion is slightly brief

One line verdict:
A solid, well-researched report that covers the topic comprehensively.
```

---

## 🔐 Security

- `.env` is listed in `.gitignore` — **never pushed to GitHub**
- `.env.example` contains only placeholder values — **safe to commit**
- Always regenerate API keys if accidentally exposed in a public repo

---

## 📦 Dependencies

```
langchain              # Core LangChain framework
langchain-core         # LCEL Runnables, Prompts, Parsers
langchain-community    # Community integrations
langchain-openai       # OpenAI-compatible client (used for OpenRouter)
langchain-google-genai # Google Gemini integration
langgraph              # Multi-agent orchestration
tavily-python          # Tavily Search API client
beautifulsoup4         # HTML parsing for web scraping
requests               # HTTP client
streamlit              # Web UI framework
python-dotenv          # .env file loader
rich                   # Terminal output formatting
```

---

## 🙋‍♂️ Author

<div align="center">

**Mrunal Hadke**

Data Engineer & GenAI Enthusiast
PG-DBDA — CDAC Pune (Sunbeam Institute of Information Technology)
B.Tech Computer Technology — YCCE Nagpur

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/your-profile)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/mdhmrunal31)

</div>

---

<div align="center">

**⭐ If you found this project useful, please give it a star!**

<sub>Built with ❤️ using LangGraph · LangChain · Google Gemini · Streamlit · Tavily</sub>

</div>
