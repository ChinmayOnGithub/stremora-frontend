import { Navigate } from "react-router-dom";
import useAuth from "../contexts/AuthContext.js"; // Import the auth context
import { useEffect, useState } from "react";

export default function ProtectedRoutes({ children }) {



  const { user, loading, error } = useAuth(); // 🔑 Get user from AuthContext
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Set a timeout to handle loading issues
  useEffect(() => {
    const timeout = setTimeout(() => {
      setTimeoutReached(true); // Trigger timeout after 5 seconds
    }, 5000); // 5000ms = 5 seconds

    // Clean up the timeout on component unmount
    return () => clearTimeout(timeout);
  }, []);





  if (timeoutReached) {
    return <div>Error: Failed to load user data. Redirecting to login...</div>; // Show an error if loading takes too long
  }

  // // If there's an error, handle it appropriately
  // if (error.message) {
  //   return <div>Error: {error}</div>; // Show error message if there's an error fetching the user data
  // }

  if (loading && !timeoutReached) {
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
