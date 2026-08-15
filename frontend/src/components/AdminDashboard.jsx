import React, { useState, useEffect, useMemo } from 'react';
import { format, subDays, startOfWeek, startOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Calendar as CalendarIcon,
  Download,
  TrendingUp,
  DollarSign,
  Bike,
  Percent,
  RefreshCw,
  Sparkles,
  LayoutGrid,
  Table as TableIcon,
  X,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Eye,
  Activity,
  Layers
} from 'lucide-react';
import { getReports, deleteReport, seedSampleReports, exportReportsToExcel, baseURL } from '../api';
import AuroraBackground from './ui/AuroraBackground';
import M3Card from './ui/M3Card';
import AnimatedCounter from './ui/AnimatedCounter';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [chartType, setChartType] = useState('bar'); // 'bar' | 'area'
  const [viewMode, setViewMode] = useState('table'); // 'cards' | 'table'
  const [dateRange, setDateRange] = useState([subDays(new Date(), 29), new Date()]);
  const [startDate, endDate] = dateRange;
  const [activeShortcut, setActiveShortcut] = useState('month');
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [toast, setToast] = useState({ type: '', message: '' });

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: '', message: '' }), 4000);
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = {};
      if (startDate) params.startDate = format(startDate, 'yyyy-MM-dd');
      if (endDate) params.endDate = format(endDate, 'yyyy-MM-dd');

      const data = await getReports(params);
      setReports(data || []);
    } catch (error) {
      console.error(error);
      showToast('error', 'Gagal memuat data laporan dari server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [startDate, endDate]);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const result = await seedSampleReports();
      showToast('success', result.message || '7 data sampel berhasil ditambahkan!');
      fetchReports();
    } catch (error) {
      console.error(error);
      showToast('error', 'Gagal menambahkan sample data.');
    } finally {
      setSeeding(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = {};
      if (startDate) params.startDate = format(startDate, 'yyyy-MM-dd');
      if (endDate) params.endDate = format(endDate, 'yyyy-MM-dd');

      const blobData = await exportReportsToExcel(params);
      const url = window.URL.createObjectURL(new Blob([blobData]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `Laporan_Parkir_Pabrik_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      showToast('success', 'File Excel berhasil diunduh!');
    } catch (error) {
      console.error(error);
      showToast('error', 'Gagal mengunduh file Excel.');
    } finally {
      setExporting(false);
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
              <CheckCircle2 className="w-5 h-5 text-m3-tertiary shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-m3-error shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header Bar - Google Looker Studio Style */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-m3-primary-container text-m3-on-primary-container border border-m3-primary/30">
              Admin Looker
            </span>
            <span className="text-xs text-slate-400 font-medium">• Kapasitas Parkir: 100 Motor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
            Dashboard Analitik Parkir
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Pantau pemasukan, kapasitas motor harian, dan unduh laporan Excel
          </p>
        </div>

        {/* Action Buttons Header */}
        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={fetchReports}
            disabled={loading}
            className="p-2.5 rounded-2xl m3-button-tonal text-slate-300 hover:text-white"
            title="Muat ulang data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-m3-primary' : ''}`} />
          </button>

          {reports.length === 0 && !loading && (
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-m3-surface-high hover:bg-m3-surface-highest border border-white/10 text-m3-secondary text-xs font-semibold"
            >
              <Sparkles className="w-4 h-4 text-m3-primary" />
              <span>{seeding ? 'Membuat...' : '+ Isi Sample Data'}</span>
            </button>
          )}

          <button
            onClick={handleExport}
            disabled={exporting || reports.length === 0}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 m3-button-primary px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
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
        {/* Date Filter & Google Segmented Chips */}
        <M3Card level="container" className="p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* Segmented Filter Chips */}
            <div className="flex items-center gap-1.5 flex-wrap w-full lg:w-auto">
              <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-m3-primary" /> Filter:
              </span>
              {[
                { id: 'today', label: 'Hari Ini' },
                { id: '7days', label: '7 Hari Terakhir' },
                { id: 'week', label: 'Minggu Ini' },
                { id: 'month', label: 'Bulan Ini' },
                { id: 'all', label: 'Semua Waktu' },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => handleShortcut(chip.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 active:scale-95 ${
                    activeShortcut === chip.id
                      ? 'bg-m3-primary-container text-m3-on-primary-container border border-m3-primary/40 shadow-xs'
                      : 'bg-m3-surface-low text-slate-400 hover:text-slate-200 border border-white/[0.06] hover:bg-m3-surface-high'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Custom Date Range Picker */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-64">
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => {
                    setDateRange(update);
                    setActiveShortcut('custom');
                  }}
                  isClearable={true}
                  placeholderText="Pilih rentang tanggal..."
                  dateFormat="dd/MM/yyyy"
                  className="w-full m3-input text-xs sm:text-sm font-medium rounded-xl px-3.5 py-2 pl-9 focus:outline-none"
                />
                <CalendarIcon className="w-4 h-4 text-m3-primary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </M3Card>

        {/* 3 Metric Cards - Google Cloud Looker Aesthetics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total Revenue */}
          <M3Card level="container" className="p-5 border-l-4 border-l-blue-500 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Pemasukan
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-m3-primary flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              <AnimatedCounter value={totalRevenue} prefix="Rp " />
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              Dari total {reports.length} hari shift kerja
            </p>
          </M3Card>

          {/* Total Motorcycles */}
          <M3Card level="container" className="p-5 border-l-4 border-l-emerald-500 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Unit Terlayani
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-m3-tertiary flex items-center justify-center">
                <Bike className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              <AnimatedCounter value={totalMotorcycles} suffix=" Motor" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              Rata-rata {averageDaily} unit / hari
            </p>
          </M3Card>

          {/* Average Occupancy */}
          <M3Card level="container" className="p-5 border-l-4 border-l-amber-500 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Rata-rata Okupansi
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-baseline gap-2">
              <AnimatedCounter value={averageOccupancy} suffix="%" />
              <span className="text-xs font-semibold text-amber-300">
                ({averageDaily}/100)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              Kapasitas maksimal 100 motor
            </p>
          </M3Card>
        </div>

        {/* Analytics Chart Container */}
        <M3Card level="container" className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-m3-primary" />
                Tren Arus Motor & Pemasukan
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Visualisasi dinamika parkir harian di pabrik Jepara
              </p>
            </div>

            {/* Toggle Bar / Area */}
            <div className="flex items-center gap-1 bg-m3-surface-low p-1 rounded-xl border border-white/[0.06]">
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  chartType === 'bar'
                    ? 'bg-m3-primary-container text-m3-on-primary-container shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Grafik Batang
              </button>
              <button
                onClick={() => setChartType('area')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  chartType === 'area'
                    ? 'bg-m3-primary-container text-m3-on-primary-container shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Grafik Area
              </button>
            </div>
          </div>

          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-m3-primary" />
              <span className="text-xs">Memuat data grafik...</span>
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-2 border border-dashed border-white/10 rounded-2xl">
              <Activity className="w-8 h-8 opacity-40 text-m3-primary" />
              <span className="text-sm font-medium">Belum ada data pada rentang tanggal ini.</span>
              <button
                onClick={() => handleShortcut('all')}
                className="mt-1 px-3 py-1.5 rounded-xl bg-m3-surface-high hover:bg-m3-surface-highest text-xs text-m3-primary font-semibold transition-all"
              >
                Tampilkan Semua Waktu
              </button>
            </div>
          ) : (
            <div className="h-72 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8ab4f8" stopOpacity={1} />
                        <stop offset="100%" stopColor="#1a73e8" stopOpacity={0.7} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#242a33" vertical={false} />
                    <XAxis dataKey="name" stroke="#8c9199" fontSize={11} tickLine={false} />
                    <YAxis stroke="#8c9199" fontSize={11} tickLine={false} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-m3-surface-high p-3 rounded-xl border border-white/15 shadow-2xl text-xs">
                              <p className="font-bold text-white mb-1.5">{data.dateFull}</p>
                              <p className="text-m3-primary font-semibold">🏍️ {data.Motor} Motor</p>
                              <p className="text-m3-tertiary font-bold mt-0.5">
                                💰 Rp {data.Pendapatan.toLocaleString('id-ID')}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="Motor" fill="url(#barGradient)" radius={[8, 8, 0, 0]} maxBarSize={45} />
                  </BarChart>
                ) : (
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8ab4f8" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#1a73e8" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#242a33" vertical={false} />
                    <XAxis dataKey="name" stroke="#8c9199" fontSize={11} tickLine={false} />
                    <YAxis stroke="#8c9199" fontSize={11} tickLine={false} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-m3-surface-high p-3 rounded-xl border border-white/15 shadow-2xl text-xs">
                              <p className="font-bold text-white mb-1.5">{data.dateFull}</p>
                              <p className="text-m3-primary font-semibold">🏍️ {data.Motor} Motor</p>
                              <p className="text-m3-tertiary font-bold mt-0.5">
                                💰 Rp {data.Pendapatan.toLocaleString('id-ID')}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="Motor"
                      stroke="#8ab4f8"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#areaGradient)"
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          )}
        </M3Card>

        {/* History Table & Cards Section */}
        <M3Card level="container" className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-m3-primary" />
                Daftar Riwayat Shift Kerja
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Menampilkan {reports.length} catatan parkir yang tersimpan
              </p>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-m3-surface-low p-1 rounded-xl border border-white/[0.06]">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'table'
                    ? 'bg-m3-primary-container text-m3-on-primary-container shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Tampilan Tabel Data"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tabel</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'cards'
                    ? 'bg-m3-primary-container text-m3-on-primary-container shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Tampilan Kartu Foto"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kartu</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-m3-primary" />
              <span className="text-xs">Memuat riwayat data...</span>
            </div>
          ) : reports.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              Tidak ada data laporan yang ditemukan.
            </div>
          ) : viewMode === 'table' ? (
            /* Modern Google Looker Data Table */
            <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead className="bg-m3-surface-high text-slate-300 uppercase tracking-wider text-[11px] font-bold">
                  <tr>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Motor</th>
                    <th className="py-3 px-4">Pemasukan</th>
                    <th className="py-3 px-4">Foto Bukti</th>
                    <th className="py-3 px-4">Catatan</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-m3-surface-high/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-white whitespace-nowrap">
                        {format(new Date(report.date), 'dd MMMM yyyy', { locale: id })}
                      </td>
                      <td className="py-3 px-4 font-bold text-m3-primary whitespace-nowrap">
                        {report.total_motorcycles} Unit
                      </td>
                      <td className="py-3 px-4 font-bold text-m3-tertiary whitespace-nowrap">
                        Rp {report.total_revenue?.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4">
                        {report.photo_path ? (
                          <button
                            onClick={() => setPreviewPhoto(getImageSrc(report.photo_path))}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/15 hover:bg-blue-500/30 text-m3-primary border border-blue-500/30 text-xs font-semibold transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Lihat</span>
                          </button>
                        ) : (
                          <span className="text-slate-500 text-xs">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-300 max-w-xs truncate">
                        {report.notes || '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => handleDelete(report.id, e)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="Hapus data"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Cards Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reports.map((report) => (
                <M3Card key={report.id} level="low" className="p-4 flex flex-col justify-between overflow-hidden">
                  <div>
                    {report.photo_path ? (
                      <div 
                        onClick={() => setPreviewPhoto(getImageSrc(report.photo_path))}
                        className="relative h-36 rounded-xl overflow-hidden mb-3 cursor-pointer group bg-m3-surface-container"
                      >
                        <img
                          src={getImageSrc(report.photo_path)}
                          alt="Foto Parkir"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="h-20 rounded-xl bg-m3-surface-container flex items-center justify-center text-slate-500 text-xs mb-3 border border-white/[0.04]">
                        Tidak ada foto
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-white text-sm">
                        {format(new Date(report.date), 'dd MMM yyyy')}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-m3-primary text-xs font-bold">
                        {report.total_motorcycles} Unit
                      </span>
                    </div>

                    <div className="text-lg font-black text-m3-tertiary mb-2">
                      Rp {report.total_revenue?.toLocaleString('id-ID')}
                    </div>

                    {report.notes && (
                      <p className="text-xs text-slate-400 bg-m3-surface-container p-2.5 rounded-xl border border-white/[0.04] mb-3">
                        {report.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end pt-2 border-t border-white/[0.05]">
                    <button
                      onClick={(e) => handleDelete(report.id, e)}
                      className="text-xs text-red-400/80 hover:text-red-400 flex items-center gap-1 font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                </M3Card>
              ))}
            </div>
          )}
        </M3Card>
      </div>

      {/* Lightbox Photo Modal */}
      {previewPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewPhoto(null)}
        >
          <div 
            className="relative max-w-3xl w-full bg-m3-surface-container rounded-3xl overflow-hidden border border-white/15 shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-4 py-3 border-b border-white/[0.08]">
              <span className="text-xs font-bold text-slate-300">Foto Bukti Lapangan (Cloudinary)</span>
              <button
                onClick={() => setPreviewPhoto(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2">
              <img
                src={previewPhoto}
                alt="Fullscreen Bukti Parkir"
                className="w-full max-h-[75vh] object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </AuroraBackground>
  );
};

export default AdminDashboard;
