import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import PropTypes from 'prop-types';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Clock,
  Video,
  Upload,
  Search,
  Hash,
} from 'lucide-react';

// Default items - override via props if needed
const DEFAULT_NAV_ITEMS = [
  { label: 'Home', icon: <Home size={20} />, path: '/' },
  { label: 'History', icon: <Clock size={20} />, path: '/history' },
  { label: 'My Videos', icon: <Video size={20} />, path: '/my-videos' },
  { label: 'Upload', icon: <Upload size={20} />, path: '/upload' },
];
const DEFAULT_CATEGORIES = ['Gaming', 'Music', 'Education', 'Technology', 'Entertainment'];

const Sidebar = ({
  className = '',
  navItems = DEFAULT_NAV_ITEMS,
  categories = DEFAULT_CATEGORIES,
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
          'group flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ease-in-out',
          'hover:bg-amber-100 dark:hover:bg-amber-900/30',
          isActive(item.path)
            ? 'bg-amber-600 text-white hover:bg-amber-700'
            : 'text-gray-700 dark:text-gray-300'
        )}
        title={collapsed ? item.label : undefined}
        aria-label={item.label}
      >
        <div className={twMerge(
          'flex-shrink-0 transition-transform duration-200',
          isActive(item.path) ? 'text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-500'
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

  const renderedCategories = useMemo(
    () => categories.map((cat) => {
      const active = location.pathname.startsWith(`/category/${cat.toLowerCase()}`);
      return (
        <Link
          key={cat}
          to={`/category/${cat.toLowerCase()}`}
          className={twMerge(
            'group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ease-in-out',
            'hover:bg-gray-200 dark:hover:bg-amber-900/30',
            active
              ? 'bg-gray-200 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
              : 'text-gray-700 dark:text-gray-300'
          )}
          title={collapsed ? cat : undefined}
          aria-label={`Category: ${cat}`}
        >
          <div className={twMerge(
            'flex-shrink-0 transition-transform duration-200',
            active ? 'text-amber-700 dark:text-amber-300' : 'text-gray-600 dark:text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-500'
          )}>
            <Hash size={18} />
          </div>
          <span className={twMerge(
            'truncate whitespace-nowrap transition-all duration-200 ease-in-out',
            collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
          )}>
            {cat}
          </span>
        </Link>
      );
    }),
    [categories, collapsed, location.pathname]
  );

  return (
    <aside
      className={twMerge(
        'flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg',
        'h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700',
        'transition-all duration-200 ease-in-out',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 sticky top-0 bg-white dark:bg-gray-900 z-10">
        <div className="flex items-center gap-2 flex-1">
        {!collapsed && (
            <>
              <Search size={20} className="text-gray-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search"
                className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 dark:focus:ring-amber-500 w-full"
                aria-label="Search"
            />
            </>
          )}
          </div>
        <button
          onClick={toggleCollapsed}
          className={twMerge(
            'p-1.5 rounded-full transition-colors duration-200 ml-1',
            'hover:bg-amber-100/50 dark:hover:bg-amber-900/30',
            'focus:outline-none',
            'text-gray-600 dark:text-gray-400'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-1 py-2">
        {renderedNav}

        {!collapsed && (
          <div className="mt-6">
            <div className="px-4 mb-2 flex items-center gap-2">
              <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-400 uppercase tracking-wider">
              Categories
            </h3>
              <div className="h-px flex-1 bg-gray-300 dark:bg-amber-800/20"></div>
            </div>
            <div className="space-y-1 bg-gray-100 dark:bg-amber-900/10 rounded-lg p-2">
              {renderedCategories}
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 sticky bottom-0 bg-white dark:bg-gray-900">
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
  categories: PropTypes.arrayOf(PropTypes.string)
};

export default React.memo(Sidebar);
