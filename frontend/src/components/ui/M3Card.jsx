import React from 'react';

/**
 * Material 3 / Google Stitch Elevated Surface Container
 * Levels: 'low' | 'container' | 'high' | 'highest'
 */
export const M3Card = ({ 
  children, 
  level = 'container', 
  className = '', 
  hoverable = false,
  onClick
}) => {
  const levelClasses = {
    low: 'bg-m3-surface-low border-white/[0.05]',
    container: 'bg-m3-surface-container border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.35)]',
    high: 'bg-m3-surface-high border-white/[0.1] shadow-[0_8px_30px_rgba(0,0,0,0.45)]',
    highest: 'bg-m3-surface-highest border-white/[0.14] shadow-[0_12px_40px_rgba(0,0,0,0.55)]',
  };

  const hoverClass = hoverable 
    ? 'hover:border-m3-primary/30 hover:shadow-[0_8px_30px_rgba(138,180,248,0.12)] transition-all duration-200 cursor-pointer active:scale-[0.99]' 
    : 'transition-all duration-200';

  return (
    <div 
      onClick={onClick}
      className={`rounded-3xl border ${levelClasses[level] || levelClasses.container} ${hoverClass} ${className}`}
    >
      {children}
    </div>
  );
};

export default M3Card;
