#!/usr/bin/env bash
# Copyright (c) 2024-2026 Ronan LE MEILLAT
# License: AGPL-3.0-or-later
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.
#
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
    echo "⚠️  $ENV_FILE is newer than dist/index.html — will rebuild."
    need_build=1
  fi
fi

# If any source/config files are newer than dist/index.html, rebuild
if [ -f "dist/index.html" ]; then
  if find src package.json vite.config.ts postcss.config.js tailwind.config.js -type f -newer dist/index.html -print -quit | grep -q .; then
    echo "⚠️  Source files changed since last build — will rebuild."
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
