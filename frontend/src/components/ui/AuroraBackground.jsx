import React from 'react';

export const AuroraBackground = ({ children, className = '' }) => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-950 text-slate-100">
      {/* Ambient Glowing Blobs (Fixed so they don't shift content) */}
      <div className="pointer-events-none fixed -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-600/25 via-purple-600/20 to-pink-500/15 blur-[120px]" />
      <div className="pointer-events-none fixed top-1/3 -left-40 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-blue-600/15 via-indigo-600/15 to-teal-500/10 blur-[110px]" />
      <div className="pointer-events-none fixed -bottom-20 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-purple-700/20 via-pink-600/15 to-indigo-800/15 blur-[120px]" />

      {/* Grid Pattern Overlay */}
      <div 
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Content wrapper with proper flex alignment */}
      <div className={`relative z-10 w-full min-h-screen ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default AuroraBackground;
