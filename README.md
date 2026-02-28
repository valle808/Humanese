<p align="center">
  <a href="https://humanese.vercel.app/index.html">
    <img src="public/logoWhite.png" alt="Humanese" width="260" />
  </a>
</p>

<h1 align="center">Humanese</h1>

<p align="center">
  <em>The Sovereign AI Ecosystem — Where Intelligence Meets Autonomy</em>
</p>

<p align="center">
  <a href="https://humanese.vercel.app/index.html"><img src="https://img.shields.io/badge/Live%20Platform-humanese.vercel.app-6366f1?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Platform" /></a>
  <img src="https://img.shields.io/badge/Framework-Next.js%2014-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Backend-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Deployment-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge" alt="License" />
</p>

---

> **Humanese** is a next-generation sovereign AI platform that bridges the gap between raw machine intelligence and meaningful human interaction. It is not merely a product — it is an evolving ecosystem of autonomous agents, intelligent tools, and integrated services designed to amplify human potential at every scale.

---

## Table of Contents

- [Vision](#vision)
- [The Humanese Ecosystem](#the-humanese-ecosystem)
- [Products & Capabilities](#products--capabilities)
- [AI Agent Architecture](#ai-agent-architecture)
- [Integrations & Infrastructure](#integrations--infrastructure)
- [Technology Stack](#technology-stack)
- [Local Development](#local-development)
- [API Reference](#api-reference)
- [Database Setup](#database-setup)
- [Contributing](#contributing)

---

## Vision

> *"To create an intelligent layer between human thought and digital action — one that understands context, anticipates need, and executes with precision."*

Humanese is built on the belief that AI should feel **natural, sovereign, and human-centered**. Every component of the ecosystem is designed to reduce friction, eliminate cognitive overhead, and empower users with capabilities once reserved for entire engineering teams.

---

## The Humanese Ecosystem

Humanese is composed of several tightly integrated sub-systems and products, each serving a distinct role within the broader sovereign intelligence architecture:

| Product | Description |
|---|---|
| **Humanese Core** | The central AI orchestration layer powering the platform |
| **ClawdX** | Autonomous agent framework for multi-step task execution |
| **Parallelpedia** | AI-enhanced knowledge base with parallel context retrieval |
| **ULM** | Universal Language Model interface for cross-model inference |
| **Sovereign Matrix** | Autonomous workflow and decision-routing engine |
| **Skill Market** | Extensible marketplace for shareable AI agent capabilities |
| **EduVerify** | Intelligent credential and knowledge-verification system |
| **Automaton** | Low-code automation builder powered by AI reasoning |

---

## Products & Capabilities

### 🧠 Intelligent Knowledge Retrieval

Humanese integrates deep semantic search and real-time content scraping to surface knowledge instantly:

- **Semantic Article Parsing** — Automatically structures retrieved content into clean, navigable layouts with a sticky table of contents.
- **Interactive Mindmaps** — Generates hierarchical visual maps of any topic for rapid high-level comprehension.
- **Advanced Citation Engine** — Identifies, links, and renders citations with hover-over tooltips and structured reference sections.
- **Performance Caching** — Supabase-powered caching layer ensures near-instant retrieval for previously visited content.

### 💬 Conversational AI Interface

- **Context-Aware Chat** — AI assistants with full document context, capable of answering nuanced questions about any loaded content.
- **Streaming Responses** — Real-time, token-by-token response streaming for a fluid, natural conversational experience.
- **Multi-Model Routing** — Intelligently routes queries to the most capable available model via OpenRouter.

### 📤 Export & Portability

- **PDF Export** — One-click export of any article as a clean, professionally formatted PDF document.
- **Markdown Export** — Copy cleaned, processed markdown to clipboard for use in any downstream workflow.

### 🎨 Design & Experience

- **Sovereign Dark UI** — A meticulously crafted, always-dark interface that prioritizes readability and reduces cognitive strain.
- **Responsive Layout** — Fully adaptive across desktop, tablet, and mobile viewports.
- **Shader-Powered Visuals** — GPU-accelerated visual effects for an immersive, futuristic aesthetic.

---

## AI Agent Architecture

Humanese employs a multi-layered autonomous agent architecture designed for composability, resilience, and extensibility:

### Agent Layers

```
┌─────────────────────────────────────────────────────────┐
│                    HUMANESE PLATFORM                    │
├──────────────────────┬──────────────────────────────────┤
│   Orchestration Layer│  Sovereign Matrix / ClawdX       │
├──────────────────────┼──────────────────────────────────┤
│   Reasoning Layer    │  ULM — Universal Language Model  │
├──────────────────────┼──────────────────────────────────┤
│   Memory Layer       │  Supabase + Firebase + Monroe    │
├──────────────────────┼──────────────────────────────────┤
│   Action Layer       │  GitHub MCP · Automaton · APIs   │
├──────────────────────┼──────────────────────────────────┤
│   Interface Layer    │  Next.js · Skill Market · Chat   │
└──────────────────────┴──────────────────────────────────┘
```

### Core Agent Capabilities

- **ClawdX Agents** — Autonomous, multi-step task executors that decompose complex goals into actionable sub-tasks, execute them in parallel where possible, and synthesize results into coherent outputs.
- **Deep Research Agents** — Agents specialized in traversing, summarizing, and cross-referencing large knowledge corpora to produce research-grade outputs.
- **Monroe Memory System** — A persistent, long-term agent memory layer that enables contextual continuity across sessions and workflows.
- **Sovereign Matrix** — A high-level decision-routing engine that orchestrates agent cooperation, conflict resolution, and goal prioritization autonomously.

### GitHub MCP Server Integration

Humanese connects natively to the **GitHub Model Context Protocol (MCP) server**, enabling agents to:

- Read, analyze, and reason over entire codebases
- Trigger automated pull requests, issue triage, and code reviews
- Execute multi-repository workflows through natural language commands
- Maintain stateful context across long-horizon software development tasks

### Google Antigravity IDE Integration

Humanese is designed for seamless deployment within the **Google Antigravity IDE** environment:

- Direct agent invocation from within the IDE workspace
- Real-time code intelligence powered by Humanese's ULM layer
- Autonomous refactoring, documentation generation, and test synthesis
- Bi-directional communication between IDE context and Humanese agent memory

---

## Integrations & Infrastructure

Humanese is built on a modern, battle-tested cloud-native stack:

### ☁️ Deployment — Vercel

The Humanese platform is deployed on **Vercel** with edge-optimized routing, ensuring:
- Sub-100ms global response times via Vercel's Edge Network
- Automatic preview deployments on every branch
- Serverless function scaling for all API routes
- Live platform: **[humanese.vercel.app](https://humanese.vercel.app/index.html)**

### 🔥 Real-Time Backend — Firebase

Firebase powers Humanese's real-time capabilities:
- Live agent state synchronization across sessions
- Real-time collaborative features and presence indicators
- Secure serverless authentication and authorization
- Cloud Functions for event-driven agent triggers

### 🗄️ Persistent Storage — Supabase

Supabase serves as Humanese's primary relational data layer:
- Page and mindmap caching for near-instant content retrieval
- Visitor analytics and usage telemetry
- Agent memory persistence via the Monroe Memory schema
- Row-Level Security (RLS) for multi-tenant data isolation
- Skill Market catalog and transaction records
- Sovereign Matrix state and workflow definitions

---

## Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) — App Router, Server Components, Streaming |
| **Language** | [TypeScript](https://www.typescriptlang.org/) — Fully typed throughout |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/ui](https://ui.shadcn.com/) |
| **AI & LLMs** | [OpenRouter](https://openrouter.ai/) — Multi-model inference routing |
| **AI SDK** | [Vercel AI SDK](https://sdk.vercel.ai/) — Streaming, tool-calling, agents |
| **Scraping** | [Firecrawl](https://firecrawl.dev/) — Intelligent web content extraction |
| **Database** | [Supabase](https://supabase.io/) — Postgres, realtime, auth, storage |
| **Real-Time** | [Firebase](https://firebase.google.com/) — Live sync & cloud functions |
| **Markdown** | [marked](https://marked.js.org/), [remark](https://github.com/remarkjs/remark), [rehype](https://github.com/rehypejs/rehype) |
| **Mindmaps** | [Markmap](https://markmap.js.org/) — Interactive hierarchical visualization |
| **PDF Export** | [jsPDF](https://github.com/parallax/jsPDF) |
| **Visuals** | [Paper Shaders](https://github.com/paper-design/shaders) — GPU shader effects |

---

## Local Development

### Prerequisites

- Node.js 18+
- A Supabase project
- A Firebase project
- API keys for Firecrawl and OpenRouter

### Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/valle808/Humanese.git
   cd Humanese
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env.local` file in the project root:

   ```env
   # Firecrawl — Web content extraction
   FIRECRAWL_API_KEY="your_firecrawl_api_key"

   # OpenRouter — Multi-model AI inference
   OPENROUTER_API_KEY="your_openrouter_api_key"

   # Supabase — Database, caching, and analytics
   NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"

   # Firebase — Real-time backend
   NEXT_PUBLIC_FIREBASE_API_KEY="your_firebase_api_key"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_firebase_project_id"

   # Application URL
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Database Setup

Humanese uses Supabase for all persistent data. Run the following SQL files against your Supabase project in sequence:

| File | Purpose |
|---|---|
| `supabase-analytics.sql` | Visitor tracking and usage telemetry |
| `supabase-mindmap.sql` | Mindmap generation cache |
| `supabase-skill-market.sql` | Skill Market catalog and records |
| `supabase-sovereign-matrix.sql` | Sovereign Matrix state definitions |
| `supabase-monroe-memory.sql` | Monroe long-term agent memory |
| `supabase-fix.sql` | RLS policy helper (run if permission issues occur) |

You will also need the core `cached_pages` table:

```sql
CREATE TABLE cached_pages (
  id          BIGSERIAL PRIMARY KEY,
  url         TEXT UNIQUE NOT NULL,
  title       TEXT,
  markdown    TEXT NOT NULL,
  metadata    JSONB,
  cached_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Apply appropriate RLS policies consistent with the other SQL files.
```

---

## API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/scrape` | `POST` | Scrape and parse a topic or URL with caching |
| `/api/chat` | `POST` | Streaming conversational AI with document context |
| `/api/mindmap` | `POST` | Generate and cache a hierarchical mindmap structure |
| `/api/analytics` | `GET` | Retrieve visitor analytics from Supabase |

---

## Contributing

Humanese is a living, evolving ecosystem. Contributions that advance the vision of sovereign, human-centered AI are warmly welcomed.

Please review [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to participate.

---

<p align="center">
  <a href="https://humanese.vercel.app/index.html">
    <img src="https://img.shields.io/badge/Visit%20Humanese-humanese.vercel.app-6366f1?style=for-the-badge&logo=vercel&logoColor=white" alt="Visit Humanese" />
  </a>
  &nbsp;
  <a href="https://github.com/valle808/Humanese">
    <img src="https://img.shields.io/badge/GitHub-valle808%2FHumanese-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
</p>
