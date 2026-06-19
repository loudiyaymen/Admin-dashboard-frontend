//Report analytics on the report screen - shows total number of reports, open reports, and a progress bar for distribution of report categories (e.g. incident, maintenance, etc.)

function ReportsAnalytics({ reports }) {
  return (
    <div className="analytics-column">
      <section className="analytics-card">
        <h3>Analytics</h3>
        <div>
          <p>Total Reports</p>
          <h2>{reports.length}</h2>
        </div>
        <div className="analytics-divider" />
        <div>
          <p>Open Reports</p>
          <h2>{reports.length}</h2>
        </div>
      </section>

      <section className="analytics-card">
        <h3>Report Distribution</h3>
        <div className="progress-track">
          <div className="progress-fill-blue" style={{ width: '70%' }} />
        </div>
      </section>
    </div>
  );
}

export default ReportsAnalytics;