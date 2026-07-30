import { useMemo, useState } from "react";
import {
  XIcon,
  MapPinIcon,
  UserIcon,
  CheckIcon,
  ImageSquareIcon,
  CaretDownIcon,
  ExclamationMarkIcon,
} from "@phosphor-icons/react";
import {
  combineDateAndTime,
  isNonEmptyString,
  isNonNegativeNumberString,
  isPositiveIntegerString,
  isDateOnOrAfterToday,
  isValidDateInput,
  isValidTimeInput,
  isValidUrl,
} from "../utils/formValidation";

const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 250;

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatLocalTime(date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function buildCreateDefaults() {
  const now = new Date();
  const later = new Date(now.getTime() + 60 * 60 * 1000);

  return {
    title: "",
    date: formatLocalDate(now),
    time: formatLocalTime(now),
    type: "",
    campusId: "",
    location: "",
    registrationStartDate: formatLocalDate(now),
    registrationStartTime: formatLocalTime(now),
    registrationEndDate: formatLocalDate(later),
    registrationEndTime: formatLocalTime(later),
    maxParticipants: "",
    unlimitedParticipants: false,
    description: "",
    url: "",
    fee: "",
    noFee: false,
    eventImage: null,
  };
}

function buildFormData(initialData) {
  if (!initialData) {
    return buildCreateDefaults();
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

  const [touchedFields, setTouchedFields] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [confirmStep, setConfirmStep] = useState("none");
  const isCreateMode = mode === "create";
  const todayDate = formatLocalDate(new Date());

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

  const validationErrors = useMemo(() => {
    const errors = {};
    const selectedCampusId = campusOptions.some(
      (campus) => campus.campusId === formData.campusId,
    );
    const titleText = formData.title.trim();
    const descriptionText = formData.description.trim();

    if (!isNonEmptyString(titleText) || titleText.length > TITLE_MAX_LENGTH) {
      errors.title = "Enter event title. Max 100 characters";
    }

    if (!isValidDateInput(formData.date)) {
      errors.date = "Pick a date";
    } else if (isCreateMode && !isDateOnOrAfterToday(formData.date)) {
      errors.date = "Pick a date";
    }

    if (!isValidTimeInput(formData.time)) {
      errors.time = "Pick a time";
    }

    if (!isNonEmptyString(formData.type)) {
      errors.type = "Select an option";
    }

    if (!selectedCampusId) {
      errors.campusId = "Enter a valid location (Building, Room)";
    }

    if (!isValidDateInput(formData.registrationStartDate)) {
      errors.registrationStartDate = "Pick a starting date";
    } else if (
      isCreateMode &&
      !isDateOnOrAfterToday(formData.registrationStartDate)
    ) {
      errors.registrationStartDate = "Pick a starting date";
    }

    if (!isValidTimeInput(formData.registrationStartTime)) {
      errors.registrationStartTime = "Pick a starting time";
    }

    if (!isValidDateInput(formData.registrationEndDate)) {
      errors.registrationEndDate = "Pick an ending date";
    } else if (
      isCreateMode &&
      !isDateOnOrAfterToday(formData.registrationEndDate)
    ) {
      errors.registrationEndDate = "Pick an ending date";
    }

    if (!isValidTimeInput(formData.registrationEndTime)) {
      errors.registrationEndTime = "Pick an ending time";
    }

    const registrationStart = combineDateAndTime(
      formData.registrationStartDate,
      formData.registrationStartTime,
    );
    const registrationEnd = combineDateAndTime(
      formData.registrationEndDate,
      formData.registrationEndTime,
    );

    if (
      registrationStart &&
      registrationEnd &&
      registrationEnd < registrationStart
    ) {
      errors.registrationEndDate = "Pick an ending date";
      errors.registrationEndTime = "Pick an ending time";
    }

    if (!formData.unlimitedParticipants) {
      if (!isPositiveIntegerString(formData.maxParticipants)) {
        errors.maxParticipants = "Exceeded the number of maximum participants";
      }
    }

    if (
      !isNonEmptyString(descriptionText) ||
      descriptionText.length > DESCRIPTION_MAX_LENGTH
    ) {
      errors.description = "Enter a description. Max 250 characters";
    }

    if (!isValidUrl(formData.url)) {
      errors.url = "Enter a valid URL";
    }

    if (!formData.noFee && !isNonNegativeNumberString(formData.fee)) {
      errors.fee = "Enter a valid fee";
    }

    if (!formData.eventImage) {
      errors.eventImage = "Could not upload media";
    }

    return errors;
  }, [campusOptions, formData, isCreateMode]);

  function shouldShowError(field) {
    return Boolean(hasSubmitted || touchedFields[field]);
  }

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

  function handleBlur(field) {
    setTouchedFields((current) => ({
      ...current,
      [field]: true,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    setHasSubmitted(true);
    if (Object.keys(validationErrors).length > 0) return;

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
      eventImage: formData.eventImage,
      coverImage: initialData?.coverImage || null,
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

  function resetFormToDefaults() {
    setFormData(buildFormData(initialData));
    setTouchedFields({});
    setHasSubmitted(false);
    setConfirmStep("none");
  }

  function getInputClass(field) {
    return `${
      field && shouldShowError(field) && validationErrors[field]
        ? "event-input event-input-error"
        : "event-input"
    }`;
  }

  function getFieldError(field) {
    return shouldShowError(field) ? validationErrors[field] || "" : "";
  }

  function handleNativePickerClick(event) {
    if (typeof event.currentTarget.showPicker === "function") {
      event.currentTarget.showPicker();
    }
  }

  return (
    <>
      <div className="event-modal-overlay">
        <div className="event-modal">
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

          <form className="event-form" onSubmit={handleSubmit} noValidate>
            <FormField
              label="Title"
              required
              errorMessage={getFieldError("title")}
              input={
                <input
                  className={getInputClass("title")}
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  onBlur={() => handleBlur("title")}
                  placeholder="Enter event title (e.g. Workshop: Let's Eat Tacos!)"
                  maxLength={TITLE_MAX_LENGTH}
                />
              }
            />

            <div className="event-grid">
              <FormField
                label="Date"
                required
                errorMessage={getFieldError("date")}
                input={
                  <input
                    className={`${getInputClass("date")} event-native-picker-clean`}
                    name="date"
                    type="date"
                    min={isCreateMode ? todayDate : undefined}
                    value={formData.date}
                    onClick={handleNativePickerClick}
                    onChange={handleChange}
                    onBlur={() => handleBlur("date")}
                  />
                }
              />

              <FormField
                label="Time"
                required
                errorMessage={getFieldError("time")}
                input={
                  <input
                    className={`${getInputClass("time")} event-native-picker-clean`}
                    name="time"
                    type="time"
                    value={formData.time}
                    onClick={handleNativePickerClick}
                    onChange={handleChange}
                    step="60"
                    onBlur={() => handleBlur("time")}
                  />
                }
              />
            </div>

            <FormField
              label="Type"
              required
              errorMessage={getFieldError("type")}
              input={
                <div className="select-wrapper">
                  <select
                    className={getInputClass("type")}
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    onBlur={() => handleBlur("type")}
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

            <FormField
              label="Location"
              icon={<MapPinIcon size={20} className="event-field-icon" />}
              errorMessage={getFieldError("campusId")}
              input={
                <div className="select-wrapper">
                  <select
                    className={`${getInputClass("campusId")} event-campus-select`}
                    name="campusId"
                    value={formData.campusId}
                    onChange={handleChange}
                    onBlur={() => handleBlur("campusId")}
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
              <FormField
                label="Registration Starting Date"
                required
                errorMessage={getFieldError("registrationStartDate")}
                input={
                  <input
                    className={`${getInputClass("registrationStartDate")} event-native-picker-clean`}
                    name="registrationStartDate"
                    type="date"
                    min={isCreateMode ? todayDate : undefined}
                    value={formData.registrationStartDate}
                    onClick={handleNativePickerClick}
                    onChange={handleChange}
                    onBlur={() => handleBlur("registrationStartDate")}
                  />
                }
              />

              <FormField
                label="Registration Starting Time"
                required
                errorMessage={getFieldError("registrationStartTime")}
                input={
                  <input
                    className={`${getInputClass("registrationStartTime")} event-native-picker-clean`}
                    name="registrationStartTime"
                    type="time"
                    value={formData.registrationStartTime}
                    onClick={handleNativePickerClick}
                    onChange={handleChange}
                    step="60"
                    onBlur={() => handleBlur("registrationStartTime")}
                  />
                }
              />
            </div>

            <div className="event-grid">
              <FormField
                label="Registration Ending Date"
                required
                errorMessage={getFieldError("registrationEndDate")}
                input={
                  <input
                    className={`${getInputClass("registrationEndDate")} event-native-picker-clean`}
                    name="registrationEndDate"
                    type="date"
                    min={isCreateMode ? todayDate : undefined}
                    value={formData.registrationEndDate}
                    onClick={handleNativePickerClick}
                    onChange={handleChange}
                    onBlur={() => handleBlur("registrationEndDate")}
                  />
                }
              />

              <FormField
                label="Registration Ending Time"
                required
                errorMessage={getFieldError("registrationEndTime")}
                input={
                  <input
                    className={`${getInputClass("registrationEndTime")} event-native-picker-clean`}
                    name="registrationEndTime"
                    type="time"
                    value={formData.registrationEndTime}
                    onClick={handleNativePickerClick}
                    onChange={handleChange}
                    step="60"
                    onBlur={() => handleBlur("registrationEndTime")}
                  />
                }
              />
            </div>

            <IconField
              label="Maximum Participants"
              required={!formData.unlimitedParticipants}
              errorMessage={getFieldError("maxParticipants")}
              icon={<UserIcon size={20} className="event-field-icon" />}
              input={
                <input
                  className={getInputClass("maxParticipants")}
                  name="maxParticipants"
                  type="number"
                  min="1"
                  step="1"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  placeholder="(e.g. 25)"
                  disabled={formData.unlimitedParticipants}
                  onBlur={() => handleBlur("maxParticipants")}
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
              errorMessage={getFieldError("description")}
              input={
                <textarea
                  className={getInputClass("description")}
                  name="description"
                  rows="6"
                  value={formData.description}
                  onChange={handleChange}
                  onBlur={() => handleBlur("description")}
                  placeholder="(e.g. Are you tired of stiff suits and awkward business card exchanges? The Connection Lab is stripping away the formality to focus on what actually matters: genuine conversation and great food.)"
                  maxLength={DESCRIPTION_MAX_LENGTH}
                />
              }
            />

            <FormField
              label="URL"
              errorMessage={getFieldError("url")}
              input={
                <input
                  className={getInputClass("url")}
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  type="url"
                  placeholder="URL"
                  onBlur={() => handleBlur("url")}
                />
              }
            />

            <FormField
              label="Fee"
              required={!formData.noFee}
              errorMessage={getFieldError("fee")}
              input={
                <input
                  className={getInputClass("fee")}
                  name="fee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.fee}
                  onChange={handleChange}
                  placeholder="$ (e.g. 5)"
                  disabled={formData.noFee}
                  onBlur={() => handleBlur("fee")}
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
              errorMessage={getFieldError("eventImage")}
              input={
                <label
                  className={`event-upload-box ${
                    shouldShowError("eventImage") && validationErrors.eventImage
                      ? "event-upload-box-error"
                      : ""
                  }`}
                >
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
                onClick={resetFormToDefaults}
              >
                Reset
              </button>

              <button type="submit" className="event-submit-button">
                <CheckIcon size={20} />
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
                <ExclamationMarkIcon size={44} weight="regular" />
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
                  <CheckIcon size={20} />
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
                <CheckIcon size={44} weight="regular" />
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
              <ExclamationMarkIcon size={36} weight="regular" />
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
              <CheckIcon size={36} weight="regular" />
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

function FormField({ label, required = false, input, errorMessage }) {
  return (
    <label className="event-field event-field-full">
      <span>
        {label} {required && <span className="required-mark">*</span>}
      </span>
      {input}
      {errorMessage ? <p className="field-error-text">{errorMessage}</p> : null}
    </label>
  );
}

function IconField({ label, required = false, icon, input, errorMessage }) {
  return (
    <label className="event-field">
      <span>
        {label} {required && <span className="required-mark">*</span>}
      </span>
      <div className="event-input-icon-wrap">
        {icon}
        {input}
      </div>
      {errorMessage ? <p className="field-error-text">{errorMessage}</p> : null}
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
