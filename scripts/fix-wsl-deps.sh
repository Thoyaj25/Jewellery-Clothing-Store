#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."
rm -rf node_modules package-lock.json
npm install
