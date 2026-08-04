import { useNavigate, useLocation } from "react-router-dom";
import {
  CalendarIcon,
  ChatCircleIcon,
  FileTextIcon,
  SquaresFourIcon,
  MapPinIcon,
} from "@phosphor-icons/react";

const pagePathMap = {
  "/dashboard": "dashboard",
  "/communications": "communications",
  "/reports": "reports",
  "/navigation": "navigation",
  "/events": "events",
};

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPage = pagePathMap[location.pathname] || "dashboard";

  const handleNavigate = (page) => {
    const pathMap = {
      dashboard: "/dashboard",
      communications: "/communications",
      reports: "/reports",
      navigation: "/navigation",
      events: "/events",
    };
    navigate(pathMap[page] || "/dashboard");
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <button
          type="button"
          className={`sidebar-link ${currentPage === "dashboard" ? "sidebar-link-active" : ""}`}
          onClick={() => handleNavigate("dashboard")}
        >
          <SquaresFourIcon size={20} />
          <span>Dashboard</span>
        </button>

        <button
          type="button"
          className={`sidebar-link ${currentPage === "communications" ? "sidebar-link-active" : ""}`}
          onClick={() => handleNavigate("communications")}
        >
          <ChatCircleIcon size={20} />
          <span>Communications</span>
        </button>

        <button
          type="button"
          className={`sidebar-link ${currentPage === "reports" ? "sidebar-link-active" : ""}`}
          onClick={() => handleNavigate("reports")}
        >
          <FileTextIcon size={20} />
          <span>Reports</span>
        </button>

        <button
          type="button"
          className={`sidebar-link ${currentPage === "navigation" ? "sidebar-link-active" : ""}`}
          onClick={() => handleNavigate("navigation")}
        >
          <MapPinIcon size={20} />
          <span>Navigation</span>
        </button>

        <button
          type="button"
          className={`sidebar-link ${currentPage === "events" ? "sidebar-link-active" : ""}`}
          onClick={() => handleNavigate("events")}
        >
          <CalendarIcon size={20} />
          <span>Events</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
