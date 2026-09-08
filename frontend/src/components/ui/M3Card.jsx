import React from 'react';

/**
 * Material 3 / Google Stitch Elevated Surface Container
 * Levels: 'low' | 'container' | 'high' | 'highest'
 * Adaptive to Light and Dark modes
 */
export const M3Card = ({ 
  children, 
  level = 'container', 
  className = '', 
  hoverable = false,
  onClick
}) => {
  const levelClasses = {
    low: 'bg-[#f1f3f4] dark:bg-m3-surface-low border-black/[0.05] dark:border-white/[0.05]',
    container: 'bg-white dark:bg-m3-surface-container border-black/[0.08] dark:border-white/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)]',
    high: 'bg-[#e8eaed] dark:bg-m3-surface-high border-black/[0.08] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.45)]',
    highest: 'bg-[#dadce0] dark:bg-m3-surface-highest border-black/[0.1] dark:border-white/[0.14] shadow-[0_6px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.55)]',
  };

  const hoverClass = hoverable 
    ? 'hover:border-blue-500/40 dark:hover:border-m3-primary/30 transition-all duration-200 cursor-pointer active:scale-[0.99]' 
    : 'transition-all duration-200';

  return (
    <div 
      onClick={onClick}
      className={`rounded-3xl border overflow-hidden ${levelClasses[level] || levelClasses.container} ${hoverClass} ${className}`}
    >
      {children}
    </div>
  );
};

export default M3Card;
