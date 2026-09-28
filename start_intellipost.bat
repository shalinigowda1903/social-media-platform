@echo off
title IntelliPost Development Launcher
echo ===================================================
echo   IntelliPost - Plan. Post. Perform.
echo   Starting Backend and Frontend Servers...
echo ===================================================

start "IntelliPost Backend (FastAPI)" cmd /k "cd backend && set DATABASE_URL=sqlite:///./socialpilot_dev.db && python -m uvicorn app.main:app --reload --port 8000"
start "IntelliPost Frontend (Next.js)" cmd /k "cd nexora && npm run dev"

echo.
echo IntelliPost is launching:
echo - Frontend: http://localhost:3000
echo - Backend API: http://127.0.0.1:8000
echo - Swagger Docs: http://127.0.0.1:8000/docs
echo.
echo Demo Account: admin@intellipost.com / password123
echo ===================================================
pause
