export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  studentId?: string;
}

export type DocumentStatus = 
  | 'uploading' 
  | 'processing' 
  | 'extracting' 
  | 'chunking' 
  | 'embedding' 
  | 'indexing' 
  | 'completed' 
  | 'failed';

export interface DocumentChunk {
  id: string;
  documentId: string;
  documentName: string;
  chunkIndex: number;
  chunkText: string;
  pageNumber: number;
  section: string;
  documentVersion: string;
  embedding?: number[];
  similarity?: number;
}

export interface DocumentItem {
  id: string;
  name: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'txt' | 'csv';
  fileSize: number;
  category: string;
  version: string;
  isActive: boolean;
  uploadedBy: string;
  uploadedAt: string;
  updatedAt: string;
  status: DocumentStatus;
  pageCount: number;
  chunkCount: number;
  description?: string;
  isDemo?: boolean;
  content?: string;
  chunks?: DocumentChunk[];
}

export interface Citation {
  id: string;
  documentId: string;
  documentName: string;
  pageNumber: number;
  section: string;
  excerpt: string;
  similarity: number;
}

export interface RAGAnswer {
  id: string;
  questionId: string;
  question: string;
  answer: string;
  confidence: number;
  isFound: boolean;
  hasConflict: boolean;
  conflictDetails?: {
    summary: string;
    sources: Array<{
      documentName: string;
      pageNumber: number;
      statement: string;
    }>;
  };
  citations: Citation[];
  searchedDocumentsCount: number;
  suggestedTopics?: string[];
  language?: 'en' | 'hi' | 'mr';
  processingTimeMs: number;
  createdAt: string;
}

export interface QuestionHistoryItem {
  id: string;
  userId: string;
  question: string;
  answer: string;
  isFound: boolean;
  confidence: number;
  citations: Citation[];
  hasConflict: boolean;
  createdAt: string;
}

export interface AnalyticsData {
  totalDocuments: number;
  processedDocuments: number;
  totalChunks: number;
  totalQuestions: number;
  questionsAnswered: number;
  questionsNotFound: number;
  averageSimilarity: number;
  averageResponseTimeMs: number;
  questionsPerDay: Array<{ date: string; count: number }>;
  topTopics: Array<{ topic: string; count: number }>;
  documentUsage: Array<{ documentName: string; usageCount: number; percentage: number }>;
}
