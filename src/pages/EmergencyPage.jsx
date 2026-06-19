import AdminHeader from '../Components/AdminHeader';
import Sidebar from '../Components/Sidebar';

function EmergencyPage({ activePage, onNavigate }) {
  const reports = [
    'EMR-2026-012',
    'EMR-2026-011',
    'EMR-2026-010',
    'EMR-2026-09'
  ];

  return (
    <div className="admin-layout">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />

      <main className="admin-content">
        <AdminHeader />

        <div className="standard-page-content">
          <div className="page-heading">
            <h1>Emergency Dashboard</h1>
            <p>Monitor SOS calls from the mobile app.</p>
          </div>

          <section className="emergency-log-card">
            <h2>Emergency Report Log</h2>

            <div className="emergency-log-table">
              <div className="emergency-log-header">
                <span>ID</span>
                <span>Time</span>
              </div>

              {reports.map((reportId) => (
                <div key={reportId} className="emergency-log-row">
                  <span>{reportId}</span>
                  <span>2026-02-02 11:45</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default EmergencyPage;