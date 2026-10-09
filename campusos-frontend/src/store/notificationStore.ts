import { create } from 'zustand';

export interface ToastItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  duration?: number;
}

interface NotificationState {
  toasts: ToastItem[];
  unreadNoticesCount: number;
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
  incrementNoticeCount: () => void;
  clearNoticeCount: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  toasts: [],
  unreadNoticesCount: 0,

  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = { ...toast, id };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    const duration = toast.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  incrementNoticeCount: () => {
    set((state) => ({ unreadNoticesCount: state.unreadNoticesCount + 1 }));
  },

  clearNoticeCount: () => {
    set({ unreadNoticesCount: 0 });
  },
}));
