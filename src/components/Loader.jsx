export default function Loader({ progress = 0 }) {
  return (
    <div className="loader-wrapper">
      <div className="loader-card">
        {/* Animated rings */}
        <div className="loader-rings">
          <div className="ring ring-1" />
          <div className="ring ring-2" />
          <div className="ring ring-3" />
          <div className="loader-core">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M14 4 C8.477 4 4 8.477 4 14 C4 19.523 8.477 24 14 24"
                stroke="var(--accent-cyan)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M14 4 C19.523 4 24 8.477 24 14"
                stroke="var(--accent-primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <div className="loader-text">
          <p className="loader-title">Removing background…</p>
          <p className="loader-subtitle">AI is working its magic</p>
        </div>

        {/* Progress bar */}
        {progress > 0 && (
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
            <span className="progress-label">{progress}%</span>
          </div>
        )}

        {/* Shimmer dots */}
        <div className="loader-dots">
          <span className="dot dot-1" />
          <span className="dot dot-2" />
          <span className="dot dot-3" />
        </div>
      </div>

      <style>{`
        .loader-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 0;
          animation: fadeIn 0.3s ease;
        }

        .loader-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          padding: 48px 56px;
          box-shadow: var(--shadow-lg), var(--shadow-glow);
        }

        /* Rings */
        .loader-rings {
          position: relative;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid transparent;
        }

        .ring-1 {
          width: 80px;
          height: 80px;
          border-top-color: var(--accent-primary);
          border-right-color: rgba(108, 99, 255, 0.2);
          animation: spin 1s linear infinite;
        }

        .ring-2 {
          width: 60px;
          height: 60px;
          border-bottom-color: var(--accent-cyan);
          border-left-color: rgba(0, 212, 255, 0.2);
          animation: spin 0.75s linear infinite reverse;
        }

        .ring-3 {
          width: 40px;
          height: 40px;
          border-top-color: rgba(108, 99, 255, 0.4);
          border-right-color: transparent;
          animation: spin 1.5s linear infinite;
        }

        .loader-core {
          position: relative;
          z-index: 1;
          animation: spin 3s linear infinite;
        }

        /* Text */
        .loader-text {
          text-align: center;
        }

        .loader-title {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .loader-subtitle {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        /* Progress */
        .progress-track {
          width: 200px;
          height: 6px;
          background: var(--bg-surface);
          border-radius: 99px;
          overflow: hidden;
          position: relative;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-cyan));
          border-radius: 99px;
          transition: width 0.3s ease;
          box-shadow: 0 0 8px var(--accent-primary);
        }

        .progress-label {
          position: absolute;
          right: -32px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.72rem;
          color: var(--text-secondary);
        }

        /* Dots */
        .loader-dots {
          display: flex;
          gap: 6px;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-primary);
          opacity: 0.3;
        }

        .dot-1 { animation: dotPulse 1.2s ease-in-out infinite 0s; }
        .dot-2 { animation: dotPulse 1.2s ease-in-out infinite 0.2s; }
        .dot-3 { animation: dotPulse 1.2s ease-in-out infinite 0.4s; }

        @keyframes dotPulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(1); }
          40% { opacity: 1; transform: scale(1.4); background: var(--accent-cyan); }
        }
      `}</style>
    </div>
  );
}
