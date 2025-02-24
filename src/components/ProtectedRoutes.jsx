import { Navigate } from "react-router-dom";
import useAuth from "../contexts/AuthContext.jsx"; // Import the auth context
// import { useEffect, useState } from "react";
import Loading from "./Loading/Loading.jsx";

export default function ProtectedRoutes({ children }) {



  const { user, loading } = useAuth(); // 🔑 Get user from AuthContext


  if (loading) {
    return <Loading message="Loading Auth..." />
  }

  return user ? children : <Navigate to="/login" />;
}
