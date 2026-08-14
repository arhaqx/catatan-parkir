import React from 'react';

export const AuroraBackground = ({ children, className = '' }) => {
  return (
    <div className={`relative min-h-screen w-full overflow-hidden bg-slate-950 text-slate-100 ${className}`}>
      {/* Aurora Ambient Glowing Blobs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-600/30 via-purple-600/25 to-pink-500/20 blur-[130px] animate-pulse-slow" />
      <div className="pointer-events-none absolute top-1/3 -left-40 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-teal-500/15 blur-[120px] animate-float" />
      <div className="pointer-events-none absolute -bottom-20 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-purple-700/25 via-pink-600/20 to-indigo-800/20 blur-[140px] animate-pulse-slow" />

      {/* Grid Pattern Overlay */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Content wrapper */}
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default AuroraBackground;
