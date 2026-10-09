#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if command -v java >/dev/null 2>&1; then
    java CampusOSSetup.java --setup
    exit 0
fi

echo "[1/2] Installing frontend dependencies..."
cd campusos-frontend && npm install && cd ..

echo "[2/2] Compiling backend..."
cd campusos-backend && ./mvnw clean compile && cd ..

echo "CampusOS setup complete!"
