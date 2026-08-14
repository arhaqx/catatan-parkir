import React, { useState, useEffect, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { 
  format, 
  subDays, 
  startOfMonth, 
  startOfWeek, 
  endOfWeek,
  endOfMonth,
  isToday 
} from 'date-fns';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area 
} from 'recharts';
import { 
  Download, 
  Calendar as CalendarIcon, 
  Activity, 
  CreditCard, 
  ImageIcon, 
  X, 
  Loader2, 
  Trash2, 
  Sparkles, 
  LayoutList, 
  LayoutGrid, 
  TrendingUp, 
  Percent, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Eye,
  Bike
} from 'lucide-react';
import { 
  getReports, 
  deleteReport, 
  seedSampleReports, 
  exportReportsToExcel, 
  baseURL 
} from '../api';
import AuroraBackground from './ui/AuroraBackground';
import SpotlightCard from './ui/SpotlightCard';
import AnimatedCounter from './ui/AnimatedCounter';
import ShinyText from './ui/ShinyText';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [activeShortcut, setActiveShortcut] = useState('week');
  const [dateRange, setDateRange] = useState([subDays(new Date(), 6), new Date()]);
  const [startDate, endDate] = dateRange;
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [chartType, setChartType] = useState('motor'); // 'motor' or 'revenue'
  const [toast, setToast] = useState({ type: '', message: '' });

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast({ type: '', message: '' });
    }, 4000);
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const start = startDate ? format(startDate, 'yyyy-MM-dd') : '';
      const end = endDate ? format(endDate, 'yyyy-MM-dd') : '';
      
      const data = await getReports({ startDate: start, endDate: end });
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      showToast('error', 'Gagal memuat data dari server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [startDate, endDate]);

  const handleExport = async () => {
    if (reports.length === 0) {
      showToast('error', 'Tidak ada data untuk diekspor.');
      return;
    }

    setExporting(true);
    try {
      const start = startDate ? format(startDate, 'yyyy-MM-dd') : '';
      const end = endDate ? format(endDate, 'yyyy-MM-dd') : '';
      
      const blobData = await exportReportsToExcel({ startDate: start, endDate: end });
      
      const url = window.URL.createObjectURL(new Blob([blobData]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Laporan_Parkir_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      showToast('success', 'File Excel berhasil diunduh!');
    } catch (error) {
      console.error('Error exporting data:', error);
      showToast('error', 'Gagal mengekspor data ke Excel.');
    } finally {
      setExporting(false);
    }
  };

  const handleSeed = async () => {
    if (!window.confirm('Ingin menambahkan 7 data simulasi untuk melihat grafik?')) return;
    setSeeding(true);
    try {
      await seedSampleReports();
      showToast('success', 'Sample data simulasi berhasil dibuat!');
      fetchReports();
    } catch (error) {
      console.error(error);
      showToast('error', 'Gagal membuat sample data.');
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async (id, e) => {
    e?.stopPropagation();
    if (!window.confirm('Yakin ingin menghapus data laporan ini?')) return;

    try {
      await deleteReport(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
      showToast('success', 'Data laporan berhasil dihapus.');
    } catch (error) {
      console.error(error);
      showToast('error', 'Gagal menghapus data.');
    }
  };

  const handleShortcut = (type) => {
    setActiveShortcut(type);
    const today = new Date();
    switch (type) {
      case 'today':
        setDateRange([today, today]);
        break;
      case '7days':
        setDateRange([subDays(today, 6), today]);
        break;
      case 'week':
        setDateRange([startOfWeek(today, { weekStartsOn: 1 }), today]);
        break;
      case 'month':
        setDateRange([startOfMonth(today), today]);
        break;
      case 'all':
        setDateRange([null, null]);
        break;
      default:
        break;
    }
  };

  // Calculations
  const totalRevenue = useMemo(() => {
    return reports.reduce((sum, r) => sum + (r.total_revenue || 0), 0);
  }, [reports]);

  const totalMotorcycles = useMemo(() => {
    return reports.reduce((sum, r) => sum + (r.total_motorcycles || 0), 0);
  }, [reports]);

  const averageDaily = useMemo(() => {
    if (reports.length === 0) return 0;
    return Math.round(totalMotorcycles / reports.length);
  }, [reports, totalMotorcycles]);

  const averageOccupancy = useMemo(() => {
    // 100 max capacity
    return Math.min(Math.round((averageDaily / 100) * 100), 100);
  }, [averageDaily]);

  const getImageSrc = (path) => {
    if (!path) return '';
    return path.startsWith('http') ? path : `${baseURL}${path}`;
  };
  const chartData = useMemo(() => {
    return [...reports]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((r) => ({
        name: format(new Date(r.date), 'dd MMM'),
        Motor: r.total_motorcycles,
        Pendapatan: r.total_revenue,
        dateFull: format(new Date(r.date), 'dd MMMM yyyy')
      }));
  }, [reports]);

  return (
    <AuroraBackground className="min-h-screen pb-28 pt-4 px-3 sm:px-6 md:px-10">
      {/* Toast Notification */}
      {toast.message && (
        <div className="fixed top-4 right-4 z-50 animate-bounce-short">
          <div className={`p-4 rounded-2xl flex items-center gap-3 shadow-2xl backdrop-blur-xl border ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50'
              : 'bg-red-950/90 text-red-200 border-red-500/50'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Admin Area
            </span>
            <span className="text-xs text-slate-400">• Kapasitas Pabrik: 100 Motor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
            <ShinyText text="Dashboard Analitik Parkir" speed={3} />
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Pantau arus motor harian, statistik pemasukan, dan unduh laporan
          </p>
        </div>

        {/* Action Buttons Header */}
        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={fetchReports}
            disabled={loading}
            className="p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-all active:scale-95 shadow-sm"
            title="Muat ulang data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>

          {reports.length === 0 && !loading && (
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>{seeding ? 'Membuat...' : '+ Isi Sample Data'}</span>
            </button>
          )}

          <button
            onClick={handleExport}
            disabled={exporting || reports.length === 0}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2.5 rounded-2xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-95 font-semibold text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {exporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Export ke Excel</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Date Filter & Shortcuts */}
        <SpotlightCard className="p-4 sm:p-5 border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Shortcuts */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {[
                { id: 'today', label: 'Hari Ini' },
                { id: '7days', label: '7 Hari Terakhir' },
                { id: 'week', label: 'Minggu Ini' },
                { id: 'month', label: 'Bulan Ini' },
                { id: 'all', label: 'Semua Waktu' },
              ].map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => handleShortcut(sc.id)}
                  className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                    activeShortcut === sc.id
                      ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-indigo-400/40'
                      : 'bg-slate-800/70 hover:bg-slate-700/80 text-slate-300 border border-white/5'
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>

            {/* Custom Date Picker */}
            <div className="flex items-center gap-2.5 bg-slate-950/80 px-3.5 py-2 rounded-2xl border border-white/10 text-xs">
              <CalendarIcon className="w-4 h-4 text-indigo-400 shrink-0" />
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                  setActiveShortcut('custom');
                  setDateRange(update);
                }}
                isClearable={true}
                placeholderText="Pilih rentang tanggal khusus"
                className="bg-transparent outline-none text-white text-xs font-medium w-full min-w-[200px] cursor-pointer"
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </div>
        </SpotlightCard>

        {/* 3 Metric Cards with Spotlight Effect */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Total Pendapatan */}
          <SpotlightCard className="p-5 border-white/10 relative group" spotlightColor="rgba(16, 185, 129, 0.2)">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Pendapatan
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              <AnimatedCounter value={totalRevenue} prefix="Rp " />
            </div>
            <p className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Tarif flat Rp 3.000 / motor
            </p>
          </SpotlightCard>

          {/* Card 2: Total Motor */}
          <SpotlightCard className="p-5 border-white/10 relative group" spotlightColor="rgba(99, 102, 241, 0.2)">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Motor Masuk
              </span>
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <Bike className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              <AnimatedCounter value={totalMotorcycles} suffix=" Unit" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Dari <span className="text-indigo-300 font-semibold">{reports.length} hari</span> pencatatan
            </p>
          </SpotlightCard>

          {/* Card 3: Rata-rata & Okupansi */}
          <SpotlightCard className="p-5 border-white/10 relative group sm:col-span-2 lg:col-span-1" spotlightColor="rgba(217, 70, 239, 0.2)">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Rata-rata / Okupansi
              </span>
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                <Percent className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {averageDaily} <span className="text-base font-normal text-slate-400">Unit / hari</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700" 
                style={{ width: `${averageOccupancy}%` }}
              />
            </div>
            <p className="text-[11px] text-purple-300 font-medium mt-1">
              {averageOccupancy}% Tingkat Kepadatan Kapasitas
            </p>
          </SpotlightCard>
        </div>

        {/* Dynamic Interactive Chart */}
        <SpotlightCard className="p-5 sm:p-6 border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                Tren Harian Kapasitas & Pendapatan
              </h3>
              <p className="text-xs text-slate-400">
                Grafik visual performa parkir motor pabrik
              </p>
            </div>

            {/* Chart toggle switch */}
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
              <button
                onClick={() => setChartType('motor')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  chartType === 'motor'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Jumlah Motor
              </button>
              <button
                onClick={() => setChartType('revenue')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  chartType === 'revenue'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Pendapatan (Rp)
              </button>
            </div>
          </div>

          <div className="h-[280px] sm:h-[340px] w-full">
            {loading ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                <span className="text-xs text-slate-400">Memuat data grafik...</span>
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'motor' ? (
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="motorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#818cf8" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.4} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 11 }} 
                      dy={8} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 11 }} 
                      domain={[0, (dataMax) => Math.max(100, dataMax + 10)]}
                    />
                    <RechartsTooltip
                      cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="glass-panel p-3 rounded-xl border border-indigo-500/30 shadow-2xl text-xs">
                              <p className="font-bold text-white mb-1">{data.dateFull}</p>
                              <p className="text-indigo-300 font-semibold">
                                Total Motor: <span className="text-white font-bold">{data.Motor} Unit</span>
                              </p>
                              <p className="text-emerald-300 font-semibold mt-0.5">
                                Pendapatan: <span className="text-white font-bold">Rp {data.Pendapatan.toLocaleString('id-ID')}</span>
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="Motor" fill="url(#motorGradient)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                ) : (
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 11 }} 
                      dy={8} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      tickFormatter={(val) => `Rp ${(val / 1000)}k`}
                    />
                    <RechartsTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="glass-panel p-3 rounded-xl border border-emerald-500/30 shadow-2xl text-xs">
                              <p className="font-bold text-white mb-1">{data.dateFull}</p>
                              <p className="text-emerald-300 font-semibold">
                                Total: Rp {data.Pendapatan.toLocaleString('id-ID')}
                              </p>
                              <p className="text-slate-300 mt-0.5">
                                {data.Motor} unit motor terparkir
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Pendapatan" 
                      stroke="#10b981" 
                      strokeWidth={2.5} 
                      fill="url(#revenueGradient)" 
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-slate-500 text-xs">
                <Bike className="w-10 h-10 opacity-30" />
                <span>Tidak ada data laporan untuk rentang tanggal ini.</span>
              </div>
            )}
          </div>
        </SpotlightCard>

        {/* Riwayat Laporan Section */}
        <SpotlightCard className="p-5 sm:p-6 border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Riwayat & Bukti Lapangan
              </h3>
              <p className="text-xs text-slate-400">
                Total {reports.length} data laporan tercatat
              </p>
            </div>

            {/* View Mode Toggle for Mobile / Desktop */}
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  viewMode === 'cards' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Tampilan Kartu (Cocok untuk HP)"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Tampilan Tabel (Desktop)"
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cards View (Super Mobile Friendly) */}
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {reports.map((report) => (
                <div 
                  key={report.id}
                  className="glass-card rounded-2xl p-4 border border-white/10 hover:border-indigo-500/40 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30">
                        {format(new Date(report.date), 'dd MMM yyyy')}
                      </span>
                      <span className="text-sm font-black text-emerald-400">
                        Rp {report.total_revenue.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-white">
                        {report.total_motorcycles} Unit Motor
                      </span>
                      <span className="text-[10px] text-slate-500">
                        ({Math.round((report.total_motorcycles / 100) * 100)}% Kapasitas)
                      </span>
                    </div>

                    {report.notes && (
                      <p className="text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-xl border border-white/5 mb-3 italic">
                        "{report.notes}"
                      </p>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    {report.photo_path ? (
                      <button
                        onClick={() => setSelectedPhoto(getImageSrc(report.photo_path))}
                        className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Lihat Bukti Foto</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">Tanpa lampiran foto</span>
                    )}

                    <button
                      onClick={(e) => handleDelete(report.id, e)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Hapus data"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {reports.length === 0 && !loading && (
                <div className="col-span-full py-12 text-center text-slate-500 text-xs sm:text-sm">
                  Tidak ada riwayat laporan ditemukan.
                </div>
              )}
            </div>
          ) : (
            /* Table View */
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Tanggal</th>
                    <th className="px-4 py-3 font-semibold">Jumlah Motor</th>
                    <th className="px-4 py-3 font-semibold">Pendapatan</th>
                    <th className="px-4 py-3 font-semibold">Catatan</th>
                    <th className="px-4 py-3 font-semibold text-center">Foto</th>
                    <th className="px-4 py-3 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3.5 whitespace-nowrap font-medium text-white">
                        {format(new Date(report.date), 'dd MMM yyyy')}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-indigo-300">{report.total_motorcycles}</span>
                        <span className="text-[10px] text-slate-500 ml-1">/100</span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-emerald-400">
                        Rp {report.total_revenue.toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3.5 text-slate-400 max-w-xs truncate">
                        {report.notes || '-'}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {report.photo_path ? (
                          <button
                            onClick={() => setSelectedPhoto(getImageSrc(report.photo_path))}
                            className="inline-flex items-center justify-center p-1.5 rounded-xl bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-all border border-indigo-500/30"
                            title="Lihat Foto Lapangan"
                          >
                            <ImageIcon className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={(e) => handleDelete(report.id, e)}
                          className="inline-flex items-center justify-center p-1.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {reports.length === 0 && !loading && (
                    <tr>
                      <td colSpan="6" className="px-4 py-10 text-center text-slate-500 text-xs">
                        Tidak ada data laporan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </SpotlightCard>
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            className="relative max-w-2xl w-full bg-slate-900 rounded-3xl p-3 border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 px-2 border-b border-white/10 mb-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-indigo-400" />
                Bukti Foto Kondisi Lapangan
              </span>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img 
              src={selectedPhoto} 
              alt="Bukti Lapangan" 
              className="w-full max-h-[75vh] object-contain rounded-2xl bg-black/40"
            />
          </div>
        </div>
      )}
    </AuroraBackground>
  );
};

export default AdminDashboard;
