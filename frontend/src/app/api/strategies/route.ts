import { ethers } from "ethers";

export const runtime = "nodejs";

const RPC_URL = "https://testrpc.xlayer.tech";
const EXECUTOR_ADDRESS = "0xd23eE223683071Bd1F357a312e9d6159148e7BBe";

const EXECUTOR_ABI = [
  "event AgentExecutionCompleted(uint256 totalCalls)",
  "function agentWallet() view returns (address)"
];

// Known successful tx hashes from this project (verified previously).
// Used as a fallback when RPC log-range limits prevent finding older events.
const KNOWN_SUCCESS_TX_HASHES = [
  "0x08d99daf4f9e17368ff15db9c77b97597700fe70530081f4960f6cc5361bcb1d",
  "0x06ad3a11a69c3af1976523b39547f5bc4f9f3da51d45775fd59e759dda1b54d1",
  "0xa4b18c945c8940c5fb1c236b2f63ea35fa57c0a538f8e130b4bad92c24f5222d",
  "0xc4f3e1795bc6f1319da2af20f4af9e3ac92b06494c83b476f2a73c09753fc87b",
  "0x27c828b8f7359afa055e973f83b979a1ebb04cfc32ef185e4e21476f3c692994"
] as const;

type LlamaPool = {
  pool: string;
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number;
};

type PoolChartPoint = { timestamp: string; apy: number; tvlUsd: number };

const CACHE = {
  pools: null as { atMs: number; data: LlamaPool[] } | null,
  chartByPool: new Map<string, { atMs: number; data: PoolChartPoint[] }>(),
  onchain: null as { atMs: number; data: { chainId: string; blockNumber: number; agentWallet: string; latestTxHash: string | null } } | null
};

function nowMs() {
  return Date.now();
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { accept: "application/json" },
    // This is an API route; use our own in-memory caching.
    cache: "no-store"
  });
  if (!res.ok) throw new Error(`Fetch failed (${res.status}) for ${url}`);
  return (await res.json()) as T;
}

async function getPoolsCached(): Promise<LlamaPool[]> {
  const ttlMs = 5 * 60_000;
  if (CACHE.pools && nowMs() - CACHE.pools.atMs < ttlMs) return CACHE.pools.data;
  const { data } = await fetchJson<{ data: LlamaPool[] }>("https://yields.llama.fi/pools");
  const pools = data ?? [];
  CACHE.pools = { atMs: nowMs(), data: pools };
  return pools;
}

async function getChartCached(poolId: string): Promise<PoolChartPoint[]> {
  const ttlMs = 60_000;
  const cached = CACHE.chartByPool.get(poolId);
  if (cached && nowMs() - cached.atMs < ttlMs) return cached.data;
  const points = await fetchJson<PoolChartPoint[]>(`https://api.llama.fi/chart/${poolId}`);
  CACHE.chartByPool.set(poolId, { atMs: nowMs(), data: points ?? [] });
  return points ?? [];
}

function pickPool(pools: LlamaPool[], predicate: (p: LlamaPool) => boolean): LlamaPool | null {
  const filtered = pools
    // Remove obvious outliers so the demo looks professional and realistic.
    .filter((p) => Number.isFinite(p.apy) && p.apy > 0 && p.apy < 100)
    .filter((p) => Number.isFinite(p.tvlUsd) && p.tvlUsd > 1_000_000)
    .filter(predicate)
    .sort((a, b) => b.apy - a.apy);
  return filtered[0] ?? null;
}

async function resolveLatestExecutionTxHash(provider: ethers.JsonRpcProvider): Promise<string | null> {
  const topic = ethers.id("AgentExecutionCompleted(uint256)");
  const latest = await provider.getBlockNumber();

  // scan backwards in 100-block windows (RPC limitation)
  let cursor = latest;
  for (let i = 0; i < 30; i += 1) {
    const fromBlock = Math.max(cursor - 99, 0);
    const logs = await provider.getLogs({
      address: EXECUTOR_ADDRESS,
      topics: [topic],
      fromBlock,
      toBlock: cursor
    });
    if (logs.length > 0) return logs[logs.length - 1].transactionHash;
    if (fromBlock === 0) break;
    cursor = fromBlock - 1;
  }

  // Fallback: resolve the most recent receipt among known successful tx hashes.
  // This keeps the UI truthful even when older logs are inaccessible via RPC range limits.
  let best: { hash: string; blockNumber: number } | null = null;
  for (const hash of KNOWN_SUCCESS_TX_HASHES) {
    try {
      const r = await provider.getTransactionReceipt(hash);
      if (!r) continue;
      if (r.status !== 1) continue;
      if (!r.to) continue;
      if (r.to.toLowerCase() !== EXECUTOR_ADDRESS.toLowerCase()) continue;
      const bn = Number(r.blockNumber);
      if (!Number.isFinite(bn)) continue;
      if (!best || bn > best.blockNumber) best = { hash, blockNumber: bn };
    } catch {
      // ignore individual failures
    }
  }

  return best?.hash ?? null;
}

export async function GET() {
  try {
    const started = nowMs();
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const executor = new ethers.Contract(EXECUTOR_ADDRESS, EXECUTOR_ABI, provider);

    // On-chain is cheap but we still cache briefly to avoid RPC hammering on refresh spam.
    const onchainTtlMs = 10_000;
    const onchain =
      CACHE.onchain && nowMs() - CACHE.onchain.atMs < onchainTtlMs
        ? CACHE.onchain.data
        : await (async () => {
            const [agentWallet, network, blockNumber, latestTxHash] = await Promise.all([
              executor.agentWallet() as Promise<string>,
              provider.getNetwork(),
              provider.getBlockNumber(),
              resolveLatestExecutionTxHash(provider)
            ]);
            const data = {
              chainId: network.chainId.toString(),
              blockNumber,
              agentWallet,
              latestTxHash
            };
            CACHE.onchain = { atMs: nowMs(), data };
            return data;
          })();

    const pools = await getPoolsCached();

    const morpho = pickPool(pools, (p) => p.project.toLowerCase().includes("morpho"));
    const stable = pickPool(pools, (p) => /usdc|usdt|dai/i.test(p.symbol));
    const top = pickPool(pools, () => true);

    const strategies = [
      {
        name: "Morpho Guardian",
        risk: "Low",
        glow: "glow-border-blue",
        color: "#3b82f6",
        source: morpho
      },
      {
        name: "DeFAI Aggregator",
        risk: "High",
        glow: "glow-border-gold",
        color: "#fbbf24",
        source: top
      },
      {
        name: "X-Layer Vault",
        risk: "Med",
        glow: "glow-border-green",
        color: "#22c55e",
        source: stable
      }
    ].map((s) => ({
      name: s.name,
      risk: s.risk,
      glow: s.glow,
      color: s.color,
      apy: s.source ? s.source.apy : null,
      tvlUsd: s.source ? s.source.tvlUsd : null,
      chain: s.source ? s.source.chain : null,
      project: s.source ? s.source.project : null,
      symbol: s.source ? s.source.symbol : null,
      poolId: s.source ? s.source.pool : null
    }));

    // Pick a "headline" pool for the big chart (highest TVL among our three).
    const chartCandidate =
      strategies
        .filter((s) => typeof s.tvlUsd === "number" && typeof s.poolId === "string")
        .sort((a, b) => (b.tvlUsd ?? 0) - (a.tvlUsd ?? 0))[0] ?? null;

    // Range is passed via querystring (?range=1W|1M|ALL)
    // Default: 1W.
    const reqUrl = new URL((globalThis as unknown as { request?: { url?: string } }).request?.url ?? "http://localhost");
    const rangeParam = reqUrl.searchParams.get("range") ?? "1W";

    const allPoints =
      chartCandidate?.poolId ? await getChartCached(chartCandidate.poolId) : [];

    const points = allPoints
      .slice()
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const take =
      rangeParam === "1M" ? 30 : rangeParam === "ALL" ? points.length : 7;

    const sliced = points.length > 0 ? points.slice(-take) : [];

    const apySeries = sliced.map((p) => ({
      ts: p.timestamp,
      apy: p.apy,
      tvlUsd: p.tvlUsd
    }));

    return Response.json({
      ok: true,
      onchain,
      strategies,
      chart: {
        label: chartCandidate ? `${chartCandidate.project} • ${chartCandidate.symbol}` : "No chart source",
        poolId: chartCandidate?.poolId ?? null,
        range: rangeParam,
        series: apySeries
      },
      dataSources: {
        yields: "DefiLlama Yields API",
        rpc: RPC_URL
      },
      latencyMs: nowMs() - started
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load strategy data";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}

