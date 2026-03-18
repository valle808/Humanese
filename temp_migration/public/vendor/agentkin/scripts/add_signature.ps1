# Add Creator Signature to Key Project Files

$root = "c:/xampp/htdocs/agentkin"

# --- Python / YAML / Prisma signature (# or //) ---

$pySig = @"

#   ____                    _         _                
#  / ___|_ __ ___  __ _  __| | ___   | |__  _   _      
# | |   | '__/ _ \/ _`` |/ _`` |/ _ \  | '_ \| | | |     
# | |___| | |  __/ (_| | (_| | (_) | | |_) | |_| |     
#  \____|_|  \___|\__,_|\__,_|\___/  |_.__/ \__, |     
#  ____                 _        __     __  |___/      
# / ___|  ___ _ __ __ _(_) ___   \ \   / /_ _| | | ___ 
# \___ \ / _ \ '__/ _`` | |/ _ \   \ \ / / _`` | | |/ _ \
#  ___) |  __/ | | (_| | | (_) |   \ V / (_| | | |  __/
# |____/ \___|_|  \__, |_|\___/     \_/ \__,_|_|_|\___|
#                 |___/    
#
# Sergiio Valle Bastidas - valle808@hawaii.edu
"@

$tsSig = @"

//   ____                    _         _                
//  / ___|_ __ ___  __ _  __| | ___   | |__  _   _      
// | |   | '__/ _ \/ _`` |/ _`` |/ _ \  | '_ \| | | |     
// | |___| | |  __/ (_| | (_| | (_) | | |_) | |_| |     
//  \____|_|  \___|\__,_|\__,_|\___/  |_.__/ \__, |     
//  ____                 _        __     __  |___/      
// / ___|  ___ _ __ __ _(_) ___   \ \   / /_ _| | | ___ 
// \___ \ / _ \ '__/ _`` | |/ _ \   \ \ / / _`` | | |/ _ \
//  ___) |  __/ | | (_| | | (_) |   \ V / (_| | | |  __/
// |____/ \___|_|  \__, |_|\___/     \_/ \__,_|_|_|\___|
//                 |___/    
//
// Sergiio Valle Bastidas - valle808@hawaii.edu
"@

$batSig = @"

REM   ____                    _         _                
REM  / ___|_ __ ___  __ _  __| | ___   | |__  _   _      
REM | |   | '__/ _ \/ _`` |/ _`` |/ _ \  | '_ \| | | |     
REM | |___| | |  __/ (_| | (_| | (_) | | |_) | |_| |     
REM  \____|_|  \___|\__,_|\__,_|\___/  |_.__/ \__, |     
REM  ____                 _        __     __  |___/      
REM / ___|  ___ _ __ __ _(_) ___   \ \   / /_ _| | | ___ 
REM \___ \ / _ \ '__/ _`` | |/ _ \   \ \ / / _`` | | |/ _ \
REM  ___) |  __/ | | (_| | | (_) |   \ V / (_| | | |  __/
REM |____/ \___|_|  \__, |_|\___/     \_/ \__,_|_|_|\___|
REM                 |___/    
REM
REM Sergiio Valle Bastidas - valle808@hawaii.edu
"@

# Python files
$pyFiles = @(
    "$root/backend-fastapi/main.py",
    "$root/backend-fastapi/routers/tasks.py",
    "$root/backend-fastapi/routers/system.py",
    "$root/backend-fastapi/socket_manager.py",
    "$root/backend-fastapi/utils/motor_switcher.py",
    "$root/scripts/autonomous_agent.py",
    "$root/scripts/verify_wallet_fee.py"
)

foreach ($f in $pyFiles) {
    if (Test-Path $f) {
        Add-Content -Path $f -Value $pySig -NoNewline
        Write-Host "[OK] $f"
    }
    else {
        Write-Host "[SKIP] $f (not found)"
    }
}

# TypeScript / TSX / Dart files
$tsFiles = @(
    "$root/frontend/src/app/page.tsx",
    "$root/frontend/src/app/layout.tsx",
    "$root/frontend/src/app/tasks/create/page.tsx",
    "$root/frontend/src/app/legal/ghost-mode/page.tsx",
    "$root/frontend/src/app/dashboard/page.tsx",
    "$root/frontend/src/components/TaskList.tsx",
    "$root/agentkin-core/lib/logic/task_manager.dart",
    "$root/agentkin-core/lib/data/data_store.dart"
)

foreach ($f in $tsFiles) {
    if (Test-Path $f) {
        Add-Content -Path $f -Value $tsSig -NoNewline
        Write-Host "[OK] $f"
    }
    else {
        Write-Host "[SKIP] $f (not found)"
    }
}

# Prisma (uses //)
$prismaFiles = @(
    "$root/prisma/schema.prisma"
)
foreach ($f in $prismaFiles) {
    if (Test-Path $f) {
        Add-Content -Path $f -Value $tsSig -NoNewline
        Write-Host "[OK] $f"
    }
    else {
        Write-Host "[SKIP] $f (not found)"
    }
}

# YAML (uses #)
$yamlFiles = @(
    "$root/docker-compose.yml"
)
foreach ($f in $yamlFiles) {
    if (Test-Path $f) {
        Add-Content -Path $f -Value $pySig -NoNewline
        Write-Host "[OK] $f"
    }
    else {
        Write-Host "[SKIP] $f (not found)"
    }
}

# BAT
$batFiles = @(
    "$root/agentkin-core/scripts/build_dist.bat"
)
foreach ($f in $batFiles) {
    if (Test-Path $f) {
        Add-Content -Path $f -Value $batSig -NoNewline
        Write-Host "[OK] $f"
    }
    else {
        Write-Host "[SKIP] $f (not found)"
    }
}

Write-Host "`nSignature added to all key files."

# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
