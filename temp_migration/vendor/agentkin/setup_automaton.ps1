$ErrorActionPreference = "Stop"
Write-Host "Updating PATH to include fnm..."
$env:Path = [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::User) + ";" + [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::Machine)

Write-Host "Initializing fnm..."
fnm env --use-on-cd | Out-String | Invoke-Expression

Write-Host "Installing Node.js 22 LTS..."
fnm install 22
fnm use 22

Write-Host "Checking Node version..."
node -v

Write-Host "Installing pnpm..."
npm install -g pnpm

Write-Host "Automaton Node Environment Setup Complete."
