#!/bin/bash

# 🚀 ONE-COMMAND DEPLOYMENT SCRIPT
# Run this from your portfolio repo directory
# Usage: bash DEPLOY.sh

set -e

echo "╔════════════════════════════════════════════╗"
echo "║   🚀 PORTFOLIO DEPLOYMENT SCRIPT 🚀        ║"
echo "║   One-Command Deployment to Vercel        ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Step 1: Check if we're in the right directory
if [ ! -f "index.html" ] || [ ! -d "admin-backend" ]; then
    echo "❌ Error: Please run this script from your portfolio repo root directory"
    echo "   (where index.html and admin-backend/ exist)"
    exit 1
fi

echo "✅ Correct directory detected"
echo ""

# Step 2: Check if Vercel CLI is installed
echo "📦 Checking Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi
echo "✅ Vercel CLI ready"
echo ""

# Step 3: Generate admin token if needed
echo "🔐 Generating secure admin token..."
ADMIN_TOKEN=$(openssl rand -base64 32)
echo "✅ Token generated: $ADMIN_TOKEN"
echo "   (Save this token! You'll need it in Vercel dashboard)"
echo ""

# Step 4: Deploy backend to Vercel
echo "🚀 Deploying backend to Vercel..."
echo "   (Follow prompts when asked)"
cd admin-backend
vercel
BACKEND_URL=$(vercel url 2>/dev/null || echo "")
cd ..

if [ -z "$BACKEND_URL" ]; then
    echo ""
    echo "⚠️  Deployment may be in progress. Please note your backend URL from Vercel dashboard."
    echo "   It will look like: https://portfolio-admin-backend-xyz.vercel.app"
    read -p "Enter your backend URL: " BACKEND_URL
fi

echo "✅ Backend URL: $BACKEND_URL"
echo ""

# Step 5: Update data-loader.js
echo "📝 Updating data-loader.js with backend URL..."
# Use a temporary backup
cp data-loader.js data-loader.js.backup

# Replace the localhost URL with the deployed URL
sed -i.bak "s|process.env.VITE_BACKEND_URL || 'http://localhost:5000'|'$BACKEND_URL'|g" data-loader.js

rm -f data-loader.js.bak

echo "✅ Updated data-loader.js"
echo ""

# Step 6: Commit and push to GitHub
echo "📤 Committing and pushing to GitHub..."
git add data-loader.js
git commit -m "Deploy backend to Vercel - Update backend URL to $BACKEND_URL

Co-Authored-By: Gautham Binoy <gautham.binoy005@gmail.com>" || true
git push origin main

echo "✅ Pushed to GitHub"
echo ""

# Step 7: Set environment variable in Vercel (manual step)
echo "⚠️  IMPORTANT - Manual Step Required:"
echo ""
echo "1. Go to: https://vercel.com"
echo "2. Open your 'portfolio-admin-backend' project"
echo "3. Go to: Settings → Environment Variables"
echo "4. Add environment variable:"
echo "   Name: ADMIN_TOKEN"
echo "   Value: $ADMIN_TOKEN"
echo "5. Click Save and Vercel will auto-redeploy"
echo ""

# Step 8: Show summary
echo "╔════════════════════════════════════════════╗"
echo "║          ✅ DEPLOYMENT COMPLETE! ✅        ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "📋 YOUR LIVE URLS:"
echo ""
echo "  Portfolio:   https://gauthambinoy.github.io"
echo "  Backend:     $BACKEND_URL"
echo "  Dashboard:   admin-dashboard/index.html"
echo "  GitHub:      https://github.com/gauthambinoy/gauthambinoy.github.io"
echo ""
echo "🔐 Admin Token (save this!):"
echo "  $ADMIN_TOKEN"
echo ""
echo "📝 Next Steps:"
echo "  1. Go to Vercel dashboard"
echo "  2. Add ADMIN_TOKEN environment variable (see above)"
echo "  3. Wait for auto-redeploy (2 minutes)"
echo "  4. Test website: https://gauthambinoy.github.io"
echo "  5. Test backend: $BACKEND_URL/health"
echo "  6. Test dashboard: admin-dashboard/index.html"
echo ""
echo "✨ Your portfolio is now LIVE! 🎉"
echo ""
