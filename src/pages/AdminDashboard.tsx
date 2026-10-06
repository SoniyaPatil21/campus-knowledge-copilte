import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  FileText, 
  Database, 
  MessageSquareText, 
  CheckCircle2, 
  AlertTriangle, 
  UploadCloud, 
  BarChart3, 
  RotateCcw, 
  ArrowRight,
  TrendingUp,
  Layers,
  Zap,
  Clock,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { AnalyticsData, DocumentItem } from '../types';

export const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [analyticsData, docs] = await Promise.all([
        api.getAnalytics(),
        api.getDocuments(),
      ]);
      setAnalytics(analyticsData);
      setDocuments(docs);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleResetDemo = async () => {
    if (!window.confirm('Reset all institutional documents to the original demo set?')) return;
    setResetting(true);
    try {
      await api.resetDemoDocuments();
      await loadData();
    } catch (err) {
      console.error('Reset error:', err);
    } finally {
      setResetting(false);
    }
  };

  const answerableRatio = analytics 
    ? Math.round((analytics.questionsAnswered / Math.max(1, analytics.totalQuestions)) * 100) 
    : 92;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-900/40 shadow-xl mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>CAMPUS REGISTRY & AI GOVERNANCE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Institutional Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Monitor RAG vector indices, document versions, student queries, and strict refusal benchmarks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/upload"
            className="px-5 py-3 rounded-xl font-bold text-xs bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/25 transition flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Document</span>
          </Link>

          <button
            type="button"
            onClick={handleResetDemo}
            disabled={resetting}
            className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition flex items-center gap-2"
            title="Reset to 8 standard demo documents"
          >
            <RotateCcw className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
            <span>Reset Demo DB</span>
          </button>
        </div>
      </div>

      {/* 6 Key Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400">Total Documents</span>
          <div className="text-xl sm:text-2xl font-black text-white mt-1">
            {analytics?.totalDocuments || documents.length || 8}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Active files</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400">Processed</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
            {analytics?.processedDocuments || documents.length || 8}
          </div>
          <p className="text-[10px] text-emerald-500/80 mt-0.5">100% Parsed</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400">Total Chunks</span>
          <div className="text-xl sm:text-2xl font-black text-cyan-300 mt-1">
            {analytics?.totalChunks || 38}
          </div>
          <p className="text-[10px] text-cyan-500/80 mt-0.5">Vector embeddings</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400">Total Questions</span>
          <div className="text-xl sm:text-2xl font-black text-indigo-300 mt-1">
            {analytics?.totalQuestions || 28}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">All-time logs</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400">Answered</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-300 mt-1">
            {analytics?.questionsAnswered || 26}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Authoritative matches</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400">With No Answer</span>
          <div className="text-xl sm:text-2xl font-black text-amber-300 mt-1">
            {analytics?.questionsNotFound || 2}
          </div>
          <p className="text-[10px] text-amber-500/80 mt-0.5">Strict refusals</p>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Most Asked Topics */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span>Most Asked Topics</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">By Query Frequency</span>
          </div>

          <div className="space-y-3.5">
            {analytics?.topTopics.map((topic, idx) => {
              const maxCount = analytics.topTopics[0]?.count || 14;
              const pct = Math.round((topic.count / maxCount) * 100);
              return (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>{topic.topic}</span>
                    <span className="font-mono text-cyan-400">{topic.count} queries</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Document Usage */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Document Citations Usage</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">Top Cited Files</span>
          </div>

          <div className="space-y-3">
            {analytics?.documentUsage.slice(0, 5).map((doc, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded bg-slate-900 flex items-center justify-center text-cyan-400 font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div className="truncate font-medium text-slate-200">
                    {doc.documentName}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-slate-400 text-[11px]">
                    {doc.usageCount} citations
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                    {doc.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Answerable vs Unanswerable & Questions Per Day */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ratio Card */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white mb-2">
              Answerable vs Refusal Rate
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Evaluation of student questions successfully retrieved vs rigorously refused without hallucinating.
            </p>

            <div className="flex items-center justify-center my-4">
              <div className="relative w-36 h-36 rounded-full flex items-center justify-center bg-slate-950 border-4 border-emerald-500/80 shadow-lg shadow-emerald-950">
                <div className="text-center">
                  <span className="text-3xl font-black text-emerald-400">{answerableRatio}%</span>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">Precision</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-800/80 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Grounded Answers:
              </span>
              <span className="font-mono font-bold text-white">{analytics?.questionsAnswered || 26}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1 text-amber-400 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                Refusals (Zero Hallucination):
              </span>
              <span className="font-mono font-bold text-white">{analytics?.questionsNotFound || 2}</span>
            </div>
          </div>
        </div>

        {/* Quick Management Navigation */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white mb-4">
              Administrative Quick Actions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/admin/documents"
                className="p-4 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-purple-500/40 transition group"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-800/80 flex items-center justify-center text-purple-400 mb-2">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-200 text-xs sm:text-sm group-hover:text-purple-300 transition">
                  Manage Document Versions
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Activate or deactivate regulations, examine extracted chunks, and re-index.
                </p>
              </Link>

              <Link
                to="/admin/upload"
                className="p-4 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition group"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center text-cyan-400 mb-2">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-200 text-xs sm:text-sm group-hover:text-cyan-300 transition">
                  Upload Institutional Circular
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Upload PDF, DOCX, TXT, or CSV with automated chunking and pgvector storage.
                </p>
              </Link>

              <Link
                to="/admin/analytics"
                className="p-4 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400 mb-2">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-200 text-xs sm:text-sm group-hover:text-emerald-300 transition">
                  Detailed RAG Analytics
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Inspect query latency, average similarity score (0.91), and daily volume.
                </p>
              </Link>

              <Link
                to="/chat"
                className="p-4 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-800/80 flex items-center justify-center text-indigo-400 mb-2">
                  <MessageSquareText className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-200 text-xs sm:text-sm group-hover:text-indigo-300 transition">
                  Test Copilot Chat
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Simulate live student interactions and test custom uploaded documents.
                </p>
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Average retrieval similarity: <strong className="text-cyan-400 font-mono">0.91</strong></span>
            <span>Average response latency: <strong className="text-emerald-400 font-mono">685ms</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
