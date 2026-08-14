import React from 'react';

export const CapacityGauge = ({ current = 0, max = 100, size = 120 }) => {
  const percentage = Math.min(Math.max((current / max) * 100, 0), 100);
  const remaining = Math.max(0, max - current);
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Determine status color based on percentage
  let statusColor = '#10b981'; // Green (Safe)
  let statusBadge = { 
    label: `Terisi ${Math.round(percentage)}% (Sisa ${remaining})`, 
    bg: 'bg-emerald-500/20', 
    text: 'text-emerald-300', 
    border: 'border-emerald-500/30' 
  };
  
  if (percentage >= 90) {
    statusColor = '#ef4444'; // Red (Full)
    statusBadge = { 
      label: `Hampir Penuh (${Math.round(percentage)}%)`, 
      bg: 'bg-red-500/20', 
      text: 'text-red-300', 
      border: 'border-red-500/30' 
    };
  } else if (percentage >= 70) {
    statusColor = '#f59e0b'; // Amber (Busy)
    statusBadge = { 
      label: `Ramai (${Math.round(percentage)}%)`, 
      bg: 'bg-amber-500/20', 
      text: 'text-amber-300', 
      border: 'border-amber-500/30' 
    };
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-800/80 fill-transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={statusColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out fill-transparent drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
          />
        </svg>

        {/* Center count display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
          <span className="text-3xl font-black text-white tracking-tight leading-none">
            {current}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
            / {max} Motor
          </span>
        </div>
      </div>

      <div className={`mt-2.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border} flex items-center gap-1.5 shadow-sm`}>
        <span className="w-2 h-2 rounded-full animate-pulse shrink-0" style={{ backgroundColor: statusColor }} />
        <span>{statusBadge.label}</span>
      </div>
    </div>
  );
};

export default CapacityGauge;
