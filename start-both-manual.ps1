# Simple script to start both servers
Write-Host "Starting Splitwise Clone..." -ForegroundColor Green

# Start backend in background
Write-Host "Starting Backend..." -ForegroundColor Cyan
Start-Job -ScriptBlock {
    Set-Location "C:\Users\chira\OneDrive\Desktop\Project\Splitwise Clone\splitwise-backend"
    .\run-backend.bat
} -Name "Backend"

# Wait a moment
Start-Sleep -Seconds 3

# Start frontend in background
Write-Host "Starting Frontend..." -ForegroundColor Cyan
Start-Job -ScriptBlock {
    Set-Location "C:\Users\chira\OneDrive\Desktop\Project\Splitwise Clone\splitwise-frontend"
    npx expo start
} -Name "Frontend"

Write-Host "Both servers started!" -ForegroundColor Green
Write-Host "Backend: http://127.0.0.1:8080" -ForegroundColor White
Write-Host "Frontend: Expo development server" -ForegroundColor White

# Show job status
Get-Job | Format-Table -AutoSize 