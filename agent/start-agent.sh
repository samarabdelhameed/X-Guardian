#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# X-Guardian DeFAI Agent Launcher
# OKX BuildX Hackathon - X Layer Arena Track
# ═══════════════════════════════════════════════════════════════

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  🚀 Starting X-Guardian Autonomous Agent                     ║"
echo "║  OKX BuildX Hackathon - Most Active Agent Track              ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy .env.example to .env and configure your credentials."
    exit 1
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    pnpm install
fi

# Build TypeScript
echo "🔨 Building TypeScript..."
pnpm build

# Start the agent
echo "🎯 Launching autonomous agent..."
echo ""
pnpm dev
