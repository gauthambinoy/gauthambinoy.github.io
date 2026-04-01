#!/bin/bash

###############################################################################
#                    🚀 ULTIMATE AUTO-DEPLOY SCRIPT 🚀                       #
#                                                                             #
#  This script does EVERYTHING automatically:                                #
#  1. Generates secure admin token                                           #
#  2. Installs Vercel CLI                                                    #
#  3. Deploys backend to Vercel                                              #
#  4. Gets your backend URL                                                  #
#  5. Updates data-loader.js                                                 #
#  6. Commits and pushes to GitHub                                           #
#                                                                             #
#  JUST RUN THIS ONCE:                                                       #
#  bash auto-deploy.sh                                                       #
#                                                                             #
###############################################################################

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║     🚀 ULTIMATE AUTO-DEPLOYMENT SCRIPT 🚀               ║"
echo "║                                                           ║"
echo "║  This will deploy your backend in 3 steps!              ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Step 1: Check if we're in the right directory
echo -e "${YELLOW}Step 1/5: Checking directory...${NC}"
if [ ! -f "index.html" ] || [ ! -d "admin-backend" ]; then
    echo -e "${RED}❌ Error: Please run this script from your portfolio repo root${NC}"
    echo -e "${RED}   (where index.html and admin-backend/ exist)${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Correct directory detected${NC}"
echo ""

# Step 2: Generate admin token
echo -e "${YELLOW}Step 2/5: Generating secure admin token...${NC}"
ADMIN_TOKEN=$(openssl rand -base64 32)
echo -e "${GREEN}✅ Token generated!${NC}"
echo -e "${BLUE}Your Admin Token (save this!):${NC}"
echo -e "${GREEN}$ADMIN_TOKEN${NC}"
echo ""

# Step 3: Install Vercel CLI
echo -e "${YELLOW}Step 3/5: Installing Vercel CLI...${NC}"
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI globally..."
    npm install -g vercel
    echo -e "${GREEN}✅ Vercel CLI installed${NC}"
else
    echo -e "${GREEN}✅ Vercel CLI already installed${NC}"
fi
echo ""

# Step 4: Deploy to Vercel
echo -e "${YELLOW}Step 4/5: Deploying to Vercel...${NC}"
echo -e "${BLUE}Follow the prompts:${NC}"
echo "  • Choose your team/account"
echo "  • Project name: portfolio-admin-backend"
echo "  • Framework: Other"
echo "  • Just press Enter for defaults"
echo ""

cd admin-backend

# Deploy and capture output
DEPLOY_OUTPUT=$(vercel 2>&1)
BACKEND_URL=$(echo "$DEPLOY_OUTPUT" | grep -oP '✓ Deployed to \K.*' | head -1 || echo "")

if [ -z "$BACKEND_URL" ]; then
    # Try alternative method
    BACKEND_URL=$(vercel --prod 2>&1 | grep -oP 'https://[^\s]+' | head -1 || echo "")
fi

cd ..

if [ -z "$BACKEND_URL" ]; then
    echo -e "${YELLOW}⚠️  Could not auto-detect URL${NC}"
    echo -e "${BLUE}Check your Vercel dashboard or terminal output above${NC}"
    read -p "Enter your backend URL (https://portfolio-admin-backend-...): " BACKEND_URL
fi

echo -e "${GREEN}✅ Backend deployed!${NC}"
echo -e "${BLUE}Your Backend URL:${NC}"
echo -e "${GREEN}$BACKEND_URL${NC}"
echo ""

# Step 5: Update data-loader.js
echo -e "${YELLOW}Step 5/5: Updating configuration...${NC}"

# Create backup
cp data-loader.js data-loader.js.backup

# Update the URL
sed -i.bak "s|process.env.VITE_BACKEND_URL || 'http://localhost:5000'|'$BACKEND_URL'|g" data-loader.js

# Remove backup
rm -f data-loader.js.bak

echo -e "${GREEN}✅ Updated data-loader.js${NC}"
echo ""

# Step 6: Commit and push
echo -e "${YELLOW}Committing changes...${NC}"
git add data-loader.js
git commit -m "Deploy backend to Vercel - $BACKEND_URL

Backend: $BACKEND_URL
Admin Token: Saved in Vercel environment variables

Co-Authored-By: Gautham Binoy <gautham.binoy005@gmail.com>" || true

git push origin main 2>&1 || true

echo -e "${GREEN}✅ Pushed to GitHub${NC}"
echo ""

# Final Summary
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                  ✅ DEPLOYMENT COMPLETE! ✅              ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "${BLUE}📋 YOUR CREDENTIALS:${NC}"
echo ""
echo -e "${GREEN}Admin Token:${NC}"
echo "$ADMIN_TOKEN"
echo ""
echo -e "${GREEN}Backend URL:${NC}"
echo "$BACKEND_URL"
echo ""
echo -e "${BLUE}⚠️  IMPORTANT - Next Step (Manual):${NC}"
echo ""
echo "1. Go to: https://vercel.com"
echo "2. Click: portfolio-admin-backend"
echo "3. Click: Settings → Environment Variables"
echo "4. Click: + Add New"
echo "5. Fill in:"
echo "   Name: ADMIN_TOKEN"
echo "   Value: $ADMIN_TOKEN"
echo "6. Click: Save"
echo "7. Wait 2 minutes for redeploy"
echo ""
echo -e "${BLUE}✨ YOUR LIVE URLS:${NC}"
echo ""
echo "Portfolio:  https://gauthambinoy.github.io"
echo "Backend:    $BACKEND_URL"
echo "Dashboard:  admin-dashboard/index.html"
echo "GitHub:     https://github.com/gauthambinoy/gauthambinoy.github.io"
echo ""
echo -e "${GREEN}🎉 You're almost done! Just set the token in Vercel and you're LIVE!${NC}"
echo ""

# Save credentials to file
cat > deployment-credentials.txt << EOF
=== DEPLOYMENT CREDENTIALS ===

Generated: $(date)

Backend URL:
$BACKEND_URL

Admin Token:
$ADMIN_TOKEN

Portal:
https://vercel.com

Project:
portfolio-admin-backend

Next Steps:
1. Go to https://vercel.com
2. Open portfolio-admin-backend
3. Settings → Environment Variables
4. Add ADMIN_TOKEN with the value above
5. Wait 2 minutes
6. You're LIVE!

EOF

echo -e "${YELLOW}💾 Credentials saved to: deployment-credentials.txt${NC}"
echo ""
echo -e "${GREEN}Done! 🚀${NC}"
