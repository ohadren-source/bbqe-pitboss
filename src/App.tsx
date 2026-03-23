import { useState, useEffect } from 'react'
import './App.css'
import Landing from './Landing'

// ============================================================================
// BACKEND URL (Only this - no API keys in app!)
// ============================================================================

const BACKEND_URL = 'https://sauc-e-backend-production.up.railway.app'

const FREE_SCAN_LIMIT = 9

// Payment & external links
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/28E00l3HOg638gA6hxa3u00'
const SAUCE_HOME = 'https://sauc-e.com'
const CHECKOUT_URL = 'https://sauc-e.com/checkitout'
const PRIVACY_POLICY_URL = 'https://docs.google.com/document/d/1AxzEmZn2AjEY7ry6HSM1S6mlB3ggs0SN'

type Tab = 'link-scanner' | 'wifi-check' | 'breach-scan'

type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

interface ScanResult {
  severity: Severity
  score: number
  description: string
  findings: string[]
}

function App() {
  // ============================================================================
  // STATE
  // ============================================================================

  const [showLanding, setShowLanding] = useState(true)
  const [isSubscribed] = useState(false)
  const [scanCount, setScanCount] = useState(0)
  const [activeTab, setActiveTab] = useState<Tab>('link-scanner')
  const [url, setUrl] = useState('')
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [scannedUrl, setScannedUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [customerId] = useState<string | null>(null)

  const freeLeft = Math.max(0, FREE_SCAN_LIMIT - scanCount)

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
  // SCAN LINK (Calls backend, NOT Claude directly)
  // ============================================================================

  async function handleScan() {
    if (!url.trim()) {
      alert('Please enter a URL to scan')
      return
    }

    // If free limit reached, redirect to payment
    if (!isSubscribed && scanCount >= FREE_SCAN_LIMIT) {
      window.open(STRIPE_PAYMENT_LINK, '_blank')
      return
    }

    setLoading(true)
    const submittedUrl = url.trim()

    try {
      const response = await fetch(`${BACKEND_URL}/api/bbqe/get-guidance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId || 'anonymous',
          situation: submittedUrl,
          context: 'link-scan',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()

        if (response.status === 403) {
          window.open(STRIPE_PAYMENT_LINK, '_blank')
          return
        }

        throw new Error(errorData.error || 'Failed to scan link')
      }

      const data = await response.json()
      setScanResult(data as ScanResult)
      setScannedUrl(submittedUrl)
      setScanCount((prev) => prev + 1)
      setUrl('')
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to process request'
      alert(msg)
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleScan()
    }
  }

  function getSeverityClass(severity: Severity): string {
    switch (severity) {
      case 'LOW': return 'severity-low'
      case 'MEDIUM': return 'severity-medium'
      case 'HIGH': return 'severity-high'
      case 'CRITICAL': return 'severity-critical'
      default: return 'severity-low'
    }
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  if (showLanding) {
    return <Landing onEnter={() => setShowLanding(false)} />
  }

  return (
    <div className="bbqe-page">

      {/* ===== sauc-e HEADER ===== */}
      <header className="sauce-header">
        <a
          href={SAUCE_HOME}
          target="_blank"
          rel="noopener noreferrer"
          className="sauce-logo-link"
        >
          <span className="sauce-name">sauc-e</span>
          <span className="sauce-tagline"> where HOME is the </span>
          <span className="sauce-heart">❤️</span>
        </a>
        <nav className="sauce-nav">
          <a
            href={CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="sauce-nav-link"
          >
            Check It Out Y'all
          </a>
          <a
            href={`${SAUCE_HOME}/about`}
            target="_blank"
            rel="noopener noreferrer"
            className="sauce-nav-link"
          >
            About
          </a>
          <a
            href={`${SAUCE_HOME}/contact`}
            target="_blank"
            rel="noopener noreferrer"
            className="sauce-nav-link"
          >
            Contact
          </a>
        </nav>
      </header>

      <div className="bbqe-container">

        {/* ===== APP HEADER ===== */}
        <header className="bbqe-header">
          <h1 className="bbqe-title">BBQ e = (3,6,9)</h1>
          <p className="bbqe-subtitle">Minty Safe Tea front of the house.</p>
          <p className="bbqe-subtitle">Suite Secure Tea back home.</p>
          <p className="bbqe-philosophy">Safety = Quality / Quantity</p>
        </header>

        {/* ===== PREMIUM PILL ===== */}
        {!isSubscribed && (
          <div className="premium-section">
            <a
              href={STRIPE_PAYMENT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className={`premium-pill${freeLeft === 0 ? ' premium-pill-urgent' : ''}`}
            >
              {freeLeft > 0
                ? `Free · ${freeLeft} scans left`
                : 'Upgrade to Premium · $0.99/mo'}
            </a>
          </div>
        )}

        {/* ===== APP CONTENT ===== */}
        <main className="bbqe-content">

          {/* Tab Pills */}
          <div className="bbqe-tabs">
            <button
              className={`bbqe-tab-pill${activeTab === 'link-scanner' ? ' active' : ''}`}
              onClick={() => setActiveTab('link-scanner')}
            >
              Link Scanner
            </button>
            <button
              className="bbqe-tab-pill bbqe-tab-locked"
              disabled
              onClick={() => setActiveTab('wifi-check')}
            >
              WiFi Check 🔒
            </button>
            <button
              className="bbqe-tab-pill bbqe-tab-locked"
              disabled
              onClick={() => setActiveTab('breach-scan')}
            >
              Breach Scan 🔒
            </button>
          </div>

          {/* ===== TAB 1: LINK SCANNER ===== */}
          {activeTab === 'link-scanner' && (
            <div className="bbqe-tab-content">
              <h2 className="bbqe-section-title">Scan a Link</h2>
              <p className="bbqe-section-sub">Paste any URL to check for phishing, malware, and impersonation.</p>

              <input
                type="text"
                className="bbqe-input"
                placeholder="https://example.com/suspicious-link"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
              />

              <button
                className={`bbqe-scan-btn${loading ? ' disabled' : ''}`}
                onClick={handleScan}
                disabled={loading}
              >
                {loading ? 'Scanning...' : 'Scan Link'}
              </button>

              {/* Result Card */}
              {scanResult && (
                <div className="bbqe-result-box">
                  <p className="bbqe-scanned-label">Scanned:</p>
                  <p className="bbqe-scanned-url">"{scannedUrl}"</p>
                  <hr className="bbqe-divider" />

                  <div className="bbqe-severity-row">
                    <span className={`bbqe-severity-badge ${getSeverityClass(scanResult.severity)}`}>
                      {scanResult.severity}
                    </span>
                    <span className="bbqe-score">Score {scanResult.score}/100</span>
                  </div>

                  <p className="bbqe-result-description">{scanResult.description}</p>

                  {scanResult.findings && scanResult.findings.length > 0 && (
                    <ul className="bbqe-findings-list">
                      {scanResult.findings.map((finding, i) => (
                        <li key={i} className="bbqe-finding-item">{finding}</li>
                      ))}
                    </ul>
                  )}

                  {/* How BBQE Works box */}
                  <div className="bbqe-how-it-works">
                    <p className="bbqe-hiw-text">
                      BBQE checks the link against threat intelligence, domain reputation, and known phishing patterns. A score closer to 0 means safer. 100 means critical risk.
                    </p>
                  </div>

                  {/* iOS-style footer inside result card */}
                  <div className="bbqe-card-footer">
                    <p className="bbqe-card-footer-line">
                      The Shield (Front of the House) and The Bond (Back Home)
                    </p>
                    <p className="bbqe-card-footer-line">
                      Loyalty means only presenting a party's shortcomings to the party — never to the world.
                    </p>
                    <div className="bbqe-card-footer-links">
                      <a
                        href={PRIVACY_POLICY_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bbqe-card-footer-link"
                      >
                        Privacy Policy
                      </a>
                      <span className="bbqe-card-footer-sep">·</span>
                      <a
                        href={`${SAUCE_HOME}/terms`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bbqe-card-footer-link"
                      >
                        Terms of Use
                      </a>
                    </div>
                    <p className="bbqe-card-footer-line bbqe-card-footer-brought">
                      Brought to you by sauc-e
                    </p>
                    <p className="bbqe-card-footer-line bbqe-card-footer-prepared">
                      Prepared by Rilie Ravena Rivers
                    </p>
                  </div>
                </div>
              )}

              {/* How BBQE Works — shown before any scan */}
              {!scanResult && (
                <div className="bbqe-how-it-works">
                  <p className="bbqe-hiw-text">
                    Paste any suspicious URL above. BBQE checks for phishing domains, malware redirects, lookalike URLs, and known threat patterns — returning a severity score so you know exactly what you're dealing with.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ===== TAB 2: WIFI CHECK (LOCKED) ===== */}
          {activeTab === 'wifi-check' && (
            <div className="bbqe-tab-content">
              <div className="bbqe-locked-content">
                <p className="bbqe-locked-badge">🔒 Premium Feature</p>
                <p className="bbqe-locked-text">
                  WiFi Check scans your current network for vulnerabilities, rogue access points, and man-in-the-middle risks.
                </p>
                <a
                  href={STRIPE_PAYMENT_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bbqe-upgrade-link"
                >
                  Upgrade to Premium to unlock
                </a>
              </div>
              <div className="bbqe-how-it-works">
                <p className="bbqe-hiw-text">
                  WiFi Check analyzes the network you're connected to — checking for open ports, weak encryption, ARP spoofing indicators, and known rogue hotspot patterns. Available on Premium.
                </p>
              </div>
            </div>
          )}

          {/* ===== TAB 3: BREACH SCAN (LOCKED) ===== */}
          {activeTab === 'breach-scan' && (
            <div className="bbqe-tab-content">
              <div className="bbqe-locked-content">
                <p className="bbqe-locked-badge">🔒 PitBoss Feature</p>
                <p className="bbqe-locked-text">
                  Breach Scan checks your email addresses against known data breaches and credential leaks — so you know what's out there before someone uses it against you.
                </p>
                <a
                  href={STRIPE_PAYMENT_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bbqe-upgrade-link"
                >
                  Upgrade to PitBoss to unlock
                </a>
              </div>
              <div className="bbqe-how-it-works">
                <p className="bbqe-hiw-text">
                  Breach Scan cross-references your email against hundreds of known breach databases. If your credentials were leaked, you'll know — and you'll know what to do about it. Available on PitBoss.
                </p>
              </div>
            </div>
          )}

          {/* ===== TIERS TABLE (always visible) ===== */}
          <div className="bbqe-tiers-table">
            <h2 className="bbqe-section-title">Plans</h2>
            <div className="bbqe-tier-row">
              <div className="bbqe-tier-name">Free</div>
              <div className="bbqe-tier-desc">Link Scanner (5 scans)</div>
            </div>
            <div className="bbqe-tier-row">
              <div className="bbqe-tier-name bbqe-tier-premium">Premium</div>
              <div className="bbqe-tier-desc">+ WiFi Check (unlimited)</div>
            </div>
            <div className="bbqe-tier-row">
              <div className="bbqe-tier-name bbqe-tier-pitboss">PitBoss</div>
              <div className="bbqe-tier-desc">+ Breach Scanner (unlimited)</div>
            </div>
          </div>

        </main>

        {/* ===== MARKETING SECTION ===== */}
        <section className="bbqe-marketing">
          <img
            src="/bbqe_uvt.png"
            alt="BBQE — Us vs Them"
            className="bbqe-marketing-img bbqe-uvt-img"
          />
        </section>

        {/* ===== SUBSCRIBE CTA ===== */}
        {!isSubscribed && (
          <section className="bbqe-cta-section">
            <h2 className="bbqe-cta-title">What Mobile Security Can Actually Do</h2>
            <p className="bbqe-cta-subtitle">Education, not fear. $0.99/mo or $19.99/yr.</p>
            <p className="bbqe-cta-tagline">We've got your back so you can face front.</p>
            <a
              href={STRIPE_PAYMENT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bbqe-cta-btn"
            >
              Subscribe at sauc-e.com
            </a>
          </section>
        )}

        {/* ===== LEGAL ===== */}
        <div className="bbqe-legal">
          <a
            href={`${SAUCE_HOME}/terms`}
            target="_blank"
            rel="noopener noreferrer"
            className="bbqe-legal-link"
          >
            Terms of Service
          </a>
          <span className="bbqe-legal-sep">·</span>
          <a
            href={PRIVACY_POLICY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bbqe-legal-link"
          >
            Privacy Policy
          </a>
          <span className="bbqe-legal-sep">·</span>
          <a
            href={`${SAUCE_HOME}/support`}
            target="_blank"
            rel="noopener noreferrer"
            className="bbqe-legal-link"
          >
            Support
          </a>
        </div>

        {/* ===== FOOTER ===== */}
        <footer className="bbqe-footer">
          <a
            href={SAUCE_HOME}
            target="_blank"
            rel="noopener noreferrer"
            className="bbqe-footer-brand"
          >
            sauc-e.com
          </a>
          <p className="bbqe-footer-tagline">HOME of all of our delicious APPS</p>
          <p className="bbqe-footer-small">BBQE is for Safety</p>
          <p className="bbqe-footer-small">RELISH (Feelings) · CATSUP (Learning)</p>
          <p className="bbqe-footer-tiny">© 2026 3_6_NIFE.pi · 36Nife@gmail.com</p>
        </footer>

      </div>
    </div>
  )
}

export default App
