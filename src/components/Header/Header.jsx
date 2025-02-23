// import React from 'react'
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom"
import "./header.css"
import useAuth from "../../contexts/AuthContext";
import useTheme from "../../hooks/useTheme";
import { BsSun, BsMoon } from "react-icons/bs"; // Import sun and moon icons
import { useNavigate } from "react-router-dom";


function Header() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  const { user, loading, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  // Function to open the menu
  const openMenu = () => {
    setMenuOpen(true);
  };

  // Disable scrolling when mobile menu opens
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup function when component unmounts
    return () => document.body.classList.remove("overflow-hidden");
  }, [menuOpen]);

  // Function to close the menu with animation
  const closeMenu = () => {
    const menu = document.getElementById("mobileMenu");
    if (menu) menu.classList.add("slide-out");

    setClosing(true);
    setTimeout(() => {
      setMenuOpen(false);
      setClosing(false);
      if (menu) menu.classList.remove("slide-out");
    }, 300);
  };

  return (
    <div className="navbar z-999 bg-gray-700 dark:bg-gray-900 text-white shadow-md sticky top-0">
      {/* Left Section - Logo */}
      <div className="flex-1 flex items-center gap-2 sm:gap-3">
        <NavLink to="/">
          <img src="./favicon.svg" className="h-10 w-auto select-none" alt="Logo" />
        </NavLink>
        <NavLink
          to="/"
          // className="text-2xl font-semibold hidden sm:block text-gray-100 dark:text-white tracking-wider uppercase font-playfair"
          className="text-2xl font-semibold hidden sm:block text-gray-900 dark:text-white tracking-wider uppercase font-merriweather"
        >
          Stremora
        </NavLink>
      </div>


      {/* Right Section - Navigation Links */}
      <div className="flex-none hidden sm:flex">
        <ul className="menu menu-horizontal px-1">
          {[
            { path: "/", label: "Home" },
            // { path: "/user", label: "User" },
            { path: "/subscription", label: "Subscription" },
            // { path: "/login", label: "Login" },
            // { path: "/register", label: "Register" },
            { path: "/upload", label: "Upload" },
          ].map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 m-0.5 rounded-lg duration-200 ${isActive ? "bg-amber-600 hover:bg-amber-500 text-white" : "hover:bg-gray-800 dark:hover:bg-gray-800"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

      </div>

      <NavLink to="/user" className="w-10 h-10 rounded-full overflow-hidden mx-1">
        {!user && loading ? (
          <div
            className="w-full h-full animate-spin border-4 border-gray-300 border-t-transparent rounded-full"
            style={{ animation: "spin 300ms linear infinite" }}
          ></div>
        ) : user ? (
          <img src={user?.avatar} alt="user avatar" className="w-full h-full object-cover" />
        ) : (
          <img src="/user-light.svg" alt="user avatar" className="w-full h-full object-cover" />
        )}
      </NavLink>


      {/* Dark Mode Toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-2 mx-1 bg-gray-700 dark:bg-gray-800 rounded-full hover:bg-gray-600 dark:hover:bg-gray-700 transition"
      >
        {theme === "dark" ? <BsSun className="text-yellow-400" size={20} /> : <BsMoon className="text-gray-300" size={20} />}
      </button>

      {/* Hamburger Menu - Small Screens */}
      <div className="sm:hidden flex items-center">
        <button
          onClick={menuOpen ? closeMenu : openMenu}
          className="text-white focus:outline-none p-2">
          <img
            className="w-5 h-5 m-0 p-0"
            src={menuOpen ? "/x-close-delete.svg" : "/hamburger.svg"}
            alt="Menu Toggle" />
        </button>
      </div>

      {/* Full-screen Overlay */}
      {(menuOpen || closing) && (
        <div className={`fixed inset-0 bg-black/40 bg-opacity-50 z-40 transition-opacity duration-300 ${closing ? "fade-out" : "fade-in"}`} onClick={closeMenu}></div>
      )}




      {/* Mobile Menu */}
      {menuOpen && (
        <div
          id="mobileMenu"
          className={`fixed top-16 mt-5 left-0 w-4/5 max-w-sm bg-gray-800 shadow-xl rounded-r-lg border-r-2 border-gray-700 p-4 sm:hidden transform transition-transform duration-300 ease-in-out z-50 ${menuOpen ? " slide-in" : "slide-out"}`}
          style={{
            transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
            opacity: menuOpen ? "1" : "0"
          }}
        >
          <ul className="flex flex-col text-left space-y-2">
            {[
              { path: "/", label: "Home" },
              { path: "/subscription", label: "Subscription" },
              { path: "/login", label: "Login" },
              { path: "/register", label: "Register" },
              { path: "/upload", label: "Upload" },
            ].map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `block py-3 px-4 text-lg font-mono text-gray-300 transition-all duration-200 hover:text-orange-500 ${isActive ? "text-orange-500" : "hover:underline"}`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Direct Logout Button */}
          {user && (
            <button
              onClick={() => {
                logout();
                closeMenu();
                navigate("/");
              }}
              className="w-full mt-4 bg-red-800 font-semibold uppercase tracking-widest font-sans text-white py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          )}
        </div>
      )
      }

    </div >
  );
}

export default Header