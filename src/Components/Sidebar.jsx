import {
  CalendarIcon,
  ChatCircleIcon,
  FileTextIcon,
  SquaresFourIcon,
  SirenIcon,
  MapPinIcon,
  GearIcon,
  DeviceMobileIcon,
} from "@phosphor-icons/react";

function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <button
          type="button"
          className={`sidebar-link ${activePage === "dashboard" ? "sidebar-link-active" : ""}`}
          onClick={() => onNavigate("dashboard")}
        >
          <SquaresFourIcon size={20} />
          <span>Dashboard</span>
        </button>

        <button
          type="button"
          className={`sidebar-link ${activePage === "communications" ? "sidebar-link-active" : ""}`}
          onClick={() => onNavigate("communications")}
        >
          <ChatCircleIcon size={20} />
          <span>Communications</span>
        </button>

        <button
          type="button"
          className={`sidebar-link ${activePage === "reports" ? "sidebar-link-active" : ""}`}
          onClick={() => onNavigate("reports")}
        >
          <FileTextIcon size={20} />
          <span>Reports</span>
        </button>

        <button
          type="button"
          className={`sidebar-link ${activePage === "emergency" ? "sidebar-link-active" : ""}`}
          onClick={() => onNavigate("emergency")}
        >
          <SirenIcon size={20} />
          <span>Emergency</span>
        </button>

        <button
          type="button"
          className={`sidebar-link ${activePage === "navigation" ? "sidebar-link-active" : ""}`}
          onClick={() => onNavigate("navigation")}
        >
          <MapPinIcon size={20} />
          <span>Navigation</span>
        </button>

        <button
          type="button"
          className={`sidebar-link ${activePage === "events" ? "sidebar-link-active" : ""}`}
          onClick={() => onNavigate("events")}
        >
          <CalendarIcon size={20} />
          <span>Events</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
