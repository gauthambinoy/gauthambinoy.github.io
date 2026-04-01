# GitHub Auto-Sync Feature

Automatically sync your GitHub repositories to your portfolio projects section. Your projects will always be up-to-date with real-time stats like stars, forks, and language.

## ✨ What It Does

- 🔄 **Auto-fetch** your GitHub repositories
- ⭐ **Display stats** (stars, forks, language, topics)
- 📝 **Smart descriptions** - Uses repo descriptions and topics
- 🎨 **Gradient backgrounds** - Automatically assigned to each project
- 🔗 **Direct links** - GitHub repo + optional demo URL from homepage field
- 💾 **Preserved manual entries** - Manually added projects are kept
- 📊 **User stats** - View followers, public repos, etc.

## 🚀 How to Use

### 1. Navigate to GitHub Sync Tab
Open the admin dashboard and click "GitHub Sync" tab.

### 2. Enter Your GitHub Username
Enter your GitHub username (e.g., `gauthambinoy`)

### 3. Load Your Profile
Click "Load GitHub Profile" button. This will:
- Validate your GitHub username
- Fetch your profile stats
- List your repositories to be imported

### 4. Review Repositories
You'll see a preview of repositories that will be synced:
- Repo name and description
- Language
- Stars and forks count
- First 10 repos shown (more in the background)

### 5. Sync to Portfolio
Click "Sync to Portfolio" button. Your dashboard will:
- Fetch all public repositories (up to 100)
- Extract tech stack from language and topics
- Add them as projects in your portfolio
- Preserve any manually added projects

### 6. Done!
Your portfolio projects section now includes all your GitHub repos!

## 📊 What Gets Synced

For each GitHub repository, the following is synced:

```javascript
{
    name: "repo-name",           // From GitHub repo name
    category: "Python",          // Primary language
    description: "...",          // From GitHub description
    stack: ["Python", "React"], // Language + topics + frameworks
    gradient: "linear-gradient...",  // Auto-assigned color
    links: {
        github: "https://github.com/user/repo",  // GitHub link
        demo: "https://..."  // From repo homepage field (if set)
    },
    stats: {
        stars: 42,
        forks: 12,
        language: "Python",
        topics: ["ai", "ml", "python"],
        lastUpdated: "2025-03-15T10:30:00Z"
    }
}
```

## 🎯 Tips & Tricks

### 1. **Add Demo Links**
Set the "Website" field in your GitHub repo settings to your demo URL. This will be synced and displayed on your portfolio.

```
GitHub Repo Settings → Website field → Add your demo link
```

### 2. **Use Topics for Better Categorization**
Add topics to your GitHub repos - they'll be included in the tech stack.

```
GitHub Repo → About → Add up to 30 topics
Synced topics examples: "python", "react", "ai", "fastapi"
```

### 3. **Write Good Descriptions**
The repo description is used as your project description on the portfolio:

```
✅ Good:  "AI text detection system using ensemble ML pipelines"
❌ Bad:   "project"
```

### 4. **Sync Multiple Times**
You can sync as many times as you want. New repos are added, existing ones are updated, manually added projects are preserved.

### 5. **Manual + Auto Sync**
You can mix manual and auto-synced projects:
- Auto-synced: Your GitHub repos
- Manual: Projects not on GitHub, freelance work, etc.

Both types are preserved during sync!

## 🔄 Sync Process

```
Your GitHub Account
        ↓
GitHub API (public data)
        ↓
Backend processes:
  - Builds tech stack
  - Generates gradients
  - Extracts stats
        ↓
portfolio-data.json
        ↓
Website displays synced projects
        ↓
Visitors see latest projects!
```

## 🔐 Privacy & Security

- ✅ Uses public GitHub API (no authentication needed)
- ✅ Only syncs public repositories
- ✅ No private data is accessed
- ✅ No personal access tokens needed
- ✅ Works with GitHub's rate limits (60 requests/hour)

## 🐛 Troubleshooting

### "GitHub username not found"
- Check spelling of username
- Make sure profile is public
- GitHub might be temporarily unavailable

### "Failed to sync repositories"
- Check your backend is running
- Verify admin token is correct
- Check browser console (F12) for errors

### "No repositories showing"
- Account must have at least one public repo
- Private repos won't be synced
- Check your GitHub profile visibility

### Sync seems slow
- GitHub API might be rate-limited
- Try again in a few minutes
- First sync fetches all repos (can take a moment)

## 📈 Real-World Example

### Before Sync
```
Projects tab had:
- ClarityAI (manually added)
- ResumeShield (manually added)
```

### After Sync with GitHub username "gauthambinoy"
```
Projects now has:
- ClarityAI (manual - preserved)
- ResumeShield (manual - preserved)
- unified-world-data (synced from GitHub)
- cryptostock-pro (synced from GitHub)
- plus 15+ more repos from GitHub!
```

All with automatic stats, links, and descriptions! ✨

## 🚀 Advanced: Manual Project Override

If you want to manually customize a synced project:

1. Load and sync your GitHub repos
2. Go to "Projects" tab
3. Find the synced project
4. Click "Edit" to customize
5. Your changes are preserved (won't be overwritten by future syncs)

The system is smart about this - it knows which projects are manually edited.

## 📊 GitHub Sync Limits

- **Public Repos**: Up to 100 fetched per sync
- **Rate Limit**: 60 requests/hour (GitHub API limit)
- **Update Frequency**: Sync whenever you want
- **Manual Projects**: Unlimited and preserved

## 🔗 Useful GitHub Settings

To get the most from GitHub sync:

1. **Add Homepage URL**
   ```
   Repo Settings → Website field → Your demo URL
   This becomes the "Live Demo" link
   ```

2. **Add Topics**
   ```
   Repo → About section → Add up to 30 topics
   Topics appear in tech stack
   ```

3. **Write Good Description**
   ```
   Repo description (100-150 chars is ideal)
   Used as project description on portfolio
   ```

4. **Keep Profile Complete**
   ```
   GitHub Profile → Add bio, location, company
   Displayed in admin dashboard
   ```

## 💡 Best Practices

1. **Sync regularly** - Keep your portfolio fresh with latest repos
2. **Add descriptions** - Help visitors understand your projects
3. **Set homepage URLs** - Add demo links for projects
4. **Use topics** - Better categorization for your tech stack
5. **Keep repos clean** - Only sync repos you're proud of

## 🎨 Customization

After syncing, each project gets:
- **Unique gradient background** - Automatically assigned color
- **Tech stack** - Built from language + topics + smart detection
- **Stats display** - Stars, forks, language visible
- **Direct links** - GitHub + demo (if available)

## 🔔 What's NOT Synced

- 🚫 Private repositories
- 🚫 Archived repositories (can be synced if needed)
- 🚫 Readme content
- 🚫 Code files
- 🚫 Commit history

Only public metadata is synced for privacy and performance!

## 📞 Need Help?

- Check `SETUP_GUIDE.md` for general setup
- Check `IMPLEMENTATION_SUMMARY.md` for overview
- Use browser console (F12) to see detailed error messages
- Verify GitHub username is correct and public

## 🎉 You're All Set!

GitHub Sync makes keeping your portfolio up-to-date effortless. Push to GitHub, sync in the dashboard, and your portfolio automatically stays current!

---

**Happy syncing!** 🚀
