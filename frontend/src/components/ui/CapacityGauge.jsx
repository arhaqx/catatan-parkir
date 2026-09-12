import React from 'react';

/**
 * CapacityGauge - Professional Minimalist Radial Capacity Meter
 * Inspired by Linear / Apple Health metrics design.
 * Features non-alarmist color progression, refined 6-7px stroke, and clean typography.
 */
export const CapacityGauge = ({ 
  current = 0, 
  standardCapacity = 90, 
  maxEmergency = 110, 
  size = 138,
  showBadge = true
}) => {
  const isOverload = current > standardCapacity;
  const isFull = current === standardCapacity;
  const standardPercentage = Math.min(Math.max((current / standardCapacity) * 100, 0), 100);
  const totalPercentage = Math.round((current / standardCapacity) * 100);
  const remaining = Math.max(0, standardCapacity - current);
  const extraMotors = Math.max(0, current - standardCapacity);
  const isSmall = size < 115;

  const strokeWidth = isSmall ? 6 : 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (standardPercentage / 100) * circumference;

  // Refined color system (Linear / Stripe aesthetic)
  let strokeColor = '#3b82f6'; // Modern Blue
  let badgeConfig = {
    label: current === 0 ? 'Area Kosong' : `Terisi ${totalPercentage}% • Sisa ${remaining}`,
    bg: 'bg-slate-100 dark:bg-slate-800/80',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-white/10',
    dot: 'bg-slate-400 dark:bg-slate-500'
  };

  if (isOverload) {
    strokeColor = '#f59e0b'; // Refined Amber Warning
    badgeConfig = {
      label: `Overload +${extraMotors} (${totalPercentage}%)`,
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-800 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-500/30',
      dot: 'bg-amber-500'
    };
  } else if (isFull) {
    strokeColor = '#10b981'; // Emerald (Full Capacity reached normally)
    badgeConfig = {
      label: `Penuh (90/90 Unit)`,
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-800 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-500/30',
      dot: 'bg-emerald-500'
    };
  } else if (standardPercentage >= 70) {
    strokeColor = '#2563eb'; // Deep Blue
    badgeConfig = {
      label: `Hampir Penuh (${totalPercentage}%)`,
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      text: 'text-blue-800 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-500/30',
      dot: 'bg-blue-500'
    };
  } else if (current > 0) {
    strokeColor = '#3b82f6'; // Electric Blue
    badgeConfig = {
      label: `Terisi ${totalPercentage}% • Sisa ${remaining}`,
      bg: 'bg-blue-50/70 dark:bg-blue-950/30',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200/80 dark:border-blue-500/20',
      dot: 'bg-blue-500'
    };
  }

  return (
    <div className="flex flex-col items-center justify-center select-none py-0.5">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-white/[0.08] fill-transparent"
          />
          {/* Active Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-out fill-transparent"
          />
        </svg>

        {/* Center Typography */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-bold tracking-tight text-slate-900 dark:text-white leading-none font-mono ${
            isSmall ? 'text-2xl' : 'text-3.5xl sm:text-4xl'
          }`}>
            {current}
          </span>
          <span className={`font-medium text-slate-400 dark:text-slate-400 ${
            isSmall ? 'text-[9px] mt-0.5' : 'text-[11px] mt-1'
          }`}>
            {isSmall ? `/ ${standardCapacity}` : `dari ${standardCapacity} unit`}
          </span>
        </div>
      </div>

      {/* Optional Status Badge */}
      {showBadge && (
        <div className={`rounded-full font-medium border flex items-center gap-1.5 shadow-2xs transition-all ${
          isSmall 
            ? 'mt-1.5 px-2 py-0.5 text-[10px]' 
            : 'mt-2.5 px-3 py-1 text-xs'
        } ${badgeConfig.bg} ${badgeConfig.text} ${badgeConfig.border}`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${badgeConfig.dot}`} />
          <span className="truncate max-w-[180px]">{badgeConfig.label}</span>
        </div>
      )}
    </div>
  );
};

export default CapacityGauge;
