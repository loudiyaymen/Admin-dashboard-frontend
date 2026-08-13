import { Navigate } from "react-router-dom";
import { hasAdminToken } from "../services/authService";

function ProtectedRoute({ children }) {
  const isAuthenticated = hasAdminToken();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
