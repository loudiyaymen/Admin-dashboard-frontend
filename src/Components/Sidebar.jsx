import {
  CalendarIcon,
  ChatCircleIcon,
  FileTextIcon,
  SquaresFourIcon,
  WarningIcon,
  MapPinIcon,
  GearIcon,
  DeviceMobileIcon
} from '@phosphor-icons/react';

function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Algonquin GO</div>

      <nav className="sidebar-nav">
        <button type="button" className="sidebar-link">
          <SquaresFourIcon size={20} />
          <span>Dashboard</span>
        </button>

        <button
          type="button"
          className={`sidebar-link ${activePage === 'communications' ? 'sidebar-link-active' : ''}`}
          onClick={() => onNavigate('communications')}
        >
          <ChatCircleIcon size={20} />
          <span>Communications</span>
        </button>

        <button
          type="button"
          className={`sidebar-link ${activePage === 'reports' ? 'sidebar-link-active' : ''}`}
          onClick={() => onNavigate('reports')}
        >
          <FileTextIcon size={20} />
          <span>Reports</span>
        </button>

        <button type="button" className="sidebar-link">
          <WarningIcon size={20} />
          <span>Emergency</span>
        </button>

        <button type="button" className="sidebar-link">
          <MapPinIcon size={20} />
          <span>Navigation</span>
        </button>

        <button type="button" 
          className={`sidebar-link ${activePage === 'events' ? 'sidebar-link-active' : ''}`}
          onClick={() => onNavigate('events')}
        >
          <CalendarIcon size={20} />
          <span>Events</span>
        </button>

        <button type="button" className="sidebar-link sidebar-link-secondary">
          <DeviceMobileIcon size={20} />
          <span>App Management</span>
        </button>

        <button type="button" className="sidebar-link sidebar-link-secondary">
          <GearIcon size={20} />
          <span>Settings</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;