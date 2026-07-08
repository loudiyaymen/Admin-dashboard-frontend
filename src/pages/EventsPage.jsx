import {
  ArrowLeftIcon,
  PencilSimpleIcon,
  PlusCircleIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import AdminHeader from "../Components/AdminHeader";
import CreateEventForm from "../Components/CreateEventForm";
import Sidebar from "../Components/Sidebar";
import safetyDrillImage from "../assets/safetyDrill.png";

const baseEventsData = {
  summary: {
    totalParticipants: 342,
    completedThisMonth: 8,
    avgAttendance: "85%",
  },
  upcomingEvents: [
    {
      id: 1,
      title: "Fire Safety Drill",
      schedule: "2026-02-05 at 10:00",
      location: "All Buildings",
      capacity: null,
      registeredLabel: null,
      type: "Safety Drill",
      date: "2026-02-05",
      time: "10:00",
      eventFee: "No fee",
      details:
        "Campus-wide drill focusing on evacuation routes, assembly points, and floor marshal responsibilities.",
      coverImage: safetyDrillImage,
      participants: [
        { id: "p-1", name: "John Smith", email: "smith@algonquinlive.com" },
        { id: "p-2", name: "Sarah Johnson", email: "john@algonquinlive.com" },
        { id: "p-3", name: "Michael Brown", email: "brown@algonquinlive.com" },
      ],
    },
    {
      id: 2,
      title: "Security Training Workshop",
      schedule: "2026-02-05 at 10:00",
      location: "Jack Doyle Recreation centre",
      capacity: "15 max",
      registeredLabel: "12 registered",
      type: "Training Workshop",
      date: "2026-02-05",
      time: "10:00",
      eventFee: "$15",
      details:
        "Hands-on training on incident reporting, lockdown protocol, and emergency communication workflows.",
      coverImage: safetyDrillImage,
      participants: [
        { id: "p-4", name: "Nora Williams", email: "nora@algonquinlive.com" },
        { id: "p-5", name: "Liam Carter", email: "liam@algonquinlive.com" },
      ],
    },
    {
      id: 3,
      title: "Fire Extinguisher Hunt",
      schedule: "2026-02-06 at 10:00",
      location: "All Buildings",
      capacity: "Unlimited",
      registeredLabel: "3 registered",
      type: "Scavenger Hunt",
      date: "2026-02-02",
      time: "15:00",
      eventFee: "No fee",
      details:
        "Find a fire extinguisher around campus and fill out the form to participate in a raffle!",
      coverImage: safetyDrillImage,
      participants: [
        { id: "p-6", name: "John Smith", email: "smith@algonquinlive.com" },
        { id: "p-7", name: "Sarah Johnson", email: "john@algonquinlive.com" },
        { id: "p-8", name: "Michael Brown", email: "brown@algonquinlive.com" },
      ],
    },
    {
      id: 4,
      title: "Emergency Response Meeting",
      schedule: "2026-02-15 at 13:00",
      location: "Conference Room B",
      capacity: "20 max",
      registeredLabel: "10 registered",
      type: "Planning Meeting",
      date: "2026-02-15",
      time: "13:00",
      eventFee: "No fee",
      details:
        "Planning session to review incident command structure and communication escalation matrix.",
      coverImage: safetyDrillImage,
      participants: [
        { id: "p-9", name: "Aiden Young", email: "aiden@algonquinlive.com" },
        { id: "p-10", name: "Mia Davis", email: "mia@algonquinlive.com" },
      ],
    },
  ],
  historyEvents: [
    {
      id: 101,
      title: "Winter Safety Workshop",
      schedule: "2026-01-30",
      participantsLabel: "42 participants",
      status: "Completed",
    },
    {
      id: 102,
      title: "Emergency Evacuation Drill",
      schedule: "2026-02-05",
      participantsLabel: "32 participants",
      status: "Completed",
    },
  ],
};

function EventsPage({ activePage, onNavigate }) {
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [eventFormMode, setEventFormMode] = useState("create");
  const [selectedUpcomingEventId, setSelectedUpcomingEventId] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState(
    baseEventsData.upcomingEvents,
  );

  const statsCards = [
    {
      id: "s1",
      value: upcomingEvents.length,
      label: "Upcoming Events",
    },
    {
      id: "s2",
      value: baseEventsData.summary.totalParticipants,
      label: "Total Participants",
    },
    {
      id: "s3",
      value: baseEventsData.summary.completedThisMonth,
      label: "Completed this Month",
    },
    {
      id: "s4",
      value: baseEventsData.summary.avgAttendance,
      label: "Avg Attendance",
    },
  ];

  const selectedUpcomingEvent = upcomingEvents.find(
    (event) => event.id === selectedUpcomingEventId,
  );

  const selectedEventInfoRows = selectedUpcomingEvent
    ? [
        { label: "Date:", value: selectedUpcomingEvent.date },
        { label: "Time:", value: selectedUpcomingEvent.time },
        { label: "Type:", value: selectedUpcomingEvent.type },
        { label: "Location:", value: selectedUpcomingEvent.location },
        {
          label: "Maximum Participants:",
          value: selectedUpcomingEvent.capacity || "Unlimited",
        },
        { label: "Description:", value: selectedUpcomingEvent.details },
        { label: "Event fee:", value: selectedUpcomingEvent.eventFee },
      ]
    : [];

  function handleCreateButtonClick() {
    setEventFormMode("create");
    setShowCreateEvent(true);
  }

  function handleEditButtonClick() {
    setEventFormMode("edit");
    setShowCreateEvent(true);
  }

  function handleEventSubmit({ mode, event }) {
    if (mode === "edit") {
      setUpcomingEvents((currentEvents) =>
        currentEvents.map((currentEvent) =>
          currentEvent.id === event.id
            ? { ...currentEvent, ...event }
            : currentEvent,
        ),
      );
      setSelectedUpcomingEventId(event.id);
      return { updatedEventId: event.id };
    }

    const nextId =
      upcomingEvents.reduce(
        (maxId, currentEvent) => Math.max(maxId, currentEvent.id),
        0,
      ) + 1;

    setUpcomingEvents((currentEvents) => [
      ...currentEvents,
      {
        ...event,
        id: nextId,
        registeredLabel: event.registeredLabel || null,
        participants: event.participants || [],
        coverImage: event.coverImage || safetyDrillImage,
      },
    ]);

    setSelectedUpcomingEventId(nextId);
    return { createdEventId: nextId };
  }

  return (
    <div className="admin-layout">
      <AdminHeader />

      <div className="admin-body">
        <Sidebar activePage={activePage} onNavigate={onNavigate} />

        <main className="admin-content">
          <div className="standard-page-content">
            {selectedUpcomingEvent ? (
              <section className="event-details-page">
                <button
                  type="button"
                  className="event-details-back-link"
                  onClick={() => setSelectedUpcomingEventId(null)}
                >
                  <ArrowLeftIcon size={16} />
                  <span>Back to Events</span>
                </button>

                <h1 className="event-details-page-title">
                  {selectedUpcomingEvent.title}
                </h1>

                <section className="event-details-card">
                  <div className="event-details-card-header">
                    <h2>Event Details</h2>
                    <button
                      type="button"
                      className="event-add-button"
                      onClick={handleEditButtonClick}
                    >
                      <PencilSimpleIcon size={16} />
                      <span>Edit event</span>
                    </button>
                  </div>

                  <div className="event-details-info-list">
                    {selectedEventInfoRows.map((row) => (
                      <div key={row.label} className="event-details-info-row">
                        <span className="event-details-label">{row.label}</span>
                        <span className="event-details-value">{row.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="event-details-cover">
                    <h3>Cover image</h3>
                    <img
                      src={selectedUpcomingEvent.coverImage}
                      alt={`${selectedUpcomingEvent.title} cover`}
                    />
                  </div>
                </section>

                <section className="event-details-card">
                  <h2>Participants List</h2>

                  <div className="event-participants-list">
                    <div className="event-participants-header">
                      <span>Name</span>
                      <span>Email</span>
                    </div>

                    <div className="event-participants-rows">
                      {selectedUpcomingEvent.participants.map((participant) => (
                        <div
                          key={participant.id}
                          className="event-participants-row"
                        >
                          <span>{participant.name}</span>
                          <span>{participant.email}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </section>
            ) : (
              <>
                <div className="communications-header">
                  <div className="page-heading">
                    <h1>Events Management</h1>
                    <p>
                      Manage safety events, training sessions and participants
                      list
                    </p>
                  </div>

                  <button
                    type="button"
                    className="event-add-button"
                    onClick={handleCreateButtonClick}
                  >
                    <PlusCircleIcon size={20} />
                    <span>Add new event</span>
                  </button>
                </div>

                <div className="event-stats">
                  {statsCards.map((card) => (
                    <section key={card.id} className="event-stat-card">
                      <h2>{card.value}</h2>
                      <p>{card.label}</p>
                    </section>
                  ))}
                </div>

                <section className="event-section-card">
                  <h2 className="event-section-title">Upcoming Events</h2>

                  <div className="event-list">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="event-item">
                        <div className="event-item-left">
                          <h3>{event.title}</h3>

                          <div className="event-meta-row">
                            <span>{event.schedule}</span>
                            <span>{event.location}</span>
                            {event.capacity ? (
                              <span>{event.capacity}</span>
                            ) : null}
                          </div>
                        </div>

                        <div className="event-item-right">
                          {event.registeredLabel ? (
                            <span className="event-registered-text">
                              {event.registeredLabel}
                            </span>
                          ) : null}

                          <button
                            type="button"
                            className="event-link-button"
                            onClick={() => setSelectedUpcomingEventId(event.id)}
                          >
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
                    {baseEventsData.historyEvents.map((event) => (
                      <div key={event.id} className="event-item">
                        <div className="event-item-left">
                          <h3>{event.title}</h3>

                          <div className="event-meta-row">
                            <span>{event.schedule}</span>
                            <span>{event.participantsLabel}</span>
                          </div>
                        </div>

                        <div className="event-item-right">
                          <span className="event-status-badge">
                            {event.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        </main>
      </div>

      {showCreateEvent && (
        <CreateEventForm
          mode={eventFormMode}
          initialData={eventFormMode === "edit" ? selectedUpcomingEvent : null}
          onSubmitEvent={handleEventSubmit}
          onClose={() => setShowCreateEvent(false)}
        />
      )}
    </div>
  );
}

export default EventsPage;
