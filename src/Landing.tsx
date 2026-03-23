import './Landing.css';

interface LandingProps {
  onEnter: () => void;
}

const SAUCE_HOME = 'https://sauc-e.com';
const CHECKOUT_URL = 'https://sauc-e.com/checkitout';
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/28E00l3HOg638gA6hxa3u00';

export default function Landing({ onEnter }: LandingProps) {
  return (
    <div className="bbqe-landing">
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

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <img src="/bbqe_logo_360.png" alt="BBQE" className="bowl-logo" />
          <h1>BBQ e = (3,6,9)</h1>
          <p className="tagline">Signal Detection from Noise</p>
          <p className="subtitle">Safety = Quality / Quantity</p>
          <button className="enter-btn" onClick={onEnter}>Enter App</button>
        </div>
      </section>

      {/* SHOWCASE — Three Tool Cards */}
      <section className="showcase">
        <h2 className="showcase-title">How It Works</h2>
        <div className="showcase-container">

          {/* LINK SCANNER */}
          <div className="qa-pair link-scanner-card">
            <div className="qa-label">LINK SCANNER</div>
            <div className="qa-content">
              <div className="question-side">
                <img src="/bbqe_iphone_final2.png" alt="BBQE Link Scanner on iPhone" />
              </div>
              <div className="answer-side">
                <img src="/bbqe_ipad_final2.png" alt="BBQE Link Scanner on iPad" />
              </div>
            </div>
          </div>

          {/* PREMIUM BLEND */}
          <div className="qa-pair premium-blend-card">
            <div className="qa-label">PREMIUM BLEND</div>
            <div className="qa-content qa-content-single">
              <div className="question-side full-width">
                <img src="/PREMIUM_BLEND.png" alt="BBQE Premium Blend" />
              </div>
            </div>
          </div>

          {/* PITBOSS */}
          <div className="qa-pair pitboss-card">
            <div className="qa-label">PITBOSS</div>
            <div className="qa-content qa-content-single">
              <div className="question-side full-width">
                <img src="/PITBOSS.png" alt="BBQE PitBoss" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* PREMIUM BOTTLES */}
      <section className="premium">
        <div className="premium-content">
          <div className="premium-bottle">
            <img src="/PREMIUM_BLEND.png" alt="Premium Blend" className="bottle-img" />
          </div>
          <div className="premium-bottle">
            <img src="/PITBOSS.png" alt="PitBoss" className="bottle-img" />
          </div>
        </div>
      </section>

      {/* U vs THEM */}
      <section className="u-vs-them">
        <div className="uvt-header">
          <img src="/bbqe_logo_360.png" alt="BBQE" className="uvt-logo" />
          <h2>BBQE (3,6,9) US vs THEM</h2>
          <p>We've got your back so you can face front.</p>
        </div>

        <div className="uvt-comparison">
          <img src="/bbqe_uvt.png" alt="BBQE US vs THEM comparison" className="uvt-image" />
        </div>

        <div className="uvt-footer">
          <p className="uvt-tagline">"Education, not fear."</p>
          <p className="uvt-subtitle">Annual Security just 1.01 away from 21!</p>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <h2 className="landing-cta-title">What Mobile Security Can Actually Do</h2>
        <p className="landing-cta-subtitle">Education, not fear. $0.99/mo or $19.99/yr.</p>
        <p className="landing-cta-tagline">We've got your back so you can face front.</p>
        <a
          href={STRIPE_PAYMENT_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-button"
        >
          Start Scanning
        </a>
      </section>
    </div>
  );
}
