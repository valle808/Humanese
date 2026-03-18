@echo off
echo ==========================================
echo   AgentKin Universal Distribution Builder
echo ==========================================

cd ..

if not exist "windows" (
    echo [ERROR] Flutter platform Runner files missing!
    echo [ACTION REQUIRED] Please run 'flutter create .' in agentkin-core folder to initialize Android/Windows runners.
    pause
    exit /b 1
)

echo.
echo [1/4] Building Android APK (Flutter)...
call flutter build apk --release
if %errorlevel% neq 0 (
    echo [WARN] Android build failed. Check Android SDK.
) else (
    echo [OK] APK built at agentkin-core/build/app/outputs/flutter-apk/app-release.apk
)

echo.
echo [2/4] Building Windows EXE (Flutter)...
call flutter build windows --release
if %errorlevel% neq 0 (
    echo [WARN] Windows build failed. Check Visual Studio C++ Tools.
) else (
    echo [OK] EXE built at agentkin-core/build/windows/runner/Release/agentkin_core.exe
)

echo.
echo [3/4] macOS/Linux/iOS...
echo [INFO] Skipped (Must run on target OS).
echo        - macOS: flutter build macos
echo        - iOS: flutter build ios
echo        - Linux: flutter build linux

echo.
echo [4/4] Preparing Web Deployment (Vercel)...
cd ../frontend
echo [INFO] Ready for 'vercel deploy'. Ensure vercel.json is configured.

echo.
echo ==========================================
echo   Build Process Complete.
echo ==========================================
cd ../agentkin-core/scripts
pause

REM   ____                    _         _                
REM  / ___|_ __ ___  __ _  __| | ___   | |__  _   _      
REM | |   | '__/ _ \/ _` |/ _` |/ _ \  | '_ \| | | |     
REM | |___| | |  __/ (_| | (_| | (_) | | |_) | |_| |     
REM  \____|_|  \___|\__,_|\__,_|\___/  |_.__/ \__, |     
REM  ____                 _        __     __  |___/      
REM / ___|  ___ _ __ __ _(_) ___   \ \   / /_ _| | | ___ 
REM \___ \ / _ \ '__/ _` | |/ _ \   \ \ / / _` | | |/ _ \
REM  ___) |  __/ | | (_| | | (_) |   \ V / (_| | | |  __/
REM |____/ \___|_|  \__, |_|\___/     \_/ \__,_|_|_|\___|
REM                 |___/    
REM
REM Sergiio Valle Bastidas - valle808@hawaii.edu