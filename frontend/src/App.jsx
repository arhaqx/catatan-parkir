import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Bike, LayoutDashboard } from 'lucide-react';
import EmployeeForm from './components/EmployeeForm';
import AdminDashboard from './components/AdminDashboard';
import BottomNav from './components/ui/BottomNav';
import ThemeToggle from './components/ui/ThemeToggle';
import { ThemeProvider } from './context/ThemeContext';

function AppContent() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-m3-surface text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white dark:selection:bg-m3-primary dark:selection:text-m3-on-primary transition-colors duration-200">
      {/* Desktop Google Stitch App Bar */}
      <header className="hidden md:block sticky top-0 z-40 bg-white/90 dark:bg-m3-surface-container/90 border-b border-slate-200 dark:border-white/[0.08] px-8 py-3 backdrop-blur-xl transition-colors">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_4px_16px_rgba(26,115,232,0.3)]">
              <Bike className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                PARKIR PABRIK 
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-m3-primary-container text-blue-800 dark:text-m3-on-primary-container border border-blue-200 dark:border-m3-primary/30">
                  Standar 90 • Overload 110
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Sistem Pencatatan & Manajemen Internal • Jepara - Semarang</p>
            </div>
          </div>

          {/* Navigation & Theme Switcher */}
          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-1.5 bg-slate-100 dark:bg-m3-surface-low p-1.5 rounded-full border border-slate-200/80 dark:border-white/[0.06]">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 dark:bg-m3-primary-container text-white dark:text-m3-on-primary-container shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`
                }
              >
                <Bike className="w-4 h-4" />
                <span>Form Petugas</span>
              </NavLink>

              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 dark:bg-m3-primary-container text-white dark:text-m3-on-primary-container shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Admin</span>
              </NavLink>
            </nav>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content View */}
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<EmployeeForm />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      {/* Mobile Floating Bottom Navigation Dock */}
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
