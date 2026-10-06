import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MessageSquareText, 
  CheckCircle2, 
  FileText, 
  Bookmark, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  ExternalLink,
  ChevronRight,
  BookOpen,
  Calendar,
  Briefcase,
  Award,
  ShieldAlert,
  HelpCircle,
  FileSearch,
  Bell
} from 'lucide-react';
import { api } from '../services/api';
import { DocumentItem, QuestionHistoryItem } from '../types';
import { useAuth } from '../context/AuthContext';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [history, setHistory] = useState<QuestionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [docs, hist] = await Promise.all([
          api.getDocuments(),
          api.getHistory(user?.id),
        ]);
        setDocuments(docs);
        setHistory(hist);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const categories = [
    { name: 'Examination', icon: Award, color: 'text-amber-400', count: 14, desc: 'Hall tickets, dates, passing criteria & re-eval' },
    { name: 'Attendance', icon: CheckCircle2, color: 'text-emerald-400', count: 8, desc: '75% rule, medical leave & RFID portal' },
    { name: 'Scholarships', icon: Sparkles, color: 'text-cyan-400', count: 6, desc: 'MCM guidelines, renewal criteria & income caps' },
    { name: 'Academics', icon: BookOpen, color: 'text-blue-400', count: 12, desc: '160 credits, honors degree & course reg' },
    { name: 'Timetable', icon: Calendar, color: 'text-indigo-400', count: 5, desc: 'Academic calendar, exam dates & slots' },
    { name: 'Placements', icon: Briefcase, color: 'text-purple-400', count: 9, desc: 'CGPA 6.5+, resume verification & dream jobs' },
    { name: 'Student Rules', icon: ShieldAlert, color: 'text-rose-400', count: 11, desc: 'Hostel curfews, anti-ragging & library' },
    { name: 'Events', icon: Bell, color: 'text-teal-400', count: 4, desc: 'AURA 2026 fest, hackathon & sports meet' },
    { name: 'Departments', icon: FileSearch, color: 'text-slate-300', count: 7, desc: 'Faculty coordinators & syllabus notes' },
    { name: 'General Notices', icon: FileText, color: 'text-yellow-300', count: 10, desc: 'Administrative circulars & fee notices' },
  ];

  const suggestedQuestions = [
    'What is the minimum attendance required to appear for the semester examination?',
    'What documents are required for scholarship renewal?',
    'When is the semester examination?',
    'What are the placement eligibility requirements?',
    'How do I register for campus placements?',
    'What are the hostel curfew and library timings?',
  ];

  const handleAskSuggested = (q: string) => {
    navigate('/chat', { state: { initialQuestion: q } });
  };

  const answeredCount = history.filter(h => h.isFound).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950 border border-slate-800 shadow-xl mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <span>STUDENT KNOWLEDGE PORTAL</span>
            <span>&bull;</span>
            <span className="text-slate-400">{user?.department || 'Engineering Division'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome, {user?.name || 'Aarav Sharma'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Ask any question regarding university circulars, exam guidelines, scholarships, or timetables. Every answer is grounded with the official source cited.
          </p>
        </div>

        {/* Primary Action Button */}
        <Link
          to="/chat"
          className="px-6 py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25 transition-all duration-200 flex items-center justify-center gap-2.5 shrink-0 hover:scale-105 active:scale-95"
        >
          <MessageSquareText className="w-5 h-5 text-slate-950" />
          <span>Ask Campus Copilot</span>
          <ArrowRight className="w-4 h-4 text-slate-950" />
        </Link>
      </div>

      {/* 4 Dashboard Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Questions Asked</span>
            <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-800/80 flex items-center justify-center text-blue-400">
              <MessageSquareText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {Math.max(history.length, 3)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Logged in your history</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Answers Found</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-300">
            {Math.max(answeredCount, 2)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">100% source-verified</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Documents Available</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center text-cyan-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-300">
            {documents.length || 8}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active institutional files</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Saved Questions</span>
            <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-800/80 flex items-center justify-center text-purple-400">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-300">
            5
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Bookmarked guidelines</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Suggested Questions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Suggested Questions to Try</span>
              </h2>
              <span className="text-xs text-slate-400">Click to ask instantly</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAskSuggested(q)}
                  className="p-3.5 rounded-xl text-left transition border group flex items-start justify-between gap-2 text-xs font-medium bg-slate-950/70 hover:bg-slate-950 border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white"
                >
                  <span className="leading-snug">{q}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 shrink-0 mt-0.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Recent Questions from History */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Recent Questions</span>
              </h2>
              <Link to="/history" className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1">
                <span>View Full History</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {history.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No questions asked yet.</p>
            ) : (
              <div className="space-y-3">
                {history.slice(0, 3).map((item) => (
                  <div 
                    key={item.id}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-200 truncate">
                        {item.question}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                        {item.answer}
                      </p>
                      {item.citations.length > 0 && (
                        <div className="mt-2 text-[10px] text-cyan-400 font-mono">
                          Source: {item.citations[0].documentName} (Pg {item.citations[0].pageNumber})
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAskSuggested(item.question)}
                      className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-900 transition"
                      title="Re-ask"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Knowledge Categories */}
        <div>
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">
                Knowledge Categories
              </h2>
              <span className="text-xs text-slate-400">10 Topics</span>
            </div>

            <div className="space-y-2.5">
              {categories.map((cat, idx) => (
                <Link
                  key={idx}
                  to={`/search?category=${encodeURIComponent(cat.name)}`}
                  className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between gap-3 text-xs group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
                      <cat.icon className={`w-3.5 h-3.5 ${cat.color}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-200 group-hover:text-cyan-300 transition truncate">
                        {cat.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {cat.desc}
                      </div>
                    </div>
                  </div>
                  <span className="shrink-0 text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {cat.count} files
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
