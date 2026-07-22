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
  drawEventWinner,
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
  const [campuses, setCampuses] = useState([]);
  const [campusId, setCampusId] = useState(searchParams.get("campusId") || "");
  const [errorMessage, setErrorMessage] = useState("");
  const [winnerMessage, setWinnerMessage] = useState("");
  const [isDrawingWinner, setIsDrawingWinner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function loadEvents() {
    setErrorMessage("");
    try {
      const [events, campuses] = await Promise.all([
        fetchEvents(),
        fetchCampuses(),
      ]);
      setUpcomingEvents(events);
      setCampuses(campuses);
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
      value: approvedEvents.reduce(
        (total, event) => total + (event.participants?.length || 0),
        0,
      ),
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

  const selectedEventParticipants = selectedUpcomingEvent?.participants || [];

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

  async function handleDrawWinner() {
    if (!selectedUpcomingEvent) return;

    setIsDrawingWinner(true);
    setErrorMessage("");
    setWinnerMessage("");

    try {
      const result = await drawEventWinner(selectedUpcomingEvent.id);
      const winner = result?.winner;
      const winnerName = winner?.name || winner?.deviceId || "Unknown winner";
      const winnerEmail = winner?.email ? ` (${winner.email})` : "";

      setWinnerMessage(
        `Winner selected: ${winnerName}${winnerEmail}. Participants: ${result?.participantCount ?? selectedEventParticipants.length}`,
      );
    } catch (error) {
      setErrorMessage(error.message || "Failed to draw a winner");
    } finally {
      setIsDrawingWinner(false);
    }
  }

  function handleEventSubmit({ mode, event }) {
    const selectedCampusId = event.campusId || campusId;

    if (!selectedCampusId) {
      const noCampusMessage = "No campus available. Create a campus first.";
      setErrorMessage(noCampusMessage);
      return;
    }

    const eventDate = new Date(`${event.date}T${event.time || "00:00"}:00`);
    if (Number.isNaN(eventDate.getTime())) {
      const invalidMessage = "Please enter a valid date and time.";
      setErrorMessage(invalidMessage);
      return;
    }

    const registrationStartAt = new Date(
      `${event.registrationStartDate}T${event.registrationStartTime || "00:00"}:00`,
    );
    const registrationEndAt = new Date(
      `${event.registrationEndDate}T${event.registrationEndTime || "00:00"}:00`,
    );

    if (
      Number.isNaN(registrationStartAt.getTime()) ||
      Number.isNaN(registrationEndAt.getTime())
    ) {
      setErrorMessage("Please enter valid registration start and end dates.");
      return;
    }

    const capacityRaw = String(event.capacity || "");
    const parsedCapacity = parseInt(capacityRaw, 10);
    const isUnlimited = capacityRaw.toLowerCase() === "unlimited";
    const feeRaw = String(event.eventFee || "").replace(/[^0-9.]/g, "");
    const feeCents = feeRaw ? Math.round(parseFloat(feeRaw) * 100) : null;

    const apiPayload = {
      title: event.title,
      event_date: eventDate.toISOString(),
      campus_id: selectedCampusId,
      host_type: "admin",
      event_type: event.type,
      description: event.details || "",
      location_text: event.location || "",
      registration_start_at: registrationStartAt.toISOString(),
      registration_end_at: registrationEndAt.toISOString(),
      max_participants: isUnlimited
        ? null
        : Number.isNaN(parsedCapacity)
          ? null
          : parsedCapacity,
      is_unlimited: isUnlimited,
      event_url: event.url || "",
      fee_cents: Number.isFinite(feeCents) ? feeCents : null,
      event_image_url: event.eventImage ? null : event.coverImage || null,
      eventImage: event.eventImage || null,
    };

    if (mode === "edit") {
      updateEvent(event.id, apiPayload)
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

    createEvent(apiPayload)
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
                  <div className="event-details-card-header">
                    <h2>Participants List</h2>

                    <button
                      type="button"
                      className="event-add-button"
                      onClick={handleDrawWinner}
                      disabled={
                        isDrawingWinner || selectedEventParticipants.length === 0
                      }
                    >
                      <span>
                        {isDrawingWinner ? "Drawing winner..." : "Draw winner"}
                      </span>
                    </button>
                  </div>

                  {winnerMessage ? (
                    <p className="app-message-success">{winnerMessage}</p>
                  ) : null}

                  <div className="event-participants-list">
                    <div className="event-participants-header">
                      <span>Name</span>
                      <span>Email</span>
                    </div>

                    <div className="event-participants-rows">
                      {selectedEventParticipants.length === 0 ? (
                        <p>No registrations yet.</p>
                      ) : (
                        selectedEventParticipants.map((participant) => (
                          <div
                            key={participant.id}
                            className="event-participants-row"
                          >
                            <span>{participant.name}</span>
                            <span>{participant.email || participant.deviceId}</span>
                          </div>
                        ))
                      )}
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
          campuses={campuses}
          onSubmitEvent={handleEventSubmit}
          onClose={() => setShowCreateEvent(false)}
        />
      )}
    </div>
  );
}

export default EventsPage;
