// // import React from 'react'
// import { useEffect, useState } from "react";
// import { NavLink } from "react-router-dom"
// import "./header.css"
// import { useAuth } from "../../../contexts/index.js";
// import { useNavigate } from "react-router-dom";
// import Logout from '../../auth/Logout.jsx';
// import './favicon.svg'
// import {
//   Logo,
//   DarkModeToggle
// } from "../../index.js"
// import UserDropdown from './UserDropdown.jsx';
// import "./header.css"
// import { FiUser } from 'react-icons/fi';

// function Header({ toggleSidebar }) {

//   const [showLogoutModal, setShowLogoutModal] = useState(false);

//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     setShowLogoutModal(true);
//   };

//   const handleLogoutConfirm = () => {
//     logout();
//     setShowLogoutModal(false);
//     navigate("/");
//   };

//   return (
//     <header
//       className="h-[56px] min-h-[56px] max-h-[56px] bg-gray-700 dark:bg-gray-900 border-b border-transparent dark:border-gray-800 text-white shadow-md flex items-center justify-between px-2 [transition:none]"
//     >
//       {/* Left Section - Logo */}
//       <Logo />

//       {/* Right Section - Navigation Links and Icons */}
//       <div className="flex items-center gap-2">
//         {/* Dark Mode Toggle */}
//         <DarkModeToggle />

//         {/* User Dropdown - Desktop */}
//         <div className="hidden sm:block mr-6 p-0">
//           <UserDropdown onLogout={handleLogout} />
//         </div>

//         {/* Mobile User Avatar */}
//         <div className="sm:hidden mr-0 my-0">
//           <NavLink to="/user" className="w-10 h-10 rounded-full overflow-hidden transition-all duration-150">
//             {user ? (
//               <div className="w-10 h-10 rounded-full overflow-hidden hover:outline hover:outline-2 hover:outline-gray-400 hover:outline-offset-2">
//                 <img src={user.avatar} alt="user avatar" className="w-full h-full object-cover" />
//               </div>
//             ) : (
//               <div className="w-full h-full bg-gray-600 dark:bg-gray-700 flex items-center justify-center rounded-full p-2">
//                 <FiUser className="w-6 h-6 text-white" />
//               </div>
//             )}
//           </NavLink>
//         </div>

//         {/* Hamburger Menu - Small Screens */}
//         <div className="sm:hidden z-50">
//           <button
//             onClick={toggleSidebar}
//             className="hb text-white focus:outline-none py-2 px-1 w-10 h-10 cursor-pointer flex items-center justify-center"
//             aria-label="Toggle menu"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 10 10"
//               stroke="#eee"
//               strokeWidth=".6"
//               fill="rgba(0,0,0,0)"
//               strokeLinecap="round"
//               className="w-10 h-10"
//             >
//               {/* Hamburger Lines */}
//               <path d="M2,3L5,3L8,3M2,5L8,5M2,7L5,7L8,7" />
//             </svg>
//           </button>
//         </div>
//       </div>

//       {/* Logout Modal */}
//       {showLogoutModal && user && (
//         <Logout
//           onClose={() => setShowLogoutModal(false)}
//           onLogout={handleLogoutConfirm}
//         />
//       )}

//     </header>
//   );
// }

// export default Header;

// src/components/layout/Header/Header.jsx
// src/components/layout/Header/Header.jsx

import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { ThemeToggle } from '../../theme/theme-toggle2';
import ModernThemeToggle, { CompactThemeToggle } from '@/components/theme/ModernThemeToggle3.jsx';
import DayNightToggle from '@/components/theme/ModernThemeToggle';
import UserDropdown from './UserDropdown';
import { Search, ArrowLeft, ArrowRight, Upload, PanelLeftOpen, ChevronRight } from 'lucide-react';
import debounce from 'lodash.debounce';
import CompactDayNightToggle from '@/components/theme/CompactDayNightToggle.jsx';
import TinyDayNightToggle from '@/components/theme/TinyDayNightToggle';

const capitalize = (s) => s && s.charAt(0).toUpperCase() + s.slice(1);

const Breadcrumb = React.memo(() => {
  const location = useLocation();
  const paths = useMemo(() => location.pathname.split('/').filter(Boolean), [location.pathname]);

  return (
    <nav aria-label="Breadcrumb" className="hidden md:flex items-center text-sm font-medium text-muted-foreground">
      <Link to="/" className="hover:text-foreground">Home</Link>
      {paths.map((path, index) => (
        <React.Fragment key={path}>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link
            to={`/${paths.slice(0, index + 1).join('/')}`}
            className={index === paths.length - 1 ? "text-foreground" : "hover:text-foreground"}
          >
            {capitalize(path.replace('-', ' '))}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
});
Breadcrumb.displayName = 'Breadcrumb';


function Header({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const [query, setQuery] = useState('');

  const performSearch = useCallback(debounce((value) => {
    if (value) {
      console.log('Searching for:', value);
      navigate(`/search?q=${value}`);
    }
  }, 300), [navigate]);

  useEffect(() => {
    performSearch(query);
  }, [query, performSearch]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 sm:px-6">
      {/* Mobile Sidebar Toggle */}
      <Button size="icon" variant="outline" className="md:hidden" onClick={onToggleSidebar}>
        <PanelLeftOpen className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      {/* Navigation and Page Title */}
      <div className="hidden md:flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)} aria-label="Go back" className="text-slate-500 dark:text-slate-400">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => navigate(1)} aria-label="Go forward" className="text-slate-500 dark:text-slate-400">
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Breadcrumb className="text-slate-500 dark:text-slate-400" />
      </div>

      {/* Right-side Actions */}
      <div className="ml-auto flex items-center gap-4">
        <form onSubmit={(e) => { e.preventDefault(); performSearch.flush(); }} role="search" className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchRef}
            type="search"
            aria-label="Search videos and channels"
            placeholder="Search... ( / )"
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        {user && (
          <Button onClick={() => navigate('/upload')}>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        )}

        {/* <ThemeToggle /> */}

        {/* <ModernThemeToggle />
        <CompactThemeToggle className="mx-2" /> */}
        {/* <DayNightToggle /> */}

        <CompactDayNightToggle height={36} />
        {/* <TinyDayNightToggle height={48} />; */}

        {user ? (
          <UserDropdown onLogout={logout} />
        ) : (
          <Button onClick={() => navigate('/login')}>Login</Button>
        )}
      </div>
    </header>
  );
};

export default React.memo(Header);