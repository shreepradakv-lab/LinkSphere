
import {
  LayoutDashboard,
  Link2,
  ChartNoAxesCombined,
  Settings,
  CircleHelp,
  ArrowUpRight
} from "lucide-react";

const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "My links", icon: Link2 },
  { label: "Analytics", icon: ChartNoAxesCombined }
];

export default function Sidebar({ active, setActive }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <Link2 size={21} />
        </div>
        <span>link<span className="brand-light">sphere</span><sup>®</sup></span>
      </div>

      <div className="workspace-label">WORKSPACE</div>

      <nav className="nav-list">
        {navigation.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className={`nav-item ${active === label ? "active" : ""}`}
            onClick={() => setActive(label)}
          >
            <Icon size={18} strokeWidth={1.8} />
            <span>{label}</span>
            {active === label && <span className="nav-indicator" />}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-note">
          <div className="note-icon">
            <CircleHelp size={18} />
          </div>
          <p>Need a hand?</p>
          <span>Explore how LinkSphere works.</span>
          <ArrowUpRight size={16} className="note-arrow" />
        </div>

        <button className="nav-item settings-item"
          onClick={() => setActive("Settings")}>
          <Settings size={18} />
          <span>Settings</span>
        </button>

        <div className="profile">
          <div className="avatar">LS</div>
          <div>
            <strong>My Workspace</strong>
            <span>Personal account</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
