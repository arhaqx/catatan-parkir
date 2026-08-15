import React from 'react';

export const CapacityGauge = ({ 
  current = 0, 
  standardCapacity = 100, 
  maxEmergency = 130, 
  size = 126 
}) => {
  const isOverload = current > standardCapacity;
  const standardPercentage = Math.min(Math.max((current / standardCapacity) * 100, 0), 100);
  const totalPercentage = Math.round((current / standardCapacity) * 100);
  const remaining = Math.max(0, standardCapacity - current);
  const extraMotors = Math.max(0, current - standardCapacity);

  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (standardPercentage / 100) * circumference;

  // Determine styling based on standard and overload states
  let strokeColor = '#10b981'; // Green
  let badgeStyle = {
    label: `Terisi ${totalPercentage}% • Sisa ${remaining} Unit`,
    bg: 'bg-emerald-50 dark:bg-emerald-950/60',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-500/30'
  };

  if (isOverload) {
    strokeColor = '#a855f7'; // Purple Overload
    badgeStyle = {
      label: `⚠️ OVERLOAD +${extraMotors} Unit (${totalPercentage}%)`,
      bg: 'bg-purple-50 dark:bg-purple-950/70',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-300 dark:border-purple-500/40'
    };
  } else if (current === standardCapacity) {
    strokeColor = '#ef4444'; // Red (100% Full)
    badgeStyle = {
      label: `Kapasitas Standar Penuh (100%)`,
      bg: 'bg-red-50 dark:bg-red-950/60',
      text: 'text-red-700 dark:text-red-300',
      border: 'border-red-200 dark:border-red-500/30'
    };
  } else if (standardPercentage >= 70) {
    strokeColor = '#f59e0b'; // Amber
    badgeStyle = {
      label: `Kondisi Ramai (${totalPercentage}%) • Sisa ${remaining} Unit`,
      bg: 'bg-amber-50 dark:bg-amber-950/60',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-500/30'
    };
  }

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-200 dark:text-[#242a33] fill-transparent"
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
            className={`transition-all duration-500 ease-out fill-transparent ${
              isOverload ? 'drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]' : ''
            }`}
          />
        </svg>

        {/* Center Text Stats */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-3xl font-black tracking-tight leading-none ${
            isOverload ? 'text-purple-600 dark:text-purple-400' : 'text-slate-800 dark:text-white'
          }`}>
            {current}
          </span>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
            / {standardCapacity} Standar
          </span>
        </div>
      </div>

      {/* Dynamic Overload Status Chip */}
      <div className={`mt-3 px-3.5 py-1 rounded-full text-xs font-semibold border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border} flex items-center gap-1.5 shadow-xs transition-all ${
        isOverload ? 'animate-bounce-short' : ''
      }`}>
        <span className="w-2 h-2 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: strokeColor }} />
        <span>{badgeStyle.label}</span>
      </div>
    </div>
  );
};

export default CapacityGauge;
