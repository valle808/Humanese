Write-Host "Starting Sovereign Matrix..." -ForegroundColor Green
Write-Host "This will start a local web server at http://localhost:8080" -ForegroundColor Cyan

# Check if npm is installed to run npx
if (Get-Command npm -ErrorAction SilentlyContinue) {
    Write-Host "Starting Sovereign Matrix API and Static Server using concurrently..." -ForegroundColor Yellow
    
    # Start process to open browser after a short delay
    Start-Job -ScriptBlock {
        Start-Sleep -Seconds 4
        Start-Process "http://localhost:8080"
    }

    # Run the static server in the background
    Start-Job -ScriptBlock { npx http-server . -p 8080 -c-1 }

    Write-Host "Monitoring Sovereign Matrix Server (3000)..." -ForegroundColor Green
    while ($true) {
        Write-Host "Launching Sovereign Matrix..." -ForegroundColor Cyan
        node server.js
        Write-Host "Server crashed or stopped. Restarting in 5 seconds..." -ForegroundColor Red
        Start-Sleep -Seconds 5
    }
}
else {
    Write-Host "Node.js/npm is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
}
