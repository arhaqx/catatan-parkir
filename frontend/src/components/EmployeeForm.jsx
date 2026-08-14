import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Camera, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  RotateCcw, 
  Plus, 
  Minus, 
  Sparkles, 
  Calendar as CalendarIcon, 
  FileText, 
  Trash2, 
  Image as ImageIcon,
  Check,
  Bike
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createReport } from '../api';
import AuroraBackground from './ui/AuroraBackground';
import SpotlightCard from './ui/SpotlightCard';
import CapacityGauge from './ui/CapacityGauge';
import AnimatedCounter from './ui/AnimatedCounter';
import ShinyText from './ui/ShinyText';

const EmployeeForm = () => {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [motorcycles, setMotorcycles] = useState(0);
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const RATE_PER_MOTORCYCLE = 3000;
  const MAX_CAPACITY = 100;
  const revenue = motorcycles * RATE_PER_MOTORCYCLE;

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  // Adjust count helpers for easy thumb operation on phone
  const adjustCount = (delta) => {
    setMotorcycles((prev) => {
      const next = Math.max(0, Math.min(MAX_CAPACITY, (parseInt(prev, 10) || 0) + delta));
      return next;
    });
  };

  const handleSetMax = () => {
    setMotorcycles(MAX_CAPACITY);
  };

  const handleReset = () => {
    setMotorcycles(0);
  };

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
        colors: ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#38bdf8'],
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
        message: `Laporan tanggal ${format(new Date(date), 'dd MMM yyyy')} berhasil tersimpan!` 
      });
      triggerConfetti();
      
      // Reset form
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
      {/* Top Brand & Status Bar */}
      <div className="w-full max-w-lg mb-4 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            <Bike className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Parkir Pabrik</h2>
            <p className="text-sm font-bold text-white leading-none">Petugas Shift</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-emerald-500/30 text-xs text-emerald-300 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Server: Azure Online</span>
        </div>
      </div>

      {/* Main Glass Card Form */}
      <SpotlightCard className="w-full max-w-lg p-5 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.6)] border-white/15">
        {/* Header Title with React Bits ShinyText */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            <ShinyText text="Catat Jumlah Motor" speed={3.5} />
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Input cepat kondisi lapangan & kalkulasi otomatis
          </p>
        </div>

        {/* Feedback Alert Toast */}
        {status.message && (
          <div 
            className={`mb-5 p-3.5 rounded-2xl flex items-center gap-3 transition-all animate-bounce-short ${
              status.type === 'success' 
                ? 'bg-emerald-950/70 text-emerald-200 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                : 'bg-red-950/70 text-red-200 border border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            )}
            <p className="text-xs sm:text-sm font-medium flex-1">{status.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Tanggal Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 ml-1 flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Tanggal Laporan</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full glass-input text-white rounded-2xl px-4 py-3 text-sm focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Interactive Capacity Gauge & Quick Stepper */}
          <div className="p-4 rounded-3xl bg-slate-950/60 border border-white/10 flex flex-col items-center gap-4">
            <CapacityGauge current={motorcycles} max={MAX_CAPACITY} size={110} />

            {/* Quick Step Buttons for Fast Mobile Thumb Entry */}
            <div className="w-full flex flex-col gap-2">
              <span className="text-[11px] font-medium text-slate-400 text-center uppercase tracking-wider">
                Tombol Cepat Petugas
              </span>

              {/* Main Stepper Counter */}
              <div className="grid grid-cols-5 gap-1.5">
                <button
                  type="button"
                  onClick={() => adjustCount(-10)}
                  className="py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-bold transition-all border border-white/5"
                >
                  -10
                </button>
                <button
                  type="button"
                  onClick={() => adjustCount(-1)}
                  className="py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-bold transition-all border border-white/5"
                >
                  -1
                </button>
                <button
                  type="button"
                  onClick={() => adjustCount(1)}
                  className="py-2.5 rounded-xl bg-indigo-600/60 hover:bg-indigo-600 active:scale-95 text-indigo-100 text-xs font-bold transition-all border border-indigo-400/30"
                >
                  +1
                </button>
                <button
                  type="button"
                  onClick={() => adjustCount(5)}
                  className="py-2.5 rounded-xl bg-indigo-600/60 hover:bg-indigo-600 active:scale-95 text-indigo-100 text-xs font-bold transition-all border border-indigo-400/30"
                >
                  +5
                </button>
                <button
                  type="button"
                  onClick={() => adjustCount(10)}
                  className="py-2.5 rounded-xl bg-purple-600/60 hover:bg-purple-600 active:scale-95 text-purple-100 text-xs font-bold transition-all border border-purple-400/30"
                >
                  +10
                </button>
              </div>

              {/* Direct Manual Input & Action Chips */}
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
                    className="w-full glass-input text-center text-xl font-bold text-white rounded-xl py-2 focus:outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                    Unit
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSetMax}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all border border-white/5 active:scale-95"
                >
                  Maks (100)
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 text-xs font-semibold transition-all border border-white/5 active:scale-95"
                  title="Reset ke 0"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Animated Revenue Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/60 to-slate-950/60 border border-indigo-500/30 shadow-[0_0_25px_rgba(99,102,241,0.15)] flex justify-between items-center group">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300 block">
                Total Pemasukan
              </span>
              <span className="text-[11px] text-slate-400">
                Tarif Rp 3.000 × {motorcycles} motor
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
                <AnimatedCounter value={revenue} prefix="Rp " />
              </span>
            </div>
          </div>

          {/* Camera / Photo Upload Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-indigo-400" />
                <span>Foto Bukti Lapangan</span>
              </label>
              <span className="text-[11px] text-slate-500 font-medium">(Opsional)</span>
            </div>

            {photoPreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-indigo-500/40 bg-slate-900 group">
                <img 
                  src={photoPreview} 
                  alt="Bukti Lapangan" 
                  className="w-full h-44 object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <label 
                    htmlFor="photo-upload-change"
                    className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-all shadow-lg active:scale-95"
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
                    className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg active:scale-95"
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
                  className="w-full flex flex-col items-center justify-center h-28 border-2 border-dashed border-white/15 rounded-2xl cursor-pointer hover:border-indigo-400 hover:bg-white/5 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-800/80 group-hover:bg-indigo-600/30 flex items-center justify-center text-slate-300 group-hover:text-indigo-300 transition-colors mb-2">
                    <Camera className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-slate-300 group-hover:text-white">
                    Sentuh untuk Ambil Foto Kamera / Galeri
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    Format JPG, PNG, atau WEBP
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Catatan Lapangan Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Catatan Lapangan</span>
              </label>
              <span className="text-[11px] text-slate-500 font-medium">(Opsional)</span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Parkiran aman tertib, cuaca hujan gerimis saat pergantian shift..."
              rows="2"
              className="w-full glass-input text-white placeholder:text-slate-500 text-xs sm:text-sm rounded-2xl px-4 py-3 focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.4)] transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Menyimpan Laporan...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                <span className="text-sm">Kirim Laporan Parkir</span>
                <Sparkles className="w-4 h-4 opacity-80" />
              </>
            )}
          </button>
        </form>
      </SpotlightCard>
    </AuroraBackground>
  );
};

export default EmployeeForm;
