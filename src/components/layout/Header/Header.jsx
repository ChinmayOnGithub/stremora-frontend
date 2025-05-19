// import React from 'react'
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom"
import "./header.css"
import { useAuth } from "../../../contexts/index.js";
import { useNavigate } from "react-router-dom";
import Logout from '../../auth/Logout.jsx';
import './favicon.svg'
import {
  Logo,
  ToggleThemeButton
} from "../../index.js"
import "./header.css"

function Header() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State to control modal visibility
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const { user, loading, logout } = useAuth();
  // const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  // for the avatar animation
  // const [outlineActive, setOutlineActive] = useState(false);
  // const timeoutRef = useRef(null);
  // Make sure you have "closing" state declared:
  // const [closing, setClosing] = useState(false);

  // const closeMenuAvatar = async () => {
  //   const menu = document.getElementById("mobileMenu");
  //   if (menu) menu.classList.add("slide-out");

  //   setClosing(true);
  //   // Await the animation duration (300ms) before proceeding
  //   await new Promise(resolve => setTimeout(resolve, 300));

  //   setMenuOpen(false);
  //   setClosing(false);
  //   if (menu) menu.classList.remove("slide-out");
  // };


  // Handle menu state changes and trigger animations
  useEffect(() => {
    const svgElement = document.querySelector(".hb");
    if (!svgElement) return;

    const toXAnimation = svgElement.querySelector("#toX");
    const toHamAnimation = svgElement.querySelector("#toHam");

    // Trigger animations based on menuOpen state
    if (menuOpen) {
      toXAnimation.beginElement();
    } else {
      toHamAnimation.beginElement();
    }
  }, [menuOpen]); // Run this effect whenever menuOpen changes

  // Toggle menu state
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Close menu with animation
  const closeMenu = () => {
    const menu = document.getElementById("mobileMenu");
    if (menu) menu.classList.add("slide-out");

    setClosing(true);
    setTimeout(() => {
      setMenuOpen(false); // This will trigger the useEffect
      setClosing(false);
      if (menu) menu.classList.remove("slide-out");
    }, 300);
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

  return (
    <div className="navbar z-999 bg-gray-700 dark:bg-gray-900 text-white shadow-md sticky top-0 flex items-center justify-between">
      {/* Left Section - Logo */}
      <Logo />

      {/* Right Section - Navigation Links and Icons */}
      <div className="flex items-center gap-2">
        {/* Desktop Navigation Links */}
        <div className="hidden sm:flex">
          <ul className="menu menu-horizontal px-1">
            {[
              { path: "/", label: "Home" },
              { path: "/subscription", label: "Subscription" }
              /* { path: "/upload", label: "Upload" }, */
            ].map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `px-4 py-2 m-0.5 rounded-md duration-200 ${isActive ? "bg-amber-600 hover:bg-amber-500 text-white" : "hover:bg-gray-800 dark:hover:bg-gray-800"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* User Avatar */}
        {/* <NavLink to="/user" className="w-10 h-10 rounded-full overflow-hidden hover:border-2 mx-1">
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
        </NavLink> */}

        {/* Dark Mode Toggle */}
        <ToggleThemeButton />
        {/* <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 mx-1 bg-gray-600 dark:bg-gray-800 rounded-full hover:bg-gray-800 dark:hover:bg-gray-700 transition"
        >
          {theme === "dark" ?
            <BsSun className="text-yellow-400" size={20} />
            :
            <BsMoon className="text-gray-300" size={20} />}
        </button> */}

        {/* ---------------------------- MOBILE MENU SLIDER --------------------------- */}
        {/* Hamburger Menu - Small Screens */}
        <div className="sm:hidden flex items-center">
          <svg
            onClick={toggleMenu}
            className="hb text-white focus:outline-none py-2 m-0 w-16 h-16 cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 10 10"
            stroke="#eee"
            strokeWidth=".6"
            fill="rgba(0,0,0,0)"
            strokeLinecap="round"
            alt="Menu Toggle"
          >
            {/* Hamburger Lines */}
            <path d="M2,3L5,3L8,3M2,5L8,5M2,7L5,7L8,7">
              {/* Animate to "X" */}
              <animate
                id="toX"
                dur="0.2s"
                attributeName="d"
                values="M2,3L5,3L8,3M2,5L8,5M2,7L5,7L8,7;M3,3L5,5L7,3M5,5L5,5M3,7L5,5L7,7"
                fill="freeze"
                begin="indefinite"
              />
              {/* Animate back to Hamburger */}
              <animate
                id="toHam"
                dur="0.2s"
                attributeName="d"
                values="M3,3L5,5L7,3M5,5L5,5M3,7L5,5L7,7;M2,3L5,3L8,3M2,5L8,5M2,7L5,7L8,7"
                fill="freeze"
                begin="indefinite"
              />
            </path>
          </svg>
        </div>
      </div>

      {/* Full-screen Overlay */}
      {(menuOpen || closing) && (
        <div
          className={`fixed inset-0 bg-black/40 bg-opacity-50 z-40 transition-opacity duration-300 ${closing ? "fade-out" : "fade-in"
            }`}
          onClick={closeMenu}
        >
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          id="mobileMenu"
          className={
            `fixed top-0 left-0 h-full w-4/5 max-w-sm overflow-hidden bg-gray-800 dark:bg-gray-900 shadow-xl rounded-r-lg border-r-2 border-gray-700 transform transition-transform duration-300 ease-in-out z-50 ${menuOpen ? "slide-in" : "slide-out"
            }`
          }
          style={{
            transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
            opacity: menuOpen ? "1" : "0",
          }}
        >
          <div className="flex flex-col h-full ">
            <div className="flex flex-row items-center gap-2 sm:gap-3 mt-5 mb-0 mx-3"
              onClick={closeMenu}>
              <NavLink to="/">
                <img src="https://i.ibb.co/fGMbrcL4/video-collection-svgrepo-com.png" className="h-10 w-auto select-none" alt="Logo" />
              </NavLink>
              <NavLink
                to="/"
                className="text-2xl font-semibold text-gray-100 dark:text-white tracking-wider uppercase font-merriweather"
              >
                Stremora
              </NavLink>
            </div>

            <ul className="flex flex-col text-left space-y-2 m-4 flex-grow">
              {[
                { path: "/", label: "Home" },
                { path: "/subscription", label: "Subscription" },
                /* { path: "/login", label: "Login" }, */
                { path: "/register", label: "Register" },
                { path: "/upload", label: "Upload" },
              ].map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `block py-3 px-4 text-lg font-mono text-gray-300 transition-all duration-200 hover:text-orange-500 ${isActive ? "text-orange-500" : "hover:underline"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Direct Logout Button */}
            <div className="w-full ">
              {user && (
                <div
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full text-center text-lg font-semibold uppercase tracking-widest bg-red-500 dark:bg-amber-800 text-white py-4 hover:bg-red-600 dark:hover:bg-red-700 transition"
                >
                  Logout
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ---------------------------- Dropdown (large screens) --------------------------*/}
      <div className="flex items-center gap-2">
        {/* Desktop User Avatar with Dropdown */}
        <div className="hidden sm:block relative">
          <div
            onClick={() => setShowUserDropdown((prev) => !prev)}
            className="relative w-10 h-10 rounded-full overflow-hidden mx-4 cursor-pointer transition-all duration-50 ease-in-out hover:outline hover:outline-dashed hover:outline-white hover:outline-offset-2"
          >
            {!user && loading ? (
              <div
                className="w-full h-full animate-spin border-4 border-gray-300 border-t-transparent rounded-full"
                style={{ animation: "spin 300ms linear infinite" }}
              ></div>
            ) : user ? (
              <img src={user.avatar} alt="user avatar" className="w-full h-full object-cover" />
            ) : (
              <img src="/user-light.svg" alt="user avatar" className="w-full h-full object-cover" />
            )}
          </div>


          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 overflow-clip">

              {user && <NavLink
                to="/user"
                onClick={() => setShowUserDropdown(false)}
                className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Profile
              </NavLink>}

              {user && <NavLink
                to="/upload"
                onClick={() => setShowUserDropdown(false)}
                className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Upload
              </NavLink>}
              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  if (user) {
                    setShowLogoutModal(true);
                  } else {
                    navigate('/login');
                  }
                  setShowUserDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {user ? "Logout" : "Login"}
              </button>
            </div>
          )}
        </div>

        {/* Mobile User Avatar (no dropdown) */}
        <NavLink to="/user" className="sm:hidden w-10 h-10 rounded-full overflow-hidden hover:border-2 mx-2">
          {!user && loading ? (
            <div
              className="w-full h-full animate-spin border-4 border-gray-300 border-t-transparent rounded-full"
              style={{ animation: "spin 300ms linear infinite" }}
            ></div>
          ) : user ? (
            <img src={user.avatar} alt="user avatar" className="w-full h-full object-cover" />
          ) : (
            <img src="/user-light.svg" alt="user avatar" className="w-full h-full object-cover" />
          )}
        </NavLink>
      </div>
      {/* ------------------------------------------------------------------------ */}

      {/* Logout Modal */}
      {showLogoutModal && user && (
        <Logout
          onClose={() => setShowLogoutModal(false)} // Close modal
          onLogout={() => {
            logout(); // Perform logout
            setShowLogoutModal(false); // Close the modal
            navigate("/"); // Redirect to home page after logout
          }}
        />
      )}

    </div>
  );
}

export default Header;