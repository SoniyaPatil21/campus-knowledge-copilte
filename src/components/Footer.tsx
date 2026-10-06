import React from 'react';
import { ShieldCheck, BookOpen, Sparkles, Terminal, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400 text-xs py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-xs">
                C
              </div>
              <span className="font-bold text-slate-200">CAMPUS KNOWLEDGE COPILOT</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Domain: Education & Technology (EDU-02). Grounded institutional RAG copilot enforcing zero hallucination and source-level citations.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-[10px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Demo Institutional Data Active
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              Student Portal
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link to="/chat" className="hover:text-cyan-300 transition">Ask Campus Copilot</Link></li>
              <li><Link to="/search" className="hover:text-cyan-300 transition">Browse Institutional Documents</Link></li>
              <li><Link to="/history" className="hover:text-cyan-300 transition">Question History & Citations</Link></li>
              <li><Link to="/student/dashboard" className="hover:text-cyan-300 transition">Knowledge Categories</Link></li>
            </ul>
          </div>

          {/* Institutional Admin */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              Admin & Governance
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link to="/admin/dashboard" className="hover:text-purple-300 transition">Admin Dashboard</Link></li>
              <li><Link to="/admin/upload" className="hover:text-purple-300 transition">Upload Circulars & Policies</Link></li>
              <li><Link to="/admin/documents" className="hover:text-purple-300 transition">Document Version Management</Link></li>
              <li><Link to="/admin/analytics" className="hover:text-purple-300 transition">RAG Accuracy & Analytics</Link></li>
            </ul>
          </div>

          {/* Security & RAG Guarantees */}
          <div className="space-y-2">
            <h4 className="text-slate-200 font-semibold mb-3 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-blue-400" />
              RAG Guardrails
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Strict context isolation: answers are constructed only from authenticated institutional PDFs and circulars. Non-existent information triggers verified refusal.
            </p>
            <div className="text-[10px] text-slate-500 font-mono bg-slate-900 p-2 rounded border border-slate-800">
              Similarity Threshold: 0.38 &bull; Gemini Flash 3.8
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 Campus Knowledge Copilot. Educational Institutional Prototype.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-slate-400 transition">Architecture & Safeguards</Link>
            <span>&bull;</span>
            <span className="text-slate-500">Zero-Hallucination Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
