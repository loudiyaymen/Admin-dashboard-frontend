import { useState } from "react";
import {
  XIcon,
  CaretDownIcon,
  WarningCircleIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
} from "@phosphor-icons/react";

function SendAlertForm({ onClose }) {
  const [formData, setFormData] = useState({
    alertTitle: "",
    building: "",
    message: "",
  });

  const [modalStep, setModalStep] = useState("form");

  const buildingOptions = [
    "All Buildings",
    "Building A",
    "Building B",
    "Building C",
    "Library",
    "Student Commons",
  ];

  function getAutoMessage(alertTitle, building) {
    const selectedBuilding = building || "the selected location";

    if (alertTitle === "Campus Weather Alert") {
      return `Weather alert for ${selectedBuilding}. Please use caution and follow campus safety updates.`;
    }

    if (alertTitle === "Security Update") {
      return `Security update for ${selectedBuilding}. Please stay alert and follow official campus guidance.`;
    }

    if (alertTitle === "Emergency Alert") {
      return `Emergency alert for ${selectedBuilding}. Please follow safety instructions immediately.`;
    }

    if (alertTitle === "Event Reminder") {
      return `Event reminder for ${selectedBuilding}. Please check the latest schedule and event details.`;
    }

    return "";
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => {
      const updatedData = {
        ...currentData,
        [name]: value,
      };

      if (name === "alertTitle") {
        updatedData.message = getAutoMessage(value, updatedData.building);
      }

      if (name === "building" && updatedData.alertTitle) {
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
    formData.building.trim() !== "" &&
    formData.message.trim() !== "";

  function handleCancelClick() {
    setModalStep("confirm-cancel");
  }

  function handleBackToForm() {
    setModalStep("form");
  }

  function handleConfirmSend() {
    setModalStep("sent-success");
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
                    <option value="Campus Weather Alert">
                      Campus Weather Alert
                    </option>
                    <option value="Security Update">Security Update</option>
                    <option value="Emergency Alert">Emergency Alert</option>
                    <option value="Event Reminder">Event Reminder</option>
                  </select>

                  <CaretDownIcon size={20} className="select-icon" />
                </div>
              </label>

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
              >
                <CheckCircleIcon size={28} weight="bold" />
                Send alert
              </button>
            </div>
          </div>
        )}

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