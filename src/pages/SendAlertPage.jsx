import { useEffect, useMemo, useState } from "react";
import {
  CheckIcon,
  ExclamationMarkIcon,
  PlusCircleIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";
import AdminHeader from "../Components/AdminHeader";
import EmptyState from "../Components/EmptyState";
import PageErrorState from "../Components/PageErrorState";
import Sidebar from "../Components/Sidebar";
import SendAlertForm from "../Components/SendAlertForm";
import { fetchAlerts, resolveAlert } from "../services/alertsservice";
import { fetchAlertMetrics } from "../services/analyticsService";

const MOCK_ALERT_METRICS = {
  totalSent: 67,
  openRate: 76,
  criticalAlerts: 3,
  trend: 8,
};

function SendAlertPage({ headerProps }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [alertMetrics, setAlertMetrics] = useState(MOCK_ALERT_METRICS);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [resolveMessage, setResolveMessage] = useState("");
  const [resolvingAlertId, setResolvingAlertId] = useState("");
  const [pendingResolveNotification, setPendingResolveNotification] =
    useState(null);
  const [showResolveSuccess, setShowResolveSuccess] = useState(false);

  function handleRequestResolve(notification) {
    setResolveMessage("");
    setErrorMessage("");
    setShowResolveSuccess(false);

    if (notification?.isResolutionUpdate) {
      setResolveMessage(
        "Resolution update alerts cannot be marked as resolved.",
      );
      return;
    }

    if (notification?.isResolved) {
      setResolveMessage(`${notification.title} is already resolved.`);
      return;
    }

    setPendingResolveNotification(notification);
  }

  async function handleConfirmResolve() {
    const notification = pendingResolveNotification;

    if (!notification) {
      return;
    }

    setResolveMessage("");
    setErrorMessage("");
    setResolvingAlertId(notification.id);
    setPendingResolveNotification(null);

    try {
      await resolveAlert(notification.id);

      await loadAlerts();
      setShowResolveSuccess(true);
    } catch (error) {
      setErrorMessage(error.message || "Failed to send resolution alert");
    } finally {
      setResolvingAlertId("");
    }
  }

  async function loadAlerts() {
    setErrorMessage("");
    try {
      const [alertsData, metricsData] = await Promise.all([
        fetchAlerts(),
        fetchAlertMetrics().catch(() => null),
      ]);

      setNotifications(alertsData);

      if (metricsData?.data) {
        setAlertMetrics({
          totalSent: metricsData.data.totalSent || MOCK_ALERT_METRICS.totalSent,
          openRate: metricsData.data.openRate || MOCK_ALERT_METRICS.openRate,
          criticalAlerts:
            metricsData.data.criticalAlerts ||
            MOCK_ALERT_METRICS.criticalAlerts,
          trend: metricsData.data.trend || MOCK_ALERT_METRICS.trend,
        });
      }
    } catch (error) {
      setErrorMessage(error.message || "Failed to load alerts");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAlerts();
  }, []);

  const filteredNotifications = useMemo(() => {
    const text = searchText.toLowerCase();

    return notifications.filter((item) => {
      return (
        item.title.toLowerCase().includes(text) ||
        item.description.toLowerCase().includes(text)
      );
    });
  }, [searchText, notifications]);

  const itemsPerPage = 2;
  const totalPages =
    Math.ceil(filteredNotifications.length / itemsPerPage) || 1;

  const visibleNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  function handleSearchChange(event) {
    setSearchText(event.target.value);
    setCurrentPage(1);
  }

  return (
    <div className="admin-layout">
      <AdminHeader {...headerProps} />

      <div className="admin-body">
        <Sidebar />

        <main className="admin-content">
          {errorMessage && notifications.length === 0 ? (
            <div className="standard-page-content">
              <PageErrorState description={errorMessage} onRetry={loadAlerts} />
            </div>
          ) : (
            <div className="standard-page-content">
              <div className="communications-header">
                <div className="page-heading">
                  <h1>Communications</h1>
                  <p>Push notification, alerts and notification history.</p>
                </div>

                <button
                  type="button"
                  className="create-alert-button"
                  onClick={() => setShowCreateForm(true)}
                >
                  <PlusCircleIcon size={20} />
                  <span>Create alert</span>
                </button>
              </div>

              <div className="communication-stats">
                <section className="analytics-card">
                  <h3>Total Sent</h3>
                  <h2>{alertMetrics.totalSent}</h2>
                  <p>
                    {alertMetrics.trend >= 0 ? "+" : ""}
                    {alertMetrics.trend} this week
                  </p>
                </section>

                <section className="analytics-card">
                  <h3>Open Rate</h3>
                  <h2>{alertMetrics.openRate}%</h2>
                  <p>Average</p>
                </section>

                <section className="analytics-card">
                  <h3>Critical Alerts</h3>
                  <h2>{alertMetrics.criticalAlerts}</h2>
                  <p>Last 30 days</p>
                </section>
              </div>

              <section className="panel-card">
                <h2 className="panel-title">Notification History</h2>

                <div className="notification-search-wrap">
                  <div className="search-input-wrapper notification-search">
                    <MagnifyingGlassIcon size={20} className="search-icon" />
                    <input
                      type="search"
                      placeholder="Search notifications"
                      value={searchText}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>

                <div className="notification-history-list">
                  {isLoading ? <p>Loading notifications...</p> : null}
                  {errorMessage ? (
                    <p className="app-message-error">{errorMessage}</p>
                  ) : null}
                  {resolveMessage ? (
                    <p className="app-message-success">{resolveMessage}</p>
                  ) : null}
                  {!isLoading && visibleNotifications.length === 0 ? (
                    <EmptyState
                      compact
                      title={
                        searchText.trim()
                          ? "No matching notifications"
                          : "No notifications to show yet"
                      }
                      description={
                        searchText.trim()
                          ? "Try a different search term or clear the filter."
                          : "Resolved and sent alerts will appear here."
                      }
                    />
                  ) : (
                    visibleNotifications.map((item) => (
                      <div key={item.id} className="notification-card">
                        <div className="notification-card-header">
                          <h3>{item.title}</h3>

                          {!item.isResolutionUpdate ? (
                            <div className="notification-card-actions">
                              {item.isResolved ? (
                                <span className="notification-status-badge is-resolved">
                                  Resolved
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  className="event-add-button notification-resolve-button"
                                  onClick={() => handleRequestResolve(item)}
                                  disabled={resolvingAlertId === item.id}
                                >
                                  <span>
                                    {resolvingAlertId === item.id
                                      ? "Sending update..."
                                      : "Mark as resolved"}
                                  </span>
                                </button>
                              )}
                            </div>
                          ) : null}
                        </div>

                        <p className="notification-description">
                          {item.description}
                        </p>

                        <div className="notification-meta">
                          <span>Sent: {item.sentAt}</span>
                          <span>Recipients: {item.recipients}</span>
                        </div>

                        <p className="notification-type">{item.type}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="pagination">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>

                  <span>
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>

      {showCreateForm && (
        <SendAlertForm
          onClose={() => setShowCreateForm(false)}
          onAlertSent={loadAlerts}
        />
      )}

      {pendingResolveNotification ? (
        <div
          className="report-resolve-modal-overlay"
          onClick={() => setPendingResolveNotification(null)}
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
                <p>
                  Are you sure you want to mark &ldquo;
                  {pendingResolveNotification.title}&rdquo; as resolved?
                </p>
              </div>

              <div className="report-resolve-actions">
                <button
                  type="button"
                  className="report-resolve-cancel"
                  onClick={() => setPendingResolveNotification(null)}
                  disabled={resolvingAlertId === pendingResolveNotification.id}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="report-resolve-confirm"
                  onClick={handleConfirmResolve}
                  disabled={resolvingAlertId === pendingResolveNotification.id}
                >
                  <CheckIcon size={20} weight="bold" />
                  {resolvingAlertId === pendingResolveNotification.id
                    ? "Resolving..."
                    : "Mark as resolved"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showResolveSuccess ? (
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
                <p>Alert successfully marked as resolved</p>
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
      ) : null}
    </div>
  );
}

export default SendAlertPage;
