import './Landing.css';

interface LandingProps {
  onEnter: () => void;
}

const SAUCE_HOME = 'https://sauc-e.com';
const CHECKOUT_URL = 'https://sauc-e.com/checkitout';

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
          <img src="/bbqe_logo.jpg" alt="BBQ_e=" className="bowl-logo" />
          <h1>BBQ_e=</h1>
          <p className="tagline">Digital Safety</p>
          <p className="subtitle">Understanding = Awareness / Risk</p>
          <button className="enter-btn" onClick={onEnter}>Enter App</button>
        </div>
      </section>

      {/* SHOWCASE — Three Feature Pairs */}
      <section className="showcase">
        <h2 className="showcase-title">How It Works</h2>
        <div className="showcase-container">
          
          {/* LINK SCANNER */}
          <div className="qa-pair papa">
            <div className="qa-label">LINK SCANNER</div>
            <div className="qa-content">
              <div className="question-side">
                <img src="/bbqe_link_scanner_q.png" alt="Link scanner" />
              </div>
              <div className="answer-side">
                <img src="/bbqe_link_scanner_r.png" alt="Link scanner result" />
              </div>
            </div>
          </div>

          {/* WIFI CHECK */}
          <div className="qa-pair mama">
            <div className="qa-label">WIFI CHECK</div>
            <div className="qa-content">
              <div className="question-side">
                <img src="/bbqe_wifi_q.png" alt="WiFi check" />
              </div>
              <div className="answer-side">
                <img src="/bbqe_wifi_r.png" alt="WiFi result" />
              </div>
            </div>
          </div>

          {/* BREACH SCANNER */}
          <div className="qa-pair lem">
            <div className="qa-label">BREACH SCANNER</div>
            <div className="qa-content">
              <div className="question-side">
                <img src="/bbqe_breach_q.png" alt="Breach scanner" />
              </div>
              <div className="answer-side">
                <img src="/bbqe_breach_r.png" alt="Breach result" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* PREMIUM BOTTLES */}
      <section className="premium">
        <div className="premium-content">
          <div className="premium-bottle">
            <img src="/bbqe_premium_bottle.png" alt="Premium tier" className="bottle-img" />
          </div>
          <div className="premium-bottle">
            <img src="/bbqe_pitboss_bottle.png" alt="PitBoss tier" className="bottle-img" />
          </div>
        </div>
      </section>

      {/* U vs THEM */}
      <section className="u-vs-them">
        <div className="uvt-header">
          <img src="/bbqe_logo.jpg" alt="BBQ_e=" className="uvt-logo" />
          <h2>BBQ_e= (3,6,9) US vs THEM</h2>
          <p>We've got your back so you can face front.</p>
        </div>
        
        <div className="uvt-comparison">
          <img src="/bbqe_us_v_them.png" alt="US vs THEM comparison" className="uvt-image" />
        </div>

        <div className="uvt-footer">
          <p className="uvt-tagline">"Education, not fear."</p>
          <p className="uvt-subtitle">Covenant pricing. Real security.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <button className="cta-button" onClick={onEnter}>Start Securing</button>
      </section>
    </div>
  );
}
