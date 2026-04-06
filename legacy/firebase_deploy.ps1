# Sovereign Matrix Firebase Hosting Deployer
# Double-click or right-click > Run with PowerShell

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  HUMANESE Firebase Hosting Deploy" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check firebase-tools
Write-Host ">> Checking Firebase CLI..." -ForegroundColor Yellow
$version = npx firebase-tools --version 2>&1
Write-Host "   Firebase Tools: $version" -ForegroundColor Green

# Step 2: Login (opens browser automatically)
Write-Host ""
Write-Host ">> Opening browser for Google sign-in..." -ForegroundColor Yellow
Write-Host "   Sign in with the account that owns humanese-db project" -ForegroundColor Gray
Write-Host ""

npx firebase-tools login

# Step 3: Deploy hosting only
Write-Host ""
Write-Host ">> Deploying to Firebase Hosting (humanese-db)..." -ForegroundColor Yellow
npx firebase-tools deploy --only hosting --project humanese-db

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  DONE! Check Firebase Console for live URL" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to close"
