# ==========================================
# Sovereign Matrix Local Ecosystem Launcher
# ==========================================

Write-Host "🚀 Starting Local Sovereign Matrix Ecosystem..." -ForegroundColor Cyan
Write-Host "[INFO] Launching Next.js frontend and Autonomous Agent Swarm concurrently." -ForegroundColor Yellow

# Clear terminal before start
Clear-Host

# Standardize path
Set-Location "c:\xampp\htdocs\humanese"

# Run concurrently
# --kill-others: If one process fails, kill the other.
# --prefix: Label the output.
npx concurrently --kill-others --prefix "[{name}]" --names "FRONTEND,AGENTS" --prefix-colors "blue,magenta" "npx next dev" "node agents/index.js"
