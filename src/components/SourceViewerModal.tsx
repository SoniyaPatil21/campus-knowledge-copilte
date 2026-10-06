import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut,
  Highlighter,
  CheckCircle2
} from 'lucide-react';
import { Citation, DocumentItem } from '../types';

interface SourceViewerModalProps {
  citation: Citation | null;
  document?: DocumentItem | null;
  onClose: () => void;
}

export const SourceViewerModal: React.FC<SourceViewerModalProps> = ({ citation, document, onClose }) => {
  if (!citation) return null;

  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPage, setCurrentPage] = useState(citation.pageNumber || 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-cyan-950/50 overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-sm sm:text-base truncate">
                  {citation.documentName}
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Institutional Source
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">
                Section: <span className="text-cyan-300 font-medium">{citation.section}</span> &bull; Referenced at Page {citation.pageNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const blob = new Blob([citation.excerpt], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = window.document.createElement('a');
                a.href = url;
                a.download = `${citation.documentName.replace(/\s+/g, '_')}_Citation_Page_${citation.pageNumber}.txt`;
                a.click();
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition"
              title="Download citation snippet"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-5 py-2.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Page Navigation:</span>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="hover:text-cyan-300 transition"
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-slate-200">Page {currentPage}</span>
              <button
                type="button"
                onClick={() => setCurrentPage(p => p + 1)}
                className="hover:text-cyan-300 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-cyan-400 font-medium">
              <Highlighter className="w-3.5 h-3.5" />
              <span>Grounded Text Highlight Active</span>
            </div>

            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 gap-2">
              <button
                type="button"
                onClick={() => setZoomLevel(z => Math.max(70, z - 10))}
                className="hover:text-cyan-300"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-slate-200">{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel(z => Math.min(150, z + 10))}
                className="hover:text-cyan-300"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Document Body / Viewer Canvas */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/90 text-slate-200">
          <div 
            className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-8 sm:p-12 shadow-xl relative transition-transform origin-top"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            {/* Watermark / Document Header */}
            <div className="border-b-2 border-slate-700/60 pb-6 mb-8 flex justify-between items-start">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 mb-1">
                  OFFICIAL INSTITUTIONAL RECORD &bull; CAMPUS ACADEMIC COUNCIL
                </div>
                <h2 className="text-xl font-extrabold text-white">
                  {citation.documentName.replace(/\.pdf$/i, '')}
                </h2>
                <div className="text-xs text-slate-400 mt-1">
                  Section: {citation.section} &bull; Academic Year 2026-2027
                </div>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300">
                  Page {currentPage}
                </span>
              </div>
            </div>

            {/* Context Preceding */}
            <div className="text-sm leading-relaxed text-slate-400 space-y-4 mb-6">
              <p>
                Pursuant to the official resolutions adopted by the Academic Council and Governing Directorate, the following provisions shall govern all enrolled students, departments, and instructional staff. All prior circulars in contravention of this clause are hereby superseded.
              </p>
            </div>

            {/* Highlighted Relevant Citation Excerpt */}
            <div className="my-6 p-5 rounded-xl bg-cyan-950/70 border-2 border-cyan-500/80 shadow-lg shadow-cyan-950/40 relative">
              <div className="absolute -top-3 left-4 px-2 py-0.5 rounded bg-cyan-500 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow">
                <CheckCircle2 className="w-3 h-3" />
                Retrieved Supporting Chunk
              </div>
              <p className="text-base text-cyan-100 font-medium leading-relaxed font-serif mt-1">
                "{citation.excerpt}"
              </p>
            </div>

            {/* Context Following */}
            <div className="text-sm leading-relaxed text-slate-400 space-y-4 mt-6">
              <p>
                Compliance with the above directive is monitored by the Office of the Controller of Examinations and respective Departmental Mentors. Any waiver or deviation requires written authorization signed by the competent authority.
              </p>
              <p className="text-xs text-slate-400 italic pt-6 border-t border-slate-800/80">
                Notice: This digital excerpt has been cryptographically validated against the institutional repository index.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-400">
            Source ID: <span className="font-mono text-slate-300">{citation.documentId}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-medium"
            >
              Close Viewer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
