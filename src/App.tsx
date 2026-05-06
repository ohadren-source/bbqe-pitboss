import { useState, useEffect } from 'react'
import './App.css'
import Landing from './Landing'
import { FingerprintManager } from '@sauc-e/fingerprint-manager'

const BACKEND_URL = 'https://sauc-e-backend-production.up.railway.app'
const FREE_SCAN_LIMIT = 9
const CHECKOUT_PAYMENT_LINK = 'https://www.sauc-e.com/checkitout'
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

interface WiFiResult {
  severity: Severity
  score: number
  description: string
  vulnerabilities: string[]
  recommendations: string[]
  ssid: string
  encryption: string
}

interface BreachResult {
  severity: Severity
  score: number
  description: string
  isBreach: boolean
  breachCount: number
  sources: string[]
  email: string
}

function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [isSubscribed, setIsSubscribed] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('subscribed') === 'true') {
      // Handle PayPal: subscription_id + payment_provider
      let subscriptionId = params.get('subscription_id')
      let paymentProvider = params.get('payment_provider')

      // Handle Stripe: session_id parameter
      if (!subscriptionId && params.get('session_id')) {
        subscriptionId = params.get('session_id')
        paymentProvider = 'stripe'
      }

      // Store payment info for verification and redirect to clean URL
      if (subscriptionId && paymentProvider) {
        sessionStorage.setItem('pending_payment_verification', JSON.stringify({
          subscription_id: subscriptionId,
          payment_provider: paymentProvider
        }))
      }

      localStorage.setItem('sauce_premium', 'true')
      // Clean URL by removing query params
      window.history.replaceState({}, document.title, window.location.pathname)
    }
    return localStorage.getItem('sauce_premium') === 'true'
  })
  const [scanCount, setScanCount] = useState(0)
  const [activeTab, setActiveTab] = useState<Tab>('link-scanner')
  const [url, setUrl] = useState('')
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [scannedUrl, setScannedUrl] = useState('')
  
  // WiFi Check state
  const [wifiSSID, setWifiSSID] = useState('')
  const [wifiEncryption, setWifiEncryption] = useState('WPA2')
  const [wifiResult, setWifiResult] = useState<WiFiResult | null>(null)

  // Breach Scan state
  const [breachEmail, setBreachEmail] = useState('')
  const [breachResult, setBreachResult] = useState<BreachResult | null>(null)
  const [breachScannedEmail, setBreachScannedEmail] = useState('')
  
  const [loading, setLoading] = useState(false)
  const fpManager = new FingerprintManager()

  const freeLeft = Math.max(0, FREE_SCAN_LIMIT - scanCount)

  useEffect(() => {
    syncUsageCount()
    // TEMPORARY: Set counter to 99 for WiFi testing
    setCounterForTesting()
  }, [])

  useEffect(() => {
    // Handle payment verification on redirect from payment provider
    const pendingVerification = sessionStorage.getItem('pending_payment_verification')
    if (pendingVerification) {
      const paymentInfo = JSON.parse(pendingVerification)
      verifyPayment(paymentInfo)
      sessionStorage.removeItem('pending_payment_verification')
    }
  }, [])

  async function syncUsageCount() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/bbqe/usage-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: fpManager.getFingerprint() }),
      })
      if (response.ok) {
        const data = await response.json()
        setScanCount(data.usageCount || 0)
        setIsSubscribed(data.isPremium || data.isPaid || false)
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'unknown'
      console.log('Usage sync skipped:', msg)
    }
  }

  async function setCounterForTesting() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/test/set-counter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: fpManager.getFingerprint(),
          app_name: 'bbqe',
          uses_remaining: 99
        }),
      })
      if (response.ok) {
        const data = await response.json()
        console.log('[TEST] Counter set to 99 for WiFi testing:', data)
        // Update local counter display
        setScanCount(0)
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'unknown'
      console.log('[TEST] Counter override skipped (endpoint may not be ready):', msg)
    }
  }

  async function verifyPayment(paymentInfo: { subscription_id: string; payment_provider: string }) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/bbqe/usage-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: fpManager.getFingerprint(),
          subscription_id: paymentInfo.subscription_id,
          payment_provider: paymentInfo.payment_provider,
        }),
      })
      if (response.ok) {
        const data = await response.json()
        setScanCount(data.usageCount || 0)
        setIsSubscribed(true)
        // Payment verification succeeded - user now has premium access
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'unknown'
      console.log('Payment verification error:', msg)
      // Log but don't fail - user will have localStorage flag
    }
  }

  async function handleScan() {
    if (!url.trim()) {
      alert('Please enter a URL to scan')
      return
    }
    // TODO: Re-enable counter logic after testing
    // if (!isSubscribed && scanCount >= FREE_SCAN_LIMIT) {
    //   window.open(CHECKOUT_PAYMENT_LINK + '?app=bbqe', '_blank')
    //   return
    // }
    setLoading(true)
    const submittedUrl = url.trim()
    try {
      const response = await fetch(`${BACKEND_URL}/api/bbqe/scan-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: fpManager.getFingerprint(),
          url: submittedUrl,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        // TODO: Re-enable 403 error handling after testing
        // if (response.status === 403) {
        //   window.open(CHECKOUT_PAYMENT_LINK + '?app=bbqe', '_blank')
        //   return
        // }
        throw new Error(errorData.error || 'Failed to scan link')
      }
      const data = await response.json()
      setScanResult({
        severity: data.threatLevel ?? 'LOW',
        score: data.score ?? 0,
        description: data.summary ?? '',
        findings: data.flags ?? [],
      })
      setScannedUrl(submittedUrl)
      // TODO: Re-enable counter increment after testing
      // setScanCount((prev) => prev + 1)
      setUrl('')
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to process request'
      alert(msg)
    } finally {
      setLoading(false)
    }
  }

  async function handleWifiCheck() {
    if (!wifiSSID.trim()) {
      alert('Please enter a WiFi network name (SSID)')
      return
    }
    // TODO: Re-enable counter logic after testing
    // if (!isSubscribed && scanCount >= FREE_SCAN_LIMIT) {
    //   window.open(CHECKOUT_PAYMENT_LINK + '?app=bbqe', '_blank')
    //   return
    // }
    setLoading(true)
    const submittedSSID = wifiSSID.trim()
    try {
      const response = await fetch(`${BACKEND_URL}/api/bbqe/wifi-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: fpManager.getFingerprint(),
          ssid: submittedSSID,
          security: wifiEncryption,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        // TODO: Re-enable 403 error handling after testing
        // if (response.status === 403) {
        //   window.open(CHECKOUT_PAYMENT_LINK + '?app=bbqe', '_blank')
        //   return
        // }
        throw new Error(errorData.error || 'Failed to analyze WiFi network')
      }
      const data = await response.json()
      setWifiResult({
        severity: data.riskLevel ?? 'LOW',
        score: data.score ?? 0,
        description: data.recommendation ?? '',
        vulnerabilities: data.flags ?? [],
        recommendations: [],
        ssid: submittedSSID,
        encryption: wifiEncryption,
      })
      // TODO: Re-enable counter increment after testing
      // setScanCount((prev) => prev + 1)
      setWifiSSID('')
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to process request'
      alert(msg)
    } finally {
      setLoading(false)
    }
  }

  async function handleBreachScan() {
    if (!breachEmail.trim()) {
      alert('Please enter an email address to scan')
      return
    }
    if (!isSubscribed && scanCount >= FREE_SCAN_LIMIT) {
      window.open(CHECKOUT_PAYMENT_LINK + '?app=bbqe', '_blank')
      return
    }
    setLoading(true)
    const submittedEmail = breachEmail.trim()
    try {
      const response = await fetch(`${BACKEND_URL}/api/bbqe/breach-scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: fpManager.getFingerprint(),
          email: submittedEmail,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 403) {
          window.open(CHECKOUT_PAYMENT_LINK + '?app=bbqe', '_blank')
          return
        }
        throw new Error(errorData.error || 'Failed to scan email for breaches')
      }
      const data = await response.json()
      setBreachResult({
        severity: data.threatLevel ?? 'LOW',
        score: data.score ?? 0,
        description: data.summary ?? '',
        findings: data.flags ?? [],
      })
      setBreachScannedEmail(submittedEmail)
      setScanCount((prev) => prev + 1)
      setBreachEmail('')
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to process request'
      alert(msg)
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleScan()
  }

  function handleWifiKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleWifiCheck()
  }

  function handleBreachKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleBreachScan()
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

  if (showLanding) {
    return <Landing onEnter={() => setShowLanding(false)} />
  }

  return (
    <div className="bbqe-page">
      <header className="sauce-header">
        <a href={SAUCE_HOME} target="_blank" rel="noopener noreferrer" className="sauce-logo-link">
          <span className="sauce-name">sauc-e</span>
          <span className="sauce-tagline"> where HOME is the </span>
          <span className="sauce-heart">❤️</span>
        </a>
        <nav className="sauce-nav">
          <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer" className="sauce-nav-link">Check It Out Y'all</a>
          <a href={`${SAUCE_HOME}/about`} target="_blank" rel="noopener noreferrer" className="sauce-nav-link">About</a>
          <a href={`${SAUCE_HOME}/contact`} target="_blank" rel="noopener noreferrer" className="sauce-nav-link">Contact</a>
        </nav>
      </header>

      <div className="bbqe-container">
        <header className="bbqe-header">
          <h1 className="bbqe-title">BBQ e = (3,6,9)</h1>
          <p className="bbqe-subtitle">Minty Safe Tea front of the house.</p>
          <p className="bbqe-subtitle">Suite Secure Tea back home.</p>
          <p className="bbqe-philosophy">Safety = Quality / Quantity</p>
        </header>

        {!isSubscribed && (
          <div className="premium-section">
            <a
              href={CHECKOUT_PAYMENT_LINK + '?app=bbqe'}
              target="_blank"
              rel="noopener noreferrer"
              className={`premium-pill${freeLeft === 0 ? ' premium-pill-urgent' : ''}`}
            >
              {freeLeft > 0 ? `Free · ${freeLeft} scans left` : 'Upgrade to Premium · $0.99/mo'}
            </a>
          </div>
        )}

        <main className="bbqe-content">
          <div className="bbqe-tabs">
            <button className={`bbqe-tab-pill${activeTab === 'link-scanner' ? ' active' : ''}`} onClick={() => setActiveTab('link-scanner')}>Link Scanner</button>
            <button className={`bbqe-tab-pill${activeTab === 'wifi-check' ? ' active' : ''}`} onClick={() => setActiveTab('wifi-check')}>WiFi Check</button>
            <button className={`bbqe-tab-pill${activeTab === 'breach-scan' ? ' active' : ''}`} onClick={() => setActiveTab('breach-scan')}>Breach Scan</button>
          </div>

          {activeTab === 'link-scanner' && (
            <div className="bbqe-tab-content">
              <h2 className="bbqe-section-title">Scan a Link</h2>
              <p className="bbqe-section-sub">Paste any URL to check for phishing, malware, and impersonation.</p>
              <input type="text" className="bbqe-input" placeholder="https://example.com/suspicious-link" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={handleKeyDown} />
              <button className={`bbqe-scan-btn${loading ? ' disabled' : ''}`} onClick={handleScan} disabled={loading}>
                {loading ? 'Scanning...' : 'Scan Link'}
              </button>
              {scanResult && (
                <div className="bbqe-result-box">
                  <p className="bbqe-scanned-label">Scanned:</p>
                  <p className="bbqe-scanned-url">"{scannedUrl}"</p>
                  <hr className="bbqe-divider" />
                  <div className="bbqe-severity-row">
                    <span className={`bbqe-severity-badge ${getSeverityClass(scanResult.severity)}`}>{scanResult.severity}</span>
                    <span className="bbqe-score">Score {scanResult.score}/100</span>
                  </div>
                  <p className="bbqe-result-description">{scanResult.description}</p>
                  {scanResult.findings && scanResult.findings.length > 0 && (
                    <ul className="bbqe-findings-list">
                      {scanResult.findings.map((finding, i) => (<li key={i} className="bbqe-finding-item">{finding}</li>))}
                    </ul>
                  )}
                  <div className="bbqe-how-it-works">
                    <p className="bbqe-hiw-text">BBQE checks the link against threat intelligence, domain reputation, and known phishing patterns. A score closer to 0 means safer. 100 means criti[...]
                    </p>
                  </div>
                  <div className="bbqe-card-footer">
                    <p className="bbqe-card-footer-line">The Shield (Front of the House) and The Bond (Back Home)</p>
                    <p className="bbqe-card-footer-line">Loyalty means only presenting a party's shortcomings to the party — never to the world.</p>
                    <div className="bbqe-card-footer-links">
                      <a href={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer" className="bbqe-card-footer-link">Privacy Policy</a>
                      <span className="bbqe-card-footer-sep">·</span>
                      <a href={`${SAUCE_HOME}/terms`} target="_blank" rel="noopener noreferrer" className="bbqe-card-footer-link">Terms of Use</a>
                    </div>
                    <p className="bbqe-card-footer-line bbqe-card-footer-brought">Brought to you by sauc-e</p>
                    <p className="bbqe-card-footer-line bbqe-card-footer-prepared">Prepared by Rilie Ravena Rivers</p>
                  </div>
                </div>
              )}
              {!scanResult && (
                <div className="bbqe-how-it-works">
                  <p className="bbqe-hiw-text">Paste any suspicious URL above. BBQE checks for phishing domains, malware redirects, lookalike URLs, and known threat patterns — returning a sever[...]
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'wifi-check' && (
            <div className="bbqe-tab-content">
              <h2 className="bbqe-section-title">Analyze WiFi Network</h2>
              <p className="bbqe-section-sub">Enter your WiFi network details to check for vulnerabilities, weak encryption, and security risks.</p>
              <input 
                type="text" 
                className="bbqe-input" 
                placeholder="WiFi Network Name (SSID)" 
                value={wifiSSID} 
                onChange={(e) => setWifiSSID(e.target.value)} 
                onKeyDown={handleWifiKeyDown}
              />
              <select 
                className="bbqe-input" 
                value={wifiEncryption}
                onChange={(e) => setWifiEncryption(e.target.value)}
              >
                <option value="OPEN">Open (No Encryption)</option>
                <option value="WEP">WEP</option>
                <option value="WPA">WPA</option>
                <option value="WPA2">WPA2</option>
                <option value="WPA3">WPA3</option>
              </select>
              <button className={`bbqe-scan-btn${loading ? ' disabled' : ''}`} onClick={handleWifiCheck} disabled={loading}>
                {loading ? 'Analyzing...' : 'Analyze Network'}
              </button>
              {wifiResult && (
                <div className="bbqe-result-box">
                  <p className="bbqe-scanned-label">Analyzed Network:</p>
                  <p className="bbqe-scanned-url">"{wifiResult.ssid}" ({wifiResult.encryption})</p>
                  <hr className="bbqe-divider" />
                  <div className="bbqe-severity-row">
                    <span className={`bbqe-severity-badge ${getSeverityClass(wifiResult.severity)}`}>{wifiResult.severity}</span>
                    <span className="bbqe-score">Score {wifiResult.score}/100</span>
                  </div>
                  <p className="bbqe-result-description">{wifiResult.description}</p>
                  {wifiResult.vulnerabilities && wifiResult.vulnerabilities.length > 0 && (
                    <>
                      <p className="bbqe-result-subtitle">Findings:</p>
                      <ul className="bbqe-findings-list">
                        {wifiResult.vulnerabilities.map((vuln, i) => (<li key={i} className="bbqe-finding-item">{vuln}</li>))}
                      </ul>
                    </>
                  )}
                  <div className="bbqe-how-it-works">
                    <p className="bbqe-hiw-text">WiFi Check analyzes network encryption, known vulnerability patterns, and security best practices. Stronger encryption (WPA3) scores higher. Open networks score highest risk.</p>
                  </div>
                  <div className="bbqe-card-footer">
                    <p className="bbqe-card-footer-line">The Shield (Front of the House) and The Bond (Back Home)</p>
                    <p className="bbqe-card-footer-line">Loyalty means only presenting a party's shortcomings to the party — never to the world.</p>
                    <div className="bbqe-card-footer-links">
                      <a href={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer" className="bbqe-card-footer-link">Privacy Policy</a>
                      <span className="bbqe-card-footer-sep">·</span>
                      <a href={`${SAUCE_HOME}/terms`} target="_blank" rel="noopener noreferrer" className="bbqe-card-footer-link">Terms of Use</a>
                    </div>
                    <p className="bbqe-card-footer-line bbqe-card-footer-brought">Brought to you by sauc-e</p>
                    <p className="bbqe-card-footer-line bbqe-card-footer-prepared">Prepared by Rilie Ravena Rivers</p>
                  </div>
                </div>
              )}
              {!wifiResult && (
                <div className="bbqe-how-it-works">
                  <p className="bbqe-hiw-text">Enter your WiFi network name and encryption type above. BBQE checks for weak or deprecated encryption standards, known vulnerability patterns in your network name, and overall security posture.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'breach-scan' && (
            <div className="bbqe-tab-content">
