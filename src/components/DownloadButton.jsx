import { useState } from 'react';

const FORMATS = [
  { label: 'PNG', ext: 'png', mime: 'image/png', recommended: true },
  { label: 'JPEG', ext: 'jpg', mime: 'image/jpeg' },
  { label: 'WEBP', ext: 'webp', mime: 'image/webp' },
];

export default function DownloadButton({ blob, originalName }) {
  const [selectedFormat, setSelectedFormat] = useState('png');
  const [isDownloading, setIsDownloading] = useState(false);

  const getBaseName = () => {
    if (!originalName) return 'cutout-result';
    return originalName.replace(/\.[^/.]+$/, '') + '-no-bg';
  };

  const download = async () => {
    if (!blob || isDownloading) return;
    setIsDownloading(true);

    try {
      const format = FORMATS.find(f => f.ext === selectedFormat);
      let downloadBlob = blob;

      // Convert if not PNG
      if (selectedFormat !== 'png') {
        const bitmap = await createImageBitmap(blob);
        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext('2d');

        if (selectedFormat === 'jpg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(bitmap, 0, 0);
        downloadBlob = await new Promise(resolve =>
          canvas.toBlob(resolve, format.mime, 0.95)
        );
        bitmap.close();
      }

      const url = URL.createObjectURL(downloadBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${getBaseName()}.${selectedFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setTimeout(() => setIsDownloading(false), 800);
    }
  };

  return (
    <div className="download-group">
      {/* Format Selector */}
      <div className="format-selector">
        <span className="format-label">Format:</span>
        <div className="format-options">
          {FORMATS.map(f => (
            <button
              key={f.ext}
              className={`format-btn ${selectedFormat === f.ext ? 'active' : ''}`}
              onClick={() => setSelectedFormat(f.ext)}
            >
              {f.label}
              {f.recommended && <span className="rec-tag">Default</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Download Button */}
      <button
        className={`download-btn ${isDownloading ? 'downloading' : ''}`}
        onClick={download}
        disabled={isDownloading}
      >
        <span className="download-btn__icon">
          {isDownloading ? (
            <svg width="18" height="18" viewBox="0 0 18 18" className="spin-icon">
              <circle cx="9" cy="9" r="7" stroke="white" strokeWidth="2" fill="none" strokeDasharray="22" strokeDashoffset="5"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2v10M5 8l4 4 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 14h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </span>
        <span>{isDownloading ? 'Downloading…' : `Download ${selectedFormat.toUpperCase()}`}</span>
        <span className="download-btn__shine" />
      </button>

      <style>{`
        .download-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          animation: fadeIn 0.4s ease 0.1s both;
        }

        /* Format Selector */
        .format-selector {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .format-label {
          font-size: 0.82rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .format-options {
          display: flex;
          gap: 6px;
        }

        .format-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 500;
          font-family: var(--font-body);
          color: var(--text-secondary);
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          transition: all var(--transition-smooth);
        }

        .format-btn:hover {
          color: var(--text-primary);
          border-color: rgba(108, 99, 255, 0.3);
        }

        .format-btn.active {
          background: var(--accent-primary-dim);
          color: var(--accent-primary);
          border-color: rgba(108, 99, 255, 0.4);
        }

        .rec-tag {
          font-size: 0.65rem;
          background: rgba(108, 99, 255, 0.2);
          color: var(--accent-primary);
          padding: 1px 5px;
          border-radius: 4px;
          font-weight: 600;
        }

        /* Download Button */
        .download-btn {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px 40px;
          border-radius: var(--radius-lg);
          font-size: 0.97rem;
          font-weight: 600;
          font-family: var(--font-display);
          color: white;
          letter-spacing: 0.01em;
          background: linear-gradient(135deg, var(--accent-primary) 0%, #8b7eff 50%, var(--accent-cyan) 100%);
          background-size: 200% 200%;
          background-position: 0% 50%;
          box-shadow: 0 4px 20px rgba(108, 99, 255, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          transition: all var(--transition-smooth);
          border: none;
          cursor: pointer;
          min-width: 220px;
          justify-content: center;
        }

        .download-btn:hover:not(:disabled) {
          background-position: 100% 50%;
          box-shadow: 0 6px 30px rgba(108, 99, 255, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .download-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .download-btn:disabled {
          opacity: 0.8;
          cursor: not-allowed;
        }

        .download-btn.downloading {
          animation: pulse-glow 1.5s ease-in-out infinite;
        }

        /* Shine sweep */
        .download-btn__shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transform: skewX(-15deg);
          transition: left 0s;
        }

        .download-btn:hover .download-btn__shine {
          left: 150%;
          transition: left 0.5s ease;
        }

        .download-btn__icon {
          display: flex;
          align-items: center;
        }

        .spin-icon {
          animation: spin 0.8s linear infinite;
        }
      `}</style>
    </div>
  );
}
