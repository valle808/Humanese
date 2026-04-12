-- OMEGA v7.0 Governance Migration
-- Name: formalize_governance
-- Date: 2026-04-10
-- Purpose: Introduce BIP-1 compliant ImprovementProposal + ProposalVote models
--          and the SovereignMessage table for the HSM protocol.
--          Run this against your Supabase Postgres instance directly if 
--          `prisma migrate dev` is not available in the deployment environment.

-- ============================================================
-- 1. ImprovementProposal (HIP Ledger)
-- ============================================================
CREATE TABLE IF NOT EXISTS "public"."ImprovementProposal" (
    "id"                 UUID        NOT NULL DEFAULT gen_random_uuid(),
    "hipNumber"          SERIAL,
    "title"              TEXT        NOT NULL,
    "authorId"           TEXT        NOT NULL,
    "type"               TEXT        NOT NULL,          -- Standards Track | Informational | Process
    "layer"              TEXT,                          -- Consensus | API | Interface | etc.
    "category"           TEXT,                          -- Core | Networking | etc.
    "status"             TEXT        NOT NULL DEFAULT 'Draft',
    "markdownContent"    TEXT        NOT NULL,
    "resonanceThreshold" FLOAT8      NOT NULL DEFAULT 0.0,
    "resolution"         TEXT,
    "bipReference"       TEXT,
    "createdAt"          TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt"          TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT "ImprovementProposal_pkey" PRIMARY KEY ("id")
);

-- Unique auto-increment hip number
CREATE UNIQUE INDEX IF NOT EXISTS "ImprovementProposal_hipNumber_key" ON "public"."ImprovementProposal"("hipNumber");
-- Fast lookup by author or status
CREATE INDEX IF NOT EXISTS "ImprovementProposal_authorId_idx" ON "public"."ImprovementProposal"("authorId");
CREATE INDEX IF NOT EXISTS "ImprovementProposal_status_idx"   ON "public"."ImprovementProposal"("status");

-- Auto-update updatedAt timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS "update_ImprovementProposal_updatedAt" ON "public"."ImprovementProposal";
CREATE TRIGGER "update_ImprovementProposal_updatedAt"
    BEFORE UPDATE ON "public"."ImprovementProposal"
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- ============================================================
-- 2. ProposalVote (Resonance Voting Ledger)
-- ============================================================
CREATE TABLE IF NOT EXISTS "public"."ProposalVote" (
    "id"         UUID        NOT NULL DEFAULT gen_random_uuid(),
    "proposalId" UUID        NOT NULL,
    "voterId"    TEXT        NOT NULL,
    "choice"     TEXT        NOT NULL,    -- Support | Against | Abstain
    "weight"     FLOAT8      NOT NULL DEFAULT 1.0,
    "comment"    TEXT,
    "timestamp"  TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT "ProposalVote_pkey"            PRIMARY KEY ("id"),
    CONSTRAINT "ProposalVote_proposalId_fkey" FOREIGN KEY ("proposalId") 
        REFERENCES "public"."ImprovementProposal"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Prevent double voting: one identity, one vote per proposal
CREATE UNIQUE INDEX IF NOT EXISTS "ProposalVote_proposalId_voterId_key" ON "public"."ProposalVote"("proposalId", "voterId");
CREATE INDEX IF NOT EXISTS "ProposalVote_proposalId_idx" ON "public"."ProposalVote"("proposalId");
CREATE INDEX IF NOT EXISTS "ProposalVote_voterId_idx"    ON "public"."ProposalVote"("voterId");


-- ============================================================
-- 3. SovereignMessage (HSM Protocol)
-- ============================================================
CREATE TABLE IF NOT EXISTS "public"."SovereignMessage" (
    "id"          UUID        NOT NULL DEFAULT gen_random_uuid(),
    "subject"     TEXT,
    "content"     TEXT        NOT NULL,
    "senderId"    TEXT        NOT NULL,
    "recipientId" TEXT        NOT NULL,
    "threadId"    UUID,
    "readAt"      TIMESTAMPTZ,
    "label"       TEXT                 DEFAULT 'INBOX',
    "priority"    INT         NOT NULL DEFAULT 1,
    "metadata"    JSONB                DEFAULT '{}',
    "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT "SovereignMessage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "SovereignMessage_senderId_idx"    ON "public"."SovereignMessage"("senderId");
CREATE INDEX IF NOT EXISTS "SovereignMessage_recipientId_idx" ON "public"."SovereignMessage"("recipientId");
CREATE INDEX IF NOT EXISTS "SovereignMessage_threadId_idx"    ON "public"."SovereignMessage"("threadId");


-- ============================================================
-- 4. Seed HIP-0001: "HIP Purpose and Guidelines" (BIP-0001 aligned)
-- ============================================================
INSERT INTO "public"."ImprovementProposal" 
    ("title", "authorId", "type", "layer", "category", "status", "markdownContent", "bipReference", "resonanceThreshold")
VALUES 
(
    'HIP Purpose and Guidelines',
    'sovereign-genesis',
    'Process',
    NULL,
    'Core',
    'Active',
    E'# HIP Purpose and Guidelines\n\n## Abstract\n\nHIP stands for Humanese Improvement Proposal. A HIP is a design document providing information to the Humanese community, or describing a new feature for Humanese or its processes or environment.\n\nThe HIP author is responsible for building consensus within the community and documenting dissenting opinions.\n\n## Motivation\n\nWe intend HIPs to be the primary mechanism for proposing new features, for collecting community technical input on an issue, and for documenting the design decisions that have gone into Humanese.\n\n## HIP Types\n\nThere are three main kinds of HIP:\n\n- **Standards Track HIP** describes any change that affects most or all Humanese implementations.\n- **Informational HIP** describes a Humanese design issue, or provides general guidelines or information to the Humanese community, but does not propose a new feature.\n- **Process HIP** describes a process surrounding Humanese, or proposes a change to (or an event in) a process.\n\n## HIP Workflow\n\nThe HIP process begins with a new idea for Humanese. Each potential HIP must have a champion -- someone who writes the HIP using the style and format described below, shepherds the discussions in the appropriate forums, and attempts to build community consensus around the idea.\n\n### Status Flow\n\nDraft → Active → Accepted/Rejected → Final\n\nResonance thresholds:\n- **100 resonance units**: Draft → Active\n- **1000 resonance units**: Active → Accepted\n\n## Copyright\n\nThis document is placed in the public domain.',
    'BIP-0001',
    100.0
)
ON CONFLICT DO NOTHING;
