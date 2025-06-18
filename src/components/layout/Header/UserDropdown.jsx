import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts';
import { 
  FiUser, 
  FiChevronRight, 
  FiUpload, 
  FiVideo, 
  FiClock, 
  FiCreditCard, 
  FiSettings, 
  FiLogOut, 
  FiLogIn, 
  FiUserPlus 
} from 'react-icons/fi';

const UserDropdown = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => setIsOpen(!isOpen);
  const handleClose = () => setIsOpen(false);

  const handleLogin = () => {
    handleClose();
    navigate('/login');
  };

  const handleLogout = () => {
    handleClose();
    onLogout();
  };

  const handleProfileClick = () => {
    handleClose();
    navigate('/user');
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full overflow-hidden mx-4">
        <div className="w-full h-full animate-spin border-4 border-gray-300 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      {/* Avatar Button */}
      <button
        onClick={handleToggle}
        className="relative w-10 h-10 rounded-full overflow-hidden flex items-center justify-center cursor-pointer transition-all duration-500 hover:outline-2 hover:outline-gray-400/60 hover:outline-offset-2 focus:outline-none"
        aria-label={user ? 'User menu' : 'Sign in'}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {user ? (
          <img 
            src={user.avatar} 
            alt={`${user.fullname || user.username}'s avatar`} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-gray-600 dark:bg-gray-700 flex items-center justify-center">
            <FiUser className="w-6 h-6 text-white" />
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-4 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-800 z-50 overflow-hidden">
          {/* User Info Header - Clickable */}
          <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
            {user ? (
              <button
                onClick={handleProfileClick}
                className="w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg p-2 -m-2 transition-colors duration-150 group"
              >
                <div className="flex items-center space-x-3">
                  <img 
                    src={user.avatar} 
                    alt="User avatar" 
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600 group-hover:ring-gray-300 dark:group-hover:ring-gray-500 transition-colors" 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-gray-900 dark:text-white truncate group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                      {user.fullname || user.username}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      @{user.username}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                      <span>Manage your account</span>
                      <FiChevronRight className="w-3 h-3 ml-1 text-gray-400 group-hover:text-gray-500 transition-colors" />
                    </p>
                  </div>
                </div>
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 dark:from-gray-500 dark:to-gray-600 rounded-full flex items-center justify-center">
                  <FiUser className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    Welcome to Stremora
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Sign in to access your account
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Join our community
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {user ? (
              <>
                {/* Primary Actions */}
                <div className="px-2">
                  <NavLink
                    to="/upload"
                    onClick={handleClose}
                    className="flex items-center px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors duration-150 group"
                  >
                    <FiUpload className="w-5 h-5 mr-3 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
                    <span className="font-medium">Upload Video</span>
                  </NavLink>

                  <NavLink
                    to="/my-videos"
                    onClick={handleClose}
                    className="flex items-center px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors duration-150 group"
                  >
                    <FiVideo className="w-5 h-5 mr-3 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
                    <span className="font-medium">My Videos</span>
                  </NavLink>

                  <NavLink
                    to="/history"
                    onClick={handleClose}
                    className="flex items-center px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors duration-150 group"
                  >
                    <FiClock className="w-5 h-5 mr-3 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
                    <span className="font-medium">Watch History</span>
                  </NavLink>

                  <NavLink
                    to="/subscription"
                    onClick={handleClose}
                    className="flex items-center px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors duration-150 group"
                  >
                    <FiCreditCard className="w-5 h-5 mr-3 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
                    <span className="font-medium">Subscriptions</span>
                  </NavLink>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

                {/* Settings & Logout */}
                <div className="px-2">
                  <NavLink
                    to="/user/update-account"
                    onClick={handleClose}
                    className="flex items-center px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors duration-150 group"
                  >
                    <FiSettings className="w-5 h-5 mr-3 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
                    <span className="font-medium">Settings</span>
                  </NavLink>

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-150 group"
                  >
                    <FiLogOut className="w-5 h-5 mr-3 text-red-500 group-hover:text-red-600 transition-colors" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="px-2">
                <button
                  onClick={handleLogin}
                  className="flex items-center w-full px-3 py-2.5 text-sm text-gray-800 dark:text-gray-200 hover:bg-orange-100 dark:hover:bg-orange-900/20 rounded-lg transition-colors duration-200 group"
                >
                  <FiLogIn className="w-5 h-5 mr-3 text-orange-600 dark:text-orange-400 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors" />
                  <span className="font-medium">Welcome Back! Sign In</span>
                </button>

                <NavLink
                  to="/register"
                  onClick={handleClose}
                  className="flex items-center px-3 py-2.5 text-sm text-gray-800 dark:text-gray-200 hover:bg-orange-100 dark:hover:bg-orange-900/20 rounded-lg transition-colors duration-200 group"
                >
                  <FiUserPlus className="w-5 h-5 mr-3 text-orange-600 dark:text-orange-400 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors" />
                  <span className="font-medium">Join Our Community</span>
                </NavLink>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown; 