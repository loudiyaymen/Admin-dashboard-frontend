import {
  ArrowLeftIcon,
  PencilSimpleIcon,
  PlusCircleIcon,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AdminHeader from "../Components/AdminHeader";
import CreateEventForm from "../Components/CreateEventForm";
import Sidebar from "../Components/Sidebar";
import safetyDrillImage from "../assets/safetyDrill.png";
import {
  createEvent,
  fetchCampuses,
  fetchEvents,
  updateEvent,
} from "../services/eventsService";

const baseSummary = {
  totalParticipants: 0,
  completedThisMonth: 0,
  avgAttendance: "-",
};

function EventsPage({ headerProps }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [eventFormMode, setEventFormMode] = useState("create");
  const [selectedUpcomingEventId, setSelectedUpcomingEventId] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [campusId, setCampusId] = useState(searchParams.get("campusId") || "");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function loadEvents() {
    setErrorMessage("");
    try {
      const [events, campuses] = await Promise.all([
        fetchEvents(),
        fetchCampuses(),
      ]);
      setUpcomingEvents(events);
      if (campuses.length > 0) {
        setCampusId(campuses[0].campus_id);
      }
    } catch (error) {
      setErrorMessage(error.message || "Failed to load events");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (campusId) {
      setSearchParams({ campusId });
    } else {
      setSearchParams({});
    }
  }, [campusId, setSearchParams]);

  const historyEvents = useMemo(
    () =>
      upcomingEvents
        .filter((event) => !event.isApproved)
        .map((event) => ({
          id: `${event.id}-history`,
          title: event.title,
          schedule: event.date,
          participantsLabel: "-",
          status: "Pending",
        })),
    [upcomingEvents],
  );

  const approvedEvents = useMemo(
    () => upcomingEvents.filter((event) => event.isApproved),
    [upcomingEvents],
  );

  const statsCards = [
    {
      id: "s1",
      value: approvedEvents.length,
      label: "Upcoming Events",
    },
    {
      id: "s2",
      value: baseSummary.totalParticipants,
      label: "Total Participants",
    },
    {
      id: "s3",
      value: baseSummary.completedThisMonth,
      label: "Completed this Month",
    },
    {
      id: "s4",
      value: baseSummary.avgAttendance,
      label: "Avg Attendance",
    },
  ];

  const selectedUpcomingEvent = approvedEvents.find(
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
    const eventDate = new Date(`${event.date}T${event.time || "00:00"}:00`);
    if (Number.isNaN(eventDate.getTime())) {
      const invalidMessage = "Please enter a valid date and time.";
      setErrorMessage(invalidMessage);
      return;
    }

    if (mode === "edit") {
      updateEvent(event.id, {
        title: event.title,
        event_date: eventDate.toISOString(),
      })
        .then((updated) => {
          setErrorMessage("");
          setUpcomingEvents((currentEvents) =>
            currentEvents.map((currentEvent) =>
              currentEvent.id === updated.id ? updated : currentEvent,
            ),
          );
          setSelectedUpcomingEventId(updated.id);
        })
        .catch((error) => {
          setErrorMessage(error.message || "Failed to update event");
        });
      return;
    }

    if (!campusId) {
      const noCampusMessage = "No campus available. Create a campus first.";
      setErrorMessage(noCampusMessage);
      return;
    }

    createEvent({
      title: event.title,
      event_date: eventDate.toISOString(),
      campus_id: campusId,
      host_type: "admin",
    })
      .then((created) => {
        setErrorMessage("");
        setUpcomingEvents((currentEvents) => [...currentEvents, created]);
        setSelectedUpcomingEventId(created.id);
      })
      .catch((error) => {
        setErrorMessage(error.message || "Failed to create event");
      });
  }

  return (
    <div className="admin-layout">
      <AdminHeader {...headerProps} />

      <div className="admin-body">
        <Sidebar />

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
                      src={selectedUpcomingEvent.coverImage || safetyDrillImage}
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
                  {isLoading ? <p>Loading events...</p> : null}
                  {errorMessage ? (
                    <p className="app-message-error">{errorMessage}</p>
                  ) : null}

                  <div className="event-list">
                    {approvedEvents.length === 0 ? (
                      <p>No approved events found.</p>
                    ) : (
                      approvedEvents.map((event) => (
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
                              onClick={() =>
                                setSelectedUpcomingEventId(event.id)
                              }
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <section className="event-section-card">
                  <h2 className="event-section-title">Events history</h2>

                  <div className="event-list">
                    {historyEvents.length === 0 ? (
                      <p>No pending event approvals.</p>
                    ) : (
                      historyEvents.map((event) => (
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
                      ))
                    )}
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
