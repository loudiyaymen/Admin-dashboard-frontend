import { useState } from 'react';
import ReportsPage from './pages/ReportsPage';
import SendAlertPage from './pages/SendAlertPage';
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

  return (
    <SendAlertPage
      activePage={activePage}
      onNavigate={setActivePage}
    />
  );
}

export default App;