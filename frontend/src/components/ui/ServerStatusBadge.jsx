import React, { useState, useEffect } from 'react';
import { checkServerHealth } from '../../api';

export const ServerStatusBadge = ({ className = '' }) => {
  const [status, setStatus] = useState('checking'); // 'online' | 'offline' | 'checking'

  useEffect(() => {
    let isMounted = true;
    const verify = async () => {
      if (document.hidden) return;
      const res = await checkServerHealth();
      if (isMounted) {
        setStatus(res.ok ? 'online' : 'offline');
      }
    };
    verify();
    const interval = setInterval(verify, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div 
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
        status === 'online'
          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-500/20'
          : status === 'offline'
          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/20'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
      } ${className}`}
      title={status === 'online' ? 'Koneksi Backend Terhubung' : status === 'offline' ? 'Koneksi Backend Offline' : 'Memeriksa Koneksi Server...'}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
        status === 'online' ? 'bg-emerald-500' : status === 'offline' ? 'bg-rose-500' : 'bg-slate-400'
      }`} />
      <span>{status === 'online' ? 'Online' : status === 'offline' ? 'Offline' : 'Cek...'}</span>
    </div>
  );
};

export default ServerStatusBadge;
