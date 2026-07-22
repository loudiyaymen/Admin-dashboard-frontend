import { useEffect, useMemo, useState } from "react";
import { PlusCircleIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import AdminHeader from "../Components/AdminHeader";
import Sidebar from "../Components/Sidebar";
import SendAlertForm from "../Components/SendAlertForm";
import { fetchAlerts } from "../services/alertsservice";
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
                {visibleNotifications.length === 0 ? (
                  <p>No notifications found.</p>
                ) : (
                  visibleNotifications.map((item) => (
                    <div key={item.id} className="notification-card">
                      <h3>{item.title}</h3>
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
        </main>
      </div>

      {showCreateForm && (
        <SendAlertForm
          onClose={() => setShowCreateForm(false)}
          onAlertSent={loadAlerts}
        />
      )}
    </div>
  );
}

export default SendAlertPage;
