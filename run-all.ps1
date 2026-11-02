# Student Grade Management System (SGMS) Launcher
$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting Student Grade Management System (SGMS)..." -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

Write-Host "[1/3] Starting Spring Boot Backend on port 8080..." -ForegroundColor Yellow
Start-Process -FilePath "java" -ArgumentList "-jar target\sgms-backend-1.0.0.jar" -WorkingDirectory "$ScriptDir\backend"

Write-Host "[2/3] Waiting for Backend initialization..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

Write-Host "[3/3] Starting Vite Frontend Dev Server on port 5173..." -ForegroundColor Yellow
Start-Process -FilePath "npm.cmd" -ArgumentList "run dev" -WorkingDirectory "$ScriptDir\frontend"

Start-Sleep -Seconds 3
Write-Host "Launching web browser at http://localhost:5173 ..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host "========================================================" -ForegroundColor Green
Write-Host "  SGMS is running live!" -ForegroundColor Green
Write-Host "  Frontend:  http://localhost:5173" -ForegroundColor White
Write-Host "  Backend:   http://localhost:8080/api/health" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Green
