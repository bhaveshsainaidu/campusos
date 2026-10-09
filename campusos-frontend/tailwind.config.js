/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          'system-ui',
          'sans-serif',
        ],
      },
      colors: {
        apple: {
          blue: '#0071e3',
          'blue-dark': '#0a84ff',
          gray: {
            50: '#fbfbfd',
            100: '#f5f5f7',
            200: '#e5e5ea',
            300: '#d1d1d6',
            400: '#aeaeb2',
            500: '#8e8e93',
            600: '#636366',
            700: '#48484a',
            800: '#2c2c2e',
            900: '#1c1c1e',
            950: '#0d0d0e',
          },
        },
      },
      boxShadow: {
        'apple-sm': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        'apple-md': '0 4px 14px 0 rgba(0,0,0,0.06)',
        'apple-lg': '0 10px 30px 0 rgba(0,0,0,0.08)',
        'apple-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.07)',
        'apple-dark-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
};
