import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={twMerge(
              clsx(
                'relative w-full overflow-hidden rounded-3xl p-6 shadow-2xl z-10',
                'bg-white/90 dark:bg-apple-gray-900/90 backdrop-blur-2xl',
                'border border-apple-gray-200/80 dark:border-apple-gray-800/80',
                maxWidths[maxWidth]
              )
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4">
              <div>
                {title && (
                  <h3 className="text-lg font-semibold text-apple-gray-900 dark:text-white">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="mt-1 text-xs text-apple-gray-500 dark:text-apple-gray-400">
                    {description}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-apple-gray-400 hover:text-apple-gray-600 hover:bg-black/5 dark:hover:text-apple-gray-200 dark:hover:bg-white/5 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="mt-2">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
