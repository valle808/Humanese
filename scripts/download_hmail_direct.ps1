$url = "https://download.hmailserver.com/hMailServer-5.6.8-B2516.exe"
$output = "C:\Users\SergioEzequielValleB\Downloads\hMailServer-5.6.8-B2516.exe"
$userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $wc = New-Object System.Net.WebClient
    $wc.Headers.Add("User-Agent", $userAgent)
    Write-Host "Downloading from $url ..."
    $wc.DownloadFile($url, $output)
    Write-Host "Download successful: $output"
} catch {
    Write-Host "Download failed: $_"
}
