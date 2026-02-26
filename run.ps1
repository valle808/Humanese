Write-Host "Starting Humanese..." -ForegroundColor Green
Write-Host "This will start a local web server at http://localhost:8080" -ForegroundColor Cyan

# Check if npm is installed to run npx
if (Get-Command npm -ErrorAction SilentlyContinue) {
    Write-Host "Starting Humanese API and Static Server using concurrently..." -ForegroundColor Yellow
    
    # Start process to open browser after a short delay
    Start-Job -ScriptBlock {
        Start-Sleep -Seconds 4
        Start-Process "http://localhost:8080"
    }

    # Run both the API server (server.js) and the static server
    npx concurrently "node server.js" "npx http-server . -p 8080 -c-1"
}
else {
    Write-Host "Node.js/npm is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
}
