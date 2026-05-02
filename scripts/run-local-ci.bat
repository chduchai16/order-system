@echo off
REM Local CI Test Script for Windows
REM This script runs the same checks as GitHub Actions locally
REM Useful for validating changes before pushing

setlocal enabledelayedexpansion

echo =========================================
echo Local CI Pipeline Simulation
echo =========================================
echo.

REM Check prerequisites
echo Checking prerequisites...

where java >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Java not found. Please install Java 17+
    exit /b 1
)

where mvn >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Maven not found. Please install Maven
    exit /b 1
)

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found. Please install Node.js 18+
    exit /b 1
)

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm not found. Please install npm
    exit /b 1
)

for /f "tokens=*" %%i in ('java -version 2^>^&1 ^| findstr "version"') do set JAVA_VERSION=%%i
echo [OK] Found: %JAVA_VERSION%

for /f "tokens=*" %%i in ('mvn -v ^| findstr "Apache Maven"') do set MVN_VERSION=%%i
echo [OK] Found: %MVN_VERSION%

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [OK] Found: Node %NODE_VERSION%

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo [OK] Found: npm %NPM_VERSION%

REM Job 1: Build and Test Java Services
echo.
echo === Job 1: Build and Test Java Services ===
echo Building with Maven...
call mvn -B clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Maven build failed
    exit /b 1
)
echo [OK] Maven build successful

echo Running unit tests...
call mvn -B test
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Unit tests failed
    exit /b 1
)
echo [OK] Unit tests passed

REM Optional: Run integration tests
set /p RUN_IT=Run integration tests? (y/n): 
if /i "%RUN_IT%"=="y" (
    echo Running integration tests...
    call mvn -B verify
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Integration tests failed
        exit /b 1
    )
    echo [OK] Integration tests passed
)

REM Job 2: Build and Lint Frontend
echo.
echo === Job 2: Build and Lint Frontend ===
cd frontend

echo Installing npm dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm install failed
    exit /b 1
)
echo [OK] Dependencies installed

echo Running linter...
call npm run lint
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Linter checks failed
    echo [WARNING] Fix linter issues before pushing
)
echo [OK] Linter checks completed

echo Building frontend...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Frontend build failed
    exit /b 1
)
echo [OK] Frontend build successful

cd ..

REM Summary
echo.
echo =========================================
echo [OK] All Local CI Checks Passed!
echo =========================================
echo.
echo You can now safely push your changes:
echo   git push origin ^<branch-name^>
echo.
