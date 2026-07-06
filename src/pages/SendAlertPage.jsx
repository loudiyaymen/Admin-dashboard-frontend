import { useMemo, useState } from 'react';
import { PlusCircleIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import AdminHeader from '../Components/AdminHeader';
import Sidebar from '../Components/Sidebar';
import SendAlertForm from '../Components/SendAlertForm';

function SendAlertPage({ activePage, onNavigate }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const notifications = [
    {
      id: 1,
      title: 'Campus Weather Alert',
      description: 'Severe winter storm warning in effect',
      sentAt: '2026-02-02 08:00',
      recipients: 2845,
      type: 'Push Notification'
    },
    {
      id: 2,
      title: 'Security Update',
      description: 'New security measures implemented',
      sentAt: '2026-01-24 15:00',
      recipients: 2234,
      type: 'Push Notification'
    },
    {
      id: 3,
      title: 'Emergency: Building Evacuation',
      description: 'Please evacuate building C immediately',
      sentAt: '2026-01-14 12:00',
      recipients: 2844,
      type: 'Push Notification'
    },
    {
      id: 4,
      title: 'Event Reminder',
      description: 'Fire safety drill tomorrow at 10am',
      sentAt: '2026-01-02 10:30',
      recipients: 2234,
      type: 'Push Notification'
    },
    {
      id: 5,
      title: 'Campus Safety Reminder',
      description: 'Please review after-hours safety procedures',
      sentAt: '2025-12-18 09:15',
      recipients: 2140,
      type: 'Push Notification'
    }
  ];

  const filteredNotifications = useMemo(() => {
    const text = searchText.toLowerCase();

    return notifications.filter((item) => {
      return (
        item.title.toLowerCase().includes(text) ||
        item.description.toLowerCase().includes(text)
      );
    });
  }, [searchText]);

  const itemsPerPage = 2;
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage) || 1;

  const visibleNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function handleSearchChange(event) {
    setSearchText(event.target.value);
    setCurrentPage(1);
  }

  return (
    <div className="admin-layout">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />

      <main className="admin-content">
        <AdminHeader />

        <div className="standard-page-content">
          <div className="communications-header">
            <div className="page-heading">
              <h1>Communications</h1>
              <p>Push notification, alerts and notification history.</p>
            </div>

            <button
              type="button"
              className="create-alert-button"
              onClick={() => setShowCreateForm(true)}
            >
              <PlusCircleIcon size={20} />
              <span>Create alert</span>
            </button>
          </div>

          <div className="communication-stats">
            <section className="analytics-card">
              <h3>Total Sent</h3>
              <h2>67</h2>
              <p>+8 this week</p>
            </section>

            <section className="analytics-card">
              <h3>Open Rate</h3>
              <h2>76%</h2>
              <p>Average</p>
            </section>

            <section className="analytics-card">
              <h3>Critical Alerts</h3>
              <h2>3</h2>
              <p>Last 30 days</p>
            </section>
          </div>

          <section className="panel-card">
            <h2 className="panel-title">Notification History</h2>

       <div className="notification-search-wrap">
       <div className="search-input-wrapper notification-search">
       <MagnifyingGlassIcon size={20} className="search-icon" />
          <input
             type="text"
            placeholder="Search notifications"
            value={searchText}
            onChange={handleSearchChange}
          />
        </div>
        </div>

            <div className="notification-history-list">
              {visibleNotifications.length === 0 ? (
                <p>No notifications found.</p>
              ) : (
                visibleNotifications.map((item) => (
                  <div key={item.id} className="notification-card">
                    <h3>{item.title}</h3>
                    <p className="notification-description">{item.description}</p>

                    <div className="notification-meta">
                      <span>Sent: {item.sentAt}</span>
                      <span>Recipients: {item.recipients}</span>
                    </div>

                    <p className="notification-type">{item.type}</p>
                  </div>
                ))
              )}
            </div>

            <div className="pagination">
              <button
                type="button"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </section>
        </div>
      </main>

      {showCreateForm && (
        <SendAlertForm onClose={() => setShowCreateForm(false)} />
      )}
    </div>
  );
}

export default SendAlertPage;