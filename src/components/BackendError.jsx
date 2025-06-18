import PropTypes from 'prop-types';
import { HiOutlineExclamationTriangle, HiOutlineArrowPath } from 'react-icons/hi2';
import { useRef, useEffect, useState } from 'react';

export function BackendError({ onRetry, retrying }) {
  const [showSpinner, setShowSpinner] = useState(false);
  const retryTimeout = useRef();

  useEffect(() => {
    if (retrying) {
      retryTimeout.current = setTimeout(() => setShowSpinner(true), 2000);
    } else {
      setShowSpinner(false);
      clearTimeout(retryTimeout.current);
    }
    return () => clearTimeout(retryTimeout.current);
  }, [retrying]);

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-neutral-100 dark:bg-neutral-900">
      <div className="w-full max-w-xs p-6 rounded-lg shadow-md bg-white dark:bg-neutral-800 border border-amber-200 dark:border-amber-600 flex flex-col items-center gap-4">
        <HiOutlineExclamationTriangle className="w-10 h-10 text-amber-500 dark:text-amber-400 mb-1" />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1 text-center">
          Can&apos;t Connect
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-1">
          We're having trouble reaching our servers.
        </p>
        <ul className="list-disc list-inside text-left space-y-1 text-gray-500 dark:text-gray-300 w-full max-w-xs mx-auto pl-4 text-xs mb-2">
          <li>Your internet connection</li>
          <li>Server maintenance or outage</li>
          <li>Browser or network settings</li>
        </ul>
        {retrying && (
          <div className="w-full flex items-center justify-center gap-2 text-xs text-blue-500 dark:text-blue-300 animate-pulse">
            {showSpinner && (
              <HiOutlineArrowPath className="w-4 h-4 animate-spin" />
            )}
            Retrying connection...
          </div>
        )}
        <button
          onClick={handleRetry}
          className="w-full mt-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={retrying}
        >
          {retrying ? 'Retrying...' : 'Try Again'}
        </button>
      </div>
    </div>
  );
}

BackendError.propTypes = {
  onRetry: PropTypes.func,
  retrying: PropTypes.bool
}; 