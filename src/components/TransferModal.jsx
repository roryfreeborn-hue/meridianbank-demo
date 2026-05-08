import { useState } from 'react';
import { useSession } from '@descope/react-sdk';

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/>
      <path d="m21.854 2.147-10.94 10.939"/>
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l5 5L20 7" className="check-path"/>
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  );
}

// Simulates step-up verification. In production, swap this for a real
// Descope step-up flow using the descope SDK:
//   const sdk = useDescope();
//   await sdk.stepUp.start(sessionToken, 'passkey');
function VerifyingOverlay({ amount, onComplete }) {
  const [phase, setPhase] = useState('waiting'); // waiting | scanning | verified

  const handleApprove = () => {
    setPhase('scanning');
    setTimeout(() => {
      setPhase('verified');
      setTimeout(onComplete, 800);
    }, 1400);
  };

  if (phase === 'verified') {
    return (
      <div className="verify-overlay">
        <div className="verify-icon verify-icon--success"><CheckIcon /></div>
        <div className="verify-title">Transfer authorized</div>
      </div>
    );
  }

  return (
    <div className="verify-overlay">
      <div className="verify-phone-hint">
        Check your phone to approve this transfer
      </div>
      <div className={`fp-circle ${phase === 'scanning' ? 'fp-circle--scanning' : ''}`} onClick={handleApprove}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 10v3"/><path d="M5 19a14 14 0 0 0 1.4-7"/>
          <path d="M14.5 21.5a16 16 0 0 0 .9-7.5"/>
          <path d="M16 19c.5-1 .8-2.5.6-4.5"/>
          <path d="M2 14a14 14 0 0 1 1.5-8.5"/>
          <path d="M17.7 9a8 8 0 0 0-11.4 0"/>
          <path d="M12 5a7 7 0 0 1 7 7v3"/>
          <path d="M9 21a14 14 0 0 1 1-9 4 4 0 0 1 7 1"/>
        </svg>
        {phase === 'waiting' && (
          <>
            <span className="fp-ring" /><span className="fp-ring fp-ring--2" />
          </>
        )}
      </div>
      <div className="verify-hint">
        {phase === 'scanning' ? 'Scanning…' : 'Tap to simulate biometric approval'}
      </div>
      <div className="verify-meta">
        <span>Amount</span>
        <strong>₱ {Number(amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</strong>
      </div>
      <div className="verify-meta">
        <span>To</span>
        <strong>Maria Reyes · BPI ···· 9120</strong>
      </div>
    </div>
  );
}

export default function TransferModal({ onClose, onSuccess }) {
  const { sessionToken } = useSession();
  const [amount, setAmount] = useState('15000');
  const [stage, setStage] = useState('form'); // form | verifying | success
  const [txRef] = useState(() => 'MB-TXN-' + Math.floor(Math.random() * 9e6 + 1e6));

  const formatted = amount
    ? `₱ ${Number(amount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : '₱ 0.00';

  const handleSend = () => {
    if (!amount || Number(amount) <= 0) return;
    // In production: attach sessionToken to your API call for server-side verification
    // e.g. fetch('/api/transfer', { headers: { Authorization: `Bearer ${sessionToken}` }, ... })
    setStage('verifying');
  };

  const handleVerified = () => {
    setStage('success');
    onSuccess({
      name: 'Transfer to Maria Reyes',
      meta: `Just now · Passkey`,
      amt: `−${formatted}`,
      cls: 'neg',
    });
  };

  if (stage === 'success') {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal transfer-modal" onClick={e => e.stopPropagation()}>
          <div className="success-card">
            <div className="ck-circle"><CheckIcon /></div>
            <h2>Transfer sent</h2>
            <p>{formatted} to Maria Reyes · BPI ···· 9120</p>
            <div className="ref">{txRef}</div>
            <button className="btn btn-primary" style={{ height: 44, width: 200, marginTop: 22 }} onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop" onClick={stage === 'form' ? onClose : undefined}>
      <div className="modal transfer-modal" onClick={e => e.stopPropagation()}>
        {stage === 'verifying' ? (
          <VerifyingOverlay amount={amount} onComplete={handleVerified} />
        ) : (
          <>
            <h2>Make a transfer</h2>
            <div className="modal-sub">Send funds to a saved recipient. Step-up verification required.</div>

            <div className="transfer-row"><span className="k">From</span><span className="v">Checking ···· 4821 · ₱ 124,082.10</span></div>
            <div className="transfer-row"><span className="k">To</span><span className="v">Maria Reyes · BPI ···· 9120</span></div>
            <div className="transfer-row"><span className="k">Reference</span><span className="v">Rent — May 2026</span></div>
            <div className="transfer-row"><span className="k">Schedule</span><span className="v">Now · arrives in seconds</span></div>

            <label className="field-label" style={{ marginTop: 18 }}>Amount</label>
            <div className="amount-input-wrap">
              <span className="currency">₱</span>
              <input
                type="text"
                value={amount}
                onChange={e => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
                placeholder="0.00"
                autoFocus
              />
            </div>
            <div className="quick-amts">
              {[1000, 5000, 12500, 25000].map(v => (
                <button key={v} className="quick-amt" onClick={() => setAmount(String(v))}>
                  ₱ {v.toLocaleString()}
                </button>
              ))}
            </div>

            <div className="verify-banner">
              <span style={{ color: 'var(--brand)', flexShrink: 0, marginTop: 1 }}><ShieldIcon /></span>
              <div>
                <strong>Step-up verification.</strong> Your passkey will re-authenticate this transfer before it's sent.
              </div>
            </div>

            <div className="btn-row">
              <button className="btn btn-ghost" style={{ height: 46, marginTop: 0 }} onClick={onClose}>Cancel</button>
              <button
                className="btn btn-primary"
                style={{ height: 46 }}
                disabled={!amount || Number(amount) <= 0}
                onClick={handleSend}
              >
                Send {formatted} <ArrowIcon />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
