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
} from 'react-icons/fi';

// Default items - override via props if needed
const DEFAULT_NAV_ITEMS = [
  { label: 'Home', icon: <FiHome size={20} />, path: '/' },
  { label: 'History', icon: <FiClock size={20} />, path: '/history' },
  { label: 'My Videos', icon: <FiVideo size={20} />, path: '/my-videos' },
  { label: 'Upload', icon: <FiUpload size={20} />, path: '/upload' },
];

const Sidebar = ({
  className = '',
  navItems = DEFAULT_NAV_ITEMS,
}) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
    // Initialize from localStorage if available
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  // Save collapsed state to localStorage
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

  const renderedNav = useMemo(
    () => navItems.map((item) => (
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
    [navItems, collapsed, isActive]
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
      {/* Header */}
      <div className="flex items-center justify-between p-4 sticky top-0 bg-gray-900 z-10">
        <div className="flex items-center gap-2 flex-1">
          {!collapsed && (
            <>
              <h1 className="font-bold text-5xl font-serif text-white">NavBar</h1>
            </>
          )}
        </div>
        <button
          onClick={toggleCollapsed}
          className={twMerge(
            'p-1.5 rounded-full transition-colors duration-200 ml-1',
            'hover:bg-amber-900/30',
            'focus:outline-none',
            'text-gray-400'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
        >
          {collapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-1 py-2">
        {renderedNav}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-800 text-xs text-gray-500 sticky bottom-0 bg-gray-900">
          © 2025 Stremora
        </div>
      )}
    </aside>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
      path: PropTypes.string.isRequired
    })
  ),
};

export default React.memo(Sidebar);
