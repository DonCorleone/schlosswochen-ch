#!/bin/bash

# Post-build script for Netlify-compatible Angular SSR setup
# Netlify handles SSR automatically, but we need index.html for local dev

DIST_DIR="dist/schlosswochen-ch"
BROWSER_DIR="$DIST_DIR/browser"
CSR_INDEX="$BROWSER_DIR/index.csr.html"
ROOT_INDEX="$BROWSER_DIR/index.html"

# Check if CSR index exists (SSR without prerendering)
if [ -f "$CSR_INDEX" ]; then
    echo "Copying index.csr.html to index.html for local development..."
    cp "$CSR_INDEX" "$ROOT_INDEX"
    echo "✅ Local development setup complete!"
    echo "ℹ️  Note: Netlify will handle SSR automatically in production"
else
    echo "⚠️  No index.csr.html found at $CSR_INDEX"
    echo "   This might be expected for different build configurations."
fi
