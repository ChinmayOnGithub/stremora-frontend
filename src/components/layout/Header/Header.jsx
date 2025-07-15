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
  DarkModeToggle
} from "../../index.js"
import UserDropdown from './UserDropdown.jsx';
import "./header.css"
import { FiUser } from 'react-icons/fi';

function Header({ toggleSidebar }) {

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/");
  };

  return (
    <header 
      className="h-[56px] min-h-[56px] max-h-[56px] bg-gray-700 dark:bg-gray-900 border-b border-transparent dark:border-gray-800 text-white shadow-md flex items-center justify-between px-2 [transition:none]"
    >
      {/* Left Section - Logo */}
      <Logo />

      {/* Right Section - Navigation Links and Icons */}
      <div className="flex items-center gap-2">
        {/* Dark Mode Toggle */}
        <DarkModeToggle />

        {/* User Dropdown - Desktop */}
        <div className="hidden sm:block mr-6 p-0">
          <UserDropdown onLogout={handleLogout} />
        </div>

        {/* Mobile User Avatar */}
        <div className="sm:hidden mr-0 my-0">
          <NavLink to="/user" className="w-10 h-10 rounded-full overflow-hidden transition-all duration-150">
            {user ? (
              <div className="w-10 h-10 rounded-full overflow-hidden hover:outline hover:outline-2 hover:outline-gray-400 hover:outline-offset-2">
                  <img src={user.avatar} alt="user avatar" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-full h-full bg-gray-600 dark:bg-gray-700 flex items-center justify-center rounded-full p-2">
                <FiUser className="w-6 h-6 text-white" />
              </div>
            )}
          </NavLink>
        </div>

        {/* Hamburger Menu - Small Screens */}
        <div className="sm:hidden z-50">
          <button
            onClick={toggleSidebar}
            className="hb text-white focus:outline-none py-2 px-1 w-10 h-10 cursor-pointer flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 10 10"
              stroke="#eee"
              strokeWidth=".6"
              fill="rgba(0,0,0,0)"
              strokeLinecap="round"
              className="w-10 h-10"
            >
              {/* Hamburger Lines */}
              <path d="M2,3L5,3L8,3M2,5L8,5M2,7L5,7L8,7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && user && (
        <Logout
          onClose={() => setShowLogoutModal(false)}
          onLogout={handleLogoutConfirm}
        />
      )}

    </header>
  );
}

export default Header;

