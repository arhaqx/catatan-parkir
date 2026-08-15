import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = ({ className = '', size = 'md' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center p-2 rounded-full transition-all duration-200 active:scale-90 border cursor-pointer ${
        isDark
          ? 'bg-m3-surface-high hover:bg-m3-surface-highest text-amber-300 border-white/10 hover:border-amber-400/30'
          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs hover:border-blue-300'
      } ${className}`}
      title={isDark ? 'Ganti ke Mode Terang (Light)' : 'Ganti ke Mode Gelap (Dark)'}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      ) : (
        <Moon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      )}
    </button>
  );
};

export default ThemeToggle;
