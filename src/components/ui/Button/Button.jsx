// import React from 'react';
import PropTypes from 'prop-types';

function Button({ children, variant, className, ...props }) {
  const baseClasses = "px-6 py-2 rounded-md transition-all duration-200";
  let variantClasses = "";

  switch (variant) {
    case "primary":
      // Light mode: a slightly lighter amber (amber-500) with hover to amber-400.
      // Dark mode: a deeper amber (amber-600) with hover to amber-500.
      variantClasses = "bg-amber-500 text-white hover:bg-amber-400 dark:bg-amber-600 dark:hover:bg-amber-500";
      break;
    case "secondary":
      // Light mode: gray-300 with dark text and hover to gray-400.
      // Dark mode: gray-700 with white text and hover to gray-600.
      variantClasses = "bg-gray-300 text-gray-900 hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600";
      break;
    default:
      variantClasses = "bg-amber-500 text-white hover:bg-amber-400 dark:bg-amber-600 dark:hover:bg-amber-500";
      break;
  }

  return (
    <button className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary"]),
  className: PropTypes.string,
};

Button.defaultProps = {
  variant: "primary",
  className: "",
};

export default Button;
