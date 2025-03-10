import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonProps = {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) => {
  const baseStyles = 'px-6 py-2 rounded-lg transition-all duration-200 font-medium';

  const variantStyles = {
    primary: 'bg-amber-600 text-white hover:bg-amber-500',
    secondary: 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-400/50 dark:hover:bg-gray-600',
    outline: 'border-2 border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;