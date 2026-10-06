import React from 'react';
import { UserCheck, ShieldCheck, GraduationCap, Building, Mail, Hash, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user, role, switchRole, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-slate-800">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-1">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400 font-extrabold text-2xl">
              {user.name.charAt(0)}
            </div>
          </div>
          <div className="text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">{user.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                role === 'admin' 
                  ? 'bg-purple-950 text-purple-300 border border-purple-800/60' 
                  : 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
              }`}>
                {role === 'admin' ? 'Administrator' : 'Student'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <Building className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-slate-500 block">Department / Branch:</span>
              <span className="font-semibold text-slate-200">{user.department || 'Not Specified'}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <Hash className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <span className="text-slate-500 block">Identifier ID:</span>
              <span className="font-semibold text-slate-200 font-mono">{user.studentId || user.id}</span>
            </div>
          </div>
        </div>

        {/* Role Quick Toggle for Hackathon Testing */}
        <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-800/30 mb-8">
          <h3 className="font-bold text-xs text-cyan-300 uppercase tracking-wider mb-2">
            Switch View for Testing
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Toggle between Student and Administrator accounts to experience protected administrative uploads vs grounded student question answering.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => switchRole('student')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                role === 'student' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Set as Student
            </button>
            <button
              type="button"
              onClick={() => switchRole('admin')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                role === 'admin' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Set as Administrator
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/40 text-red-300 border border-red-800/40 text-xs font-semibold transition flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
