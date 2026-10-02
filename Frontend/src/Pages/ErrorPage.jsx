import { Link } from "react-router-dom";

function ErrorPage({ msg = null }) {
  return (
    <main className="error-page">
      <div
        className="orb orb-1"
        style={{ background: "rgba(244, 63, 94, 0.08)", top: -100, left: -100, width: 400, height: 400 }}
      ></div>
      <div
        className="orb orb-2"
        style={{ background: "rgba(124, 58, 237, 0.08)", bottom: -100, right: -100, width: 450, height: 450 }}
      ></div>

      <div className="error-container">
        <div className="error-card">
          <div className="error-visual">
            <div className="error-icon-glow"></div>
            <svg className="error-svg" viewBox="0 0 24 24">
              <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>

          <div className="error-code">Status 500</div>
          <h1 className="error-title">Something went wrong</h1>
          <p className="error-desc">
            Inkora encountered an unexpected issue while processing your
            request. Our servers might be undergoing maintenance, or a minor
            glitch occurred.
          </p>

          {msg && (
            <div className="technical-details">
              <details>
                <summary className="details-summary">
                  <span>🛠️</span> Technical Details
                </summary>
                <pre className="error-console">{msg}</pre>
              </details>
            </div>
          )}

          <div className="action-group">
            <button
              onClick={() => window.location.reload()}
              className="btn btn-danger"
            >
              <span>🔄</span> Reload Page
            </button>
            <Link to="/" className="btn btn-outline">
              <span>🏠</span> Go to Home
            </Link>
            <Link to="/blog" className="btn btn-outline">
              <span>🧭</span> Explore Stories
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ErrorPage;
