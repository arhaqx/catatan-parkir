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
  UserCheck
} from 'lucide-react';
import { createReport, checkServerHealth } from '../api';
import M3Card from './ui/M3Card';
import CapacityGauge from './ui/CapacityGauge';
import AnimatedCounter from './ui/AnimatedCounter';
import ThemeToggle from './ui/ThemeToggle';

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

  // Live Server Health Check - Battery and CPU efficient (skips when tab is inactive)
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
    const interval = setInterval(verifyServer, 25000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const RATE_PER_MOTORCYCLE = 3000;
  const STANDARD_CAPACITY = 90; // Kapasitas normal
  const MAX_EMERGENCY_CAPACITY = 110; // Batas darurat maksimum
  const revenue = motorcycles * RATE_PER_MOTORCYCLE;
  const isOverload = motorcycles > STANDARD_CAPACITY;
  const extraMotors = Math.max(0, motorcycles - STANDARD_CAPACITY);

  // Day of Week Analysis (0 = Minggu/Libur, 6 = Sabtu/Lembur, 1-5 = Senin-Jumat/Reguler)
  const daySchedule = useMemo(() => {
    try {
      // Safe parsing for cross-platform (iOS Safari & Android)
      const selectedDate = date ? parseISO(date) : new Date();
      const dayNum = getDay(selectedDate);
      const dayName = format(selectedDate, 'EEEE', { locale: id });

      if (dayNum === 0) {
        return {
          type: 'sunday',
          name: dayName,
          title: 'Hari Minggu • Libur Pabrik',
          chip: 'Libur Minggu',
          chipColor: 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/30',
          notice: 'Pabrik libur operasional hari Minggu. Jika ada lemburan shift khusus, catatan tetap bisa dikirim.',
          icon: Coffee
        };
      } else if (dayNum === 6) {
        return {
          type: 'saturday',
          name: dayName,
          title: 'Hari Sabtu • Shift Lembur',
          chip: 'Shift Lembur',
          chipColor: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/40',
          notice: 'Jadwal lemburan pabrik hari Sabtu aktif! Parkiran melayani kendaraan shift lembur.',
          icon: Zap
        };
      } else {
        return {
          type: 'weekday',
          name: dayName,
          title: `Hari ${dayName} • Reguler`,
          chip: 'Shift Reguler',
          chipColor: 'bg-blue-100 dark:bg-m3-primary-container/60 text-blue-800 dark:text-m3-primary border-blue-200 dark:border-m3-primary/30',
          notice: null,
          icon: Building2
        };
      }
    } catch {
      return {
        type: 'weekday',
        name: '',
        title: 'Shift Kerja',
        chip: 'Shift Kerja',
        chipColor: 'bg-blue-100 dark:bg-m3-primary-container/60 text-blue-800 dark:text-m3-primary border-blue-200 dark:border-m3-primary/30',
        notice: null,
        icon: Building2
      };
    }
  }, [date]);

  // Auto-dismiss status message after 6 seconds
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

  // Adjust count helpers for fast thumb operation on mobile
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
        origin: { y: 0.7 },
        colors: ['#8ab4f8', '#6dd58c', '#c2e7ff', '#fbbc04', '#a855f7'],
      });
    } catch (err) {
      console.log('Confetti effect:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!motorcycles || motorcycles <= 0) {
      setStatus({ type: 'error', message: 'Silakan isi jumlah motor terlebih dahulu (harus lebih dari 0)!' });
      return;
    }

    if (motorcycles > MAX_EMERGENCY_CAPACITY) {
      setStatus({ type: 'error', message: `Batas darurat maksimal adalah ${MAX_EMERGENCY_CAPACITY} motor!` });
      return;
    }

    if (officerType === 'other' && !customOfficerName.trim()) {
      setStatus({ type: 'error', message: 'Silakan isi nama penanggung jawab pengganti!' });
      return;
    }

    const assignedOfficer = officerType === 'ucup' ? 'Ucup' : (customOfficerName.trim() || 'Lainnya');

    setLoading(true);

    const formData = new FormData();
    formData.append('date', date);
    formData.append('total_motorcycles', motorcycles);
    formData.append('notes', notes);
    formData.append('officer_name', assignedOfficer);
    if (photo) {
      formData.append('photo', photo);
    }

    try {
      await createReport(formData);
      const formattedDate = format(parseISO(date), 'dd MMM yyyy');
      setStatus({ 
        type: 'success', 
        message: `Laporan ${daySchedule.name} (${formattedDate}) oleh ${assignedOfficer} - ${motorcycles} motor berhasil tersimpan!` 
      });
      triggerConfetti();
      
      // Reset form fields
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
    <div className="flex flex-col items-center justify-start pb-32 sm:pb-36 pt-2 sm:pt-4 px-3 sm:px-6 w-full max-w-lg mx-auto">
      {/* Top Google Stitch App Bar (Mobile & iPhone Optimized) */}
      <div className="w-full max-w-lg mb-3 flex items-center justify-between gap-2 px-0.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_4px_14px_rgba(26,115,232,0.3)] shrink-0">
            <Bike className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight truncate">
              Parkir Pabrik
            </h1>
            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
              Jepara • Shift Kerja
            </p>
          </div>
        </div>

        {/* Status Chip & Theme Switcher */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-2xs transition-all ${
            serverStatus === 'online'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
              : serverStatus === 'offline'
              ? 'bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300'
              : 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300'
          }`}>
            <span className={`w-2 h-2 rounded-full shrink-0 ${
              serverStatus === 'online'
                ? 'bg-emerald-500 animate-pulse'
                : serverStatus === 'offline'
                ? 'bg-red-500'
                : 'bg-amber-500 animate-pulse'
            }`} />
            <span className="font-semibold text-[10px] sm:text-[11px]">
              {serverStatus === 'online' ? 'Online' : serverStatus === 'offline' ? 'Offline' : 'Cek...'}
            </span>
          </div>

          <ThemeToggle size="sm" />
        </div>
      </div>

      {/* Main Google Stitch Surface Container */}
      <M3Card level="container" className="w-full max-w-lg p-4 sm:p-7">
        {/* Title Header */}
        <div className="text-center mb-5 sm:mb-6">
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Catat Jumlah Motor
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5 sm:mt-1">
            Standar 90 unit • Toleransi overload 110 unit
          </p>
        </div>

        {/* Status Toast Alert */}
        {status.message && (
          <div 
            className={`mb-4 sm:mb-5 p-3 sm:p-3.5 rounded-2xl flex items-center gap-2.5 sm:gap-3 transition-all relative ${
              status.type === 'success' 
                ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-500/40 shadow-xs' 
                : 'bg-red-50 dark:bg-red-950/80 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-500/40 shadow-xs'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-emerald-600 dark:text-m3-tertiary" />
            ) : (
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-red-600 dark:text-m3-error" />
            )}
            <p className="text-xs sm:text-sm font-medium flex-1 pr-6">{status.message}</p>
            <button
              type="button"
              onClick={() => setStatus({ type: '', message: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Server Offline Warning Banner */}
        {serverStatus === 'offline' && !status.message && (
          <div className="mb-4 sm:mb-5 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-500/40 text-xs flex items-start gap-2.5 shadow-xs">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div className="flex-1">
              <strong className="block font-bold">Koneksi Backend Belum Terhubung (502)</strong>
              <span>
                Server backend Azure belum aktif atau tidak merespons di port 3001. Silakan cek VM Azure Anda.
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Tanggal Input & Dynamic Day Schedule Badge */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2 ml-0.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shrink-0">
                <CalendarIcon className="w-3.5 h-3.5 text-blue-600 dark:text-m3-primary" />
                <span>Tanggal</span>
              </label>
              <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-lg border truncate max-w-[200px] sm:max-w-none ${daySchedule.chipColor} flex items-center gap-1`}>
                <ScheduleIcon className="w-3 h-3 shrink-0" />
                <span className="truncate">{daySchedule.title}</span>
              </span>
            </div>
            
            <div className="relative w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-m3-surface-low overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500 transition-all flex items-center">
              <CalendarIcon className="w-4 h-4 text-blue-600 dark:text-m3-primary ml-3.5 shrink-0 pointer-events-none" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full min-w-0 max-w-full bg-transparent px-3 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none block cursor-pointer"
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  minWidth: 0,
                  maxWidth: '100%',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            {/* Sunday / Saturday Special Notice */}
            {daySchedule.notice && (
              <p className={`text-[10px] sm:text-[11px] font-medium px-2.5 sm:px-3 py-1.5 rounded-xl border mt-1 flex items-start gap-1.5 ${
                daySchedule.type === 'sunday' 
                  ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/30'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/30'
              }`}>
                <ScheduleIcon className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{daySchedule.notice}</span>
              </p>
            )}
          </div>

          {/* Interactive Capacity Gauge & Quick Steppers */}
          <div className="p-3 sm:p-4 rounded-3xl bg-[#f1f3f4] dark:bg-m3-surface-low border border-slate-200/80 dark:border-white/[0.06] flex flex-col items-center gap-3.5 sm:gap-4">
            <CapacityGauge current={motorcycles} standardCapacity={STANDARD_CAPACITY} maxEmergency={MAX_EMERGENCY_CAPACITY} size={122} />

            {/* Overload Notice Banner */}
            {isOverload && (
              <div className="w-full p-2.5 rounded-2xl bg-purple-100 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-500/40 text-purple-800 dark:text-purple-200 text-xs flex items-start gap-2 animate-bounce-short">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-purple-600 dark:text-purple-400" />
                <span>
                  <strong>Kondisi Overload (+{extraMotors} Motor):</strong> Melebihi kapasitas standar 90. Pastikan foto penataan parkir terlampir rapi ya!
                </span>
              </div>
            )}

            {/* Quick Step Buttons */}
            <div className="w-full flex flex-col gap-2">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 text-center uppercase tracking-wider">
                Tombol Cepat Petugas
              </span>

              {/* 5 Stepper Buttons (Responsive Grid) */}
              <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
                <button
                  type="button"
                  onClick={() => adjustCount(-10)}
                  className="py-2.5 rounded-xl m3-button-tonal text-xs font-bold active:scale-95 transition-transform"
                >
                  -10
                </button>
                <button
                  type="button"
                  onClick={() => adjustCount(-1)}
                  className="py-2.5 rounded-xl m3-button-tonal text-xs font-bold active:scale-95 transition-transform"
                >
                  -1
                </button>
                <button
                  type="button"
                  onClick={() => adjustCount(1)}
                  className="py-2.5 rounded-xl bg-blue-100 hover:bg-blue-200 dark:bg-m3-primary-container/80 dark:hover:bg-m3-primary-container active:scale-95 text-blue-800 dark:text-m3-on-primary-container text-xs font-bold transition-all border border-blue-300 dark:border-m3-primary/30"
                >
                  +1
                </button>
                <button
                  type="button"
                  onClick={() => adjustCount(5)}
                  className="py-2.5 rounded-xl bg-blue-100 hover:bg-blue-200 dark:bg-m3-primary-container/80 dark:hover:bg-m3-primary-container active:scale-95 text-blue-800 dark:text-m3-on-primary-container text-xs font-bold transition-all border border-blue-300 dark:border-m3-primary/30"
                >
                  +5
                </button>
                <button
                  type="button"
                  onClick={() => adjustCount(10)}
                  className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold transition-all shadow-xs"
                >
                  +10
                </button>
              </div>

              {/* Row 1: Direct Manual Input & Reset Button */}
              <div className="flex items-center gap-2 mt-1">
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
                    className="w-full m3-input text-center text-lg sm:text-xl font-bold rounded-xl py-2 px-3 pr-12"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none">
                    Unit
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="p-2.5 rounded-xl m3-button-tonal hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-500/20 dark:hover:text-red-400 text-slate-400 text-xs font-bold shrink-0 active:scale-95 transition-all"
                  title="Reset ke 0"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Row 2: Two Full-Width Preset Buttons (Never Overflow on iPhone) */}
              <div className="grid grid-cols-2 gap-2 mt-0.5">
                <button
                  type="button"
                  onClick={handleSetStandard}
                  className="py-2.5 px-3 rounded-xl m3-button-tonal text-xs font-bold text-center active:scale-95 transition-all shadow-2xs"
                  title="Isi 90 Motor (Standar Penuh)"
                >
                  Standar (90)
                </button>

                <button
                  type="button"
                  onClick={handleSetEmergency}
                  className="py-2.5 px-3 rounded-xl bg-purple-100 dark:bg-purple-950/70 hover:bg-purple-200 dark:hover:bg-purple-900/70 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/40 text-xs font-bold text-center active:scale-95 transition-all shadow-2xs"
                  title="Isi 110 Motor (Kapasitas Overload Maksimal)"
                >
                  Overload (110)
                </button>
              </div>
            </div>
          </div>

          {/* Revenue Highlight Card */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 dark:from-[#0d2a4a] dark:via-[#112338] dark:to-[#15191f] text-white border border-blue-500/30 flex justify-between items-center gap-2 shadow-md">
            <div className="min-w-0">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-blue-200 dark:text-m3-primary block truncate">
                Total Pemasukan ({daySchedule.chip})
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-300 dark:text-slate-400 font-medium block truncate">
                Rp 3.000 × {motorcycles} motor {isOverload && `(+${extraMotors})`}
              </span>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
                <AnimatedCounter value={revenue} prefix="Rp " />
              </span>
            </div>
          </div>

          {/* Photo Upload Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-0.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-blue-600 dark:text-m3-primary" />
                <span>Foto Bukti Lapangan</span>
              </label>
              <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {isOverload ? '(Sangat Dianjurkan Saat Overload)' : '(Opsional)'}
              </span>
            </div>

            {photoPreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-blue-400/40 dark:border-m3-primary/40 bg-slate-100 dark:bg-m3-surface-low group">
                <img 
                  src={photoPreview} 
                  alt="Bukti Lapangan" 
                  className="w-full h-40 sm:h-44 object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5">
                  <label 
                    htmlFor="photo-upload-change"
                    className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                  >
                    <Camera className="w-3.5 h-3.5" /> Ganti
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="photo-upload-change"
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
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
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className={`w-full flex flex-col items-center justify-center h-26 sm:h-28 border-2 border-dashed rounded-2xl cursor-pointer transition-all group px-3 text-center ${
                    isOverload 
                      ? 'border-purple-400/60 bg-purple-50/50 dark:bg-purple-950/20 hover:bg-purple-100/50' 
                      : 'border-slate-300 dark:border-white/15 hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-white/[0.03] bg-[#f8f9fa] dark:bg-m3-surface-low'
                  }`}
                >
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors mb-1.5 ${
                    isOverload 
                      ? 'bg-purple-200 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300' 
                      : 'bg-slate-200 dark:bg-m3-surface-high group-hover:bg-blue-100 dark:group-hover:bg-m3-primary-container text-slate-600 dark:text-slate-300 group-hover:text-blue-700 dark:group-hover:text-m3-on-primary-container'
                  }`}>
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-white">
                    Sentuh untuk Ambil Foto / Galeri
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Format JPG, PNG, atau WEBP (Tersimpan di Cloudinary)
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Catatan Lapangan Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-0.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-m3-primary" />
                <span>Catatan Lapangan</span>
              </label>
              <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">(Opsional)</span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: parkirane rameee puuuolll"
              rows="2"
              className="w-full m3-input placeholder:text-slate-400 text-xs sm:text-sm rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 resize-none font-normal focus:outline-none"
            />
          </div>

          {/* Penanggung Jawab Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-0.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-m3-primary" />
                <span>Penanggung Jawab</span>
              </label>
              <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">Petugas Parkir</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Option 1: Ucup */}
              <label
                htmlFor="officer-ucup"
                className={`relative flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all ${
                  officerType === 'ucup'
                    ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100 shadow-xs'
                    : 'border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-m3-surface-low hover:bg-slate-100 dark:hover:bg-white/[0.04] text-slate-700 dark:text-slate-300'
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
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Petugas Utama</span>
                </div>
              </label>

              {/* Option 2: Lainnya */}
              <label
                htmlFor="officer-other"
                className={`relative flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all ${
                  officerType === 'other'
                    ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100 shadow-xs'
                    : 'border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-m3-surface-low hover:bg-slate-100 dark:hover:bg-white/[0.04] text-slate-700 dark:text-slate-300'
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
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Pengganti / Kakak</span>
                </div>
              </label>
            </div>

            {/* Input teks tambahan jika 'Lainnya' dipilih */}
            {officerType === 'other' && (
              <div className="pt-1 transition-all">
                <input
                  type="text"
                  value={customOfficerName}
                  onChange={(e) => setCustomOfficerName(e.target.value)}
                  placeholder="Masukkan nama penanggung jawab (cth: Kakak Ucup)..."
                  className="w-full m3-input placeholder:text-slate-400 text-xs sm:text-sm rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 font-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  required
                />
              </div>
            )}
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full m3-button-primary font-bold py-3.5 sm:py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer active:scale-[0.98] transition-transform"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                <span className="text-xs sm:text-sm font-semibold">Menyimpan Laporan...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                <span className="text-xs sm:text-sm font-bold">Kirim Laporan Parkir</span>
                <Sparkles className="w-4 h-4 opacity-80" />
              </>
            )}
          </button>
        </form>
      </M3Card>
    </div>
  );
};

export default EmployeeForm;
