import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);

  // ✅ Restore login state on refresh
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      fetchCurrentUser(storedToken); // Fetch user details
      setToken(storedToken); // Restore token
      if (storedToken) {
        console.log("Session restored");
      }

    } else {
      setLoading(false); // ✅ If no token, stop loading
    }
  }, [token]);


  const login = (newToken) => {
    localStorage.setItem("accessToken", newToken);
    setToken(newToken); // ✅ Store token in state
    fetchCurrentUser(); // ✅ Fetch user immediately after login
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setToken(null);
    setUser(null);
  };

  const fetchCurrentUser = async () => {
    if (!token) {
      setUser(null);
      setLoading(false); // ✅ Stop loading when no token
      return;
    }

    try {
      const res = await axios.get(
        "https://youtube-backend-clone.onrender.com/api/v1/users/current-user",
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
      setError(error)

    } finally {
      setLoading(false); // ✅ Stop loading after API call
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, fetchCurrentUser, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}
