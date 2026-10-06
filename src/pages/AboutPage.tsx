import React from 'react';
import { 
  GraduationCap, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Database, 
  Search, 
  Layers, 
  FileCheck, 
  Cpu, 
  Globe, 
  Terminal,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="pb-8 border-b border-slate-800 mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/80 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Hackathon Problem EDU-02: Campus Knowledge Copilot</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          System Architecture & Safeguards
        </h1>
        <p className="text-sm text-cyan-300 font-semibold mt-1">
          "Ask your campus. Get the answer. Know the source."
        </p>
      </div>

      <div className="space-y-10">
        {/* The Problem & Solution */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-cyan-400" />
            <span>Problem & Solution Overview</span>
          </h2>
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
            <p>
              Educational institutions produce countless notices, exam rules, timetables, and guidelines across dense PDF circulars. Students waste hours searching or rely on word-of-mouth rumors.
            </p>
            <p>
              <strong>Campus Knowledge Copilot</strong> solves this by implementing an isolated Retrieval-Augmented Generation (RAG) system grounded in institutional documents. Crucially, the AI is constrained by strict verification guardrails: it answers <em>only</em> from retrieved document chunks and cites the exact document, page number, and section title for every claim.
            </p>
          </div>
        </div>

        {/* Evaluation Metrics Breakdown */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Hackathon Rubric Alignment</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="font-bold text-cyan-300 block mb-1">Retrieval Accuracy (25%)</span>
              <p className="text-slate-400 leading-relaxed">
                Vector similarity search via pgvector and multilingual feature representation with strict similarity thresholding (0.38+).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="font-bold text-emerald-300 block mb-1">Answer Accuracy (20%)</span>
              <p className="text-slate-400 leading-relaxed">
                Gemini 3.8 Flash answers solely within the bounds of retrieved context, extracting specific percentages, dates, and requirements.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="font-bold text-indigo-300 block mb-1">Citation Correctness (20%)</span>
              <p className="text-slate-400 leading-relaxed">
                Every generated answer includes document name, page number, section, and clickable preview in the Source Viewer.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="font-bold text-purple-300 block mb-1">Hallucination Control (15%)</span>
              <p className="text-slate-400 leading-relaxed">
                Queries outside the available institutional records strictly trigger the verified refusal response rather than fabricating answers.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="font-bold text-yellow-300 block mb-1">Conflict Detection</span>
              <p className="text-slate-400 leading-relaxed">
                Detects contradictory clauses across active documents (e.g., 75% standard vs 80% honors) and displays a dual-source alert.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="font-bold text-teal-300 block mb-1">Multilingual Inquiries</span>
              <p className="text-slate-400 leading-relaxed">
                Seamlessly supports questions posed in English, Hindi (हिन्दी), and Marathi (मराठी) mapped to the same underlying knowledge base.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Architecture Stack */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-400" />
            <span>Technology Stack</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="text-cyan-400 font-bold uppercase text-[11px]">Frontend</div>
              <div>&bull; React 19 + TypeScript (Vite)</div>
              <div>&bull; Tailwind CSS v4</div>
              <div>&bull; React Router v7</div>
              <div>&bull; Lucide React Icons</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="text-purple-400 font-bold uppercase text-[11px]">Backend & Deployment</div>
              <div>&bull; Express Server (port 3000)</div>
              <div>&bull; Netlify Functions (netlify/functions/api.ts)</div>
              <div>&bull; Supabase PostgreSQL + pgvector</div>
              <div>&bull; @google/genai TypeScript SDK</div>
            </div>
          </div>
        </div>

        {/* Database Tables */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-400" />
            <span>Database Tables Schema (Supabase)</span>
          </h2>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono">
              <strong className="text-cyan-300">DOCUMENTS:</strong> id, name, file_name, file_type, storage_path, version, uploaded_by, uploaded_at, status, page_count, chunk_count
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono">
              <strong className="text-cyan-300">DOCUMENT_CHUNKS:</strong> id, document_id, chunk_text, embedding (vector 768), page_number, section, chunk_index, created_at
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono">
              <strong className="text-cyan-300">QUESTIONS:</strong> id, user_id, question, created_at
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono">
              <strong className="text-cyan-300">ANSWERS:</strong> id, question_id, answer, confidence, created_at
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono">
              <strong className="text-cyan-300">CITATIONS:</strong> id, answer_id, document_id, chunk_id, page_number, section, excerpt
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono">
              <strong className="text-cyan-300">USERS & DOCUMENT_VERSIONS:</strong> user roles (student, admin), document version history & active flags
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
