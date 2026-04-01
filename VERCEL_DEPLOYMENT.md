# Vercel Deployment Guide

Deploy your admin backend to Vercel in 5 minutes!

## 🚀 Quick Deploy Steps

### Option 1: Deploy from GitHub (Recommended - Automated)

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select "Import Git Repository"
4. Choose: `gauthambinoy/gauthambinoy.github.io`
5. Configure:
   - **Project Name:** `portfolio-admin-backend`
   - **Root Directory:** `admin-backend`
   - **Framework Preset:** `Other`
6. **Environment Variables:**
   - Key: `ADMIN_TOKEN`
   - Value: (Create a secure token - e.g., `openssl rand -base64 32`)
7. Click **Deploy**
8. Wait for deployment to complete ✅

**Your deployed URL will be something like:**
```
https://portfolio-admin-backend.vercel.app
```

### Option 2: Deploy via Vercel CLI (Quick)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Navigate to admin-backend
cd admin-backend

# 3. Deploy
vercel

# 4. Follow prompts:
#    - Link to existing project? No
#    - Project name: portfolio-admin-backend
#    - Set up and deploy? Yes
#    - Move to Vercel? Yes (when asked)

# 5. Add environment variables in Vercel dashboard:
#    ADMIN_TOKEN = (your secure token)
```

---

## 🔐 Generate Secure Admin Token

Run this once to generate a secure token:

```bash
# On macOS/Linux:
openssl rand -base64 32

# Output example:
# xK7mP9qL2nR4vW6yF8jH3bQ5sT1uX7cZ9dA2eG4kL6m=
```

Use this token in your `.env` file and Vercel environment variables.

---

## 🔄 After Deployment

### 1. Update data-loader.js

In your portfolio website (`gauthambinoy.github.io/data-loader.js`):

```javascript
// Change this line:
backendUrl: process.env.VITE_BACKEND_URL || 'http://localhost:5000',

// To your Vercel URL:
backendUrl: 'https://portfolio-admin-backend.vercel.app',
```

### 2. Update Admin Dashboard

In `admin-dashboard/index.html` (optional, can also enter URL on login):

```javascript
// Change the default backend URL in app.js if deploying the dashboard too
backendUrl = 'https://portfolio-admin-backend.vercel.app';
```

### 3. Test Everything

1. **Test API:**
   ```bash
   curl https://portfolio-admin-backend.vercel.app/health
   # Should return: {"status":"ok"}
   ```

2. **Test Protected Endpoint:**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        https://portfolio-admin-backend.vercel.app/api/portfolio
   ```

3. **Test in Browser:**
   - Open admin dashboard
   - Enter backend URL: `https://portfolio-admin-backend.vercel.app`
   - Enter admin token
   - Click Login
   - Everything should work! ✅

---

## 📊 Vercel Environment Variables

After deployment, go to **Project Settings → Environment Variables** and add:

| Variable | Value | Description |
|----------|-------|-------------|
| `ADMIN_TOKEN` | `your-secure-token` | Token for admin access |
| `PORT` | `3000` (auto) | Server port (optional) |

---

## 🔗 Your Deployment URLs

After successful deployment, you'll have:

**Backend API:**
```
https://portfolio-admin-backend.vercel.app
```

**Admin Dashboard:** (if deploying separately)
```
https://portfolio-admin-dashboard.vercel.app
```

**Portfolio Website:** (already on GitHub Pages)
```
https://gauthambinoy.github.io
```

---

## ✅ Verification Checklist

After deployment:

- [ ] Vercel shows deployment as "Ready"
- [ ] Health check returns `{"status":"ok"}`
- [ ] Can access `/api/portfolio` endpoint
- [ ] Admin token works with protected endpoints
- [ ] Admin dashboard connects to backend
- [ ] Website fetches data from backend
- [ ] GitHub sync works (if backend is live)

---

## 🐛 Troubleshooting Deployment

### Build Error: "Cannot find module"

```bash
# Solution: Make sure package.json dependencies are correct
npm install  # In admin-backend directory
git add .
git commit -m "Update dependencies"
git push
```

### Deployment shows "500 Error"

1. Check Vercel logs: Project → Deployments → Logs
2. Verify `ADMIN_TOKEN` environment variable is set
3. Check all imports in server.js are valid

### CORS Issues

Edit `admin-backend/server.js`:

```javascript
// Change:
app.use(cors());

// To restrict origin:
app.use(cors({
    origin: 'https://gauthambinoy.github.io'
}));
```

---

## 🚀 Next: Update Your Portfolio

After backend is deployed:

### 1. Update data-loader.js
```bash
git checkout admin-backend/data-loader.js
# Edit the backendUrl to your Vercel URL
git add data-loader.js
git commit -m "Update backend URL to Vercel deployment"
git push
```

### 2. Test Website
- Visit https://gauthambinoy.github.io
- Should load data from your Vercel backend
- Projects should include GitHub-synced repos

### 3. Test Admin Dashboard
- Open admin-dashboard/index.html
- Login with your backend URL and token
- Make a test change
- Verify it appears on website

---

## 📈 Monitoring

In Vercel Dashboard:

- **Analytics** - View API request counts
- **Logs** - Check server logs for errors
- **Deployments** - See all deployment history
- **Environment** - Manage environment variables

---

## 🔐 Security Reminders

- ✅ Never commit `.env` file to GitHub
- ✅ Change `ADMIN_TOKEN` every month
- ✅ Use strong, random tokens
- ✅ Keep Vercel project private
- ✅ Monitor access logs regularly

---

## 💡 Pro Tips

1. **Automatic Deployments:** Every push to GitHub automatically deploys to Vercel
2. **Rollback:** Vercel keeps deployment history - can rollback anytime
3. **Custom Domain:** Can add custom domain in Vercel settings
4. **Analytics:** Check Vercel analytics to see API usage
5. **Alerts:** Set up Vercel alerts for errors

---

## 📞 Need Help?

If deployment fails:

1. Check Vercel logs: Project → Deployments → Logs
2. Verify all environment variables are set
3. Make sure `admin-backend` folder has `package.json` and `server.js`
4. Check GitHub is synced with latest code
5. Try redeploying from Vercel dashboard

---

## ✨ Success!

Once deployed, your system is live! 🎉

**Portfolio:** https://gauthambinoy.github.io
**Backend API:** https://portfolio-admin-backend.vercel.app
**Admin Dashboard:** admin-dashboard/index.html

Everything works together to keep your portfolio fresh and up-to-date!
