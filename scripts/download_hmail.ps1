$url = "https://www.hmailserver.com/download/latest"
$output = "C:\Users\SergioEzequielValleB\Downloads\hMailServer-Install.exe"
try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $wc = New-Object System.Net.WebClient
    $wc.DownloadFile($url, $output)
    Write-Host "Download successful: $output"
} catch {
    Write-Host "Download failed: $_"
}
