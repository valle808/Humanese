# Check Flutter Environment
Write-Host "Checking for Flutter..." -ForegroundColor Cyan

if (Get-Command flutter -ErrorAction SilentlyContinue) {
    Write-Host "✅ Flutter is in PATH: $(Get-Command flutter).Source" -ForegroundColor Green
    flutter doctor
}
else {
    Write-Host "❌ Flutter command not found in PATH." -ForegroundColor Red
    
    if (Test-Path "C:\src\flutter\bin\flutter.bat") {
        Write-Host "⚠️ Flutter found at C:\src\flutter but NOT in PATH." -ForegroundColor Yellow
        Write-Host "   Run: `$env:Path += ';C:\src\flutter\bin'"
    }
    else {
        Write-Host "❌ Flutter SDK not found at C:\src\flutter." -ForegroundColor Red
        Write-Host "   Please download from: https://flutter.dev/docs/get-started/install/windows"
        Write-Host "   Extract to C:\src\flutter"
    }
}

Write-Host "`nChecking Visual Studio..." -ForegroundColor Cyan
if (Test-Path "C:\Program Files\Microsoft Visual Studio\2022\Community") {
    Write-Host "✅ Visual Studio Community 2022 found." -ForegroundColor Green
}
else {
    Write-Host "⚠️ Visual Studio 2022 Community not found in default path." -ForegroundColor Yellow
}
