import PropTypes from 'prop-types';

export function BackendError({ onRetry }) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-md p-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
          Connection Issue
        </h2>
        <p className="text-red-700 dark:text-red-300 mb-4">
          We&apos;re unable to connect to our servers. Please check:
        </p>
        <ul className="list-disc list-inside text-left space-y-2 text-red-600 dark:text-red-300">
          <li>Your internet connection</li>
          <li>Server status</li>
          <li>Browser network settings</li>
        </ul>
        <button
          onClick={handleRetry}
          className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors dark:bg-red-600 dark:hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

BackendError.propTypes = {
  onRetry: PropTypes.func
}; 