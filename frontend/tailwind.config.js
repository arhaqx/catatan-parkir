/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Google Sans', 'Roboto', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        m3: {
          surface: '#0f1318',
          'surface-dim': '#0b0e12',
          'surface-bright': '#353940',
          'surface-low': '#15191f',
          'surface-container': '#1c2128',
          'surface-high': '#242a33',
          'surface-highest': '#2e3540',
          
          // Light Mode Material 3 Surface Tokens
          'light-surface': '#f8f9fa',
          'light-surface-low': '#f1f3f4',
          'light-surface-container': '#ffffff',
          'light-surface-high': '#e8eaed',
          'light-surface-highest': '#dadce0',

          primary: '#8ab4f8',
          'primary-hover': '#a8c7fa',
          'primary-container': '#0842a0',
          'on-primary': '#002d6c',
          'on-primary-container': '#d3e3fd',

          // Light Mode Primary
          'light-primary': '#1a73e8',
          'light-primary-container': '#d2e3fc',
          'light-on-primary-container': '#0d47a1',

          secondary: '#c2e7ff',
          'secondary-container': '#004a77',
          'on-secondary-container': '#c2e7ff',
          tertiary: '#6dd58c',
          'tertiary-container': '#005322',
          'on-tertiary-container': '#c4eed0',
          error: '#f2b8b5',
          'error-container': '#8c1d18',
          'on-error-container': '#f9dedc',
          outline: '#8c9199',
          'outline-variant': '#43474e',
        }
      },
      animation: {
        'aurora': 'aurora 20s ease infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        aurora: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(168, 85, 247, 0.6)' },
        }
      },
    },
  },
  plugins: [],
}
