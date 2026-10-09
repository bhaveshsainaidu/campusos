import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '../common/ToastContainer';
import { WebSocketManager } from '../ws/WebSocketManager';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-black text-apple-gray-900 dark:text-apple-gray-100 flex flex-col transition-colors selection:bg-apple-blue selection:text-white">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
      <WebSocketManager />
    </div>
  );
};
