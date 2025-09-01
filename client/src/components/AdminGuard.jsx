import { Navigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";

export default function AdminGuard({ children }) {
  const { user, loading, initialized } = useAuth();

  // Show loading state
  if (loading || !initialized) {
    return <div className="p-4">Loading...</div>;
  }

  // If no user or user is not admin → redirect to login
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  // Otherwise allow access
  return children;
}
