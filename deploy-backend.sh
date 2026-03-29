#!/bin/bash

# Shoe Repair POS - Backend Deployment Script for Hostinger VPS
# This script sets up and deploys the Express backend server

set -e  # Exit on any error

echo "================================"
echo "Shoe Repair POS - Backend Setup"
echo "================================"

# Update system packages
echo "Updating system packages..."
apt-get update -y

# Install Node.js (if not already installed)
if ! command -v node &> /dev/null; then
    echo "Installing Node.js 20.x..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
else
    echo "Node.js is already installed: $(node --version)"
fi

# Install PM2 process manager (if not already installed)
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2 process manager..."
    npm install -g pm2
else
    echo "PM2 is already installed: $(pm2 --version)"
fi

# Create application directory
APP_DIR="/var/www/shoe-repair-pos"
echo "Creating application directory at $APP_DIR..."
mkdir -p $APP_DIR
cd $APP_DIR

# Create a simple package.json if it doesn't exist
if [ ! -f "package.json" ]; then
    echo "Creating package.json..."
    cat > package.json << 'EOF'
{
  "name": "shoe-repair-pos-backend",
  "version": "1.0.0",
  "description": "Shoe Repair POS Backend API",
  "main": "index.js",
  "scripts": {
    "start": "node server/index.js",
    "dev": "tsx watch server/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "sqlite3": "^5.1.7",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "date-fns": "^3.0.0",
    "qrcode": "^1.5.3",
    "escpos": "^3.0.0-alpha.6",
    "node-thermal-printer": "^1.1.2"
  },
  "devDependencies": {
    "tsx": "^4.7.0",
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.0"
  }
}
EOF
fi

# Install dependencies
echo "Installing dependencies..."
npm install --production

# Create server directory structure
echo "Creating server directory structure..."
mkdir -p server/routes
mkdir -p server/config
mkdir -p server/utils

# Create a basic .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << 'EOF'
PORT=3000
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DB_PATH=/var/www/shoe-repair-pos/database.db
EOF
fi

# Setup PM2 to start on reboot
echo "Configuring PM2 startup script..."
pm2 startup systemd -u root --hp /root

echo ""
echo "================================"
echo "Setup Complete!"
echo "================================"
echo "Application directory: $APP_DIR"
echo "Next steps:"
echo "1. Upload your server files to $APP_DIR"
echo "2. Run: pm2 start $APP_DIR/package.json --name shoe-repair-pos"
echo "3. Save PM2 config: pm2 save"
echo "4. Check status: pm2 status"
echo "================================"
