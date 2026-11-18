
import { useState } from "react";
import { ArrowDown, Link2 } from "lucide-react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import UrlShortener from "./components/UrlShortener";
import LinkManager from "./components/LinkManager";

import "./App.css";

function App() {
  const [active, setActive] = useState("Overview");

  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("linksphere-theme") === "dark";
  });

  const toggleTheme = () => {
    setIsDark((previous) => {
      const next = !previous;

      localStorage.setItem(
        "linksphere-theme",
        next ? "dark" : "light"
      );

      return next;
    });
  };

  return (
    <div className={`app-layout ${isDark ? "dark-theme" : ""}`}>
      <Sidebar active={active} setActive={setActive} />

      <main className="main-area">
        <Header
          active={active}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />

        <section className="dashboard-content">
          {/* Welcome Section */}
          <div className="welcome-row">
            <div>
              <div className="eyebrow">
                <span className="live-dot" />
                YOUR LINK WORKSPACE
              </div>

              <h1>
                Make every link
                <br />
                <span>go further.</span>
              </h1>

              <p className="welcome-description">
                One space to shorten, manage and understand
                everything you share.
              </p>
            </div>

            <div className="date-note">
              <span>LINKSPHERE / 001</span>
              <div>Share with purpose.</div>
            </div>
          </div>

          {/* URL Shortener */}
          <section className="create-section">
            <div className="section-heading">
              <div>
                <span className="section-number">
                  01 / CREATE
                </span>
                <h2>Shorten a link</h2>
              </div>

              <div className="secure-label">
                <span>✦</span>
                Simple. Fast. Secure.
              </div>
            </div>

            <UrlShortener />
          </section>

          {/* Overview Section */}
          <section className="overview-section">
            <div className="section-heading">
              <div>
                <span className="section-number">
                  02 / OVERVIEW
                </span>
                <h2>Your link activity</h2>
              </div>

              <span className="period-label">
                <ArrowDown size={14} />
                All time
              </span>
            </div>

            <div className="empty-state">
              <div className="empty-icon">
                <Link2 size={25} />
              </div>

              <h3>Your links will live here.</h3>

              <p>
                Create your first short link to start building
                your collection and tracking its activity.
              </p>
            </div>
          </section>

          {/* Link Management Section */}
          <LinkManager />

          {/* Footer */}
          <footer className="dashboard-footer">
            <span>LINKSPHERE © 2026</span>
            <span>Built for better sharing.</span>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
