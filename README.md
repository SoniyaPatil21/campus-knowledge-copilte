# CAMPUS KNOWLEDGE COPILOT (EDU-02)

> **"Ask your campus. Get the answer. Know the source."**

Campus Knowledge Copilot is a production-grade full-stack Retrieval-Augmented Generation (RAG) platform tailored for educational institutions. It empowers students and faculty to ask natural language questions and receive accurate, instant answers synthesized **exclusively** from official institutional documents — complete with exact source citations and strict zero-hallucination guardrails.

---

## 🎯 Problem Statement & Challenge

### The Problem
Educational institutions generate a vast volume of documents: semester timetables, circulars, examination regulations, attendance directives, scholarship criteria, placement guidelines, department bylaws, and student handbooks. Students waste countless hours searching across disparate PDFs and confusing circular repositories, or they rely on unreliable informal rumors.

### The Challenge
Standard language models hallucinate plausible-sounding dates, percentages, and requirements from general training data. In academic institutions, misinformation can lead to course detentions, missed scholarship renewal deadlines, or placement disqualifications.

### The Solution
Campus Knowledge Copilot implements a multi-stage grounded RAG pipeline:
1. **Authoritative Ingestion**: Institutional documents (PDF, DOCX, TXT, CSV) are processed and chunked with preserved page and section metadata into a Supabase pgvector store.
2. **Deterministic Context Isolation**: Queries retrieve only the top relevant institutional chunks above a calibrated similarity threshold (0.38+).
3. **Strict Grounding via Gemini 3.8 Flash**: System instructions mandate answering strictly from the retrieved chunks. If data is absent, the model issues a verified refusal.
4. **Exact Citation Binding**: Every generated statement is linked to the source document, page number, and section, with an interactive highlighted excerpt viewer.

---

## 🚀 Key Features

- **Natural Language Academic Inquiries**: Ask in plain English, Hindi (हिन्दी), or Marathi (मराठी).
- **Zero Hallucination Guarantee**: Unverifiable or non-existent claims (e.g., cafeteria menus not in institutional guidelines) trigger verified refusals rather than invented responses.
- **Source-Level Citations**: Interactive citations specifying Document Name, Page Number, Section Title, and Semantic Relevance Score.
- **Interactive Source Viewer**: One-click modal displaying document pages with the retrieved supporting excerpt highlighted in glowing cyan.
- **Automated Conflict Detection**: Identifies conflicting rules across active circulars (e.g., standard 75% attendance vs. 80% honors project threshold) and displays a dual-source alert.
- **Multilingual Semantic Retrieval**: Normalized lexical and semantic concept mapping across English, Hindi, and Marathi.
- **Document Processing Pipeline**: Ingests PDF, DOCX, TXT, and CSV files, automatically preserving page numbers and chunking at ~500 tokens with 50-token overlap.
- **Version Control & Management**: Manage document versions (v1.0, v2.1), toggle active/inactive circulars to prevent obsolete information leaks, and re-index vector representations.
- **Comprehensive Admin Telemetry**: Track questions asked, precision refusal rates, daily volume, top requested academic categories, and document usage.

---

## 🏗 System Architecture & RAG Pipeline

```
┌──────────────────────────────────────────────────────────┐
│                   Student / Admin UI                     │
│          (React 19 + Tailwind CSS + Lucide React)        │
└──────────────────────────┬───────────────────────────────┘
                           │ HTTP / REST API
┌──────────────────────────▼───────────────────────────────┐
│               Backend & Serverless API                   │
│      (Express server.ts & Netlify Functions api.ts)       │
└────────────┬─────────────────────────────┬───────────────┘
             │                             │
    Ingestion Pipeline             RAG Retrieval Flow
             │                             │
  ┌──────────▼──────────┐        ┌─────────▼─────────────┐
  │ Document Processor  │        │ Question Embedding    │
  │ (pdf, docx, txt, csv)│       │ (Feature Vector / 768)│
  └──────────┬──────────┘        └─────────┬─────────────┘
             │ Chunks                      │ Cosine Sim
  ┌──────────▼──────────┐        ┌─────────▼─────────────┐
  │  Metadata Injection │        │ Vector Search         │
  │  (Doc, Page, Sec)   │        │ (Threshold >= 0.38)   │
  └──────────┬──────────┘        └─────────┬─────────────┘
             │ Chunks                      │ Top Chunks
  ┌──────────▼──────────┐        ┌─────────▼─────────────┐
  │ Supabase pgvector   │◄───────┤ Context Isolation     │
  │ Vector Embeddings   │ Chunks │ Conflict Detector     │
  └─────────────────────┘        └─────────┬─────────────┘
                                           │ Context Only
                                 ┌─────────▼─────────────┐
                                 │ Google Gemini Flash   │
                                 │ Grounded Synthesis    │
                                 └─────────┬─────────────┘
                                           │
                                 ┌─────────▼─────────────┐
                                 │ Answer + Citations    │
                                 └───────────────────────┘
```

---

## 📊 Database Schema (Supabase PostgreSQL + pgvector)

Full SQL definition located at `/supabase/schema.sql`:

1. **`DOCUMENTS`**: `id`, `name`, `file_name`, `file_type`, `category`, `version`, `is_active`, `uploaded_by`, `uploaded_at`, `status`, `page_count`, `chunk_count`
2. **`DOCUMENT_CHUNKS`**: `id`, `document_id`, `chunk_text`, `embedding VECTOR(768)`, `page_number`, `section`, `chunk_index`, `created_at`
3. **`DOCUMENT_VERSIONS`**: `id`, `document_id`, `version`, `uploaded_at`, `is_active`
4. **`QUESTIONS`**: `id`, `user_id`, `question`, `language`, `created_at`
5. **`ANSWERS`**: `id`, `question_id`, `answer`, `confidence`, `has_conflict`, `conflict_notes`, `created_at`
6. **`CITATIONS`**: `id`, `answer_id`, `document_id`, `chunk_id`, `document_name`, `page_number`, `section`, `excerpt`, `similarity`
7. **`USERS`**: `id`, `name`, `email`, `role ('student' | 'admin')`, `created_at`

---

## 🛡 Hallucination Prevention & Refusal Strategy

The system enforces a multi-layer guardrail:
1. **Context Isolation**: No general web search grounding or ungrounded generative prompts are used. Gemini is instructed:
   > *"Answer ONLY using the provided institutional document context. Do not use outside knowledge. Do not guess. If the answer cannot be found, clearly say: 'I could not find this information in the available institutional documents.'"*
2. **Retrieval Threshold Filtering**: If vector similarity scores are below 0.38, the system bypasses model generation and immediately returns a deterministic institutional refusal listing the documents searched and offering suggested topics.
3. **Verification Badges**: Answers are paired with exact character-for-character citation excerpts verified from the original source.

---

## 👥 User Roles & Demo Credentials

The platform features an instant **1-Click Demo Login** switch on the navbar and login page:

| Role | Name | Email | Permissions |
|---|---|---|---|
| **Student** | Aarav Sharma | `student@campus.edu` | Ask questions, view citations, inspect source pages, search circulars, view question history |
| **Administrator** | Dr. Evelyn Vance | `admin@campus.edu` | Upload circulars (PDF/DOCX/TXT/CSV), inspect chunking, toggle version active flags, re-index, view telemetry |

---

## 💬 Sample Demo Questions

### Available Institutional Questions (Accurate Grounded Answers):
1. *"What is the minimum attendance required to appear for the semester examination?"*
   - **Answer**: 75% minimum attendance required.
   - **Source**: `Examination Rules.pdf` (Page 12, Section: Examination Eligibility)
2. *"What documents are required for scholarship renewal?"*
   - **Answer**: Grade card (min CGPA 8.0), Income certificate (<₹3,50,000), Fee receipt, Bank passbook linked to Aadhaar, Conduct certificate.
   - **Source**: `Scholarship Guidelines.pdf` (Page 2, Section: Merit-cum-Means Scholarship Renewal)
3. *"When is the semester examination?"*
   - **Answer**: December 1, 2026 to December 22, 2026.
   - **Source**: `Semester Timetable.pdf` (Page 1) / `Examination Rules.pdf` (Page 1)
4. *"What are the placement eligibility requirements?"*
   - **Answer**: CGPA ≥ 6.5, zero backlogs, 80% training bootcamp attendance.
   - **Source**: `Placement Cell Guidelines.pdf` (Page 2, Section: Placement Eligibility Requirements)

### Multilingual Queries:
- Hindi: *"न्यूनतम उपस्थिति कितनी आवश्यक है?"*
- Marathi: *"किमान उपस्थिती किती आवश्यक आहे?"*

### Zero-Hallucination Refusal Test:
- Question: *"What is tomorrow's cafeteria menu?"*
- **Response**: *"I could not find this information in the available institutional documents."* (Shows 8 documents searched with zero fabricated items).

---

## 💻 Local Development & Build

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/your-campus/campus-knowledge-copilot.git
cd campus-knowledge-copilot

# Install dependencies
npm install

# Start development server
npm run dev
```
The server will boot on `http://localhost:3000`.

### Building for Production
```bash
npm run build
```

---

## 🌐 Netlify Deployment

The project is pre-configured for instant Netlify deployment via `netlify.toml`:
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Functions Directory**: `netlify/functions`
- **API Handler**: `netlify/functions/api.ts`

### Environment Variables
Configure these in the Netlify Dashboard or `.env`:
- `GEMINI_API_KEY`: Server-side Gemini API key (Confidential)
- `VITE_SUPABASE_URL`: (Optional) Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: (Optional) Supabase anonymous key

---

## 🔮 Future Enhancements
- Automated OCR for scanned historical notifications
- Push notifications when an updated circular invalidates an older policy
- Multi-campus departmental partitioning and single-sign-on (SAML/Google Workspace)
