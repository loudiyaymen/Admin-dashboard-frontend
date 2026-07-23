import { useEffect, useState } from "react";
import AdminHeader from "../Components/AdminHeader";
import Sidebar from "../Components/Sidebar";
import { fetchSosEvents } from "../services/sosService";
import { API_BASE_URL } from "../services/apiClient";

const WS_URL =
  import.meta.env.VITE_WS_URL ||
  API_BASE_URL.replace("http://", "ws://")
    .replace("/api/v1", "")
    .replace(":4000", ":4001");

function EmergencyPage({ headerProps }) {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadSosEvents() {
    setErrorMessage("");
    try {
      const rows = await fetchSosEvents();
      setReports(rows);
    } catch (error) {
      setErrorMessage(error.message || "Failed to load SOS events");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadSosEvents();

    const socket = new WebSocket(WS_URL);
    socket.onmessage = (event) => {
      const raw = String(event.data || "").trim();

      if (raw === "SOS_ACTIVE" || raw === "PUSH_SOS_ACTIVE") {
        loadSosEvents();
        return;
      }

      try {
        const parsed = JSON.parse(raw);
        const eventName = parsed?.event || parsed?.type;
        if (eventName === "SOS_ACTIVE" || eventName === "PUSH_SOS_ACTIVE") {
          loadSosEvents();
        }
      } catch {
        // Ignore non-JSON messages
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="admin-layout">
      <AdminHeader {...headerProps} />

      <div className="admin-body">
        <Sidebar />

        <main className="admin-content">
          <div className="standard-page-content">
            <div className="page-heading">
              <h1>Emergency Dashboard</h1>
              <p>Monitor reports sent from the mobile app.</p>
            </div>

            <section className="emergency-log-card">
              <h2>Emergency Report Log</h2>

              <table className="emergency-log-table">
                <thead>
                  <tr className="emergency-log-header">
                    <th>ID</th>
                    <th>Time</th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading ? (
                    <tr>
                      <td className="emergency-log-status" colSpan={2}>
                        Loading SOS events...
                      </td>
                    </tr>
                  ) : null}

                  {errorMessage ? (
                    <tr>
                      <td
                        className="emergency-log-status app-message-error"
                        colSpan={2}
                      >
                        {errorMessage}
                      </td>
                    </tr>
                  ) : null}

                  {reports.map((report) => (
                    <tr key={report.id} className="emergency-log-row">
                      <td>{report.id}</td>
                      <td>{report.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default EmergencyPage;
