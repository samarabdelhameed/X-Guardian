# X-Guardian Agent

TypeScript autonomous agent for X-Guardian, designed to monitor market risk signals and execute protection actions through the deployed `Executor` contract on X Layer Testnet.

## What This Agent Does

- Connects to X Layer RPC using `ethers@6`
- Monitors market data in a timed loop (simulated source for demo mode)
- Encodes strategy call data for `executeEmergencySwap(...)`
- Sends batched execution to `Executor.executeByAgent(...)`
- Waits for confirmation and exits after successful protection execution

## Tech Stack

- Node.js + TypeScript
- `ethers` v6
- `dotenv`
- `ts-node`

## Project Files

- `index.ts`: main autonomous runtime logic
- `.env`: agent runtime environment variables (local only, never commit secrets)
- `tsconfig.json`: TypeScript config with `outDir=dist`
- `package.json`: dev/start/test:e2e scripts

## Required Environment Variables

Create `agent/.env` with:

```env
ONCHAIN_OS_API_KEY=...
ONCHAIN_OS_API_SECRET=...
X_GUARDIAN_CONTRACT_ADDRESS=0x54b8f113bfe164764d6bc3d0c9d966cd4fb83942
EXECUTOR_CONTRACT_ADDRESS=0xd23eE223683071Bd1F357a312e9d6159148e7BBe
AGENT_PRIVATE_KEY=...
X_LAYER_RPC_URL=https://testrpc.xlayer.tech
```

Notes:
- Keep `AGENT_PRIVATE_KEY` private.
- If `AGENT_PRIVATE_KEY` is a placeholder, runtime will fail (expected behavior).

## Scripts

From `agent/`:

```bash
pnpm install
pnpm run dev
pnpm run start
pnpm run test:e2e
```

- `dev`: runs directly with `ts-node`
- `start`: compiles to `dist/` then runs compiled JS
- `test:e2e`: smoke command placeholder used in QA flow

## Real Runtime Validation (X Layer Testnet)

The agent has been executed end-to-end with real on-chain transactions through the deployed `Executor`.

- Dev run tx: `0x06ad3a11a69c3af1976523b39547f5bc4f9f3da51d45775fd59e759dda1b54d1`
- Start run tx: `0xa4b18c945c8940c5fb1c236b2f63ea35fa57c0a538f8e130b4bad92c24f5222d`

Both receipts are `status=1` and include:
- `EmergencyProtectionExecuted` event (strategy)
- `AgentExecutionCompleted` event (executor)

## Security Notes

- Do not expose `.env` values in logs, screenshots, or commits.
- Use a dedicated low-balance wallet for testnet demos.
- Rotate API keys/private keys if they were shared anywhere publicly.
