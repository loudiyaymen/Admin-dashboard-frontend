import { useState } from 'react';
import { XIcon, CaretDownIcon } from '@phosphor-icons/react'

function SendAlertForm({ onClose }) {
  const [formData, setFormData] = useState({
    alertTitle: '',
    building:'',
    message: ''
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    alert(`Alert sent: ${formData.alertTitle}`);
    onClose();

  }

  const isFormValid = formData.alertTitle.trim() != '' &&
                      formData.building.trim() != '' &&
                      formData.message.trim() != '';

  return (
    <div className="alert-modal-overlay" onClick={onClose}>
      <div
        className="alert-modal"
        onClick={(event) => event.stopPropagation()}
      >
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
                <option value="Campus Weather Alert">Campus Weather Alert</option>
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

            <input
              type="text"
              name="building"
              placeholder="Building"
              value={formData.building}
              onChange={handleChange}
              required
            />
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
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className={`alert-submit-button ${
              isFormValid ? 'active' : ''
            }`}
            disabled={!isFormValid}>
              Send Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
    
}

export default SendAlertForm;