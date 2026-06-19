import { useState } from 'react';
import AdminHeader from '../Components/AdminHeader';
import Sidebar from '../Components/Sidebar';
import ReportInbox from '../Components/ReportInbox';
import ReportsAnalytics from '../Components/ReportsAnalytics';
import ReportsSearch from '../Components/ReportsSearch';

function ReportsPage({ activePage, onNavigate }) {
  const [searchText, setSearchText] = useState('');

  const reports = [
    {
      reportId: 'RPT-2026-048',
      title: 'Broken light in parking lot',
      location: 'Parking lot C',
      category: 'Incident',
      status: 'Open'
    },
    {
      reportId: 'RPT-2026-047',
      title: 'Laptop stolen from library',
      location: 'Library 3rd floor',
      category: 'Incident',
      status: 'Open'
    },
    {
      reportId: 'RPT-2026-046',
      title: 'Slippery walkway near entrance',
      location: 'Entrance E building',
      category: 'Incident',
      status: 'Resolved'
    },
    {
      reportId: 'RPT-2026-045',
      title: 'Personal belonging missing',
      location: 'Building B study space',
      category: 'Incident',
      status: 'Resolved'
    }

  ];

  const filteredReports = reports.filter((report) =>
    report.title.toLowerCase().includes(searchText.toLowerCase()) ||
    report.reportId.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="admin-layout">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />

      <main className="admin-content">
        <AdminHeader />

        <div className="reports-page-content">
          <section>
            <div className="page-heading">
              <h1>User Reports</h1>
              <p>Review and manage user-submitted reports.</p>
            </div>

            <ReportsSearch searchText={searchText} onSearchChange={setSearchText} />
            <ReportInbox reports={filteredReports} />
          </section>

          <aside
             className="analytics-column">
            <ReportsAnalytics reports={reports}  />
          </aside>
        </div>
      </main>
    </div>
  );
}

export default ReportsPage;