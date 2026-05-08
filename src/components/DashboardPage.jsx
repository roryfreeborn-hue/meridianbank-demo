import { useState } from 'react';
import { useUser, useDescope, useSession } from '@descope/react-sdk';
import TransferModal from './TransferModal';

const INITIAL_TRANSACTIONS = [
  { ico: '☕', name: "Toby's Estate Coffee", meta: 'Today · 8:42 AM', amt: '−₱ 285.00', cls: 'neg' },
  { ico: '💼', name: 'Salary — Acme Corp', meta: 'Yesterday', amt: '+₱ 84,500.00', cls: 'pos' },
  { ico: '🛒', name: 'Robinsons Supermarket', meta: 'May 5', amt: '−₱ 3,142.75', cls: 'neg' },
  { ico: '⚡', name: 'Meralco — Electricity', meta: 'May 4 · auto-pay', amt: '−₱ 4,820.00', cls: 'neg' },
  { ico: '↗', name: 'Transfer to Savings', meta: 'May 3', amt: '−₱ 10,000.00', cls: 'neg' },
  { ico: '🍣', name: 'Mendokoro Ramenba', meta: 'May 2', amt: '−₱ 1,260.00', cls: 'neg' },
];

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/>
      <path d="m21.854 2.147-10.94 10.939"/>
    </svg>
  );
}

function CheckIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l5 5L20 7"/>
    </svg>
  );
}

export default function DashboardPage() {
  const { user } = useUser();
  const { sessionToken } = useSession();
  const sdk = useDescope();

  const [transferOpen, setTransferOpen] = useState(false);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [toast, setToast] = useState(null);

  const firstName = user?.givenName || user?.name?.split(' ')[0] || 'there';

  const handleLogout = async () => {
    await sdk.logout();
  };

  const handleTransferSuccess = (newTx) => {
    setTransactions(prev => [{ ico: '↗', ...newTx }, ...prev]);
    showToast('Transfer sent successfully');
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="page-dash">
      {/* Sidebar */}
      <aside className="dash-side">
        <div className="brand" style={{ marginBottom: 24 }}>
          <div className="brand-mark" style={{ width: 32, height: 32, fontSize: 16, borderRadius: 9 }}>M</div>
          <div className="brand-name" style={{ fontSize: 16 }}>Meridian<span>Bank</span></div>
        </div>
        <div className="nav-item nav-item--active">◉ Overview</div>
        <div className="nav-item" onClick={() => setTransferOpen(true)}>↗ Transfer</div>
        <div className="nav-item">⊞ Pay Bills</div>
        <div className="nav-item">⌖ Cards</div>
        <div className="nav-item">⎈ Investments</div>
        <div className="nav-item">⚐ Statements</div>
        <div style={{ flex: 1 }} />

        {/* Real user identity from Descope */}
        <div className="user-block">
          <div className="user-avatar">
            {user?.picture
              ? <img src={user.picture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : (firstName[0] || 'U').toUpperCase()}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.name || firstName}</div>
            <div className="user-email">{user?.email || ''}</div>
          </div>
        </div>

        <div className="nav-item" onClick={handleLogout} style={{ color: '#ef4444', marginTop: 4 }}>
          ⎋ Sign out
        </div>
      </aside>

      {/* Main content */}
      <main className="dash-main">
        <div className="dash-greet fade-up">
          <div>
            <h1>Good morning, {firstName}.</h1>
            <div className="dash-sub">Here's where things stand · Thursday, May 7, 2026</div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span className="pill-secure">
              <CheckIcon size={12} />
              Verified via passkey
            </span>
            <button className="transfer-cta" onClick={() => setTransferOpen(true)}>
              <SendIcon /> Make a transfer
            </button>
          </div>
        </div>

        <div className="balance-card fade-up" style={{ animationDelay: '.05s' }}>
          <div className="balance-label">Total balance · 4 accounts</div>
          <div className="balance-amount">₱ 482,194.<span style={{ fontSize: 28, opacity: .8 }}>57</span></div>
          <div className="balance-meta">
            <span>↗ ₱12,400 this month</span>
            <span style={{ opacity: .6 }}>•</span>
            <span>As of 9:30 AM</span>
          </div>
        </div>

        <div className="accounts-row fade-up" style={{ animationDelay: '.1s' }}>
          <div className="acc-card">
            <div className="acc-type">Checking</div>
            <div className="acc-num">···· 4821</div>
            <div className="acc-amt">₱ 124,082.10</div>
          </div>
          <div className="acc-card">
            <div className="acc-type">Savings</div>
            <div className="acc-num">···· 7390</div>
            <div className="acc-amt">₱ 358,112.47</div>
          </div>
        </div>

        <div className="tx-card fade-up" style={{ animationDelay: '.15s' }}>
          <div className="tx-head">
            Recent activity
            <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>Last 7 days</span>
          </div>
          {transactions.map((t, i) => (
            <div className="tx-row" key={i}>
              <div className="tx-icon">{t.ico}</div>
              <div>
                <div className="tx-name">{t.name}</div>
                <div className="tx-meta">{t.meta}</div>
              </div>
              <div className={`tx-amt ${t.cls}`}>{t.amt}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Session token debug chip — useful during development */}
      {sessionToken && (
        <div className="session-chip" title={sessionToken}>
          🔑 Active session
        </div>
      )}

      {toast && (
        <div className="toast show">
          <span className="toast-icon"><CheckIcon size={11} /></span>
          {toast}
        </div>
      )}

      {transferOpen && (
        <TransferModal
          onClose={() => setTransferOpen(false)}
          onSuccess={handleTransferSuccess}
        />
      )}
    </div>
  );
}
