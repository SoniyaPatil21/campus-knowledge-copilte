import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  MessageSquareText, 
  FileSearch, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  AlertOctagon, 
  Database, 
  Search, 
  FileCheck, 
  Clock, 
  ChevronRight,
  BookOpen
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const whyItMattersQuestions = [
    {
      q: 'What is the minimum attendance required?',
      ans: 'Minimum Attendance: 75% in each enrolled theory & lab course.',
      src: 'Examination Rules.pdf — Page 12',
    },
    {
      q: 'What documents are required for scholarship renewal?',
      ans: 'Grade Card (min CGPA 8.0), Income Certificate (<₹3.5L), fee receipt, bank passbook.',
      src: 'Scholarship Guidelines.pdf — Page 2',
    },
    {
      q: 'When is the semester examination?',
      ans: 'Commences December 1, 2026, and concludes December 22, 2026.',
      src: 'Semester Timetable.pdf — Page 1',
    },
    {
      q: 'What is the examination eligibility criteria?',
      ans: '75% attendance across all registered courses. Condonation up to 10% on medical grounds.',
      src: 'Attendance Policy.pdf — Page 5',
    },
    {
      q: 'Where can I find the placement guidelines?',
      ans: 'CGPA ≥ 6.5, zero active backlogs, 80% training attendance, register on T&P Portal.',
      src: 'Placement Cell Guidelines.pdf — Page 2',
    },
    {
      q: 'What are the hostel curfew and library timings?',
      ans: 'Library open 08:00 AM - 10:00 PM. First-year hostel curfew is 09:00 PM.',
      src: 'Student Handbook.pdf — Page 11 & 22',
    },
  ];

  const features = [
    {
      icon: MessageSquareText,
      title: 'Ask in Natural Language',
      desc: 'Students can query in English, Hindi, or Marathi without needing exact keyword syntax or navigating complex PDF tables.',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Database,
      title: 'Multi-Document Knowledge Base',
      desc: 'Seamlessly aggregates circulars, attendance policies, examination guidelines, academic regulations, scholarship rules, and timetables.',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      icon: FileCheck,
      title: 'Source-Level Citations',
      desc: 'Every answer specifies the exact document name, page number, and section title, with one-click direct excerpt viewing.',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: AlertOctagon,
      title: 'Strict Hallucination Control',
      desc: 'The AI answers ONLY from verified institutional documents. If data does not exist, it clearly admits absence instead of guessing.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Search,
      title: 'Smart Document Search',
      desc: 'Full-text & vector hybrid search allows filtering by academic category, file type, semester calendar, and document version.',
      color: 'from-teal-500 to-cyan-500',
    },
    {
      icon: ShieldCheck,
      title: 'Admin Document Management',
      desc: 'Registry staff can upload PDFs, Word files, TXT, and CSV notices with automated text extraction, chunking, and version tracking.',
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-cyan-900/20 via-blue-900/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="pt-20 pb-16 sm:pt-28 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Hackathon Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-semibold mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Hackathon Problem EDU-02: Education & Technology</span>
          <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
          <span className="text-slate-300">Verified RAG Guardrails</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
          CAMPUS KNOWLEDGE <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            COPILOT
          </span>
        </h1>

        {/* Tagline */}
        <p className="mt-4 text-xl sm:text-2xl font-bold text-cyan-300 max-w-3xl mx-auto">
          "Ask your campus. Get the answer. Know the source."
        </p>

        {/* Hero Description */}
        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          An AI-powered campus knowledge assistant that helps students instantly find accurate answers from official institutional documents.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/chat"
            className="px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 transition-all duration-200 shadow-lg shadow-cyan-500/25 flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            <MessageSquareText className="w-4 h-4 text-slate-950" />
            <span>Ask a Question</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </Link>

          <Link
            to="/search"
            className="px-8 py-3.5 rounded-xl font-bold text-sm bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all duration-200 flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            <FileSearch className="w-4 h-4 text-cyan-400" />
            <span>Explore Knowledge</span>
          </Link>
        </div>

        {/* RAG Pipeline Flow Diagram */}
        <div className="mt-16 sm:mt-20 max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-2xl backdrop-blur-md">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-6">
            Institutional RAG Verification Flow
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-lg bg-blue-950/80 border border-blue-800/80 flex items-center justify-center text-blue-400 mb-2">
                <MessageSquareText className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200">1. Student Question</span>
              <span className="text-[10px] text-slate-400 mt-1">Natural language query in EN / HI / MR</span>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center text-cyan-400 mb-2">
                <Search className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200">2. Vector Retrieval</span>
              <span className="text-[10px] text-slate-400 mt-1">pgvector similarity threshold search</span>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-800/80 flex items-center justify-center text-indigo-400 mb-2">
                <Database className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200">3. Official Documents</span>
              <span className="text-[10px] text-slate-400 mt-1">Preserved page & section chunks</span>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/50 shadow-md shadow-cyan-950 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400 mb-2">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-cyan-300">4. Answer + Source</span>
              <span className="text-[10px] text-slate-400 mt-1">Zero hallucination & exact citation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Why It Matters
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            Instead of spending hours downloading, scrolling, and searching through dozens of dense PDF circulars, students get authoritative answers in seconds with the verified clause cited.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {whyItMattersQuestions.map((item, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider mb-2">
                  Sample Query {idx + 1}
                </div>
                <h3 className="font-bold text-slate-100 text-sm mb-3">
                  "{item.q}"
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-900">
                  {item.ans}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono text-cyan-400 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {item.src}
                </span>
                <Link to="/chat" className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center">
                  Try &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">
            Core System Capabilities
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Engineered for Academic Precision
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.color} p-0.5 mb-5`}>
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-300">
                  <feat.icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="font-bold text-base text-slate-100 mb-2">
                {feat.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-cyan-950/60 to-slate-900 border border-cyan-800/40 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Ready to query your campus documents?
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto mb-8">
              Experience natural language query resolution with strict source citations and zero fabricated claims.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/chat"
                className="px-6 py-3 rounded-xl font-bold text-sm bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition shadow-lg shadow-cyan-500/20"
              >
                Launch Campus Copilot Chat
              </Link>
              <Link
                to="/student/dashboard"
                className="px-6 py-3 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-white transition"
              >
                Open Student Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
