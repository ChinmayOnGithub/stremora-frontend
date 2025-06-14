import PropTypes from 'prop-types';

const FormField = ({
  label,
  required,
  tooltip,
  icon,
  type = "text",
  value,
  onChange,
  name,
  className = "",
  isInvalid = false
}) => {
  return (
    <div className="group space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
          {!required && <span className="ml-1 text-xs text-gray-500">(Optional)</span>}
          {tooltip && (
            <div className="relative ml-1 inline-block">
              <div className="hover-trigger">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <div className="absolute right-0 bottom-full mb-2 w-44 rounded-md bg-gray-800/80 p-2 text-xs text-gray-100 shadow-md hover-target dark:bg-gray-700/80 z-50">
                  {tooltip}
                  <div className="absolute -bottom-1 right-2 h-1.5 w-1.5 rotate-45 bg-gray-800/80 dark:bg-gray-700/80"></div>
                </div>
              </div>
            </div>
          )}
        </label>
      </div>
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          id={name}
          name={name}
          placeholder={label}
          value={value}
          onChange={onChange}
          required={required}
          className={`h-11 w-full rounded-lg bg-white/80 pl-9 pr-3 py-3 text-sm font-medium text-gray-900 transition-all duration-300 
            placeholder:text-gray-500 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-orange-400/25 
            sm:h-12 sm:pl-10 sm:pr-4 dark:bg-gray-800/80 dark:text-gray-100 ${className}`}
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
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  isInvalid: PropTypes.bool
};

export default FormField; 