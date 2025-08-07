// src/components/auth/AdminRoute.jsx

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts";
import Loading from "../Loading/Loading.jsx"; // It's good practice to handle loading state here too

export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading message="Verifying permissions..." />
  }

  // This is the old logic, commented out for reference.
  // if (!user || !user.isAdmin) {
  //   return <Navigate to="/login" />;
  // }

  // This is the new, more secure logic.
  // It checks for the 'role' property and redirects non-admins to the home page.
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // If the user is an admin, render the child components (or Outlet)
  return children || <Outlet />;
};