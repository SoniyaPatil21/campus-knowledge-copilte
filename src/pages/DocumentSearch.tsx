import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  FileText, 
  Filter, 
  ExternalLink, 
  Calendar, 
  Hash, 
  CheckCircle2, 
  MessageSquareText, 
  Download, 
  RefreshCw,
  Tag
} from 'lucide-react';
import { api } from '../services/api';
import { DocumentItem } from '../types';

export const DocumentSearch: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedType, setSelectedType] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<DocumentItem | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getDocuments();
        setDocuments(data);
      } catch (err) {
        console.error('Failed to load documents:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = ['All', 'Examination', 'Attendance', 'Academics', 'Scholarships', 'Timetable', 'Placements', 'Student Rules', 'Events'];
  const fileTypes = ['All', 'pdf', 'docx', 'txt', 'csv'];

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || doc.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesType = selectedType === 'All' || doc.fileType.toLowerCase() === selectedType.toLowerCase();

    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Campus Institutional Documents
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Search and inspect official university documents, academic circulars, regulations, and handbooks indexed in pgvector.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg mb-8 space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by document title, regulation keyword, rule, or circular..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/80 text-xs">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg transition shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-cyan-600 text-white font-semibold shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* File Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Format:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-500"
            >
              {fileTypes.map((ft) => (
                <option key={ft} value={ft}>
                  {ft.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results List */}
      {loading ? (
        <div className="py-16 text-center text-cyan-400 flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="text-xs font-mono">Loading institutional knowledge base...</span>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400">
          <FileText className="w-10 h-10 mx-auto text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-slate-200">No documents found</h3>
          <p className="text-xs mt-1">Try adjusting your keyword search or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition flex flex-col justify-between group shadow-sm hover:shadow-cyan-500/10"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-100 text-sm truncate group-hover:text-cyan-300 transition">
                        {doc.name}
                      </h3>
                      <div className="text-[11px] text-slate-400">
                        {doc.category}
                      </div>
                    </div>
                  </div>

                  <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-300 border border-slate-700">
                    v{doc.version}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                  {doc.description || 'Institutional regulatory document containing administrative instructions and policies.'}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800/80 text-[11px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Hash className="w-3 h-3 text-cyan-400" />
                    {doc.pageCount} Pages &bull; {doc.chunkCount} Chunks
                  </span>
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    Indexed
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Link
                    to={`/chat`}
                    state={{ initialQuestion: `What are the key points in ${doc.name}?` }}
                    className="flex-1 py-2 px-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold text-center border border-cyan-500/30 transition flex items-center justify-center gap-1.5"
                  >
                    <MessageSquareText className="w-3.5 h-3.5" />
                    <span>Query Copilot</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setSelectedDocForPreview(doc)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="View Document Details"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Details Preview Modal */}
      {selectedDocForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{selectedDocForPreview.name}</h3>
                  <p className="text-xs text-slate-400">
                    Category: {selectedDocForPreview.category} &bull; Version: {selectedDocForPreview.version}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDocForPreview(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
              <div><strong>Document ID:</strong> {selectedDocForPreview.id}</div>
              <div><strong>Original File:</strong> {selectedDocForPreview.fileName}</div>
              <div><strong>Format:</strong> {selectedDocForPreview.fileType.toUpperCase()}</div>
              <div><strong>Issued By:</strong> {selectedDocForPreview.uploadedBy}</div>
              <div><strong>Page Count:</strong> {selectedDocForPreview.pageCount}</div>
              <div><strong>Extracted Vector Chunks:</strong> {selectedDocForPreview.chunkCount}</div>
              <div><strong>Uploaded At:</strong> {new Date(selectedDocForPreview.uploadedAt).toLocaleDateString()}</div>
              <div><strong>Index Status:</strong> Completed & Active in pgvector</div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedDocForPreview(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold"
              >
                Close
              </button>
              <Link
                to="/chat"
                state={{ initialQuestion: `Summarize the main provisions of ${selectedDocForPreview.name}` }}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <MessageSquareText className="w-3.5 h-3.5" />
                Ask Copilot About This Document
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
