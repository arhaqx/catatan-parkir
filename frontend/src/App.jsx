import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Bike, LayoutDashboard } from 'lucide-react';
import EmployeeForm from './components/EmployeeForm';
import AdminDashboard from './components/AdminDashboard';
import BottomNav from './components/ui/BottomNav';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-m3-surface text-slate-100 flex flex-col font-sans selection:bg-m3-primary selection:text-m3-on-primary">
        {/* Desktop Google Stitch App Bar */}
        <header className="hidden md:block sticky top-0 z-40 bg-m3-surface-container/90 border-b border-white/[0.08] px-8 py-3 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_4px_16px_rgba(26,115,232,0.4)]">
                <Bike className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-black tracking-tight text-white flex items-center gap-2">
                  PARKIR PABRIK 
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-m3-primary-container text-m3-on-primary-container border border-m3-primary/30">
                    Maks 100
                  </span>
                </h1>
                <p className="text-xs text-slate-400">Sistem Pencatatan & Manajemen Internal • Jepara - Semarang</p>
              </div>
            </div>

            {/* Navigation Segmented Tabs */}
            <nav className="flex items-center gap-1.5 bg-m3-surface-low p-1.5 rounded-full border border-white/[0.06]">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-m3-primary-container text-m3-on-primary-container shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
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
                      ? 'bg-m3-primary-container text-m3-on-primary-container shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Admin</span>
              </NavLink>
            </nav>
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
    </Router>
  );
}

export default App;
