// import React from 'react'
import { NavLink } from "react-router-dom"

function Header() {
  return (
    <div className="navbar bg-gray-800 text-white shadow-md sticky top-0">
      {/* Left Section - Logo */}
      <div className="flex-1">
        <NavLink to="/" className="flex items-center gap-2">
          <img src="./favicon.svg" className="h-10 w-auto select-none" alt="Logo" />
          <span className="text-lg font-semibold hidden sm:block">MyTube</span>
        </NavLink>
      </div>

      {/* Right Section - Navigation Links */}
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {[
            { path: "/", label: "Home" },
            { path: "/user", label: "User" },
            { path: "/subscription", label: "Subscription" },
            { path: "/login", label: "Login" },
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
    </div>
  );
}

export default Header