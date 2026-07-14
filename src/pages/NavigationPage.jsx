import {
  MapPinIcon,
  StackIcon,
  FireExtinguisherIcon,
  ShieldCheckIcon,
  SirenIcon,
} from "@phosphor-icons/react";
import AdminHeader from "../Components/AdminHeader";
import Sidebar from "../Components/Sidebar";
import campusMap from "../assets/campus-map.png";

function NavigationPage({ headerProps }) {
  return (
    <div className="admin-layout">
      <AdminHeader {...headerProps} />

      <div className="admin-body">
        <Sidebar />

        <main className="admin-content">
          <div className="standard-page-content">
            <div className="page-heading">
              <h1>Campus Map</h1>
              <p>
                Interactive campus map with floor plans and emergency locations
              </p>
            </div>

            <section className="navigation-tabs-card">
              <button type="button" className="navigation-tab-button active">
                <MapPinIcon size={22} />
                <span>Campus Map</span>
              </button>

              <button type="button" className="navigation-tab-button">
                <StackIcon size={22} />
                <span>Floor Plans</span>
              </button>

              <button type="button" className="navigation-tab-button">
                <FireExtinguisherIcon size={22} />
                <span>Fire &amp; Emergency Plans</span>
              </button>
            </section>

            <section className="navigation-map-card">
              <h2>Interactive Campus View</h2>

              <div className="navigation-map-image-wrap">
                <img
                  src={campusMap}
                  alt="Campus map"
                  className="navigation-map-image"
                />
              </div>
            </section>

            <div className="navigation-stats">
              <section className="navigation-stat-card">
                <StackIcon size={34} />
                <h3>Total Buildings</h3>
                <p>12</p>
              </section>

              <section className="navigation-stat-card">
                <SirenIcon size={34} />
                <h3>Emergency Exit</h3>
                <p>48</p>
              </section>

              <section className="navigation-stat-card">
                <FireExtinguisherIcon size={34} />
                <h3>Extinguishers</h3>
                <p>156</p>
              </section>

              <section className="navigation-stat-card">
                <ShieldCheckIcon size={34} />
                <h3>AED Station</h3>
                <p>18</p>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default NavigationPage;
