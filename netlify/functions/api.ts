import { globalStore } from '../../server/store';
import { geminiRAGService } from '../../server/geminiService';
import { DocumentProcessor } from '../../server/documentProcessor';

// Handler for Netlify serverless functions
export const handler = async (event: any, context: any) => {
  const path = event.path.replace(/\/\.netlify\/functions\/api/, '').replace(/^\/api/, '');
  const method = event.httpMethod;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  };

  if (method === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Health
    if (path === '/health' && method === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'ok',
          service: 'Netlify Campus Knowledge Copilot API',
          documentsCount: globalStore.getDocuments().length,
        }),
      };
    }

    // Documents
    if (path === '/documents' && method === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ documents: globalStore.getDocuments() }),
      };
    }

    // RAG Query
    if (path === '/rag/query' && method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { question, userId } = body;
      if (!question) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Question is required' }) };
      }

      const activeChunks = globalStore.getChunks(true);
      const activeDocsCount = globalStore.getDocuments().filter(d => d.isActive).length;

      const answerResult = await geminiRAGService.answerQuestion(
        question.trim(),
        activeChunks,
        activeDocsCount
      );

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

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(answerResult),
      };
    }

    // History
    if (path === '/questions/history' && method === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ history: globalStore.getHistory() }),
      };
    }

    // Analytics
    if (path === '/analytics' && method === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ analytics: globalStore.getAnalytics() }),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: `Route ${method} ${path} not found` }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || 'Server error' }),
    };
  }
};
