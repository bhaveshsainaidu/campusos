import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { House } from '@phosphor-icons/react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-apple-gray-100 dark:bg-apple-gray-800 flex items-center justify-center text-2xl font-bold text-apple-gray-400">
        404
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-apple-gray-900 dark:text-white">
          Page Not Found
        </h1>
        <p className="text-sm text-apple-gray-500">
          The requested university resource or screen does not exist.
        </p>
      </div>
      <Link to="/">
        <Button variant="primary" icon={<House weight="bold" className="h-4 w-4" />}>
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};
