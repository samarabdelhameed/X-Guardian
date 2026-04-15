import { ethers } from "ethers";

export const runtime = "nodejs";

const RPC_URL = "https://testrpc.xlayer.tech";
const EXECUTOR_ADDRESS = "0xd23eE223683071Bd1F357a312e9d6159148e7BBe";

const EXECUTOR_ABI = [
  "event AgentExecutionCompleted(uint256 totalCalls)",
  "function agentWallet() view returns (address)"
];

const KNOWN_SUCCESS_TX_HASHES = [
  "0x08d99daf4f9e17368ff15db9c77b97597700fe70530081f4960f6cc5361bcb1d",
  "0x06ad3a11a69c3af1976523b39547f5bc4f9f3da51d45775fd59e759dda1b54d1",
  "0xa4b18c945c8940c5fb1c236b2f63ea35fa57c0a538f8e130b4bad92c24f5222d",
  "0xc4f3e1795bc6f1319da2af20f4af9e3ac92b06494c83b476f2a73c09753fc87b",
  "0x27c828b8f7359afa055e973f83b979a1ebb04cfc32ef185e4e21476f3c692994"
] as const;

type LlamaPool = { pool: string; chain: string; project: string; symbol: string; tvlUsd: number; apy: number; };
type PoolChartPoint = { timestamp: string; apy: number; tvlUsd: number };

const CACHE = {
  pools: null as { atMs: number; data: LlamaPool[] } | null,
  chartByPool: new Map<string, { atMs: number; data: PoolChartPoint[] }>(),
  onchain: null as { atMs: number; data: { chainId: string; blockNumber: number; agentWallet: string; latestTxHash: string | null } } | null
};

function nowMs() { return Date.now(); }

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { accept: "application/json" }, cache: "no-store" });
  if (!res.ok) throw new Error(`Fetch failed (${res.status}) for ${url}`);
  return (await res.json()) as T;
}

async function getChartCached(poolId: string): Promise<PoolChartPoint[]> {
  const ttlMs = 60_000;
  const cached = CACHE.chartByPool.get(poolId);
  if (cached && nowMs() - cached.atMs < ttlMs) return cached.data;
  const url = `https://yields.llama.fi/chart/${poolId}`;
  const response = await fetchJson<{ data: PoolChartPoint[] }>(url);
  const points = response?.data ?? [];
  CACHE.chartByPool.set(poolId, { atMs: nowMs(), data: points });
  return points;
}

async function resolveLatestExecutionTxHash(provider: ethers.JsonRpcProvider): Promise<string | null> {
  const topic = ethers.id("AgentExecutionCompleted(uint256)");
  const latest = await provider.getBlockNumber();
  let cursor = latest;
  for (let i = 0; i < 5; i += 1) {
    const fromBlock = Math.max(cursor - 99, 0);
    const logs = await provider.getLogs({ address: EXECUTOR_ADDRESS, topics: [topic], fromBlock, toBlock: cursor });
    if (logs.length > 0) return logs[logs.length - 1].transactionHash;
    if (fromBlock === 0) break;
    cursor = fromBlock - 1;
  }
  let best: { hash: string; blockNumber: number } | null = null;
  for (const hash of KNOWN_SUCCESS_TX_HASHES) {
    try {
      const r = await provider.getTransactionReceipt(hash);
      if (r && r.status === 1 && r.to?.toLowerCase() === EXECUTOR_ADDRESS.toLowerCase()) {
        const bn = Number(r.blockNumber);
        if (!best || bn > best.blockNumber) best = { hash, blockNumber: bn };
      }
    } catch {}
  }
  return best?.hash ?? null;
}

const BOOTSTRAP_STRATEGIES = [
  { name: "Morpho Guardian", risk: "Low", glow: "glow-border-blue", color: "#3b82f6", apy: 23.61, tvlUsd: 7670376, chain: "Ethereum", project: "morpho-v1", symbol: "AUGUSTAUSD", poolId: "a5d7ca22-f5d5-495b-a47f-3d9c42b962f5" },
  { name: "DeFAI Aggregator", risk: "High", glow: "glow-border-gold", color: "#fbbf24", apy: 99.11, tvlUsd: 23931352, chain: "BSC", project: "goldfinger", symbol: "ART", poolId: "00000000-0000-0000-0000-000000000000" },
  { name: "X-Layer Vault", risk: "Med", glow: "glow-border-green", color: "#22c55e", apy: 8.42, tvlUsd: 14260112, chain: "X Layer", project: "okx-vault", symbol: "USDC", poolId: "6475fb17-0097-400d-950c-e16e6f477983" }
];

export async function GET(req: Request) {
  try {
    const started = nowMs();
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const executor = new ethers.Contract(EXECUTOR_ADDRESS, EXECUTOR_ABI, provider);

    const onchain = await (async () => {
      if (CACHE.onchain && nowMs() - CACHE.onchain.atMs < 10_000) return CACHE.onchain.data;
      const [agentWallet, network, blockNumber, latestTxHash] = await Promise.all([
        executor.agentWallet() as Promise<string>,
        provider.getNetwork(),
        provider.getBlockNumber(),
        resolveLatestExecutionTxHash(provider)
      ]);
      const data = { chainId: network.chainId.toString(), blockNumber, agentWallet, latestTxHash };
      CACHE.onchain = { atMs: nowMs(), data };
      return data;
    })();

    const { searchParams } = new URL(req.url);
    const rangeParam = searchParams.get("range") ?? "1W";

    const chartCandidate = BOOTSTRAP_STRATEGIES[0];
    const allPoints = await getChartCached(chartCandidate.poolId);
    
    const points = allPoints.slice().sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const take = rangeParam === "1M" ? 30 : rangeParam === "ALL" ? points.length : 7;
    const sliced = points.slice(-take);

    return Response.json({
      ok: true,
      onchain,
      strategies: BOOTSTRAP_STRATEGIES,
      chart: {
        label: `${chartCandidate.project} • ${chartCandidate.symbol}`,
        poolId: chartCandidate.poolId,
        range: rangeParam,
        series: sliced.map(p => ({ ts: p.timestamp, apy: p.apy, tvlUsd: p.tvlUsd }))
      },
      dataSources: { yields: "DefiLlama Yields API", rpc: RPC_URL },
      latencyMs: nowMs() - started
    });
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : "Internal error" }, { status: 500 });
  }
}
