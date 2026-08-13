import ReportRow from "./ReportRow";
import EmptyState from "./EmptyState";

function ReportInbox({
  reports,
  onSelectReport,
  emptyTitle = "No reports to show yet",
  emptyDescription = "Reports submitted through the mobile app will appear here",
}) {
  return (
    <section className="panel-card reports-panel-card reports-list-panel">
      <h2 className="reports-panel-title">Report List</h2>

      <div className="report-list">
        {reports.length === 0 ? (
          <EmptyState
            compact
            title={emptyTitle}
            description={emptyDescription}
          />
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
