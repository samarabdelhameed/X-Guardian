# X-Guardian Smart Contracts 🛡️

This directory contains the advanced smart contract architecture for **X-Guardian**, an autonomous DeFAI Portfolio Protector deployed on **X Layer**.

## Architecture Overview

The system follows a modular "Strategy Engine" design, inspired by enterprise-grade DeFi protocols and optimized for **Onchain OS AI Agents**.

- **Executor (`src/Executor.sol`)**: The central entry point. It inherits from `Multicall3` and provides a secure portal for the Onchain OS Agent to execute multiple actions in a single atomic transaction.
- **Multicall3 (`src/Multicall3.sol`)**: A standard utility for batching transactions, allowing the AI Agent to perform approvals and swaps together to save gas and time.
- **Strategies (`src/strategies/`)**: individual modular contracts containing specific risk-management logic. The core strategy is `XGuardianStrategy`.

## Deployment Information (X Layer)

- **Executor Address:** `0xd23eE223683071Bd1F357a312e9d6159148e7BBe`
- **XGuardianStrategy Address (Latest):** `0x54b8f113bfe164764d6bc3d0c9d966cd4fb83942`
- **Strategy Deploy Tx Hash:** `0x1fd429cf3679894f526b2e40f6cb221906b9b273bbaaa148dc4e269e06abdd59`
- **Agent Multicall Success Tx Hash:** `0x27c828b8f7359afa055e973f83b979a1ebb04cfc32ef185e4e21476f3c692994`
- **Network:** X Layer Testnet
- **RPC URL:** `https://testrpc.xlayer.tech`

## Security & Autonomy

- **Agentic Wallet Integration**: The `Executor` is protected by the `onlyAgent` modifier, ensuring that only the authorized **Onchain OS Agentic Wallet** can trigger portfolio-wide protective actions.
- **Atomic Operations**: By using the `Executor`, our AI Agent can monitor, approve, and swap assets in one block, preventing front-running and ensuring the portfolio remains protected at all times.

## Getting Started

### Prerequisites
- [Foundry](https://book.getfoundry.sh/getting-started/installation)

### Build
```bash
forge build
```

### Test
```bash
forge test
```

### Deploy
To deploy the Executor or new strategies:
```bash
source .env
forge create --rpc-url $X_LAYER_RPC_URL --private-key $PRIVATE_KEY src/Executor.sol:Executor --broadcast
```
