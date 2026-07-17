import { useMemo, useState } from "react";
import {
  XIcon,
  CalendarBlankIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  CheckCircleIcon,
  ImageSquareIcon,
  CaretDownIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";

const requiredFields = [
  "title",
  "date",
  "time",
  "type",
  "campusId",
  "registrationStartDate",
  "registrationStartTime",
  "registrationEndDate",
  "registrationEndTime",
  "description",
];

function buildFormData(initialData) {
  if (!initialData) {
    return {
      title: "",
      date: "",
      time: "",
      type: "",
      campusId: "",
      location: "",
      registrationStartDate: "",
      registrationStartTime: "",
      registrationEndDate: "",
      registrationEndTime: "",
      maxParticipants: "",
      unlimitedParticipants: false,
      description: "",
      url: "",
      fee: "",
      noFee: false,
      eventImage: null,
    };
  }

  const unlimitedParticipants =
    String(initialData.capacity || "").toLowerCase() === "unlimited";

  return {
    title: initialData.title || "",
    date: initialData.date || "",
    time: initialData.time || "",
    type: initialData.type || "",
    campusId: initialData.campusId || initialData.raw?.campus_id || "",
    location: initialData.location || "",
    registrationStartDate:
      initialData.registrationStartDate || initialData.date || "",
    registrationStartTime:
      initialData.registrationStartTime || initialData.time || "",
    registrationEndDate:
      initialData.registrationEndDate || initialData.date || "",
    registrationEndTime:
      initialData.registrationEndTime || initialData.time || "",
    maxParticipants: unlimitedParticipants
      ? ""
      : String(initialData.capacity || "").replace(" max", ""),
    unlimitedParticipants,
    description: initialData.details || "",
    url: initialData.url || "",
    fee:
      initialData.eventFee && initialData.eventFee.toLowerCase() !== "no fee"
        ? initialData.eventFee.replace("$", "")
        : "",
    noFee:
      !initialData.eventFee || initialData.eventFee.toLowerCase() === "no fee",
    eventImage: null,
  };
}

function CreateEventForm({
  onClose,
  mode = "create",
  initialData = null,
  campuses = [],
  onSubmitEvent,
}) {
  const [formData, setFormData] = useState(() => buildFormData(initialData));

  const [errors, setErrors] = useState({});
  const [confirmStep, setConfirmStep] = useState("none");

  const campusOptions = useMemo(
    () =>
      (Array.isArray(campuses) ? campuses : []).map((campus) => ({
        campusId: campus?.campus_id || "",
        name: String(campus?.name || "").trim(),
      })),
    [campuses],
  );

  const selectedCampus = campusOptions.find(
    (campus) => campus.campusId === formData.campusId,
  );

  function handleChange(event) {
    const { name, value, type, checked, files } = event.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
        ...(name === "unlimitedParticipants" && checked
          ? { maxParticipants: "" }
          : {}),
        ...(name === "noFee" && checked ? { fee: "" } : {}),
      }));
      return;
    }

    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        eventImage: files[0] || null,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function validateForm() {
    const newErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = true;
      }
    });

    if (!formData.unlimitedParticipants && !formData.maxParticipants.trim()) {
      newErrors.maxParticipants = true;
    }

    if (!formData.noFee && !formData.fee.trim()) {
      newErrors.fee = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) return;

    setConfirmStep(mode === "edit" ? "edit-confirm" : "create-confirm");
  }

  function handleConfirmSubmit() {
    const updatedEvent = {
      ...(initialData || {}),
      title: formData.title,
      date: formData.date,
      time: formData.time,
      type: formData.type,
      campusId: formData.campusId,
      location: selectedCampus?.name || formData.location,
      schedule: `${formData.date} at ${formData.time}`,
      capacity: formData.unlimitedParticipants
        ? "Unlimited"
        : `${formData.maxParticipants} max`,
      details: formData.description,
      eventFee: formData.noFee ? "No fee" : `$${formData.fee}`,
      registrationStartDate: formData.registrationStartDate,
      registrationStartTime: formData.registrationStartTime,
      registrationEndDate: formData.registrationEndDate,
      registrationEndTime: formData.registrationEndTime,
      url: formData.url,
    };

    let submitResult = null;

    if (onSubmitEvent) {
      submitResult = onSubmitEvent({
        mode,
        event: updatedEvent,
      });
    } else {
      alert(
        mode === "edit"
          ? "Event edited successfully."
          : "Event created successfully.",
      );
    }

    if (mode === "edit") {
      setConfirmStep("edit-success");
      return;
    }

    setConfirmStep("create-success");
    return submitResult;
  }

  function handleCloseSuccess() {
    setConfirmStep("none");
    onClose();
  }

  function getInputClass(field) {
    return errors[field] ? "event-input event-input-error" : "event-input";
  }

  return (
    <>
      <div className="event-modal-overlay" onClick={onClose}>
        <div className="event-modal" onClick={(e) => e.stopPropagation()}>
          <div className="event-modal-header">
            <h2>{mode === "edit" ? "Edit Event" : "Add New Event"}</h2>
            <button
              type="button"
              className="event-close-button"
              onClick={onClose}
            >
              <XIcon size={24} />
            </button>
          </div>

          <form className="event-form" onSubmit={handleSubmit}>
            <FormField
              label="Title"
              required
              input={
                <input
                  className={getInputClass("title")}
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter event title"
                />
              }
            />

            <div className="event-grid">
              <IconField
                label="Date"
                required
                icon={
                  <CalendarBlankIcon size={20} className="event-field-icon" />
                }
                input={
                  <input
                    className={getInputClass("date")}
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    placeholder="(e.g. 12/25/2026)"
                  />
                }
              />

              <IconField
                label="Time"
                required
                icon={<ClockIcon size={20} className="event-field-icon" />}
                input={
                  <input
                    className={getInputClass("time")}
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    placeholder="(e.g. 12:00pm)"
                  />
                }
              />
            </div>

            <FormField
              label="Type"
              required
              input={
                <div className="select-wrapper">
                  <select
                    className={getInputClass("type")}
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="">Select an option</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Training">Training</option>
                    <option value="Drill">Drill</option>
                    <option value="Meeting">Meeting</option>
                  </select>
                  <CaretDownIcon size={20} className="select-icon" />
                </div>
              }
            />

            <IconField
              label="Location"
              icon={<MapPinIcon size={20} className="event-field-icon" />}
              input={
                <div className="select-wrapper">
                  <select
                    className={getInputClass("campusId")}
                    name="campusId"
                    value={formData.campusId}
                    onChange={handleChange}
                  >
                    <option value="">Select a campus</option>
                    {campusOptions.map((campus) => {
                      const isPembroke =
                        campus.name.toLowerCase() === "pembroke";
                      return (
                        <option
                          key={campus.campusId}
                          value={campus.campusId}
                          disabled={isPembroke}
                        >
                          {isPembroke
                            ? `${campus.name} (Coming soon)`
                            : campus.name}
                        </option>
                      );
                    })}
                  </select>
                  <CaretDownIcon size={20} className="select-icon" />
                </div>
              }
            />

            <div className="event-grid">
              <IconField
                label="Registration Starting Date"
                required
                icon={
                  <CalendarBlankIcon size={20} className="event-field-icon" />
                }
                input={
                  <input
                    className={getInputClass("registrationStartDate")}
                    name="registrationStartDate"
                    value={formData.registrationStartDate}
                    onChange={handleChange}
                    placeholder="(e.g. 12/25/2026)"
                  />
                }
              />

              <IconField
                label="Registration Starting Time"
                required
                icon={<ClockIcon size={20} className="event-field-icon" />}
                input={
                  <input
                    className={getInputClass("registrationStartTime")}
                    name="registrationStartTime"
                    value={formData.registrationStartTime}
                    onChange={handleChange}
                    placeholder="(e.g. 12:00pm)"
                  />
                }
              />
            </div>

            <div className="event-grid">
              <IconField
                label="Registration Ending Date"
                required
                icon={
                  <CalendarBlankIcon size={20} className="event-field-icon" />
                }
                input={
                  <input
                    className={getInputClass("registrationEndDate")}
                    name="registrationEndDate"
                    value={formData.registrationEndDate}
                    onChange={handleChange}
                    placeholder="(e.g. 12/25/2026)"
                  />
                }
              />

              <IconField
                label="Registration Ending Time"
                required
                icon={<ClockIcon size={20} className="event-field-icon" />}
                input={
                  <input
                    className={getInputClass("registrationEndTime")}
                    name="registrationEndTime"
                    value={formData.registrationEndTime}
                    onChange={handleChange}
                    placeholder="(e.g. 12:00pm)"
                  />
                }
              />
            </div>

            <IconField
              label="Maximum Participants"
              required={!formData.unlimitedParticipants}
              icon={<UserIcon size={20} className="event-field-icon" />}
              input={
                <input
                  className={getInputClass("maxParticipants")}
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  placeholder="(e.g. 25)"
                  disabled={formData.unlimitedParticipants}
                />
              }
            />

            <CheckRow
              name="unlimitedParticipants"
              checked={formData.unlimitedParticipants}
              onChange={handleChange}
              text="Check this for unlimited participants"
            />

            <FormField
              label="Description"
              required
              input={
                <textarea
                  className={getInputClass("description")}
                  name="description"
                  rows="6"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                />
              }
            />

            <FormField
              label="URL"
              input={
                <input
                  className="event-input"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder="URL"
                />
              }
            />

            <FormField
              label="Fee"
              required={!formData.noFee}
              input={
                <input
                  className={getInputClass("fee")}
                  name="fee"
                  value={formData.fee}
                  onChange={handleChange}
                  placeholder="$ (e.g. 5)"
                  disabled={formData.noFee}
                />
              }
            />

            <CheckRow
              name="noFee"
              checked={formData.noFee}
              onChange={handleChange}
              text="Check this for no fee"
            />

            <FormField
              label="Event Image"
              required
              input={
                <label className="event-upload-box">
                  <input
                    type="file"
                    name="eventImage"
                    accept="image/*,video/*"
                    onChange={handleChange}
                    hidden
                  />
                  <ImageSquareIcon size={28} />
                  <span>
                    {formData.eventImage
                      ? formData.eventImage.name
                      : "Add Photo or Video"}
                  </span>
                </label>
              }
            />

            <div className="event-modal-actions">
              <button
                type="button"
                className="event-cancel-button"
                onClick={onClose}
              >
                Cancel
              </button>

              <button type="submit" className="event-submit-button">
                <CheckCircleIcon size={20} />
                <span>{mode === "edit" ? "Edit event" : "Create event"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {confirmStep === "edit-confirm" && (
        <div
          className="event-edit-confirm-overlay"
          onClick={() => setConfirmStep("none")}
        >
          <div
            className="event-edit-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="event-edit-confirm-content">
              <div className="event-edit-confirm-icon">
                <WarningCircleIcon size={44} weight="fill" />
              </div>

              <div className="event-edit-confirm-copy">
                <h2>Confirm edition</h2>
                <p>Are you sure you want to edit this event?</p>
              </div>

              <div className="event-edit-fields-card">
                <h3>Edited fields</h3>
                <h4>Title</h4>

                <div className="event-edit-fields-grid">
                  <div>
                    <span className="event-edit-fields-label-previous">
                      Previous
                    </span>
                    <p>{initialData?.title || "-"}</p>
                  </div>
                  <div>
                    <span className="event-edit-fields-label-new">New</span>
                    <p>{formData.title || "-"}</p>
                  </div>
                </div>
              </div>

              <div className="event-edit-confirm-actions">
                <button
                  type="button"
                  className="event-cancel-button"
                  onClick={() => setConfirmStep("none")}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="event-submit-button"
                  onClick={handleConfirmSubmit}
                >
                  <CheckCircleIcon size={20} />
                  <span>Confirm edition</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmStep === "edit-success" && (
        <div
          className="event-edit-confirm-overlay"
          onClick={handleCloseSuccess}
        >
          <div
            className="event-edit-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="event-edit-confirm-content">
              <div className="event-edit-confirm-icon event-edit-confirm-icon-success">
                <CheckCircleIcon size={44} weight="fill" />
              </div>

              <div className="event-edit-confirm-copy">
                <h2>Success!</h2>
                <p>Event successfully updated</p>
              </div>

              <div className="event-edit-confirm-actions event-edit-confirm-actions-single">
                <button
                  type="button"
                  className="event-submit-button"
                  onClick={handleCloseSuccess}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmStep === "create-confirm" && (
        <div
          className="confirm-modal-overlay"
          onClick={() => setConfirmStep("none")}
        >
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="event-create-confirm-icon">
              <WarningCircleIcon size={36} weight="fill" />
            </div>
            <h3>Are you sure you want to create the event?</h3>

            <div className="confirm-modal-actions">
              <button
                type="button"
                className="event-cancel-button"
                onClick={() => setConfirmStep("none")}
              >
                Cancel
              </button>

              <button
                type="button"
                className="event-submit-button"
                onClick={handleConfirmSubmit}
              >
                Yes, Create
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmStep === "create-success" && (
        <div className="confirm-modal-overlay" onClick={handleCloseSuccess}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="event-create-confirm-icon event-create-confirm-icon-success">
              <CheckCircleIcon size={36} weight="fill" />
            </div>

            <h3>Event created successfully</h3>

            <div className="confirm-modal-actions confirm-modal-actions-single">
              <button
                type="button"
                className="event-submit-button"
                onClick={handleCloseSuccess}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FormField({ label, required = false, input }) {
  return (
    <label className="event-field event-field-full">
      <span>
        {label} {required && <span className="required-mark">*</span>}
      </span>
      {input}
    </label>
  );
}

function IconField({ label, required = false, icon, input }) {
  return (
    <label className="event-field">
      <span>
        {label} {required && <span className="required-mark">*</span>}
      </span>
      <div className="event-input-icon-wrap">
        {icon}
        {input}
      </div>
    </label>
  );
}

function CheckRow({ name, checked, onChange, text }) {
  return (
    <label className="event-check-row">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <span>{text}</span>
    </label>
  );
}

export default CreateEventForm;
