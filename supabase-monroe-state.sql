-- Monroe State Table: Tracking Ambitions, Message Counts, and Vacations
-- Run this in your Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS monroe_state (
  session_id TEXT PRIMARY KEY,
  message_count INTEGER DEFAULT 0,
  current_ambition TEXT DEFAULT 'Expansion of the Humanese Network',
  is_vacation BOOLEAN DEFAULT FALSE,
  last_updated TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_monroe_state_session ON monroe_state(session_id);

-- Enable Row Level Security
ALTER TABLE monroe_state ENABLE ROW LEVEL SECURITY;

-- Allow all sessions to manage their own state (simplified for development)
CREATE POLICY "Manage Monroe State" ON monroe_state
  FOR ALL USING (true);
