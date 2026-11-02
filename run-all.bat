@echo off
title Student Grade Management System (SGMS) Launcher
echo ========================================================
echo   Starting Student Grade Management System (SGMS)...
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Starting Spring Boot Backend API on port 8080...
start "SGMS Backend API (Port 8080)" cmd /k "cd /d "%~dp0backend" && java -jar target\sgms-backend-1.0.0.jar"

echo [2/3] Waiting for Backend to initialize...
timeout /t 8 /nobreak >nul

echo [3/3] Starting Vite Frontend on port 5173...
start "SGMS Frontend UI (Port 5173)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Launching your browser at http://localhost:5173 ...
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo.
echo ========================================================
echo   SGMS is now running live!
echo   Frontend URL:  http://localhost:5173
echo   Backend API:   http://localhost:8080/api/health
echo   H2 Console:    http://localhost:8080/api/h2-console
echo.
echo   Demo Accounts:
echo   - Admin:   admin       / Admin@123
echo   - Faculty: prof.sharma / Faculty@123
echo   - Faculty: prof.patel  / Faculty@123
echo   - Student: CS2024001   / Student@123
echo   - Student: CS2024002   / Student@123
echo ========================================================
pause
