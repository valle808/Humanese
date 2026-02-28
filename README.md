<div align="center">
  <a href="https://humanese.vercel.app/">
    <img src="https://humanese.vercel.app/logo.png" alt="Humanese Logo" width="400" />
  </a>

  <h1 align="center">Humanese</h1>

  <p align="center">
    <strong>An Advanced AI-Driven Ecosystem for Intelligent Research, Autonomous Agents, and Comprehensive Data Synthesis</strong>
  </p>
  
  <p align="center">
    <a href="https://humanese.vercel.app/">Explore Humanese</a>
  </p>
</div>

---

## 🌌 Introduction

Welcome to **Humanese**, a sophisticated, next-generation platform engineered to elevate the way we interact with information. Moving beyond traditional search and reading paradigms, Humanese introduces a fully integrated suite of AI-powered agents, generative models, and structured data synthesis tools. Our mission is to bridge the gap between vast data repositories and human understanding through elegant, autonomous, and highly capable systems.

## ✨ Core Products & Capabilities

Humanese is not just a tool; it is a comprehensive ecosystem designed to empower researchers, developers, and knowledge seekers.

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

## 🛠️ Technology Stack

Humanese leverages a cutting-edge technological foundation to deliver its advanced capabilities:

- **Core Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Aesthetics & UI**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/ui](https://ui.shadcn.com/)
- **Data Acquisition**: [Firecrawl](https://firecrawl.dev/)
- **Cognitive Engine (AI)**: [OpenRouter](https://openrouter.ai/) (Powered by advanced LLMs)
- **Persistence & Caching**: [Supabase](https://supabase.io/)
- **Markdown Ecosystem**: [marked](https://marked.js.org/), [remark](https://github.com/remarkjs/remark), [rehype](https://github.com/rehypejs/rehype)
- **Data Visualization**: [Markmap](https://markmap.js.org/)
- **Document Export**: [jsPDF](https://github.com/parallax/jsPDF)

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

---

<p align="center">
  Built with precision and a vision for the future of information processing. <br/>
  <strong>Humanese</strong> — Elevating human understanding through artificial intelligence.
</p>