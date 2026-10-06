import React from 'react';
import { AlertTriangle, HelpCircle, FileText } from 'lucide-react';
import { RAGAnswer } from '../types';

interface ConflictAlertProps {
  conflictDetails: NonNullable<RAGAnswer['conflictDetails']>;
}

export const ConflictAlert: React.FC<ConflictAlertProps> = ({ conflictDetails }) => {
  return (
    <div className="rounded-xl bg-amber-950/40 border border-amber-600/50 p-4 sm:p-5 my-4 text-amber-200">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-amber-900/60 border border-amber-700/80 flex items-center justify-center shrink-0 text-amber-400">
          <AlertTriangle className="w-5 h-5 animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm sm:text-base text-amber-300 flex items-center gap-2">
            Conflicting Information Detected
          </h4>
          <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
            {conflictDetails.summary}
          </p>

          <div className="mt-3 space-y-2">
            {conflictDetails.sources.map((src, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/70 border border-amber-800/40 text-xs"
              >
                <FileText className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-amber-300">
                    Source {idx + 1}: {src.documentName} &bull; Page {src.pageNumber}
                  </div>
                  <div className="text-slate-300 mt-0.5 text-[11px]">
                    {src.statement}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3.5 pt-2.5 border-t border-amber-900/50 text-[11px] text-amber-300/80 flex items-center gap-1.5 font-medium">
            <HelpCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Please verify the latest official regulation or circular with the Academic Registrar.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
