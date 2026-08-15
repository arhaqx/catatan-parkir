import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
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
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createReport } from '../api';
import AuroraBackground from './ui/AuroraBackground';
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
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const RATE_PER_MOTORCYCLE = 3000;
  const MAX_CAPACITY = 150; // Kapasitas 150 motor
  const revenue = motorcycles * RATE_PER_MOTORCYCLE;

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  // Adjust count helpers for quick thumb operations on phone
  const adjustCount = (delta) => {
    setMotorcycles((prev) => {
      const next = Math.max(0, Math.min(MAX_CAPACITY, (parseInt(prev, 10) || 0) + delta));
      return next;
    });
  };

  const handleSetMax = () => setMotorcycles(MAX_CAPACITY);
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

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#8ab4f8', '#6dd58c', '#c2e7ff', '#fbbc04', '#1a73e8'],
      });
    } catch (err) {
      console.log('Confetti effect:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (motorcycles === undefined || motorcycles === null || motorcycles === '') {
      setStatus({ type: 'error', message: 'Silakan tentukan jumlah motor' });
      return;
    }

    if (motorcycles > MAX_CAPACITY) {
      setStatus({ type: 'error', message: `Kapasitas maksimal hanya ${MAX_CAPACITY} motor!` });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('date', date);
    formData.append('total_motorcycles', motorcycles);
    formData.append('notes', notes);
    if (photo) {
      formData.append('photo', photo);
    }

    try {
      await createReport(formData);
      setStatus({ 
        type: 'success', 
        message: `Laporan tanggal ${format(new Date(date), 'dd MMM yyyy')} berhasil tersimpan di server!` 
      });
      triggerConfetti();
      
      // Reset form fields
      setNotes('');
      setPhoto(null);
      setPhotoPreview('');
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error || 'Gagal mengirim laporan. Periksa koneksi backend Anda.';
      setStatus({ type: 'error', message: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuroraBackground className="flex flex-col items-center justify-start pb-28 pt-4 px-3 sm:px-6">
      {/* Top Google Stitch App Bar */}
      <div className="w-full max-w-lg mb-4 flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_4px_16px_rgba(26,115,232,0.3)] shrink-0">
            <Bike className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-m3-primary bg-blue-100 dark:bg-m3-primary-container/60 px-2 py-0.5 rounded-md">
                Shift Kerja
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Jepara</span>
            </div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">Parkir Pabrik</h1>
          </div>
        </div>

        {/* Status Chip & Theme Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-m3-surface-high border border-emerald-200 dark:border-white/10 text-xs text-emerald-700 dark:text-m3-tertiary shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-m3-tertiary animate-pulse" />
            <span className="font-semibold text-[11px]">Azure Online</span>
          </div>

          <ThemeToggle />
        </div>
      </div>

      {/* Main Google Stitch Surface Container */}
      <M3Card level="container" className="w-full max-w-lg p-5 sm:p-7">
        {/* Title Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Catat Jumlah Motor
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Kapasitas 150 unit & kalkulasi tarif otomatis
          </p>
        </div>

        {/* Status Toast Alert */}
        {status.message && (
          <div 
            className={`mb-5 p-3.5 rounded-2xl flex items-center gap-3 transition-all ${
              status.type === 'success' 
                ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-500/40 shadow-xs' 
                : 'bg-red-50 dark:bg-red-950/80 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-500/40 shadow-xs'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-m3-tertiary" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600 dark:text-m3-error" />
            )}
            <p className="text-xs sm:text-sm font-medium flex-1">{status.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Tanggal Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1 flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-blue-600 dark:text-m3-primary" />
              <span>Tanggal Laporan</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full m3-input rounded-2xl px-4 py-3 text-sm font-medium"
              required
            />
          </div>

          {/* Interactive Capacity Gauge & Quick Steppers */}
          <div className="p-4 rounded-3xl bg-[#f1f3f4] dark:bg-m3-surface-low border border-slate-200/80 dark:border-white/[0.06] flex flex-col items-center gap-4">
            <CapacityGauge current={motorcycles} max={MAX_CAPACITY} size={126} />

            {/* Quick Step Buttons */}
            <div className="w-full flex flex-col gap-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 text-center uppercase tracking-wider">
                Tombol Cepat Petugas
              </span>

              {/* Stepper Buttons (Explicit type="button") */}
              <div className="grid grid-cols-5 gap-1.5">
                <button
                  type="button"
                  onClick={() => adjustCount(-10)}
                  className="py-2.5 rounded-xl m3-button-tonal text-xs font-bold"
                >
                  -10
                </button>
                <button
                  type="button"
                  onClick={() => adjustCount(-1)}
                  className="py-2.5 rounded-xl m3-button-tonal text-xs font-bold"
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

              {/* Direct Manual Number Input & Action Chips */}
              <div className="flex items-center gap-2 mt-1">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="0"
                    max={MAX_CAPACITY}
                    value={motorcycles === 0 ? '' : motorcycles}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                      setMotorcycles(isNaN(val) ? 0 : Math.max(0, Math.min(MAX_CAPACITY, val)));
                    }}
                    placeholder="0"
                    className="w-full m3-input text-center text-xl font-bold rounded-xl py-2"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    Unit
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSetMax}
                  className="px-3.5 py-2.5 rounded-xl m3-button-tonal text-xs font-bold whitespace-nowrap"
                >
                  Maks (150)
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="p-2.5 rounded-xl m3-button-tonal hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-500/20 dark:hover:text-red-400 text-slate-400 text-xs font-bold"
                  title="Reset ke 0"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Revenue Highlight Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 dark:from-[#0d2a4a] dark:via-[#112338] dark:to-[#15191f] text-white border border-blue-500/30 flex justify-between items-center shadow-md">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200 dark:text-m3-primary block">
                Total Pemasukan
              </span>
              <span className="text-[11px] text-slate-300 dark:text-slate-400 font-medium">
                Tarif Rp 3.000 × {motorcycles} motor
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
                <AnimatedCounter value={revenue} prefix="Rp " />
              </span>
            </div>
          </div>

          {/* Photo Upload Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-blue-600 dark:text-m3-primary" />
                <span>Foto Bukti Lapangan</span>
              </label>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">(Opsional)</span>
            </div>

            {photoPreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-blue-400/40 dark:border-m3-primary/40 bg-slate-100 dark:bg-m3-surface-low group">
                <img 
                  src={photoPreview} 
                  alt="Bukti Lapangan" 
                  className="w-full h-44 object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <label 
                    htmlFor="photo-upload-change"
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
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
                    className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
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
                  className="w-full flex flex-col items-center justify-center h-28 border-2 border-dashed border-slate-300 dark:border-white/15 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-all group bg-[#f8f9fa] dark:bg-m3-surface-low"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-m3-surface-high group-hover:bg-blue-100 dark:group-hover:bg-m3-primary-container flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:text-blue-700 dark:group-hover:text-m3-on-primary-container transition-colors mb-2">
                    <Camera className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-white">
                    Sentuh untuk Ambil Foto Kamera / Galeri
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
            <div className="flex items-center justify-between ml-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-m3-primary" />
                <span>Catatan Lapangan</span>
              </label>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">(Opsional)</span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Kondisi aman tertib, cuaca hujan gerimis saat pergantian shift..."
              rows="2"
              className="w-full m3-input placeholder:text-slate-400 text-xs sm:text-sm rounded-2xl px-4 py-3 resize-none font-normal"
            />
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full m3-button-primary font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-semibold">Menyimpan Laporan...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                <span className="text-sm font-bold">Kirim Laporan Parkir</span>
                <Sparkles className="w-4 h-4 opacity-80" />
              </>
            )}
          </button>
        </form>
      </M3Card>
    </AuroraBackground>
  );
};

export default EmployeeForm;
