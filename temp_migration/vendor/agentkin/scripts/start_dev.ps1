Write-Host "Starting AgentKin Dev Environment..." -ForegroundColor Cyan

# 1. Stop existing processes
Write-Host "Cleaning up old processes..." -ForegroundColor Yellow
./scripts/stop_dev.ps1

# 2. Start Backend
Write-Host "Starting Backend FastAPI (Port 8000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend-fastapi; ./venv/Scripts/python -m uvicorn main:app --reload --port 8000"

# 3. Start Frontend
Write-Host "Starting Frontend Next.js (Port 3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "Environment Started!" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:8000"
Write-Host "Frontend: http://localhost:3000"

# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
