-- Monroe Companion: Conversation Memory Schema
-- Run this in your Supabase SQL Editor to enable Monroe's persistent memory.

-- Monroe Conversations Table
CREATE TABLE IF NOT EXISTS monroe_conversations (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'monroe')),
  content TEXT NOT NULL,
  mood FLOAT DEFAULT 0.5,
  emotion TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast session lookups
CREATE INDEX IF NOT EXISTS idx_monroe_session ON monroe_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_monroe_created ON monroe_conversations(created_at DESC);

-- Enable Row Level Security
ALTER TABLE monroe_conversations ENABLE ROW LEVEL SECURITY;

-- Allow all sessions to insert their own messages
CREATE POLICY "Insert Monroe Messages" ON monroe_conversations
  FOR INSERT WITH CHECK (true);

-- Allow sessions to read their own messages
CREATE POLICY "Read Monroe Messages" ON monroe_conversations
  FOR SELECT USING (true);
