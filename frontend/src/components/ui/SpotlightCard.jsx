import React, { useRef, useState } from 'react';

export const SpotlightCard = ({ 
  children, 
  className = '', 
  spotlightColor = 'rgba(99, 102, 241, 0.25)',
  borderColor = 'rgba(255, 255, 255, 0.12)'
}) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-3xl bg-slate-900/90 backdrop-blur-2xl border transition-all duration-300 ${className}`}
      style={{ borderColor }}
    >
      {/* Radial spotlight follower */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};

export default SpotlightCard;
