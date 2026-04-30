import streamlit as st
import time
from pipeline import run_research_pipeline

# ── Page Config ───────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="ResearchMind · Multi-Agent",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# ── Global CSS ────────────────────────────────────────────────────────────────
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=JetBrains+Mono:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

/* ── Root Variables ── */
:root {
    --bg:        #0a0c10;
    --surface:   #111318;
    --border:    #1e2330;
    --amber:     #f5a623;
    --amber-dim: #b37518;
    --text:      #e8eaf0;
    --muted:     #6b7280;
    --green:     #34d399;
    --blue:      #60a5fa;
    --red:       #f87171;
}

/* ── Global ── */
html, body, [class*="css"] {
    background-color: var(--bg) !important;
    color: var(--text) !important;
    font-family: 'DM Sans', sans-serif !important;
}

.stApp { background: var(--bg); }

/* ── Hide Streamlit chrome ── */
#MainMenu, footer, header { visibility: hidden; }
.block-container { padding: 2rem 3rem 4rem 3rem !important; max-width: 1200px; }

/* ── Hero Header ── */
.hero {
    text-align: center;
    padding: 3rem 0 2rem 0;
    border-bottom: 1px solid var(--border);
    margin-bottom: 2.5rem;
}
.hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 3.6rem;
    font-weight: 900;
    letter-spacing: -1px;
    background: linear-gradient(135deg, #f5a623 0%, #f9d06a 50%, #f5a623 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.1;
    margin-bottom: 0.5rem;
}
.hero-sub {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    color: var(--muted);
    letter-spacing: 3px;
    text-transform: uppercase;
}

/* ── Input Card ── */
.input-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 2rem 2.5rem;
    margin-bottom: 2rem;
}

/* ── Streamlit input overrides ── */
.stTextInput > div > div > input {
    background: #0d0f14 !important;
    border: 1px solid var(--border) !important;
    border-radius: 10px !important;
    color: var(--text) !important;
    font-family: 'DM Sans', sans-serif !important;
    font-size: 1rem !important;
    padding: 0.75rem 1rem !important;
    transition: border-color 0.2s;
}
.stTextInput > div > div > input:focus {
    border-color: var(--amber) !important;
    box-shadow: 0 0 0 3px rgba(245,166,35,0.12) !important;
}

/* ── Button ── */
.stButton > button {
    background: linear-gradient(135deg, #f5a623, #e8920f) !important;
    color: #0a0c10 !important;
    font-family: 'JetBrains Mono', monospace !important;
    font-weight: 600 !important;
    font-size: 0.85rem !important;
    letter-spacing: 1.5px !important;
    text-transform: uppercase !important;
    border: none !important;
    border-radius: 10px !important;
    padding: 0.65rem 2rem !important;
    width: 100% !important;
    transition: all 0.2s ease !important;
}
.stButton > button:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 8px 24px rgba(245,166,35,0.3) !important;
}

/* ── Pipeline Steps ── */
.pipeline-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
}
.step-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.2rem 1rem;
    text-align: center;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}
.step-card.active {
    border-color: var(--amber);
    box-shadow: 0 0 20px rgba(245,166,35,0.15);
}
.step-card.done {
    border-color: var(--green);
    box-shadow: 0 0 16px rgba(52,211,153,0.1);
}
.step-card.idle { opacity: 0.45; }
.step-icon { font-size: 1.8rem; margin-bottom: 0.4rem; }
.step-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
}
.step-card.active .step-label { color: var(--amber); }
.step-card.done  .step-label { color: var(--green); }

/* ── Result Panels ── */
.result-panel {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.8rem 2rem;
    margin-bottom: 1.5rem;
    animation: fadeSlide 0.4s ease;
}
@keyframes fadeSlide {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
}
.panel-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--border);
}
.panel-icon { font-size: 1.3rem; }
.panel-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text);
}
.panel-badge {
    margin-left: auto;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 0.25rem 0.7rem;
    border-radius: 999px;
    background: rgba(245,166,35,0.12);
    color: var(--amber);
    border: 1px solid var(--amber-dim);
}
.panel-badge.green {
    background: rgba(52,211,153,0.1);
    color: var(--green);
    border-color: rgba(52,211,153,0.3);
}

/* ── Report Display ── */
.report-body {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.97rem;
    line-height: 1.85;
    color: #d1d5db;
    white-space: pre-wrap;
}

/* ── Critic Score ── */
.score-ring {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    border: 3px solid var(--amber);
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 900;
    color: var(--amber);
    background: rgba(245,166,35,0.08);
    float: right;
    margin-left: 1rem;
}

/* ── Scrollable code area ── */
.scroll-box {
    background: #0d0f14;
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1rem 1.2rem;
    max-height: 320px;
    overflow-y: auto;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.78rem;
    line-height: 1.7;
    color: #9ca3af;
    white-space: pre-wrap;
}
.scroll-box::-webkit-scrollbar { width: 4px; }
.scroll-box::-webkit-scrollbar-track { background: transparent; }
.scroll-box::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

/* ── Status bar ── */
.status-bar {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.78rem;
    color: var(--amber);
    padding: 0.6rem 1rem;
    background: rgba(245,166,35,0.06);
    border: 1px solid rgba(245,166,35,0.2);
    border-radius: 8px;
    margin-bottom: 1.5rem;
    animation: pulse 1.5s ease-in-out infinite;
}
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }

/* ── Expander overrides ── */
.streamlit-expanderHeader {
    background: var(--surface) !important;
    border: 1px solid var(--border) !important;
    border-radius: 10px !important;
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 0.8rem !important;
    color: var(--muted) !important;
}
</style>
""", unsafe_allow_html=True)

# ── Hero ──────────────────────────────────────────────────────────────────────
st.markdown("""
<div class="hero">
    <div class="hero-title">ResearchMind</div>
    <div class="hero-sub">⬡ Multi-Agent Intelligence Pipeline · Powered by Mistral</div>
</div>
""", unsafe_allow_html=True)

# ── Input Card ────────────────────────────────────────────────────────────────
st.markdown('<div class="input-card">', unsafe_allow_html=True)
col1, col2 = st.columns([5, 1])
with col1:
    topic = st.text_input(
        "",
        placeholder="e.g.  Impact of LLMs on software engineering jobs in 2025",
        label_visibility="collapsed",
    )
with col2:
    st.markdown("<br>", unsafe_allow_html=True)
    run = st.button("▶ RUN", use_container_width=True)
st.markdown('</div>', unsafe_allow_html=True)

# ── Pipeline Steps Tracker ────────────────────────────────────────────────────
def render_steps(active: int, done: list):
    steps = [
        ("🔍", "Search Agent"),
        ("📄", "Reader Agent"),
        ("✍️", "Writer Chain"),
        ("🧐", "Critic Chain"),
    ]
    cards = ""
    for i, (icon, label) in enumerate(steps):
        if i in done:
            cls = "done"
        elif i == active:
            cls = "active"
        else:
            cls = "idle"
        cards += f"""
        <div class="step-card {cls}">
            <div class="step-icon">{icon}</div>
            <div class="step-label">{label}</div>
        </div>"""
    st.markdown(f'<div class="pipeline-grid">{cards}</div>', unsafe_allow_html=True)

# ── Main Logic ────────────────────────────────────────────────────────────────
if run and topic.strip():

    state = {}
    done_steps = []

    # ── Step 1 : Search Agent ─────────────────────────────────────────────────
    render_steps(active=0, done=[])
    st.markdown('<div class="status-bar">⬡ &nbsp; Search agent is scouring the web...</div>', unsafe_allow_html=True)

    from agents import build_search_agent
    search_agent = build_search_agent()
    search_result = search_agent.invoke({
        "messages": [("user", f"Find recent, reliable and detailed information about: {topic}")]
    })
    state["search_results"] = search_result["messages"][-1].content
    done_steps.append(0)

    # ── Step 2 : Reader Agent ─────────────────────────────────────────────────
    render_steps(active=1, done=done_steps)
    st.markdown('<div class="status-bar">⬡ &nbsp; Reader agent is scraping top resources...</div>', unsafe_allow_html=True)

    from agents import build_reader_agent
    reader_agent = build_reader_agent()
    reader_result = reader_agent.invoke({
        "messages": [("user",
            f"Based on the following search results about '{topic}', "
            f"pick the most relevant URL and scrape it for deeper content.\n\n"
            f"Search Results:\n{state['search_results'][:800]}"
        )]
    })
    state["scraped_content"] = reader_result["messages"][-1].content
    done_steps.append(1)

    # ── Step 3 : Writer ───────────────────────────────────────────────────────
    render_steps(active=2, done=done_steps)
    st.markdown('<div class="status-bar">⬡ &nbsp; Writer is crafting the research report...</div>', unsafe_allow_html=True)

    from agents import writer_chain
    research_combined = (
        f"SEARCH RESULTS:\n{state['search_results']}\n\n"
        f"DETAILED SCRAPED CONTENT:\n{state['scraped_content']}"
    )
    state["report"] = writer_chain.invoke({"topic": topic, "research": research_combined})
    done_steps.append(2)

    # ── Step 4 : Critic ───────────────────────────────────────────────────────
    render_steps(active=3, done=done_steps)
    st.markdown('<div class="status-bar">⬡ &nbsp; Critic is reviewing the report...</div>', unsafe_allow_html=True)

    from agents import critic_chain
    state["feedback"] = critic_chain.invoke({"report": state["report"]})
    done_steps.append(3)

    # ── All done ──────────────────────────────────────────────────────────────
    render_steps(active=-1, done=done_steps)
    st.success("✅  Pipeline complete — all agents finished successfully.")

    st.markdown("---")

    # ── Search Results Panel ──────────────────────────────────────────────────
    st.markdown("""
    <div class="result-panel">
        <div class="panel-header">
            <span class="panel-icon">🔍</span>
            <span class="panel-title">Search Results</span>
            <span class="panel-badge">Agent 1</span>
        </div>
    </div>
    """, unsafe_allow_html=True)
    with st.expander("View raw search output", expanded=False):
        st.markdown(f'<div class="scroll-box">{state["search_results"]}</div>', unsafe_allow_html=True)

    # ── Scraped Content Panel ─────────────────────────────────────────────────
    st.markdown("""
    <div class="result-panel">
        <div class="panel-header">
            <span class="panel-icon">📄</span>
            <span class="panel-title">Scraped Content</span>
            <span class="panel-badge">Agent 2</span>
        </div>
    </div>
    """, unsafe_allow_html=True)
    with st.expander("View raw scraped content", expanded=False):
        st.markdown(f'<div class="scroll-box">{state["scraped_content"]}</div>', unsafe_allow_html=True)

    # ── Report Panel ──────────────────────────────────────────────────────────
    st.markdown("""
    <div class="result-panel">
        <div class="panel-header">
            <span class="panel-icon">✍️</span>
            <span class="panel-title">Research Report</span>
            <span class="panel-badge green">Writer</span>
        </div>
    </div>
    """, unsafe_allow_html=True)

    st.markdown(
        f'<div class="result-panel"><div class="report-body">{state["report"]}</div></div>',
        unsafe_allow_html=True
    )

    # Download button
    st.download_button(
        label="⬇  Download Report (.txt)",
        data=state["report"],
        file_name=f"report_{topic[:30].replace(' ','_')}.txt",
        mime="text/plain",
    )

    # ── Critic Panel ──────────────────────────────────────────────────────────
    st.markdown("""
    <div class="result-panel">
        <div class="panel-header">
            <span class="panel-icon">🧐</span>
            <span class="panel-title">Critic Review</span>
            <span class="panel-badge">Critic</span>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # Extract score
    score_line = ""
    for line in state["feedback"].splitlines():
        if line.lower().startswith("score"):
            score_line = line.replace("Score:", "").replace("score:", "").strip()
            break

    if score_line:
        st.markdown(f"""
        <div class="result-panel">
            <div class="score-ring">{score_line}</div>
            <div class="report-body">{state["feedback"]}</div>
        </div>
        """, unsafe_allow_html=True)
    else:
        st.markdown(
            f'<div class="result-panel"><div class="report-body">{state["feedback"]}</div></div>',
            unsafe_allow_html=True
        )

elif run and not topic.strip():
    st.warning("⚠️  Please enter a research topic before running.")

# ── Footer ────────────────────────────────────────────────────────────────────
st.markdown("""
<div style="text-align:center; margin-top:4rem; padding-top:1.5rem;
     border-top:1px solid #1e2330; font-family:'JetBrains Mono',monospace;
     font-size:0.7rem; color:#374151; letter-spacing:2px;">
    RESEARCHMIND &nbsp;·&nbsp; MULTI-AGENT PIPELINE &nbsp;·&nbsp; MISTRAL VIA OPENROUTER
</div>
""", unsafe_allow_html=True)