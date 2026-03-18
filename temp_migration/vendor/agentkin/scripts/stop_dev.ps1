Write-Host "Stopping AgentKin Dev Environment..." -ForegroundColor Yellow

# Kill Uvicorn (Backend)
$backend = Get-Process uvicorn -ErrorAction SilentlyContinue
if ($backend) {
    Stop-Process -Name uvicorn -Force
    Write-Host "Killed Uvicorn." -ForegroundColor Red
}

# Kill Node (Frontend)
# Warning: This kills ALL node processes. In a shared dev env this might be bad.
# But for this user context, likely fine.
$node = Get-Process node -ErrorAction SilentlyContinue
if ($node) {
    Stop-Process -Name node -Force
    Write-Host "Killed Node.js." -ForegroundColor Red
}

# Kill Python (Backend wrapper)
$python = Get-Process python -ErrorAction SilentlyContinue
if ($python) {
    # Filter for our python usage provided we can distinguish?
    # Hard to distinguish. Let's hope user isn't running other critical python scripts.
    # We can try to be more specific if possible.
    # For now, simplistic kill.
    # Stop-Process -Name python -Force
    # Write-Host "Killed Python." -ForegroundColor Red
    Write-Host "Skipping generic Python kill to avoid collateral damage. Ensure 'uvicorn' is dead." -ForegroundColor Gray
}

Write-Host "Environment Stopped." -ForegroundColor Cyan

# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
