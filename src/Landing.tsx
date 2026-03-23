import './Landing.css'

export default function Landing() {
  return (
    <div className="bbqe-landing">
      {/* Header */}
      <header className="bbqe-header">
        <div className="bbqe-logo-circle">🔥🛡️</div>
        <h1 className="bbqe-title">BBQ_e=</h1>
        <p className="bbqe-subtitle">Digital Safety</p>
        <p className="bbqe-philosophy">Understanding = Awareness / Risk</p>
      </header>

      {/* Hero */}
      <section className="bbqe-hero">
        <h2>We've got your back so you can face front.</h2>
        <p>BBQ_e= analyzes URLs for phishing patterns, checks WiFi networks for security risks, and scans for data breaches. No data leaves your device — analysis is instant.</p>
        <p className="bbqe-sauce">Runs on BBQE Sauce 🔥 🛡️</p>
      </section>

      {/* Features */}
      <section className="bbqe-features">
        <div className="bbqe-feature-card">
          <h3>Link Scanner</h3>
          <p>Paste any URL to check for phishing, malware, and impersonation. Results cached and updated regularly.</p>
        </div>
        <div className="bbqe-feature-card">
          <h3>WiFi Check</h3>
          <p>Enter a network name to check for honeypots, evil twin signatures, and security vulnerabilities.</p>
        </div>
        <div className="bbqe-feature-card">
          <h3>Breach Scanner</h3>
          <p>Check if your email has been exposed in known data breaches. See if your credentials are compromised.</p>
        </div>
      </section>

      {/* Pricing */}
      <section className="bbqe-pricing">
        <h2>What Mobile Security Can Actually Do</h2>
        <div className="bbqe-pricing-grid">
          {/* Free */}
          <div className="bbqe-price-card">
            <h3>FREE</h3>
            <p className="bbqe-tier">Start here</p>
            <div className="bbqe-price">$0</div>
            <p className="bbqe-price-period">Forever</p>
            <ul className="bbqe-features-list">
              <li>Link Scanner (5 scans)</li>
            </ul>
            <div className="bbqe-payment-buttons">
              <p className="bbqe-no-payment">No payment required</p>
            </div>
          </div>

          {/* Premium */}
          <div className="bbqe-price-card bbqe-featured">
            <h3>PREMIUM</h3>
            <p className="bbqe-tier">Most popular</p>
            <div className="bbqe-price">$0.99</div>
            <p className="bbqe-price-period">per month</p>
            <ul className="bbqe-features-list">
              <li>Link Scanner (unlimited)</li>
              <li>WiFi Check (unlimited)</li>
            </ul>
            <div className="bbqe-payment-buttons">
              <a href="https://buy.stripe.com/00w00l7Y42fdcwQ7lBa3u03" target="_blank" rel="noopener" className="bbqe-payment-btn bbqe-stripe-btn">Pay with Stripe</a>
              <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_xclick-subscriptions&business=36Nife@gmail.com&item_name=BBQE+Premium&plan_id=P-45948399FA681270DNHAH43Y&return_url=https://www.sauc-e.com&notify_url=https://www.sauc-e.com" target="_blank" rel="noopener" className="bbqe-payment-btn bbqe-paypal-btn">Pay with PayPal</a>
              <a href="https://square.link/u/eNAhvKce" target="_blank" rel="noopener" className="bbqe-payment-btn bbqe-square-btn">Pay with Square</a>
            </div>
          </div>

          {/* PitBoss */}
          <div className="bbqe-price-card">
            <h3>PITBOSS</h3>
            <p className="bbqe-tier">Maximum sauce</p>
            <div className="bbqe-price">$19.99</div>
            <p className="bbqe-price-period">per year</p>
            <ul className="bbqe-features-list">
              <li>Link Scanner (unlimited)</li>
              <li>WiFi Check (unlimited)</li>
              <li>Breach Scanner (unlimited)</li>
              <li>Future Sauce (coming)</li>
            </ul>
            <div className="bbqe-payment-buttons">
              <a href="https://buy.stripe.com/00w9AVdiobPNgN6gWba3u04" target="_blank" rel="noopener" className="bbqe-payment-btn bbqe-stripe-btn">Pay with Stripe</a>
              <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_xclick-subscriptions&business=36Nife@gmail.com&item_name=BBQE+PitBoss&plan_id=P-17886177FN0218458NHAH2JA&return_url=https://www.sauc-e.com&notify_url=https://www.sauc-e.com" target="_blank" rel="noopener" className="bbqe-payment-btn bbqe-paypal-btn">Pay with PayPal</a>
              <a href="https://square.link/u/8ts00aqg" target="_blank" rel="noopener" className="bbqe-payment-btn bbqe-square-btn">Pay with Square</a>
            </div>
          </div>
        </div>
      </section>

      {/* US vs THEM */}
      <section className="bbqe-comparison">
        <div className="bbqe-comparison-card bbqe-us">
          <h3>US</h3>
          <p className="bbqe-comparison-subtitle">— BBQ_e= POCKET GRILL —</p>
          <ul>
            <li>FREE / $0.99/mo / $19.99/yr</li>
            <li>No ads ever</li>
            <li>Honest: mobile can't do that</li>
            <li>Honest: OS doesn't allow it</li>
            <li>Education, not fear</li>
            <li>3 features that work</li>
            <li>Never sell your data</li>
            <li>Transparent about limits</li>
            <li>Desktop + Chrome + Mobile</li>
            <li>PitBoss gets future sauce</li>
          </ul>
        </div>

        <div className="bbqe-comparison-card bbqe-them">
          <h3>THEM</h3>
          <p className="bbqe-comparison-subtitle">— THE COMPETITION —</p>
          <ul>
            <li>$30-100/year</li>
            <li>Ads everywhere</li>
            <li>Claims "antivirus"</li>
            <li>Claims "malware scan"</li>
            <li>Scare tactics</li>
            <li>50+ bloated features</li>
            <li>Sells your data</li>
            <li>Hides limitations</li>
            <li>Mobile only</li>
            <li>Pay more for updates</li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="bbqe-footer">
        <p className="bbqe-footer-main">Runs on BBQE Sauce 🔥 🛡️</p>
        <p className="bbqe-footer-text">BBQ_e= is for Safety</p>
        <p className="bbqe-footer-ecosystem">Part of the sauc-e ecosystem: RELISH (Feelings) · CATSUP (Learning) · BBQ_e= (Safety)</p>
        <p className="bbqe-footer-copyright">© 2026 3_6_NIFE.pi · covenant@sauc-e.com</p>
      </footer>
    </div>
  )
}
