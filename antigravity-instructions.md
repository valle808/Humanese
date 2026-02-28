# Antigravity Agent Instructions — Humanese / DeepGrok

> **For Google Antigravity AI agents**: This document provides full context, instructions, and
> artifact references so you can instantly understand the repository and act on it.

---

## Repository Overview

**Project name**: Humanese (also known as DeepGrok internally)  
**Framework**: Next.js 14 (App Router) + TypeScript  
**Purpose**: An AI-powered sovereign knowledge platform that combines wiki-style pages,
mind-map generation, a skill market, a learning planner, and Monroe — a living digital
AI assistant persona built on OpenRouter-hosted LLMs.

---

## Integrated Stack

This repository is fully integrated with the following services. Antigravity agents have
permission to read, configure, and deploy to all of them.

| Service | Role | Key Config |
|---|---|---|
| **Vercel** | Primary hosting & CI/CD for the Next.js app | `vercel.json`, `.github/workflows/vercel-deploy.yml` |
| **Firebase** | Firestore database + supplemental hosting | `firebase.json`, `.firebaserc`, `lib/firebase.ts` |
| **Supabase** | Primary Postgres DB, Auth, Storage, Realtime | `supabase/config.toml`, `lib/supabase.ts` |
| **GitHub MCP Server** | Model Context Protocol bridge to GitHub | `mcp-config.json` |

---

## Directory Map

```
/
├── app/                    # Next.js App Router pages & API routes
│   └── api/
│       ├── monroe/chat/    # Monroe AI assistant chat endpoint
│       ├── sovereign/agent/# Agent King planning endpoint
│       └── ...             # Other feature API routes
├── agents/                 # Agent orchestration logic
├── components/             # React UI components (including MonroeAssistant)
├── lib/
│   ├── firebase.ts         # Firebase initialisation (Firestore + Auth)
│   └── supabase.ts         # Supabase client initialisation
├── supabase/
│   └── config.toml         # Supabase local-dev configuration
├── .github/workflows/
│   ├── vercel-deploy.yml   # Automated Vercel deployments
│   ├── firebase-deploy.yml # Automated Firebase deployments
│   └── ...
├── mcp-config.json         # GitHub MCP Server configuration
├── vercel.json             # Vercel project configuration
├── firebase.json           # Firebase project configuration
├── .firebaserc             # Firebase project alias (humanese)
└── .antigravity.yaml       # Machine-readable Antigravity config
```

---

## Deployment Workflows

### Vercel (`.github/workflows/vercel-deploy.yml`)
- **Trigger**: push to `main` (production) or any pull request (preview).
- **Steps**: checkout → Node 20 → `npm ci` → `npm run build` → Vercel deploy.
- **Required GitHub Secrets**: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

### Firebase (`.github/workflows/firebase-deploy.yml`)
- **Trigger**: push to `main`.
- **Steps**: checkout → Node 20 → `npm ci` → `npm run build` → Firebase Hosting deploy.
- **Required GitHub Secrets**: `FIREBASE_SERVICE_ACCOUNT`.

---

## Environment Variables

Set the following secrets in GitHub and/or Vercel before running the workflows:

### Required
| Variable | Source |
|---|---|
| `OPENROUTER_API_KEY` | OpenRouter dashboard |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project settings |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase console |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase console |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase console |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase console |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase console |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase console |

### Optional
| Variable | Purpose |
|---|---|
| `FIRECRAWL_API_KEY` | Web scraping for wiki-style pages |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side Supabase operations |
| `GITHUB_PERSONAL_ACCESS_TOKEN` | GitHub MCP Server (read/write repo access) |

---

## GitHub MCP Server (`mcp-config.json`)

The `mcp-config.json` file at the repository root configures the
[Model Context Protocol](https://modelcontextprotocol.io/) server for GitHub.

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    }
  }
}
```

Antigravity agents can use this MCP server to:
- List and read files in the repository
- Create or update issues and pull requests
- Trigger workflow dispatches
- Query commit history and branch information

---

## Supabase Local Development

```bash
# Install the Supabase CLI
npm install -g supabase

# Start the local stack (Postgres, Auth, Storage, Studio)
supabase start

# Apply SQL migrations
supabase db reset

# Link to the remote project
supabase link --project-ref <your-project-ref>

# Push local schema to remote
supabase db push
```

The local Studio UI is available at `http://localhost:54323` after `supabase start`.

---

## Agent Instructions

1. **Repository is fully integrated** with Vercel, Firebase, Supabase, and the GitHub MCP
   server. Treat these as production-grade services.
2. **Secrets are stored in GitHub Actions** (Settings → Secrets → Actions). Do not hard-code
   credentials.
3. **Monroe** (`app/api/monroe/chat/route.ts`) is the primary conversational agent. She routes
   through OpenRouter. The Co-Agent (`CO_AGENT_SOUL`) activates during Monroe's maintenance
   windows.
4. **Agent King** (`app/api/sovereign/agent/route.ts`) handles multi-step planning tasks.
5. **MCP integration** allows agents to interact with the repo directly via
   `@modelcontextprotocol/server-github`. Always source the token from
   `GITHUB_PERSONAL_ACCESS_TOKEN`.
6. **Database migrations** live in the root-level `supabase-*.sql` files and should be run via
   `supabase db reset` or applied manually in the Supabase SQL Editor.
7. **Do not modify** `.github/agents/` — these files contain separate agent instructions
   not related to Antigravity.
