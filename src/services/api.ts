import { DocumentItem, RAGAnswer, QuestionHistoryItem, AnalyticsData, User } from '../types';

export const API_BASE = '/api';

export const api = {
  // Auth
  async login(email: string, role?: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role }),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  async register(data: Partial<User>): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
  },

  // Documents
  async getDocuments(): Promise<DocumentItem[]> {
    const res = await fetch(`${API_BASE}/documents`);
    if (!res.ok) throw new Error('Failed to fetch documents');
    const data = await res.json();
    return data.documents;
  },

  async getDocument(id: string): Promise<DocumentItem> {
    const res = await fetch(`${API_BASE}/documents/${id}`);
    if (!res.ok) throw new Error('Failed to fetch document');
    const data = await res.json();
    return data.document;
  },

  async uploadDocument(payload: {
    name: string;
    fileName: string;
    fileType: string;
    fileDataBase64?: string;
    rawText?: string;
    category?: string;
    version?: string;
    uploadedBy?: string;
  }): Promise<{ success: boolean; document: DocumentItem; chunksCreated: number }> {
    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to upload document');
    }
    return res.json();
  },

  async toggleDocumentActive(id: string): Promise<DocumentItem> {
    const res = await fetch(`${API_BASE}/documents/${id}/toggle-active`, {
      method: 'PATCH',
    });
    if (!res.ok) throw new Error('Failed to toggle status');
    const data = await res.json();
    return data.document;
  },

  async reindexDocument(id: string): Promise<{ success: boolean; document: DocumentItem }> {
    const res = await fetch(`${API_BASE}/documents/${id}/reindex`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to reindex document');
    return res.json();
  },

  async deleteDocument(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/documents/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete document');
    const data = await res.json();
    return data.success;
  },

  async resetDemoDocuments(): Promise<void> {
    await fetch(`${API_BASE}/demo/reset`, { method: 'POST' });
  },

  // RAG Query
  async askQuestion(question: string, userId?: string): Promise<RAGAnswer> {
    const res = await fetch(`${API_BASE}/rag/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, userId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate answer');
    }
    return res.json();
  },

  // History
  async getHistory(userId?: string): Promise<QuestionHistoryItem[]> {
    const res = await fetch(`${API_BASE}/questions/history${userId ? `?userId=${userId}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch history');
    const data = await res.json();
    return data.history;
  },

  async deleteHistoryItem(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/questions/history/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete history item');
    const data = await res.json();
    return data.success;
  },

  async clearHistory(): Promise<boolean> {
    const res = await fetch(`${API_BASE}/questions/history`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to clear history');
    return true;
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsData> {
    const res = await fetch(`${API_BASE}/analytics`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    const data = await res.json();
    return data.analytics;
  },
};
