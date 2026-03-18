# =================================================================
# AGENT KING - AUTONOMOUS INITIALIZATION SCRIPT (PowerShell Port)
# Purpose: Sophisticated integration of the OpenClaw Ecosystem
# =================================================================

Write-Host "Starting Agent King Autonomous Deployment..." -ForegroundColor Cyan

# 1. CREATE DIRECTORY STRUCTURE
$TARGET_DIR = "agent_king_workspace"
if (-not (Test-Path $TARGET_DIR)) {
    New-Item -ItemType Directory -Path $TARGET_DIR | Out-Null
}
Set-Location -Path $TARGET_DIR
Write-Host "Workspace created: $((Get-Location).Path)" -ForegroundColor Green

# 2. DEFINE REPOSITORY MAP
$REPOS = @(
    "openclaw|https://github.com/openclaw/openclaw.git|openclaw/openclaw",
    "clawhub|https://github.com/openclaw/clawhub.git|openclaw/clawhub",
    "skills|https://github.com/openclaw/skills.git|openclaw/skills",
    "lobster|https://github.com/openclaw/lobster.git|openclaw/lobster",
    "nix-openclaw|https://github.com/openclaw/nix-openclaw.git|openclaw/nix-openclaw",
    "openclaw-ansible|https://github.com/openclaw/openclaw-ansible.git|openclaw/openclaw-ansible"
)

# 3. CLONING LOGIC (With Redundancy)
foreach ($entry in $REPOS) {
    $parts = $entry.Split("|")
    $FOLDER = $parts[0]
    $URL = $parts[1]
    $CLI = $parts[2]

    Write-Host "`nProcessing Repository: $FOLDER..." -ForegroundColor Cyan
    
    # Check if we should clone
    if (Test-Path $FOLDER) {
        Write-Host "Directory $FOLDER already exists. Skipping clone." -ForegroundColor Yellow
        continue
    }

    $ghExists = Get-Command gh -ErrorAction SilentlyContinue
    $success = $false

    if ($ghExists) {
        # Check auth
        gh auth status 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Using GitHub CLI to clone $CLI..."
            gh repo clone $CLI $FOLDER
            if ($LASTEXITCODE -eq 0) { $success = $true }
        }
    }

    if (-not $success) {
        Write-Host "GH CLI not found or not logged in. Falling back to HTTPS..."
        git clone $URL $FOLDER
        if ($LASTEXITCODE -eq 0) { $success = $true }
    }

    if ($success) {
        Write-Host "Successfully integrated $FOLDER" -ForegroundColor Green
    }
    else {
        Write-Host "Failed to clone $FOLDER. Check network or permissions." -ForegroundColor Red
        exit 1
    }
}

# 4. IMPLEMENTATION & LINKING
Write-Host "`nConfiguring Autonomous Logic Paths..." -ForegroundColor Cyan

if ((Test-Path "openclaw") -and (Test-Path "skills")) {
    $targetPath = Join-Path (Get-Location).Path "skills"
    $linkPath = Join-Path (Get-Location).Path "openclaw\skills_lib"
    
    if (-not (Test-Path $linkPath)) {
        # Create Junction since Symlink might require admin privs
        New-Item -ItemType Junction -Path $linkPath -Target $targetPath | Out-Null
        Write-Host "Symlink (Junction) established: Skills mapped to OpenClaw Core." -ForegroundColor Green
    }
    else {
        Write-Host "Symlink (Junction) already exists." -ForegroundColor Yellow
    }
}

# 5. FINAL VERIFICATION
Write-Host "`n=================================================" -ForegroundColor Green
Write-Host "AGENT KING INITIALIZATION COMPLETE" -ForegroundColor Green
Write-Host "System is ready for autonomous calculations."
Write-Host "Location: $((Get-Location).Path)"
Write-Host "=================================================" -ForegroundColor Green
