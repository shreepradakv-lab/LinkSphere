
export default function HeroArtwork() {
  return (
    <div className="hero-artwork">
      <div className="art-glow" />

      <div className="art-orbit orbit-one" />
      <div className="art-orbit orbit-two" />

      <div className="floating-link-card">
        <div className="art-card-top">
          <span className="art-dot" />
          <span className="art-dot" />
          <span className="art-dot" />
          <span className="art-window-label">LINKSPHERE</span>
        </div>

        <div className="art-link-icon">↗</div>

        <span className="art-label">YOUR LINK</span>
        <div className="art-long-line" />
        <div className="art-short-line" />

        <div className="art-result">
          <span>linksphere-pi.vercel.app</span>
          <span className="art-copy">↗</span>
        </div>
      </div>

      <div className="floating-qr-card">
        <div className="qr-art">
          <svg viewBox="0 0 100 100" fill="none">
            <rect width="100" height="100" rx="8" fill="#F7F1E8" />
            <g fill="#423B34">
              <path d="M8 8h29v29H8z M14 14v17h17V14z M19 19h7v7h-7z" />
              <path d="M63 8h29v29H63z M69 14v17h17V14z M74 19h7v7h-7z" />
              <path d="M8 63h29v29H8z M14 69v17h17V69z M19 74h7v7h-7z" />
              <path d="M45 8h7v7h-7z M45 22h7v7h-7z M45 36h7v7h-7z" />
              <path d="M57 45h7v7h-7z M71 45h7v7h-7z M85 45h7v7h-7z" />
              <path d="M43 57h7v7h-7z M57 57h7v7h-7z M71 57h7v7h-7z" />
              <path d="M43 71h7v7h-7z M57 71h7v7h-7z M85 71h7v7h-7z" />
              <path d="M57 85h7v7h-7z M71 85h7v7h-7z M85 85h7v7h-7z" />
            </g>
          </svg>
        </div>
        <span>SCAN TO SHARE</span>
      </div>

      <div className="floating-stat-card">
        <span className="stat-mini-icon">↗</span>
        <div>
          <strong>Link shared</strong>
          <span>Ready to explore</span>
        </div>
        <span className="stat-check">✓</span>
      </div>

      <div className="art-spark spark-one">✳</div>
      <div className="art-spark spark-two">✦</div>
      <div className="art-spark spark-three">·</div>
    </div>
  );
}
