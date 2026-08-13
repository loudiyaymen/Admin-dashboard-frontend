import { useEffect, useMemo, useState } from "react";
import {
  XIcon,
  CaretDownIcon,
  CheckIcon,
  ExclamationMarkIcon,
} from "@phosphor-icons/react";
import { sendAlert } from "../services/alertsservice";
import { fetchBuildings } from "../services/buildingService";
import { fetchEvents } from "../services/eventsService";
import { isNonEmptyString } from "../utils/formValidation";

const DEFAULT_BUILDING_NAMES = [
  "Building A",
  "Building B",
  "Building C",
  "Building CA",
  "Building D",
  "Building E",
  "Building F",
  "Building H",
  "Building J",
  "Building N",
  "Building P",
  "Building T",
  "Building V",
  "Building X",
  "Building Z",
];

function normalizeBuildingName(name) {
  return String(name || "")
    .trim()
    .toLowerCase();
}

function createFallbackBuildings() {
  return DEFAULT_BUILDING_NAMES.map((name) => ({
    building_id: normalizeBuildingName(name).replace(/\s+/g, "-"),
    name,
  }));
}

function isUpcomingApprovedEvent(event, nowTime) {
  if (!event?.isApproved) return false;
  const eventDateValue = String(event?.raw?.event_date || "").trim();
  if (!eventDateValue) return true;

  const parsed = new Date(eventDateValue);
  if (Number.isNaN(parsed.getTime())) return true;

  return parsed.getTime() >= nowTime;
}

function SendAlertForm({ onClose, onAlertSent }) {
  const [formData, setFormData] = useState({
    alertTitle: "",
    building: "",
    message: "",
  });

  const [modalStep, setModalStep] = useState("form");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [buildings, setBuildings] = useState([]);
  const [buildingSearch, setBuildingSearch] = useState("");
  const [selectedBuildings, setSelectedBuildings] = useState([]);
  const [isBuildingDropdownOpen, setIsBuildingDropdownOpen] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [hasUpcomingEvents, setHasUpcomingEvents] = useState(true);
  const [, setBuildingsLoading] = useState(true);

  useEffect(() => {
    async function loadBuildings() {
      try {
        setBuildingsLoading(true);
        const buildingData = await fetchBuildings();
        const orderedBuildings = DEFAULT_BUILDING_NAMES.map((name) => {
          const matchedBuilding = buildingData.find(
            (building) =>
              normalizeBuildingName(building.name) ===
              normalizeBuildingName(name),
          );

          return (
            matchedBuilding || {
              building_id: normalizeBuildingName(name).replace(/\s+/g, "-"),
              name,
            }
          );
        });

        setBuildings(orderedBuildings);
      } catch (error) {
        console.error("Failed to load buildings:", error);
        setBuildings(createFallbackBuildings());
      } finally {
        setBuildingsLoading(false);
      }
    }

    loadBuildings();
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadEvents() {
      try {
        const events = await fetchEvents();
        if (!mounted) return;

        const nowTime = Date.now();
        const hasUpcoming = events.some((event) =>
          isUpcomingApprovedEvent(event, nowTime),
        );
        setHasUpcomingEvents(hasUpcoming);
      } catch {
        if (mounted) {
          setHasUpcomingEvents(true);
        }
      }
    }

    loadEvents();

    return () => {
      mounted = false;
    };
  }, []);

  const alertTypeConfig = {
    "Campus Weather Alert": {
      requiresBuilding: false,
      buildMessage: () =>
        "Campus weather alert in effect. Please monitor official channels and use caution while moving between buildings.",
    },
    "Security Update": {
      requiresBuilding: false,
      buildMessage: () =>
        "Campus security update issued. Please review the latest guidance and follow posted instructions.",
    },
    "Emergency Alert": {
      requiresBuilding: true,
      buildMessage: (building) =>
        `Emergency alert for ${building}. Follow safety instructions immediately.`,
    },
    "Event Reminder": {
      requiresBuilding: true,
      buildMessage: (building) =>
        `Event reminder for ${building}. Check the latest schedule and arrival instructions.`,
    },
    "Fire Alarm": {
      requiresBuilding: true,
      buildMessage: (building) =>
        `Fire alarm triggered in ${building}. Evacuate immediately using the nearest safe exit.`,
    },
    Evacuation: {
      requiresBuilding: true,
      buildMessage: (building) =>
        `Evacuation notice for ${building}. Leave the area immediately and proceed to the designated assembly point.`,
    },
    Flooding: {
      requiresBuilding: true,
      buildMessage: (building) =>
        `Flooding alert for ${building}. Avoid affected areas and follow staff direction for safe routing.`,
    },
    "Power Outage": {
      requiresBuilding: true,
      buildMessage: (building) =>
        `Power outage reported in ${building}. Stay calm and follow emergency lighting and campus staff instructions.`,
    },
  };

  const alertTypeOptions = Object.keys(alertTypeConfig).filter(
    (alertType) => alertType !== "Event Reminder" || hasUpcomingEvents,
  );

  const buildingMap = {};
  buildingMap["All Buildings"] = null;
  buildings.forEach((b) => {
    buildingMap[b.name] = b.building_id;
  });

  const buildingOptions = useMemo(
    () => ["All Buildings", ...buildings.map((b) => b.name)],
    [buildings],
  );

  const buildingMatches = useMemo(() => {
    const query = buildingSearch.trim().toLowerCase();
    const availableBuildings = buildingOptions.filter(
      (building) => !selectedBuildings.includes(building),
    );

    if (!query) {
      return availableBuildings;
    }

    return availableBuildings.filter((building) =>
      building.toLowerCase().includes(query),
    );
  }, [buildingOptions, buildingSearch, selectedBuildings]);

  const selectedAlertConfig = alertTypeConfig[formData.alertTitle] || null;
  const requiresBuilding = selectedAlertConfig?.requiresBuilding || false;

  useEffect(() => {
    if (hasUpcomingEvents) return;
    if (formData.alertTitle !== "Event Reminder") return;

    // Prevent stale "Event Reminder" state when no future approved events exist.
    setFormData((currentData) => ({
      ...currentData,
      alertTitle: "",
      message: "",
    }));
  }, [formData.alertTitle, hasUpcomingEvents]);

  const validationErrors = useMemo(() => {
    const errors = {};
    const hasValidBuildingSelection = selectedBuildings.length > 0;

    if (!isNonEmptyString(formData.alertTitle)) {
      errors.alertTitle = "Choose an alert type.";
    }

    if (requiresBuilding) {
      if (!hasValidBuildingSelection) {
        errors.building = "Choose a building from the list.";
      }
    }

    if (!isNonEmptyString(formData.message)) {
      errors.message = "Enter an alert message.";
    } else if (formData.message.trim().length > 5000) {
      errors.message = "Alert messages must be 5000 characters or fewer.";
    }

    return errors;
  }, [
    formData.alertTitle,
    formData.message,
    requiresBuilding,
    selectedBuildings.length,
  ]);

  function shouldShowError(field) {
    return Boolean(hasSubmitted || touchedFields[field]);
  }

  function getAutoMessage(alertTitle, buildingsSelection = selectedBuildings) {
    const selectedAlert = alertTypeConfig[alertTitle];

    if (!selectedAlert) {
      return "";
    }

    if (selectedAlert.requiresBuilding) {
      let selectedBuildingLabel = "the selected location";

      if (buildingsSelection.includes("All Buildings")) {
        selectedBuildingLabel = "all buildings";
      } else if (buildingsSelection.length === 1) {
        selectedBuildingLabel = buildingsSelection[0];
      } else if (buildingsSelection.length > 1) {
        selectedBuildingLabel = `${buildingsSelection.join(", ")}`;
      }

      return selectedAlert.buildMessage(selectedBuildingLabel);
    }

    return selectedAlert.buildMessage();
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => {
      const updatedData = {
        ...currentData,
        [name]: value,
      };

      if (name === "alertTitle") {
        const nextAlertConfig = alertTypeConfig[value];
        if (!nextAlertConfig?.requiresBuilding) {
          updatedData.building = "All Buildings";
          setSelectedBuildings(["All Buildings"]);
          setBuildingSearch("All Buildings");
          setIsBuildingDropdownOpen(false);
        } else if (selectedBuildings.includes("All Buildings")) {
          setSelectedBuildings([]);
          setBuildingSearch("");
          updatedData.building = "";
        } else if (
          !currentData.building ||
          currentData.building === "All Buildings"
        ) {
          setBuildingSearch("");
          updatedData.building = "";
        }
        updatedData.message = getAutoMessage(value, selectedBuildings);
      }

      return updatedData;
    });
  }

  function addBuildingSelection(building) {
    setSelectedBuildings((current) => {
      let nextSelection;

      if (building === "All Buildings") {
        nextSelection = ["All Buildings"];
      } else {
        const withoutAllBuildings = current.filter(
          (item) => item !== "All Buildings",
        );
        if (withoutAllBuildings.includes(building)) {
          nextSelection = withoutAllBuildings;
        } else {
          nextSelection = [...withoutAllBuildings, building];
        }
      }

      setFormData((currentData) => ({
        ...currentData,
        building,
        // Keep message template synchronized with current multi-building selection.
        message: getAutoMessage(currentData.alertTitle, nextSelection),
      }));

      return nextSelection;
    });

    setBuildingSearch("");
    setIsBuildingDropdownOpen(false);
  }

  function removeBuildingSelection(buildingToRemove) {
    setSelectedBuildings((current) => {
      const next = current.filter((building) => building !== buildingToRemove);
      setFormData((currentData) => ({
        ...currentData,
        message: getAutoMessage(currentData.alertTitle, next),
      }));
      return next;
    });
  }

  function clearBuildingSelection() {
    setSelectedBuildings([]);
    setBuildingSearch("");
    setFormData((currentData) => ({
      ...currentData,
      building: "",
      message: getAutoMessage(currentData.alertTitle, []),
    }));
    setTouchedFields((current) => ({ ...current, building: true }));
  }

  function handleBlur(field) {
    setTouchedFields((current) => ({
      ...current,
      [field]: true,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setHasSubmitted(true);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    setModalStep("confirm-send");
  }

  const isFormValid = Object.keys(validationErrors).length === 0;

  function handleBackToForm() {
    setModalStep("form");
  }

  function resetFormToDefaults() {
    setFormData({
      alertTitle: "",
      building: "",
      message: "",
    });
    setBuildingSearch("");
    setSelectedBuildings([]);
    setIsBuildingDropdownOpen(false);
    setTouchedFields({});
    setHasSubmitted(false);
    setSendError("");
    setModalStep("form");
  }

  async function handleConfirmSend() {
    try {
      setSendError("");
      setIsSending(true);

      // Multi-building sends are fanned out into one alert per selected building.
      const targets =
        !requiresBuilding || selectedBuildings.includes("All Buildings")
          ? [null]
          : selectedBuildings
              .map((buildingName) => buildingMap[buildingName] ?? null)
              .filter(Boolean);

      await Promise.all(
        targets.map((buildingId) =>
          sendAlert({
            message: formData.message,
            alert_type: formData.alertTitle || null,
            building_id: buildingId,
          }),
        ),
      );

      if (onAlertSent) {
        await onAlertSent();
      }

      setModalStep("sent-success");
    } catch (error) {
      setSendError(error.message || "Failed to send alert");
      setModalStep("form");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="alert-modal-overlay">
      <div
        className={`alert-modal ${modalStep !== "form" ? "alert-modal-confirm" : ""} ${
          modalStep === "confirm-send" ? "alert-modal-send" : ""
        } ${modalStep === "confirm-cancel" ? "alert-modal-cancel" : ""} ${
          modalStep === "sent-success" ? "alert-modal-success" : ""
        }`}
      >
        {modalStep === "form" && (
          <>
            <div className="alert-modal-header">
              <h2>Create Alert</h2>

              <button
                type="button"
                className="alert-close-button"
                onClick={onClose}
              >
                <XIcon size={24} />
              </button>
            </div>

            <form className="alert-form" onSubmit={handleSubmit} noValidate>
              <label className="alert-field">
                <span>
                  Alert Title <span className="required-mark">*</span>
                </span>

                <div className="select-wrapper">
                  <select
                    className={
                      shouldShowError("alertTitle") &&
                      validationErrors.alertTitle
                        ? "event-input event-input-error"
                        : "event-input"
                    }
                    name="alertTitle"
                    value={formData.alertTitle}
                    onChange={handleChange}
                    onBlur={() => handleBlur("alertTitle")}
                  >
                    <option value="">Select an option</option>
                    {alertTypeOptions.map((alertType) => (
                      <option key={alertType} value={alertType}>
                        {alertType}
                      </option>
                    ))}
                  </select>

                  <CaretDownIcon size={20} className="select-icon" />
                </div>
                {shouldShowError("alertTitle") &&
                validationErrors.alertTitle ? (
                  <p className="field-error-text">
                    {validationErrors.alertTitle}
                  </p>
                ) : null}
              </label>

              {requiresBuilding && (
                <label className="alert-field">
                  <span>
                    Building <span className="required-mark">*</span>
                  </span>

                  <div className="building-dropdown-wrap">
                    <div className="building-input-row">
                      <input
                        className={
                          shouldShowError("building") &&
                          validationErrors.building
                            ? "event-input event-input-error building-input"
                            : "event-input building-input"
                        }
                        type="text"
                        name="building"
                        value={buildingSearch}
                        onChange={(event) => {
                          const value = event.target.value;
                          setBuildingSearch(value);
                          setIsBuildingDropdownOpen(true);
                        }}
                        onFocus={() => setIsBuildingDropdownOpen(true)}
                        onClick={() => setIsBuildingDropdownOpen(true)}
                        onBlur={() => {
                          handleBlur("building");
                          window.setTimeout(() => {
                            setIsBuildingDropdownOpen(false);
                          }, 120);
                        }}
                        placeholder="Search buildings"
                      />

                      <button
                        type="button"
                        className="alert-cancel-button building-clear-button"
                        onClick={clearBuildingSelection}
                        disabled={selectedBuildings.length === 0}
                      >
                        Clear
                      </button>
                    </div>

                    <div className="building-selected-list">
                      {selectedBuildings.map((building) => (
                        <button
                          key={building}
                          type="button"
                          className="building-selected-chip"
                          onClick={() => removeBuildingSelection(building)}
                        >
                          {building} <XIcon size={14} />
                        </button>
                      ))}
                    </div>

                    {isBuildingDropdownOpen ? (
                      <div
                        className="building-dropdown"
                        role="listbox"
                        aria-label="Building options"
                      >
                        {buildingMatches.length > 0 ? (
                          buildingMatches.map((building) => (
                            <button
                              key={building}
                              type="button"
                              className="building-dropdown-item"
                              onMouseDown={(event) => event.preventDefault()}
                              onClick={() => addBuildingSelection(building)}
                            >
                              {building}
                            </button>
                          ))
                        ) : (
                          <div className="building-dropdown-empty">
                            No buildings found.
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                  {shouldShowError("building") && validationErrors.building ? (
                    <p className="field-error-text">
                      {validationErrors.building}
                    </p>
                  ) : null}
                </label>
              )}

              <label className="alert-field">
                <span>
                  Alert Message <span className="required-mark">*</span>
                </span>

                <textarea
                  className={
                    shouldShowError("message") && validationErrors.message
                      ? "event-input event-input-error"
                      : "event-input"
                  }
                  name="message"
                  placeholder="Enter alert message"
                  rows="6"
                  maxLength="5000"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={() => handleBlur("message")}
                />
                {shouldShowError("message") && validationErrors.message ? (
                  <p className="field-error-text">{validationErrors.message}</p>
                ) : null}
              </label>

              <p className="character-count">
                {formData.message.length} / 5000 Characters
              </p>

              <div className="alert-modal-actions">
                <button
                  type="button"
                  className="alert-cancel-button"
                  onClick={resetFormToDefaults}
                >
                  Reset
                </button>

                <button
                  type="submit"
                  className={`alert-submit-button ${
                    isFormValid ? "active" : ""
                  }`}
                  disabled={!isFormValid}
                >
                  Send Alert
                </button>
              </div>
            </form>
          </>
        )}

        {modalStep === "confirm-send" && (
          <div className="alert-confirm-content alert-confirm-send-content">
            <div className="alert-status-icon alert-status-icon-warning">
              <ExclamationMarkIcon size={44} weight="regular" />
            </div>

            <div className="alert-confirm-text">
              <h2>Send Alert</h2>
              <p>Are you sure you want to send this alert?</p>
            </div>

            <div className="alert-modal-actions">
              <button
                type="button"
                className="alert-cancel-button"
                onClick={handleBackToForm}
              >
                Cancel
              </button>

              <button
                type="button"
                className="alert-submit-button active"
                onClick={handleConfirmSend}
                disabled={isSending}
              >
                <CheckIcon size={28} weight="bold" />
                {isSending ? "Sending..." : "Send alert"}
              </button>
            </div>
          </div>
        )}

        {sendError ? <p className="app-message-error">{sendError}</p> : null}

        {modalStep === "confirm-cancel" && (
          <div className="alert-confirm-content alert-confirm-cancel-content">
            <div className="alert-status-icon alert-status-icon-warning">
              <ExclamationMarkIcon size={44} weight="regular" />
            </div>

            <div className="alert-confirm-text">
              <h2>Cancel Alert</h2>
              <p>Are you sure you want to cancel this alert?</p>
            </div>

            <div className="alert-modal-actions">
              <button
                type="button"
                className="alert-cancel-button"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="button"
                className="alert-submit-button active"
                onClick={handleBackToForm}
              >
                <ArrowLeftIcon size={28} weight="bold" />
                Go back to create alert
              </button>
            </div>
          </div>
        )}

        {modalStep === "sent-success" && (
          <div className="alert-confirm-content alert-confirm-success-content">
            <div className="alert-status-icon alert-status-icon-success">
              <CheckIcon size={44} weight="regular" />
            </div>

            <div className="alert-confirm-text">
              <h2>Alert Successfully Sent</h2>
            </div>

            <section className="alert-summary-card">
              <h3>Alert Summary</h3>
              <h4>{formData.alertTitle}</h4>
              <p>{formData.message}</p>

              <div className="alert-summary-meta">
                <div>
                  <span>Delivery Method</span>
                  <strong>Push Notification</strong>
                </div>
                <div>
                  <span>Recipients</span>
                  <strong>2,845 users</strong>
                </div>
              </div>
            </section>

            <div className="alert-modal-actions alert-modal-actions-single">
              <button
                type="button"
                className="alert-submit-button active"
                onClick={onClose}
              >
                <CheckIcon size={28} weight="bold" />
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SendAlertForm;
