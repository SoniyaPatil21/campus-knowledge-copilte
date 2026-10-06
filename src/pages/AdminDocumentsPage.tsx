import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  UploadCloud, 
  ShieldCheck, 
  Hash, 
  AlertTriangle,
  RotateCw,
  ExternalLink,
  Layers,
  Calendar
} from 'lucide-react';
import { api } from '../services/api';
import { DocumentItem } from '../types';

export const AdminDocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [deleteConfirmDoc, setDeleteConfirmDoc] = useState<DocumentItem | null>(null);

  useEffect(() => {
    loadDocs();
  }, []);

  async function loadDocs() {
    setLoading(true);
    try {
      const docs = await api.getDocuments();
      setDocuments(docs);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleToggleActive = async (doc: DocumentItem) => {
    setActionLoadingId(doc.id);
    try {
      const updated = await api.toggleDocumentActive(doc.id);
      setDocuments(prev => prev.map(d => d.id === doc.id ? updated : d));
    } catch (err) {
      console.error('Toggle error:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReindex = async (doc: DocumentItem) => {
    setActionLoadingId(doc.id);
    try {
      const res = await api.reindexDocument(doc.id);
      if (res.success) {
        setDocuments(prev => prev.map(d => d.id === doc.id ? res.document : d));
      }
    } catch (err) {
      console.error('Reindex error:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmDoc) return;
    setActionLoadingId(deleteConfirmDoc.id);
    try {
      await api.deleteDocument(deleteConfirmDoc.id);
      setDocuments(prev => prev.filter(d => d.id !== deleteConfirmDoc.id));
      setDeleteConfirmDoc(null);
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredDocs = documents.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || d.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = ['All', 'Examination', 'Attendance', 'Academics', 'Scholarships', 'Timetable', 'Placements', 'Student Rules', 'Events'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>INSTITUTIONAL REPOSITORY MANAGEMENT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Document & Version Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Control active versions, re-index vector chunks, and manage document lifecycles.
          </p>
        </div>

        <Link
          to="/admin/upload"
          className="px-5 py-2.5 rounded-xl font-bold text-xs bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/25 transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search documents or filenames..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {categories.slice(0, 6).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded text-xs transition shrink-0 ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table of Documents */}
      {loading ? (
        <div className="py-16 text-center text-purple-400 flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="text-xs font-mono">Loading document repository...</span>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400">
          <FileText className="w-10 h-10 mx-auto text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-slate-200">No documents found</h3>
        </div>
      ) : (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Document & File</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Version</th>
                  <th className="py-3.5 px-4">Pages & Chunks</th>
                  <th className="py-3.5 px-4">Status & Active</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-purple-400 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-100 truncate max-w-xs sm:max-w-md">
                            {doc.name}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono truncate">
                            {doc.fileName} &bull; {new Date(doc.uploadedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-950 border border-slate-800 text-slate-300">
                        {doc.category}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-purple-300">
                      v{doc.version}
                    </td>

                    <td className="py-4 px-4 font-mono text-[11px] text-slate-400">
                      {doc.pageCount} pgs &bull; <span className="text-cyan-400 font-semibold">{doc.chunkCount} chunks</span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(doc)}
                          disabled={actionLoadingId === doc.id}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold transition ${
                            doc.isActive
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                          title="Click to toggle version active/inactive"
                        >
                          {doc.isActive ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-slate-500" />
                              <span>Inactive</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleReindex(doc)}
                          disabled={actionLoadingId === doc.id}
                          className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 transition"
                          title="Re-index document in pgvector"
                        >
                          <RotateCw className={`w-3.5 h-3.5 ${actionLoadingId === doc.id ? 'animate-spin text-cyan-400' : ''}`} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteConfirmDoc(doc)}
                          className="p-1.5 rounded-lg bg-slate-950 hover:bg-red-950/60 border border-slate-800 text-slate-400 hover:text-red-300 transition"
                          title="Delete Document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-red-900/60 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800/80 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Confirm Document Deletion</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Are you sure you want to permanently delete <strong className="text-white">"{deleteConfirmDoc.name}"</strong>? All associated pgvector embeddings and chunks will be unlinked.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDeleteConfirmDoc(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-600/20"
              >
                Delete Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
