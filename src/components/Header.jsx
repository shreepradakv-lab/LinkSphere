
import { Search, Bell, Command, Sun, Moon } from "lucide-react";

export default function Header({ active, isDark, toggleTheme }) {
  return (
    <header className="top-header">
      <div className="breadcrumb">
        Workspace <span>/</span> <strong>{active}</strong>
      </div>

      <div className="header-actions">
        <div className="search-box">
          <Search size={16} />
          <span>Search anything...</span>
          <kbd><Command size={11} /> K</kbd>
        </div>

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Light mode" : "Dark mode"}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="notification-button" aria-label="Notifications">
          <Bell size={18} />
          <span className="notification-dot" />
        </button>

        <div className="header-avatar">LS</div>
      </div>
    </header>
  );
}
