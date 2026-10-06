import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'admin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, role, isAuthenticated, switchRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && requiredRole === 'admin' && role !== 'admin') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl bg-slate-900 border border-red-900/60 p-6 text-center shadow-xl">
          <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-800/80 mx-auto flex items-center justify-center text-red-400 mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-100 mb-2">Administrator Access Required</h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            This management console is restricted to university administrators and registry staff. Your current profile is enrolled as a <strong className="text-cyan-400">Student</strong>.
          </p>
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => switchRole('admin')}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition shadow-lg shadow-purple-600/20"
            >
              Switch to Demo Admin Profile
            </button>
            <Navigate to="/student/dashboard" replace={false} />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
