import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const categoryColorMap = {
  incident: "var(--color-report-incident)",
  "lost item": "var(--color-report-lost-item)",
};

function renderDistributionAxisTick({ x, y, payload }) {
  return (
    <text x={x - 88} y={y} dy={4} fill="#222" fontSize={14} textAnchor="start">
      {payload.value}
    </text>
  );
}

function renderDistributionBarShape(props) {
  const { x, y, width, height, payload } = props;
  const fillColor = payload?.color || "var(--color-text-secondary)";
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={8}
      ry={8}
      fill={fillColor}
    />
  );
}

function ReportsAnalytics({
  analyticsSummary,
  distributionData,
  resolutionRateData,
}) {
  const distributionChartData = distributionData.map((item) => ({
    ...item,
    color:
      categoryColorMap[item.label.toLowerCase()] ||
      "var(--color-text-secondary)",
  }));

  return (
    <>
      <section className="reports-analytics-card">
        <h2 className="reports-analytics-title">Analytics</h2>

        <div className="reports-analytics-item">
          <h3>Total Reports</h3>
          <strong>{analyticsSummary.totalReports}</strong>
          <p>{analyticsSummary.totalReportsDelta}</p>
        </div>

        <div className="reports-analytics-divider" />

        <div className="reports-analytics-item">
          <h3>Open Reports</h3>
          <strong>{analyticsSummary.openReports}</strong>
          <p>{analyticsSummary.openReportsHint}</p>
        </div>

        <div className="reports-analytics-divider" />

        <div className="reports-analytics-item">
          <h3>Resolved Reports</h3>
          <strong>{analyticsSummary.resolvedReports}</strong>
          <p>{analyticsSummary.resolvedReportsHint}</p>
        </div>

        <div className="reports-analytics-divider" />

        <div className="reports-analytics-item">
          <h3>Avg Response time</h3>
          <strong>{analyticsSummary.avgResponseTime}</strong>
          <p>{analyticsSummary.avgResponseTimeHint}</p>
        </div>
      </section>

      <section className="reports-analytics-card reports-distribution-card">
        <h2 className="reports-analytics-title">Report Distribution</h2>

        <div className="reports-chart-wrap reports-distribution-chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={distributionChartData}
              layout="vertical"
              margin={{ top: 4, right: 12, bottom: 0, left: 4 }}
            >
              <XAxis type="number" hide domain={[0, "dataMax"]} />
              <YAxis
                type="category"
                dataKey="label"
                width={96}
                tick={renderDistributionAxisTick}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={false}
                contentStyle={{
                  borderRadius: 10,
                  borderColor: "#c6c9cc",
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="value"
                barSize={6}
                shape={renderDistributionBarShape}
              >
                <LabelList
                  dataKey="value"
                  position="right"
                  fill="var(--color-report-line-dot)"
                  fontSize={13}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="reports-analytics-card reports-resolution-card">
        <h2 className="reports-analytics-title">Resolution Rate</h2>

        <div className="reports-chart-wrap reports-resolution-chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={resolutionRateData}
              margin={{ top: 8, right: 10, left: 8, bottom: 0 }}
            >
              <CartesianGrid stroke="#d7d7d7" strokeDasharray="4 4" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#6c7278", fontSize: 10 }}
                axisLine={{ stroke: "#7d7d7d" }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#6c7278", fontSize: 10 }}
                axisLine={{ stroke: "#7d7d7d" }}
                tickLine={false}
                width={36}
              />
              <Tooltip
                cursor={{ stroke: "#c6c9cc", strokeWidth: 1 }}
                contentStyle={{
                  borderRadius: 10,
                  borderColor: "#c6c9cc",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="var(--color-report-incident)"
                strokeWidth={2}
                dot={{
                  r: 2.8,
                  fill: "var(--color-report-line-dot)",
                  stroke: "var(--color-report-line-dot)",
                }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  );
}

export default ReportsAnalytics;
