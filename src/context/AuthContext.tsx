import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<void>;
  register: (name: string, email: string, role: UserRole, department?: string) => Promise<void>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
}

const DEFAULT_STUDENT: User = {
  id: 'student-01',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@campus.edu',
  role: 'student',
  department: 'Computer Science & Engineering',
  studentId: 'STU-2024-8839',
};

const DEFAULT_ADMIN: User = {
  id: 'admin-01',
  name: 'Dr. Evelyn Vance',
  email: 'admin@campus.edu',
  role: 'admin',
  department: 'Academic Administration & Registrar',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('campus_copilot_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_STUDENT;
      }
    }
    return DEFAULT_STUDENT; // Default pre-authenticated as student for seamless demo
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('campus_copilot_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('campus_copilot_user');
    }
  }, [user]);

  const login = async (email: string, role?: UserRole) => {
    try {
      const res = await api.login(email, role);
      setUser(res.user);
    } catch {
      // Fallback
      if (email.includes('admin') || role === 'admin') {
        setUser({ ...DEFAULT_ADMIN, email });
      } else {
        setUser({ ...DEFAULT_STUDENT, email });
      }
    }
  };

  const register = async (name: string, email: string, role: UserRole, department?: string) => {
    try {
      const res = await api.register({ name, email, role, department });
      setUser(res.user);
    } catch {
      setUser({
        id: `usr-${Date.now()}`,
        name,
        email,
        role,
        department: department || 'Engineering',
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === 'admin') {
      setUser(DEFAULT_ADMIN);
    } else {
      setUser(DEFAULT_STUDENT);
    }
  };

  const role = user?.role || 'student';
  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, login, register, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
