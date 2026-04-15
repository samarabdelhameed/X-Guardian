import { ethers } from "ethers";

export const runtime = "nodejs";

const RPC_URL = "https://testrpc.xlayer.tech";
const EXECUTOR_ADDRESS = "0xd23eE223683071Bd1F357a312e9d6159148e7BBe";

const EXECUTOR_ABI = [
  "event AgentExecutionCompleted(uint256 totalCalls)",
  "function agentWallet() view returns (address)"
];

type LlamaPool = {
  pool: string;
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number;
};

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { "accept": "application/json" },
    // keep demo snappy; safe to revalidate frequently
    cache: "no-store"
  });
  if (!res.ok) {
    throw new Error(`Fetch failed (${res.status}) for ${url}`);
  }
  return (await res.json()) as T;
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
  return null;
}

export async function GET() {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const executor = new ethers.Contract(EXECUTOR_ADDRESS, EXECUTOR_ABI, provider);

    const [{ data }, agentWallet, network, blockNumber, latestTxHash] = await Promise.all([
      fetchJson<{ data: LlamaPool[] }>("https://yields.llama.fi/pools"),
      executor.agentWallet() as Promise<string>,
      provider.getNetwork(),
      provider.getBlockNumber(),
      resolveLatestExecutionTxHash(provider)
    ]);

    const pools = data ?? [];

    const morpho = pickPool(pools, (p) => p.project.toLowerCase().includes("morpho"));
    const stable = pickPool(pools, (p) => /usdc|usdt|dai/i.test(p.symbol));
    const top = pickPool(pools, (p) => true);

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

    return Response.json({
      ok: true,
      onchain: {
        chainId: network.chainId.toString(),
        blockNumber,
        agentWallet,
        latestTxHash
      },
      strategies,
      dataSources: {
        yields: "DefiLlama Yields API",
        rpc: RPC_URL
      }
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load strategy data";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}

