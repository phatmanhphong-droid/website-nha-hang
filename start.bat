@echo off
title NOCTURNE Fine Dining - Level 48
echo ====================================================
echo   DANG KHOI CHAY HE THONG NOCTURNE (PORT 3000)
echo   - Frontend: Trang chu, Thuc don, Dat ban, Bep truong
echo   - Backend: API /api/bookings
echo ====================================================
timeout /t 1 >nul
start "" http://localhost:3000/
node server.js
pause

