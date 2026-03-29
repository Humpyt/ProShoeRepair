@echo off
chcp 65001 >nul
cls

echo ========================================
echo   Shoe Repair POS - VPS Deployment
echo ========================================
echo.
echo This will deploy your backend to Hostinger VPS
echo.
echo VPS IP: 69.62.125.228
echo User: root
echo.
echo You will need to enter this password multiple times:
echo   HaaH+&FXzoi-0nBO7gK(
echo.
echo ========================================
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

echo.
echo STEP 1: Testing SSH connection...
echo.

ssh root@69.62.125.228 "echo '✓ Connection successful'" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ✗ SSH connection failed
    echo.
    echo Make sure you:
    echo 1. Have an active internet connection
    echo 2. Can reach the VPS: ping 69.62.125.228
    echo.
    pause
    exit /b 1
)

echo ✓ SSH connection working
echo.
echo STEP 2: Creating remote directory...
echo.

ssh root@69.62.125.228 "mkdir -p /var/www/shoe-repair-pos && echo '✓ Directory created'"

echo.
echo STEP 3: Uploading setup script...
echo.

scp vps-setup-complete.sh root@69.62.125.228:/var/www/shoe-repair-pos/vps-setup.sh
if %ERRORLEVEL% NEQ 0 (
    echo ✗ Failed to upload setup script
    pause
    exit /b 1
)

echo ✓ Setup script uploaded
echo.
echo STEP 4: Uploading server files...
echo This may take a minute...
echo.

scp -r server root@69.62.125.228:/var/www/shoe-repair-pos/
if %ERRORLEVEL% NEQ 0 (
    echo ✗ Failed to upload server files
    pause
    exit /b 1
)

echo ✓ Server files uploaded
echo.
echo STEP 5: Running setup on VPS...
echo.

ssh root@69.62.125.228 "cd /var/www/shoe-repair-pos && chmod +x vps-setup.sh && ./vps-setup.sh"

echo.
echo STEP 6: Starting application...
echo.

ssh root@69.62.125.228 "cd /var/www/shoe-repair-pos && pm2 start server/index.js --name shoe-repair-pos && pm2 save && pm2 status"

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Your API is now live at:
echo   http://69.62.125.228:3000/api
echo.
echo Test it in your browser or run:
echo   curl http://69.62.125.228:3000/api/operations
echo.
echo Next: Update Netlify environment variables
echo   VITE_API_URL=http://69.62.125.228:3000/api
echo.
echo ========================================
echo.
pause
