# auto-backup.ps1 - גיבוי אוטומטי יומי ל-GitHub
$projectPath = "C:\Users\user\Documents\ClaudeCode\RunningInWar"
$logFile = "$projectPath\T-tools\scripts\backup-log.txt"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

Set-Location $projectPath

# בדוק אם יש שינויים
$status = git status --porcelain
if (-not $status) {
    Add-Content $logFile "[$timestamp] No changes - skipped"
    exit 0
}

# גבה
git add -A
git commit -m "auto backup: $timestamp"
$pushResult = git push origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Add-Content $logFile "[$timestamp] Backup successful"
} else {
    Add-Content $logFile "[$timestamp] Push failed: $pushResult"
}
