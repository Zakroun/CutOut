import { useState, useRef, useCallback, useEffect } from 'react';

export default function ImagePreview({ originalUrl, resultUrl, originalFile }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [viewMode, setViewMode] = useState('slider'); // 'slider' | 'side'
  const containerRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const updateSlider = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDraggingSlider(true);
    updateSlider(e.clientX);
  }, [updateSlider]);

  const handleTouchStart = useCallback((e) => {
    setIsDraggingSlider(true);
    updateSlider(e.touches[0].clientX);
  }, [updateSlider]);

  useEffect(() => {
    if (!isDraggingSlider) return;
    const onMove = (e) => updateSlider(e.clientX ?? e.touches?.[0].clientX);
    const onUp = () => setIsDraggingSlider(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [isDraggingSlider, updateSlider]);

  return (
    <div className="preview-section">
      {/* View Toggle */}
      <div className="view-toggle">
        <button
          className={`toggle-btn ${viewMode === 'slider' ? 'active' : ''}`}
          onClick={() => setViewMode('slider')}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="7" y1="1" x2="7" y2="13" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          Slider
        </button>
        <button
          className={`toggle-btn ${viewMode === 'side' ? 'active' : ''}`}
          onClick={() => setViewMode('side')}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="5" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="8" y="1" width="5" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          Side by Side
        </button>
      </div>

      {/* ── SLIDER MODE ── */}
      {viewMode === 'slider' && (
        <div className="slider-container" ref={containerRef}>
          {/* Result (full width, behind) */}
          <div className="slider-layer slider-result">
            <img src={resultUrl} alt="Result" draggable={false} />
            <div className="checker-bg" />
          </div>

          {/* Original (clipped on right side) */}
          <div
            className="slider-layer slider-original"
            style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
          >
            <img src={originalUrl} alt="Original" draggable={false} />
          </div>

          {/* Labels */}
          <span className="slider-label slider-label--left">Result</span>
          <span className="slider-label slider-label--right">Original</span>

          {/* Divider */}
          <div
            className={`slider-divider ${isDraggingSlider ? 'dragging' : ''}`}
            style={{ left: `${sliderPos}%` }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <div className="slider-handle">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 4L3 10L7 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13 4L17 10L13 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* ── SIDE BY SIDE MODE ── */}
      {viewMode === 'side' && (
        <div className="side-grid">
          <div className="image-card">
            <div className="image-card__header">
              <span className="badge badge--original">Original</span>
              {originalFile && (
                <span className="image-meta">{formatFileSize(originalFile.size)}</span>
              )}
            </div>
            <div className="image-card__body">
              <img src={originalUrl} alt="Original" />
            </div>
          </div>

          <div className="image-card image-card--result">
            <div className="image-card__header">
              <span className="badge badge--result">Background Removed</span>
              <span className="image-meta">PNG · Transparent</span>
            </div>
            <div className="image-card__body checker">
              <img src={resultUrl} alt="Result" />
            </div>
          </div>
        </div>
      )}

      <style>{`
        .preview-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
          animation: fadeInScale 0.4s ease both;
        }

        /* View Toggle */
        .view-toggle {
          display: flex;
          gap: 6px;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 4px;
          width: fit-content;
          align-self: center;
        }

        .toggle-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all var(--transition-smooth);
        }

        .toggle-btn:hover {
          color: var(--text-primary);
          background: var(--bg-elevated);
        }

        .toggle-btn.active {
          background: var(--accent-primary-dim);
          color: var(--accent-primary);
          border: 1px solid rgba(108, 99, 255, 0.25);
        }

        /* ── SLIDER ── */
        .slider-container {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          cursor: col-resize;
          aspect-ratio: 16/9;
          background: #1a1a2e;
          border: 1px solid var(--border-subtle);
          box-shadow: var(--shadow-lg);
          user-select: none;
        }

        .slider-layer {
          position: absolute;
          inset: 0;
        }

        .slider-layer img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .checker-bg {
          position: absolute;
          inset: 0;
          z-index: -1;
          background-image:
            linear-gradient(45deg, #1e1e2e 25%, transparent 25%),
            linear-gradient(-45deg, #1e1e2e 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #1e1e2e 75%),
            linear-gradient(-45deg, transparent 75%, #1e1e2e 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }

        .slider-original {
          transition: clip-path 0s;
        }

        .slider-label {
          position: absolute;
          top: 16px;
          padding: 5px 12px;
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          z-index: 10;
          pointer-events: none;
        }

        .slider-label--left {
          left: 16px;
          background: rgba(0, 212, 255, 0.15);
          color: var(--accent-cyan);
          border: 1px solid rgba(0, 212, 255, 0.25);
        }

        .slider-label--right {
          right: 16px;
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-secondary);
          border: 1px solid var(--border-subtle);
        }

        /* Divider */
        .slider-divider {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 2px;
          background: white;
          transform: translateX(-50%);
          z-index: 20;
          cursor: col-resize;
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.4);
          transition: box-shadow var(--transition-fast);
        }

        .slider-divider.dragging {
          box-shadow: 0 0 20px rgba(108, 99, 255, 0.8), 0 0 40px rgba(108, 99, 255, 0.4);
          background: linear-gradient(to bottom, var(--accent-cyan), var(--accent-primary));
        }

        .slider-handle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 44px;
          height: 44px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 16px rgba(0, 0, 0, 0.5);
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-cyan));
          transition: transform var(--transition-spring);
        }

        .slider-divider:hover .slider-handle,
        .slider-divider.dragging .slider-handle {
          transform: translate(-50%, -50%) scale(1.15);
        }

        /* ── SIDE BY SIDE ── */
        .side-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 640px) {
          .side-grid { grid-template-columns: 1fr; }
        }

        .image-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: border-color var(--transition-smooth), box-shadow var(--transition-smooth);
        }

        .image-card:hover {
          border-color: rgba(108, 99, 255, 0.2);
          box-shadow: var(--shadow-md);
        }

        .image-card--result {
          border-color: rgba(0, 212, 255, 0.15);
        }

        .image-card--result:hover {
          border-color: rgba(0, 212, 255, 0.35);
          box-shadow: 0 4px 20px rgba(0, 212, 255, 0.1);
        }

        .image-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .badge {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 99px;
        }

        .badge--original {
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-secondary);
        }

        .badge--result {
          background: rgba(0, 212, 255, 0.12);
          color: var(--accent-cyan);
        }

        .image-meta {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .image-card__body {
          position: relative;
          padding: 12px;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-card__body img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: var(--radius-sm);
        }

        .checker {
          background-image:
            linear-gradient(45deg, #1e1e2e 25%, transparent 25%),
            linear-gradient(-45deg, #1e1e2e 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #1e1e2e 75%),
            linear-gradient(-45deg, transparent 75%, #1e1e2e 75%);
          background-size: 16px 16px;
          background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
        }
      `}</style>
    </div>
  );
}
