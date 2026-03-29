# Shoe Repair POS - Automated Deployment to Hostinger VPS
# Run this script on your Windows machine

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Shoe Repair POS - VPS Deployment" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$VPS_HOST = "69.62.125.228"
$VPS_USER = "root"
$VPS_PASSWORD = "HaaH+&FXzoi-0nBO7gK("
$LOCAL_PATH = "F:\Shoe Repair POS - Copy"
$REMOTE_PATH = "/var/www/shoe-repair-pos"

Write-Host "VPS: $VPS_HOST" -ForegroundColor Yellow
Write-Host "This script will:" -ForegroundColor White
Write-Host "  1. Connect to your VPS" -ForegroundColor White
Write-Host "  2. Set up Node.js and PM2" -ForegroundColor White
Write-Host "  3. Upload server files" -ForegroundColor White
Write-Host "  4. Start the application" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to cancel or any key to continue..." -ForegroundColor Red
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Step 1: Test SSH connection
Write-Host ""
Write-Host "[Step 1/5] Testing SSH connection..." -ForegroundColor Cyan

# Create expect script for SSH
$expectScript = @"
#!/usr/bin/expect -f
set timeout 30
spawn ssh root@$VPS_HOST "echo 'Connection successful'"
expect {
    "password:" {
        send "$VPS_PASSWORD\r"
        expect eof
    }
    "Connection successful" {
        exit 0
    }
    timeout {
        exit 1
    }
}
"@

$expectScript | Out-File -FilePath "temp_expect.exp" -Encoding ASCII

# Check if expect is available (usually on Git Bash)
$expectPath = where.exe expect 2>$null
if ($expectPath) {
    Write-Host "  ✓ SSH connection test passed" -ForegroundColor Green
} else {
    Write-Host "  ! expect not found, will use manual SSH" -ForegroundColor Yellow
}

# Step 2: Create and upload setup script
Write-Host "[Step 2/5] Creating setup script..." -ForegroundColor Cyan

$setupScript = Get-Content "$LOCAL_PATH\vps-setup-complete.sh" -Raw

# Step 3: Upload files using SCP (requires manual password entry)
Write-Host ""
Write-Host "[Step 3/5] Uploading files to VPS..." -ForegroundColor Cyan
Write-Host "You will be prompted for the VPS password 3 times" -ForegroundColor Yellow
Write-Host "Password: $VPS_PASSWORD" -ForegroundColor Yellow
Write-Host ""

# Upload setup script
Write-Host "  Uploading setup script..." -ForegroundColor Gray
scp "$LOCAL_PATH\vps-setup-complete.sh" "$VPS_USER@$VPS_HOST`:$REMOTE_PATH/vps-setup.sh" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Setup script uploaded" -ForegroundColor Green
} else {
    Write-Host "  ✗ Failed to upload setup script" -ForegroundColor Red
    Write-Host ""
    Write-Host "Manual upload required. Run this command:" -ForegroundColor Yellow
    Write-Host "  scp `"$LOCAL_PATH\vps-setup-complete.sh`" root@$VPS_HOST`:$REMOTE_PATH/vps-setup.sh" -ForegroundColor White
    pause
    exit 1
}

# Upload server files
Write-Host "  Uploading server files (this may take a minute)..." -ForegroundColor Gray
scp -r "$LOCAL_PATH\server\*" "$VPS_USER@$VPS_HOST`:$REMOTE_PATH/server/" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Server files uploaded" -ForegroundColor Green
} else {
    Write-Host "  ✗ Failed to upload server files" -ForegroundColor Red
    Write-Host ""
    Write-Host "Manual upload required. Run this command:" -ForegroundColor Yellow
    Write-Host "  scp -r `"$LOCAL_PATH\server\*`" root@$VPS_HOST`:$REMOTE_PATH/server/" -ForegroundColor White
}

# Upload package.json
Write-Host "  Uploading package.json..." -ForegroundColor Gray
scp "$LOCAL_PATH\package.json" "$VPS_USER@$VPS_HOST`:$REMOTE_PATH/" 2>&1

# Upload ecosystem config
Write-Host "  Uploading PM2 configuration..." -ForegroundColor Gray
if (Test-Path "$LOCAL_PATH\ecosystem.config.js") {
    scp "$LOCAL_PATH\ecosystem.config.js" "$VPS_USER@$VPS_HOST`:$REMOTE_PATH/" 2>&1
    Write-Host "  ✓ PM2 configuration uploaded" -ForegroundColor Green
}

Write-Host ""
Write-Host "[Step 4/5] Running setup script on VPS..." -ForegroundColor Cyan
Write-Host "Please enter password when prompted" -ForegroundColor Yellow

ssh "$VPS_USER@$VPS_HOST" "cd $REMOTE_PATH && chmod +x vps-setup.sh && ./vps-setup.sh" 2>&1

Write-Host ""
Write-Host "[Step 5/5] Starting application..." -ForegroundColor Cyan
ssh "$VPS_USER@$VPS_HOST" "cd $REMOTE_PATH && pm2 start server/index.js --name shoe-repair-pos && pm2 save && pm2 status" 2>&1

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your API is now live at:" -ForegroundColor Yellow
Write-Host "  http://$VPS_HOST`:3000/api" -ForegroundColor White
Write-Host ""
Write-Host "Test it:" -ForegroundColor Yellow
Write-Host "  curl http://$VPS_HOST`:3000/api/operations" -ForegroundColor White
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Yellow
Write-Host "  ssh $VPS_USER@$VPS_HOST" -ForegroundColor White
Write-Host "  pm2 status" -ForegroundColor White
Write-Host "  pm2 logs shoe-repair-pos" -ForegroundColor White
Write-Host "  pm2 restart shoe-repair-pos" -ForegroundColor White
Write-Host ""
Write-Host "Next: Update your Netlify environment variable:" -ForegroundColor Yellow
Write-Host "  VITE_API_URL=http://$VPS_HOST`:3000/api" -ForegroundColor White
Write-Host "================================" -ForegroundColor Cyan

# Cleanup
if (Test-Path "temp_expect.exp") {
    Remove-Item "temp_expect.exp" -Force
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
