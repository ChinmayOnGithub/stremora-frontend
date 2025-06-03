import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/index.js";
import Loading from "./Loading/Loading.jsx";
import PropTypes from 'prop-types';

export default function ProtectedRoutes({ children }) {
  const { user, loading } = useAuth(); // 🔑 Get user from AuthContext
  const location = useLocation(); // 👈 to get current route

  if (loading) {
    return <Loading message="Loading Auth..." />
  }

  return user ? (children) : (<Navigate to="/login" state={{ from: location }} replace />);
}

ProtectedRoutes.propTypes = {
  children: PropTypes.node.isRequired
};

