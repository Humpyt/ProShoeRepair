# 🚀 Backend Deployment to Hostinger VPS

Your application frontend is live on Netlify. This guide helps you deploy the backend to your Hostinger VPS.

---

## 📋 What You Need

- VPS IP: **69.62.125.228**
- SSH User: **root**
- SSH Password: **HaaH+&FXzoi-0nBO7gK(**

---

## ⚡ Quick Start (Fastest Method)

### Option 1: Use the automated batch script (Windows)

1. **Double-click** `upload-files.bat`
2. Enter the password when prompted: `HaaH+&FXzoi-0nBO7gK(`
3. Wait for upload to complete
4. Follow the on-screen instructions

### Option 2: Manual setup (Works on any OS)

**Step 1:** Connect to VPS
```bash
ssh root@69.62.125.228
# Password: HaaH+&FXzoi-0nBO7gK(
```

**Step 2:** Run setup (copy & paste this entire block)
```bash
apt-get update -y && \
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
apt-get install -y nodejs && \
npm install -g pm2 && \
mkdir -p /var/www/shoe-repair-pos && \
cd /var/www/shoe-repair-pos && \
cat > package.json << 'EOF'
{
  "name": "shoe-repair-pos-backend",
  "version": "1.0.0",
  "main": "server/index.js",
  "scripts": { "start": "node server/index.js" },
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
npm install --production
```

**Step 3:** Upload server files from your PC

Open a NEW terminal and run:
```bash
cd "F:\Shoe Repair POS - Copy"
scp -r server root@69.62.125.228:/var/www/shoe-repair-pos/
```

**Step 4:** Start the app

Back in the VPS terminal:
```bash
cd /var/www/shoe-repair-pos
pm2 start server/index.js --name shoe-repair-pos
pm2 save
pm2 status
```

**Done!** Your API is now at: `http://69.62.125.228:3000/api`

---

## 🔧 Update Netlify Frontend

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Add/update:
   - Name: `VITE_API_URL`
   - Value: `http://69.62.125.228:3000/api`
5. **Trigger a new deploy**

---

## 📁 Files Created for Deployment

| File | Purpose |
|------|---------|
| `MANUAL_DEPLOY_STEPS.md` | Step-by-step manual deployment guide |
| `DEPLOYMENT_GUIDE.md` | Comprehensive deployment documentation |
| `upload-files.bat` | Windows batch script to upload files |
| `quick-deploy.bat` | Alternative automated deployment script |
| `deploy-backend.sh` | VPS setup script |
| `ecosystem.config.js` | PM2 process manager configuration |

---

## 🧪 Test Your Deployment

```bash
# Check if API is working
curl http://69.62.125.228:3000/api/operations

# Or open in browser:
# http://69.62.125.228:3000/api/operations
```

You should see JSON output (even if empty `[]`).

---

## 🔍 Useful Commands

```bash
# SSH into VPS
ssh root@69.62.125.228

# Check if server is running
pm2 status

# View logs
pm2 logs shoe-repair-pos

# Restart server
pm2 restart shoe-repair-pos

# Stop server
pm2 stop shoe-repair-pos
```

---

## 🐛 Troubleshooting

### Server not starting?
```bash
# Check error logs
pm2 logs shoe-repair-pos --err

# Try running manually
cd /var/www/shoe-repair-pos
node server/index.js
```

### Can't connect from browser?
```bash
# Check if port 3000 is open
ufw allow 3000/tcp

# Check if PM2 is running
pm2 status

# Check what's listening on port 3000
netstat -tulpn | grep 3000
```

### Connection refused?
1. Check if VPS is reachable: `ping 69.62.125.228`
2. Verify PM2 status: `pm2 status`
3. Check firewall settings in Hostinger control panel

---

## 🔒 Security Checklist

- [ ] Change root password
- [ ] Create dedicated user for app
- [ ] Set up SSH key authentication
- [ ] Configure HTTPS with nginx
- [ ] Set up firewall rules
- [ ] Enable automatic database backups
- [ ] Keep dependencies updated

---

## 📚 Need More Details?

- See `MANUAL_DEPLOY_STEPS.md` for detailed step-by-step instructions
- See `DEPLOYMENT_GUIDE.md` for comprehensive documentation

---

## ✨ Quick Reference Card

| Action | Command |
|--------|---------|
| Connect to VPS | `ssh root@69.62.125.228` |
| Upload files | `scp -r server root@69.62.125.228:/var/www/shoe-repair-pos/` |
| Start server | `pm2 start server/index.js --name shoe-repair-pos` |
| Check status | `pm2 status` |
| View logs | `pm2 logs shoe-repair-pos` |
| Restart | `pm2 restart shoe-repair-pos` |
| Test API | `curl http://69.62.125.228:3000/api/operations` |

---

**API Endpoint:** `http://69.62.125.228:3000/api`

**Frontend URL:** (Your Netlify URL)

**VPS IP:** 69.62.125.228
