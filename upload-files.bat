@echo off
chcp 65001 >nul
echo ========================================
echo Shoe Repair POS - Upload Server Files
echo ========================================
echo.
echo This will upload your server files to the VPS.
echo.
echo VPS: 69.62.125.228
echo User: root
echo.
echo IMPORTANT: You will need to enter this password multiple times:
echo HaaH+&FXzoi-0nBO7gK(
echo.
echo Press Ctrl+C to cancel or any key to continue...
pause >nul
cls

echo.
echo ========================================
echo Starting upload...
echo ========================================
echo.

REM Change to project directory
cd /d "%~dp0"

echo Uploading server folder...
echo.
scp -r server root@69.62.125.228:/var/www/shoe-repair-pos/

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Upload failed!
    echo.
    echo Make sure you:
    echo 1. Are connected to the internet
    echo 2. Have entered the correct password
    echo 3. Have already run the setup on the VPS (see MANUAL_DEPLOY_STEPS.md)
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ Upload Complete!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. SSH into VPS:
echo    ssh root@69.62.125.228
echo.
echo 2. Start the application:
echo    cd /var/www/shoe-repair-pos
echo    pm2 start server/index.js --name shoe-repair-pos
echo    pm2 save
echo.
echo 3. Check status:
echo    pm2 status
echo.
echo Press any key to open SSH connection...
pause >nul

start ssh root@69.62.125.228

echo.
echo SSH connection opened. Follow the steps above.
echo.
pause
