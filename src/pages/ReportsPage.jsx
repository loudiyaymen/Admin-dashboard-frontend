import { useEffect, useMemo, useState } from "react";
import AdminHeader from "../Components/AdminHeader";
import EmptyState from "../Components/EmptyState";
import PageErrorState from "../Components/PageErrorState";
import Sidebar from "../Components/Sidebar";
import ReportInbox from "../Components/ReportInbox";
import ReportsAnalytics from "../Components/ReportsAnalytics";
import ReportsSearch from "../Components/ReportsSearch";
import ReportDetailsModal from "../Components/ReportDetailsModel";
import { fetchReports, resolveReport } from "../services/reportsservice";
import {
  fetchResolutionRates,
  fetchReportDistribution,
} from "../services/analyticsService";

function ReportsPage({ headerProps }) {
  const [searchText, setSearchText] = useState("");
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [reports, setReports] = useState([]);
  const [resolutionRateData, setResolutionRateData] = useState([]);
  const [distributionDataFromApi, setDistributionDataFromApi] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  function handleSearchChange(value) {
    setSearchText(value);
  }

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const [reportsData, ratesData, distData] = await Promise.all([
          fetchReports(),
          fetchResolutionRates(),
          fetchReportDistribution(),
        ]);

        if (!mounted) return;

        setReports(reportsData);
        setResolutionRateData(ratesData?.data || []);
        setDistributionDataFromApi(distData?.data || []);
      } catch (error) {
        if (mounted) {
          setErrorMessage(error.message || "Failed to load reports");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredReports = useMemo(() => {
    const term = searchText.trim().toLowerCase();
    if (!term) return reports;

    return reports.filter((report) => {
      return (
        report.title.toLowerCase().includes(term) ||
        report.reportId.toLowerCase().includes(term)
      );
    });
  }, [reports, searchText]);

  const analyticsMeta = {
    totalReportsDelta: "+12 this week",
    openReportsHint: "Needs attention",
    resolvedReportsHint: "This Month",
    avgResponseTime: "4.5h",
    avgResponseTimeHint: "-1h improvement",
  };

  const openReportsCount = filteredReports.filter(
    (report) => report.status.toLowerCase() === "open",
  ).length;

  const resolvedReportsCount = filteredReports.filter(
    (report) => report.status.toLowerCase() === "resolved",
  ).length;

  const analyticsSummary = {
    totalReports: filteredReports.length,
    totalReportsDelta: analyticsMeta.totalReportsDelta,
    openReports: openReportsCount,
    openReportsHint: analyticsMeta.openReportsHint,
    resolvedReports: resolvedReportsCount,
    resolvedReportsHint: analyticsMeta.resolvedReportsHint,
    avgResponseTime: analyticsMeta.avgResponseTime,
    avgResponseTimeHint: analyticsMeta.avgResponseTimeHint,
  };

  const distributionData =
    distributionDataFromApi.length > 0
      ? distributionDataFromApi
      : Object.entries(
          filteredReports.reduce((accumulator, report) => {
            const key = report.category;
            accumulator[key] = (accumulator[key] || 0) + 1;
            return accumulator;
          }, {}),
        ).map(([label, value]) => ({
          label,
          value,
        }));

  const selectedReport = reports.find(
    (report) => report.reportId === selectedReportId,
  );

  function handleSelectReport(reportId) {
    setSelectedReportId(reportId);
  }

  function handleBackToReports() {
    setSelectedReportId(null);
  }

  async function handleMarkResolved(reportId) {
    const updated = await resolveReport(reportId);
    setReports((currentReports) =>
      currentReports.map((report) =>
        report.reportId === reportId ? { ...report, ...updated } : report,
      ),
    );
  }

  return (
    <div className="admin-layout">
      <AdminHeader {...headerProps} />

      <div className="admin-body">
        <Sidebar />

        <main className="admin-content">
          {errorMessage && reports.length === 0 ? (
            <div className="standard-page-content">
              <PageErrorState
                description={errorMessage}
                onRetry={() => window.location.reload()}
              />
            </div>
          ) : selectedReport ? (
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
                  {isLoading ? <p>Loading reports...</p> : null}
                  {errorMessage ? (
                    <p className="app-message-error">{errorMessage}</p>
                  ) : null}
                  <ReportInbox
                    reports={filteredReports}
                    onSelectReport={handleSelectReport}
                    emptyTitle={
                      searchText.trim()
                        ? "No matching reports found"
                        : "No reports to show yet"
                    }
                    emptyDescription={
                      searchText.trim()
                        ? "Try a different title or report ID."
                        : "Reports submitted through the mobile app will appear here."
                    }
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
