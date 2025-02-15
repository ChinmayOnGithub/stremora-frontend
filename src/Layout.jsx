import React from 'react'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react';
import {
  Header,
  Footer,
  Sidebar
} from './components/index.js';
import { AuthProvider } from './contexts/AuthContext.js';
import { useState } from 'react';

function Layout() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token });
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setUser({ token });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);


  };
  return (
    <AuthProvider value={{ user, login, logout }}>

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
