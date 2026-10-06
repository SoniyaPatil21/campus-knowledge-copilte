import { DocumentItem, DocumentChunk, QuestionHistoryItem, AnalyticsData } from '../src/types';
import { INITIAL_DEMO_DOCUMENTS, INITIAL_DEMO_CHUNKS } from '../src/data/demoKnowledgeBase';

export class KnowledgeStore {
  private documents: Map<string, DocumentItem> = new Map();
  private chunks: Map<string, DocumentChunk> = new Map();
  private history: QuestionHistoryItem[] = [];
  private totalQuestionsCount = 28;
  private questionsAnsweredCount = 26;
  private questionsNotFoundCount = 2;
  private totalResponseTimeSum = 19200; // ms

  constructor() {
    this.seedDefaults();
  }

  public seedDefaults() {
    this.documents.clear();
    this.chunks.clear();

    for (const doc of INITIAL_DEMO_DOCUMENTS) {
      this.documents.set(doc.id, { ...doc });
    }

    for (const chunk of INITIAL_DEMO_CHUNKS) {
      this.chunks.set(chunk.id, { ...chunk });
    }

    // Prepopulate realistic question history
    this.history = [
      {
        id: 'hist-1',
        userId: 'student-1',
        question: 'What is the minimum attendance required to appear for the semester examination?',
        answer: 'Minimum Attendance: 75%\n\nStudents must maintain at least 75% attendance in each registered theory and laboratory course during the semester to be eligible to appear for the semester-end examination. Condonation between 65% and 74% may be appealed on medical grounds with Dean approval.',
        isFound: true,
        confidence: 0.98,
        citations: [
          {
            id: 'cit-1',
            documentId: 'doc-exam-rules-2026',
            documentName: 'Examination Rules.pdf',
            pageNumber: 12,
            section: 'Examination Eligibility',
            excerpt: 'Students must maintain at least 75% attendance in each registered theory and laboratory course during the semester to be eligible to appear for the semester end examination.',
            similarity: 0.96,
          },
          {
            id: 'cit-2',
            documentId: 'doc-attendance-policy-2026',
            documentName: 'Attendance Policy.pdf',
            pageNumber: 2,
            section: 'Attendance Requirement & Monitoring',
            excerpt: 'Every student is mandated to attend a minimum of 75% of the total classes held in each course including lectures, tutorials, and practicals.',
            similarity: 0.92,
          }
        ],
        hasConflict: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      },
      {
        id: 'hist-2',
        userId: 'student-1',
        question: 'What documents are required for scholarship renewal?',
        answer: 'For annual renewal of the Merit-cum-Means (MCM) Scholarship, students must submit:\n1. Certified Grade Card of previous semesters proving minimum CGPA of 8.0 without backlogs.\n2. Fresh Annual Family Income Certificate (household income below ₹3,50,000).\n3. Current academic year college tuition fee receipt.\n4. Bank Passbook copy or canceled cheque linked to Aadhaar.\n5. Conduct and character certificate from the Head of Department.\n\nDeadline for submission is October 31.',
        isFound: true,
        confidence: 0.97,
        citations: [
          {
            id: 'cit-3',
            documentId: 'doc-scholarship-guidelines-2026',
            documentName: 'Scholarship Guidelines.pdf',
            pageNumber: 2,
            section: 'Merit-cum-Means Scholarship Renewal',
            excerpt: 'Students applying for the annual renewal of the Merit-cum-Means (MCM) Scholarship must submit the following mandatory documents before October 31: 1. Certified Grade Card... 2. Fresh Annual Family Income Certificate...',
            similarity: 0.95,
          }
        ],
        hasConflict: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      },
      {
        id: 'hist-3',
        userId: 'student-1',
        question: 'What are the hostel curfew and library timings?',
        answer: 'Central Library is open Monday through Friday from 08:00 AM to 10:00 PM (09:00 AM to 05:00 PM on weekends). First-year hostel students must return before 09:00 PM; senior students must enter by 10:00 PM.',
        isFound: true,
        confidence: 0.96,
        citations: [
          {
            id: 'cit-lib-1',
            documentId: 'doc-student-handbook-2026',
            documentName: 'Student Handbook.pdf',
            pageNumber: 11,
            section: 'Campus Facilities & Library Access',
            excerpt: 'Central Library Services: Operating Hours: Monday through Friday from 08:00 AM to 10:00 PM; Weekends and holidays from 09:00 AM to 05:00 PM...',
            similarity: 0.94,
          }
        ],
        hasConflict: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      }
    ];
  }

  public getDocuments(): DocumentItem[] {
    return Array.from(this.documents.values()).map(doc => {
      const docChunks = Array.from(this.chunks.values()).filter(c => c.documentId === doc.id);
      return {
        ...doc,
        chunkCount: docChunks.length,
      };
    });
  }

  public getDocumentById(id: string): DocumentItem | undefined {
    const doc = this.documents.get(id);
    if (!doc) return undefined;
    const docChunks = Array.from(this.chunks.values()).filter(c => c.documentId === doc.id);
    return {
      ...doc,
      chunks: docChunks,
      chunkCount: docChunks.length,
    };
  }

  public addDocument(doc: DocumentItem): void {
    this.documents.set(doc.id, doc);
  }

  public updateDocument(id: string, updates: Partial<DocumentItem>): DocumentItem | undefined {
    const doc = this.documents.get(id);
    if (!doc) return undefined;
    const updated = { ...doc, ...updates, updatedAt: new Date().toISOString() };
    this.documents.set(id, updated);
    return updated;
  }

  public deleteDocument(id: string): boolean {
    if (!this.documents.has(id)) return false;
    this.documents.delete(id);
    // Delete associated chunks
    for (const [chunkId, chunk] of this.chunks.entries()) {
      if (chunk.documentId === id) {
        this.chunks.delete(chunkId);
      }
    }
    return true;
  }

  public getChunks(onlyActive: boolean = true): DocumentChunk[] {
    const activeDocIds = new Set(
      Array.from(this.documents.values())
        .filter(d => (!onlyActive || (d.isActive && d.status === 'completed')))
        .map(d => d.id)
    );

    return Array.from(this.chunks.values()).filter(c => activeDocIds.has(c.documentId));
  }

  public addChunks(newChunks: DocumentChunk[]): void {
    for (const chunk of newChunks) {
      this.chunks.set(chunk.id, chunk);
    }
  }

  public deleteChunksForDocument(documentId: string): void {
    for (const [chunkId, chunk] of this.chunks.entries()) {
      if (chunk.documentId === documentId) {
        this.chunks.delete(chunkId);
      }
    }
  }

  public recordQuestion(historyItem: QuestionHistoryItem, processingTimeMs: number): void {
    this.history.unshift(historyItem);
    this.totalQuestionsCount++;
    if (historyItem.isFound) {
      this.questionsAnsweredCount++;
    } else {
      this.questionsNotFoundCount++;
    }
    this.totalResponseTimeSum += processingTimeMs;
  }

  public getHistory(userId?: string): QuestionHistoryItem[] {
    if (userId) {
      return this.history.filter(h => h.userId === userId);
    }
    return this.history;
  }

  public deleteHistoryItem(id: string): boolean {
    const prevLength = this.history.length;
    this.history = this.history.filter(h => h.id !== id);
    return this.history.length < prevLength;
  }

  public clearHistory(): void {
    this.history = [];
  }

  public getAnalytics(): AnalyticsData {
    const docs = Array.from(this.documents.values());
    const processed = docs.filter(d => d.status === 'completed').length;
    const totalChunks = this.chunks.size;

    // Document usage calculation
    const usageMap = new Map<string, number>();
    for (const item of this.history) {
      for (const cit of item.citations) {
        usageMap.set(cit.documentName, (usageMap.get(cit.documentName) || 0) + 1);
      }
    }

    const documentUsage = docs.map(d => {
      const count = usageMap.get(d.name) || (d.name.includes('Examination') ? 14 : d.name.includes('Attendance') ? 11 : d.name.includes('Scholarship') ? 8 : 4);
      return {
        documentName: d.name,
        usageCount: count,
        percentage: Math.min(100, Math.round((count / Math.max(1, this.totalQuestionsCount)) * 100)),
      };
    }).sort((a, b) => b.usageCount - a.usageCount);

    return {
      totalDocuments: docs.length,
      processedDocuments: processed,
      totalChunks,
      totalQuestions: this.totalQuestionsCount,
      questionsAnswered: this.questionsAnsweredCount,
      questionsNotFound: this.questionsNotFoundCount,
      averageSimilarity: 0.91,
      averageResponseTimeMs: Math.round(this.totalResponseTimeSum / Math.max(1, this.totalQuestionsCount)),
      questionsPerDay: [
        { date: 'Oct 01', count: 3 },
        { date: 'Oct 02', count: 5 },
        { date: 'Oct 03', count: 7 },
        { date: 'Oct 04', count: 6 },
        { date: 'Oct 05', count: 7 },
      ],
      topTopics: [
        { topic: 'Examination & Hall Tickets', count: 14 },
        { topic: 'Attendance & Condonation', count: 12 },
        { topic: 'Scholarships & Bursaries', count: 9 },
        { topic: 'Placement Eligibility', count: 8 },
        { topic: 'Timetable & Academic Calendar', count: 5 },
        { topic: 'Library & Hostel Rules', count: 4 },
      ],
      documentUsage,
    };
  }
}

export const globalStore = new KnowledgeStore();
