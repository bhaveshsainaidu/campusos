@echo off
setlocal enabledelayedexpansion
title CampusOS - Stopper

echo =============================================================================
echo   Stopping CampusOS Services...
echo =============================================================================

cd /d "%~dp0"

if exist "CampusOSSetup.java" (
    java CampusOSSetup.java --stop
    pause
    exit /b 0
)

echo Terminating backend on port 8080...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>nul
)

echo Terminating frontend on port 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>nul
)

echo CampusOS services stopped.
pause
