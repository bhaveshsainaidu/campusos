import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => {
  const savedTheme = localStorage.getItem('campusos_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialDark = savedTheme ? savedTheme === 'dark' : prefersDark;

  if (initialDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  return {
    isDark: initialDark,
    toggleTheme: () =>
      set((state) => {
        const next = !state.isDark;
        if (next) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('campusos_theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('campusos_theme', 'light');
        }
        return { isDark: next };
      }),
    setTheme: (dark: boolean) => {
      if (dark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('campusos_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('campusos_theme', 'light');
      }
      set({ isDark: dark });
    },
  };
});
