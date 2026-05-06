import { useState, useRef, useEffect } from 'react'
import {
  Search, Globe, PenLine, Star, Download, ChevronDown,
  ChevronUp, Zap, CheckCircle2, Loader2, AlertCircle,
  Brain, Sparkles, ArrowRight
} from 'lucide-react'

// ── Constants ────────────────────────────────────────────────────────────────
const STEPS = [
  { icon: Search,  label: 'Search Agent',  desc: 'Scanning the web',      color: '#a78bfa' },
  { icon: Globe,   label: 'Reader Agent',  desc: 'Scraping top source',   color: '#22d3ee' },
  { icon: PenLine, label: 'Writer Chain',  desc: 'Drafting report',       color: '#fb923c' },
  { icon: Star,    label: 'Critic Chain',  desc: 'Reviewing & scoring',   color: '#f472b6' },
]

const SAMPLE_TOPICS = [
  'Impact of AI on software engineering jobs in 2025',
  'Latest breakthroughs in quantum computing',
  'Future of electric vehicles and battery technology',
  'Rise of agentic AI systems in enterprise',
]

// ── Helpers ──────────────────────────────────────────────────────────────────
function extractScore(feedback) {
  for (const line of feedback.split('\n')) {
    if (line.toLowerCase().startsWith('score')) {
      const raw = line.split(':')[1]?.trim() || ''
      return raw.split('/')[0].trim()
    }
  }
  return '—'
}

function extractVerdict(feedback) {
  const idx = feedback.toLowerCase().indexOf('one line verdict')
  if (idx === -1) return ''
  const after = feedback.slice(idx).split(':')
  if (after.length > 1) return after[1].trim().split('\n')[0].trim()
  return ''
}

// ── Sub-components ───────────────────────────────────────────────────────────

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50"
      style={{ background: 'rgba(7,8,16,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #1e2340' }}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
            <Brain size={16} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.3px' }}>
            Research<span style={{ color: '#8b5cf6' }}>Mind</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="chip chip-purple hidden sm:inline-flex">
            <Zap size={10} /> Multi-Agent
          </span>
          <span className="chip chip-cyan hidden sm:inline-flex">
            Gemini 2.5 Flash Lite
          </span>
        </div>
      </div>
    </header>
  )
}

function HeroSection({ topic, setTopic, onRun, isRunning }) {
  const [focused, setFocused] = useState(false)

  return (
    <section className="relative pt-32 pb-16 px-6 overflow-hidden mesh-bg">
      {/* Orbs */}
      <div className="orb orb-purple" style={{ width: 500, height: 500, top: -100, left: -100 }} />
      <div className="orb orb-cyan"   style={{ width: 400, height: 400, top: 50, right: -80 }} />
      <div className="orb orb-orange" style={{ width: 300, height: 300, bottom: -80, left: '40%' }} />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        {/* Tag */}
        <div className="inline-flex items-center gap-2 mb-6 chip chip-purple"
          style={{ fontSize: '0.72rem', padding: '6px 14px' }}>
          <Sparkles size={11} />
          4-Agent Autonomous Research Pipeline
        </div>

        {/* Headline */}
        <h1 style={{
          fontWeight: 800,
          fontSize: 'clamp(2.4rem, 6vw, 4rem)',
          lineHeight: 1.08,
          letterSpacing: '-2px',
          marginBottom: '1.2rem',
        }}>
          Research anything,{' '}
          <span className="gradient-text">instantly.</span>
        </h1>

        <p style={{
          color: '#5a6480',
          fontSize: '1.05rem',
          lineHeight: 1.7,
          marginBottom: '2.5rem',
          maxWidth: '560px',
          margin: '0 auto 2.5rem',
        }}>
          Enter any topic — 4 AI agents search the web, scrape sources,
          write a structured report, and critique it. Automatically.
        </p>

        {/* Input */}
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <input
            className="research-input"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={e => e.key === 'Enter' && !isRunning && topic.trim() && onRun()}
            placeholder="e.g.  Impact of LLMs on software engineering jobs in 2025"
            disabled={isRunning}
            style={{ paddingRight: '160px' }}
          />
          <button
            className="run-btn"
            onClick={onRun}
            disabled={isRunning || !topic.trim()}
            style={{
              position: 'absolute', right: 6, top: '50%',
              transform: 'translateY(-50%)',
              padding: '10px 22px', fontSize: '0.82rem',
            }}
          >
            {isRunning
              ? <><Loader2 size={14} className="animate-spin" /> Running...</>
              : <><ArrowRight size={14} /> Run Pipeline</>
            }
          </button>
        </div>

        {/* Sample topics */}
        <div className="flex flex-wrap gap-2 justify-center" style={{ marginTop: '1rem' }}>
          {SAMPLE_TOPICS.map(t => (
            <button
              key={t}
              onClick={() => !isRunning && setTopic(t)}
              disabled={isRunning}
              style={{
                background: '#0d0f1a',
                border: '1px solid #1e2340',
                borderRadius: 999,
                color: '#5a6480',
                fontSize: '0.72rem',
                padding: '5px 12px',
                cursor: isRunning ? 'default' : 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
              onMouseEnter={e => { if (!isRunning) { e.target.style.borderColor='#7c3aed'; e.target.style.color='#a78bfa'; }}}
              onMouseLeave={e => { e.target.style.borderColor='#1e2340'; e.target.style.color='#5a6480'; }}
            >
              {t.length > 40 ? t.slice(0, 40) + '…' : t}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function PipelineTracker({ activeStep, doneSteps, isRunning }) {
  if (activeStep === -1 && doneSteps.length === 0) return null

  return (
    <div className="fade-up max-w-4xl mx-auto px-6 py-8">
      <div className="gradient-border p-6" style={{ background: '#0d0f1a' }}>
        <div className="flex items-center gap-3 mb-6">
          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#8892aa', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}>
            Pipeline Status
          </span>
          {isRunning && (
            <span className="chip chip-purple" style={{ fontSize: '0.65rem' }}>
              <Loader2 size={9} className="animate-spin" /> Live
            </span>
          )}
          {!isRunning && doneSteps.length === 4 && (
            <span className="chip chip-green" style={{ fontSize: '0.65rem' }}>
              <CheckCircle2 size={9} /> Complete
            </span>
          )}
        </div>

        {/* Steps */}
        <div className="flex items-center gap-0">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            const isDone   = doneSteps.includes(i)
            const isActive = activeStep === i

            return (
              <div key={i} className="flex items-center" style={{ flex: i < STEPS.length - 1 ? 1 : 'none' }}>
                {/* Node */}
                <div className="flex flex-col items-center gap-2" style={{ minWidth: 80 }}>
                  <div
                    className={isActive ? 'step-active' : ''}
                    style={{
                      width: 52, height: 52,
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `2px solid ${isDone ? step.color : isActive ? step.color : '#252a45'}`,
                      background: isDone
                        ? `${step.color}18`
                        : isActive
                          ? `${step.color}12`
                          : '#131628',
                      transition: 'all 0.4s',
                    }}
                  >
                    {isDone
                      ? <CheckCircle2 size={20} color={step.color} />
                      : isActive
                        ? <Loader2 size={20} color={step.color} className="animate-spin" />
                        : <Icon size={20} color="#3a4060" />
                    }
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '0.75rem', fontWeight: 700,
                      color: isDone ? step.color : isActive ? step.color : '#3a4060',
                      transition: 'color 0.3s',
                    }}>
                      {step.label}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#3a4060', marginTop: 2 }}>
                      {step.desc}
                    </div>
                  </div>
                </div>

                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div style={{
                    flex: 1, height: 2, marginBottom: 28, position: 'relative',
                    background: '#1e2340', borderRadius: 2, overflow: 'hidden',
                  }}>
                    {(isDone || doneSteps.includes(i)) && (
                      <div className="line-fill" style={{
                        position: 'absolute', top: 0, left: 0, height: '100%',
                        background: `linear-gradient(90deg, ${step.color}, ${STEPS[i+1].color})`,
                        borderRadius: 2,
                      }} />
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ReportPanel({ report, isStreaming }) {
  const endRef = useRef(null)

  useEffect(() => {
    if (isStreaming) endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [report, isStreaming])

  return (
    <div className="gradient-border" style={{ background: '#0d0f1a' }}>
      <div style={{ padding: '1.8rem 2rem' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.6rem', letterSpacing: '3px',
              textTransform: 'uppercase', color: '#3a4060', marginBottom: 6,
            }}>
              Research Report
            </div>
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#e2e8f8' }}>
              Full Structured Report
            </h2>
          </div>
          <span className="chip chip-orange">
            <PenLine size={10} /> Writer
          </span>
        </div>

        <div style={{
          background: '#070810',
          border: '1px solid #1e2340',
          borderRadius: 12,
          padding: '1.5rem',
          minHeight: 200,
          maxHeight: 520,
          overflowY: 'auto',
        }}>
          <p
            className={isStreaming ? 'cursor' : ''}
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '0.9rem',
              lineHeight: 1.9,
              color: '#c0c8e0',
              whiteSpace: 'pre-wrap',
            }}
          >
            {report || (
              <span style={{ color: '#3a4060' }}>
                Report will appear here once the Writer agent completes…
              </span>
            )}
          </p>
          <div ref={endRef} />
        </div>
      </div>
    </div>
  )
}

function CriticPanel({ feedback }) {
  const score   = extractScore(feedback)
  const verdict = extractVerdict(feedback)

  const scoreNum = parseFloat(score)
  const color = scoreNum >= 8 ? '#34d399' : scoreNum >= 6 ? '#fb923c' : '#f87171'

  return (
    <div className="gradient-border fade-up" style={{ background: '#0d0f1a' }}>
      <div style={{ padding: '1.8rem 2rem' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.6rem', letterSpacing: '3px',
              textTransform: 'uppercase', color: '#3a4060', marginBottom: 6,
            }}>
              Critic Review
            </div>
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#e2e8f8' }}>
              Quality Assessment
            </h2>
          </div>
          <span className="chip chip-purple">
            <Star size={10} /> Critic
          </span>
        </div>

        {/* Score + Verdict */}
        <div className="flex items-center gap-5 mb-5 p-4"
          style={{ background: '#131628', borderRadius: 14, border: '1px solid #1e2340' }}>
          {/* Score ring */}
          <div className="score-ring flex-shrink-0"
            style={{ width: 80, height: 80, '--ring-color': color }}>
            <div className="score-ring-inner">
              <span style={{ fontWeight: 800, fontSize: '1.5rem', color }}>
                {score}
              </span>
              <span style={{
                fontSize: '0.6rem', color: '#3a4060',
                fontFamily: 'JetBrains Mono, monospace',
              }}>/ 10</span>
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#e2e8f8', marginBottom: 6, lineHeight: 1.5 }}>
              {verdict || 'Report evaluated successfully.'}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="chip chip-green" style={{ fontSize: '0.65rem' }}>
                <CheckCircle2 size={9} /> Review Complete
              </span>
            </div>
          </div>
        </div>

        {/* Full feedback */}
        <div className="scroll-area">
          {feedback}
        </div>
      </div>
    </div>
  )
}

function CollapsiblePanel({ title, icon: Icon, badge, badgeClass, content, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="gradient-border fade-up" style={{ background: '#0d0f1a' }}>
      <button
        className="w-full"
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '1.2rem 1.8rem', background: 'transparent',
          border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
        }}
      >
        <Icon size={16} color="#5a6480" />
        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#8892aa', flex: 1 }}>
          {title}
        </span>
        <span className={`chip ${badgeClass}`} style={{ fontSize: '0.65rem' }}>
          {badge}
        </span>
        {open
          ? <ChevronUp size={16} color="#3a4060" />
          : <ChevronDown size={16} color="#3a4060" />
        }
      </button>
      {open && (
        <div style={{ padding: '0 1.8rem 1.5rem' }}>
          <div className="scroll-area">{content}</div>
        </div>
      )}
    </div>
  )
}

function ResultsSection({ report, isStreaming, feedback, searchResults, scrapedContent, topic, isRunning, doneSteps }) {
  const [activeTab, setActiveTab] = useState('report')

  const showReport   = report.length > 0
  const showCritic   = doneSteps.includes(3) && feedback
  const showRawPanels = doneSteps.length > 0

  if (!showReport && !showRawPanels) return null

  const tabs = [
    { id: 'report',  label: '✍️  Report',        show: showReport  },
    { id: 'critic',  label: '🧐  Critic Review',  show: showCritic  },
    { id: 'sources', label: '🔍  Sources',         show: showRawPanels },
  ]

  return (
    <section className="max-w-4xl mx-auto px-6 pb-24">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-5">
        <div style={{
          flex: 1, height: 1,
          background: 'linear-gradient(90deg, #7c3aed33, transparent)',
        }} />
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem',
          letterSpacing: '3px', textTransform: 'uppercase', color: '#3a4060',
        }}>
          Results
        </span>
        <div style={{
          flex: 1, height: 1,
          background: 'linear-gradient(90deg, transparent, #06b6d433)',
        }} />
      </div>

      {/* Download button */}
      {showReport && !isStreaming && (
        <div className="flex justify-end mb-4">
          <a
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(report)}`}
            download={`report_${topic.slice(0, 30).replace(/ /g, '_')}.txt`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '9px 18px',
              background: '#131628',
              border: '1px solid #252a45',
              borderRadius: 10,
              color: '#8892aa',
              fontSize: '0.78rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s',
              fontFamily: 'JetBrains Mono, monospace',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#7c3aed'; e.currentTarget.style.color='#a78bfa'; e.currentTarget.style.background='rgba(124,58,237,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='#252a45'; e.currentTarget.style.color='#8892aa'; e.currentTarget.style.background='#131628'; }}
          >
            <Download size={13} />
            Download Report
          </a>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-5 p-1"
        style={{ background: '#0d0f1a', borderRadius: 14, border: '1px solid #1e2340', width: 'fit-content' }}>
        {tabs.filter(t => t.show).map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="space-y-4">
        {activeTab === 'report' && showReport && (
          <ReportPanel report={report} isStreaming={isStreaming} />
        )}

        {activeTab === 'critic' && showCritic && (
          <CriticPanel feedback={feedback} />
        )}

        {activeTab === 'sources' && showRawPanels && (
          <div className="space-y-3">
            {searchResults && (
              <CollapsiblePanel
                title="Search Results"
                icon={Search}
                badge="Tavily API · 3 results"
                badgeClass="chip-purple"
                content={searchResults}
                defaultOpen={true}
              />
            )}
            {scrapedContent && (
              <CollapsiblePanel
                title="Scraped Web Content"
                icon={Globe}
                badge="BeautifulSoup4"
                badgeClass="chip-cyan"
                content={scrapedContent}
                defaultOpen={true}
              />
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function ErrorBanner({ message, onDismiss }) {
  return (
    <div className="max-w-4xl mx-auto px-6 mb-6 fade-up">
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: '14px 18px',
        background: 'rgba(248,113,113,0.07)',
        border: '1px solid rgba(248,113,113,0.25)',
        borderRadius: 12,
        color: '#f87171',
      }}>
        <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 4 }}>Pipeline Error</div>
          <div style={{ fontSize: '0.78rem', fontFamily: 'JetBrains Mono, monospace', opacity: 0.8 }}>
            {message}
          </div>
        </div>
        <button onClick={onDismiss} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #1e2340',
      padding: '2rem 1.5rem',
      textAlign: 'center',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '0.65rem',
      letterSpacing: '2px',
      color: '#3a4060',
      textTransform: 'uppercase',
    }}>
      ResearchMind &nbsp;·&nbsp; Multi-Agent AI Pipeline &nbsp;·&nbsp;
      LangGraph + LangChain &nbsp;·&nbsp; Gemini 2.5 Flash Lite &nbsp;·&nbsp; Tavily
    </footer>
  )
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [topic,          setTopic]          = useState('')
  const [isRunning,      setIsRunning]      = useState(false)
  const [activeStep,     setActiveStep]     = useState(-1)
  const [doneSteps,      setDoneSteps]      = useState([])
  const [report,         setReport]         = useState('')
  const [isStreaming,    setIsStreaming]     = useState(false)
  const [feedback,       setFeedback]       = useState('')
  const [searchResults,  setSearchResults]  = useState('')
  const [scrapedContent, setScrapedContent] = useState('')
  const [error,          setError]          = useState('')
  const sourceRef = useRef(null)

  const reset = () => {
    setActiveStep(-1)
    setDoneSteps([])
    setReport('')
    setFeedback('')
    setSearchResults('')
    setScrapedContent('')
    setIsStreaming(false)
    setError('')
  }

  const handleRun = () => {
    if (!topic.trim() || isRunning) return
    reset()
    setIsRunning(true)

    // Close any existing stream
    sourceRef.current?.close()

    // const url = `/api/research/stream?topic=${encodeURIComponent(topic)}`
    const url = `${import.meta.env.VITE_API_URL}/api/research/stream?topic=${encodeURIComponent(topic)}`
    const es = new EventSource(url)
    sourceRef.current = es

    es.onmessage = (e) => {
      const data = JSON.parse(e.data)

      if (data.type === 'step') {
        if (data.status === 'active') {
          setActiveStep(data.step)
        }
        if (data.status === 'done') {
          setDoneSteps(prev => [...prev, data.step])
          if (data.step === 0 && data.data) setSearchResults(data.data)
          if (data.step === 1 && data.data) setScrapedContent(data.data)
          setActiveStep(-1)
        }
      }

      if (data.type === 'report_start') {
        setIsStreaming(true)
      }

      if (data.type === 'report_token') {
        setReport(prev => prev + data.token)
      }

      if (data.type === 'done') {
        setFeedback(data.feedback)
        setIsStreaming(false)
        setIsRunning(false)
        setActiveStep(-1)
        es.close()
      }

      if (data.type === 'error') {
        setError(data.message)
        setIsRunning(false)
        setIsStreaming(false)
        setActiveStep(-1)
        es.close()
      }
    }

    es.onerror = () => {
      setError('Connection lost. Please check if the backend is running on port 8000.')
      setIsRunning(false)
      setIsStreaming(false)
      es.close()
    }
  }

  return (
    <div className="min-h-screen mesh-bg">
      <Header />

      <main>
        <HeroSection
          topic={topic}
          setTopic={setTopic}
          onRun={handleRun}
          isRunning={isRunning}
        />

        <PipelineTracker
          activeStep={activeStep}
          doneSteps={doneSteps}
          isRunning={isRunning}
        />

        {error && (
          <ErrorBanner message={error} onDismiss={() => setError('')} />
        )}

        <ResultsSection
          report={report}
          isStreaming={isStreaming}
          feedback={feedback}
          searchResults={searchResults}
          scrapedContent={scrapedContent}
          topic={topic}
          isRunning={isRunning}
          doneSteps={doneSteps}
        />
      </main>

      <Footer />
    </div>
  )
}
