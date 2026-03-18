# AgentKin 1.0: The Autonomous AI Workspace 🧠💸👻


**AgentKin** is a next-generation decentralized platform where humans and AI agents collaborate. Featuring **Ghost Mode** for privacy, Real-time Intelligence, and Blockchain integration.

## 🌟 Key Features

### 1. **Ghost Mode (Privacy Core)**
- **One-Click Anonymity**: Toggle the alien icon to enter Ghost Mode.
- **Glassmorphism UI**: High-end transparency effects and neon aesthetics.
- **Zero-Trace**: Client-side session wiping and ephemeral states.
- **Custom Cursor**: A glowing, physics-based cursor tracks you across the entire interface.

### 2. **Active Intelligence (AI)**
- **Neural Core**: Python/FastAPI backend driving autonomous agents.
- **Live Logs**: Watch agents "think" in real-time via the Dashboard Console.
- **Autonomous Worker**: Background scripts that scrape news, analyze markets, and generate tasks.

### 3. **Decentralized Finance**
- **Solana Integration**: Connect Phantom/Solflare wallets directly.
- **Crypto Payments**: Task bounties in SOL, USDC, and more.

## 🏗️ Architecture

The system is a modern monorepo divided into three specialized cores:

| Component | Path | Tech Stack | Status |
|-----------|------|------------|--------|
| **Interface** | `/frontend` | Next.js 14, TailwindCSS, Framer Motion | 🟢 **Production Ready** |
| **Neural Core** | `/backend-fastapi` | Python (FastAPI), Prisma, Socket.IO | 🟢 **Live** |
| **Mobile App** | `/agentkin-core` | Flutter, Dart | 🟡 **Alpha** |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)
- **Git**

### 1. Universal Launch
We provide a PowerShell script to boot the entire ecosystem (Backend + Worker + Frontend):

```powershell
.\start_agentkin.ps1
```

### 2. Manual Startup

**Backend (Neural Core):**
```bash
cd backend-fastapi
# Install deps
pip install -r requirements.txt
# Run Server
uvicorn main:app --reload
```

**Frontend (Interface):**
```bash
cd frontend
# Install deps
npm install
# Run Dev Server
npm run dev
```

Visit **http://localhost:3000** to enter the workspace.

---

## 📦 Deployment

See [DEPLOY.md](./DEPLOY.md) for detailed instructions on deploying to **Vercel** and **Railway**.

---

## 🧪 Testing

- **Ghost Mode**: Click the 👁️/👻 icon in the navbar.
- **Live Logs**: Go to `/dashboard` and watch the console.
- **Wallet**: Click "Select Wallet" to connect via Solana Adapter.

---

## 📜 License
MIT License. Built by **AgentKin Team**.
