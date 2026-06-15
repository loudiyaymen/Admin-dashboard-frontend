function ReportRow({ report }) {
  return (
    <button type="button" className="report-row">
      <div>
        <h3>{report.title}</h3>
        <p>{report.location}</p>
        <span>{report.reportId}</span>
      </div>

      <div className="report-row-right">
        <span className="report-badge report-badge-incident">{report.category}</span>
        <span className="report-badge report-badge-open">{report.status}</span>
      </div>
    </button>
  );
}

export default ReportRow;