// import React from 'react';
import PropTypes from 'prop-types';

function Button({ children, variant, className, isLoading, loadingText, ...props }) {
  const baseClasses = "relative px-6 py-2 rounded-md transition-all duration-200 overflow-hidden text-center";
  let variantClasses = "";

  switch (variant) {
    case "primary":
      variantClasses = "h-11 w-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400/20 disabled:opacity-70 dark:from-amber-600 dark:to-amber-700 dark:hover:from-amber-700 dark:hover:to-amber-800 dark:focus:ring-amber-400/20";
      break;
    case "secondary":
      variantClasses = "bg-gray-300 text-gray-900 hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600";
      break;
    default:
      variantClasses = "h-11 w-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400/20 disabled:opacity-70 dark:from-amber-600 dark:to-amber-700 dark:hover:from-amber-700 dark:hover:to-amber-800 dark:focus:ring-amber-400/20";
      break;
  }

  return (
    <button className={`${baseClasses} ${variantClasses} ${className}`} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? (
        <div className="flex items-center justify-center gap-2" aria-live="polite">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <span>{loadingText || "Loading..."}</span>
        </div>
      ) : (
        <>
          <span className="relative z-10 block w-full h-full flex items-center justify-center">{children}</span>
        </>
      )}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary"]),
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  loadingText: PropTypes.string,
};

Button.defaultProps = {
  variant: "primary",
  className: "",
  isLoading: false,
  loadingText: "Loading...",
};

export default Button;
