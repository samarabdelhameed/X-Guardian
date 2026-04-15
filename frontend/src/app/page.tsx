"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import { Sparkles, Zap, Shield, BarChart3, ArrowRight, Activity, RefreshCw, Play } from "lucide-react";

const RPC_URL = "https://testrpc.xlayer.tech";
const EXECUTOR_ADDRESS = "0xd23eE223683071Bd1F357a312e9d6159148e7BBe";
const STRATEGY_ADDRESS = "0x54b8f113bfe164764d6bc3d0c9d966cd4fb83942";
const X_LAYER_TESTNET_CHAIN_ID_HEX = "0x7a0";

const EXECUTOR_ABI = [
  "event AgentExecutionCompleted(uint256 totalCalls)",
  "function executeByAgent(tuple(address target, bool allowFailure, bytes callData)[] calls) external payable returns (tuple(bool success, bytes returnData)[])",
  "function agentWallet() view returns (address)"
];

const STRATEGY_ABI = [
  "function executeEmergencySwap(address tokenIn, address tokenOut, uint256 amount, string reason) external",
  "function agentOwner() view returns (address)",
  "function authorizedExecutor() view returns (address)"
];

type DashboardState = {
  chainId: bigint | null;
  blockNumber: number | null;
  agentWallet: string | null;
  agentOwner: string | null;
  authorizedExecutor: string | null;
  latestTxHash: string | null;
};

export default function Home() {
  const provider = useMemo(() => new ethers.JsonRpcProvider(RPC_URL), []);
  const [dashboard, setDashboard] = useState<DashboardState>({
    chainId: null,
    blockNumber: null,
    agentWallet: null,
    agentOwner: null,
    authorizedExecutor: null,
    latestTxHash: null
  });
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isCheckingAgent, setIsCheckingAgent] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mockPrice, setMockPrice] = useState<number>(24.3);

  const appendLog = useCallback((message: string) => {
    const now = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${now}] ${message}`, ...prev].slice(0, 12));
  }, []);

  const short = (value: string | null) => (value ? `${value.slice(0, 6)}...${value.slice(-4)}` : "—");

  const loadOnchainState = useCallback(async () => {
    setError(null);
    try {
      const executor = new ethers.Contract(EXECUTOR_ADDRESS, EXECUTOR_ABI, provider);
      const strategy = new ethers.Contract(STRATEGY_ADDRESS, STRATEGY_ABI, provider);

      const [network, blockNumber, agentWallet, agentOwner, authorizedExecutor] = await Promise.all([
        provider.getNetwork(),
        provider.getBlockNumber(),
        executor.agentWallet() as Promise<string>,
        strategy.agentOwner() as Promise<string>,
        strategy.authorizedExecutor() as Promise<string>
      ]);

      const eventTopic = ethers.id("AgentExecutionCompleted(uint256)");
      // X Layer RPC limits getLogs ranges; scan backward in 100-block windows.
      let latestTxHash: string | null = null;
      let cursorTo = blockNumber;
      for (let i = 0; i < 20; i += 1) {
        const fromBlock = Math.max(cursorTo - 99, 0);
        const logsResult = await provider.getLogs({
          address: EXECUTOR_ADDRESS,
          topics: [eventTopic],
          fromBlock,
          toBlock: cursorTo
        });
        if (logsResult.length > 0) {
          latestTxHash = logsResult[logsResult.length - 1].transactionHash;
          break;
        }
        if (fromBlock === 0) break;
        cursorTo = fromBlock - 1;
      }

      setDashboard({
        chainId: network.chainId,
        blockNumber,
        agentWallet,
        agentOwner,
        authorizedExecutor,
        latestTxHash
      });
      appendLog("On-chain state refreshed from X Layer.");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to load on-chain data.";
      setError(message);
      appendLog(`On-chain fetch failed: ${message}`);
    } finally {
      setIsLoading(false);
    }
  }, [appendLog, provider]);

  useEffect(() => {
    void loadOnchainState();
    const timer = setInterval(() => {
      void loadOnchainState();
    }, 15000);
    return () => clearInterval(timer);
  }, [loadOnchainState]);

  const runAgentHealthCheck = async () => {
    setIsCheckingAgent(true);
    appendLog("Running agent E2E health check...");
    try {
      const response = await fetch("/api/agent/e2e", { method: "POST" });
      const data = (await response.json()) as { ok: boolean; output?: string; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Agent check failed");
      }
      appendLog("Agent folder check passed.");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Agent check failed";
      appendLog(`Agent check error: ${message}`);
    } finally {
      setIsCheckingAgent(false);
    }
  };

  const executeEmergencyWithWallet = async () => {
    if (!window.ethereum) {
      appendLog("MetaMask not found.");
      return;
    }
    setIsExecuting(true);
    setError(null);
    try {
      const ethProvider = window.ethereum as ethers.Eip1193Provider & {
        request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      };

      // Ensure signer is on X Layer Testnet before sending tx.
      const currentChainId = (await ethProvider.request({ method: "eth_chainId" })) as string;
      if (currentChainId.toLowerCase() !== X_LAYER_TESTNET_CHAIN_ID_HEX) {
        appendLog(`Switching wallet network from ${currentChainId} to ${X_LAYER_TESTNET_CHAIN_ID_HEX}...`);
        try {
          await ethProvider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: X_LAYER_TESTNET_CHAIN_ID_HEX }]
          });
        } catch (switchError) {
          const code = (switchError as { code?: number }).code;
          if (code === 4902) {
            await ethProvider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: X_LAYER_TESTNET_CHAIN_ID_HEX,
                  chainName: "X Layer Testnet",
                  rpcUrls: [RPC_URL],
                  nativeCurrency: {
                    name: "OKB",
                    symbol: "OKB",
                    decimals: 18
                  },
                  blockExplorerUrls: ["https://www.oklink.com/xlayer-test"]
                }
              ]
            });
          } else {
            throw switchError;
          }
        }
      }

      const browserProvider = new ethers.BrowserProvider(ethProvider);
      const signer = await browserProvider.getSigner();
      const signerAddress = await signer.getAddress();
      appendLog(`Wallet connected: ${short(signerAddress)}`);

      const strategyInterface = new ethers.Interface(STRATEGY_ABI);
      const tokenIn = "0x1111111111111111111111111111111111111111";
      const tokenOut = "0x2222222222222222222222222222222222222222";
      const amount = ethers.parseEther("10");
      const reason = "Manual UI trigger: emergency protection test";
      const callData = strategyInterface.encodeFunctionData("executeEmergencySwap", [tokenIn, tokenOut, amount, reason]);

      const executor = new ethers.Contract(EXECUTOR_ADDRESS, EXECUTOR_ABI, signer);
      const tx = await (executor as ethers.Contract & {
        executeByAgent: (
          calls: Array<{ target: string; allowFailure: boolean; callData: string }>
        ) => Promise<ethers.ContractTransactionResponse>;
      }).executeByAgent([{ target: STRATEGY_ADDRESS, allowFailure: false, callData }]);

      appendLog(`Transaction sent: ${tx.hash}`);
      await tx.wait();
      appendLog("On-chain protection executed successfully.");
      setDashboard((prev) => ({ ...prev, latestTxHash: tx.hash }));
      setMockPrice((prev) => Math.max(8.25, prev - 2));
    } catch (e) {
      const anyErr = e as
        | (Error & {
            shortMessage?: string;
            info?: { error?: { message?: string } };
            cause?: unknown;
          })
        | unknown;

      const message =
        (typeof anyErr === "object" && anyErr && "shortMessage" in anyErr && typeof (anyErr as { shortMessage?: unknown }).shortMessage === "string"
          ? (anyErr as { shortMessage: string }).shortMessage
          : null) ??
        (typeof anyErr === "object" && anyErr && "message" in anyErr && typeof (anyErr as { message?: unknown }).message === "string"
          ? (anyErr as { message: string }).message
          : null) ??
        (typeof anyErr === "object" &&
        anyErr &&
        "info" in anyErr &&
        typeof (anyErr as { info?: { error?: { message?: unknown } } }).info?.error?.message === "string"
          ? (anyErr as { info: { error: { message: string } } }).info.error.message
          : null) ??
        "Wallet execution failed";

      setError(message);
      appendLog(`Execution failed: ${message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const simulateRadarStep = () => {
    const next = Number((Math.random() * 100).toFixed(2));
    setMockPrice(next);
    if (next < 20) {
      appendLog(`Danger detected at $${next}. Use Execute button to protect.`);
    } else {
      appendLog(`Market stable at $${next}.`);
    }
  };

  const handleSearch = async () => {
    const q = query.trim().toLowerCase();
    if (!q) {
      simulateRadarStep();
      return;
    }

    // Real actions (not simulated)
    if (q.includes("onchain") || q.includes("on-chain") || q.includes("status") || q.includes("latest tx")) {
      appendLog("Command recognized: Refresh on-chain state");
      await loadOnchainState();
      return;
    }

    if (q.includes("agent") && (q.includes("e2e") || q.includes("check") || q.includes("health"))) {
      appendLog("Command recognized: Run agent E2E check");
      await runAgentHealthCheck();
      return;
    }

    if (q.includes("execute") || q.includes("protect") || q.includes("emergency")) {
      appendLog("Command recognized: Execute protection (wallet)");
      await executeEmergencyWithWallet();
      return;
    }

    // Default: keep the demo radar behavior
    appendLog("AI analysis (demo): simulating market radar step");
    simulateRadarStep();
  };

  return (
    <div className="relative min-h-full flex flex-col items-center justify-center p-10">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-400/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Central Orb Animation */}
      <div className="relative mb-16">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-48 h-48 rounded-full border-2 border-dashed border-yellow-400/20 p-4"
        >
          <div className="w-full h-full rounded-full border border-yellow-400/10"></div>
        </motion.div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-32 h-32 bg-yellow-400/30 blur-3xl rounded-full"
          />
          <div className="absolute w-28 h-28 glass-panel flex items-center justify-center p-6 border-yellow-400/20">
             <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.3)]">
                <Sparkles size={40} className="text-black" />
             </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 space-y-4 mb-16"
      >
        <h1 className="text-6xl font-black tracking-tighter">
          Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">Guardian</span>
        </h1>
        <p className="text-gray-500 font-bold max-w-lg mx-auto text-lg leading-relaxed">
          Real integration dashboard: wallet, agent checks, and X Layer on-chain status.
        </p>
      </motion.div>

      {/* Magic Search Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl magic-input-container p-2 mb-20 group"
      >
        <div className="flex items-center gap-4 px-4 py-4">
           <Zap className="text-yellow-400" size={24} />
           <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type strategy note, then click arrow to simulate radar..."
            className="flex-1 bg-transparent border-none text-xl font-medium focus:outline-none placeholder:text-white/20 text-white"
           />
           <button
             onClick={() => void handleSearch()}
             className="bg-yellow-400 hover:bg-yellow-500 text-black p-3 rounded-2xl transition-all shadow-[0_0_20px_rgba(251,191,36,0.2)] active:scale-95"
           >
             <ArrowRight size={24} />
           </button>
        </div>
      </motion.div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => void loadOnchainState()}
          disabled={isLoading}
          className="glass-panel px-4 py-3 text-sm font-bold flex items-center justify-center gap-2 hover:border-yellow-400/30"
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin text-yellow-400" : "text-yellow-400"} />
          Refresh On-Chain
        </button>
        <button
          onClick={runAgentHealthCheck}
          disabled={isCheckingAgent}
          className="glass-panel px-4 py-3 text-sm font-bold flex items-center justify-center gap-2 hover:border-blue-400/30"
        >
          <Activity size={16} className="text-blue-400" />
          {isCheckingAgent ? "Checking Agent..." : "Run Agent E2E Check"}
        </button>
        <button
          onClick={executeEmergencyWithWallet}
          disabled={isExecuting}
          className="glass-panel px-4 py-3 text-sm font-bold flex items-center justify-center gap-2 hover:border-green-400/30"
        >
          <Play size={16} className="text-green-400" />
          {isExecuting ? "Executing..." : "Execute Protection (Wallet)"}
        </button>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
         <FeatureCard
          icon={<Shield className="text-orange-400" />}
          title="Agent Wallet"
          desc={short(dashboard.agentWallet)}
          glow="glow-border-gold"
         />
         <FeatureCard
          icon={<Zap className="text-blue-400" />}
          title="Strategy Owner"
          desc={short(dashboard.agentOwner)}
          glow="glow-border-blue"
         />
         <FeatureCard
          icon={<BarChart3 className="text-green-400" />}
          title="Authorized Executor"
          desc={short(dashboard.authorizedExecutor)}
          glow="glow-border-green"
         />
      </div>

      <div className="w-full max-w-5xl mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h3 className="text-lg font-black mb-3">Live X Layer Snapshot</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p>Chain ID: <span className="text-white font-mono">{dashboard.chainId?.toString() ?? "—"}</span></p>
            <p>Block Number: <span className="text-white font-mono">{dashboard.blockNumber ?? "—"}</span></p>
            <p>Current Simulated Price: <span className={`${mockPrice < 20 ? "text-red-400" : "text-emerald-400"} font-bold`}>${mockPrice.toFixed(2)}</span></p>
            <p className="break-all">
              Latest Tx:
              {" "}
              {dashboard.latestTxHash ? (
                <a
                  href={`https://www.oklink.com/xlayer-test/tx/${dashboard.latestTxHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-yellow-400 hover:underline font-mono"
                >
                  {dashboard.latestTxHash}
                </a>
              ) : (
                <span className="text-gray-500">No tx yet</span>
              )}
            </p>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-lg font-black mb-3">Live Execution Logs</h3>
          <div className="space-y-2 text-xs font-mono text-gray-300 max-h-48 overflow-y-auto">
            {error ? <p className="text-red-400">{error}</p> : null}
            {logs.length === 0 ? <p className="text-gray-500">No logs yet. Click actions above.</p> : null}
            {logs.map((line) => (
              <p key={line} className="break-words">{line}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl mt-8 glass-panel p-6">
        <h3 className="text-lg font-black mb-4">How it works</h3>
        <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
          <p>
            1) Select your preferred DeFi strategy (Low, Medium, or High risk), or let the AI guide you.
            It&apos;s simple to use.
          </p>
          <p>
            2) Ask any questions related to these DeFi strategies. Get the latest information and receive
            real-time responses.
          </p>
          <p>
            3) Sign once. Our DeFAI system takes care of the execution.
          </p>
          <p>
            4) Track and optimize - The AI continuously adjusts strategies based on market conditions.
          </p>
          <p className="pt-2 text-gray-200">
            Built for both power users and DeFi newcomers, this is the next-generation way to deploy
            capital-smart, automated, and effortless.
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, glow }: { icon: React.ReactNode, title: string, desc: string, glow: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10, scale: 1.02 }}
      className={`glass-panel p-8 text-center bg-[#0a0a0a]/80 ${glow} cursor-pointer group transition-all duration-300`}
    >
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-white/10 transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-black mb-2">{title}</h3>
      <p className="text-[10px] text-gray-500 font-bold leading-relaxed uppercase tracking-wider">{desc}</p>
    </motion.div>
  );
}
