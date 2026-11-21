
import { useState } from "react";
import {
  ArrowDown,
  Link2
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import UrlShortener from "./components/UrlShortener";
import LinkManager from "./components/LinkManager";
import Analytics from "./components/AnalyticsChart";
import HeroArtwork from "./components/HeroArtwork";

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
      <Sidebar
        active={active}
        setActive={setActive}
      />

      <main className="main-area">
        <Header
          active={active}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />

        <section className="dashboard-content">

          {/* OVERVIEW PAGE */}
          {active === "Overview" && (
            <>
              {/* HERO SECTION */}
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

                  <div className="hero-caption">
                    <span className="hero-caption-line" />
                    <span>SHORTEN. SHARE. CONNECT.</span>
                  </div>
                </div>

                {/* ANIMATED HERO ILLUSTRATION */}
                <HeroArtwork />
              </div>

              {/* URL SHORTENER */}
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

              {/* OVERVIEW SECTION */}
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
                    Create and manage your shortened URLs
                    using the My Links section.
                    Visit Analytics to understand their performance.
                  </p>
                </div>
              </section>
            </>
          )}

          {/* MY LINKS PAGE */}
          {active === "My links" && (
            <LinkManager />
          )}

          {/* ANALYTICS PAGE */}
          {active === "Analytics" && (
            <Analytics />
          )}

          {/* SETTINGS PAGE */}
          {active === "Settings" && (
            <section className="overview-section">
              <div className="section-heading">
                <div>
                  <span className="section-number">
                    WORKSPACE
                  </span>

                  <h2>Settings</h2>
                </div>
              </div>

              <div className="empty-state">
                <h3>Workspace settings</h3>

                <p>
                  Use the theme control in the header
                  to switch between light and dark mode.
                </p>
              </div>
            </section>
          )}

          {/* FOOTER */}
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
