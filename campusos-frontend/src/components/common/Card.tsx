import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverable = false,
  glass = true,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-2xl transition-all duration-300 p-6',
          glass
            ? 'glass-card shadow-apple-sm dark:shadow-apple-dark-glass'
            : 'bg-white dark:bg-apple-gray-900 border border-apple-gray-200 dark:border-apple-gray-800 shadow-apple-sm',
          hoverable && 'hover:shadow-apple-md hover:-translate-y-0.5',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
