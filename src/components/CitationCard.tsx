import React from 'react';
import { FileText, ExternalLink, Hash, Bookmark } from 'lucide-react';
import { Citation } from '../types';

interface CitationCardProps {
  citation: Citation;
  onViewSource: (citation: Citation) => void;
}

export const CitationCard: React.FC<CitationCardProps> = ({ citation, onViewSource }) => {
  return (
    <div className="group relative rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 p-4 transition-all duration-200 shadow-sm hover:shadow-cyan-500/10">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center shrink-0 text-cyan-400 group-hover:scale-105 transition">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-100 truncate group-hover:text-cyan-300 transition">
              {citation.documentName}
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
              <span className="inline-flex items-center gap-0.5 font-medium text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-900/50">
                <Hash className="w-3 h-3" />
                Page {citation.pageNumber}
              </span>
              <span className="truncate max-w-[150px] sm:max-w-[200px] text-slate-400">
                {citation.section}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onViewSource(citation)}
          className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition hover:scale-105 active:scale-95"
        >
          <span>View Source</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Relevant excerpt snippet */}
      <div className="mt-2.5 pt-2.5 border-t border-slate-800/80">
        <p className="text-xs text-slate-300 italic leading-relaxed line-clamp-3 bg-slate-950/60 p-2.5 rounded-lg border border-slate-900 font-serif">
          "{citation.excerpt}"
        </p>
      </div>

      {citation.similarity && (
        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
          <span className="text-slate-400">Semantic Relevance Score:</span>
          <span className="font-mono text-cyan-400 font-semibold">
            {(citation.similarity * 100).toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  );
};
