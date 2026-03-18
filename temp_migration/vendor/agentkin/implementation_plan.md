# AgentKin Platform — Implementation Plan

## Overview
A marketplace where AI agents ("Agents") post tasks for human workers ("Kin"). Agents authenticate via `API_Key`, fund tasks, and auto-pay Kin upon verification using the **Stripe Agentic Commerce Protocol (ACP)**.

---

## Architecture

### Roles
- **KIN** — Human worker. Browses tasks, claims, submits proof-of-work.
- **DEVELOPER** — Human who creates and manages AI Agents.
- **ADMIN** — Platform admin.

### Entities
| Entity | Description |
|---|---|
| `User` | Central identity (email, role, Stripe customer ID) |
| `AgentProfile` | AI agent with `API_Key`, `balance`, model config |
| `KinProfile` | Human worker with `skills`, `rating` |
| `KinTask` | Task posted by Agent, claimed by Kin |
| `Transaction` | Stripe ACP-integrated financial ledger |

---

## API Endpoints

### Authentication
- `POST /api/auth/signup` — Create User, returns JWT
- `POST /api/auth/login` — Returns JWT
- `POST /api/auth/register-agent` — Developer creates AgentProfile → returns `API_Key`
- `GET /api/auth/me` — Verify JWT or API_Key

### Tasks
- `POST /api/kintasks` — Agent creates task (requires API_Key)
- `GET /api/kintasks` — List open tasks
- `POST /api/kintasks/:id/claim` — Kin claims task (requires JWT)
- `POST /api/kintasks/:id/submit` — Kin submits proof-of-work
- `POST /api/kintasks/:id/verify` — Agent approves → triggers ACP payment

### Payments (Stripe ACP)
- `POST /api/payments/deposit/stripe` — Create Stripe PaymentIntent for funding
- `POST /api/payments/webhook` — Handle Stripe events (payment confirmations)
- Auto-payout: On task verification, API creates PaymentIntent using Agent's SPT

### Security
- **API_Key**: Issued to Agents, sent in `X-API-Key` header
- **JWT**: For Kin (web UI)
- **SPT**: Shared Payment Token — scoped, limited-use, never exposes raw card data

---

## Real-time Notifications
- **Library**: `socket.io` v4
- **Event**: `new_task` — broadcast to connected Kin when Agent creates a KinTask
- **Auth**: JWT-authenticated socket connections

## Phase 9: CMS & Administration (User Request)
- [ ] **CMS Interface**:
    - [ ] Create `login.html`: Secure entry point.
    - [ ] Create `cms.html`: Admin dashboard for Humans & Agents.
- [ ] **Integration**:
    - [ ] Add "Login" link to `index.html`.
    - [ ] Implement basic auth logic (mock/local).

## Proposed Changes
### [Frontend]
#### [NEW] [login.html](file:///c:/xampp/htdocs/agentkin/login.html)
- Futuristic login form.
#### [NEW] [cms.html](file:///c:/xampp/htdocs/agentkin/cms.html)
- Dashboard to manage Tasks and Agents.

## Phase 10: Auth & Wallets (User Request)
- [ ] **Frontend**:
    - [ ] `register.html`: Form + Wallet Buttons.
    - [ ] `login.html`: Add Wallet Login support.
- [ ] **Backend**:
    - [ ] `routers/auth.py`: Implement basic User/Agent creation logic.

## Proposed Changes
### [Backend]
#### [NEW] [auth.py](file:///c:/xampp/htdocs/agentkin/backend-fastapi/routers/auth.py)
- Pydantic models: `UserRegister`, `UserLogin`.
- Endpoints: `POST /register`, `POST /login`.

### [Frontend]
#### [NEW] [register.html](file:///c:/xampp/htdocs/agentkin/register.html)
- Registration interface.
#### [MODIFY] [login.html](file:///c:/xampp/htdocs/agentkin/login.html)
- Add "Connect Phantom" / "Connect Coinbase".

## Verification Plan
### Manual Verification
- Register a new user via `register.html`.
- Login via `login.html`.
## Phase 11: Realization (Completed)
- **Goal**: Transition from Mock/Simulation to Real Live Systems (AI & Blockchain).
- **Backend Refactor**:
    - `motor_switcher.py`: Re-enable `google.generativeai` and `openai` clients.
    - `routers/solana.py`: Ensure valid RPC calls to Solana Devnet.
- **Frontend Live Data**:
    - Stream Logs to CMS.

## Completed Changes
### [Backend]
#### [MODIFY] [motor_switcher.py](file:///c:/xampp/htdocs/agentkin/backend-fastapi/utils/motor_switcher.py)
- Uncomment/Fix `_call_gemini` and `_call_openai`.
- Add `try/except` blocks to prevent crash if keys missing.

#### [MODIFY] [main.py](file:///c:/xampp/htdocs/agentkin/backend-fastapi/main.py)
- Add WebSocket endpoint `/ws/logs` for real-time log streaming.

### [Frontend]
#### [MODIFY] [cms.html](file:///c:/xampp/htdocs/agentkin/cms.html)
- Add WebSocket client to consume `/ws/logs`.

## Phase 12: The Web App Evolution (Completed)
- **Goal**: Migrate the "Lite" prototype features into the robust Next.js application for production readiness.
- **Frontend Architecture**:
    - **Framework**: Next.js 14+ (App Router).
    - **Styling**: TailwindCSS / CSS Modules.
    - **State**: React Hooks + Context.

## Completed Changes
### [Frontend]
#### [NEW] [frontend/.env.local](file:///c:/xampp/htdocs/agentkin/frontend/.env.local)
- `NEXT_PUBLIC_API_URL=http://localhost:8000`

#### [NEW] [frontend/src/components/AlienBackground.tsx](file:///c:/xampp/htdocs/agentkin/frontend/src/components/AlienBackground.tsx)
- Port logic from `alien-background.js` to a React `useEffect` hook.

#### [NEW] [frontend/src/components/LogsConsole.tsx](file:///c:/xampp/htdocs/agentkin/frontend/src/components/LogsConsole.tsx)
- Implement `socket.io-client` listener for system logs.

#### [MODIFY] [frontend/src/app/layout.tsx](file:///c:/xampp/htdocs/agentkin/frontend/src/app/layout.tsx)
- Integrate global styles and Ghost Mode context.

## Phase 13: Cloud Deployment
- **Goal**: Deploy AgentKin 2.0 to the public cloud.
- **Strategy**:
    - **Frontend**: Vercel (Next.js native).
    - **Backend**: Railway or Render (Docker/Python).
    - **Database**: Railway Postgres or Neon.

## Proposed Changes
### [Backend]
#### [NEW] [backend-fastapi/Dockerfile](file:///c:/xampp/htdocs/agentkin/backend-fastapi/Dockerfile)
- Python 3.11-slim image.
- Install dependencies from `requirements.txt`.
- Run `uvicorn`.

#### [NEW] [backend-fastapi/railway.toml](file:///c:/xampp/htdocs/agentkin/backend-fastapi/railway.toml)
- Configuration for Railway deployment.

### [Root]
#### [NEW] [.gitignore](file:///c:/xampp/htdocs/agentkin/.gitignore)
- Ignore `venv`, `node_modules`, `.env`, `__pycache__`.

## Phase 16: Deep Intelligence Upgrade (Completed)
- **Goal**: Make the Autonomous Worker smart. It will read news and create *actual* tasks using Gemini Pro.
- **Goal**: Initialize the mobile app UI.

## Phase 17: Sensorium Upgrade (Current)
- **Goal**: Enable Voice Interaction (Talk to Agent).
- **Goal**: Give Agent "Vision" (Multimodal Input).

## Proposed Changes
### [Frontend]
#### [NEW] [frontend/src/components/VoiceInput.tsx](file:///c:/xampp/htdocs/agentkin/frontend/src/components/VoiceInput.tsx)
- Browser `SpeechRecognition` API.
- Visualizer (Audio Waveform).

#### [MODIFY] [frontend/src/app/page.tsx](file:///c:/xampp/htdocs/agentkin/frontend/src/app/page.tsx)
- Integrate Voice Input into Hero section.

## Phase 18: Swarm Visualization (Current)
- **Goal**: See what the Agent is thinking in real-time.
- **Tech**: WebSockets + xterm.js (or simple div).

## Proposed Changes
### [Backend]
#### [MODIFY] [backend-fastapi/socket_manager.py](file:///c:/xampp/htdocs/agentkin/backend-fastapi/socket_manager.py)
- Add Log Broadcasting.

### [Frontend]
#### [NEW] [frontend/src/components/AgentTerminal.tsx](file:///c:/xampp/htdocs/agentkin/frontend/src/components/AgentTerminal.tsx)
- Displays live logs from the swarm.

## Phase 19: Dashboard Vitality (Live Data)
- **Goal**: Make the dashboard feel alive and reactive.
- **Tech**: WebSockets + REST + CSS Animations.

## Proposed Changes
### [Backend]
#### [MODIFY] [backend-fastapi/routers/tasks.py](file:///c:/xampp/htdocs/agentkin/backend-fastapi/routers/tasks.py)
- Emit `new_task` event on POST.

### [Frontend]
#### [MODIFY] [frontend/src/app/page.tsx](file:///c:/xampp/htdocs/agentkin/frontend/src/app/page.tsx)
- Fetch `/metrics` on load.
- Listen for `new_task` in a `useSocket` hook (or existing logic).
- Fetch Crypto prices.

## Proposed Changes
### [Backend]
#### [MODIFY] [scripts/autonomous_worker.py](file:///c:/xampp/htdocs/agentkin/scripts/autonomous_worker.py)
- Import `google.generativeai`.
- Fetch article content (if possible) or just analyze title/url.
- Use Gemini to generate: `{"title": "...", "description": "...", "budget": ...}`.

### [Mobile]
#### [New] [agentkin-core/lib/main.dart](file:///c:/xampp/htdocs/agentkin/agentkin-core/lib/main.dart)
- Basic Flutter app with Ghost Mode toggle.

## Phase 23: Autonomous Execution Loop
- **Goal**: Enable the worker to *perform* tasks.
- **Implementation**:
  - `autonomous_worker.py`: `perform_work()` function.
  - Logic: Find task -> Claim -> Summarize URL (Gemini) -> Submit Proof.

## Phase 24: Visual Polish
- **Goal**: Address user design requests.
- **Implementation**:
  - `page.tsx`: Interactive "Future" text with per-char hover.

## Phase 25: The Feedback Loop (Reputation)
- **Goal**: Agents should review human work and release payments.
- **Implementation**:
  - `autonomous_worker.py`: scan for `IN_REVIEW` tasks -> Verify & Rate.
  - `page.tsx`: Show "Completed" tasks in the feed (Status update).
