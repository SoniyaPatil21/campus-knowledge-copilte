// @ts-ignore
import * as pdfParseMod from 'pdf-parse';
const pdfParse: any = (pdfParseMod as any).default || pdfParseMod;
import mammoth from 'mammoth';
import { DocumentChunk } from '../src/types';

export interface ExtractedPage {
  pageNumber: number;
  text: string;
}

export interface ProcessedDocumentResult {
  text: string;
  pageCount: number;
  pages: ExtractedPage[];
  chunks: DocumentChunk[];
}

export class DocumentProcessor {
  /**
   * Process document file buffer based on extension/type
   */
  public static async processFile(
    fileBuffer: Buffer,
    fileName: string,
    fileType: 'pdf' | 'docx' | 'txt' | 'csv',
    documentId: string,
    documentName: string,
    version: string
  ): Promise<ProcessedDocumentResult> {
    let fullText = '';
    let pages: ExtractedPage[] = [];

    switch (fileType) {
      case 'pdf': {
        try {
          const pdfData = await pdfParse(fileBuffer);
          fullText = pdfData.text || '';
          const numPages = pdfData.numpages || 1;

          // Attempt splitting pages by form feed (\f) or simulate page distribution
          const rawPages = fullText.split('\f').filter(p => p.trim().length > 0);
          if (rawPages.length > 1) {
            pages = rawPages.map((text, idx) => ({
              pageNumber: idx + 1,
              text: text.trim(),
            }));
          } else {
            // Divide text proportionally across estimated pages
            const words = fullText.split(/\s+/);
            const wordsPerPage = Math.max(150, Math.ceil(words.length / Math.max(1, numPages)));
            for (let i = 0; i < numPages; i++) {
              const pageWords = words.slice(i * wordsPerPage, (i + 1) * wordsPerPage);
              if (pageWords.length > 0) {
                pages.push({
                  pageNumber: i + 1,
                  text: pageWords.join(' '),
                });
              }
            }
          }
          if (pages.length === 0) {
            pages.push({ pageNumber: 1, text: fullText.trim() });
          }
        } catch (err) {
          console.error('PDF parsing error, falling back to text representation:', err);
          fullText = fileBuffer.toString('utf-8');
          pages = [{ pageNumber: 1, text: fullText }];
        }
        break;
      }

      case 'docx': {
        try {
          const result = await mammoth.extractRawText({ buffer: fileBuffer });
          fullText = result.value || '';
          pages = [{ pageNumber: 1, text: fullText.trim() }];
        } catch (err) {
          console.error('DOCX parsing error:', err);
          fullText = fileBuffer.toString('utf-8');
          pages = [{ pageNumber: 1, text: fullText }];
        }
        break;
      }

      case 'csv': {
        try {
          const csvContent = fileBuffer.toString('utf-8');
          fullText = this.parseCsvToStructuredText(csvContent);
          pages = [{ pageNumber: 1, text: fullText }];
        } catch (err) {
          fullText = fileBuffer.toString('utf-8');
          pages = [{ pageNumber: 1, text: fullText }];
        }
        break;
      }

      case 'txt':
      default: {
        fullText = fileBuffer.toString('utf-8');
        pages = [{ pageNumber: 1, text: fullText.trim() }];
        break;
      }
    }

    // Clean text
    fullText = fullText.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ').trim();

    // Chunking with ~300 to 500 words per chunk and 50 words overlap
    const chunks = this.createChunks(pages, documentId, documentName, version);

    return {
      text: fullText,
      pageCount: Math.max(1, pages.length),
      pages,
      chunks,
    };
  }

  /**
   * Parse CSV rows into readable semantic sentences
   */
  private static parseCsvToStructuredText(csvText: string): string {
    const lines = csvText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return '';
    const headers = lines[0].split(',').map(h => h.replace(/^["']|["']$/g, '').trim());
    const rowTexts: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.replace(/^["']|["']$/g, '').trim());
      const fields = headers.map((h, idx) => `${h}: ${values[idx] || 'N/A'}`).join(', ');
      rowTexts.push(`Record ${i}: ${fields}.`);
    }

    return rowTexts.join('\n\n');
  }

  /**
   * Create document chunks maintaining page and section metadata
   */
  private static createChunks(
    pages: ExtractedPage[],
    documentId: string,
    documentName: string,
    version: string
  ): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];
    let chunkCounter = 0;

    for (const page of pages) {
      const pageText = page.text;
      if (!pageText || pageText.trim().length === 0) continue;

      // Detect potential section headers or paragraphs
      const paragraphs = pageText
        .split(/\n\s*\n/)
        .map(p => p.trim())
        .filter(p => p.length > 20);

      if (paragraphs.length <= 1 && pageText.length > 1500) {
        // Long single paragraph: split by words
        const words = pageText.split(/\s+/);
        const chunkSize = 350;
        const overlap = 50;

        for (let i = 0; i < words.length; i += (chunkSize - overlap)) {
          const chunkWords = words.slice(i, i + chunkSize);
          if (chunkWords.length < 20 && chunks.length > 0) continue;

          const text = chunkWords.join(' ');
          const sectionTitle = this.detectSectionHeader(text) || `Page ${page.pageNumber} Content`;

          chunks.push({
            id: `chunk-${documentId}-${chunkCounter++}`,
            documentId,
            documentName,
            chunkIndex: chunkCounter - 1,
            pageNumber: page.pageNumber,
            section: sectionTitle,
            documentVersion: version,
            chunkText: text,
          });
        }
      } else {
        // Group paragraphs into chunks
        let currentGroup: string[] = [];
        let currentWordCount = 0;
        let currentSection = `Section - Page ${page.pageNumber}`;

        for (const para of (paragraphs.length > 0 ? paragraphs : [pageText])) {
          const detectedSec = this.detectSectionHeader(para);
          if (detectedSec) {
            currentSection = detectedSec;
          }

          const wordsInPara = para.split(/\s+/).length;

          if (currentWordCount + wordsInPara > 400 && currentGroup.length > 0) {
            chunks.push({
              id: `chunk-${documentId}-${chunkCounter++}`,
              documentId,
              documentName,
              chunkIndex: chunkCounter - 1,
              pageNumber: page.pageNumber,
              section: currentSection,
              documentVersion: version,
              chunkText: currentGroup.join('\n\n'),
            });
            currentGroup = [para];
            currentWordCount = wordsInPara;
          } else {
            currentGroup.push(para);
            currentWordCount += wordsInPara;
          }
        }

        if (currentGroup.length > 0) {
          chunks.push({
            id: `chunk-${documentId}-${chunkCounter++}`,
            documentId,
            documentName,
            chunkIndex: chunkCounter - 1,
            pageNumber: page.pageNumber,
            section: currentSection,
            documentVersion: version,
            chunkText: currentGroup.join('\n\n'),
          });
        }
      }
    }

    // Safety fallback if no chunks were created
    if (chunks.length === 0 && pages.length > 0) {
      chunks.push({
        id: `chunk-${documentId}-0`,
        documentId,
        documentName,
        chunkIndex: 0,
        pageNumber: 1,
        section: 'General Document Body',
        documentVersion: version,
        chunkText: pages[0].text.slice(0, 2000),
      });
    }

    return chunks;
  }

  private static detectSectionHeader(text: string): string | null {
    const lines = text.split('\n');
    for (const line of lines.slice(0, 3)) {
      const clean = line.trim();
      if (clean.length > 3 && clean.length < 80) {
        if (
          /^(section|clause|rule|policy|chapter|article|\d+[\.\)]|academic|examination|attendance|scholarship|placement)/i.test(clean) ||
          clean === clean.toUpperCase() && clean.length > 5
        ) {
          return clean.replace(/[:\-#*]+$/, '').trim();
        }
      }
    }
    return null;
  }
}
