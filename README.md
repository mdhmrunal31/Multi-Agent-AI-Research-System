# 🧠 Multi-Agent AI Research System

An autonomous multi-agent AI pipeline that searches the web, reads sources, writes structured research reports, and critiques them — built with a full stack React + FastAPI architecture.

> Enter any topic → 4 AI agents work in sequence → get a fully structured report with a quality score, streamed word by word in real time.

---

## 📌 Overview

**ResearchMind** is a full stack multi-agent AI system built using **LangGraph** and **LangChain LCEL** on the backend, and **React + Vite** on the frontend. It orchestrates 4 specialized AI agents and chains that autonomously research any topic and produce a professional report — without any manual effort.

- 🔍 **4 AI agents** working in a sequential pipeline
- 🌐 **Live web search** via Tavily API (top 3 results per query)
- 📄 **Deep content scraping** from the most relevant source
- ✍️ **Structured report generation** with Introduction, Key Findings, Conclusion and Sources
- 🧐 **Automated critique** with Score out of 10, Strengths, Areas to Improve, Verdict
- ⚡ **Word-by-word streaming** via Server-Sent Events (like ChatGPT)
- 💻 **React frontend** with live pipeline tracker, tabs, score ring and report download

---

## 🎯 Pipeline Architecture

```
User Input (Topic)
        │
        ▼
┌───────────────────────────┐
│     🔍 Search Agent        │  → Searches web using Tavily API
│     Tool : web_search      │  → Returns top 3 results (title + URL + snippet)
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│     📄 Reader Agent        │  → Picks most relevant URL from search results
│     Tool : scrape_url      │  → Scrapes up to 1500 characters of clean content
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│     ✍️ Writer Chain         │  → Combines search + scraped data
│     LangChain LCEL         │  → Writes Introduction, Key Findings, Conclusion, Sources
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│     🧐 Critic Chain         │  → Reviews the report strictly
│     LangChain LCEL         │  → Returns Score/10, Strengths, Areas to Improve, Verdict
└─────────────┬─────────────┘
              │
              ▼
     📊 Streamed Report + Critique
```

---

## 🤖 Agents & Chains

| Component | Type | Role | Tool |
|---|---|---|---|
| **Search Agent** | LangGraph ReAct Agent | Searches web for recent reliable info | `web_search` (Tavily) |
| **Reader Agent** | LangGraph ReAct Agent | Scrapes the most relevant URL | `scrape_url` (BeautifulSoup4) |
| **Writer Chain** | LangChain LCEL | Writes full structured research report | Gemini 2.5 Flash Lite |
| **Critic Chain** | LangChain LCEL | Scores and reviews the report | Gemini 2.5 Flash Lite |

---

## ⚙️ Tech Stack

### Backend
| Layer | Technology |
|---|---|
| **LLM** | Google Gemini 2.5 Flash Lite (Google AI Studio) |
| **Agent Framework** | LangGraph — `create_react_agent` |
| **Chain Framework** | LangChain LCEL — `ChatPromptTemplate` + `StrOutputParser` |
| **API Server** | FastAPI |
| **Streaming** | Server-Sent Events (SSE) via `StreamingResponse` |
| **Web Search** | Tavily Search API |
| **Web Scraping** | BeautifulSoup4 + Requests |
| **Environment** | Python-dotenv |

### Frontend
| Layer | Technology |
|---|---|
| **Framework** | React 18 + Vite |
| **Styling** | Tailwind CSS |
| **Icons** | Lucide React |
| **Streaming** | EventSource API (SSE client) |
| **Fonts** | Plus Jakarta Sans + JetBrains Mono |

---

## 📊 Pipeline at a Glance

| Metric | Value |
|---|---|
| Number of Agents | 4 (Search, Reader, Writer, Critic) |
| Search Results per Query | 3 |
| Snippet Size per Result | 150 characters |
| Max Scraped Content | 1500 characters |
| Max Report Sent to Critic | 2000 characters |
| LLM Model | Gemini 2.5 Flash Lite |
| Streaming | Word-by-word via SSE |
| Average Pipeline Runtime | ~30–60 seconds |

---

## 🗂️ Project Structure

```
Multi-Agent-AI-Research-System/
│
├── agents.py                # LLM setup, agent builders, writer & critic chains
├── tools.py                 # web_search and scrape_url tool definitions
├── pipeline.py              # Orchestrates the full 4-step pipeline (CLI)
│
├── backend/
│   └── main.py              # FastAPI app — SSE streaming endpoint
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx          # Full React UI
│       └── App.css          # Custom animations and design system
│
├── .env                     # API keys — never pushed to GitHub
├── .env.example             # Safe placeholder template
├── .gitignore               # Ignores .env, .venv, __pycache__, node_modules
├── requirements.txt         # Python dependencies
└── README.md
```

---

## 🖥️ Frontend UI Features

- **Gradient hero section** — shimmer animated headline, floating color orbs, sample topic chips
- **Live pipeline tracker** — 4 nodes with connecting progress lines, idle → active (glowing) → done (green ✓)
- **Word-by-word streaming** — report streams token by token with a blinking cursor (ChatGPT style)
- **Tabbed result view** — Report / Critic Review / Sources tabs
- **Critic score ring** — dynamic color (green/orange/red based on score) with auto-extracted verdict
- **Collapsible source panels** — Search Results and Scraped Content
- **Download button** — saves the final report as `.txt`
- **Error handling** — styled error banner with backend message
- **Sticky frosted glass header** — with model and framework info chips

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- API keys for Tavily and Google AI Studio

---

### 1. Clone the repository
```bash
git clone https://github.com/mdhmrunal31/Multi-Agent-AI-Research-System.git
cd Multi-Agent-AI-Research-System
```

### 2. Create and activate virtual environment
```bash
python -m venv .venv

# Windows
.venv\Scripts\activate

# Mac / Linux
source .venv/bin/activate
```

### 3. Install Python dependencies
```bash
pip install -r requirements.txt
pip install fastapi uvicorn
```

### 4. Set up API keys

Copy `.env.example` to `.env` and fill in your keys:
```bash
cp .env.example .env
```

```env
TAVILY_API_KEY=your_tavily_key_here
GOOGLE_API_KEY=your_google_api_key_here
```

| Key | Get it from |
|---|---|
| `TAVILY_API_KEY` | [app.tavily.com](https://app.tavily.com) |
| `GOOGLE_API_KEY` | [aistudio.google.com](https://aistudio.google.com) |

### 5. Run the Backend — Terminal 1
```bash
uvicorn backend.main:app --reload --port 8000
```
Backend runs at `http://localhost:8000`

### 6. Run the Frontend — Terminal 2
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`

Open `http://localhost:5173` in your browser and enter any research topic.

---

## 🔐 Security

- `.env` is listed in `.gitignore` — never pushed to GitHub
- `node_modules/` is listed in `.gitignore` — never pushed to GitHub
- `.env.example` contains only placeholder values — safe to commit
- Always regenerate API keys if accidentally exposed in a public repository

---

## 🙋‍♂️ Author

**Mrunal Hadke**
Data Engineer & GenAI Enthusiast |
PG-DBDA, Sunbeam, CDAC Pune | B.Tech (Computer Technology), YCCE Nagpur

[LinkedIn](https://www.linkedin.com/in/mrunal-hadke-23b114241/) · [GitHub](https://github.com/mdhmrunal31)

---

*Built with LangGraph · LangChain · Google Gemini 2.5 Flash Lite · FastAPI · React · Vite · Tailwind CSS · Tavily*
