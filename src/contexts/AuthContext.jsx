import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check token validity and handle session restoration
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem("accessToken");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      if (isTokenExpired(storedToken)) {
        try {
          await refreshToken();
        } catch (error) {
          console.log("Something went wrong while refreshing the access token", error);
          handleSessionExpiration();
        }
      } else {
        await fetchCurrentUser(storedToken);
        setToken(storedToken); // Restore the token in state
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  // Show toast if the session was expired before the reload
  useEffect(() => {
    const wasSessionExpired = localStorage.getItem("wasSessionExpired");
    if (wasSessionExpired === "true") {
      toast.info("Your previous session was expired", {
        description: "Please login again",
        duration: 3000,
      });

      // Clear the flag after showing the toast
      localStorage.removeItem("wasSessionExpired");
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Periodic token check
  useEffect(() => {
    const interval = setInterval(() => {
      if (token && isTokenExpired(token)) {
        handleTokenExpiration();
      }
    }, 300000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [token]);

  const isTokenExpired = (token) => {
    try {
      const { exp } = jwtDecode(token);
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  };

  const handleTokenExpiration = async () => {
    try {
      await refreshToken();
    } catch (error) {
      handleSessionExpiration();
    }
  };

  const handleSessionExpiration = () => {
    // Set a flag in localStorage to indicate the session expired
    localStorage.setItem("wasSessionExpired", "true");
    logout(); // Clear tokens and user state
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token");

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/users/refresh-token`,
        { refreshToken }
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      setToken(accessToken); // Update the token in state
      await fetchCurrentUser(accessToken); // Fetch the current user with the new token
      return true;
    } catch (error) {
      throw new Error("Failed to refresh token");
    }
  };

  const login = (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setToken(accessToken); // Update the token in state
    fetchCurrentUser(accessToken); // Fetch the current user immediately after login
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setToken(null);
    setUser(null);
  };

  const fetchCurrentUser = async (tokenToUse = token) => {
    if (!tokenToUse) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/users/current-user`,
        { headers: { Authorization: `Bearer ${tokenToUse}` } }
      );
      setUser(res.data.data);
    } catch (error) {
      setError(error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        setLoading,
        login,
        logout,
        fetchCurrentUser,
        error,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}