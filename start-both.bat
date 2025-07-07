@echo off
echo Starting Splitwise Clone - Backend and Frontend...
echo.

echo Starting Backend Server...
start "Splitwise Backend" cmd /k "cd splitwise-backend && run-backend.bat"

echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend Server...
start "Splitwise Frontend" cmd /k "cd splitwise-frontend && npx expo start"

echo.
echo Both servers are starting...
echo Backend: http://127.0.0.1:8080
echo Frontend: Expo development server
echo.
echo Press any key to close this window...
pause > nul 