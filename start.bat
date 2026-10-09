@echo off
setlocal enabledelayedexpansion
title CampusOS - Turnkey Launcher

echo =============================================================================
echo   CampusOS - Enterprise Campus Management Operating System
echo =============================================================================
echo.

cd /d "%~dp0"

:: 1. Check Java
where java >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Java 17+ is required but was not found in your PATH.
    echo Please install JDK 17 or higher from https://adoptium.net/
    pause
    exit /b 1
)

:: 2. If Java is available, we can invoke CampusOSSetup directly or run the native batch sequence
if exist "CampusOSSetup.java" (
    echo [INFO] Running CampusOS Turnkey Launcher...
    java CampusOSSetup.java --start
    if %ERRORLEVEL% equ 0 (
        echo.
        echo CampusOS is now running in the background.
        echo To stop CampusOS at any time, run: stop.bat
        echo.
        pause
        exit /b 0
    )
)

:: Fallback direct batch runner if Java single-file runner fails
echo [INFO] Starting MySQL if not active...
netstat -ano | findstr :3306 >nul
if %ERRORLEVEL% neq 0 (
    if exist "C:\dev\mysql\bin\mysqld.exe" (
        start "CampusOS-MySQL" /min "C:\dev\mysql\bin\mysqld.exe" --defaults-file="C:\dev\mysql\my.ini" --console
        timeout /t 3 /nobreak >nul
    )
)

echo [INFO] Checking frontend dependencies...
if not exist "campusos-frontend\node_modules" (
    echo [INFO] Installing frontend npm packages...
    cd campusos-frontend
    call npm install
    cd ..
)

echo [INFO] Starting Backend (Port 8080)...
netstat -ano | findstr :8080 >nul
if %ERRORLEVEL% neq 0 (
    cd campusos-backend
    if exist "mvnw.cmd" (
        start "CampusOS-Backend" /min cmd /c "mvnw.cmd spring-boot:run"
    ) else if exist "C:\dev\apache-maven-3.9.9\bin\mvn.cmd" (
        start "CampusOS-Backend" /min cmd /c "C:\dev\apache-maven-3.9.9\bin\mvn.cmd spring-boot:run"
    ) else (
        start "CampusOS-Backend" /min cmd /c "mvn spring-boot:run"
    )
    cd ..
)

echo [INFO] Starting Frontend (Port 5173)...
netstat -ano | findstr :5173 >nul
if %ERRORLEVEL% neq 0 (
    cd campusos-frontend
    start "CampusOS-Frontend" /min cmd /c "npm run dev -- --host 0.0.0.0 --port 5173"
    cd ..
)

echo [INFO] Waiting for application to initialize...
timeout /t 5 /nobreak >nul

echo [INFO] Opening CampusOS in your browser: http://localhost:5173
start http://localhost:5173

echo.
echo =============================================================================
echo   CampusOS is running!
echo   Web UI:     http://localhost:5173
echo   REST API:   http://localhost:8080/api/v1
echo.
echo   Demo Accounts:
echo   - Admin:   admin@campusos.edu     / Admin@123
echo   - Faculty: faculty1@campusos.edu   / Faculty@123
echo   - Student: student00001@campusos.edu / Student@123
echo.
echo   To stop all services, double-click: stop.bat
echo =============================================================================
pause
