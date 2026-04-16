# ⚡ Quick Start Guide - X-Guardian Agent

## 🚀 Run the Agent in 3 Steps

### Step 1: Navigate to Agent Directory
```bash
cd agent
```

### Step 2: Install Dependencies (if not already installed)
```bash
pnpm install
```

### Step 3: Run the Agent
```bash
pnpm dev
```

**Or use the demo script:**
```bash
./run-demo.sh
```

---

## 📊 What You'll See

The agent will start and display:

```
╔═══════════════════════════════════════════════════════════╗
║   🚀 X-Guardian DeFAI Agent - Onchain OS Integration     ║
║   Built for OKX BuildX Hackathon - X Layer Arena         ║
╚═══════════════════════════════════════════════════════════╝
🔗 Network: X Layer Testnet
🤖 Agentic Wallet: 0x7849a3eccFb9FFAeCD01e10004bFA2493Cc9d7E4
⚙️  Executor Contract: 0xd23eE223683071Bd1F357a312e9d6159148e7BBe
🛡️  Strategy Contract: 0x54b8f113bfe164764d6bc3d0c9d966cd4fb83942
🔐 Onchain OS API: Connected ✓

🤖 [Autonomous Agent] Starting continuous market monitoring...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️  Cycle #1 | Runtime: 8s | Txns: 0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 [Onchain OS Market API] Fetching real-time data for OKB/USDT...
   💰 Price: $45.23
   📈 Volatility: 35.7%
   💧 Liquidity: $4.5M

✅ [MARKET STABLE] No action required.
   💚 Price: $45.23 (Safe)
   💚 Volatility: 35.7% (Normal)
```

---

## 🎯 Agent Behavior

### Monitoring Cycle (Every 8 seconds)
1. Fetch market data from Onchain OS API
2. Assess risk based on:
   - **Price threshold**: < $30 triggers action
   - **Volatility threshold**: > 70% triggers action
3. Execute emergency swap if risk detected
4. Continue monitoring

### When Risk is Detected

You'll see:
```
⚠️  [RISK DETECTED] Triggering autonomous protection mechanism...
   📉 Price Alert: $24.50 < $30
   🌊 Volatility Alert: 75.3% > 70%

🔧 [Transaction Builder] Encoding Multicall parameters...
🔐 [TEE Wallet] Signing transaction securely via Agentic Wallet...
⏳ [X Layer Network] Transaction broadcasted!
   🔗 Tx Hash: 0x1234567890abcdef...

⏰ [Blockchain] Waiting for confirmation...

🎉 [SUCCESS] DeFAI Multicall executed successfully!
   ✅ Block: 123456
   ✅ Status: Confirmed
   ✅ Gas Used: 150000
   🔍 Explorer: https://www.okx.com/web3/explorer/xlayer-test/tx/0x...
```

---

## 🔍 Verify Transactions

Copy any transaction hash from the output and verify on X Layer Explorer:

```
https://www.okx.com/web3/explorer/xlayer-test/tx/{PASTE_TX_HASH_HERE}
```

---

## ⏹️ Stop the Agent

Press `Ctrl+C` in the terminal to stop the agent.

---

## 🎥 For Demo Video Recording

1. **Clear terminal**: `clear`
2. **Start recording** your screen
3. **Run agent**: `./run-demo.sh`
4. **Let it run** for 2-3 cycles (show at least 1 transaction)
5. **Copy transaction hash** when it appears
6. **Open browser** and verify on X Layer Explorer
7. **Stop recording**

---

## 📋 Troubleshooting

### Error: "Cannot find module 'ethers'"
```bash
cd agent
pnpm install
```

### Error: "PRIVATE_KEY is not defined"
Check that `agent/.env` file exists and contains:
```env
PRIVATE_KEY=7b34b30ef6aa553ce0317de5a990a9cb5393c247971cc4c9a1e4458bfc0bdbe6
```

### Error: "Connection refused"
Check that X Layer RPC URL is correct in `.env`:
```env
X_LAYER_RPC_URL=https://testrpc.xlayer.tech
```

### Transaction Fails
This is normal in demo mode. The agent will continue monitoring and try again.

---

## 📚 More Information

- **Full Documentation**: See `agent/README.md`
- **Hackathon Submission**: See `HACKATHON_SUBMISSION.md`
- **Demo Script**: See `DEMO_SCRIPT.md`
- **Architecture**: See `ARCHITECTURE.md`

---

## 🏆 Hackathon Submission

This agent is built for:
- **OKX BuildX Hackathon**
- **Track**: X Layer Arena
- **Target**: 1st Place (2,000 USDT) + Most Active Agent (500 USDT)

---

**Ready to win! 🚀**
