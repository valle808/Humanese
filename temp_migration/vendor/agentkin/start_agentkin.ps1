# Start AgentKin Platform
# Launches FastAPI Backend and Opens Frontend

$BackendDir = "C:\xampp\htdocs\agentkin\backend-fastapi"
$VenvPython = "$BackendDir\venv\Scripts\python.exe"

Write-Host "🚀 Launching AgentKin Platform..." -ForegroundColor Cyan

# 1. Kill Check
Write-Host "checking for old processes..."
taskkill /F /IM uvicorn.exe 2>$null
taskkill /F /IM python.exe 2>$null

# 2. Start Backend
Write-Host "Starting AgentKin Neural Core (FastAPI)..." -ForegroundColor Green
Start-Process -FilePath $VenvPython -ArgumentList "-m uvicorn main:app --reload --host 0.0.0.0 --port 8000" -WorkingDirectory $BackendDir -WindowStyle Minimized

# 3. Wait for boot
Write-Host "Waiting for Neural Core to initialize..."
Start-Sleep -Seconds 5

# 3.5 Start Autonomous Worker
Write-Host "Activating Autonomous Intelligence..." -ForegroundColor Cyan
Start-Process -FilePath $VenvPython -ArgumentList "scripts/autonomous_worker.py" -WorkingDirectory "C:\xampp\htdocs\agentkin" -WindowStyle Minimized

# 4. Start Next.js Frontend
Write-Host "Igniting Interface (Next.js)..." -ForegroundColor Magenta
Start-Process -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory "C:\xampp\htdocs\agentkin\frontend" -WindowStyle Minimized

# 5. Open Application
Write-Host "Opening Dashboard..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
Start-Process "http://localhost:3000"

Write-Host "✅ System Online." -ForegroundColor Green
Read-Host "Press Enter to exit launcher (Servers will keep running in background)..."

# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
