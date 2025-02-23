// import React from 'react'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react';
import {
  Header,
  Footer,
  // Sidebar
} from './components/index.js';
import { AuthProvider } from './contexts/AuthContext.js';
import { useState } from 'react';
import axios from 'axios';
import { VideoProvider } from './contexts/VideoContext.jsx';

import { Toaster } from "sonner";
import { UserProvider } from './contexts/UserContext.jsx';




function Layout() {

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
    <AuthProvider value={{ user, token, loading, setLoading, login, logout, fetchCurrentUser, error }}>
      <VideoProvider>
        <UserProvider>
          <div className="flex h-screen">
            {/* Sidebar */}

            {/* Main Content (Header + Page Content) */}
            <div className="flex flex-col flex-grow">
              <Toaster richColors position="bottom-right" />

              <Header />
              <div className="flex-grow p-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-800">
                <Outlet />
              </div>
              <Footer />
            </div>
          </div>
        </UserProvider>
      </VideoProvider>
    </AuthProvider>
  )
}

export default Layout
