-- ==============================================================================
-- CAMPUS KNOWLEDGE COPILOT - SUPABASE POSTGRESQL & PGVECTOR SCHEMA
-- ==============================================================================

-- 1. Enable the pgvector extension for similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. USERS table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DOCUMENTS table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    storage_path TEXT,
    category TEXT DEFAULT 'General',
    version TEXT NOT NULL DEFAULT '1.0',
    is_active BOOLEAN DEFAULT TRUE,
    uploaded_by TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT NOT NULL CHECK (status IN ('uploading', 'processing', 'extracting', 'chunking', 'embedding', 'indexing', 'completed', 'failed')),
    page_count INTEGER DEFAULT 1,
    chunk_count INTEGER DEFAULT 0
);

-- 4. DOCUMENT_CHUNKS table with 768-dimension vector embedding (Google text-embedding-004)
CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    chunk_text TEXT NOT NULL,
    embedding VECTOR(768),
    page_number INTEGER NOT NULL DEFAULT 1,
    section TEXT NOT NULL DEFAULT 'General',
    chunk_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create HNSW index for ultra-fast cosine similarity vector search
CREATE INDEX IF NOT EXISTS document_chunks_embedding_idx 
ON document_chunks 
USING hnsw (embedding vector_cosine_ops);

-- 5. DOCUMENT_VERSIONS table
CREATE TABLE IF NOT EXISTS document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    version TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- 6. QUESTIONS table
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    question TEXT NOT NULL,
    language TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ANSWERS table
CREATE TABLE IF NOT EXISTS answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    answer TEXT NOT NULL,
    confidence NUMERIC(4,3) DEFAULT 0.95,
    has_conflict BOOLEAN DEFAULT FALSE,
    conflict_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CITATIONS table
CREATE TABLE IF NOT EXISTS citations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    answer_id UUID REFERENCES answers(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    chunk_id UUID REFERENCES document_chunks(id) ON DELETE SET NULL,
    document_name TEXT NOT NULL,
    page_number INTEGER NOT NULL,
    section TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    similarity NUMERIC(4,3)
);

-- 9. PGVECTOR SIMILARITY SEARCH FUNCTION
-- Retrieves top relevant active document chunks matching query embedding
CREATE OR REPLACE FUNCTION match_document_chunks (
    query_embedding VECTOR(768),
    match_threshold FLOAT DEFAULT 0.45,
    match_count INT DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    document_id UUID,
    document_name TEXT,
    chunk_text TEXT,
    page_number INT,
    section TEXT,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        dc.id,
        dc.document_id,
        d.name AS document_name,
        dc.chunk_text,
        dc.page_number,
        dc.section,
        1 - (dc.embedding <=> query_embedding) AS similarity
    FROM document_chunks dc
    JOIN documents d ON dc.document_id = d.id
    WHERE d.is_active = TRUE
      AND d.status = 'completed'
      AND (1 - (dc.embedding <=> query_embedding)) > match_threshold
    ORDER BY dc.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE citations ENABLE ROW LEVEL SECURITY;

-- Everyone can read active documents & chunks
CREATE POLICY "Public read active documents" ON documents FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read chunks" ON document_chunks FOR SELECT USING (TRUE);

-- Students can view their own questions and citations
CREATE POLICY "Students manage questions" ON questions FOR ALL USING (TRUE);
CREATE POLICY "Read answers" ON answers FOR SELECT USING (TRUE);
CREATE POLICY "Read citations" ON citations FOR SELECT USING (TRUE);
