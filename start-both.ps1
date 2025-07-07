# Splitwise Clone - Start Both Servers
Write-Host "🚀 Starting Splitwise Clone - Backend and Frontend..." -ForegroundColor Green
Write-Host ""

# Function to check if port is in use
function Test-Port {
    param($Port)
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return $connection -ne $null
}

# Check if backend is already running
if (Test-Port 8080) {
    Write-Host "⚠️  Backend is already running on port 8080" -ForegroundColor Yellow
} else {
    Write-Host "🔧 Starting Backend Server..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\splitwise-backend'; .\run-backend.bat" -WindowStyle Normal
}

# Wait for backend to start
Write-Host "⏳ Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Check if backend started successfully
if (Test-Port 8080) {
    Write-Host "✅ Backend is running on port 8080" -ForegroundColor Green
} else {
    Write-Host "❌ Backend failed to start" -ForegroundColor Red
}

Write-Host ""
Write-Host "📱 Starting Frontend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\splitwise-frontend'; npx expo start" -WindowStyle Normal

Write-Host ""
Write-Host "🎉 Both servers are starting!" -ForegroundColor Green
Write-Host "📍 Backend: http://127.0.0.1:8080" -ForegroundColor White
Write-Host "📍 Frontend: Expo development server" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop monitoring..." -ForegroundColor Gray

# Monitor both servers
try {
    while ($true) {
        $backendStatus = if (Test-Port 8080) { "✅" } else { "❌" }
        $frontendStatus = if (Get-Process | Where-Object { $_.ProcessName -eq "node" -and $_.MainWindowTitle -like "*expo*" }) { "✅" } else { "❌" }
        
        Write-Host "Backend: $backendStatus | Frontend: $frontendStatus" -ForegroundColor Gray
        Start-Sleep -Seconds 10
    }
} catch {
    Write-Host ""
    Write-Host "👋 Stopping monitoring..." -ForegroundColor Yellow
} 