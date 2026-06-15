import { useState } from 'react';
import { PlusCircleIcon } from '@phosphor-icons/react';
import AdminHeader from '../Components/AdminHeader';
import Sidebar from '../Components/Sidebar';
import SendAlertForm from '../Components/SendAlertForm';

function SendAlertPage({ activePage, onNavigate }) {
  const [showCreateForm, setShowCreateForm] = useState(false);

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
    }
  ];

  return (
    <div className="admin-layout">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />

      <main className="admin-content">
        <AdminHeader />

        <div className="standard-page-content">
          {!showCreateForm ? (
            <>
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

                <div className="notification-history-list">
                  {notifications.map((item) => (
                    <div key={item.id} className="notification-card">
                      <h3>{item.title}</h3>
                      <p className="notification-description">{item.description}</p>

                      <div className="notification-meta">
                        <span>Sent: {item.sentAt}</span>
                        <span>Recipients: {item.recipients}</span>
                      </div>

                      <p className="notification-type">{item.type}</p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <>
              <div className="communications-header">
                <div className="page-heading">
                  <h1>Create Alert</h1>
                  <p>Send a global push notification to users.</p>
                </div>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowCreateForm(false)}
                >
                  Back
                </button>
              </div>

              <SendAlertForm />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default SendAlertPage;