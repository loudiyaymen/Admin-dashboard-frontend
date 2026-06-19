import { useState } from 'react';
import ReportsPage from './pages/ReportsPage';
import SendAlertPage from './pages/SendAlertPage';
import EventsPage from './pages/EventsPage';
import NavigationPage from './pages/NavigationPage';
import EmergencyPage from './pages/EmergencyPage';
import DashboardPage from './pages/DashboardPage';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  switch (activePage) {
    case 'dashboard':
      return (
        <DashboardPage
          activePage={activePage}
          onNavigate={setActivePage}
        />
      );

    case 'communications':
      return (
        <SendAlertPage
          activePage={activePage}
          onNavigate={setActivePage}
        />
      );

    case 'reports':
      return (
        <ReportsPage
          activePage={activePage}
          onNavigate={setActivePage}
        />
      );

    case 'emergency':
      return (
        <EmergencyPage
          activePage={activePage}
          onNavigate={setActivePage}
        />
      );

    case 'navigation':
      return (
        <NavigationPage
          activePage={activePage}
          onNavigate={setActivePage}
        />
      );

    case 'events':
      return (
        <EventsPage
          activePage={activePage}
          onNavigate={setActivePage}
        />
      );

    default:
      return (
        <DashboardPage
          activePage={activePage}
          onNavigate={setActivePage}
        />
      );
  }
}

export default App;