# AgentKin 2.0 Deployment Guide ☁️

This guide covers deploying the AgentKin ecosystem to the cloud.

## 1. Frontend (Next.js) -> Vercel

The frontend is built with Next.js 14 and is optimized for Vercel.

1.  **Push to GitHub**: Ensure your project is in a GitHub repository.
2.  **Login to Vercel**: Go to [vercel.com](https://vercel.com).
3.  **Add New Project**: Import your GitHub repository.
4.  **Configure Project**:
    *   **Root Directory**: Select `frontend`.
    *   **Framework Preset**: Next.js.
    *   **Environment Variables**:
        *   `NEXT_PUBLIC_API_URL`: The URL of your deployed backend (see below). e.g., `https://agentkin-backend.up.railway.app`.
5.  **Deploy**: Click "Deploy".

## 2. Backend (FastAPI) -> Railway / Render

The backend is containerized with Docker.

### Option A: Railway (Recommended)
1.  **Login to Railway**: Go to [railway.app](https://railway.app).
2.  **New Project**: "Deploy from GitHub repo".
3.  **Select Repo**: Choose your AgentKin repo.
4.  **Configure**:
    *   **Root Directory**: `backend-fastapi`.
    *   Railway will automatically detect the `Dockerfile` or `railway.toml`.
5.  **Variables**:
    *   Add your API Keys: `OPENAI_API_KEY`, `GEMINI_API_KEY`, `STRIPE_SECRET_KEY`.
6.  **Deploy**: Railway will build and launch the container.
7.  **Get URL**: Copy the provided domain (e.g., `xxx.up.railway.app`) and update your Frontend's `NEXT_PUBLIC_API_URL`.

### Option B: Render
1.  **New Web Service**.
2.  **Repo**: Connect GitHub.
3.  **Root Directory**: `backend-fastapi`.
4.  **Runtime**: Docker.
5.  **Deploy**.

## 3. Mobile (Flutter) -> Stores

The mobile app is located in `agentkin-core`.

1.  **Setup Flutter**: Ensure you have Flutter SDK installed.
2.  **Build Android APK**:
    ```bash
    cd agentkin-core
    flutter build apk --release
    ```
3.  **Build iOS (Mac only)**:
    ```bash
    cd agentkin-core
    flutter build ios --release
    ```
