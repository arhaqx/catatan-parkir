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
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-sm md:hidden">
      <div className="bg-m3-surface-high/90 backdrop-blur-xl rounded-full p-1.5 border border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.6)] flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`relative flex items-center justify-center gap-2 py-2.5 px-6 rounded-full font-semibold text-xs transition-all duration-200 ${
                isActive
                  ? 'bg-m3-primary-container text-m3-on-primary-container shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110 text-m3-primary' : 'text-slate-400'}`} />
              <span className={isActive ? 'text-white' : ''}>{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-m3-primary shrink-0" />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
