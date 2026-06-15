import ReportRow from './ReportRow';

function ReportInbox({ reports }) {
  return (
    <section className="panel-card">
      <h2 className="panel-title">Report List</h2>

      <div className="report-list">
        {reports.length === 0 ? (
          <p>No reports found.</p>
        ) : (
          reports.map((report) => (
            <ReportRow
              key={report.reportId}
              report={report}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default ReportInbox;