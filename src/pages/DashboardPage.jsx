import { useEffect, useState } from "react";
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
import EmptyState from "../Components/EmptyState";
import PageErrorState from "../Components/PageErrorState";
import Sidebar from "../Components/Sidebar";
import {
  fetchDashboardMetrics,
  fetchActivityOverview,
  fetchActiveUsersTrend,
} from "../services/analyticsService.js";

const MOCK_METRICS = {
  recentNotifications: 230,
  notificationTrend: 12,
  reportsSubmitted: 120,
  reportTrend: 8,
  emergencyResponses: 45,
  emergencyTrend: -15,
  activeUsers: 2845,
  totalUsers: 3200,
  openReports: 34,
  resolvedReports: 86,
  pendingReports: 14,
  userEngagementRate: 89,
};

const MOCK_ACTIVITY_OVERVIEW = [
  { day: "Day 1", value: 42 },
  { day: "Day 5", value: 61 },
  { day: "Day 10", value: 53 },
  { day: "Day 15", value: 74 },
  { day: "Day 20", value: 68 },
  { day: "Day 25", value: 86 },
  { day: "Day 30", value: 93 },
];

const MOCK_ACTIVE_USERS_TREND = [
  { day: "W1", value: 1820 },
  { day: "W2", value: 1940 },
  { day: "W3", value: 2080 },
  { day: "W4", value: 2210 },
  { day: "W5", value: 2380 },
  { day: "W6", value: 2520 },
  { day: "W7", value: 2680 },
  { day: "W8", value: 2845 },
];

function formatActivityTick(value) {
  return String(value || "").replace(/^Day\s*/i, "");
}

function DashboardPage({ headerProps }) {
  const [metrics, setMetrics] = useState(null);
  const [activityOverviewData, setActivityOverviewData] = useState([]);
  const [activeUsersTrendData, setActiveUsersTrendData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showEmptyState, setShowEmptyState] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const [metricsData, activityData, usersData] = await Promise.all([
          fetchDashboardMetrics(),
          fetchActivityOverview(),
          fetchActiveUsersTrend(),
        ]);

        if (!mounted) return;

        const fetchedMetrics = metricsData?.data || {};
        const hasDashboardData =
          Object.keys(fetchedMetrics).length > 0 ||
          (activityData?.data?.length || 0) > 0 ||
          (usersData?.data?.length || 0) > 0;

        setShowEmptyState(!hasDashboardData);

        if (!hasDashboardData) {
          setMetrics(null);
          setActivityOverviewData([]);
          setActiveUsersTrendData([]);
          return;
        }

        const metricsToUse = {
          recentNotifications:
            fetchedMetrics.recentNotifications ??
            MOCK_METRICS.recentNotifications,
          notificationTrend:
            fetchedMetrics.notificationTrend ?? MOCK_METRICS.notificationTrend,
          reportsSubmitted:
            fetchedMetrics.reportsSubmitted ?? MOCK_METRICS.reportsSubmitted,
          reportTrend: fetchedMetrics.reportTrend ?? MOCK_METRICS.reportTrend,
          emergencyResponses:
            fetchedMetrics.emergencyResponses ??
            MOCK_METRICS.emergencyResponses,
          emergencyTrend:
            fetchedMetrics.emergencyTrend ?? MOCK_METRICS.emergencyTrend,
          activeUsers: fetchedMetrics.activeUsers ?? MOCK_METRICS.activeUsers,
          totalUsers: fetchedMetrics.totalUsers ?? MOCK_METRICS.totalUsers,
          openReports: fetchedMetrics.openReports ?? MOCK_METRICS.openReports,
          resolvedReports:
            fetchedMetrics.resolvedReports ?? MOCK_METRICS.resolvedReports,
          pendingReports:
            fetchedMetrics.pendingReports ?? MOCK_METRICS.pendingReports,
          userEngagementRate:
            fetchedMetrics.userEngagementRate ??
            MOCK_METRICS.userEngagementRate,
        };

        setMetrics(metricsToUse);
        setActivityOverviewData(
          activityData?.data && activityData.data.length > 0
            ? activityData.data
            : MOCK_ACTIVITY_OVERVIEW,
        );
        setActiveUsersTrendData(
          usersData?.data && usersData.data.length > 0
            ? usersData.data
            : MOCK_ACTIVE_USERS_TREND,
        );
        setShowEmptyState(false);
      } catch (error) {
        if (!mounted) return;
        setErrorMessage(error.message || "Failed to load dashboard data");
        setMetrics(MOCK_METRICS);
        setActivityOverviewData(MOCK_ACTIVITY_OVERVIEW);
        setActiveUsersTrendData(MOCK_ACTIVE_USERS_TREND);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const statusItems = metrics
    ? [
        {
          label: "Mobile App Users",
          value: metrics.activeUsers?.toLocaleString() || "0",
          width: "90%",
          className: "status-bar-gold",
        },
        {
          label: "Pending Report Backlog",
          value: metrics.pendingReports || "0",
          width: `${Math.min(100, (metrics.pendingReports / 50) * 100)}%`,
          className: "status-bar-red",
        },
        {
          label: "User Engagement Rate",
          value: `${metrics.userEngagementRate || 0}%`,
          width: `${metrics.userEngagementRate || 0}%`,
          className: "status-bar-green",
        },
        {
          label: "Report Resolution",
          value: metrics.resolvedReports
            ? `${Math.round((metrics.resolvedReports / (metrics.resolvedReports + metrics.openReports)) * 100)}%`
            : "0%",
          width: metrics.resolvedReports
            ? `${Math.round((metrics.resolvedReports / (metrics.resolvedReports + metrics.openReports)) * 100)}%`
            : "0%",
          className: "status-bar-darkgreen",
        },
      ]
    : [];

  return (
    <div className="admin-layout">
      <AdminHeader {...headerProps} />

      <div className="admin-body">
        <Sidebar />

        <main className="admin-content">
          <div className="standard-page-content">
            <div className="page-heading">
              <h1>Dashboard Overview</h1>
              <p>Welcome to the Algonquin GO admin portal.</p>
            </div>

            {errorMessage ? (
              <PageErrorState
                title="Oops! Something went wrong"
                description={errorMessage}
                onRetry={() => window.location.reload()}
              />
            ) : showEmptyState ? (
              <EmptyState
                className="dashboard-empty-state"
                title="No dashboard data yet"
                description="Metrics and trend charts will appear here once the backend has data to show."
              />
            ) : isLoading ? (
              <div className="loading-message">Loading dashboard data...</div>
            ) : (
              <>
                <div className="dashboard-top-stats">
                  <section className="dashboard-stat-card">
                    <BellIcon size={34} />
                    <h3>Recent Notifications</h3>
                    <div className="dashboard-stat-value-row">
                      <h2>{metrics?.recentNotifications || 0}</h2>
                      <span
                        className={
                          (metrics?.notificationTrend || 0) >= 0
                            ? "trend-positive"
                            : "trend-negative"
                        }
                      >
                        {(metrics?.notificationTrend || 0) >= 0 ? "↗" : "↘"}{" "}
                        {metrics?.notificationTrend || 0}%
                      </span>
                    </div>
                  </section>

                  <section className="dashboard-stat-card">
                    <FileTextIcon size={34} />
                    <h3>User Reports</h3>
                    <div className="dashboard-stat-value-row">
                      <h2>{metrics?.reportsSubmitted || 0}</h2>
                      <span
                        className={
                          (metrics?.reportTrend || 0) >= 0
                            ? "trend-positive"
                            : "trend-negative"
                        }
                      >
                        {(metrics?.reportTrend || 0) >= 0 ? "↗" : "↘"}{" "}
                        {metrics?.reportTrend || 0}%
                      </span>
                    </div>
                  </section>

                  <section className="dashboard-stat-card">
                    <WarningCircleIcon size={34} />
                    <h3>Recent Alerts</h3>
                    <div className="dashboard-stat-value-row">
                      <h2>{metrics?.emergencyResponses || 0}</h2>
                      <span
                        className={
                          (metrics?.emergencyTrend || 0) >= 0
                            ? "trend-positive"
                            : "trend-negative"
                        }
                      >
                        {(metrics?.emergencyTrend || 0) >= 0 ? "↗" : "↘"}{" "}
                        {metrics?.emergencyTrend || 0}%
                      </span>
                    </div>
                  </section>

                  <section className="dashboard-stat-card">
                    <SirenIcon size={34} />
                    <h3>Emergencies</h3>
                    <div className="dashboard-stat-value-row">
                      <h2>{metrics?.emergencyResponses || 0}</h2>
                      <span
                        className={
                          (metrics?.emergencyTrend || 0) >= 0
                            ? "trend-positive"
                            : "trend-negative"
                        }
                      >
                        {(metrics?.emergencyTrend || 0) >= 0 ? "↗" : "↘"}{" "}
                        {metrics?.emergencyTrend || 0}%
                      </span>
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
                          tickFormatter={formatActivityTick}
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
                        <h3>{metrics?.activeUsers || 0}</h3>
                        <p>
                          {metrics?.totalUsers
                            ? `${metrics.totalUsers} total users`
                            : "Loading..."}
                        </p>
                      </div>
                      <UserIcon size={44} />
                    </div>

                    <div className="dashboard-chart-placeholder small">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={activeUsersTrendData}
                          margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
                        >
                          <CartesianGrid
                            stroke="#d7d7d7"
                            strokeDasharray="4 4"
                          />
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
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;
