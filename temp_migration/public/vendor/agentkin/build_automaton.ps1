$ErrorActionPreference = "Stop"
Write-Host "Updating PATH to include fnm..."
$env:Path = [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::User) + ";" + [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::Machine)

Write-Host "Initializing fnm..."
fnm env --use-on-cd | Out-String | Invoke-Expression

cd c:\xampp\htdocs\agentkin\automaton

Write-Host "Running pnpm install for Automaton..."
pnpm install

Write-Host "Running pnpm build for Automaton..."
pnpm build

Write-Host "Build finished."
