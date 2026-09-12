import React, { useState, useEffect, useMemo } from 'react';
import { format, getDay, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { 
  Camera, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  RotateCcw, 
  Calendar as CalendarIcon, 
  FileText, 
  Trash2, 
  Bike,
  Sparkles,
  AlertTriangle,
  Zap,
  Coffee,
  Building2,
  X,
  UserCheck,
  Check,
  CircleDollarSign
} from 'lucide-react';
import { createReport, checkServerHealth } from '../api';
import { getHolidayInfo } from '../utils/indonesiaHolidays';
import M3Card from './ui/M3Card';
import CapacityGauge from './ui/CapacityGauge';
import AnimatedCounter from './ui/AnimatedCounter';
import ThemeToggle from './ui/ThemeToggle';
import ServerStatusBadge from './ui/ServerStatusBadge';

const EmployeeForm = () => {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [motorcycles, setMotorcycles] = useState(0);
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [officerType, setOfficerType] = useState('ucup'); // 'ucup' | 'other'
  const [customOfficerName, setCustomOfficerName] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking'); // 'online' | 'offline' | 'checking'

  // Live Server Health Check - Battery and CPU efficient
  useEffect(() => {
    let isMounted = true;
    const verifyServer = async () => {
      if (document.hidden) return;
      const res = await checkServerHealth();
      if (isMounted) {
        setServerStatus(res.ok ? 'online' : 'offline');
      }
    };
    verifyServer();
    const interval = setInterval(verifyServer, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const RATE_PER_MOTORCYCLE = 3000;
  const STANDARD_CAPACITY = 90; // Kapasitas normal standar
  const MAX_EMERGENCY_CAPACITY = 110; // Batas darurat maksimum
  const revenue = motorcycles * RATE_PER_MOTORCYCLE;
  const isOverload = motorcycles > STANDARD_CAPACITY;
  const extraMotors = Math.max(0, motorcycles - STANDARD_CAPACITY);

  // Analisis Tanggal Terintegrasi Kalender Indonesia (Hari Libur Nasional, Cuti Bersama, & Akhir Pekan)
  const daySchedule = useMemo(() => {
    try {
      const selectedDate = date ? parseISO(date) : new Date();
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const dayNum = getDay(selectedDate);
      const dayName = format(selectedDate, 'EEEE', { locale: id });
      const holiday = getHolidayInfo(dateStr);

      // 1. Hari Libur Nasional atau Cuti Bersama
      if (holiday) {
        const isJoint = holiday.isJointLeave || holiday.type === 'joint_leave';
        return {
          type: 'holiday',
          name: dayName,
          title: isJoint ? `Cuti Bersama: ${holiday.name}` : `Tanggal Merah: ${holiday.name}`,
          chip: isJoint ? 'Cuti Bersama' : 'Tanggal Merah',
          chipColor: isJoint
            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30'
            : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/30',
          notice: `Libur Resmi: ${holiday.name}. Jika ada lemburan shift kerja, data tetap dapat dikirim.`,
          icon: Sparkles,
          holidayName: holiday.name,
          isJoint
        };
      }

      // 2. Hari Minggu (Libur Mingguan Pabrik)
      if (dayNum === 0) {
        return {
          type: 'sunday',
          name: dayName,
          title: 'Hari Minggu • Libur Pabrik',
          chip: 'Libur Minggu',
          chipColor: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/30',
          notice: 'Pabrik libur operasional hari Minggu. Catatan tetap dapat dikirim jika ada penjagaan khusus.',
          icon: Coffee,
          holidayName: null,
          isJoint: false
        };
      } 
      
      // 3. Hari Sabtu (Shift Lembur)
      if (dayNum === 6) {
        return {
          type: 'saturday',
          name: dayName,
          title: 'Hari Sabtu • Shift Lembur',
          chip: 'Shift Lembur',
          chipColor: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/30',
          notice: 'Jadwal lemburan pabrik hari Sabtu aktif! Parkiran melayani kendaraan shift lembur.',
          icon: Zap,
          holidayName: null,
          isJoint: false
        };
      } 

      // 4. Hari Reguler (Senin - Jumat)
      return {
        type: 'weekday',
        name: dayName,
        title: `Hari ${dayName} • Reguler`,
        chip: 'Shift Reguler',
        chipColor: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/20',
        notice: null,
        icon: Building2,
        holidayName: null,
        isJoint: false
      };
    } catch {
      return {
        type: 'weekday',
        name: '',
        title: 'Shift Kerja',
        chip: 'Shift Kerja',
        chipColor: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/20',
        notice: null,
        icon: Building2,
        holidayName: null,
        isJoint: false
      };
    }
  }, [date]);

  // Auto-dismiss status message
  useEffect(() => {
    if (status.message) {
      const timer = setTimeout(() => {
        setStatus({ type: '', message: '' });
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [status.message]);

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const adjustCount = (delta) => {
    setMotorcycles((prev) => {
      const current = parseInt(prev, 10) || 0;
      return Math.max(0, Math.min(MAX_EMERGENCY_CAPACITY, current + delta));
    });
  };

  const handleSetStandard = () => setMotorcycles(STANDARD_CAPACITY);
  const handleSetEmergency = () => setMotorcycles(MAX_EMERGENCY_CAPACITY);
  const handleReset = () => setMotorcycles(0);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview('');
  };

  const triggerConfetti = async () => {
    try {
      const confetti = (await import('canvas-confetti')).default;
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#6366f1']
      });
    } catch {
      // Fallback silent
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (motorcycles <= 0) {
      setStatus({ type: 'error', message: 'Jumlah motor harus lebih dari 0!' });
      return;
    }

    let finalOfficerName = 'Ucup';
    if (officerType === 'other') {
      const trimmed = customOfficerName.trim();
      if (!trimmed) {
        setStatus({ type: 'error', message: 'Silakan isi nama penanggung jawab pengganti!' });
        return;
      }
      finalOfficerName = trimmed;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const formData = new FormData();
      formData.append('date', date);
      formData.append('total_motorcycles', motorcycles);
      formData.append('officer_name', finalOfficerName);
      if (notes.trim()) formData.append('notes', notes.trim());
      if (photo) formData.append('photo', photo);

      await createReport(formData);

      triggerConfetti();

      setStatus({ 
        type: 'success', 
        message: `Laporan berhasil tersimpan! Petugas: ${finalOfficerName} • Pemasukan: Rp ${revenue.toLocaleString('id-ID')}` 
      });
      
      setMotorcycles(0);
      setNotes('');
      setPhoto(null);
      setPhotoPreview('');
      setOfficerType('ucup');
      setCustomOfficerName('');
    } catch (error) {
      console.error(error);
      const rawErr = error.friendlyMessage || error.response?.data?.error || error.response?.data?.message || error.message;
      const errMsg = typeof rawErr === 'string' ? rawErr : (rawErr?.message || 'Gagal mengirim laporan. Periksa koneksi backend Anda.');
      setStatus({ type: 'error', message: String(errMsg) });
    } finally {
      setLoading(false);
    }
  };

  const ScheduleIcon = daySchedule.icon;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-6 pb-28 sm:pb-36">
      {/* Mobile-Only Minimal Header (< md) */}
      <div className="md:hidden flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
            <Bike className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Parkir Pabrik
            </h1>
            <span className="text-[10px] text-slate-400 dark:text-slate-400 font-medium block -mt-0.5">
              Jepara • Shift Kerja
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ServerStatusBadge />
          <ThemeToggle size="sm" />
        </div>
      </div>

      {/* Modern Responsive Grid (Desktop 2-Column, Mobile Stacked) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* RIGHT COLUMN ON DESKTOP: Live Status Panel (Rendered First on Mobile for Instant Thumb Access) */}
        <div className="lg:col-span-5 order-1 lg:order-2 space-y-4 lg:sticky lg:top-24">
          <M3Card level="container" className="p-5 sm:p-6 space-y-5">
            {/* Live Capacity Card Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                  <Bike className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Kapasitas Parkir
                </h2>
                <p className="text-[11px] text-slate-400 dark:text-slate-400 font-medium mt-0.5">
                  Batas standar 90 • Toleransi overload 110
                </p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${daySchedule.chipColor}`}>
                {daySchedule.chip}
              </span>
            </div>

            {/* Redesigned Minimalist Radial Gauge */}
            <CapacityGauge 
              current={motorcycles} 
              standardCapacity={STANDARD_CAPACITY} 
              maxEmergency={MAX_EMERGENCY_CAPACITY} 
              size={136} 
            />

            {/* Overload Alert Warning */}
            {isOverload && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <div className="leading-snug">
                  <strong className="block font-bold">Kondisi Overload (+{extraMotors} Motor)</strong>
                  <span className="text-[11px] text-amber-700/90 dark:text-amber-300/90">
                    Melebihi kapasitas standar 90. Pastikan foto penataan parkir terlampir rapi ya!
                  </span>
                </div>
              </div>
            )}

            {/* Unified Quick Stepper Controls */}
            <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-white/[0.06]">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-0.5">
                <span>Penyesuaian Cepat</span>
                <span>Klik untuk tambah / kurang</span>
              </div>

              {/* 5 Neutral Segmented Stepper Buttons */}
              <div className="grid grid-cols-5 gap-1.5">
                <button
                  type="button"
                  onClick={() => adjustCount(-10)}
                  className="py-2 rounded-lg bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] active:scale-95 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-white/[0.06] transition-all cursor-pointer"
                >
                  -10
                </button>
                <button
                  type="button"
                  onClick={() => adjustCount(-1)}
                  className="py-2 rounded-lg bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] active:scale-95 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-white/[0.06] transition-all cursor-pointer"
                >
                  -1
                </button>
                <button
                  type="button"
                  onClick={() => adjustCount(1)}
                  className="py-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 active:scale-95 text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-500/20 transition-all cursor-pointer"
                >
                  +1
                </button>
                <button
                  type="button"
                  onClick={() => adjustCount(5)}
                  className="py-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 active:scale-95 text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-500/20 transition-all cursor-pointer"
                >
                  +5
                </button>
                <button
                  type="button"
                  onClick={() => adjustCount(10)}
                  className="py-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 text-xs font-bold text-white shadow-2xs transition-all cursor-pointer"
                >
                  +10
                </button>
              </div>

              {/* Direct Manual Number Input & Reset Button */}
              <div className="flex items-center gap-2 pt-1">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="0"
                    max={MAX_EMERGENCY_CAPACITY}
                    value={motorcycles === 0 ? '' : motorcycles}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                      setMotorcycles(isNaN(val) ? 0 : Math.max(0, Math.min(MAX_EMERGENCY_CAPACITY, val)));
                    }}
                    placeholder="0"
                    className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-center text-lg font-bold font-mono text-slate-900 dark:text-white rounded-xl py-2 px-3 pr-12 transition-all outline-none"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none">
                    Unit
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-300 text-slate-400 border border-slate-200/60 dark:border-white/[0.06] active:scale-95 transition-all cursor-pointer"
                  title="Reset ke 0"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Presets: Standar (90) & Overload (110) */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSetStandard}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98 ${
                    motorcycles === STANDARD_CAPACITY
                      ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-400 text-blue-700 dark:text-blue-300 font-bold'
                      : 'bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.06] border-slate-200 dark:border-white/[0.06] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Standar (90)</span>
                </button>

                <button
                  type="button"
                  onClick={handleSetEmergency}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98 ${
                    motorcycles === MAX_EMERGENCY_CAPACITY
                      ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-400 text-amber-800 dark:text-amber-300 font-bold'
                      : 'bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.06] border-slate-200 dark:border-white/[0.06] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Overload (110)</span>
                </button>
              </div>
            </div>

            {/* Clean Financial Revenue Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-900 dark:bg-[#121926] text-white border border-slate-800 dark:border-white/10 shadow-sm">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <CircleDollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  Estimasi Pemasukan
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Rp 3.000 / unit
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">
                  <AnimatedCounter value={revenue} prefix="Rp " />
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  {motorcycles} motor {isOverload && `(+${extraMotors})`}
                </span>
              </div>
            </div>
          </M3Card>
        </div>

        {/* LEFT COLUMN ON DESKTOP: Form Controls Card */}
        <div className="lg:col-span-7 order-2 lg:order-1 space-y-4">
          <M3Card level="container" className="p-5 sm:p-7">
            {/* Card Header */}
            <div className="mb-5 pb-4 border-b border-slate-100 dark:border-white/[0.06]">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Catat Laporan Parkir
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Lengkapi rincian tanggal, penanggung jawab, dan dokumentasi lapangan.
              </p>
            </div>

            {/* Status Alert Toast */}
            {status.message && (
              <div 
                className={`mb-4 p-3.5 rounded-xl flex items-center gap-2.5 transition-all relative ${
                  status.type === 'success' 
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-500/30 shadow-2xs' 
                    : 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-500/30 shadow-2xs'
                }`}
              >
                {status.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                )}
                <p className="text-xs font-medium flex-1 pr-6">{status.message}</p>
                <button
                  type="button"
                  onClick={() => setStatus({ type: '', message: '' })}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  title="Tutup"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Server Offline Warning Banner */}
            {serverStatus === 'offline' && !status.message && (
              <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-500/30 text-xs flex items-start gap-2.5 shadow-2xs">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <div className="flex-1 leading-relaxed">
                  <strong className="block font-bold">Koneksi Backend Terputus (502)</strong>
                  <span>
                    Server backend belum terhubung. Pastikan service PM2 atau VM backend aktif.
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Field 1: Tanggal & Jadwal Shift */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Tanggal Laporan</span>
                  </label>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border truncate max-w-[240px] sm:max-w-none ${daySchedule.chipColor} flex items-center gap-1`}>
                    <ScheduleIcon className="w-3 h-3 shrink-0" />
                    <span className="truncate">{daySchedule.title}</span>
                  </span>
                </div>
                
                <div className={`relative w-full rounded-xl border bg-white dark:bg-white/[0.03] overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all flex items-center ${
                  daySchedule.type === 'holiday' 
                    ? 'border-rose-300 dark:border-rose-500/40 bg-rose-50/20 dark:bg-rose-950/10' 
                    : daySchedule.type === 'sunday'
                    ? 'border-red-200 dark:border-red-500/30'
                    : 'border-slate-200 dark:border-white/10'
                }`}>
                  <CalendarIcon className={`w-4 h-4 ml-3.5 shrink-0 pointer-events-none ${
                    daySchedule.type === 'holiday' || daySchedule.type === 'sunday'
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-blue-600 dark:text-blue-400'
                  }`} />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                    required
                  />
                </div>

                {/* Holiday / Saturday Notice */}
                {daySchedule.notice && (
                  <p className={`text-[11px] font-medium px-3 py-2 rounded-xl border mt-1 flex items-start gap-1.5 leading-relaxed ${
                    daySchedule.type === 'holiday'
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/20'
                      : daySchedule.type === 'sunday' 
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/20'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/20'
                  }`}>
                    <ScheduleIcon className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{daySchedule.notice}</span>
                  </p>
                )}
              </div>

              {/* Field 2: Penanggung Jawab Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Penanggung Jawab Shift</span>
                  </label>
                  <span className="text-[10px] text-slate-400 dark:text-slate-400 font-medium">Petugas Parkir</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {/* Option 1: Ucup */}
                  <label
                    htmlFor="officer-ucup"
                    className={`relative flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      officerType === 'ucup'
                        ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100 shadow-2xs'
                        : 'border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.04] text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      id="officer-ucup"
                      name="officer"
                      value="ucup"
                      checked={officerType === 'ucup'}
                      onChange={() => setOfficerType('ucup')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 cursor-pointer accent-blue-600"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs sm:text-sm font-bold truncate">Ucup</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-400">Petugas Utama</span>
                    </div>
                  </label>

                  {/* Option 2: Lainnya */}
                  <label
                    htmlFor="officer-other"
                    className={`relative flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      officerType === 'other'
                        ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100 shadow-2xs'
                        : 'border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.04] text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      id="officer-other"
                      name="officer"
                      value="other"
                      checked={officerType === 'other'}
                      onChange={() => setOfficerType('other')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 cursor-pointer accent-blue-600"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs sm:text-sm font-bold truncate">Lainnya</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-400">Pengganti / Kakak</span>
                    </div>
                  </label>
                </div>

                {/* Input teks jika 'Lainnya' dipilih */}
                {officerType === 'other' && (
                  <div className="pt-1 transition-all">
                    <input
                      type="text"
                      value={customOfficerName}
                      onChange={(e) => setCustomOfficerName(e.target.value)}
                      placeholder="Nama penanggung jawab pengganti (cth: Kakak Ucup)..."
                      className="w-full bg-slate-50 dark:bg-white/[0.04] border border-blue-400 dark:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white outline-none"
                      autoFocus
                      required
                    />
                  </div>
                )}
              </div>

              {/* Field 3: Foto Bukti Lapangan */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Foto Bukti Lapangan</span>
                  </label>
                  <span className="text-[10px] text-slate-400 dark:text-slate-400 font-medium">
                    {isOverload ? '(Dianjurkan saat Overload)' : '(Opsional)'}
                  </span>
                </div>

                {photoPreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-blue-400/40 dark:border-blue-500/40 bg-slate-100 dark:bg-white/[0.02] group">
                    <img 
                      src={photoPreview} 
                      alt="Bukti Lapangan" 
                      className="w-full h-44 object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <label 
                        htmlFor="photo-upload-change"
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                      >
                        <Camera className="w-3.5 h-3.5" /> Ganti
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoChange}
                        className="hidden"
                        id="photo-upload-change"
                      />
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoChange}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className={`w-full flex flex-col items-center justify-center h-28 border-2 border-dashed rounded-xl cursor-pointer transition-all group px-3 text-center ${
                        isOverload 
                          ? 'border-amber-300 dark:border-amber-500/40 bg-amber-50/30 dark:bg-amber-950/10 hover:bg-amber-50/60' 
                          : 'border-slate-200 dark:border-white/10 hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-white/[0.02] bg-slate-50/40 dark:bg-white/[0.01]'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/[0.06] group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-center transition-colors mb-1.5">
                        <Camera className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        Ambil Foto atau Pilih Gambar
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-400 mt-0.5">
                        Format JPG, PNG, atau WEBP (Maks 10MB)
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* Field 4: Catatan Lapangan */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Catatan Tambahan</span>
                  </label>
                  <span className="text-[10px] text-slate-400 dark:text-slate-400 font-medium">(Opsional)</span>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Catatan kondisi lapangan atau informasi penting..."
                  rows="2"
                  className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none outline-none transition-all"
                />
              </div>

              {/* Submit Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan Laporan...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Kirim Laporan Parkir</span>
                  </>
                )}
              </button>
            </form>
          </M3Card>
        </div>

      </div>
    </div>
  );
};

export default EmployeeForm;
