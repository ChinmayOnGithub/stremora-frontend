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


  useEffect(() => {
    if (token) {
      fetchCurrentUser();
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
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
      localStorage.removeItem("accessToken");
      console.log(error);

    }
  };


  return (
    <AuthProvider value={{ user, login, logout, fetchCurrentUser }}>

      <div className="flex h-screen">
        {/* Sidebar */}
        {/* <Sidebar /> */}

        {/* Main Content (Header + Page Content) */}
        <div className="flex flex-col flex-grow">
          <Header />
          <div className="flex-grow p-4">
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>
    </AuthProvider>
  )
}

export default Layout
