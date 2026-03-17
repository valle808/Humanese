# Start Migration from Media
# Protocol Abyssal: Sovereign Initialization

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host " PROTOCOL ABYSSAL: START MIGRATION FROM MEDIA " -ForegroundColor Black -BackgroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

Write-Host "`n[1/4] Resynchronizing Dependencies..." -ForegroundColor Yellow
npm install

Write-Host "`n[2/4] Initializing Database Substrate..." -ForegroundColor Yellow
npx prisma generate
npx prisma db push

Write-Host "`n[3/4] Restoring Sovereign Intelligence State..." -ForegroundColor Yellow
node restore_ecosystem.js

Write-Host "`n[4/4] Finalizing Cloud Sync Presence..." -ForegroundColor Yellow
# Trigger a build to verify integrity
npm run build

Write-Host "`n====================================================" -ForegroundColor Green
Write-Host " SOVEREIGN ECOSYSTEM INITIALIZED SUCCESSFULLY " -ForegroundColor Black -BackgroundColor Green
Write-Host " Proceed to 'npm run dev' to activate the nexus. " -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
