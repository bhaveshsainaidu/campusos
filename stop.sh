#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if command -v java >/dev/null 2>&1; then
    java CampusOSSetup.java --stop
    exit 0
fi

echo "Stopping backend (port 8080)..."
lsof -ti:8080 | xargs kill -9 2>/dev/null || true

echo "Stopping frontend (port 5173)..."
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

echo "CampusOS stopped."
