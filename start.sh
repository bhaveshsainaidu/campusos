#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "============================================================================="
echo "  CampusOS - Enterprise Campus Management Operating System"
echo "============================================================================="

if command -v java >/dev/null 2>&1; then
    java CampusOSSetup.java --start
    exit 0
fi

echo "[ERROR] Java 17+ is required. Please install Java and try again."
exit 1
