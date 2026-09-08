import React from 'react';

/**
 * Google Stitch / Material 3 Ambient Canvas
 * High-performance hardware-accelerated ambient canvas (Pure CSS radial gradients).
 * Eliminates GPU fill-rate throttling and lag on iOS Safari / iPhone WebKit.
 */
export const AuroraBackground = ({ children, className = '' }) => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#f8f9fa] dark:bg-m3-surface text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Light Mode Ambient Glow (Zero-lag hardware accelerated gradient) */}
      <div 
        aria-hidden="true" 
        className="dark:hidden pointer-events-none fixed inset-0 z-0 opacity-70 transform-gpu"
        style={{
          backgroundImage: `
            radial-gradient(circle 500px at 50% -10%, rgba(219, 234, 254, 0.6), transparent 70%),
            radial-gradient(circle 400px at 0% 40%, rgba(224, 231, 255, 0.5), transparent 70%),
            radial-gradient(circle 450px at 100% 80%, rgba(204, 251, 241, 0.4), transparent 70%)
          `
        }}
      />

      {/* Dark Mode Ambient Glow (Zero-lag hardware accelerated gradient) */}
      <div 
        aria-hidden="true" 
        className="hidden dark:block pointer-events-none fixed inset-0 z-0 opacity-40 transform-gpu"
        style={{
          backgroundImage: `
            radial-gradient(circle 500px at 50% -10%, rgba(26, 115, 232, 0.18), transparent 70%),
            radial-gradient(circle 400px at 0% 40%, rgba(99, 102, 241, 0.14), transparent 70%),
            radial-gradient(circle 450px at 100% 80%, rgba(20, 184, 166, 0.12), transparent 70%)
          `
        }}
      />

      {/* Content wrapper */}
      <div className={`relative z-10 w-full min-h-screen ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default AuroraBackground;

