import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { globalStore } from './server/store';
import { geminiRAGService } from './server/geminiService';
import { DocumentProcessor } from './server/documentProcessor';
import { DocumentItem, User } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ==========================================
// API ROUTES
// ==========================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Campus Knowledge Copilot API',
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('MY_GEMINI_API_KEY')),
    documentsCount: globalStore.getDocuments().length,
    activeChunksCount: globalStore.getChunks().length,
  });
});

// Auth Endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Support demo accounts seamlessly
  let user: User;
  if (email.toLowerCase().includes('admin') || role === 'admin') {
    user = {
      id: 'admin-01',
      name: 'Dr. Evelyn Vance (Admin)',
      email: email || 'admin@campus.edu',
      role: 'admin',
      department: 'Academic Administration & Registrar',
    };
  } else {
    user = {
      id: 'student-01',
      name: 'Aarav Sharma',
      email: email || 'aarav.sharma@campus.edu',
      role: 'student',
      department: 'Computer Science & Engineering',
      studentId: 'STU-2024-8839',
    };
  }

  res.json({ user, token: `token-${user.id}-${Date.now()}` });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, role, department, studentId } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const user: User = {
    id: `usr-${Date.now()}`,
    name,
    email,
    role: role || 'student',
    department: department || 'General Studies',
    studentId: studentId || (role === 'student' ? `STU-${Date.now().toString().slice(-4)}` : undefined),
  };

  res.json({ user, token: `token-${user.id}-${Date.now()}` });
});

// Documents Management Endpoints
app.get('/api/documents', (req, res) => {
  const docs = globalStore.getDocuments();
  res.json({ documents: docs });
});

app.get('/api/documents/:id', (req, res) => {
  const doc = globalStore.getDocumentById(req.params.id);
  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }
  res.json({ document: doc });
});

// Document Upload & Processing Pipeline
app.post('/api/documents/upload', async (req, res) => {
  try {
    const { name, fileName, fileType, fileDataBase64, category, version, uploadedBy, rawText } = req.body;

    if (!name || !fileName) {
      return res.status(400).json({ error: 'Document name and file name are required' });
    }

    const docId = `doc-${Date.now()}`;
    const validFileType = (['pdf', 'docx', 'txt', 'csv'].includes(fileType?.toLowerCase()) 
      ? fileType.toLowerCase() 
      : 'txt') as 'pdf' | 'docx' | 'txt' | 'csv';

    let fileBuffer: Buffer;
    if (fileDataBase64) {
      // Clean base64 header if present (e.g. data:application/pdf;base64,...)
      const cleaned = fileDataBase64.replace(/^data:.*?;base64,/, '');
      fileBuffer = Buffer.from(cleaned, 'base64');
    } else if (rawText) {
      fileBuffer = Buffer.from(rawText, 'utf-8');
    } else {
      fileBuffer = Buffer.from(`Sample Content for ${name}`, 'utf-8');
    }

    // Process document: extraction, page preserving, chunking
    const processed = await DocumentProcessor.processFile(
      fileBuffer,
      fileName,
      validFileType,
      docId,
      name,
      version || '1.0'
    );

    const newDoc: DocumentItem = {
      id: docId,
      name,
      fileName,
      fileType: validFileType,
      fileSize: fileBuffer.length,
      category: category || 'Institutional Documents',
      version: version || '1.0',
      isActive: true,
      uploadedBy: uploadedBy || 'Campus Administrator',
      uploadedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'completed',
      pageCount: processed.pageCount,
      chunkCount: processed.chunks.length,
      description: `Uploaded document with ${processed.chunks.length} indexed chunks across ${processed.pageCount} page(s).`,
      isDemo: false,
    };

    globalStore.addDocument(newDoc);
    globalStore.addChunks(processed.chunks);

    res.status(201).json({
      success: true,
      document: newDoc,
      chunksCreated: processed.chunks.length,
      pageCount: processed.pageCount,
    });
  } catch (err: any) {
    console.error('Error in document upload:', err);
    res.status(500).json({ error: err.message || 'Failed to process and index document' });
  }
});

// Toggle document active status
app.patch('/api/documents/:id/toggle-active', (req, res) => {
  const doc = globalStore.getDocumentById(req.params.id);
  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }
  const updated = globalStore.updateDocument(doc.id, { isActive: !doc.isActive });
  res.json({ document: updated });
});

// Re-index document
app.post('/api/documents/:id/reindex', (req, res) => {
  const doc = globalStore.getDocumentById(req.params.id);
  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }
  // Simulate re-indexing
  const updated = globalStore.updateDocument(doc.id, {
    status: 'completed',
    updatedAt: new Date().toISOString(),
  });
  res.json({ success: true, document: updated });
});

// Delete document
app.delete('/api/documents/:id', (req, res) => {
  const success = globalStore.deleteDocument(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Document not found' });
  }
  res.json({ success: true, message: 'Document and its chunks deleted successfully' });
});

// Reset demo knowledge base
app.post('/api/demo/reset', (req, res) => {
  globalStore.seedDefaults();
  res.json({
    success: true,
    message: 'Demo institutional documents re-initialized',
    documentsCount: globalStore.getDocuments().length,
  });
});

// RAG Question Answering Endpoint
app.post('/api/rag/query', async (req, res) => {
  try {
    const { question, userId } = req.body;
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const activeChunks = globalStore.getChunks(true);
    const activeDocsCount = globalStore.getDocuments().filter(d => d.isActive).length;

    const answerResult = await geminiRAGService.answerQuestion(
      question.trim(),
      activeChunks,
      activeDocsCount
    );

    // Save into question history
    globalStore.recordQuestion({
      id: answerResult.id,
      userId: userId || 'student-01',
      question: answerResult.question,
      answer: answerResult.answer,
      isFound: answerResult.isFound,
      confidence: answerResult.confidence,
      citations: answerResult.citations,
      hasConflict: answerResult.hasConflict,
      createdAt: answerResult.createdAt,
    }, answerResult.processingTimeMs);

    res.json(answerResult);
  } catch (err: any) {
    console.error('RAG query execution error:', err);
    res.status(500).json({ error: err.message || 'Error processing campus question' });
  }
});

// Question History Endpoints
app.get('/api/questions/history', (req, res) => {
  const userId = req.query.userId as string | undefined;
  const history = globalStore.getHistory(userId);
  res.json({ history });
});

app.delete('/api/questions/history/:id', (req, res) => {
  const success = globalStore.deleteHistoryItem(req.params.id);
  res.json({ success });
});

app.delete('/api/questions/history', (req, res) => {
  globalStore.clearHistory();
  res.json({ success: true, message: 'Question history cleared' });
});

// Analytics Endpoint
app.get('/api/analytics', (req, res) => {
  const analytics = globalStore.getAnalytics();
  res.json({ analytics });
});

// ==========================================
// VITE INTEGRATION / STATIC SERVING
// ==========================================

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Mounted Vite development middleware');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Campus Knowledge Copilot running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
