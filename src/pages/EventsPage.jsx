import { PlusCircleIcon } from '@phosphor-icons/react';
import AdminHeader from '../Components/AdminHeader';
import Sidebar from '../Components/Sidebar';
import CreateEventForm from '../Components/CreateEventForm';
import { useState } from 'react';

function EventsPage({ activePage, onNavigate }) {

    const [showCreateEvent, setShowCreateEvent] = useState(false);

const upcomingEvents = [
    {
        id: 1,
        title: 'Fire Safety Drill',
        date: '2026-02-15 10:00',
        location: 'All Buildings',
        capacity: '',
        registered: '',
    },
    {
        id: 2,
        title: 'Security Training Workshop',
        date: '2026-02-20 14:00',
        location: 'Jack Doyle Recreation Center',
        capacity: '15 max',
        registered: '12 registered',
    },
    {
        id: 3,
        title: 'Fire Extinguisher Hunt',
        date: '2026-02-25 09:00',
        location: 'All Buildings',
        capacity: 'Unlimited',
        registered: '18 registered',
    },
    {
        id: 4,
        title: 'Emergency Response Meeting',
        date: '2026-03-01 13:00',
        location: 'Building C, Room 102',
        capacity: '20 max',
        registered: '10 registered',
    }

];

const historyEvents = [
    {
        id: 1,
        title: 'Winter Weather Preparedness Workshop',
        date: '2026-01-10 11:00',
        participants: '42 attended'
    },
    {
        id: 2,
        title: 'Emergency Evacuation Drill',
        date: '2026-01-20 15:00',
        participants: 'All students and staff participated'
    }
];

return(
    <div className="admin-layout">
        <Sidebar activePage={activePage} onNavigate={onNavigate} />
        <main className="admin-content">
            <AdminHeader />
            <div className="standard-page-content">
                <div className="communications-header">
                    <div className="page-heading">
                        <h1>Events Management</h1>
                        <p>Manage  safety events, training sessions and participants list</p>
                    </div>

                    <button
                        type="button"
                        className="create-alert-button"
                        onClick={() => setShowCreateEvent(true)}
                    >
                       <PlusCircleIcon size={20} />
                       <span>Add new event</span>
                    </button>
                </div>

                <div className="events-stats">
                    <section className="event-stat-card">
                        <h2>15</h2>
                        <p>Upcoming Events</p>
                    </section>

                    <section className="event-stat-card">
                        <h2>265</h2>
                        <p>Total Participants</p>
                    </section>      
               
                     <section className="event-stat-card">
                        <h2>10</h2>
                        <p>Completed this Month</p>
                    </section>    

                     <section className="event-stat-card">
                        <h2>75%</h2>
                        <p>Avg Attendance</p>
                    </section>    
                </div>

            <section className="event-section-card">
            <h2 className="event-section-title">Upcoming Events</h2>

            <div className="event-list">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="event-item">
                  <div className="event-item-left">
                    <h3>{event.title}</h3>

                    <div className="event-meta-row">
                      <span>{event.date}</span>
                      <span>{event.location}</span>
                      {event.capacity ? <span>{event.capacity}</span> : null}
                    </div>
                  </div>

                  <div className="event-item-right">
                    {event.registered ? (
                      <span className="event-registered-text">{event.registered}</span>
                    ) : null}

                    <button type="button" className="event-link-button">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="event-section-card">
            <h2 className="event-section-title">Events history</h2>

            <div className="event-list">
              {historyEvents.map((event) => (
                <div key={event.id} className="event-item">
                  <div className="event-item-left">
                    <h3>{event.title}</h3>

                    <div className="event-meta-row">
                      <span>{event.date}</span>
                      <span>{event.participants}</span>
                    </div>
                  </div>

                  <div className="event-item-right">
                    <span className="event-status-badge">Completed</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {showCreateEvent && (
        <CreateEventForm onClose={() => setShowCreateEvent(false)} />
      )}
    </div>
  );
}

export default EventsPage;