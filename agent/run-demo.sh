#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# X-Guardian DeFAI Agent - Demo Runner
# OKX BuildX Hackathon - X Layer Arena
# ═══════════════════════════════════════════════════════════════

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   🚀 X-Guardian DeFAI Agent - Hackathon Demo            ║"
echo "║   Built for OKX BuildX - X Layer Arena Track             ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env file with your configuration."
    exit 1
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    pnpm install
    echo ""
fi

echo "🔍 Configuration Check:"
echo "   ✓ .env file found"
echo "   ✓ Dependencies installed"
echo ""

echo "🎬 Starting X-Guardian Autonomous Agent..."
echo "   This demo will generate legitimate transactions on X Layer"
echo "   Press Ctrl+C to stop the agent"
echo ""
echo "─────────────────────────────────────────────────────────────"
echo ""

# Run the agent
pnpm dev
