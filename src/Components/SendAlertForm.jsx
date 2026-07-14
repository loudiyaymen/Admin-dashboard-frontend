import { useState } from "react";
import {
  XIcon,
  CaretDownIcon,
  WarningCircleIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
} from "@phosphor-icons/react";
import { sendAlert } from "../services/alertsservice";

function SendAlertForm({ onClose, onAlertSent }) {
  const [formData, setFormData] = useState({
    alertTitle: "",
    building: "",
    message: "",
  });

  const [modalStep, setModalStep] = useState("form");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState("");

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

  const alertTypeOptions = Object.keys(alertTypeConfig);

  const buildingOptions = [
    "All Buildings",
    "Building A",
    "Building B",
    "Building C",
    "Library",
    "Student Commons",
  ];

  function getAutoMessage(alertTitle, building) {
    const selectedAlert = alertTypeConfig[alertTitle];

    if (!selectedAlert) {
      return "";
    }

    if (selectedAlert.requiresBuilding) {
      const selectedBuilding = building || "the selected location";
      return selectedAlert.buildMessage(selectedBuilding);
    }

    return selectedAlert.buildMessage();
  }

  const selectedAlertConfig = alertTypeConfig[formData.alertTitle] || null;
  const requiresBuilding = selectedAlertConfig?.requiresBuilding || false;

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
        }
        updatedData.message = getAutoMessage(value, updatedData.building);
      }

      if (name === "building" && updatedData.alertTitle && requiresBuilding) {
        updatedData.message = getAutoMessage(updatedData.alertTitle, value);
      }

      return updatedData;
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setModalStep("confirm-send");
  }

  const isFormValid =
    formData.alertTitle.trim() !== "" &&
    (!requiresBuilding || formData.building.trim() !== "") &&
    formData.message.trim() !== "";

  function handleCancelClick() {
    setModalStep("confirm-cancel");
  }

  function handleBackToForm() {
    setModalStep("form");
  }

  async function handleConfirmSend() {
    try {
      setSendError("");
      setIsSending(true);
      await sendAlert({
        message: formData.message,
        alert_type: formData.alertTitle || null,
      });

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
    <div className="alert-modal-overlay" onClick={onClose}>
      <div
        className={`alert-modal ${modalStep !== "form" ? "alert-modal-confirm" : ""} ${
          modalStep === "confirm-send" ? "alert-modal-send" : ""
        } ${modalStep === "confirm-cancel" ? "alert-modal-cancel" : ""} ${
          modalStep === "sent-success" ? "alert-modal-success" : ""
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        {modalStep === "form" && (
          <>
            <div className="alert-modal-header">
              <h2>Create Alert</h2>

              <button
                type="button"
                className="alert-close-button"
                onClick={handleCancelClick}
              >
                <XIcon size={24} />
              </button>
            </div>

            <form className="alert-form" onSubmit={handleSubmit}>
              <label className="alert-field">
                <span>
                  Alert Title <span className="required-mark">*</span>
                </span>

                <div className="select-wrapper">
                  <select
                    name="alertTitle"
                    value={formData.alertTitle}
                    onChange={handleChange}
                    required
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
              </label>

              {requiresBuilding && (
                <label className="alert-field">
                  <span>
                    Building <span className="required-mark">*</span>
                  </span>

                  <div className="select-wrapper">
                    <select
                      name="building"
                      value={formData.building}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a building</option>
                      {buildingOptions.map((building) => (
                        <option key={building} value={building}>
                          {building}
                        </option>
                      ))}
                    </select>

                    <CaretDownIcon size={20} className="select-icon" />
                  </div>
                </label>
              )}

              <label className="alert-field">
                <span>
                  Alert Message <span className="required-mark">*</span>
                </span>

                <textarea
                  name="message"
                  placeholder="Enter alert message"
                  rows="6"
                  maxLength="5000"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </label>

              <p className="character-count">
                {formData.message.length} / 5000 Characters
              </p>

              <div className="alert-modal-actions">
                <button
                  type="button"
                  className="alert-cancel-button"
                  onClick={handleCancelClick}
                >
                  Cancel
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
              <WarningCircleIcon size={44} weight="fill" />
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
                <CheckCircleIcon size={28} weight="bold" />
                {isSending ? "Sending..." : "Send alert"}
              </button>
            </div>
          </div>
        )}

        {sendError ? <p className="app-message-error">{sendError}</p> : null}

        {modalStep === "confirm-cancel" && (
          <div className="alert-confirm-content alert-confirm-cancel-content">
            <div className="alert-status-icon alert-status-icon-warning">
              <WarningCircleIcon size={44} weight="fill" />
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
              <CheckCircleIcon size={44} weight="fill" />
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
                <CheckCircleIcon size={28} weight="bold" />
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
