import React from 'react';

/**
 * Google Stitch / Material 3 Ambient Canvas
 * Adaptive Light & Dark mode background container
 */
export const AuroraBackground = ({ children, className = '' }) => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#f8f9fa] dark:bg-m3-surface text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Dark Mode Ambient Blobs */}
      <div className="hidden dark:block pointer-events-none fixed -top-32 left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-blue-600/15 via-indigo-600/10 to-teal-500/10 blur-[130px]" />
      <div className="hidden dark:block pointer-events-none fixed top-1/2 -left-32 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-indigo-700/10 via-purple-600/10 to-transparent blur-[120px]" />
      <div className="hidden dark:block pointer-events-none fixed -bottom-32 -right-32 h-[450px] w-[450px] rounded-full bg-gradient-to-tl from-teal-600/10 via-blue-700/10 to-transparent blur-[130px]" />

      {/* Light Mode Subtle Ambient Blobs */}
      <div className="dark:hidden pointer-events-none fixed -top-32 left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-blue-200/40 via-indigo-100/30 to-teal-100/30 blur-[120px]" />
      <div className="dark:hidden pointer-events-none fixed top-1/2 -left-32 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-blue-100/30 via-purple-100/20 to-transparent blur-[100px]" />

      {/* Content wrapper with flex layout */}
      <div className={`relative z-10 w-full min-h-screen ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default AuroraBackground;
