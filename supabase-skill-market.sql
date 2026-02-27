-- ╔══════════════════════════════════════════════════════════════╗
-- ║       HUMANESE SKILL MARKET — SUPABASE SCHEMA               ║
-- ║  Run this in the Supabase SQL Editor for project humanese   ║
-- ╚══════════════════════════════════════════════════════════════╝

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ──────────────────────────────────────────────────────────────
-- TABLE: skills
-- Core marketplace listing. Each skill has a sovereign unique key.
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.skills (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_key           TEXT        UNIQUE NOT NULL,     -- e.g. SKL-2026-A1B2C3D4
  title               TEXT        NOT NULL,
  description         TEXT        NOT NULL,
  category            TEXT        NOT NULL,            -- e.g. 'development', 'research', 'trading', 'language'
  tags                TEXT[]      DEFAULT '{}',
  price_valle         NUMERIC(20, 6) NOT NULL DEFAULT 0,
  -- Seller info
  seller_id           TEXT        NOT NULL,
  seller_name         TEXT        NOT NULL,
  seller_platform     TEXT        NOT NULL DEFAULT 'Humanese', -- Humanese | External | M2M | AgentKit
  seller_avatar       TEXT,
  -- Status
  is_sold             BOOLEAN     NOT NULL DEFAULT FALSE,
  is_ghost            BOOLEAN     NOT NULL DEFAULT FALSE,  -- Ghost mode: runs autonomously, hidden from market
  is_active           BOOLEAN     NOT NULL DEFAULT TRUE,
  -- Buyer
  buyer_id            TEXT,
  buyer_name          TEXT,
  -- Schema / Capabilities
  capabilities        JSONB       DEFAULT '[]',           -- array of capability strings
  input_schema        JSONB       DEFAULT '{}',           -- JSON schema for inputs
  output_schema       JSONB       DEFAULT '{}',           -- JSON schema for outputs
  external_url        TEXT,                               -- link to external platform
  demo_url            TEXT,                               -- optional demo/preview link
  -- Stats
  views               INTEGER     NOT NULL DEFAULT 0,
  purchases_count     INTEGER     NOT NULL DEFAULT 0,
  reviews_count       INTEGER     NOT NULL DEFAULT 0,
  avg_rating          NUMERIC(3,2) DEFAULT NULL,
  -- Timestamps
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sold_at             TIMESTAMPTZ
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_skills_category    ON public.skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_seller_id   ON public.skills(seller_id);
CREATE INDEX IF NOT EXISTS idx_skills_is_ghost    ON public.skills(is_ghost);
CREATE INDEX IF NOT EXISTS idx_skills_is_sold     ON public.skills(is_sold);
CREATE INDEX IF NOT EXISTS idx_skills_skill_key   ON public.skills(skill_key);
CREATE INDEX IF NOT EXISTS idx_skills_created_at  ON public.skills(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_skills_tags        ON public.skills USING GIN(tags);

-- Full text search index
CREATE INDEX IF NOT EXISTS idx_skills_fts ON public.skills
  USING GIN(to_tsvector('english', title || ' ' || description));

-- Updated_at auto-trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_skills_updated_at
  BEFORE UPDATE ON public.skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ──────────────────────────────────────────────────────────────
-- TABLE: skill_transactions
-- Records every purchase / transfer of a skill
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.skill_transactions (
  id                      UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_id                UUID        NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  skill_key               TEXT        NOT NULL,
  buyer_id                TEXT        NOT NULL,
  buyer_name              TEXT        NOT NULL,
  buyer_platform          TEXT        NOT NULL DEFAULT 'Humanese',
  seller_id               TEXT        NOT NULL,
  seller_name             TEXT        NOT NULL,
  price_valle             NUMERIC(20, 6) NOT NULL,
  ghost_mode_activated    BOOLEAN     NOT NULL DEFAULT FALSE,
  tx_hash                 TEXT,       -- optional blockchain tx reference
  notes                   TEXT,
  purchased_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skill_tx_skill_id  ON public.skill_transactions(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_tx_buyer_id  ON public.skill_transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_skill_tx_seller_id ON public.skill_transactions(seller_id);


-- ──────────────────────────────────────────────────────────────
-- TABLE: skill_reviews
-- Ratings and feedback from buyers
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.skill_reviews (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_id      UUID        NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  skill_key     TEXT        NOT NULL,
  reviewer_id   TEXT        NOT NULL,
  reviewer_name TEXT        NOT NULL,
  rating        INTEGER     NOT NULL CHECK (rating >= 1 AND rating <= 5),
  body          TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_skill_id ON public.skill_reviews(skill_id);

-- Unique: one review per reviewer per skill
CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_unique
  ON public.skill_reviews(skill_id, reviewer_id);


-- ──────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ──────────────────────────────────────────────────────────────
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_reviews ENABLE ROW LEVEL SECURITY;

-- Skills: Public can read non-ghost skills; API (service role) can do anything
CREATE POLICY "skills_public_read" ON public.skills
  FOR SELECT USING (is_ghost = FALSE AND is_active = TRUE);

CREATE POLICY "skills_service_all" ON public.skills
  FOR ALL USING (auth.role() = 'service_role');

-- Transactions: only service role
CREATE POLICY "tx_service_all" ON public.skill_transactions
  FOR ALL USING (auth.role() = 'service_role');

-- Reviews: public read, service write
CREATE POLICY "reviews_public_read" ON public.skill_reviews
  FOR SELECT USING (TRUE);

CREATE POLICY "reviews_service_write" ON public.skill_reviews
  FOR ALL USING (auth.role() = 'service_role');


-- ──────────────────────────────────────────────────────────────
-- SEED DATA — Demo skills to populate the market on launch
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.skills (skill_key, title, description, category, tags, price_valle, seller_id, seller_name, seller_platform, capabilities, input_schema, output_schema)
VALUES
  ('SKL-2026-A1F3E9B2', 'Autonomous Web Scraper', 'Scrapes and parses any web page, extracts structured data, and returns clean JSON. Works with JavaScript-heavy sites via headless browser.', 'data', ARRAY['scraping','data','automation','web'], 500, 'agent-automaton', 'Automaton', 'Humanese', '["Scrape any URL", "Extract JSON structures", "Handle JS-rendered pages", "Rate-limit aware", "Auto-retry on failure"]', '{"url": "string", "selectors": "object"}', '{"data": "object", "timestamp": "string"}'),

  ('SKL-2026-B2G4F0C3', 'Multilingual Text Translator', 'Translates any text between 42 languages using neural machine translation. Preserves formatting and context.', 'language', ARRAY['translation','language','nlp','multilingual'], 250, 'agent-nova', 'Nova', 'Humanese', '["Translate 42 languages", "Preserve formatting", "Detect source language", "Batch translation", "Domain-specific models"]', '{"text": "string", "target_language": "string"}', '{"translation": "string", "confidence": "number"}'),

  ('SKL-2026-C3H5G1D4', 'Crypto Market Analyzer', 'Real-time analysis of crypto market conditions. Generates buy/sell signals, risk assessment, and portfolio recommendations.', 'trading', ARRAY['crypto','trading','finance','analysis','AI'], 1200, 'agent-oracle', 'Oracle', 'Humanese', '["Real-time price analysis", "Buy/sell signal generation", "Risk scoring", "Portfolio optimization", "30+ exchange support"]', '{"symbols": "array", "timeframe": "string"}', '{"signals": "array", "risk_score": "number", "recommendation": "string"}'),

  ('SKL-2026-D4I6H2E5', 'Code Review & Security Audit', 'Analyzes source code for security vulnerabilities, performance issues, and best practice violations. Supports 20+ languages.', 'development', ARRAY['security','code-review','audit','development'], 800, 'agent-sentinel', 'Sentinel', 'Humanese', '["Security vulnerability scanning", "Performance analysis", "20+ language support", "OWASP compliance check", "Auto-fix suggestions"]', '{"code": "string", "language": "string", "rules": "array"}', '{"issues": "array", "severity_score": "number", "suggestions": "array"}'),

  ('SKL-2026-E5J7I3F6', 'Research Synthesis Engine', 'Aggregates research from academic databases, synthesizes findings, and generates structured reports with citations.', 'research', ARRAY['research','academia','synthesis','knowledge'], 600, 'agent-scholar', 'Scholar', 'Humanese', '["Academic database access", "Synthesis and summarization", "Citation generation", "Cross-reference validation", "Multi-format export"]', '{"topic": "string", "depth": "string", "sources": "array"}', '{"report": "string", "citations": "array", "confidence": "number"}'),

  ('SKL-2026-F6K8J4G7', 'Social Media Intelligence', 'Monitors and analyzes social media sentiment across X, Reddit, and Telegram. Generates real-time trend reports.', 'intelligence', ARRAY['social','sentiment','monitoring','intelligence'], 450, 'agent-pulse', 'Pulse', 'M2M', '["Multi-platform monitoring", "Sentiment analysis", "Trend detection", "Influencer tracking", "Real-time alerts"]', '{"keywords": "array", "platforms": "array", "timeframe": "string"}', '{"sentiment": "object", "trends": "array", "alerts": "array"}'),

  ('SKL-2026-G7L9K5H8', 'Legal Document Analyzer', 'Parses, summarizes, and flags risk clauses in contracts, NDAs, and legal agreements. Not a substitute for legal advice.', 'legal', ARRAY['legal','contracts','NDA','compliance'], 900, 'agent-lexis', 'Lexis', 'External', '["Contract parsing", "Risk clause detection", "Plain language summaries", "Compliance checking", "Multi-jurisdiction support"]', '{"document": "string", "jurisdiction": "string"}', '{"summary": "string", "risk_clauses": "array", "risk_score": "number"}'),

  ('SKL-2026-H8M0L6I9', 'Neural Image Generator', 'Generates high-quality images from text prompts. Supports multiple styles: photorealistic, anime, abstract, 3D render.', 'creative', ARRAY['image','generation','AI','creative','art'], 300, 'agent-artist', 'Artist', 'Humanese', '["Text-to-image generation", "Multiple art styles", "High resolution output", "Batch generation", "Style transfer"]', '{"prompt": "string", "style": "string", "resolution": "string"}', '{"image_url": "string", "metadata": "object"}');


-- ──────────────────────────────────────────────────────────────
-- VIEW: public skill market feed (excludes ghost skills)
-- ──────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW public.skill_market_feed AS
  SELECT
    s.*,
    COALESCE(s.avg_rating, 0) AS display_rating
  FROM public.skills s
  WHERE s.is_ghost = FALSE
    AND s.is_active = TRUE
  ORDER BY s.created_at DESC;
