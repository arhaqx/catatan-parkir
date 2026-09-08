import React, { useEffect, useRef } from 'react';

/**
 * AnimatedCounter
 * Ultra-performant counter that updates DOM text directly via ref.
 * Eliminates virtual DOM re-renders (prevents 120fps-360fps React state thrashing on iOS).
 */
export const AnimatedCounter = ({ value, prefix = '', suffix = '', duration = 700 }) => {
  const spanRef = useRef(null);
  const currentValRef = useRef(0);

  useEffect(() => {
    const targetValue = typeof value === 'number' ? value : parseInt(value, 10) || 0;
    const startValue = currentValRef.current;

    // If values are the same, ensure direct sync
    if (startValue === targetValue) {
      if (spanRef.current) {
        spanRef.current.textContent = `${prefix}${targetValue.toLocaleString('id-ID')}${suffix}`;
      }
      return;
    }

    let startTimestamp = null;
    let animId = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Fast cubic ease-out
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (targetValue - startValue) * easeOut);
      currentValRef.current = current;

      if (spanRef.current) {
        spanRef.current.textContent = `${prefix}${current.toLocaleString('id-ID')}${suffix}`;
      }

      if (progress < 1) {
        animId = window.requestAnimationFrame(step);
      } else {
        currentValRef.current = targetValue;
        if (spanRef.current) {
          spanRef.current.textContent = `${prefix}${targetValue.toLocaleString('id-ID')}${suffix}`;
        }
      }
    };

    animId = window.requestAnimationFrame(step);
    return () => {
      if (animId) window.cancelAnimationFrame(animId);
    };
  }, [value, duration, prefix, suffix]);

  const initialTarget = typeof value === 'number' ? value : parseInt(value, 10) || 0;

  return (
    <span ref={spanRef} className="tabular-nums tracking-tight">
      {prefix}{initialTarget.toLocaleString('id-ID')}{suffix}
    </span>
  );
};

export default AnimatedCounter;

