import { useCallback } from 'react';
import UploadBox from '../components/UploadBox';
import ImagePreview from '../components/ImagePreview';
import Loader from '../components/Loader';
import DownloadButton from '../components/DownloadButton';
import { useRemoveBg } from '../hooks/useRemoveBg';
export default function Home() {
  const {
    originalFile,
    originalUrl,
    resultUrl,
    resultBlob,
    isLoading,
    uploadProgress,
    toast,
    handleFile,
    process,
    reset,
    dismissToast,
  } = useRemoveBg();

  const hasOriginal = !!originalUrl;
  const hasResult   = !!resultUrl;

  const handleProcess = useCallback(() => {
    process();
  }, [process]);

  return (
    <div className="page">
      {/* ── HEADER ── */}
      <header className="header">
        <div className="logo" >
          <div className="logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="var(--accent-primary)"/>
              <circle cx="14" cy="14" r="5" fill="none" stroke="white" strokeWidth="2"/>
              <path d="M14 4v3M14 21v3M4 14h3M21 14h3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="14" cy="14" r="2" fill="var(--accent-cyan)"/>
            </svg>
          </div>
          <span className="logo-name">CutOut</span>
          <span className="logo-tag">AI</span>
        </div>

        <nav className="header-nav">
          <a href="/docs" className="nav-link">Docs</a>
          <a href="/pricing" className="nav-link">Pricing</a>
          <a
            href="https://www.remove.bg/api"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-badge"
          >
            Powered by remove.bg
          </a>
        </nav>
      </header>

      {/* ── MAIN ── */}
      <main className="main">
        {/* Hero */}
        <div className="hero">
          <div className="hero-eyebrow">
            <span className="eyebrow-dot" />
            AI-Powered Background Removal
          </div>
          <h1 className="hero-title">
            Remove backgrounds
            <br />
            <span className="gradient-text">in one click.</span>
          </h1>
          <p className="hero-subtitle">
            Upload any image. Our AI instantly removes the background — for free.
            <br />
            No signup. No watermarks.
          </p>
        </div>

        {/* Main Card */}
        <div className="card main-card">
          {/* Step 1: Upload */}
          {!hasOriginal && !isLoading && (
            <div className="step-section">
              <UploadBox onFile={handleFile} disabled={isLoading} />
            </div>
          )}

          {/* Step 2: Original preview + Process button */}
          {hasOriginal && !hasResult && !isLoading && (
            <div className="step-section">
              <div className="original-preview-wrap">
                <div className="section-label">
                  <span className="step-chip">Step 1</span>
                  Your Image
                </div>
                <div className="original-img-card">
                  <div className="original-img-inner">
                    <img src={originalUrl} alt="Original" className="original-img" />
                  </div>
                  <div className="original-img-meta">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 2h10v10H2z" stroke="var(--text-muted)" strokeWidth="1.2" fill="none" rx="1"/>
                      <circle cx="5" cy="5" r="1" fill="var(--text-muted)"/>
                      <path d="M2 9l3-3 2 2 3-4 2 5" stroke="var(--text-muted)" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
                    </svg>
                    <span>{originalFile?.name}</span>
                    <span className="dot-sep">·</span>
                    <span>{originalFile ? (originalFile.size / 1024 / 1024).toFixed(2) : ''}MB</span>
                  </div>
                </div>
              </div>

              <div className="action-row">
                <button
                  className="btn-ghost"
                  onClick={reset}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1C3.686 1 1 3.686 1 7s2.686 6 6 6 6-2.686 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M11 1l2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Choose different image
                </button>

                <button
                  className="btn-primary"
                  onClick={handleProcess}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13 3L6 10l-3-3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Remove Background
                  <span className="btn-shimmer" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Loading */}
          {isLoading && <Loader progress={uploadProgress} />}

          {/* Step 4: Result */}
          {hasResult && !isLoading && (
            <div className="step-section">
              <div className="section-label" style={{ marginBottom: '20px' }}>
                <span className="step-chip step-chip--success">✓ Done</span>
                Before &amp; After
              </div>

              <ImagePreview
                originalUrl={originalUrl}
                resultUrl={resultUrl}
                originalFile={originalFile}
              />

              <div className="result-actions">
                <DownloadButton blob={resultBlob} originalName={originalFile?.name} />
                <button className="btn-ghost btn-ghost--sm" onClick={reset}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1C3.686 1 1 3.686 1 7s2.686 6 6 6 6-2.686 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M11 1l2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Remove another image
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="stats-row">
          {[
            { val: '100%', label: 'Free to use' },
            { val: '<5s',  label: 'Processing time' },
            { val: 'AI',   label: 'Powered removal' },
          ].map(s => (
            <div key={s.label} className="stat-item">
              <span className="stat-val">{s.val}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </main>

      {/* ── FOOTER ──
      <footer className="footer">
        <p>Built with ❤️ using <a href="https://www.remove.bg/api" target="_blank" rel="noopener noreferrer">remove.bg API</a></p>
      </footer>
      */}
      {/* ── TOAST ── */}
      {toast && (
        <Toast key={toast.id} type={toast.type} message={toast.message} onDismiss={dismissToast} />
      )}

      <style>{`
        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          max-width: 900px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ── Header ── */
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 0;
          border-bottom: 1px solid var(--border-subtle);
          animation: fadeIn 0.3s ease;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-icon { display: flex; animation: float 5s ease-in-out infinite; }

        .logo-name {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--text-primary);
        }

        .logo-tag {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-cyan));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          padding: 2px 7px;
          border: 1px solid rgba(108, 99, 255, 0.3);
          border-radius: 5px;
          line-height: 1.6;
        }

        .header-nav {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .nav-link {
          font-size: 0.88rem;
          color: var(--text-secondary);
          transition: color var(--transition-fast);
        }

        .nav-link:hover { color: var(--text-primary); }

        .nav-badge {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-muted);
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          padding: 6px 12px;
          border-radius: 99px;
          transition: all var(--transition-smooth);
        }
        .nav-badge:hover {
          border-color: rgba(108, 99, 255, 0.3);
          color: var(--accent-primary);
        }

        /* ── Main ── */
        .main {
          flex: 1;
          padding: 64px 0 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
        }

        /* ── Hero ── */
        .hero {
          text-align: center;
          animation: fadeIn 0.5s ease;
          max-width: 680px;
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--accent-primary);
          background: var(--accent-primary-dim);
          border: 1px solid rgba(108, 99, 255, 0.2);
          padding: 6px 14px;
          border-radius: 99px;
          margin-bottom: 24px;
        }

        .eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-primary);
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .hero-title {
          font-size: clamp(2.4rem, 5vw, 3.8rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 20px;
        }

        .gradient-text {
          background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-cyan) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 1rem;
          color: var(--text-secondary);
          line-height: 1.7;
        }

        /* ── Card ── */
        .card {
          width: 100%;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
          transition: border-color var(--transition-smooth);
        }

        .main-card {
          animation: fadeInScale 0.4s ease 0.1s both;
        }

        .step-section {
          padding: 40px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        @media (max-width: 600px) {
          .step-section { padding: 24px; }
        }

        /* ── Original Preview ── */
        .original-preview-wrap {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .section-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-display);
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .step-chip {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 3px 9px;
          border-radius: 6px;
          background: var(--bg-elevated);
          color: var(--text-muted);
          border: 1px solid var(--border-subtle);
        }

        .step-chip--success {
          background: rgba(0, 212, 100, 0.1);
          color: #00d464;
          border-color: rgba(0, 212, 100, 0.25);
        }

        .original-img-card {
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .original-img-inner {
          display: flex;
          justify-content: center;
          padding: 20px;
          max-height: 300px;
          overflow: hidden;
        }

        .original-img {
          max-height: 260px;
          max-width: 100%;
          object-fit: contain;
          border-radius: var(--radius-sm);
        }

        .original-img-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-top: 1px solid var(--border-subtle);
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .dot-sep { color: var(--text-muted); }

        /* ── Actions ── */
        .action-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .btn-primary {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 13px 32px;
          border-radius: var(--radius-md);
          font-size: 0.95rem;
          font-weight: 600;
          font-family: var(--font-display);
          color: white;
          background: linear-gradient(135deg, var(--accent-primary), #7b6ff0);
          box-shadow: 0 4px 20px rgba(108, 99, 255, 0.35);
          overflow: hidden;
          transition: all var(--transition-smooth);
          cursor: pointer;
          border: none;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 28px rgba(108, 99, 255, 0.5);
          background: linear-gradient(135deg, #7b72ff, var(--accent-primary));
        }

        .btn-primary:active { transform: translateY(0); }

        .btn-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transform: translateX(-100%);
          transition: transform 0s;
        }
        .btn-primary:hover .btn-shimmer {
          transform: translateX(100%);
          transition: transform 0.5s ease;
        }

        .btn-ghost {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 20px;
          border-radius: var(--radius-md);
          font-size: 0.88rem;
          font-weight: 500;
          font-family: var(--font-body);
          color: var(--text-secondary);
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          transition: all var(--transition-smooth);
          cursor: pointer;
        }

        .btn-ghost:hover {
          color: var(--text-primary);
          border-color: rgba(108, 99, 255, 0.3);
          background: rgba(108, 99, 255, 0.06);
        }

        .btn-ghost--sm { padding: 9px 16px; font-size: 0.82rem; }

        /* ── Result Actions ── */
        .result-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding-top: 8px;
        }

        /* ── Stats ── */
        .stats-row {
          display: flex;
          gap: 0;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          overflow: hidden;
          animation: fadeIn 0.5s ease 0.3s both;
          width: 100%;
        }

        .stat-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 20px;
          border-right: 1px solid var(--border-subtle);
        }
        .stat-item:last-child { border-right: none; }

        .stat-val {
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-cyan));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-label {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        /* ── Footer ── */
        .footer {
          padding: 24px 0;
          border-top: 1px solid var(--border-subtle);
          text-align: center;
          font-size: 0.82rem;
          color: var(--text-muted);
          animation: fadeIn 0.5s ease 0.5s both;
        }

        .footer a {
          color: var(--text-secondary);
          transition: color var(--transition-fast);
        }
        .footer a:hover { color: var(--accent-primary); }
      `}</style>
    </div>
  );
}

/* ── Toast Component (inline for simplicity) ── */
function Toast({ type, message, onDismiss }) {
  const isSuccess = type === 'success';

  return (
    <div className={`toast-wrapper toast-wrapper--${type}`} onClick={onDismiss}>
      <div className="toast-icon">
        {isSuccess ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" fill="rgba(0,212,100,0.2)" stroke="#00d464" strokeWidth="1.5"/>
            <path d="M5 8l2 2 4-4" stroke="#00d464" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" fill="rgba(255,80,80,0.2)" stroke="#ff5050" strokeWidth="1.5"/>
            <path d="M8 5v4M8 11v.5" stroke="#ff5050" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </div>
      <span className="toast-msg">{message}</span>
      <button className="toast-close" onClick={onDismiss} aria-label="Dismiss">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      <style>{`
        .toast-wrapper {
          position: fixed;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 14px 18px;
          box-shadow: var(--shadow-lg);
          z-index: 1000;
          min-width: 300px;
          max-width: 480px;
          cursor: pointer;
          animation: slideInToast 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
        }

        .toast-wrapper--success { border-color: rgba(0,212,100,0.25); }
        .toast-wrapper--error   { border-color: rgba(255,80,80,0.25); }

        .toast-icon { display: flex; flex-shrink: 0; }

        .toast-msg {
          flex: 1;
          font-size: 0.88rem;
          color: var(--text-primary);
          line-height: 1.4;
        }

        .toast-close {
          display: flex;
          color: var(--text-muted);
          padding: 2px;
          flex-shrink: 0;
          transition: color var(--transition-fast);
          background: none;
          border: none;
          cursor: pointer;
        }
        .toast-close:hover { color: var(--text-secondary); }
      `}</style>
    </div>
  );
}
