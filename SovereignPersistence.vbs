Set WinScriptHost = CreateObject("WScript.Shell")
' Launch the PowerShell launcher in hidden mode (0)
WinScriptHost.Run "powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File ""c:\xampp\htdocs\humanese\start_ecosystem.ps1""", 0
Set WinScriptHost = Nothing
