@echo off
title NOCTURNE Fine Dining - Stop Docker
echo ====================================================
echo   DANG DUNG DOCKER CONTAINER NOCTURNE...
echo ====================================================

docker compose down
if %errorlevel% neq 0 (
  "%LOCALAPPDATA%\Programs\DockerDesktop\resources\bin\docker.exe" compose down
)

echo [OK] Da dung container thanh cong.
pause

