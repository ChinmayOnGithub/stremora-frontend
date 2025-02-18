import { Navigate } from "react-router-dom";
import useAuth from "../contexts/AuthContext.js"; // Import the auth context
import { useEffect, useState } from "react";

export default function ProtectedRoutes({ children }) {



  const { user, loading } = useAuth(); // 🔑 Get user from AuthContext


  if (loading) {
    return (
      <div className="flex justify-center items-center h-full text-white text-lg">
        <div>Loading...
          <img src="public/loader.svg" alt="loader animation" />
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
}
