// import React from 'react'
import { useState } from "react";
import { NavLink } from "react-router-dom"
import "./header.css"
import useAuth from "../../contexts/AuthContext";

function Header() {

  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading, setLoading } = useAuth();



  // Function to handle closing the menu
  const closeMenu = () => {
    // Add the closing animation class
    const menu = document.getElementById('mobileMenu');
    menu.classList.add('slide-out'); // Trigger slide-out animation

    // After the animation ends (300ms), set the menu state to closed
    setTimeout(() => {
      setMenuOpen(false); // Close the menu after the animation completes
      menu.classList.remove('slide-out'); // Remove the slide-out class for future use
    }, 300); // Match the duration of the slide-out animation (300ms)
  };



  return (
    <div className="navbar z-999 bg-gray-800 text-white shadow-md sticky top-0">
      {/* Left Section - Logo */}
      <div className="flex-1 flex items-center gap-0">
        <NavLink to="/">
          <img src="./favicon.svg" className="h-10 w-auto select-none" alt="Logo" />
        </NavLink>
        <NavLink to="/" className="text-lg font-semibold hidden sm:block pl-2 py-1">
          MyTube
        </NavLink>
      </div>


      {/* Right Section - Navigation Links */}
      <div className="flex-none hidden sm:flex">
        <ul className="menu menu-horizontal px-1">
          {[
            { path: "/", label: "Home" },
            // { path: "/user", label: "User" },
            { path: "/subscription", label: "Subscription" },
            { path: "/login", label: "Login" },
            { path: "/register", label: "Register" },
            { path: "/upload", label: "Upload" },
          ].map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 m-0.5 rounded-lg duration-200 ${isActive ? "bg-orange-600 text-white" : "hover:bg-gray-700"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

      </div>

      <NavLink to="/user" className="w-10 h-10 rounded-full overflow-hidden">
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


      {/* Hamburger Menu - Visible on Small Screens */}
      <div className="sm:hidden flex items-center">
        <button onClick={() => {
          if (menuOpen) {
            closeMenu(); // Trigger closing animation first
          } else {
            setMenuOpen(true); // If menu is not open, just open it
          }
        }} className="text-white focus:outline-none p-2">
          {menuOpen ?
            <img
              className="w-5 h-5 m-0 p-0"
              src="/x-close-delete.svg"
              alt="Close menu button" />
            :
            <img
              className="w-5 h-5 m-0 p-0"
              src="/hamburger.svg"
              alt="Hamburger button"
            />}
        </button>
      </div>


      {/* Mobile Menu */}
      {menuOpen && (
        <div
          id="mobileMenu"
          className={`absolute top-16 left-0 w-full mx-auto bg-gray-800 shadow-xl rounded-lg border-2 border-gray-700 p-4 sm:hidden transform transition-transform duration-300 ease-in-out ${menuOpen ? "slide-in" : "slide-out"}`}
          style={{
            transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
            opacity: menuOpen ? "1" : "0"
          }}
        >
          {/* <h1>Menu</h1> */}
          <ul className="flex flex-col text-center space-y-2">
            {[
              { path: "/", label: "Home" },
              // { path: "/user", label: "User" },
              { path: "/subscription", label: "Subscription" },
              { path: "/login", label: "Login" },
              { path: "/register", label: "Register" },
              { path: "/upload", label: "Upload" },
            ].map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  onClick={() => closeMenu()}
                  className={({ isActive }) =>
                    `block py-3 text-lg font-mono text-gray-300 transition-all duration-200 hover:text-orange-500 relative ${isActive
                      ? "text-orange-500"
                      : "text-gray-300 hover:underline underline-offset-4 decoration-2"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}

export default Header