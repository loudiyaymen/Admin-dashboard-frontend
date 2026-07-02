import {
  BellIcon,
  FileTextIcon,
  WarningCircleIcon,
  SirenIcon,
  UserIcon,
} from "@phosphor-icons/react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AdminHeader from "../Components/AdminHeader";
import Sidebar from "../Components/Sidebar";
import { connectSocket, onSOSActive, disconnectSocket } from "../services/socketService";
import { useEffect } from "react";

const defaultActivityOverviewData = [
  { day: "Day 1", value: 42 },
  { day: "Day 5", value: 61 },
  { day: "Day 10", value: 53 },
  { day: "Day 15", value: 74 },
  { day: "Day 20", value: 68 },
  { day: "Day 25", value: 86 },
  { day: "Day 30", value: 93 },
];

const defaultActiveUsersTrendData = [
  { day: "W1", value: 1820 },
  { day: "W2", value: 1940 },
  { day: "W3", value: 2080 },
  { day: "W4", value: 2210 },
  { day: "W5", value: 2380 },
  { day: "W6", value: 2520 },
  { day: "W7", value: 2680 },
  { day: "W8", value: 2845 },
];

function DashboardPage({
  activePage,
  onNavigate,
  activityOverviewData = defaultActivityOverviewData,
  activeUsersTrendData = defaultActiveUsersTrendData,
}) {
    useEffect(() => {
      connectSocket();
      onSOSActive((data) => {
        console.log("SOS received: ", data);
        // logic for sos event etc goes here btw
      });
      return () => disconnectSocket();
    }, []);

  const statusItems = [
    {
      label: "Mobile App Users",
      value: "2,845",
      width: "90%",
      className: "status-bar-gold",
    },
    {
      label: "System Health",
      value: "98.5%",
      width: "98.5%",
      className: "status-bar-green",
    },
    {
      label: "Alert Response Rate",
      value: "94%",
      width: "94%",
      className: "status-bar-red",
    },
    {
      label: "Report Resolution",
      value: "87%",
      width: "87%",
      className: "status-bar-darkgreen",
    },
  ];

  return (
    <div className="admin-layout">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />

      <main className="admin-content">
        <AdminHeader />

        <div className="standard-page-content">
          <div className="page-heading">
            <h1>Dashboard Overview</h1>
            <p>Welcome to the Algonquin GO admin portal.</p>
          </div>

          <div className="dashboard-top-stats">
            <section className="dashboard-stat-card">
              <BellIcon size={34} />
              <h3>Recent Notifications</h3>
              <div className="dashboard-stat-value-row">
                <h2>230</h2>
                <span className="trend-positive">↗ +12%</span>
              </div>
            </section>

            <section className="dashboard-stat-card">
              <FileTextIcon size={34} />
              <h3>User Reports</h3>
              <div className="dashboard-stat-value-row">
                <h2>120</h2>
                <span className="trend-positive">↗ +8%</span>
              </div>
            </section>

            <section className="dashboard-stat-card">
              <WarningCircleIcon size={34} />
              <h3>Recent Alerts</h3>
              <div className="dashboard-stat-value-row">
                <h2>45</h2>
                <span className="trend-negative">↘ -15%</span>
              </div>
            </section>

            <section className="dashboard-stat-card">
              <SirenIcon size={34} />
              <h3>Emergencies</h3>
              <div className="dashboard-stat-value-row">
                <h2>4</h2>
                <span className="trend-negative">↘ -9%</span>
              </div>
            </section>
          </div>

          <section className="dashboard-chart-card">
            <h2>Activity Overview (Last 30 Days)</h2>
            <div className="dashboard-chart-placeholder">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={activityOverviewData}
                  margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
                >
                  <CartesianGrid stroke="#d7d7d7" strokeDasharray="4 4" />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#7d7d7d", fontSize: 12 }}
                    axisLine={{ stroke: "#7d7d7d" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#7d7d7d", fontSize: 12 }}
                    axisLine={{ stroke: "#7d7d7d" }}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ stroke: "#c6c9cc", strokeWidth: 1 }}
                    contentStyle={{
                      borderRadius: 12,
                      borderColor: "#c6c9cc",
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#c98500"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <div className="dashboard-bottom-grid">
            <section className="dashboard-card">
              <div className="dashboard-card-header">
                <div>
                  <h2>Active Users</h2>
                  <h3>2,845</h3>
                  <p>+12 this week</p>
                </div>
                <UserIcon size={44} />
              </div>

              <div className="dashboard-chart-placeholder small">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={activeUsersTrendData}
                    margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
                  >
                    <CartesianGrid stroke="#d7d7d7" strokeDasharray="4 4" />
                    <XAxis
                      dataKey="day"
                      tick={{ fill: "#7d7d7d", fontSize: 12 }}
                      axisLine={{ stroke: "#7d7d7d" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#7d7d7d", fontSize: 12 }}
                      axisLine={{ stroke: "#7d7d7d" }}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ stroke: "#c6c9cc", strokeWidth: 1 }}
                      contentStyle={{
                        borderRadius: 12,
                        borderColor: "#c6c9cc",
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#1b56b3"
                      strokeWidth={3}
                      dot={{ r: 4.5, fill: "#1b56b3", stroke: "#1b56b3" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="dashboard-card">
              <h2>System Status</h2>

              <div className="system-status-list">
                {statusItems.map((item) => (
                  <div key={item.label} className="system-status-item">
                    <div className="status-row">
                      <span>{item.label}</span>
                      <span>{item.value}</span>
                    </div>

                    <div className="status-track">
                      <div
                        className={`status-fill ${item.className}`}
                        style={{ width: item.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
