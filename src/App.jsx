import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReportsPage from "./pages/ReportsPage";
import SendAlertPage from "./pages/SendAlertPage";
import EventsPage from "./pages/EventsPage";
import NavigationPage from "./pages/NavigationPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import LoadingAnimation from "./pages/LoadingAnimation";
import ProtectedRoute from "./Components/ProtectedRoute";
import {
  getAdminCredentials,
  hasAdminToken,
  loginAdmin,
  logoutAdmin,
} from "./services/authService";
import "./App.css";

function App() {
  const [adminUsername, setAdminUsername] = useState("Admin user");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(hasAdminToken());

  const headerProps = useMemo(
    () => ({
      username: adminUsername,
      onLogout: async () => {
        await logoutAdmin();
        setIsAuthenticated(false);
        setAdminUsername("Admin user");
        setAuthSuccess("Logout successful.");
      },
    }),
    [adminUsername],
  );

  useEffect(() => {
    if (!isAuthenticated) return;

    let mounted = true;
    getAdminCredentials()
      .then((credentials) => {
        if (!mounted) return;
        setAdminUsername(credentials?.username || "Admin user");
      })
      .catch(async () => {
        if (!mounted) return;
        await logoutAdmin();
        setIsAuthenticated(false);
      });

    return () => {
      mounted = false;
    };
  }, [isAuthenticated]);

  async function handleLogin(credentials) {
    setAuthError("");
    setAuthSuccess("");
    setAuthLoading(true);
    try {
      const result = await loginAdmin(credentials);
      setAdminUsername(result?.username || "Admin user");
      setIsAuthenticated(true);
    } catch (error) {
      setAuthError(error.message || "Failed to login");
    } finally {
      setAuthLoading(false);
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LoginPage
              onLogin={handleLogin}
              isLoading={authLoading}
              errorMessage={authError}
              successMessage={authSuccess}
            />
          }
        />
        <Route
          path="/loading"
          element={
            <ProtectedRoute>
              <LoadingAnimation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage
                activePage="dashboard"
                onNavigate={() => {}}
                headerProps={headerProps}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/communications"
          element={
            <ProtectedRoute>
              <SendAlertPage
                activePage="communications"
                onNavigate={() => {}}
                headerProps={headerProps}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsPage
                activePage="reports"
                onNavigate={() => {}}
                headerProps={headerProps}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/navigation"
          element={
            <ProtectedRoute>
              <NavigationPage
                activePage="navigation"
                onNavigate={() => {}}
                headerProps={headerProps}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <EventsPage
                activePage="events"
                onNavigate={() => {}}
                headerProps={headerProps}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
