import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  History, 
  Trash2, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw, 
  Search,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { api } from '../services/api';
import { QuestionHistoryItem, Citation } from '../types';
import { useAuth } from '../context/AuthContext';
import { SourceViewerModal } from '../components/SourceViewerModal';

export const QuestionHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<QuestionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);

  useEffect(() => {
    loadHistory();
  }, [user]);

  async function loadHistory() {
    setLoading(true);
    try {
      const data = await api.getHistory(user?.id);
      setHistory(data);
    } catch (err) {
      console.error('Failed to load question history:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteItem = async (id: string) => {
    try {
      await api.deleteHistoryItem(id);
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear your entire question history?')) return;
    try {
      await api.clearHistory();
      setHistory([]);
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  const filteredHistory = history.filter(item => 
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <History className="w-7 h-7 text-cyan-400" />
            <span>Question History</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review past student inquiries, grounded answers, and verified institutional sources.
          </p>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800/60 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      {history.length > 0 && (
        <div className="relative mb-6">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search past questions or answers..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-cyan-400 flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="text-xs font-mono">Loading history records...</span>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400">
          <History className="w-10 h-10 mx-auto text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-slate-200">No questions recorded</h3>
          <p className="text-xs mt-1">Ask questions in the Copilot Chat to build your grounded history.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    {item.isFound ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                        <CheckCircle2 className="w-3 h-3" />
                        Grounded Answer
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-red-950 text-red-300 border border-red-800/60">
                        <AlertTriangle className="w-3 h-3" />
                        Refusal (No Record)
                      </span>
                    )}

                    <span className="text-[11px] text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 mb-2">
                    {item.question}
                  </h3>

                  <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/70 p-3.5 rounded-xl border border-slate-900">
                    {item.answer}
                  </div>

                  {/* Sources Preview */}
                  {item.citations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-400">Cited Sources:</span>
                      {item.citations.map((c, cidx) => (
                        <button
                          key={cidx}
                          type="button"
                          onClick={() => setSelectedCitation(c)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 text-[11px] text-cyan-300 border border-slate-800 transition"
                        >
                          <FileText className="w-3 h-3 text-cyan-400" />
                          <span>{c.documentName} (Pg {c.pageNumber})</span>
                          <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => navigate('/chat', { state: { initialQuestion: item.question } })}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-slate-950 transition"
                    title="Ask this question again"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCitation && (
        <SourceViewerModal
          citation={selectedCitation}
          onClose={() => setSelectedCitation(null)}
        />
      )}
    </div>
  );
};
