# ==========================================
# Humanese Global Deployment Script
# ==========================================

Write-Host "[DEPLOY] Starting global deployment for the Humanese Ecosystem..." -ForegroundColor Cyan

# 1. GitHub Push
Write-Host "[DEPLOY] 1. Pushing to GitHub..." -ForegroundColor Yellow
git add .
git commit -m "feat: Contrast fixes, connection resolutions, and public API deployment"
git push
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Git push failed. Please check your credentials." -ForegroundColor Red
} else {
    Write-Host "[SUCCESS] Pushed to GitHub." -ForegroundColor Green
}

# 2. Supabase DB Push
Write-Host "[DEPLOY] 2. Pushing database changes to Supabase..." -ForegroundColor Yellow
npx supabase db push
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Supabase push failed. You may need to run 'npx supabase login'." -ForegroundColor Red
} else {
    Write-Host "[SUCCESS] Supabase database synchronized." -ForegroundColor Green
}

# 3. Vercel Deployment (Production)
Write-Host "[DEPLOY] 3. Deploying application to Vercel (Production)..." -ForegroundColor Yellow
npx vercel --prod --yes
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Vercel deployment failed. Missing permissions or token." -ForegroundColor Red
} else {
    Write-Host "[SUCCESS] Vercel deployed." -ForegroundColor Green
}

# 4. Firebase Deployment
Write-Host "[DEPLOY] 4. Deploying to Firebase..." -ForegroundColor Yellow
npx firebase deploy
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Firebase deployment failed. Verify 'firebase login' status." -ForegroundColor Red
} else {
    Write-Host "[SUCCESS] Firebase deployed." -ForegroundColor Green
}

Write-Host "[DEPLOY] All assigned deployment tasks completed!" -ForegroundColor Cyan
