import { Navigate, Outlet } from "react-router-dom";

import LoadingSpinner from "./LoadingSpinner";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
  const { user, isAuthenticated, initializing } = useAuth();

  if (initializing) {
    return <LoadingSpinner label="Checking permissions..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;