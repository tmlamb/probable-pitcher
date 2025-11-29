#!/usr/bin/env sh
set -eu

quit() {
  # best-effort; don't fail the container for a curl error
  curl -sf http://localhost:9091/quitquitquit || true
}
trap quit EXIT

# Initialize the database
psql "$DATABASE_URL" -f init.sql
# Push drizzle schema
pnpm push
