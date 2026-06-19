import { useState, useRef, useCallback } from 'react'
import {
  Search, FileText, PenLine, Gauge, Download, ChevronDown,
  AlertTriangle, ArrowRight, Sparkles,
} from 'lucide-react'

const NODES = [
  { key: 'search', label: 'Search Agent', sub: 'web_search · Tavily', icon: Search },
  { key: 'reader', label: 'Reader Agent', sub: 'scrape_url · BS4', icon: FileText },
  { key: 'writer', label: 'Writer Chain', sub: 'Gemini 2.5 Flash Lite', icon: PenLine },
  { key: 'critic', label: 'Critic Chain', sub: 'Gemini 2.5 Flash Lite', icon: Gauge },
]

const SAMPLE_TOPICS = [
  'Quantum computing in 2026',
  'The rise of agentic AI systems',
  'Carbon capture breakthroughs',
  'Future of remote work',
]

// Adjust this to match your backend/main.py SSE route + payload shape.
const API_BASE = '/api/research/stream'

function ScoreRing({ score = 0, size = 96 }) {
  const radius = (size - 10) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.max(0, Math.min(10, score)) / 10
  const offset = circumference * (1 - pct)
  const color = score >= 7 ? '#7FFFD4' : score >= 4 ? '#F5A623' : '#FF6B6B'

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#232A38" strokeWidth="6" fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color} strokeWidth="6" fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.4s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-xl font-semibold" style={{ color }}>{score.toFixed(1)}</span>
        <span className="text-[10px] text-muted tracking-wide">/ 10</span>
      </div>
    </div>
  )
}

function PipelineTracker({ status }) {
  return (
    <div className="flex items-stretch w-full">
      {NODES.map((node, i) => {
        const state = status[node.key] || 'idle'
        const Icon = node.icon
        return (
          <div key={node.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2 min-w-[110px]">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500
                  ${state === 'done' ? 'bg-signal/10 border-signal text-signal' : ''}
                  ${state === 'active' ? 'bg-amber/10 border-amber text-amber animate-pulse2' : ''}
                  ${state === 'idle' ? 'bg-panel2 border-line text-muted' : ''}`}
              >
                <Icon size={18} strokeWidth={2} />
              </div>
              <div className="text-center">
                <p className={`text-[12px] font-semibold ${state === 'idle' ? 'text-muted' : 'text-fog'}`}>{node.label}</p>
                <p className="text-[10px] text-muted font-mono">{node.sub}</p>
              </div>
            </div>
            {i < NODES.length - 1 && (
              <div className="flex-1 h-[2px] mx-1 -mt-7 bg-line relative overflow-hidden rounded-full">
                <div
                  className="absolute inset-y-0 left-0 bg-signal transition-all duration-700 ease-out"
                  style={{ width: state === 'done' ? '100%' : status[NODES[i + 1].key] !== 'idle' ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function Collapsible({ title, count, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-line rounded-xl overflow-hidden bg-panel2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left focus-ring"
      >
        <span className="text-sm font-semibold text-fog">
          {title} {typeof count === 'number' && <span className="text-muted font-mono">({count})</span>}
        </span>
        <ChevronDown size={16} className={`text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}

export default function App() {
  const [topic, setTopic] = useState('')
  const [running, setRunning] = useState(false)
  const [error, setError] = useState(null)
  const [status, setStatus] = useState({ search: 'idle', reader: 'idle', writer: 'idle', critic: 'idle' })
  const [report, setReport] = useState('')
  const [critique, setCritique] = useState(null)
  const [sources, setSources] = useState({ search: [], scraped: '' })
  const [activeTab, setActiveTab] = useState('report')
  const esRef = useRef(null)

  const reset = () => {
    setError(null)
    setReport('')
    setCritique(null)
    setSources({ search: [], scraped: '' })
    setStatus({ search: 'idle', reader: 'idle', writer: 'idle', critic: 'idle' })
    setActiveTab('report')
  }

  const runPipeline = useCallback((topicValue) => {
    if (!topicValue.trim() || running) return
    reset()
    setRunning(true)

    const url = `${API_BASE}?topic=${encodeURIComponent(topicValue)}`
    const es = new EventSource(url)
    esRef.current = es

    es.addEventListener('node', (e) => {
      const { key, state } = JSON.parse(e.data)
      setStatus((prev) => ({ ...prev, [key]: state }))
    })

    es.addEventListener('sources', (e) => {
      setSources((prev) => ({ ...prev, ...JSON.parse(e.data) }))
    })

    es.addEventListener('token', (e) => {
      const { word } = JSON.parse(e.data)
      setReport((prev) => prev + word)
    })

    es.addEventListener('critique', (e) => {
      setCritique(JSON.parse(e.data))
    })

    es.addEventListener('done', () => {
      setRunning(false)
      es.close()
    })

    es.addEventListener('error_event', (e) => {
      try {
        const { message } = JSON.parse(e.data)
        setError(message || 'Something went wrong while running the pipeline.')
      } catch {
        setError('Something went wrong while running the pipeline.')
      }
      setRunning(false)
      es.close()
    })

    es.onerror = () => {
      if (running) setError('Connection to the research backend was lost.')
      setRunning(false)
      es.close()
    }
  }, [running])

  const handleSubmit = (e) => {
    e.preventDefault()
    runPipeline(topic)
  }

  const handleDownload = () => {
    const blob = new Blob([report], { type: 'text/plain' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${topic.trim().replace(/\s+/g, '-').toLowerCase() || 'report'}.txt`
    link.click()
  }

  const scoreColor = critique?.score >= 7 ? 'text-signal' : critique?.score >= 4 ? 'text-amber' : 'text-coral'

  return (
    <div className="min-h-screen bg-ink relative overflow-x-hidden">
      <div className="grain" />

      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-line">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-signal" />
            <span className="font-mono font-semibold text-fog tracking-tight">ResearchMind</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-muted">
            <span className="px-2 py-1 rounded-full border border-line bg-panel2">LangGraph</span>
            <span className="px-2 py-1 rounded-full border border-line bg-panel2">LangChain LCEL</span>
            <span className="px-2 py-1 rounded-full border border-line bg-panel2">Gemini 2.5 Flash Lite</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-6 pt-16 pb-10">
        <div className="absolute -top-10 right-10 w-64 h-64 rounded-full bg-signal/10 blur-3xl animate-float pointer-events-none" />
        <div className="absolute top-20 left-0 w-48 h-48 rounded-full bg-amber/10 blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }} />

        <p className="font-mono text-xs text-signal tracking-[0.2em] mb-4">FOUR AGENTS · ONE PIPELINE · ONE REPORT</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight mb-5">
          <span className="text-gradient animate-shimmer">Give it a topic.</span>
          <br />
          <span className="text-fog">Watch the research happen.</span>
        </h1>
        <p className="text-muted max-w-xl mb-8 leading-relaxed">
          Search Agent finds sources, Reader Agent scrapes the best one, Writer Chain drafts a structured
          report, and Critic Chain scores it — streamed word by word as it's written.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-2xl">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a research topic…"
            className="flex-1 bg-panel border border-line rounded-xl px-4 py-3 text-fog placeholder:text-muted focus-ring outline-none font-mono text-sm"
          />
          <button
            type="submit"
            disabled={running || !topic.trim()}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-signal text-ink font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition focus-ring"
          >
            {running ? 'Researching…' : 'Run pipeline'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="flex flex-wrap gap-2 mt-4">
          {SAMPLE_TOPICS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setTopic(t); runPipeline(t) }}
              disabled={running}
              className="text-xs font-mono px-3 py-1.5 rounded-full border border-line text-muted hover:text-signal hover:border-signal/50 transition disabled:opacity-40 focus-ring"
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      {/* Error banner */}
      {error && (
        <div className="max-w-6xl mx-auto px-6 mb-6">
          <div className="flex items-start gap-3 bg-coral/10 border border-coral/40 rounded-xl px-4 py-3">
            <AlertTriangle size={18} className="text-coral mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-coral">The pipeline stopped</p>
              <p className="text-xs text-muted font-mono mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Pipeline tracker */}
      {(running || report) && (
        <section className="max-w-6xl mx-auto px-6 mb-8">
          <div className="bg-panel border border-line rounded-2xl p-6">
            <PipelineTracker status={status} />
          </div>
        </section>
      )}

      {/* Results */}
      {(report || running) && (
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="bg-panel border border-line rounded-2xl overflow-hidden">
            {/* Tabs */}
            <div className="flex items-center justify-between border-b border-line px-2">
              <div className="flex">
                {[
                  { key: 'report', label: 'Report' },
                  { key: 'critic', label: 'Critic Review' },
                  { key: 'sources', label: 'Sources' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-3 text-sm font-semibold border-b-2 transition focus-ring
                      ${activeTab === tab.key ? 'text-signal border-signal' : 'text-muted border-transparent hover:text-fog'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              {report && !running && (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 mr-2 rounded-lg border border-line text-muted hover:text-signal hover:border-signal/50 transition focus-ring"
                >
                  <Download size={14} /> .txt
                </button>
              )}
            </div>

            <div className="p-6">
              {activeTab === 'report' && (
                <div className="font-mono text-sm leading-relaxed text-fog whitespace-pre-wrap">
                  {report || <span className="text-muted">Waiting for the writer chain to start…</span>}
                  {running && <span className="inline-block w-2 h-4 bg-signal ml-0.5 animate-blink align-text-bottom" />}
                </div>
              )}

              {activeTab === 'critic' && (
                <div>
                  {critique ? (
                    <div className="flex flex-col sm:flex-row gap-8">
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        <ScoreRing score={critique.score ?? 0} />
                        <span className={`text-xs font-mono font-semibold ${scoreColor}`}>{critique.verdict}</span>
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <p className="text-xs font-mono text-signal mb-1 tracking-wide">STRENGTHS</p>
                          <p className="text-sm text-fog leading-relaxed">{critique.strengths}</p>
                        </div>
                        <div>
                          <p className="text-xs font-mono text-amber mb-1 tracking-wide">AREAS TO IMPROVE</p>
                          <p className="text-sm text-fog leading-relaxed">{critique.areas_to_improve}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted text-sm font-mono">The critic chain hasn't reviewed this report yet.</p>
                  )}
                </div>
              )}

              {activeTab === 'sources' && (
                <div className="space-y-3">
                  <Collapsible title="Search results" count={sources.search.length} defaultOpen>
                    <ul className="space-y-3">
                      {sources.search.map((s, i) => (
                        <li key={i} className="text-sm">
                          <a href={s.url} target="_blank" rel="noreferrer" className="text-signal hover:underline font-semibold">{s.title}</a>
                          <p className="text-muted text-xs mt-1 font-mono">{s.snippet}</p>
                        </li>
                      ))}
                      {sources.search.length === 0 && <p className="text-muted text-sm font-mono">No results yet.</p>}
                    </ul>
                  </Collapsible>
                  <Collapsible title="Scraped content">
                    <p className="text-sm text-fog font-mono leading-relaxed whitespace-pre-wrap">
                      {sources.scraped || 'No scraped content yet.'}
                    </p>
                  </Collapsible>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <footer className="max-w-6xl mx-auto px-6 py-8 border-t border-line text-center">
        <p className="text-xs font-mono text-muted">
          Built with LangGraph · LangChain · Gemini 2.5 Flash Lite · FastAPI · React · Vite · Tailwind · Tavily
        </p>
      </footer>
    </div>
  )
}
