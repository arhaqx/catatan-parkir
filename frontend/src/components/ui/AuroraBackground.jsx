import React from 'react';

/**
 * Google Stitch / Material 3 Ambient Canvas
 * Subtle, high-contrast, clean dark surface with gentle ambient gradient glows
 */
export const AuroraBackground = ({ children, className = '' }) => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-m3-surface text-slate-100 selection:bg-m3-primary selection:text-m3-on-primary">
      {/* Subtle Google Stitch Ambient Tonal Blobs */}
      <div className="pointer-events-none fixed -top-32 left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-blue-600/15 via-indigo-600/10 to-teal-500/10 blur-[130px]" />
      <div className="pointer-events-none fixed top-1/2 -left-32 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-indigo-700/10 via-purple-600/10 to-transparent blur-[120px]" />
      <div className="pointer-events-none fixed -bottom-32 -right-32 h-[450px] w-[450px] rounded-full bg-gradient-to-tl from-teal-600/10 via-blue-700/10 to-transparent blur-[130px]" />

      {/* Grid Texture */}
      <div 
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Content wrapper with flex layout */}
      <div className={`relative z-10 w-full min-h-screen ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default AuroraBackground;
