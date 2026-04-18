$startupFolder = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup"
$vbsPath = "c:\xampp\htdocs\humanese\SovereignPersistence.vbs"
$shortcutPath = Join-Path $startupFolder "Sovereign_Sovereign_Persistence.lnk"

# Create a shortcut to the VBS file in the startup folder
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut($shortcutPath)
$Shortcut.TargetPath = "wscript.exe"
$Shortcut.Arguments = "`"$vbsPath`""
$Shortcut.Description = "Sovereign Ecosystem Persistence Launcher"
$Shortcut.WorkingDirectory = "c:\xampp\htdocs\humanese"
$Shortcut.Save()

Write-Host "✅ Sovereign Persistence enabled." -ForegroundColor Green
Write-Host "[STATUS] Shortcut created in: $shortcutPath" -ForegroundColor Cyan
Write-Host "[STATUS] Ecosystem will launch silently on Windows login." -ForegroundColor Cyan
