# Shoe Repair POS - Backend Deployment Guide
## Deploying Backend to Hostinger VPS

This guide will walk you through deploying the backend API to your Hostinger VPS.

---

## VPS Details
- **IP Address:** 69.62.125.228
- **User:** root
- **Password:** HaaH+&FXzoi-0nBO7gK(

---

## Method 1: Automated Deployment (Recommended)

### Prerequisites
1. Install **PuTTY** (includes plink and pscp) from: https://www.putty.org/
2. Install **PowerShell** (comes with Windows)

### Step 1: Run Initial Setup Script

SSH into your VPS and run the setup script:

```bash
# SSH into VPS
ssh root@69.62.125.228
# Enter password when prompted: HaaH+&FXzoi-0nBO7gK(

# Once connected, create and run the setup script
nano setup.sh
# Paste the contents of deploy-backend.sh
# Save with Ctrl+X, Y, Enter

# Make it executable and run
chmod +x setup.sh
./setup.sh
```

### Step 2: Deploy Files

On your local machine, open PowerShell and run:

```powershell
cd "F:\Shoe Repair POS - Copy"
.\deploy-to-vps.ps1
```

### Step 3: Start the Application

SSH back into the VPS and start the app with PM2:

```bash
ssh root@69.62.125.228

cd /var/www/shoe-repair-pos

# Install dependencies
npm install --production

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Check status
pm2 status
```

### Step 4: Configure Firewall (if needed)

```bash
# Allow traffic on port 3000
ufw allow 3000/tcp
ufw reload
```

### Step 5: Update Frontend API URL

Update your Netlify frontend environment variable:

```
VITE_API_URL=http://69.62.125.228:3000/api
```

Or in your code, update the API base URL in necessary files.

---

## Method 2: Manual Deployment

### Step 1: Connect to VPS

```bash
ssh root@69.62.125.228
# Password: HaaH+&FXzoi-0nBO7gK(
```

### Step 2: Install Dependencies

```bash
# Update package list
apt-get update

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install PM2 globally
npm install -g pm2

# Verify installations
node --version
npm --version
pm2 --version
```

### Step 3: Create Application Directory

```bash
mkdir -p /var/www/shoe-repair-pos
cd /var/www/shoe-repair-pos
```

### Step 4: Upload Files

On your local machine (in a new terminal):

```bash
# Using SCP (Windows CMD/PowerShell)
cd "F:\Shoe Repair POS - Copy"
scp -r server/* root@69.62.125.228:/var/www/shoe-repair-pos/server/
scp package.json root@69.62.125.228:/var/www/shoe-repair-pos/
scp ecosystem.config.js root@69.62.125.228:/var/www/shoe-repair-pos/
```

Or use **WinSCP** GUI for file transfer:
- Download from: https://winscp.net/
- Host: 69.62.125.228
- User: root
- Password: HaaH+&FXzoi-0nBO7gK(
- Upload `server/` folder and `package.json` to `/var/www/shoe-repair-pos/`

### Step 5: Install Dependencies on VPS

```bash
cd /var/www/shoe-repair-pos
npm install --production
```

### Step 6: Create Environment File

```bash
nano .env
```

Add the following:

```env
PORT=3000
NODE_ENV=production
JWT_SECRET=change-this-to-a-secure-random-string
DB_PATH=/var/www/shoe-repair-pos/database.db
```

Save with Ctrl+X, Y, Enter

### Step 7: Start Application with PM2

```bash
# Start the application
pm2 start server/index.js --name shoe-repair-pos

# Or use ecosystem config
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system reboot
pm2 startup systemd -u root --hp /root
# Run the command it outputs

# Check application status
pm2 status

# View logs
pm2 logs shoe-repair-pos

# Monitor
pm2 monit
```

---

## Testing the Deployment

### 1. Check if server is running

```bash
pm2 status
```

You should see: `shoe-repair-pos` with status `online`

### 2. Test API endpoint

From your local machine:

```bash
curl http://69.62.125.228:3000/api/operations
```

Or open in browser: `http://69.62.125.228:3000/api/operations`

### 3. Check logs for errors

```bash
pm2 logs shoe-repair-pos --lines 50
```

---

## Useful PM2 Commands

```bash
# List all processes
pm2 list

# Restart application
pm2 restart shoe-repair-pos

# Stop application
pm2 stop shoe-repair-pos

# Delete application
pm2 delete shoe-repair-pos

# View real-time logs
pm2 logs shoe-repair-pos

# Clear logs
pm2 flush

# Monitor CPU and memory
pm2 monit

# Reset restart counter
pm2 reset shoe-repair-pos
```

---

## Troubleshooting

### Port 3000 already in use

```bash
# Check what's using port 3000
netstat -tulpn | grep 3000
# or
lsof -i :3000

# Kill the process if needed
kill -9 <PID>
```

### Application won't start

```bash
# Check logs for errors
pm2 logs shoe-repair-pos --err

# Try running directly to see errors
cd /var/www/shoe-repair-pos
node server/index.js
```

### Database permission issues

```bash
# Ensure the database file is writable
chmod 664 /var/www/shoe-repair-pos/database.db
chown root:root /var/www/shoe-repair-pos/database.db
```

### Firewall blocking connections

```bash
# Check firewall status
ufw status

# Allow port 3000
ufw allow 3000/tcp
ufw reload
ufw status
```

### Cannot connect from external

1. Check if PM2 app is running: `pm2 status`
2. Check firewall: `ufw status`
3. Verify server is listening: `netstat -tulpn | grep 3000`
4. Check Hostinger VPS firewall settings in their control panel

---

## Security Recommendations

1. **Change the default password** for the root user
2. **Create a dedicated user** for running the application (not root)
3. **Use SSH keys** instead of password authentication
4. **Set up a firewall** to only allow necessary ports
5. **Use HTTPS** with a reverse proxy (nginx) for production
6. **Keep dependencies updated** with `npm update`
7. **Regular backups** of the SQLite database

---

## Setting up nginx Reverse Proxy (Optional but Recommended)

For production, it's recommended to use nginx as a reverse proxy:

```bash
# Install nginx
apt-get install nginx

# Create configuration
nano /etc/nginx/sites-available/shoe-repair-pos
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name 69.62.125.228;

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
ln -s /etc/nginx/sites-available/shoe-repair-pos /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

Then update your frontend to use: `http://69.62.125.228/api`

---

## Updating the Deployment

When you make changes to the backend:

1. Upload new files to VPS
2. SSH into VPS
3. Restart the application:

```bash
cd /var/www/shoe-repair-pos
pm2 restart shoe-repair-pos
```

---

## Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs shoe-repair-pos`
2. Check system logs: `journalctl -xe`
3. Verify Node.js version: `node --version` (should be 18+)
4. Test connection locally: `curl http://localhost:3000/api/operations`

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `pm2 status` | Check application status |
| `pm2 logs shoe-repair-pos` | View logs |
| `pm2 restart shoe-repair-pos` | Restart application |
| `pm2 stop shoe-repair-pos` | Stop application |
| `pm2 save` | Save PM2 configuration |
| `netstat -tulpn \| grep 3000` | Check port 3000 |
| `curl http://localhost:3000/api/operations` | Test API locally |
