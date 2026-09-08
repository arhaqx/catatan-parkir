import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Bike, LayoutDashboard } from 'lucide-react';

export const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    {
      to: '/',
      label: 'Catat Parkir',
      icon: Bike,
    },
    {
      to: '/admin',
      label: 'Dashboard Admin',
      icon: LayoutDashboard,
    }
  ];

  return (
    <nav 
      aria-label="Navigasi Bawah"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#12161c]/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-white/10 px-4 pt-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] md:hidden transform-gpu select-none shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_25px_rgba(0,0,0,0.5)] transition-colors"
    >
      <div className="max-w-md mx-auto flex items-center justify-around gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl font-semibold text-xs touch-manipulation transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'bg-blue-600 dark:bg-m3-primary text-white dark:text-slate-900 shadow-md shadow-blue-500/25 font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-white/[0.04]'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform duration-150 ${isActive ? 'scale-110' : ''}`} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

