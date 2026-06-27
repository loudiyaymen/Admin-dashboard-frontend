import ReportRow from "./ReportRow";

function ReportInbox({ reports, onSelectReport }) {
  return (
    <section className="panel-card reports-panel-card reports-list-panel">
      <h2 className="reports-panel-title">Report List</h2>

      <div className="report-list">
        {reports.length === 0 ? (
          <p>No reports found.</p>
        ) : (
          reports.map((report) => (
            <ReportRow
              key={report.reportId}
              report={report}
              onSelect={onSelectReport}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default ReportInbox;
