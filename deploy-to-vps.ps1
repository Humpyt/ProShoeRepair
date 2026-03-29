# Shoe Repair POS - Deploy Backend to Hostinger VPS
# This script uploads backend files to the VPS

$VPS_HOST = "69.62.125.228"
$VPS_USER = "root"
$VPS_PASSWORD = "HaaH+&FXzoi-0nBO7gK("
$LOCAL_PATH = "F:\Shoe Repair POS - Copy\server"
$REMOTE_PATH = "/var/www/shoe-repair-pos"

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Shoe Repair POS - Backend Deploy" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Create a temporary file for the password
$passwordFile = [IO.Path]::GetTempFileName()
$VPS_PASSWORD | Out-File -FilePath $passwordFile -Encoding Default

try {
    # Check if plink or pscp is available (from PuTTY)
    $pscpPath = "C:\Program Files\PuTTY\pscp.exe"
    $plinkPath = "C:\Program Files\PuTTY\plink.exe"

    if (-Not (Test-Path $pscpPath)) {
        Write-Host "PuTTY's pscp not found. Trying Windows SCP..." -ForegroundColor Yellow
        Write-Host "Please install PuTTY or use manual SCP command:" -ForegroundColor Yellow
        Write-Host "scp -r server/* root@69.62.125.228:/var/www/shoe-repair-pos/" -ForegroundColor Yellow
        exit 1
    }

    Write-Host "Uploading server files to VPS..." -ForegroundColor Green
    Write-Host "From: $LOCAL_PATH" -ForegroundColor Gray
    Write-Host "To: $VPS_HOST:$REMOTE_PATH" -ForegroundColor Gray

    # Upload server files using pscp
    & $pscpPath -r -pw $VPS_PASSWORD "$($LOCAL_PATH)\*" "$($VPS_USER)@$($VPS_HOST):$($REMOTE_PATH)/server/"

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "Files uploaded successfully!" -ForegroundColor Green
    } else {
        Write-Host "Upload failed with exit code: $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }

    # Upload package.json
    Write-Host "Uploading package.json..." -ForegroundColor Green
    & $pscpPath -pw $VPS_PASSWORD "F:\Shoe Repair POS - Copy\package.json" "$($VPS_USER)@$($VPS_HOST):$($REMOTE_PATH)/"

} finally {
    # Clean up password file
    if (Test-Path $passwordFile) {
        Remove-Item $passwordFile -Force
    }
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Next steps on VPS:" -ForegroundColor Yellow
Write-Host "1. SSH into server: ssh root@$VPS_HOST" -ForegroundColor White
Write-Host "2. cd /var/www/shoe-repair-pos" -ForegroundColor White
Write-Host "3. npm install --production" -ForegroundColor White
Write-Host "4. pm2 restart shoe-repair-pos" -ForegroundColor White
Write-Host "================================" -ForegroundColor Cyan
