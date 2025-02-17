// import React from 'react'
import { useState } from "react";
import { NavLink } from "react-router-dom"

function Header() {

  const [menuOpen, setMenuOpen] = useState(false);


  return (
    <div className="navbar z-999 bg-gray-800 text-white shadow-md sticky top-0">
      {/* Left Section - Logo */}
      <div className="flex-1">
        <NavLink to="/" className="flex items-center gap-2">
          <img src="./favicon.svg" className="h-10 w-auto select-none" alt="Logo" />
          <span className="text-lg font-semibold hidden sm:block">MyTube</span>
        </NavLink>
      </div>

      {/* Right Section - Navigation Links */}
      <div className="flex-none hidden sm:flex">
        <ul className="menu menu-horizontal px-1">
          {[
            { path: "/", label: "Home" },
            { path: "/user", label: "User" },
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


      {/* Hamburger Menu - Visible on Small Screens */}
      <div className="sm:hidden flex items-center">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white focus:outline-none">
          {menuOpen ? <img className="w-5 h-5 m-0 p-0" src="src/assets/x-close-delete.svg" alt="Close menu button" /> : <img className="w-5 h-5 m-0 p-0" src="src/assets/hamburger.svg" alt="Hamburger button" />}
        </button>
      </div>


      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-800 shadow-lg sm:hidden">
          <ul className="flex flex-col text-center">
            {[
              { path: "/", label: "Home" },
              { path: "/user", label: "User" },
              { path: "/subscription", label: "Subscription" },
              { path: "/login", label: "Login" },
              { path: "/register", label: "Register" },
              { path: "/upload", label: "Upload" },
            ].map((link) => (
              <li key={link.path} className="border-b border-gray-700">
                <NavLink
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block py-3 text-lg duration-200 ${isActive ? "bg-orange-600 text-white" : "hover:bg-gray-700"}`
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