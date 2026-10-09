import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-xl select-none';

  const variants = {
    primary:
      'bg-apple-blue hover:bg-[#0077ed] text-white shadow-sm hover:shadow focus:ring-apple-blue dark:bg-apple-blue-dark dark:hover:bg-[#2997ff]',
    secondary:
      'bg-apple-gray-100 hover:bg-apple-gray-200 text-apple-gray-900 dark:bg-apple-gray-800 dark:hover:bg-apple-gray-700 dark:text-apple-gray-100 focus:ring-apple-gray-400',
    outline:
      'border border-apple-gray-300 dark:border-apple-gray-700 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-apple-gray-800 dark:text-apple-gray-200 focus:ring-apple-gray-400',
    ghost:
      'bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-apple-gray-700 dark:text-apple-gray-300 focus:ring-apple-gray-400',
    danger:
      'bg-red-500 hover:bg-red-600 text-white shadow-sm focus:ring-red-400 dark:bg-red-600 dark:hover:bg-red-500',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg',
    md: 'text-sm px-4 py-2 gap-2 rounded-xl',
    lg: 'text-base px-6 py-2.5 gap-2.5 rounded-2xl',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
