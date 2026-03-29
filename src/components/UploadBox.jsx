import { useState, useRef, useCallback } from 'react';

export default function UploadBox({ onFile, disabled }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  }, [disabled, onFile]);

  const handleChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
    e.target.value = '';
  }, [onFile]);

  return (
    <div
      className={`upload-box ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Upload image"
      onKeyDown={(e) => e.key === 'Enter' && !disabled && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="sr-only"
        onChange={handleChange}
        disabled={disabled}
      />

      <div className="upload-box__inner">
        {/* Animated icon */}
        <div className={`upload-icon ${isDragging ? 'upload-icon--active' : ''}`}>
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <rect width="52" height="52" rx="16" fill="var(--accent-primary-dim)" />
            <path
              d="M26 34V18M18 26l8-8 8 8"
              stroke={isDragging ? 'var(--accent-cyan)' : 'var(--accent-primary)'}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="upload-arrow"
            />
            <path
              d="M18 36h16"
              stroke={isDragging ? 'var(--accent-cyan)' : 'var(--accent-primary)'}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="upload-box__text">
          <p className="upload-box__title">
            {isDragging ? 'Drop it here!' : 'Drop your image here'}
          </p>
          <p className="upload-box__subtitle">
            or <span className="upload-link">browse files</span>
          </p>
          <p className="upload-box__formats">JPG · PNG · WEBP &nbsp;·&nbsp; Max 12MB</p>
        </div>

        {/* Corner decorations */}
        <span className="corner corner--tl" />
        <span className="corner corner--tr" />
        <span className="corner corner--bl" />
        <span className="corner corner--br" />
      </div>

      <style>{`
        .upload-box {
          position: relative;
          border-radius: var(--radius-lg);
          background: var(--bg-surface);
          border: 2px dashed var(--border-subtle);
          padding: 60px 40px;
          cursor: pointer;
          transition: border-color var(--transition-smooth),
                      background var(--transition-smooth),
                      transform var(--transition-smooth),
                      box-shadow var(--transition-smooth);
          user-select: none;
          outline: none;
          animation: fadeIn 0.4s ease both;
        }

        .upload-box:hover:not(.disabled) {
          border-color: rgba(108, 99, 255, 0.5);
          background: var(--bg-elevated);
          box-shadow: 0 0 0 1px rgba(108, 99, 255, 0.1), inset 0 0 40px rgba(108, 99, 255, 0.04);
          transform: translateY(-2px);
        }

        .upload-box:focus-visible {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.2);
        }

        .upload-box.dragging {
          border-color: var(--accent-cyan);
          background: rgba(0, 212, 255, 0.04);
          box-shadow: 0 0 0 1px rgba(0, 212, 255, 0.2),
                      inset 0 0 60px rgba(0, 212, 255, 0.05),
                      var(--shadow-cyan);
          transform: scale(1.01);
        }

        .upload-box.disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .upload-box__inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          text-align: center;
        }

        .upload-icon {
          transition: transform var(--transition-spring);
          animation: float 4s ease-in-out infinite;
        }

        .upload-icon--active {
          animation: none;
          transform: translateY(-6px) scale(1.1);
        }

        .upload-arrow {
          transition: stroke var(--transition-fast);
        }

        .upload-box__text {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .upload-box__title {
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-primary);
          transition: color var(--transition-fast);
        }

        .upload-box__subtitle {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .upload-link {
          color: var(--accent-primary);
          font-weight: 500;
          transition: color var(--transition-fast);
        }

        .upload-box:hover .upload-link {
          color: var(--accent-cyan);
        }

        .upload-box__formats {
          font-size: 0.78rem;
          color: var(--text-muted);
          letter-spacing: 0.05em;
          margin-top: 4px;
        }

        /* Corner decorators */
        .corner {
          position: absolute;
          width: 16px;
          height: 16px;
          border-color: var(--text-muted);
          border-style: solid;
          opacity: 0.4;
          transition: opacity var(--transition-smooth), border-color var(--transition-smooth);
        }
        .corner--tl { top: 10px; left: 10px; border-width: 2px 0 0 2px; border-radius: 4px 0 0 0; }
        .corner--tr { top: 10px; right: 10px; border-width: 2px 2px 0 0; border-radius: 0 4px 0 0; }
        .corner--bl { bottom: 10px; left: 10px; border-width: 0 0 2px 2px; border-radius: 0 0 0 4px; }
        .corner--br { bottom: 10px; right: 10px; border-width: 0 2px 2px 0; border-radius: 0 0 4px 0; }

        .upload-box.dragging .corner {
          opacity: 1;
          border-color: var(--accent-cyan);
        }
        .upload-box:hover:not(.disabled) .corner {
          opacity: 0.7;
          border-color: var(--accent-primary);
        }
      `}</style>
    </div>
  );
}
