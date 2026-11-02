# SGMS Live Online Launcher
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "=======================================================================" -ForegroundColor Cyan
Write-Host "    Starting SGMS Live Online Server (Backend + Frontend + Tunnel)" -ForegroundColor Cyan
Write-Host "=======================================================================" -ForegroundColor Cyan

Write-Host "[1/3] Starting Spring Boot Backend API on port 8080..." -ForegroundColor Yellow
Start-Process -FilePath "java" -ArgumentList "-jar target\sgms-backend-1.0.0.jar" -WorkingDirectory "$ScriptDir\backend" -WindowStyle Hidden

Write-Host "[2/3] Starting Vite Frontend on port 5173..." -ForegroundColor Yellow
Start-Process -FilePath "npm.cmd" -ArgumentList "run dev" -WorkingDirectory "$ScriptDir\frontend" -WindowStyle Hidden

Write-Host "Waiting 10 seconds for services to fully initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "`n[3/3] Generating Public Live HTTPS URL (Zero Account Required)..." -ForegroundColor Green
Write-Host "=======================================================================" -ForegroundColor Green
Write-Host "  Your live public URL will appear below:" -ForegroundColor White
Write-Host "  Open this URL on your phone or share it with anyone!" -ForegroundColor White
Write-Host "=======================================================================`n" -ForegroundColor Green

ssh -p 443 -R0:localhost:5173 -o StrictHostKeyChecking=no -o ServerAliveInterval=30 a.pinggy.io
