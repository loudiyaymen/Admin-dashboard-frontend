import { useState } from 'react';
import {
  XIcon,
  CalendarBlankIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  CheckCircleIcon,
  ImageSquareIcon,
  CaretDownIcon
} from '@phosphor-icons/react';

const requiredFields = [
  'title',
  'date',
  'time',
  'type',
  'registrationStartDate',
  'registrationStartTime',
  'registrationEndDate',
  'registrationEndTime',
  'description'
];

function CreateEventForm({ onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    type: '',
    location: '',
    registrationStartDate: '',
    registrationStartTime: '',
    registrationEndDate: '',
    registrationEndTime: '',
    maxParticipants: '',
    unlimitedParticipants: false,
    description: '',
    url: '',
    fee: '',
    noFee: false,
    eventImage: null
  });

  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);

  function handleChange(event) {
    const { name, value, type, checked, files } = event.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
        ...(name === 'unlimitedParticipants' && checked ? { maxParticipants: '' } : {}),
        ...(name === 'noFee' && checked ? { fee: '' } : {})
      }));
      return;
    }

    if (type === 'file') {
      setFormData((prev) => ({
        ...prev,
        eventImage: files[0] || null
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
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

    setShowConfirm(true);
  }

  function handleConfirmCreate() {
    alert('Event created successfully.');
    setShowConfirm(false);
    onClose();
  }

  function getInputClass(field) {
    return errors[field] ? 'event-input event-input-error' : 'event-input';
  }

  return (
    <>
      <div className="event-modal-overlay" onClick={onClose}>
        <div className="event-modal" onClick={(e) => e.stopPropagation()}>
          <div className="event-modal-header">
            <h2>Add New Event</h2>
            <button type="button" className="event-close-button" onClick={onClose}>
              <XIcon size={24} />
            </button>
          </div>

          <form className="event-form" onSubmit={handleSubmit}>
            <FormField
              label="Title"
              required
              input={
                <input
                  className={getInputClass('title')}
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
                icon={<CalendarBlankIcon size={20} className="event-field-icon" />}
                input={
                  <input
                    className={getInputClass('date')}
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
                    className={getInputClass('time')}
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
                    className={getInputClass('type')}
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
                <input
                  className="event-input"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="(e.g. Building C, Room 112)"
                />
              }
            />

            <div className="event-grid">
              <IconField
                label="Registration Starting Date"
                required
                icon={<CalendarBlankIcon size={20} className="event-field-icon" />}
                input={
                  <input
                    className={getInputClass('registrationStartDate')}
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
                    className={getInputClass('registrationStartTime')}
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
                icon={<CalendarBlankIcon size={20} className="event-field-icon" />}
                input={
                  <input
                    className={getInputClass('registrationEndDate')}
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
                    className={getInputClass('registrationEndTime')}
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
                  className={getInputClass('maxParticipants')}
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
                  className={getInputClass('description')}
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
                  className={getInputClass('fee')}
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
                  <span>{formData.eventImage ? formData.eventImage.name : 'Add Photo or Video'}</span>
                </label>
              }
            />

            <div className="event-modal-actions">
              <button type="button" className="event-cancel-button" onClick={onClose}>
                Cancel
              </button>

              <button type="submit" className="event-submit-button">
                <CheckCircleIcon size={20} />
                <span>Create event</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {showConfirm && (
        <div className="confirm-modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Are you sure you want to create the event?</h3>

            <div className="confirm-modal-actions">
              <button
                type="button"
                className="event-cancel-button"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="event-submit-button"
                onClick={handleConfirmCreate}
              >
                Yes, Create
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
      <input type="checkbox" name={name} checked={checked} onChange={onChange} />
      <span>{text}</span>
    </label>
  );
}

export default CreateEventForm;