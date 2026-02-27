-- Hpedia Redesign: Consolidated Supabase Schema
-- This script initializes the Sovereign Knowledge Matrix infrastructure.

-- 1. Cached Pages Table
CREATE TABLE IF NOT EXISTS cached_pages (
  id BIGSERIAL PRIMARY KEY,
  url TEXT UNIQUE NOT NULL,
  title TEXT,
  markdown TEXT NOT NULL,
  metadata JSONB,
  cached_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Mindmap Cache Table
CREATE TABLE IF NOT EXISTS mindmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT UNIQUE NOT NULL,
  markdown TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Analytics Tracking
CREATE TABLE IF NOT EXISTS analytics (
  id BIGSERIAL PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  browser TEXT,
  os TEXT,
  device TEXT,
  country TEXT,
  city TEXT,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- 4. Hpedia Learn: Study Plans
CREATE TABLE IF NOT EXISTS study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  topic TEXT NOT NULL,
  country TEXT,
  location TEXT,
  progress_percent INT DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Hpedia Learn: Study Tasks
CREATE TABLE IF NOT EXISTS study_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES study_plans(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  media_urls TEXT[], -- Array of images/videos
  task_order INT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS (Disable temporarily or configure as needed)
ALTER TABLE cached_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE mindmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_tasks ENABLE ROW LEVEL SECURITY;

-- Allow public read for caching (Customize based on security requirements)
CREATE POLICY "Public Read Access" ON cached_pages FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON mindmaps FOR SELECT USING (true);
CREATE POLICY "Public Insert Access" ON analytics FOR INSERT WITH CHECK (true);
