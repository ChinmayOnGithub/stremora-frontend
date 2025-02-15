import { Navigate } from "react-router-dom";
import useAuth from "../contexts/AuthContext.js"; // Import the auth context

export default function ProtectedRoutes({ children }) {
  const { user } = useAuth(); // 🔑 Get user from AuthContext

  return user ? children : <Navigate to="/login" />;
}
