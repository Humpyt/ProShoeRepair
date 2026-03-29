# MANUAL DEPLOYMENT INSTRUCTIONS

## Quick Deploy - 3 Simple Steps

### STEP 1: Connect to your VPS
Open Command Prompt, PowerShell, or Terminal and run:

```bash
ssh root@69.62.125.228
```

When prompted for password, enter: `HaaH+&FXzoi-0nBO7gK(`

### STEP 2: Copy and paste this entire command block

Once connected to the VPS, copy and paste everything below:

```bash
# Update system
apt-get update -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Create application directory
mkdir -p /var/www/shoe-repair-pos
cd /var/www/shoe-repair-pos

# Create package.json
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
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "sqlite3": "^5.1.7",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "date-fns": "^3.0.0",
    "qrcode": "^1.5.3"
  }
}
EOF

# Install dependencies
npm install --production

# Setup PM2
pm2 startup systemd -u root --hp /root

echo "Setup complete! Now you need to upload your server files."
echo "Run the command shown after 'env:' to enable PM2 startup."
```

**IMPORTANT:** After the command finishes, you'll see a command that starts with `env:` - copy and run that command to enable PM2 to start on boot.

### STEP 3: Upload your server files

**Option A: Using WinSCP (Easiest - GUI)**
1. Download WinSCP from: https://winscp.net/
2. Open WinSCP and enter:
   - Host: `69.62.125.228`
   - User: `root`
   - Password: `HaaH+&FXzoi-0nBO7gK(`
3. Click Login
4. Navigate to `/var/www/shoe-repair-pos` on the right (VPS)
5. Navigate to `F:\Shoe Repair POS - Copy` on the left (Your PC)
6. Drag the `server` folder from left to right
7. Overwrite if prompted

**Option B: Using SCP Command (Command Line)**

Open a NEW terminal (don't close the SSH connection), navigate to your project folder, and run:

```bash
cd "F:\Shoe Repair POS - Copy"
scp -r server root@69.62.125.228:/var/www/shoe-repair-pos/
```

Enter password when prompted: `HaaH+&FXzoi-0nBO7gK(`

### STEP 4: Start the application

Go back to your SSH connection (the one where you ran STEP 2) and run:

```bash
cd /var/www/shoe-repair-pos

# Start with PM2
pm2 start server/index.js --name shoe-repair-pos

# Save PM2 configuration
pm2 save

# Check status
pm2 status
```

You should see `shoe-repair-pos` with status `online`

### STEP 5: Test the API

Open your browser and go to:
```
http://69.62.125.228:3000/api/operations
```

You should see JSON data (or an empty array `[]`)

---

## Done! Your backend is now deployed.

**Your API endpoint is:** `http://69.62.125.228:3000/api`

### Next: Update your Netlify frontend

1. Go to your Netlify dashboard
2. Find your site
3. Go to Site Settings → Environment Variables
4. Add or update:
   - Key: `VITE_API_URL`
   - Value: `http://69.62.125.228:3000/api`

5. Redeploy your Netlify site

---

## Common Commands

```bash
# Check if server is running
pm2 status

# View logs
pm2 logs shoe-repair-pos

# Restart server
pm2 restart shoe-repair-pos

# Stop server
pm2 stop shoe-repair-pos

# SSH into VPS
ssh root@69.62.125.228
```

---

## Troubleshooting

**Can't connect to API:**
1. Check if PM2 is running: `pm2 status`
2. Check if port 3000 is open: `ufw allow 3000`
3. Check logs: `pm2 logs shoe-repair-pos`

**Server won't start:**
1. Check logs: `pm2 logs shoe-repair-pos --err`
2. Try running manually: `cd /var/www/shoe-repair-pos && node server/index.js`

**Need to update code:**
1. Upload new files using WinSCP or SCP
2. Run: `pm2 restart shoe-repair-pos`

---

## Security Notes

⚠️ **Important:** For production, you should:
1. Change the root password
2. Set up SSH keys instead of password
3. Configure HTTPS with nginx
4. Set up firewall rules
5. Regular database backups

---

Need help? Check `DEPLOYMENT_GUIDE.md` for detailed information.
