# Portfolio Admin Dashboard

A modern, clean admin interface for managing your portfolio content without needing to edit code or JSON files.

## Features

- 🔐 Token-based authentication
- 📝 Manage profile information
- 💼 Add/edit/delete work experience
- 🎓 Manage education history
- 🛠️ Organize skills by category
- 🚀 Create and showcase projects
- 💾 Real-time data persistence
- 📱 Fully responsive design
- 🌐 Works with local or remote backend

## Getting Started

### Prerequisites
- A web browser (no installation needed!)
- Backend API running (see [backend README](../admin-backend/README.md))

### Usage

1. **Open the dashboard:**
   - Locally: Open `index.html` in your browser
   - Online: Deploy to GitHub Pages, Vercel, Netlify, etc.

2. **Connect to your backend:**
   - Enter Backend URL (e.g., `http://localhost:5000`)
   - Enter your Admin Token
   - Click Login

3. **Manage your content:**
   - Switch between tabs (Profile, Experience, Education, etc.)
   - Add new items with "+" buttons
   - Edit existing items
   - Delete items you no longer need
   - Changes save automatically

## Sections

### Profile
Update your basic information:
- Name, title, role
- Location, email, phone
- Summary and bio

### Experience
Manage your work history:
- Company name and your role
- Duration and location
- Job description (optional)

### Education
Track your education:
- School/University name
- Degree and field of study
- Graduation period

### Skills
Organize your expertise:
- Languages (Python, JavaScript, etc.)
- Frameworks (React, Django, etc.)
- Infrastructure (Docker, AWS, etc.)
- AI/ML (RAG, GPT, etc.)

### Projects
Showcase your work:
- Project name and category
- Description
- Technology stack
- GitHub and demo links

## Backend Configuration

Make sure your backend is running before using the dashboard.

**Local backend:**
```bash
cd ../admin-backend
npm install
npm run dev
```

**Remote backend:**
Set the correct URL when logging in (e.g., `https://your-backend.vercel.app`)

## Tips & Tricks

- **Comma-separated lists:** Skills are entered as comma-separated values (e.g., "Python, JavaScript, TypeScript")
- **Stack format:** For projects, enter tech stack separated by commas
- **Links:** For projects, include full URLs (http:// or https://)
- **Testing:** Use "Test Connection" in Settings to verify backend connectivity
- **Local storage:** Your connection details are saved in browser storage (not uploaded)

## Security

- Token is stored in browser localStorage (not secure for public computers)
- Always use HTTPS in production
- Change your admin token regularly
- Don't share your admin token publicly
- Consider restricting dashboard access behind authentication

## Troubleshooting

**Dashboard won't load data:**
- Check the backend is running
- Verify the URL is correct (including http:// or https://)
- Check your admin token is correct
- Look at browser console (F12) for errors

**Changes don't persist:**
- Check backend connection status
- Verify you have write permissions to portfolio-data.json
- Check browser console for API errors

**Settings tab shows connection error:**
- Backend may be down
- Network connectivity issue
- Check firewall/proxy settings
- Try the "Test Connection" button

## Deployment

### Host on GitHub Pages
```bash
# No backend needed - falls back to local data
# Just commit the files and GitHub Pages will serve them
```

### Host on Vercel
```bash
vercel --cwd .
# Follow prompts to deploy
```

### Host on Netlify
```bash
# Drag and drop the folder to Netlify
# Or connect your GitHub repository
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT - Feel free to use for your portfolio

## Questions?

Check the [Setup Guide](../SETUP_GUIDE.md) for detailed instructions on deployment and configuration.
