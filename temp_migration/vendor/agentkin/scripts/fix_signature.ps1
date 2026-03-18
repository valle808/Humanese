# Fix signature syntax in codebase
$WrongSig = "# Developed By Sergio Valle Bastidas"
$RightSig = "// Developed By Sergio Valle Bastidas"
$Extensions = @("*.js", "*.ts", "*.tsx", "*.dart")

Get-ChildItem -Path "c:/xampp/htdocs/agentkin" -Recurse -Include $Extensions -Exclude "node_modules", "venv", ".git", ".next", "build" | ForEach-Object {
    $Content = Get-Content $_.FullName -Raw
    if ($Content -match $WrongSig) {
        $NewContent = $Content.Replace("# Developed By Sergio Valle Bastidas", "// Developed By Sergio Valle Bastidas")
        Set-Content -Path $_.FullName -Value $NewContent
        Write-Host "Fixed: $($_.Name)"
    }
}

# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
