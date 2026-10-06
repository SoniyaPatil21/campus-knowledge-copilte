import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { CampusKnowledgeChat } from './pages/CampusKnowledgeChat';
import { DocumentSearch } from './pages/DocumentSearch';
import { QuestionHistoryPage } from './pages/QuestionHistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminDocumentsPage } from './pages/AdminDocumentsPage';
import { AdminUploadPage } from './pages/AdminUploadPage';
import { AdminAnalyticsPage } from './pages/AdminAnalyticsPage';
import { AboutPage } from './pages/AboutPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/about" element={<AboutPage />} />

              {/* Student and General Access Pages */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <CampusKnowledgeChat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <DocumentSearch />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <QuestionHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Pages */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/documents"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDocumentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/upload"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminUploadPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminAnalyticsPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
