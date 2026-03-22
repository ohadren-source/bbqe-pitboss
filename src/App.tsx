import { useState, useEffect } from 'react'
import './App.css'

// ============================================================================
// BACKEND URL (Only this - no API keys in app!)
// ============================================================================

const BACKEND_URL = 'https://sauc-e-backend-production.up.railway.app'

const FREE_SCAN_LIMIT = 9

type Context = 'Passwords' | 'Phishing' | 'Privacy' | 'Devices' | 'Identity'

const CONTEXTS: Context[] = ['Passwords', 'Phishing', 'Privacy', 'Devices', 'Identity']

function App() {
  // ============================================================================
  // STATE
  // ============================================================================

  const [isSubscribed] = useState(false)
  const [scanCount, setScanCount] = useState(0)
  const [concern, setConcern] = useState('')
  const [context, setContext] = useState<Context>('Passwords')
  const [guidance, setGuidance] = useState('')
  const [loading, setLoading] = useState(false)
  const [customerId] = useState<string | null>(null)

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  useEffect(() => {
    syncUsageCount('web-user')
  }, [])

  async function syncUsageCount(cid: string) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/bbqe/usage-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: cid || 'anonymous' }),
      })
      if (response.ok) {
        const data = await response.json()
        setScanCount(data.usageCount || 0)
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'unknown'
      console.log('Usage sync skipped:', msg)
    }
  }

  // ============================================================================
  // GET GUIDANCE (Calls backend, NOT Claude directly)
  // ============================================================================

  async function handleGetGuidance() {
    if (!concern.trim()) {
      alert('Please describe your security concern')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${BACKEND_URL}/api/bbqe/get-guidance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId || 'anonymous',
          situation: concern,
          context: context,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()

        if (response.status === 403) {
          alert('Limit Reached — Upgrade to Premium for unlimited security guidance')
          return
        }

        throw new Error(errorData.error || 'Failed to get guidance')
      }

      const data = await response.json()
      setGuidance(data.wisdom || data.guidance)
      setScanCount((prev) => prev + 1)
      setConcern('')
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to process request'
      alert(msg)
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="bbqe-container">
      <header className="bbqe-header">
        <h1 className="bbqe-title">BBQ_e=</h1>
        <p className="bbqe-subtitle">Digital Safety</p>
        <p className="bbqe-philosophy">Understanding = Awareness / Risk</p>
      </header>

      {!isSubscribed && scanCount > 0 && (
        <div className="bbqe-usage">
          <span className="bbqe-usage-text">
            {Math.max(0, FREE_SCAN_LIMIT - scanCount)} free remaining
          </span>
        </div>
      )}

      <main className="bbqe-content">
        <h2 className="bbqe-section-title">Pick a Category</h2>
        <div className="bbqe-contexts">
          {CONTEXTS.map((c) => (
            <button
              key={c}
              className={`bbqe-context-btn${context === c ? ' active' : ''}`}
              onClick={() => setContext(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <h2 className="bbqe-section-title">Your Security Concern</h2>
        <textarea
          className="bbqe-input"
          placeholder="Describe your security question or concern..."
          value={concern}
          onChange={(e) => setConcern(e.target.value)}
          rows={4}
        />

        <button
          className={`bbqe-guidance-btn${loading ? ' disabled' : ''}`}
          onClick={handleGetGuidance}
          disabled={loading}
        >
          {loading ? 'Scanning...' : 'Get Guidance'}
        </button>

        {guidance && (
          <div className="bbqe-guidance-box">
            <h3 className="bbqe-guidance-title">Security Guidance</h3>
            <p className="bbqe-guidance-text">{guidance}</p>
          </div>
        )}

        <footer className="bbqe-footer">
          <p className="bbqe-footer-main">Runs on BBQE Sauce 🔥 🛡️</p>
          <p className="bbqe-footer-small">BBQE is for Safety</p>
          <p className="bbqe-footer-small">
            Sample: RELISH (Feelings) · CATSUP (Learning)
          </p>
        </footer>
      </main>
    </div>
  )
}

export default App
