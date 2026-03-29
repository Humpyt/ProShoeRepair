@echo off
REM Shoe Repair POS - Quick Deployment to Hostinger VPS
REM This script automates the deployment process

echo ========================================
echo Shoe Repair POS - Backend Deploy
echo ========================================
echo.

REM Configuration
set VPS_HOST=69.62.125.228
set VPS_USER=root
set LOCAL_PATH=%~dp0
set LOCAL_PATH=%LOCAL_PATH:~0,-1%
set REMOTE_PATH=/var/www/shoe-repair-pos

echo This will deploy the backend to your VPS.
echo VPS: %VPS_HOST%
echo Local path: %LOCAL_PATH%
echo Remote path: %REMOTE_PATH%
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

echo.
echo Step 1: Checking if pscp is available...
where pscp >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: pscp not found!
    echo Please install PuTTY from: https://www.putty.org/
    echo.
    echo Alternative: Use WinSCP for manual file transfer
    pause
    exit /b 1
)

echo pscp found.
echo.

echo Step 2: Uploading server files...
echo You will be prompted for the VPS password multiple times.
echo Password: HaaH+&FXzoi-0nBO7gK(
echo.

REM Create remote directory and upload files
pscp -r %LOCAL_PATH%\server\* %VPS_USER%@%VPS_HOST%:%REMOTE_PATH%/server/
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to upload server files
    pause
    exit /b 1
)

echo.
echo Step 3: Uploading configuration files...
pscp %LOCAL_PATH%\package.json %VPS_USER%@%VPS_HOST%:%REMOTE_PATH%/
pscp %LOCAL_PATH%\ecosystem.config.js %VPS_USER%@%VPS_HOST%:%REMOTE_PATH%/
pscp %LOCAL_PATH%\deploy-backend.sh %VPS_USER%@%VPS_HOST%:%REMOTE_PATH%/

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to upload configuration files
    pause
    exit /b 1
)

echo.
echo ========================================
echo Deployment Upload Complete!
echo ========================================
echo.
echo Next steps:
echo 1. SSH into VPS: ssh %VPS_USER%@%VPS_HOST%
echo 2. cd %REMOTE_PATH%
echo 3. chmod +x deploy-backend.sh
echo 4. ./deploy-backend.sh
echo 5. pm2 start ecosystem.config.js
echo 6. pm2 save
echo.
echo Press any key to open SSH connection...
pause >nul

start cmd /k "ssh %VPS_USER%@%VPS_HOST%"

echo.
echo Deployment script launched! Follow the instructions above.
pause
