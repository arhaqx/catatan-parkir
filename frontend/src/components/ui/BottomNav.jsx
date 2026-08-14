import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Bike, LayoutDashboard, Sparkles, ShieldCheck } from 'lucide-react';

export const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    {
      to: '/',
      label: 'Catat Parkir',
      icon: Bike,
      badge: 'Petugas'
    },
    {
      to: '/admin',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: 'Admin'
    }
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md md:hidden">
      <div className="glass-panel rounded-full p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/15 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`relative flex items-center justify-center gap-2 py-2.5 px-5 rounded-full font-medium text-sm transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span>{item.label}</span>
              {isActive && (
                <span className="absolute -top-1 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-300"></span>
                </span>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
