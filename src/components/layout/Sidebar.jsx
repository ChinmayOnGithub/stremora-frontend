// src/components/layout/Sidebar.jsx

import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import PropTypes from 'prop-types';
import {
  FiChevronLeft,
  FiChevronRight,
  FiHome,
  FiClock,
  FiVideo,
  FiUpload,
  FiHash,
  FiHeart,
  FiUser,
  FiSettings,
  FiShield // <-- Added a new icon for the admin link
} from 'react-icons/fi';
import { useAuth } from '../../contexts';
import { Logo } from '../index';

const Sidebar = ({
  className = '',
  onClose,
}) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(prev => !prev);
  }, []);

  const isActive = useCallback(
    (path) => location.pathname === path || location.pathname.startsWith(path + '/'),
    [location.pathname]
  );

  const allNavItems = useMemo(() => {
    const baseItems = [
      { label: 'Home', icon: <FiHome size={20} />, path: '/' },
    ];

    if (user) {
      const userItems = [
        { label: 'Subscription', icon: <FiHash size={20} />, path: '/subscription' },
        { label: 'Upload', icon: <FiUpload size={20} />, path: '/upload' },
        { label: 'My Videos', icon: <FiVideo size={20} />, path: '/my-videos' },
        { label: 'History', icon: <FiClock size={20} />, path: '/history' },
        { label: 'Liked Videos', icon: <FiHeart size={20} />, path: '/liked-videos' },
      ];
      baseItems.push(...userItems);
    } else {
      const guestItems = [
        { label: 'Register', icon: <FiUser size={20} />, path: '/register' },
        { label: 'Login', icon: <FiUser size={20} />, path: '/login' },
      ];
      baseItems.push(...guestItems);
    }

    // Here is the new logic to add the Admin link conditionally
    if (user && user.role === 'admin') {
      baseItems.push({
        label: 'Admin Panel',
        icon: <FiShield size={20} />, // Using the new icon
        path: '/admin', // Pointing directly to the videos table
      });
    }

    return baseItems;
  }, [user]);

  const renderedNav = useMemo(
    () => allNavItems.map((item) => (
      <Link
        key={item.path}
        to={item.path}
        className={twMerge(
          'group flex items-center rounded-lg transition-all duration-200 ease-in-out',
          'hover:bg-amber-900/30',
          collapsed ? 'justify-center px-2 py-2.5 gap-0' : 'px-4 py-2.5 gap-3',
          isActive(item.path)
            ? 'bg-amber-600 text-white hover:bg-amber-700'
            : 'text-gray-300'
        )}
        title={collapsed ? item.label : undefined}
        aria-label={item.label}
        onClick={() => { if (onClose) onClose(); }}
      >
        <div className={twMerge(
          'flex-shrink-0 transition-transform duration-200',
          isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-amber-500'
        )}>
          {item.icon}
        </div>
        <span className={twMerge(
          'truncate whitespace-nowrap transition-all duration-200 ease-in-out',
          collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
        )}>
          {item.label}
        </span>
      </Link>
    )),
    [allNavItems, collapsed, isActive, onClose]
  );

  return (
    <aside
      className={twMerge(
        'flex flex-col bg-gray-900 border-r border-gray-800 shadow-lg text-md',
        'h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700',
        'transition-all duration-200 ease-in-out',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Sidebar Header */}
      <div className={twMerge(
        'sticky top-0 bg-gray-900 z-10',
        collapsed
          ? 'flex justify-center items-center h-[64px] p-0 lg:flex-col'
          : 'flex items-center justify-between p-4'
      )}>
        {!collapsed && (
          <span className="block lg:hidden"><Logo /></span>
        )}
        {!collapsed && (
          <div className="hidden lg:flex items-center gap-2 text-amber-400 font-semibold animate-bounce-slow">
            <span role="img" aria-label="party">🎈</span>
            <span className="text-sm">Let's go!</span>
          </div>
        )}
        <button
          onClick={toggleCollapsed}
          className={twMerge(
            'p-2 rounded-full border border-gray-700 bg-gray-800 shadow-sm',
            'hover:bg-amber-600 hover:text-white hover:shadow-lg',
            'focus:outline-none',
            'text-amber-500 transition-all duration-200',
            'hidden lg:inline-flex items-center justify-center',
            'select-none'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
        >
          {collapsed ? <FiChevronRight size={22} /> : <FiChevronLeft size={22} />}
        </button>
      </div>

      <nav className="flex-1 px-2 space-y-1 py-2">
        {renderedNav}
      </nav>

      {!collapsed && (
        <div className="p-4 border-t border-gray-800 text-xs text-gray-500 sticky bottom-0 bg-gray-900">

          <div className="mt-2">© 2025 Stremora</div>
        </div>
      )}
    </aside>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  // The navItems prop is no longer needed as it's generated internally
  // navItems: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     label: PropTypes.string.isRequired,
  //     icon: PropTypes.node.isRequired,
  //     path: PropTypes.string.isRequired
  //   })
  // ),
  onClose: PropTypes.func,
};

export default React.memo(Sidebar);