import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Bike, LayoutDashboard, Loader2 } from 'lucide-react';
import EmployeeForm from './components/EmployeeForm';
import BottomNav from './components/ui/BottomNav';
import ThemeToggle from './components/ui/ThemeToggle';
import ServerStatusBadge from './components/ui/ServerStatusBadge';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import AuroraBackground from './components/ui/AuroraBackground';

// Lazy load heavy Admin Dashboard (recharts + datepicker) to eliminate lag on mobile/iPhone
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

// Ultra-fast M3 Loading Skeleton
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 p-6 text-slate-500 dark:text-slate-400">
    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-white/5 border border-blue-200 dark:border-white/10 flex items-center justify-center shadow-xs">
      <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
    </div>
    <span className="text-xs font-semibold tracking-wide">Memuat Dashboard Admin...</span>
  </div>
);

function AppContent() {
  return (
    <AuroraBackground className="flex flex-col selection:bg-blue-600 selection:text-white dark:selection:bg-blue-500 dark:selection:text-white">
      {/* Desktop Staff-Engineer Unified Navbar */}
      <header className="hidden md:block sticky top-0 z-40 bg-white/80 dark:bg-[#0c111c]/80 border-b border-slate-200/80 dark:border-white/[0.08] px-6 lg:px-8 py-2.5 backdrop-blur-md transition-colors">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Brand & Badge */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white shadow-sm shadow-blue-500/25">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                  Parkir Pabrik
                </h1>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.08] text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-white/[0.06]">
                  Jepara
                </span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-400 font-normal">
                Sistem Pencatatan & Monitoring Shift
              </p>
            </div>
          </div>

          {/* Segmented Tab Navigation */}
          <nav className="flex items-center gap-1 bg-slate-100/90 dark:bg-white/[0.05] p-1 rounded-xl border border-slate-200/70 dark:border-white/[0.06]">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white dark:bg-[#1a2230] text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`
              }
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Form Petugas</span>
            </NavLink>

            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white dark:bg-[#1a2230] text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`
              }
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard Admin</span>
            </NavLink>
          </nav>

          {/* Status & Theme Switcher */}
          <div className="flex items-center gap-2.5">
            <ServerStatusBadge />
            <div className="w-[1px] h-5 bg-slate-200 dark:bg-white/10" />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content View */}
      <main className="flex-1 w-full">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<EmployeeForm />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Suspense>
      </main>

      {/* Mobile Floating Bottom Navigation Dock */}
      <BottomNav />
    </AuroraBackground>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Router>
          <AppContent />
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
