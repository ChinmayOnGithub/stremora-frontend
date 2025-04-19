import { Link, useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

const navigationItems = [
  {
    label: 'Home',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    ),
    path: '/'
  },
  {
    label: 'Watch History',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
    ),
    path: '/history'
  },
  {
    label: 'My Videos',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
      </svg>
    ),
    path: '/my-videos'
  },
  {
    label: 'Upload',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    ),
    path: '/upload'
  }
];

const categories = [
  'Gaming',
  'Music',
  'Education',
  'Technology',
  'Entertainment'
];

const Sidebar = ({ className, onClose, isCollapsed = false }) => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleClick = () => {
    if (onClose && window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <aside className={twMerge(
      "flex-shrink-0 h-full overflow-y-auto bg-gray-50/80 dark:bg-gray-900/80 border-r border-gray-200/50 dark:border-gray-800/50 backdrop-blur-xl",
      className
    )}>
      <div className={`p-4 ${!isCollapsed ? 'w-72' : 'w-20'} transition-all duration-300`}>
        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleClick}
              className={twMerge(
                "group flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isCollapsed && "justify-center px-3",
                isActive(item.path)
                  ? "bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-500 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-amber-600 dark:hover:text-amber-500 hover:shadow-sm"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <span className={`transition-transform duration-200 ${isActive(item.path) ? 'scale-100' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="truncate transition-colors duration-200">
                  {item.label}
                </span>
              )}
              {isActive(item.path) && !isCollapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500" />
              )}
            </Link>
          ))}
        </nav>

        {/* Divider */}
        {!isCollapsed && (
          <div className="my-6 border-t border-gray-200 dark:border-gray-800" />
        )}

        {/* Categories */}
        {!isCollapsed && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
            <h3 className="px-2 mb-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Popular Categories
            </h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/category/${category.toLowerCase()}`}
                  onClick={handleClick}
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-amber-600 dark:hover:text-amber-500 transition-all duration-200"
                >
                  <span className="flex items-center justify-center w-5 h-5 text-xs opacity-60 transition-transform duration-200 group-hover:scale-110">
                    #
                  </span>
                  <span className="truncate transition-colors duration-200">
                    {category}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar; 