import React from 'react';
import PropTypes from 'prop-types';

const FormField = ({
  label,
  required,
  tooltip,
  icon,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  className = ""
}) => {
  return (
    <div className="group space-y-1.5">
      <label className="text-sm font-medium text-foreground dark:text-gray-300 flex items-center">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
        {!required && <span className="ml-1 text-xs text-muted-foreground">(Optional)</span>}
        {tooltip && (
          <div className="relative ml-1 inline-block">
            <div className="hover-trigger">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-muted-foreground/70">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <div className="absolute -left-2 bottom-full mb-2 w-48 rounded-md bg-black/90 p-2 text-xs text-white shadow-lg hover-target dark:bg-gray-800 z-50">
                {tooltip}
                <div className="absolute -bottom-1 left-2 h-2 w-2 rotate-45 bg-black/90 dark:bg-gray-800"></div>
              </div>
            </div>
          </div>
        )}
      </label>
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/60 transition-all duration-300 group-focus-within:text-primary dark:group-focus-within:text-amber-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`h-9 w-full rounded-lg border border-muted-foreground/20 bg-background pl-9 pr-3 text-sm shadow-sm transition-all duration-300 placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 group-hover:border-muted-foreground/30 sm:h-10 sm:pl-10 sm:pr-4 dark:border-gray-600 dark:bg-gray-900/50 dark:focus:ring-amber-400/20 ${className}`}
        />
      </div>
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  tooltip: PropTypes.string,
  icon: PropTypes.node,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default FormField; 