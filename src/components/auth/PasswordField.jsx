import { useState } from 'react';
import PropTypes from 'prop-types';

const PasswordField = ({
  label,
  required,
  tooltip,
  value,
  onChange,
  name,
  showStrengthIndicator = false
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="group space-y-1">
      <label className="text-sm font-medium text-foreground dark:text-gray-300 flex items-center">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
        {tooltip && (
          <div className="relative ml-1 inline-block">
            <div className="hover-trigger">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-muted-foreground/70">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <div className="absolute -left-2 bottom-full mb-2 w-48 rounded-md bg-gray-800/95 p-2 text-xs text-gray-100 shadow-lg hover-target dark:bg-gray-700/95 z-50">
                {tooltip}
                <div className="absolute -bottom-1 left-2 h-2 w-2 rotate-45 bg-gray-800/95 dark:bg-gray-700/95"></div>
              </div>
            </div>
          </div>
        )}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/60">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          placeholder="••••••••"
          value={value}
          onChange={onChange}
          required={required}
          className="h-9 w-full rounded-md bg-gray-100 pl-9 pr-10 text-sm transition-all duration-300 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 sm:h-10 sm:pl-10 sm:pr-11 dark:bg-gray-800/80"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground/60 hover:text-primary dark:hover:text-amber-400 transition-colors"
          tabIndex="-1"
        >
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
              <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
              <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
              <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
            </svg>
          )}
        </button>
        {/* Password strength indicator */}
        {showStrengthIndicator && value && (
          <div className="absolute -bottom-1 left-0 h-1 w-full overflow-hidden rounded-b-md">
            <div
              className={`h-full transition-all duration-300 ${
                value.length < 6 ? 'w-1/3 bg-red-500' :
                value.length < 10 ? 'w-2/3 bg-yellow-500' :
                'w-full bg-green-500'
              }`}
            ></div>
          </div>
        )}
      </div>
      {/* Password strength text */}
      {showStrengthIndicator && value && (
        <p className={`text-xs ${
          value.length < 6 ? 'text-red-500' :
          value.length < 10 ? 'text-yellow-500' :
          'text-green-500'
        }`}>
          {value.length < 6 ? 'Weak password' :
           value.length < 10 ? 'Good password' :
           'Strong password'}
        </p>
      )}
    </div>
  );
};

PasswordField.propTypes = {
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  tooltip: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  showStrengthIndicator: PropTypes.bool
};

export default PasswordField; 