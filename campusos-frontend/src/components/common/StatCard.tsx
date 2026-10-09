import React from 'react';
import { Card } from './Card';
import { clsx } from 'clsx';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  accentColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
}) => {
  return (
    <Card hoverable className="relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-wide uppercase text-apple-gray-500 dark:text-apple-gray-400">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-2xl font-bold tracking-tight text-apple-gray-900 dark:text-white">
              {value}
            </h4>
            {trend && (
              <span
                className={clsx(
                  'text-xs font-semibold px-1.5 py-0.5 rounded-full flex items-center',
                  trend.isPositive
                    ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40'
                    : 'text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-950/40'
                )}
              >
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-apple-gray-500 dark:text-apple-gray-400">
              {subtitle}
            </p>
          )}
        </div>

        {icon && (
          <div className="p-3 rounded-2xl bg-apple-gray-100 dark:bg-apple-gray-800 text-apple-gray-800 dark:text-apple-gray-100 group-hover:scale-105 transition-transform duration-200">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};
