import { useState } from 'react';
import ReportsPage from './pages/ReportsPage';
import SendAlertPage from './pages/SendAlertPage';
import EventsPage from './pages/EventsPage';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('communications');

  if (activePage === 'reports') {
    return (
      <ReportsPage
        activePage={activePage}
        onNavigate={setActivePage}
      />
    );
  }

  if (activePage === 'communications') {
    return (
      <SendAlertPage
        activePage={activePage}
        onNavigate={setActivePage}
      />
    );
  }

  return (
    <EventsPage
      activePage={activePage}
      onNavigate={setActivePage}
    />    
  );

}

export default App;