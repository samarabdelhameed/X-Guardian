# X-Guardian Smart Contracts 🛡️

This directory contains the core smart contracts for the X-Guardian DeFAI project, deployed on **X Layer**.

## Deployment Information (X Layer Testnet)

- **Contract Name:** `XGuardianStrategy`
- **Contract Address:** `0xD68A56A8d2e37AB7513F0bF5e23d053AD1E892E9`
- **Transaction Hash:** `0xd04bf5f5d1696fea114f28c75dd790b17ee1366306c13bfa2554498e381e882c`
- **Network:** X Layer Testnet
- **RPC URL:** `https://testrpc.xlayer.tech`

## Strategy Logic
The `XGuardianStrategy` contract acts as an autonomous gateway. It is designed to be executed by an authorized AI Agent via Onchain OS to:
1. Monitor asset risks.
2. Execute emergency swaps (e.g., volatile tokens to stablecoins) when high risk is detected.
3. Record all AI-driven interventions on-chain for transparency.

## How to Build
```bash
forge build
```

## How to Test
```bash
forge test
```
