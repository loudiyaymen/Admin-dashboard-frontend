function ReportRow({ report, onSelect }) {
  const statusClass = report.status.toLowerCase().replace(/\s+/g, "-");

  return (
    <button
      type="button"
      className="report-row"
      onClick={() => onSelect(report.reportId)}
    >
      <div className="report-row-left">
        <h3>{`${report.title} - ${report.category}`}</h3>
        <p>{report.location}</p>
        <p className="report-submission-date">
          Submitted: {report.submissionDateTime}
        </p>
        <span>{report.reportId}</span>
      </div>

      <div className="report-row-right">
        <span className={`report-badge report-badge-status-${statusClass}`}>
          {report.status}
        </span>
      </div>
    </button>
  );
}

export default ReportRow;
