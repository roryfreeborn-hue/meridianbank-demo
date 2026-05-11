import { Descope } from '@descope/react-sdk';

function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6b21d6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}

function Hero() {
  return (
    <div className="hero">
      <div className="hero-bg" />
      <div className="hero-grain" />
      <div className="hero-content">
        <div className="hero-eyebrow">Online Banking</div>
        <div>
          <h1 className="hero-headline">UnionBank <em>Online</em></h1>
          <p className="hero-sub">Smart Banking at your fingertips.</p>
        </div>
        <div className="hero-foot">
          <span className="pill">
            <span className="dot-live" />
            FIDO2 · Passkey-ready · SNA
          </span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage({ onAuthSuccess }) {
  return (
    <div className="page-login">
      <Hero />

      <div className="login-panel">
        <div className="brand">
          <div className="brand-mark">M</div>
          <div className="brand-name">Union<span>Bank</span></div>
        </div>

        <div className="secure-banner">
          <ShieldIcon />
          <div style={{ flex: 1 }}>
            <div className="b-title">Verified by Cybersure</div>
            <div className="b-sub">Confirm your browser shows the verified URL before signing in.</div>
            <div className="url-row">
              <span style={{ color: '#6b21d6', display: 'flex' }}><LockIcon /></span>
              <span className="mono" style={{ fontSize: 11.5 }}>https://online.unionbank.com</span>
            </div>
          </div>
        </div>

        {/* Descope handles the entire auth flow — login, signup, passkeys, MFA */}
        <div className="descope-wrapper">
          <Descope
            flowId="sign-up-or-in"
            onSuccess={onAuthSuccess}
            onError={(e) => console.error('Auth error', e)}
            theme="light"
          />
        </div>

        <div className="help-row">
          <div className="h-item">📍 ATM &amp; Branches</div>
          <div className="h-item">❓ FAQ</div>
          <div className="h-item">💬 Contact Us</div>
        </div>
      </div>
    </div>
  );
}
