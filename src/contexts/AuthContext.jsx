import { createContext, useContext, useEffect, useState, useCallback } from "react";
import PropTypes from 'prop-types';
import axiosInstance from "../lib/axios.js"; // Import our special axios instance
import { toast } from "sonner";
// import { jwtDecode } from "jwt-decode"; // No longer needed, interceptor handles expiration

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // This function is now exposed to be called from anywhere in the app.
  const fetchCurrentUser = useCallback(async () => {
    // We don't need to set loading here unless it's a full-page refresh
    try {
      // The interceptor will automatically handle token refresh if needed
      const res = await axiosInstance.get("/users/current-user");
      const userData = res.data.data;
      setUser({
        ...userData,
        isAdmin: userData.role === "admin"
      });
      return userData; // Return the user data for chaining if needed
    } catch (error) {
      console.error("Could not fetch current user.", error);
      // If this fails, the refresh token is also invalid.
      // The interceptor will handle the redirect to /login.
      setUser(null); // Clear user state
      return null;
    }
  }, []);

  // On initial app load, check if a token exists and fetch the user.
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        await fetchCurrentUser();
      }
      setLoading(false);
    };
    initializeAuth();
  }, [fetchCurrentUser]);


  const login = (data) => {
    const { user, accessToken, refreshToken } = data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setUser({
      ...user,
      isAdmin: user.role === "admin"
    });
  };

  const logout = () => {
    axiosInstance.post('/users/logout')
      .catch((err) => {
        console.error("Backend logout failed, but proceeding with frontend logout.", err);
      })
      .finally(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
        window.location.href = '/login';
      });
  };

  // ============================================================================
  // The following code is your original, valuable logic.
  // It is now commented out because the axios interceptor handles this
  // functionality more efficiently and reliably on every API call.
  // ============================================================================

  // const [token, setToken] = useState(localStorage.getItem("accessToken"));

  // // Periodic token check - Now handled by the axios interceptor reactively
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (token && isTokenExpired(token)) {
  //       handleTokenExpiration();
  //     }
  //   }, 300000); // Check every 5 minutes
  //   return () => clearInterval(interval);
  // }, [token]);

  // const isTokenExpired = (token) => {
  //   try {
  //     const { exp } = jwtDecode(token);
  //     return Date.now() >= exp * 1000;
  //   } catch {
  //     return true;
  //   }
  // };

  // const handleTokenExpiration = async () => {
  //   try {
  //     await refreshToken();
  //   } catch (error) {
  //     handleSessionExpiration();
  //   }
  // };

  // const refreshToken = async () => {
  //   // This logic is now inside the axios.js interceptor
  // };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setLoading,
        login,
        logout,
        fetchCurrentUser, // <-- The essential function is now correctly exposed
        error,
        isLoaded: !loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
