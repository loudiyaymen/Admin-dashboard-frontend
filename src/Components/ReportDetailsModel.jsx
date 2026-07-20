import { useState } from "react";
import {
  ArrowLeftIcon,
  CheckIcon,
  ExclamationMarkIcon,
} from "@phosphor-icons/react";

function ReportDetailsModal({ report, onBack, onMarkResolved }) {
  const [showResolveConfirm, setShowResolveConfirm] = useState(false);
  const [showResolveSuccess, setShowResolveSuccess] = useState(false);
  const [resolveError, setResolveError] = useState("");

  if (!report) {
    return null;
  }

  const reportInfoRows = [
    { label: "Report category:", value: report.category },
    { label: "Report ID:", value: report.reportId },
    { label: "Status:", value: report.status },
    { label: "Submission date and time:", value: report.submissionDateTime },
  ];

  const reporterInfoRows = [
    { label: "Name:", value: report.reporter.name },
    { label: "Email:", value: report.reporter.email },
  ];

  const detailRows = [
    { label: "Incident details", value: report.details.incidentDetails },
    { label: "Location", value: report.details.location },
    { label: "Date", value: report.details.dateOfIncident },
    { label: "Time", value: report.details.timeOfIncident },
  ];

  const isResolved = report.status.toLowerCase() === "resolved";

  function handleResolveButtonClick() {
    if (isResolved) return;
    setShowResolveConfirm(true);
  }

  async function handleConfirmResolve() {
    try {
      setResolveError("");
      await onMarkResolved(report.reportId);
      setShowResolveConfirm(false);
      setShowResolveSuccess(true);
    } catch (error) {
      setResolveError(error.message || "Failed to resolve report");
      setShowResolveConfirm(false);
    }
  }

  return (
    <section className="report-details-view">
      <button type="button" className="report-details-back" onClick={onBack}>
        <ArrowLeftIcon size={16} />
        <span>Back to Reports</span>
      </button>

      <div className="report-details-header-row">
        <h1>{report.title}</h1>
        <button
          type="button"
          className={`report-resolve-button ${isResolved ? "is-resolved" : ""}`}
          onClick={handleResolveButtonClick}
          disabled={isResolved}
        >
          <CheckIcon size={20} weight="bold" />
          <span>{isResolved ? "Resolved" : "Mark as resolved"}</span>
        </button>
      </div>

      <section className="report-details-card">
        <h2>Report info</h2>
        <div className="report-key-value-list">
          {reportInfoRows.map((row) => (
            <div key={row.label} className="report-key-value-row">
              <span className="report-key">{row.label}</span>
              <span className="report-value">{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="report-details-card">
        <h2>Reporter info</h2>
        <div className="report-key-value-list">
          {reporterInfoRows.map((row) => (
            <div key={row.label} className="report-key-value-row">
              <span className="report-key">{row.label}</span>
              <span className="report-value">{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="report-details-card">
        <h2>Report details</h2>
        <div className="report-detail-fields">
          {detailRows.map((row) => (
            <div key={row.label} className="report-detail-field">
              <h3>{row.label}</h3>
              <p>{row.value}</p>
            </div>
          ))}

          <div className="report-detail-field">
            <h3>Attachments</h3>
            <div className="report-attachment-list">
              {report.attachments.length === 0 ? (
                <p>No attachments</p>
              ) : (
                report.attachments.map((attachment) => (
                  <img
                    key={attachment.id}
                    src={attachment.src}
                    alt={attachment.alt}
                    className="report-attachment-image"
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {resolveError ? (
        <p className="app-message-error">{resolveError}</p>
      ) : null}

      {showResolveConfirm && (
        <div
          className="report-resolve-modal-overlay"
          onClick={() => setShowResolveConfirm(false)}
        >
          <div
            className="report-resolve-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="report-resolve-modal-content">
              <div className="report-resolve-icon warning">
                <ExclamationMarkIcon size={42} weight="regular" />
              </div>

              <div className="report-resolve-copy">
                <h2>Mark as Resolved</h2>
                <p>Are you sure you want to mark this report as resolved?</p>
              </div>

              <div className="report-resolve-actions">
                <button
                  type="button"
                  className="report-resolve-cancel"
                  onClick={() => setShowResolveConfirm(false)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="report-resolve-confirm"
                  onClick={handleConfirmResolve}
                >
                  <CheckIcon size={20} weight="bold" />
                  <span>Mark as resolved</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showResolveSuccess && (
        <div
          className="report-resolve-modal-overlay"
          onClick={() => setShowResolveSuccess(false)}
        >
          <div
            className="report-resolve-modal report-resolve-success-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="report-resolve-modal-content report-resolve-success-content">
              <div className="report-resolve-icon success">
                <CheckIcon size={42} weight="regular" />
              </div>

              <div className="report-resolve-copy">
                <h2>Success!</h2>
                <p>Report successfully marked as resolved</p>
              </div>

              <div className="report-resolve-actions report-resolve-actions-single">
                <button
                  type="button"
                  className="report-resolve-confirm"
                  onClick={() => setShowResolveSuccess(false)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ReportDetailsModal;
