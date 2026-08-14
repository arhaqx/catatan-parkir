import React from 'react';

export const CapacityGauge = ({ current = 0, max = 100, size = 120 }) => {
  const percentage = Math.min(Math.max((current / max) * 100, 0), 100);
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Determine color based on percentage
  let statusColor = '#10b981'; // Green (Safe)
  let statusBadge = { label: 'Tersedia', bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' };
  
  if (percentage >= 90) {
    statusColor = '#ef4444'; // Red (Full)
    statusBadge = { label: 'Hampir Penuh', bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' };
  } else if (percentage >= 70) {
    statusColor = '#f59e0b'; // Amber (Busy)
    statusBadge = { label: 'Ramai', bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' };
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
            className="transition-all duration-700 ease-out fill-transparent drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black text-white tracking-tight">
            {current}
          </span>
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            / {max} Motor
          </span>
        </div>
      </div>

      <div className={`mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border} flex items-center gap-1.5`}>
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: statusColor }} />
        {statusBadge.label} ({Math.round(percentage)}%)
      </div>
    </div>
  );
};

export default CapacityGauge;
