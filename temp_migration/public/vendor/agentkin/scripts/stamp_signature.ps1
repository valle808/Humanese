# Recursively add signature to all code files
$Signature = "# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics"
$Extensions = @("*.py", "*.js", "*.ts", "*.tsx", "*.dart", "*.html", "*.css", "*.ps1")

Get-ChildItem -Path "c:/xampp/htdocs/agentkin" -Recurse -Include $Extensions -Exclude "node_modules", "venv", ".git", ".next", "build" | ForEach-Object {
    $Content = Get-Content $_.FullName -Raw
    if ($Content -notmatch "@Gi0metrics") {
        # Check file type for comment syntax
        if ($_.Extension -in @(".html", ".md")) {
            $Sig = "`n<!-- $Signature -->"
        }
        elseif ($_.Extension -in @(".css")) {
            $Sig = "`n/* $Signature */"
        }
        else {
            $Sig = "`n$Signature"
        }
        
        Add-Content -Path $_.FullName -Value $Sig
        Write-Host "Signed: $($_.Name)"
    }
}
