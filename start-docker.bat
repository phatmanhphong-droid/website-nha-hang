@echo off
title NOCTURNE Fine Dining - Docker Launcher
echo ====================================================
echo   KHOI CHAY HE THONG BANG DOCKER CONTAINER
echo   - Container Name: nocturne_restaurant
echo   - Port Mapping  : 3000 -> 3000
echo ====================================================

docker compose up -d
if %errorlevel% neq 0 (
  "%LOCALAPPDATA%\Programs\DockerDesktop\resources\bin\docker.exe" compose up -d
)

timeout /t 2 >nul
start "" http://localhost:3000/
echo [OK] Website dang chay trong Docker tai http://localhost:3000/
pause

