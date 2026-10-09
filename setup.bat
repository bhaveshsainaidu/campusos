@echo off
setlocal enabledelayedexpansion
title CampusOS - Full Setup

echo =============================================================================
echo   CampusOS - Full Setup & Dependency Installation
echo =============================================================================
echo.

cd /d "%~dp0"

where java >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Java 17+ is required but not found in PATH.
    pause
    exit /b 1
)

where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js / npm is required but not found in PATH.
    pause
    exit /b 1
)

if exist "CampusOSSetup.java" (
    java CampusOSSetup.java --setup
    pause
    exit /b 0
)

echo [1/2] Installing frontend dependencies...
cd campusos-frontend
call npm install
cd ..

echo [2/2] Compiling backend...
cd campusos-backend
if exist "mvnw.cmd" (
    call mvnw.cmd clean compile
) else if exist "C:\dev\apache-maven-3.9.9\bin\mvn.cmd" (
    call "C:\dev\apache-maven-3.9.9\bin\mvn.cmd" clean compile
) else (
    call mvn clean compile
)
cd ..

echo.
echo [SUCCESS] Setup complete! You can now run CampusOS via start.bat
pause
