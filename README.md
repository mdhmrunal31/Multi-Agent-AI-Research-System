# 🧠 Multi-Agent AI Research System

An autonomous multi-agent AI pipeline that searches the web, reads sources, writes structured research reports, and critiques them — all in one click.

> Enter any research topic → Get a full structured report with a quality score in minutes.

---

## 📌 Overview

**ResearchMind** is a multi-agent AI system built using **LangGraph** and **LangChain LCEL**. It orchestrates 4 specialized AI agents and chains that work in sequence to autonomously research any topic and produce a professional report — without any manual effort.

- 🔍 **4 AI agents** working in a sequential pipeline
- 🌐 **Live web search** via Tavily API (top 3 results per query)
- 📄 **Deep content scraping** from the most relevant source
- ✍️ **Structured report generation** with Introduction, Key Findings, Conclusion and Sources
- 🧐 **Automated critique** with a Score out of 10, Strengths, and Areas to Improve
- 💻 **Streamlit UI** with real-time step tracking and report download

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
     📊 Final Report + Critique
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

| Layer | Technology |
|---|---|
| **LLM** | Google Gemini 2.5 Flash Lite (Google AI Studio) |
| **Agent Framework** | LangGraph — `create_react_agent` |
| **Chain Framework** | LangChain LCEL — `ChatPromptTemplate` + `StrOutputParser` |
| **Web Search** | Tavily Search API |
| **Web Scraping** | BeautifulSoup4 + Requests |
| **UI** | Streamlit |
| **Environment** | Python-dotenv |

---

## 📊 Pipeline at a Glance

| Metric | Value |
|---|---|
| Number of Agents | 4 (Search, Reader, Writer, Critic) |
| Search Results per Query | 3 |
| Snippet Size per Result | 150 characters |
| Max Scraped Content | 1500 characters |
| Max Research Sent to Writer | ~1500 characters combined |
| Max Report Sent to Critic | 2000 characters |
| LLM Model | Gemini 2.5 Flash Lite |
| Average Pipeline Runtime | ~30–60 seconds |

---

## 🗂️ Project Structure

```
Multi-Agent-AI-Research-System/
│
├── agents.py            # LLM setup, agent builders, writer & critic chains
├── tools.py             # web_search and scrape_url tool definitions
├── pipeline.py          # Orchestrates the full 4-step pipeline
├── app.py               # Streamlit UI
│
├── .env                 # API keys — never pushed to GitHub
├── .env.example         # Safe placeholder template
├── .gitignore           # Ignores .env, .venv, __pycache__
├── requirements.txt     # All Python dependencies
└── README.md
```

---

## 🖥️ Streamlit UI

- Dark editorial design with real-time pipeline step cards (idle → active → done)
- Animated status bar showing what each agent is doing
- Collapsible panels for Search Results, Scraped Content, Report and Critic Review
- Critic score displayed in a circular badge (auto-extracted from output)
- One-click report download as `.txt`

---

## 🚀 Getting Started

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

### 3. Install dependencies
```bash
pip install -r requirements.txt
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

### 5. Run the app
```bash
streamlit run app.py
```

Open `http://localhost:8501` in your browser and enter any research topic.

---

## 🔐 Security

- `.env` is listed in `.gitignore` — never pushed to GitHub
- `.env.example` contains only placeholder values — safe to commit
- Always regenerate API keys if accidentally exposed in a public repository

---

## 🙋‍♂️ Author

**Mrunal Hadke**  
Aspiring Data Engineer | GenAI | Python | SQL  

PG-DBDA, CDAC Pune | B.Tech (Computer Technology), YCCE Nagpur  

[LinkedIn](https://www.linkedin.com/in/mrunal-hadke-23b114241/) · [GitHub](https://github.com/mdhmrunal31)

---

*Building scalable data pipelines and AI-powered applications using LangChain, LangGraph, and modern LLM tools.*
