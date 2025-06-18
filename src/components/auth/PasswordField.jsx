import { useState } from 'react';
import PropTypes from 'prop-types';

const PasswordField = ({
  label,
  required,
  tooltip,
  value,
  onChange,
  name,
  className = "",
  isInvalid = false,
  showStrengthIndicator = false
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^A-Za-z0-9]/)) score++;

    const labels = ['', 'Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
    const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];
    const textColors = ['', 'text-red-500', 'text-orange-500', 'text-yellow-500', 'text-green-500', 'text-emerald-500'];

    return {
      score,
      label: labels[score],
      color: colors[score],
      textColor: textColors[score]
    };
  };

  const strength = getPasswordStrength(value);

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
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type={showPassword ? "text" : "password"}
          id={name}
          name={name}
          placeholder={label}
          value={value}
          onChange={onChange}
          required={required}
          className={`h-11 w-full rounded-lg bg-gray-100/90 pl-9 pr-12 py-3 text-sm font-medium text-gray-900 transition-all duration-300 
            placeholder:text-gray-500 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-orange-400/25 
            sm:h-12 sm:pl-10 sm:pr-12 dark:bg-gray-800/80 dark:text-gray-100 ${className}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-1/2 -translate-y-1/2 right-2 flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-200 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400/25 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
        >
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 flex items-center justify-center">
              <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
              <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 flex items-center justify-center">
              <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z" clipRule="evenodd" />
              <path d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" />
            </svg>
          )}
        </button>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">Must be at least 8 characters</p>
      {/* Password strength indicator */}
      {showStrengthIndicator && value && (
        <div className="space-y-1">
          <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className={`h-full transition-all duration-300 ${strength.color}`}
              style={{ width: `${(strength.score / 5) * 100}%` }}
            ></div>
          </div>
          <p className={`text-xs ${strength.textColor}`}>
            {strength.label}
          </p>
        </div>
      )}
    </div>
  );
};

PasswordField.propTypes = {
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  tooltip: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  isInvalid: PropTypes.bool,
  showStrengthIndicator: PropTypes.bool
};

export default PasswordField; 