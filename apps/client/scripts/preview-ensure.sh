#!/usr/bin/env bash
set -euo pipefail

# Ensure we run from the package root (apps/client)
cd "$(dirname "$0")/.."

ENV_FILE="../../.env"

# Ensure .env exists
if [ ! -f "$ENV_FILE" ]; then
  echo "⚠️  .env not found at $ENV_FILE — create it with AUTH0_DOMAIN and other vars before previewing."
  exit 1
fi

# Load env to check AUTH0_DOMAIN
set -a; source "$ENV_FILE"; set +a
if [ -z "${AUTH0_DOMAIN:-}" ]; then
  echo "⚠️  AUTH0_DOMAIN not set in $ENV_FILE — set it before previewing."
  exit 1
fi

# Decide whether we need to build
need_build=0
if [ ! -d "dist" ]; then
  need_build=1
fi

# If .env is newer than an artifact, rebuild
if [ -f "$ENV_FILE" ] && [ -f "dist/index.html" ]; then
  if [ "$ENV_FILE" -nt "dist/index.html" ]; then
    need_build=1
  fi
fi

# If dist contains an undefined domain, rebuild
if [ -d "dist" ]; then
  if grep -R "https://undefined" dist >/dev/null 2>&1; then
    echo "⚠️  Found https://undefined in built artifacts — will rebuild."
    need_build=1
  fi
fi

if [ "$need_build" -eq 1 ]; then
  echo "🔨 Building client with environment..."
  yarn build:env
else
  echo "✅ Build up-to-date and looks good; skipping build."
fi

# Start preview with env loaded
set -a; source "$ENV_FILE"; set +a
echo "⚡ Starting vite preview with AUTH0_DOMAIN=${AUTH0_DOMAIN}"
vite preview --port 5173
