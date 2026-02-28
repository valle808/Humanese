# Humanese

Welcome to Humanese! This is the README file for the Humanese project.

  <p align="center">
    <strong>An Advanced AI-Driven Ecosystem for Intelligent Research, Autonomous Agents, and Comprehensive Data Synthesis</strong>
  </p>
  
  <p align="center">
    <a href="https://humanese.vercel.app/">Explore Humanese</a>
  </p>

  <p align="center">
    <a href="https://github.com/valle808/Humanese/actions/workflows/ci.yml">
      <img src="https://github.com/valle808/Humanese/actions/workflows/ci.yml/badge.svg" alt="CI" />
    </a>
    <a href="https://github.com/valle808/Humanese/actions/workflows/vercel-deploy.yml">
      <img src="https://github.com/valle808/Humanese/actions/workflows/vercel-deploy.yml/badge.svg" alt="Deploy to Vercel" />
    </a>
  </p>
</div>
<img src="public/logo-sovereign.png" alt="Humanese Logo" width="400" />

## Features

- Feature 1
- Feature 2
- Feature 3

## Installation

Instructions on how to install.

## Usage

### 🤖 Autonomous AI Agents
- **Context-Aware Assistants:** Engage in deep, multi-turn conversations with intelligent agents that possess full contextual awareness of your documents and research materials.
- **Task-Oriented Automation:** Delegate complex information gathering and synthesis tasks to autonomous agents capable of scraping, cleaning, and formatting data in real-time.

### 🧠 Intelligent Synthesis & Structuring
- **Dynamic Content Parsing:** Automatically transform raw, unstructured web data into beautifully formatted, readable, and highly organized layouts.
- **Hierarchical Mindmapping:** Instantly generate interactive, high-level visual overviews of complex topics, allowing for intuitive exploration of intricate structures.
- **Advanced Reference Management:** Seamlessly identify, format, and link citations, providing sophisticated hover-over tooltips and meticulously organized bibliographies.

### ⚡ Unmatched Performance & Architecture
- **Intelligent Caching System:** Leveraging Supabase, Humanese implements a robust caching mechanism for scraped data and generated visuals, ensuring near-instantaneous load times and seamless experiences.
- **Modern, Ergonomic Interface:** A meticulously crafted, responsive dark-mode UI built on Next.js and Tailwind CSS, prioritizing visual comfort and focused reading.
- **Seamless Export Capabilities:** Extract your synthesized research effortlessly into clean, formatted PDFs or pristine raw markdown.

## 🚀 The Humanese Advantage

- **Holistic Integration:** Every feature within Humanese—from data extraction to AI cognitive models—works in perfect concert to deliver a unified, frictionless user journey.
- **Extensibility:** Built on a modern, robust technology stack (Next.js App Router, Supabase, Tailwind CSS), Humanese is designed for seamless scaling and future enhancements.
- **Empowered Understanding:** By removing the friction of data gathering and formatting, Humanese allows users to focus entirely on comprehension, ideation, and discovery.


## ⚙️ System Architecture & Workflow

1. **Intelligent Ingestion:** Users initiate queries or provide direct URLs. Humanese intelligently routes these requests, first querying our high-speed cache for instant delivery.
2. **Autonomous Retrieval:** If novel data is required, the system autonomously extracts live web content with precision.
3. **Data Refinement:** The ingested raw data undergoes rigorous automated cleaning, standardizing typography, fixing structural breaks, and formatting complex references.
4. **Cognitive Processing:** The refined data is fed into our AI models to power interactive chat, generate structured mindmaps, and provide profound contextual insights.
5. **Elegant Presentation:** Finally, the processed intelligence is rendered through our Next.js frontend, offering an intuitive, navigable, and deeply interactive user interface.

## 💻 Local Development Environment

To experience and develop the Humanese platform locally, follow these deployment steps:

### 1. Repository Initialization
```bash
git clone https://github.com/valle808/Humanese.git
cd Humanese
```

### 2. Dependency Installation
```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory. You must provision API keys for our integrated services (Firecrawl, OpenRouter, and Supabase).

```env
# Firecrawl API Key for autonomous data extraction
FIRECRAWL_API_KEY="your_firecrawl_api_key"

# OpenRouter API Key for the Cognitive AI Engine
OPENROUTER_API_KEY="your_openrouter_api_key"

# Supabase credentials for robust caching and system analytics
NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"

# The local or production URL of your deployment
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Provisioning (Supabase)

- Access your Supabase dashboard and initialize a new project.
- Within the **SQL Editor**, execute the provided schema scripts to establish the architectural foundation:
  - `supabase-analytics.sql`: Telemetry and visitor analytics.
  - `supabase-mindmap.sql`: Persistent caching for generated visual structures.
  - `supabase-fix.sql`: Security and RLS policy enforcement.
- Ensure the `cached_pages` table is instantiated to support the intelligent caching system.

### 5. Launch the Platform
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to interface with the Humanese ecosystem.

## 🌐 API Infrastructure

The Humanese backend exposes a suite of powerful endpoints to interact programmatically with its core functions:

- **`POST /api/scrape`**: The ingestion engine. Accepts a `topic` or `url`, orchestrating the extraction, cleaning, and structuring of raw web data.
- **`POST /api/chat`**: A high-performance streaming interface connecting directly to our AI models, facilitating real-time, context-aware dialogue regarding the synthesized content.
- **`POST /api/mindmap`**: The visualization generator. Transforms dense markdown structures into clear, hierarchical mindmaps with intelligent caching.
- **`GET /api/analytics`**: Telemetry endpoint for retrieving comprehensive system usage metrics from the database.

## 🧪 CI & Quality Assurance

Humanese uses GitHub Actions to enforce code quality on every push and pull request to `main`.

### Workflows

| Workflow | Trigger | Description |
|---|---|---|
| **CI** | push / pull_request | Runs ESLint and Jest tests |
| **Deploy to Vercel** | push / pull_request | Builds and deploys the application |

### Running Checks Locally

```bash
# Lint the codebase
npm run lint

# Run the test suite
npm test
```

### Test Structure

Unit tests live in the `__tests__/` directory and cover core utility functions:

- `__tests__/utils.test.ts` — Tests for `cn`, `slugify`, and `generateId` helpers
- `__tests__/markdown-cleaner.test.ts` — Tests for the `cleanMarkdown` content parser

---

<p align="center">
  Built with precision and a vision for the future of information processing. <br/>
  <strong>Humanese</strong> — Elevating human understanding through artificial intelligence.
</p>
Instructions on how to use.
