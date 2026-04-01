# Portfolio Admin System - Setup Guide

This portfolio website now includes a complete admin dashboard system for managing your content. Here's how to get everything set up and running.

## 📁 Project Structure

```
gauthambinoy.github.io/
├── portfolio-data.json           # Central data store (all portfolio content)
├── data-loader.js               # Website data loader script
├── index.html                   # Main portfolio website
├── style.css                    # Website styles
├── script.js                    # Website animations and interactions
│
├── admin-backend/               # Backend API server
│   ├── server.js               # Express server
│   ├── package.json            # Dependencies
│   ├── .env.example            # Environment template
│   └── README.md               # Backend documentation
│
└── admin-dashboard/            # Admin UI
    ├── index.html              # Dashboard HTML
    ├── app.js                  # Dashboard JavaScript
    └── README.md               # Dashboard documentation
```

## 🚀 Quick Start

### Option 1: Local Development (Recommended for testing)

#### 1. Start the Backend

```bash
cd admin-backend
npm install
cp .env.example .env
# Edit .env and set ADMIN_TOKEN to a secure value
npm run dev
```

Backend will run on `http://localhost:5000`

#### 2. Open the Admin Dashboard

Open `admin-dashboard/index.html` in your browser, then:
- Backend URL: `http://localhost:5000`
- Admin Token: (whatever you set in .env)

#### 3. View the Website

Open `index.html` in your browser. It will automatically try to load data from the backend.

### Option 2: Deploy to Production

#### Deploy Backend to Vercel

```bash
# Make sure you're in the backend directory
cd admin-backend

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

After deployment, you'll get a URL like: `https://portfolio-admin-xyz.vercel.app`

#### Deploy Backend to Railway/Render

##### Railway:
1. Push your code to GitHub
2. Go to railway.app
3. Create new project → GitHub repo
4. Add environment variables (ADMIN_TOKEN)
5. Deploy!

##### Render:
1. Go to render.com
2. Create new Web Service from GitHub repo
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy!

#### Update Dashboard to point to deployed backend

Edit the admin-dashboard/index.html or hardcode the backend URL:

```javascript
// In admin-dashboard/app.js, update:
// Change: const backendUrl = localStorage.getItem('backendUrl');
// To: const backendUrl = 'https://your-deployed-backend.com';
```

#### Update Website to use deployed backend

Edit `data-loader.js`:

```javascript
// Change:
backendUrl: process.env.VITE_BACKEND_URL || 'http://localhost:5000',

// To:
backendUrl: 'https://your-deployed-backend.com',
```

## 📋 Workflow: Updating Your Portfolio

### Manual Sync from LinkedIn

1. Copy content from your LinkedIn profile
2. Log into the admin dashboard (`https://your-domain.com/admin-dashboard`)
3. Navigate to the relevant section (Experience, Education, Skills, Projects)
4. Click "Edit" or "Add" to update information
5. Click "Save"
6. Changes are saved to `portfolio-data.json` and immediately reflected on your website

### Syncing a New Position (Example)

1. Get new job info from LinkedIn
2. In admin dashboard → Experience tab
3. Click "+ Add Experience"
4. Fill in:
   - Company: JPMorganChase
   - Role: Full-stack Developer
   - Duration: March 2026 - Present
   - Location: Dublin, County Dublin, Ireland
5. Click "Save"
6. Your website automatically updates!

## 🔐 Security Best Practices

### 1. Protect Your Admin Dashboard

Create a `.htaccess` file in admin-dashboard/ (if using Apache):

```apache
<FilesMatch "\.js$">
    Deny from all
</FilesMatch>
```

Or move admin-dashboard to a private location outside the GitHub repo.

### 2. Secure Your Admin Token

```bash
# Generate a strong token
openssl rand -base64 32

# Save it in .env
ADMIN_TOKEN=your-very-secure-token-here
```

### 3. Environment Variables

**Never commit `.env` files!** The `.gitignore` already prevents this.

### 4. CORS Configuration (Optional)

Edit `admin-backend/server.js`:

```javascript
// Change this:
app.use(cors());

// To this (restrict to your domain):
app.use(cors({
    origin: 'https://your-dashboard-domain.com'
}));
```

## 🔗 API Documentation

The backend provides these public endpoints (no auth required):

```bash
# Get all portfolio data
GET /api/portfolio

# Get specific section
GET /api/portfolio/experience
GET /api/portfolio/education
GET /api/portfolio/skills
GET /api/portfolio/projects
```

Protected endpoints (require `Authorization: Bearer <TOKEN>`):

```bash
# Update entire section
POST /api/portfolio/:section

# Update specific item
PUT /api/portfolio/:section/:id

# Add new item
POST /api/portfolio/:section/item

# Delete item
DELETE /api/portfolio/:section/:id
```

## 📱 Responsive Design

The admin dashboard is fully responsive and works on:
- Desktop (recommended)
- Tablet
- Mobile (smaller screens)

## 🐛 Troubleshooting

### Dashboard won't load data

1. Check backend URL is correct
2. Verify admin token matches `.env` file
3. Check browser console for errors (F12 → Console)
4. Test connection with "Test Connection" button in Settings tab

### Website shows old data

1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+Shift+R)
3. Check that `data-loader.js` is loading (check Network tab in F12)

### Backend won't start

```bash
# Check Node version
node --version  # Should be 14+

# Check dependencies
npm install

# Check port isn't in use
# If port 5000 is busy, change PORT in .env
PORT=5001
```

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Railway Deployment](https://docs.railway.app/)
- [Render Deployment](https://render.com/docs)

## 🆘 Need Help?

1. Check the `admin-backend/README.md` for API details
2. Check browser console for error messages
3. Make sure all files are in the correct locations
4. Verify `.env` file has been created and populated

## 📝 Next Steps

1. **Deploy the backend** to your hosting platform
2. **Update dashboard URL** to point to deployed backend
3. **Update data-loader.js** in website to use deployed backend
4. **Test everything** by making a small change in the dashboard
5. **Commit everything** to GitHub (except `.env` files)

You're all set! Your portfolio now has a complete admin system for easy content management. 🎉
