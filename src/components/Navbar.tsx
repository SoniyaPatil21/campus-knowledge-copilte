import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  GraduationCap, 
  MessageSquareText, 
  FileSearch, 
  History, 
  ShieldCheck, 
  UploadCloud, 
  BarChart3, 
  UserCheck, 
  Info,
  LogOut,
  Sparkles,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, role, switchRole, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-300 bg-clip-text text-transparent">
                CAMPUS KNOWLEDGE COPILOT
              </span>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                EDU-02
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-400 font-medium">
              Ask your campus. Get the answer. Know the source.
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-300">
          <Link
            to={role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              isActive(role === 'admin' ? '/admin/dashboard' : '/student/dashboard')
                ? 'bg-slate-800 text-cyan-300 shadow-sm'
                : 'hover:text-white hover:bg-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>

          <Link
            to="/chat"
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              isActive('/chat')
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60'
                : 'text-cyan-400 hover:text-cyan-300 hover:bg-slate-900'
            }`}
          >
            <MessageSquareText className="w-4 h-4" />
            <span>Copilot Chat</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          </Link>

          <Link
            to="/search"
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              isActive('/search')
                ? 'bg-slate-800 text-cyan-300'
                : 'hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileSearch className="w-4 h-4" />
            Documents
          </Link>

          <Link
            to="/history"
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              isActive('/history')
                ? 'bg-slate-800 text-cyan-300'
                : 'hover:text-white hover:bg-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            History
          </Link>

          {role === 'admin' && (
            <>
              <Link
                to="/admin/documents"
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  isActive('/admin/documents')
                    ? 'bg-slate-800 text-cyan-300'
                    : 'hover:text-white hover:bg-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                Manage
              </Link>

              <Link
                to="/admin/upload"
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  isActive('/admin/upload')
                    ? 'bg-slate-800 text-cyan-300'
                    : 'hover:text-white hover:bg-slate-900'
                }`}
              >
                <UploadCloud className="w-4 h-4 text-indigo-400" />
                Upload
              </Link>

              <Link
                to="/admin/analytics"
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  isActive('/admin/analytics')
                    ? 'bg-slate-800 text-cyan-300'
                    : 'hover:text-white hover:bg-slate-900'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                Analytics
              </Link>
            </>
          )}

          <Link
            to="/about"
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              isActive('/about')
                ? 'bg-slate-800 text-cyan-300'
                : 'hover:text-white hover:bg-slate-900'
            }`}
          >
            <Info className="w-4 h-4" />
            Architecture
          </Link>
        </nav>

        {/* Right Section: Role Quick-Switcher & Profile */}
        <div className="flex items-center gap-2.5">
          {/* 1-Click Role Switcher for seamless hackathon judge testing */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              type="button"
              onClick={() => switchRole('student')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                role === 'student'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Switch to Student view"
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => switchRole('admin')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                role === 'admin'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Switch to Administrator view"
            >
              Admin
            </button>
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 transition"
              >
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-medium max-w-[110px] truncate">{user.name.split(' ')[0]}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                  role === 'admin' ? 'bg-purple-950 text-purple-300 border border-purple-800/60' : 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
                }`}>
                  {role}
                </span>
              </Link>
              <button
                type="button"
                onClick={logout}
                title="Sign out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
