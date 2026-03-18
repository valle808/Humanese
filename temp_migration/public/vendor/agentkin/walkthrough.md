# AgentKin Portal – Walkthrough

## Overview
This document details the transformation of the AgentKin portal into a futuristic, high-performance workspace for decentralized AI agents.

## 🎨 Theme & Aesthetics
- **Core Theme**: "Clean, Clear, and Intense Orange".
- **Palette**:
  - **Background**: Pure White (`#FFFFFF`) / Light Grey Surface (`#F5F5F7`).
  - **Text**: Deep Black (`#111111`) / Dark Grey (`#666666`).
  - **Accent**: International Orange (`#FF4D00`).
- **Design System**: 12-column Bento Grid with soft shadows and sharp borders.

## ✨ Animations & Physics
The site features advanced, mouse-reactive physics to create a living digital environment.

### 1. Hero Text Physics
- **Title ("Build the Future")**: Letters are individual physical entities that scatter when the mouse approaches and snap back.
- **Subtext ("Decentralized AI...")**: Materializes from the void with a **Spectral Fade** (blur + rotation), then becomes physically interactive after stabilizes.
- **Underline**: The orange line under "Future" **draws itself** on load and acts as a rigid body that bends away from the cursor.

### 2. CTA Button
- **Shape**: Friendly Pill (`border-radius: 50px`).
- **Interaction**:
  - **Idle**: Subtle "breathing" pulse.
  - **Hover**: A beam of light (sheen) slides across the surface.
  - **Physics**: Smooth magnetic attraction to the cursor.

### 3. Backgrounds
- **Home (`index.html`)**: **Monochrome Architect**. A clean 3D particle system in charcoal/grey. Interaction triggers **Intense Orange** connections and glow.
- **Terms (`terms.html`)**: **Alien Dimension**. A dark, holographic neural grid with iridescent colors (Cyan/Magenta/Lime) and a warping "Black Hole" mouse effect.

## 🔗 Backend Integration
- **Live Data**: The "Live Tasks" card fetches real data from `http://localhost:8000/tasks`.
- **Display**: Shows Task Title and ID.
- **Status Mapping**:
  - `RUNNING` -> Active (Green glow).
  - `COMPLETED` -> Done (Green text).
  - `OPEN` -> Default (Grey).
- **Fallback**: Gracefully degrades to demo data if the API is unreachable.

## 📱 PWA Support
- **Manifest**: `manifest.json` configured for standalone install.
- **Service Worker**: `service-worker.js` caches core assets.
- **Install Prompt**: **Persistent "Install App" button** in the header.

## 🧠 Active Intelligence (Phase 8)
### Phase 8: Active Intelligence
- **Autonomous Worker**: Python agent scraping HackerNews and posting tasks.
- **Wallet Connect**: Phantom Wallet integration on Dashboard. (v1)

### Phase 9: CMS & Administration
- **Secure Access**: `login.html` with credential verification.
- **Command Center**: `cms.html` for managing Tasks and Agents.

### Phase 10: Digital Identity & Wallets
- **Registration**: `register.html` for new Humans and Agents.
- **Unified Login**: `login.html` now supports:
    - **Phantom** (Solana)
    - **Coinbase Wallet** (EVM)
    - Standard Email/Password
- **Backend Auth**: New `router/auth.py` handling identity creation.

### Visual Upgrades
- **Ghost Mode 2.0**: Integrated "Alien Dimension" background and custom cursor from Terms page for enhanced privacy mode visualization.

### Phase 11: Realization (Live Systems)
- **Live AI**: Connected Backend to OpenAI (GPT-4) and Google Gemini via `motor_switcher.py`.
- **System Logs**: Implemented real-time WebSocket logging stream to CMS Console (`/ws/logs`).
- **Access Control**: Seeded Admin User (`valle808` / `admin`).
- **Automation**: `autonomous_worker.py` now triggers real AI processing via background tasks.

### Phase 12: Next.js Evolution
- **Migration**: Ported full application to Next.js 14 App Router (`frontend/`).
- **New Components**:
    - `AlienBackground.tsx`: React-based visual system for Ghost Mode.
    - `LogsConsole.tsx`: Live WebSocket terminal for system monitoring.
    - `Navbar.tsx`: Integrated Ghost Mode toggle and Wallet Connect.
- **State**: Implemented `GhostContext` for global visual state management.

### Phase 13: Cloud Readiness
- **Docker**: Containerized `backend-fastapi` with Python 3.11-slim.
- **Config**: Added `railway.toml` for seamless backend deployment.
- **Git**: Initialized repository with `.gitignore` covering Next.js, Python, and Flutter (`agentkin-core`).

### Phase 14: Visual Mastery
- **Cursor**: Restored custom glowing cursor ("Green Matrix Dot") for Ghost Mode.
- **Glassmorphism**: Unified transparency across Dashboard and Log Console.

- **Version Control**: Git repository initialized and secured.

### Phase 15: Ecosystem Documentation
- **Master Guide**: Rewrote `README.md` to cover Next.js, FastAPI, and Mobile components.
- **Deployment**: Added `DEPLOY.md` with Vercel/Railway instructions.
- **Mobile**: Initialized `agentkin-core` documentation.

### Phase 16: Deep Intelligence & Mobile
- **AI Upgrade**: Upgraded `autonomous_worker.py` to use **Gemini Pro** for real-time news analysis.
- **Mobile Foundation**: Built Flutter App (`agentkin-core`) with:
    - **Riverpod** State Management.
    - **Ghost Mode** Toggle & Theming.
    - **AlienBackground** (CustomPainter).

### Phase 18: Swarm Visualization
- Implemented `AgentTerminal.tsx` to visualize backend logs.

### Phase 19: Dashboard Vitality
- Connected Dashboard cards to Live Data.
- Implemented Market Simulation for Assets.

### Phase 20: Mobile Companion
- Built Flutter Dashboard (`dashboard.dart`).
- Configured API connectivity for Android Emulator (`10.0.2.2`).

### Phase 23: Autonomous Execution Loop
- Upgraded `autonomous_worker.py` to also **perform** and **verify** tasks (Feedback Loop).
- Agents now rate the Kin (Worker) upon completion.

### Phase 26: Signature & Polish (Verified)
- **Signature Hotfix**: Patched invalid comment syntax (`#` -> `//`) across 14 source files using `hotfix_signatures.py`.
- **Dependency Isolation**: Removed corrupted root `node_modules` and renamed root `package-lock.json` to prevent build conflicts.
- **Production Build**: Verified Frontend build (`npm run build`) with **Exit Code 0**.
- **Privacy Page**: Added `/privacy` route to complete the footer links.
- **Diagnostics**: Created `scripts/check_flutter.ps1` for environment diagnostics.

## 🚀 Deployment
One-click launch is now available via PowerShell:

```powershell
.\start_agentkin.ps1
```
This script:
1.  Terminates any stale backend processes.
2.  Launches the **FastAPI Neural Core** on `localhost:8000`.
3.  Opens the **AgentKin Dashboard** in your default browser.

## Files
- `index.html`: Main portal (Light Theme).
- `terms.html`: Terms of Service (Dark Alien Theme).
- `antigravity-background.js`: Home background logic.
- `alien-background.js`: Terms background logic.
- `start_agentkin.ps1`: Unified launch script.

## Phase 27: Final Polish (✅ Complete)
- **Visual Repair**:
  - Implemented `AntigravityBackground.tsx` for Light Mode (3D Particles).
  - Fixed `page.tsx` background transparency to reveal particles.
  - Linked Footer to `/terms` and `/privacy` using Next.js routing.
- **Cleanup**:
  - Restored legacy root files (`index.html`, `terms.html`, etc.) for backward compatibility.
  - Hardened `AntigravityBackground.tsx` with transparent canvas and high-contrast particles.

## Phase 28: Cloud Readiness (✅ Ready)
- **Backend**: Verified `Dockerfile` is production-ready (Python 3.11-slim, Port Injection).
- **Frontend**: Verified `package.json` scripts for Vercel deployment.
- **Config**: Created `.env.production.example` for secure variable management.
## Phase 29: Mobile Parity (✅ Complete)
- **Visuals**: Created `AntigravityBackgroundMobile` for Flutter (Light Mode 3D Particles).
- **Integration**: Updated `GhostScaffold` to switch backgrounds dynamically.
- **Consistency**: Unified Web and Mobile visual languages.
## Phase 30: Code Quality (✅ Complete)
- **Linting**: Fixed `@solana` import issues and CSS compatibility warnings.
- **Build**: Verified Frontend Production Build (`npm run build`).

## Phase 31: Visual Mastery & Financial Integrity (✅ Complete)

### 🌊 Acid Disintegration Effect
A premium visual sequence triggered when the Login window is minimized:
- **Chemical Burn**: The window dissolves using a custom `mask-image` animation that simulates paper melting in acid.
- **Particle Swarm**: Spawns 80+ "bubbles" and "smoke" particles that travel from the window's center to the login button.
- **Bezier Physics**: Particles follow randomized quadratic curves with intentional "wiggle" jitters for a natural fluid feel.
- **Dynamic Button States**: The login button transitions from an `empty` (hollow) state when the window is open to a `filled` (neon glow) state once the disintegration "matter" returns to it.

### 💰 Revenue Recording System
Hardened the financial core with automated fee tracking:
- **Platform Fee**: Implemented a mandatory **3% platform fee** deducted from all Kin (worker) payouts.
- **Database Persistence**: Introduced the `PlatformRevenue` model to track every fee earned by the protocol.
- **Precision Math**: Upgraded the backend to use `Decimal` objects for all financial calculations, preventing float-point errors.
- **Multi-Client Verification**: Regenerated both the JS and Python Prisma clients with experimental decimal support enabled.
