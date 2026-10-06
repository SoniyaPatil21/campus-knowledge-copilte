import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, ShieldCheck, UserCheck, ArrowRight, Sparkles, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email || (role === 'admin' ? 'admin@campus.edu' : 'student@campus.edu'), role);
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (selectedRole: 'student' | 'admin') => {
    setLoading(true);
    try {
      const quickEmail = selectedRole === 'admin' ? 'admin@campus.edu' : 'student@campus.edu';
      await login(quickEmail, selectedRole);
      if (selectedRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 p-0.5 mx-auto mb-3 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Sign In to Campus Copilot</h2>
          <p className="text-xs text-slate-400 mt-1">
            Access grounded institutional answers or manage regulatory circulars
          </p>
        </div>

        {/* 1-Click Fast Judge Demo Logins */}
        <div className="mb-6 p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/40">
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Instant Demo Access</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickLogin('student')}
              disabled={loading}
              className="py-2.5 px-3 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition text-left"
            >
              <div className="text-[10px] text-cyan-400 font-mono">1-CLICK DEMO</div>
              <div className="font-bold text-white">Student</div>
              <div className="text-[10px] text-slate-400 truncate">Aarav Sharma</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              disabled={loading}
              className="py-2.5 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-semibold transition text-left"
            >
              <div className="text-[10px] text-purple-400 font-mono">1-CLICK DEMO</div>
              <div className="font-bold text-white">Administrator</div>
              <div className="text-[10px] text-slate-400 truncate">Dr. Evelyn Vance</div>
            </button>
          </div>
        </div>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <span className="relative bg-slate-900 px-3 text-[11px] text-slate-500 uppercase font-mono">
            Or Login With Credentials
          </span>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Role</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-1.5 rounded-lg font-semibold transition ${
                  role === 'student' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-1.5 rounded-lg font-semibold transition ${
                  role === 'admin' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'admin' ? 'admin@campus.edu' : 'student@campus.edu'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 mt-2"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-400">
          <span>Need an account? </span>
          <Link to="/register" className="text-cyan-400 hover:underline font-semibold">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
