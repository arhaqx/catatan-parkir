import React, { useEffect, useState } from 'react';

export const AnimatedCounter = ({ value, prefix = '', suffix = '', duration = 800 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const startValue = displayValue;
    const targetValue = typeof value === 'number' ? value : parseInt(value, 10) || 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (targetValue - startValue) * easeOut);
      
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  return (
    <span className="tabular-nums tracking-tight">
      {prefix}{displayValue.toLocaleString('id-ID')}{suffix}
    </span>
  );
};

export default AnimatedCounter;
