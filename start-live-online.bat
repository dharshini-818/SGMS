@echo off
title SGMS - Live Online Deployment (Instant Public Tunnel)
echo =======================================================================
echo     Starting SGMS Live Online Server (Backend + Frontend + Tunnel)
echo =======================================================================
echo.

cd /d "%~dp0"

echo [1/3] Starting Spring Boot Backend API on port 8080...
start "SGMS Backend API (Port 8080)" /min cmd /k "cd /d "%~dp0backend" && java -jar target\sgms-backend-1.0.0.jar"

echo [2/3] Starting Vite Frontend on port 5173...
start "SGMS Frontend UI (Port 5173)" /min cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Waiting 10 seconds for services to fully initialize...
timeout /t 10 /nobreak >nul

echo.
echo [3/3] Generating Public Live HTTPS URL (Zero Account Required)...
echo =======================================================================
echo   Your live public URL will appear below:
echo   Open this URL on your phone or share it with anyone!
echo =======================================================================
echo.
ssh -p 443 -R0:localhost:5173 -o StrictHostKeyChecking=no -o ServerAliveInterval=30 a.pinggy.io

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Switching to alternate tunnel (localtunnel)...
    npx --yes localtunnel --port 5173
)

pause
