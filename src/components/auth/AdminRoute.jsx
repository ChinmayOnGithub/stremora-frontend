import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts";

export const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user || !user.isAdmin) {
    return <Navigate to="/login" />;
  }

  return children;
};
