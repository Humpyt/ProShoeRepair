#!/bin/bash

#############################################
# Shoe Repair POS - Complete VPS Setup
# Run this on your VPS after connecting
#############################################

set -e

echo "================================"
echo "Shoe Repair POS - VPS Setup"
echo "================================"
echo ""

# Update system
echo "[1/6] Updating system packages..."
apt-get update -y > /dev/null 2>&1

# Install Node.js 20.x
echo "[2/6] Installing Node.js 20.x..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs > /dev/null 2>&1
fi
echo "   Node.js version: $(node --version)"

# Install PM2
echo "[3/6] Installing PM2 process manager..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2 > /dev/null 2>&1
fi
echo "   PM2 version: $(pm2 --version)"

# Create directory
echo "[4/6] Creating application directory..."
mkdir -p /var/www/shoe-repair-pos
cd /var/www/shoe-repair-pos

# Create package.json
echo "[5/6] Creating package.json..."
cat > package.json << 'EOF'
{
  "name": "shoe-repair-pos-backend",
  "version": "1.0.0",
  "description": "Shoe Repair POS Backend API",
  "main": "server/index.js",
  "scripts": {
    "start": "node server/index.js"
  },
  "dependencies": {
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "date-fns": "^3.0.0",
    "escpos": "^3.0.0-alpha.6",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "node-thermal-printer": "^1.1.2",
    "qrcode": "^1.5.3",
    "sqlite3": "^5.1.7"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.0",
    "tsx": "^4.7.0"
  }
}
EOF

# Install dependencies
echo "   Installing npm packages..."
npm install --production --silent

# Create .env file
echo "[6/6] Creating environment file..."
cat > .env << 'EOF'
PORT=3000
NODE_ENV=production
JWT_SECRET=prod-jwt-secret-change-this-in-production-84729
DB_PATH=/var/www/shoe-repair-pos/database.db
EOF

# Setup PM2 startup
echo ""
echo "Setting up PM2 startup script..."
pm2 startup systemd -u root --hp /root > /tmp/pm2-startup.txt 2>&1
echo "   IMPORTANT: Run the command shown above to enable PM2 startup"

echo ""
echo "================================"
echo "Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Upload your server folder to /var/www/shoe-repair-pos/"
echo "2. Run: pm2 start server/index.js --name shoe-repair-pos"
echo "3. Run: pm2 save"
echo "4. Run: pm2 status"
echo ""
echo "Your API will be available at: http://69.62.125.228:3000/api"
echo ""
echo "================================"
