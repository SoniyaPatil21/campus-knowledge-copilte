import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Database,
  Layers,
  FileCode,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import { DocumentStatus } from '../types';

export const AdminUploadPage: React.FC = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [docName, setDocName] = useState('');
  const [category, setCategory] = useState('Academics');
  const [version, setVersion] = useState('1.0');
  const [issuer, setIssuer] = useState('Office of the Registrar');
  const [rawText, setRawText] = useState('');

  // Pipeline Status Tracker
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultSummary, setResultSummary] = useState<{
    chunksCount: number;
    pageCount: number;
    docName: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const statusSteps: Array<{ key: DocumentStatus; label: string }> = [
    { key: 'uploading', label: 'Uploading Document' },
    { key: 'processing', label: 'Validating File Format' },
    { key: 'extracting', label: 'Extracting Text & Pages' },
    { key: 'chunking', label: 'Semantic Chunking (~500 tokens)' },
    { key: 'embedding', label: 'Generating Vector Embeddings' },
    { key: 'indexing', label: 'Indexing to pgvector Store' },
    { key: 'completed', label: 'Ready for Grounded Retrieval' },
  ];

  const categories = [
    'Examination', 
    'Attendance', 
    'Academics', 
    'Scholarships', 
    'Timetable', 
    'Placements', 
    'Student Rules', 
    'Events',
    'General Notices'
  ];

  // Quick Demo Templates for instant test upload
  const sampleTemplates = [
    {
      title: 'Hostel Mess Regulations 2026.txt',
      name: 'Hostel Mess Regulations & Menu 2026',
      category: 'Student Rules',
      version: '1.0',
      text: `HOSTEL MESS REGULATIONS & SCHEDULE 2026-2027
Office of Student Housing & Dining Services
Effective Date: October 1, 2026

Section 1: Operating Hours & Meal Schedule
Breakfast is served from 07:30 AM to 09:00 AM daily.
Lunch is served from 12:30 PM to 02:00 PM.
Evening tea and snacks: 04:30 PM to 05:30 PM.
Dinner: 07:30 PM to 09:30 PM.

Section 2: Weekly Menu Special Rotation
Monday Dinner: Paneer Butter Masala, Dal Tadka, Jeera Rice, and Gulab Jamun.
Tuesday Dinner: Rajma Chawal, Mixed Vegetable Curry, and Fruit Custard.
Wednesday Dinner: Special Biryani (Vegetable & Chicken Biryani options available).

Section 3: Dining Hall Hygiene & Etiquette
Students must wear proper casual attire in the dining hall. Carrying mess utensils to dorm rooms is strictly prohibited with a fine of ₹200 per violation.`,
    },
    {
      title: 'Campus Shuttle Bus Schedule 2026.csv',
      name: 'Campus Shuttle Bus Schedule 2026',
      category: 'General Notices',
      version: '1.2',
      text: `Route,Starting Point,Destination,Departure Time,Frequency
Route 1,Main Gate,Hostel Block 4,08:00 AM,Every 15 minutes
Route 2,Metro Station,Tech Tower,08:30 AM,Every 20 minutes
Route 3,Sports Complex,Library Wing,09:00 AM,Every 30 minutes
Night Route,Girls Hostel,Central Lab,09:30 PM,On Demand`,
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      if (!docName) {
        setDocName(selected.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleApplyTemplate = (tmpl: typeof sampleTemplates[0]) => {
    setDocName(tmpl.name);
    setCategory(tmpl.category);
    setVersion(tmpl.version);
    setRawText(tmpl.text);
    setFile(null);
  };

  const simulateStep = (status: DocumentStatus, ms: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setCurrentStatus(status);
        resolve(true);
      }, ms);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) {
      setErrorMessage('Please enter a document name.');
      return;
    }
    if (!file && !rawText.trim()) {
      setErrorMessage('Please upload a file or choose a sample template.');
      return;
    }

    setErrorMessage('');
    setIsProcessing(true);
    setCurrentStatus('uploading');

    try {
      let fileDataBase64: string | undefined = undefined;
      let fileType = 'txt';
      let fileName = `${docName.replace(/\s+/g, '_')}.txt`;

      if (file) {
        fileName = file.name;
        const ext = file.name.split('.').pop()?.toLowerCase() || 'txt';
        fileType = ext;

        // Read file as base64
        const buffer = await file.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        fileDataBase64 = base64;
      }

      // Visual progress tracking through all required stages
      await simulateStep('processing', 400);
      await simulateStep('extracting', 500);
      await simulateStep('chunking', 500);
      await simulateStep('embedding', 600);
      await simulateStep('indexing', 500);

      const response = await api.uploadDocument({
        name: docName.trim(),
        fileName,
        fileType,
        fileDataBase64,
        rawText: fileDataBase64 ? undefined : rawText,
        category,
        version,
        uploadedBy: issuer,
      });

      await simulateStep('completed', 300);

      setResultSummary({
        chunksCount: response.chunksCreated,
        pageCount: response.document.pageCount,
        docName: response.document.name,
      });
    } catch (err: any) {
      console.error('Upload failed:', err);
      setCurrentStatus('failed');
      setErrorMessage(err.message || 'Processing failed. Please check file format.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="pb-6 border-b border-slate-800 mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>ADMINISTRATIVE INGESTION ENGINE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Upload Institutional Documents
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Index new circulars, timetables, and guidelines. Documents are parsed, split into 500-token chunks with overlap, embedded, and saved to pgvector.
        </p>
      </div>

      {/* Quick Demo Templates */}
      <div className="mb-8 p-5 rounded-2xl bg-purple-950/30 border border-purple-800/40">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Instant Hackathon Test Templates</span>
        </div>
        <p className="text-xs text-slate-300 mb-4">
          Click a pre-configured official sample below to test the full processing pipeline and immediately ask questions in Copilot Chat:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sampleTemplates.map((tmpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyTemplate(tmpl)}
              className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-left transition text-xs group"
            >
              <div className="font-bold text-slate-200 group-hover:text-purple-300 transition">
                {tmpl.name}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Category: {tmpl.category} &bull; Formatted {tmpl.title.split('.').pop()?.toUpperCase()}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Drag & Drop Area */}
        <div className="p-8 rounded-2xl bg-slate-900/80 border-2 border-dashed border-slate-700 hover:border-purple-500/80 transition-all text-center">
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt,.csv"
            className="hidden"
          />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-950/80 border border-purple-800/80 flex items-center justify-center text-purple-400 mb-4 shadow-lg shadow-purple-950">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div className="text-sm font-bold text-slate-100">
              {file ? file.name : 'Click to select or drag institutional document'}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Supported Formats: <strong className="text-slate-300">PDF, DOCX, TXT, CSV</strong>
            </p>
            {file && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-xs">
                <Check className="w-3.5 h-3.5" />
                <span>Selected: {(file.size / 1024).toFixed(1)} KB</span>
              </div>
            )}
          </label>
        </div>

        {/* Or Text Payload Display */}
        {rawText && (
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-2">
              <span>Template Content Preview:</span>
              <button
                type="button"
                onClick={() => setRawText('')}
                className="text-red-400 hover:underline"
              >
                Clear
              </button>
            </div>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={5}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-purple-500"
            />
          </div>
        )}

        {/* Metadata Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Official Document Title *
            </label>
            <input
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="e.g. Examination Rules 2026.pdf"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Knowledge Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Regulation Version *
            </label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="e.g. 2.1 or 2026"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Issuing Bureau / Authority *
            </label>
            <input
              type="text"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="e.g. Office of the Registrar"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800 text-xs text-red-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white transition-all shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Processing Document Pipeline...</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4" />
              <span>Process & Index Document</span>
            </>
          )}
        </button>
      </form>

      {/* Live Processing Pipeline Stepper */}
      {currentStatus && (
        <div className="mt-10 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Document Processing Pipeline Status</span>
            </h3>
            <span className="font-mono text-xs text-purple-300 uppercase">
              {currentStatus}
            </span>
          </div>

          <div className="space-y-4">
            {statusSteps.map((step, idx) => {
              const isPast = statusSteps.findIndex(s => s.key === currentStatus) > idx;
              const isCurrent = step.key === currentStatus;

              return (
                <div key={step.key} className="flex items-center gap-3 text-xs">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                    isPast
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : isCurrent
                      ? 'bg-purple-950 text-purple-300 border border-purple-500 animate-pulse'
                      : 'bg-slate-950 text-slate-600 border border-slate-800'
                  }`}>
                    {isPast ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                  </div>

                  <div className={`flex-1 font-medium ${
                    isPast ? 'text-slate-200' : isCurrent ? 'text-purple-300 font-bold' : 'text-slate-500'
                  }`}>
                    {step.label}
                  </div>
                </div>
              );
            })}
          </div>

          {resultSummary && (
            <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-950/20 p-4 rounded-xl border border-emerald-900/40">
              <div className="text-xs text-emerald-300">
                <strong>{resultSummary.docName}</strong> indexed successfully! Created <strong>{resultSummary.chunksCount} chunks</strong> across <strong>{resultSummary.pageCount} page(s)</strong>.
              </div>
              <button
                type="button"
                onClick={() => navigate('/chat', { state: { initialQuestion: `What are the rules in ${resultSummary.docName}?` } })}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shrink-0"
              >
                <span>Ask Copilot Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
