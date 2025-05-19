import React, { useMemo, useCallback, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Clock,
  Video,
  Upload,
  Search,
} from 'lucide-react';

// Default items - override via props if needed
const DEFAULT_NAV_ITEMS = [
  { label: 'Home', icon: <Home size={18} />, path: '/' },
  { label: 'History', icon: <Clock size={18} />, path: '/history' },
  { label: 'My Videos', icon: <Video size={18} />, path: '/my-videos' },
  { label: 'Upload', icon: <Upload size={18} />, path: '/upload' },
];
const DEFAULT_CATEGORIES = ['Gaming', 'Music', 'Education', 'Technology', 'Entertainment'];

const Sidebar = ({
  className = '',
  navItems = DEFAULT_NAV_ITEMS,
  categories = DEFAULT_CATEGORIES,
  user = { name: 'User Name', avatarUrl: null }
}) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = useCallback(() => setCollapsed(prev => !prev), []);

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
          'group flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ease-in-out',
          isActive(item.path)
            ? 'bg-amber-500 text-white'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
        )}
        title={collapsed ? item.label : undefined}
      >
        {item.icon}
        {!collapsed && <span className="truncate">{item.label}</span>}
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
            'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ease-in-out',
            active
              ? 'bg-amber-100 text-amber-600'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          )}
          title={collapsed ? cat : undefined}
        >
          <span className="font-semibold">#</span>
          {!collapsed && <span className="truncate">{cat}</span>}
        </Link>
      );
    }),
    [categories, collapsed, location.pathname]
  );

  return (
    <aside
      className={twMerge(
        'flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out shadow-lg',
        collapsed ? 'w-20' : 'w-64',
        'h-full overflow-y-auto', // Ensure full height and independent scroll
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <div className="flex items-center gap-2 flex-1">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg focus:outline-none w-full"
            />
          </div>
        )}
        <button
          onClick={toggleCollapsed}
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-2">
        {renderedNav}

        {!collapsed && (
          <div className="mt-6">
            <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase">
              Categories
            </h3>
            <div className="space-y-1">{renderedCategories}</div>
          </div>
        )}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500">
          © 2025 Stremora
        </div>
      )}
    </aside>
  );

};

export default React.memo(Sidebar);
