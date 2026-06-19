import {
  BellIcon,
  FileTextIcon,
  WarningCircleIcon,
  SirenIcon,
  UserIcon
} from '@phosphor-icons/react';
import AdminHeader from '../Components/AdminHeader';
import Sidebar from '../Components/Sidebar';

function DashboardPage({ activePage, onNavigate }) {
  const statusItems = [
    { label: 'Mobile App Users', value: '2,845', width: '90%', className: 'status-bar-gold' },
    { label: 'System Health', value: '98.5%', width: '98.5%', className: 'status-bar-green' },
    { label: 'Alert Response Rate', value: '94%', width: '94%', className: 'status-bar-red' },
    { label: 'Report Resolution', value: '87%', width: '87%', className: 'status-bar-darkgreen' }
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
              <svg viewBox="0 0 900 220" className="dashboard-svg-chart">
                <line x1="60" y1="20" x2="60" y2="190" className="chart-axis" />
                <line x1="60" y1="190" x2="860" y2="190" className="chart-axis" />

                {[...Array(6)].map((_, index) => (
                  <line
                    key={`h-${index}`}
                    x1="60"
                    y1={20 + index * 34}
                    x2="860"
                    y2={20 + index * 34}
                    className="chart-grid-line"
                  />
                ))}

                {[...Array(16)].map((_, index) => (
                  <line
                    key={`v-${index}`}
                    x1={60 + index * 50}
                    y1="20"
                    x2={60 + index * 50}
                    y2="190"
                    className="chart-grid-line"
                  />
                ))}

                <path
                  d="M60 120
                     C90 80, 120 140, 150 95
                     S210 140, 240 85
                     S300 120, 330 80
                     S390 130, 420 90
                     S480 120, 510 75
                     S570 115, 600 85
                     S660 125, 690 82
                     S750 110, 780 88
                     S840 115, 860 72"
                  className="chart-line-orange"
                />
              </svg>
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
                <svg viewBox="0 0 420 220" className="dashboard-svg-chart">
                  <line x1="40" y1="20" x2="40" y2="190" className="chart-axis" />
                  <line x1="40" y1="190" x2="390" y2="190" className="chart-axis" />

                  {[...Array(5)].map((_, index) => (
                    <line
                      key={`grid-${index}`}
                      x1="40"
                      y1={20 + index * 42}
                      x2="390"
                      y2={20 + index * 42}
                      className="chart-grid-line"
                    />
                  ))}

                  {[...Array(6)].map((_, index) => (
                    <line
                      key={`gridv-${index}`}
                      x1={40 + index * 70}
                      y1="20"
                      x2={40 + index * 70}
                      y2="190"
                      className="chart-grid-line"
                    />
                  ))}

                  <polyline
                    points="40,165 60,160 80,150 100,140 120,130 140,120 160,110 180,100 200,90 220,80 240,70 260,62 280,58 300,54 320,50 340,46 360,42 390,38"
                    className="chart-line-blue"
                  />

                  {[
                    [40, 165], [60, 160], [80, 150], [100, 140], [120, 130], [140, 120],
                    [160, 110], [180, 100], [200, 90], [220, 80], [240, 70], [260, 62],
                    [280, 58], [300, 54], [320, 50], [340, 46], [360, 42], [390, 38]
                  ].map(([x, y], index) => (
                    <circle key={index} cx={x} cy={y} r="4.5" className="chart-dot-blue" />
                  ))}
                </svg>
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