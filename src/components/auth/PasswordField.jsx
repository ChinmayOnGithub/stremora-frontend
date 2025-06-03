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
    <div className="group space-y-1.5">
      <label className="text-sm font-medium text-foreground dark:text-gray-300 flex items-center">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
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
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/60 transition-all duration-300 group-focus-within:text-primary dark:group-focus-within:text-amber-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5">
            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          placeholder="••••••••"
          value={value}
          onChange={onChange}
          required={required}
          className="h-9 w-full rounded-lg border border-muted-foreground/20 bg-background pl-9 pr-10 text-sm shadow-sm transition-all duration-300 placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 group-hover:border-muted-foreground/30 sm:h-10 sm:pl-10 sm:pr-11 dark:border-gray-600 dark:bg-gray-900/50 dark:focus:ring-amber-400/20"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground/60 hover:text-primary dark:hover:text-amber-400 transition-colors"
          tabIndex="-1"
        >
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5">
              <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
              <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5">
              <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z" clipRule="evenodd" />
              <path d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" />
            </svg>
          )}
        </button>
        {/* Password strength indicator - only show if showStrengthIndicator is true */}
        {showStrengthIndicator && value && (
          <div className="absolute -bottom-1 left-0 h-1 w-full overflow-hidden rounded-b-lg">
            <div
              className={`h-full transition-all duration-300 ${value.length < 6 ? 'w-1/3 bg-red-500' :
                value.length < 10 ? 'w-2/3 bg-yellow-500' :
                  'w-full bg-green-500'
                }`}
            ></div>
          </div>
        )}
      </div>
      {/* Password strength text - only show if showStrengthIndicator is true */}
      {showStrengthIndicator && value && (
        <p className={`text-xs ${value.length < 6 ? 'text-red-500' :
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