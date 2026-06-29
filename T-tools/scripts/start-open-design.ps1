# start-open-design.ps1
# מפעיל Open Design daemon ומחכה שיהיה מוכן על פורט 7456

$odCmd = "C:\Users\user\Documents\open-design\node_modules\.bin\od.CMD"
$port = 7456
$timeout = 30

# בדוק אם כבר רץ
$running = Test-NetConnection -ComputerName 127.0.0.1 -Port $port -InformationLevel Quiet -WarningAction SilentlyContinue
if ($running) {
    Write-Host "Open Design daemon already running on port $port"
    exit 0
}

# הפעל daemon בלי web UI
Write-Host "Starting Open Design daemon..."
Start-Process -FilePath $odCmd -ArgumentList "--no-open" -WindowStyle Hidden

# חכה שה-daemon יעלה
$elapsed = 0
while ($elapsed -lt $timeout) {
    Start-Sleep -Seconds 2
    $elapsed += 2
    $ready = Test-NetConnection -ComputerName 127.0.0.1 -Port $port -InformationLevel Quiet -WarningAction SilentlyContinue
    if ($ready) {
        Write-Host "Open Design daemon ready on port $port (after ${elapsed}s)"
        exit 0
    }
    Write-Host "Waiting... ($elapsed/$timeout s)"
}

Write-Host "ERROR: daemon not ready after ${timeout}s"
exit 1
