import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Bike, LayoutDashboard, Sparkles } from 'lucide-react';
import EmployeeForm from './components/EmployeeForm';
import AdminDashboard from './components/AdminDashboard';
import BottomNav from './components/ui/BottomNav';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
        {/* Desktop Navbar (Hidden on small mobile screens where BottomNav handles it) */}
        <header className="hidden md:block sticky top-0 z-40 glass-panel border-b border-white/10 px-8 py-3.5 backdrop-blur-md">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.6)]">
                <Bike className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                  PARKIR PABRIK <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Maks 100</span>
                </h1>
                <p className="text-xs text-slate-400">Sistem Pencatatan & Manajemen Internal</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Bike className="w-4 h-4" />
                <span>Form Petugas</span>
              </NavLink>

              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
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
