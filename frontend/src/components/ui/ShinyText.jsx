import React from 'react';

export const ShinyText = ({ text, disabled = false, speed = 4, className = '' }) => {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`relative inline-block bg-[linear-gradient(110deg,#93c5fd,45%,#ffffff,55%,#93c5fd)] bg-[length:250%_100%] bg-clip-text text-transparent ${
        disabled ? '' : 'animate-shimmer'
      } ${className}`}
      style={{
        animationDuration: animationDuration,
      }}
    >
      {text}
    </span>
  );
};

export default ShinyText;
