import { useState } from "react";
import AdminHeader from "../Components/AdminHeader";
import Sidebar from "../Components/Sidebar";
import ReportInbox from "../Components/ReportInbox";
import ReportsAnalytics from "../Components/ReportsAnalytics";
import ReportsSearch from "../Components/ReportsSearch";
import ReportDetailsModal from "../Components/ReportDetailsModel";
import brokenLightImage from "../assets/brokenlight.png";

function ReportsPage({ activePage, onNavigate }) {
  const [searchText, setSearchText] = useState("");
  const [selectedReportId, setSelectedReportId] = useState(null);

  function handleSearchChange(value) {
    setSearchText(value);
  }

  const initialReports = [
    {
      reportId: "RPT-2026-048",
      title: "Broken light in parking lot",
      location: "Parking lot C",
      category: "Incident",
      status: "Open",
      submissionDateTime: "2026-02-02 14:30",
      reporter: {
        name: "Anonymous",
        email: "Anonymous",
      },
      details: {
        incidentDetails: "Broken light in parking lot",
        location: "Parking lot C",
        dateOfIncident: "2026-02-02",
        timeOfIncident: "-",
      },
      attachments: [
        {
          id: "att-1",
          src: brokenLightImage,
          alt: "Broken parking lot light",
        },
      ],
    },
    {
      reportId: "RPT-2026-047",
      title: "Laptop stolen from library",
      location: "Library 3rd floor",
      category: "Lost item",
      status: "Open",
      submissionDateTime: "2026-01-31 09:25",
      reporter: {
        name: "Anonymous",
        email: "Anonymous",
      },
      details: {
        incidentDetails: "Laptop missing from study table in library.",
        location: "Library 3rd floor",
        dateOfIncident: "2026-01-31",
        timeOfIncident: "09:10",
      },
      attachments: [
        {
          id: "att-2",
          src: brokenLightImage,
          alt: "Report attachment",
        },
      ],
    },
    {
      reportId: "RPT-2026-046",
      title: "Slippery walkway near entrance",
      location: "Entrance E building",
      category: "Lost item",
      status: "Resolved",
      submissionDateTime: "2026-01-29 10:50",
      reporter: {
        name: "Anonymous",
        email: "Anonymous",
      },
      details: {
        incidentDetails: "Slippery surface near the entrance due to ice.",
        location: "Entrance E building",
        dateOfIncident: "2026-01-29",
        timeOfIncident: "10:35",
      },
      attachments: [
        {
          id: "att-3",
          src: brokenLightImage,
          alt: "Report attachment",
        },
      ],
    },
    {
      reportId: "RPT-2026-045",
      title: "Suspicious activity",
      location: "Student Commons",
      category: "Incident",
      status: "Resolved",
      submissionDateTime: "2026-01-26 20:12",
      reporter: {
        name: "Anonymous",
        email: "Anonymous",
      },
      details: {
        incidentDetails: "Suspicious person observed near student commons.",
        location: "Student Commons",
        dateOfIncident: "2026-01-26",
        timeOfIncident: "20:00",
      },
      attachments: [
        {
          id: "att-4",
          src: brokenLightImage,
          alt: "Report attachment",
        },
      ],
    },
    {
      reportId: "RPT-2026-044",
      title: "Personal belonging missing",
      location: "Building B",
      category: "Lost item",
      status: "Open",
      submissionDateTime: "2026-01-21 16:40",
      reporter: {
        name: "Anonymous",
        email: "Anonymous",
      },
      details: {
        incidentDetails: "Bag missing from common area in building B.",
        location: "Building B",
        dateOfIncident: "2026-01-21",
        timeOfIncident: "16:10",
      },
      attachments: [
        {
          id: "att-5",
          src: brokenLightImage,
          alt: "Report attachment",
        },
      ],
    },
  ];

  const [reports, setReports] = useState(initialReports);

  const analyticsMeta = {
    totalReportsDelta: "+12 this week",
    openReportsHint: "Needs attention",
    resolvedReportsHint: "This Month",
    avgResponseTime: "4.5h",
    avgResponseTimeHint: "-1h improvement",
  };

  const openReportsCount = reports.filter(
    (report) => report.status.toLowerCase() === "open",
  ).length;

  const resolvedReportsCount = reports.filter(
    (report) => report.status.toLowerCase() === "resolved",
  ).length;

  const analyticsSummary = {
    totalReports: reports.length,
    totalReportsDelta: analyticsMeta.totalReportsDelta,
    openReports: openReportsCount,
    openReportsHint: analyticsMeta.openReportsHint,
    resolvedReports: resolvedReportsCount,
    resolvedReportsHint: analyticsMeta.resolvedReportsHint,
    avgResponseTime: analyticsMeta.avgResponseTime,
    avgResponseTimeHint: analyticsMeta.avgResponseTimeHint,
  };

  const distributionCounts = reports.reduce((accumulator, report) => {
    const key = report.category;
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});

  const distributionData = Object.entries(distributionCounts).map(
    ([label, value]) => ({
      label,
      value,
    }),
  );

  const resolutionRateData = [
    { month: "Feb", rate: 70 },
    { month: "Mar", rate: 68 },
    { month: "Apr", rate: 79 },
    { month: "May", rate: 83 },
    { month: "Jun", rate: 76 },
    { month: "Jul", rate: 88 },
    { month: "Aug", rate: 86 },
    { month: "Sep", rate: 90 },
    { month: "Oct", rate: 89 },
    { month: "Nov", rate: 93 },
  ];

  const selectedReport = reports.find(
    (report) => report.reportId === selectedReportId,
  );

  function handleSelectReport(reportId) {
    setSelectedReportId(reportId);
  }

  function handleBackToReports() {
    setSelectedReportId(null);
  }

  function handleMarkResolved(reportId) {
    setReports((currentReports) =>
      currentReports.map((report) =>
        report.reportId === reportId
          ? {
              ...report,
              status: "Resolved",
            }
          : report,
      ),
    );
  }

  return (
    <div className="admin-layout">
      <AdminHeader />

      <div className="admin-body">
        <Sidebar activePage={activePage} onNavigate={onNavigate} />

        <main className="admin-content">
          {selectedReport ? (
            <ReportDetailsModal
              report={selectedReport}
              onBack={handleBackToReports}
              onMarkResolved={handleMarkResolved}
            />
          ) : (
            <>
              <div className="standard-page-content page-heading">
                <h1>User Reports</h1>
                <p>Review and manage user-submitted reports.</p>
              </div>

              <div className="reports-page-content">
                <section>
                  <ReportsSearch
                    searchText={searchText}
                    onSearchChange={handleSearchChange}
                  />
                  <ReportInbox
                    reports={reports}
                    onSelectReport={handleSelectReport}
                  />
                </section>

                <aside className="analytics-column">
                  <ReportsAnalytics
                    analyticsSummary={analyticsSummary}
                    distributionData={distributionData}
                    resolutionRateData={resolutionRateData}
                  />
                </aside>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default ReportsPage;
