import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Install using: npm install jwt-decode

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Restore login state on refresh
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      if (isTokenExpired(storedToken)) {
        console.log("Access token expired. Refreshing...");
        refreshToken();
      } else {
        fetchCurrentUser(storedToken); // Fetch user details
        setToken(storedToken); // Restore token
        console.log("Session restored from local storage");
      }
    } else {
      setLoading(false); // ✅ If no token, stop loading
    }
  }, [token]);

  // ✅ Check token expiration periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (token) {
        const isExpired = isTokenExpired(token);
        if (isExpired) {
          console.log("Access token expired. Refreshing...");
          refreshToken();
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [token]);

  // ✅ Check if token is expired
  const isTokenExpired = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true; // Assume token is invalid if decoding fails
    }
  };

  // ✅ Refresh access token
  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token found");
      }

      // Clear the old tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Request new tokens
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/refresh-token`,
        { refreshToken }
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      // Store the new tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      // Update the token in state
      setToken(accessToken);

      // Fetch the current user to update the user state
      await fetchCurrentUser();

      console.log("Tokens refreshed successfully");
    } catch (error) {
      console.error("Failed to refresh token:", error);

      // Clear all tokens and log the user out
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setToken(null);
      setUser(null);

      // Redirect to login
      window.location.href = "/login";
    }
  };

  // ✅ Login user
  const login = (newToken, refreshToken) => {
    localStorage.setItem("accessToken", newToken);
    localStorage.setItem("refreshToken", refreshToken);
    setToken(newToken); // ✅ Store token in state
    fetchCurrentUser(); // ✅ Fetch user immediately after login
  };

  // ✅ Logout user
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setToken(null);
    setUser(null);
  };

  // ✅ Fetch current user
  const fetchCurrentUser = async () => {
    if (!token) {
      setUser(null);
      setLoading(false); // ✅ Stop loading when no token
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/users/current-user`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.data) {
        setUser(res.data.data); // ✅ Store full user info
        return res.data.data;
      } else {
        setUser(null);
        return null;
      }
    } catch (error) {
      setUser(null);
      localStorage.removeItem("accessToken");
      console.log(error);
      setError(error);
    } finally {
      setLoading(false); // ✅ Stop loading after API call
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