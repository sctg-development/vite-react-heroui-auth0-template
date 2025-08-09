#!/bin/bash

# Reproducible build script for local development
# Uses the npm workaround to avoid Yarn workspaces resolution conflicts

set -e

echo "🔨 Reproducible build with npm workaround"
echo "=========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backup Yarn workspace files
echo -e "${YELLOW}💾 Backing up Yarn workspace files...${NC}"
if [ -f "package.json" ]; then
    mv package.json package.json.bak
fi
if [ -f "yarn.lock" ]; then
    mv yarn.lock yarn.lock.bak
fi

# Clean existing node_modules
echo -e "${YELLOW}🧹 Cleaning node_modules...${NC}"
rm -rf node_modules
rm -rf apps/client/node_modules 
rm -rf apps/cloudflare-worker/node_modules
rm -rf .turbo
rm -rf apps/client/.turbo
rm -rf apps/client/dist

# npm install in each app
echo -e "${YELLOW}📦 npm install in client...${NC}"
cd apps/client
npm install
cd ../../

echo -e "${YELLOW}📦 npm install in cloudflare-worker...${NC}"
cd apps/cloudflare-worker
npm install
cd ../../

# Restore Yarn files
echo -e "${YELLOW}🔄 Restoring Yarn files...${NC}"
if [ -f "package.json.bak" ]; then
    mv package.json.bak package.json
fi
if [ -f "yarn.lock.bak" ]; then
    mv yarn.lock.bak yarn.lock
fi

# Reinstall Yarn for Turborepo
echo -e "${YELLOW}⚡ Installing Yarn for Turborepo...${NC}"
corepack enable
yarn install

# Build client with environment
echo -e "${YELLOW}🔨 Building client...${NC}"
yarn build:client:env

# Check
if [ -d "apps/client/dist" ]; then
    echo -e "${GREEN}✅ Client build succeeded${NC}"
    
    # Check HeroUI styles
    echo -e "${YELLOW}🎨 Checking HeroUI styles...${NC}"
    if find apps/client/dist -name "*.css" -exec grep -l "rounded\|heroui" {} \; | grep -q .; then
        echo -e "${GREEN}✅ HeroUI styles detected${NC}"
    else
        echo -e "${RED}⚠️  HeroUI styles not detected${NC}"
    fi
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Reproducible build finished${NC}"
echo -e "${YELLOW}🚀 You can now run: yarn preview:client${NC}"
