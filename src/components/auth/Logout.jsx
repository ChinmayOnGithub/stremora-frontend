import { useAuth } from "../../contexts";
import PropTypes from 'prop-types';
import { LogOut, AlertCircle } from 'lucide-react';

function Logout({ onClose }) {
  const { logout } = useAuth();

  const handleConfirmLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur and fade animation */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal with slide-up animation */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[90%] max-w-sm animate-in slide-in-from-bottom-4 duration-300">
        {/* Content */}
        <div className="p-6">
          {/* Icon with subtle background effect */}
          <div className="relative mx-auto w-16 h-16 mb-5">
            <div className="absolute inset-0 rounded-full bg-amber-100 dark:bg-amber-900/30 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <LogOut size={28} className="text-amber-600 dark:text-amber-400" />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">
            Logout
          </h2>
          
          {/* Warning message with icon */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-500 dark:text-amber-400 flex-shrink-0" />
              <p className="text-sm text-amber-700 dark:text-amber-300">
                You&apos;ll need to log in again to access your account
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 dark:bg-gray-700 mb-6"></div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmLogout}
              className="flex-1 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-medium transition-all duration-200"
          >
            Logout
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}

Logout.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default Logout;
