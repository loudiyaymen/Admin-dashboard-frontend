import { useState } from 'react';

function SendAlertForm() {
  const [formData, setFormData] = useState({
    title: '',
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
    alert(`Alert sent: ${formData.title}`);

    setFormData({
      title: '',
      message: ''
    });
  }

  return (
    <section className="panel-card">
      <h2 className="panel-title">Send Alert</h2>

      <form className="admin-form" onSubmit={handleSubmit}>
        <label>
          Alert Title
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Message
          <textarea
            name="message"
            rows="6"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" className="primary-button danger-button">
          Send Alert
        </button>
      </form>
    </section>
  );
}

export default SendAlertForm;