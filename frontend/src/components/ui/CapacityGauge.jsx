import React from 'react';

export const CapacityGauge = ({ current = 0, max = 100, size = 124 }) => {
  const percentage = Math.min(Math.max((current / max) * 100, 0), 100);
  const remaining = Math.max(0, max - current);
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Material 3 Tonal Color Mapping
  let strokeColor = '#6dd58c'; // M3 Tertiary / Mint
  let badgeStyle = {
    label: `Terisi ${Math.round(percentage)}% • Sisa ${remaining} Unit`,
    bg: 'bg-emerald-950/60',
    text: 'text-emerald-300',
    border: 'border-emerald-500/30'
  };

  if (percentage >= 90) {
    strokeColor = '#f28b82'; // M3 Error / Coral Red
    badgeStyle = {
      label: `Hampir Penuh (${Math.round(percentage)}%) • Sisa ${remaining} Unit`,
      bg: 'bg-red-950/60',
      text: 'text-red-300',
      border: 'border-red-500/30'
    };
  } else if (percentage >= 70) {
    strokeColor = '#fbbc04'; // M3 Warning / Amber
    badgeStyle = {
      label: `Kondisi Ramai (${Math.round(percentage)}%) • Sisa ${remaining} Unit`,
      bg: 'bg-amber-950/60',
      text: 'text-amber-300',
      border: 'border-amber-500/30'
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
            stroke="#242a33"
            strokeWidth={strokeWidth}
            className="fill-transparent"
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
            className="transition-all duration-500 ease-out fill-transparent"
          />
        </svg>

        {/* Center Text Stats */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-black text-white tracking-tight leading-none">
            {current}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
            / {max} Motor
          </span>
        </div>
      </div>

      {/* Material 3 Status Chip */}
      <div className={`mt-3 px-3 py-1 rounded-full text-xs font-medium border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border} flex items-center gap-1.5 shadow-sm`}>
        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: strokeColor }} />
        <span>{badgeStyle.label}</span>
      </div>
    </div>
  );
};

export default CapacityGauge;
