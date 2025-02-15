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

function Layout() {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [loading, setLoading] = useState(true);


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
  }, []);


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
        "http://localhost:8000/api/v1/users/current-user",
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

    } finally {
      setLoading(false); // ✅ Stop loading after API call
    }
  };


  return (
    <AuthProvider value={{ user, token, loading, login, logout, fetchCurrentUser }}>

      <div className="flex h-screen">
        {/* Sidebar */}
        {/* <Sidebar /> */}

        {/* Main Content (Header + Page Content) */}
        <div className="flex flex-col flex-grow">
          <Header />
          <div className="flex-grow p-2">
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>
    </AuthProvider>
  )
}

export default Layout
