"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MessageSquare, RefreshCw } from "lucide-react";
import StrategyCard from "@/components/StrategyCard";
import InvestModal from "@/components/InvestModal";
import SuccessToast from "@/components/SuccessToast";
import { ethers } from "ethers";

const EXECUTOR_ADDRESS = "0xd23eE223683071Bd1F357a312e9d6159148e7BBe";
const STRATEGY_ADDRESS = "0x54b8f113bfe164764d6bc3d0c9d966cd4fb83942";

const EXECUTOR_ABI = [
  "function executeByAgent(tuple(address target, bool allowFailure, bytes callData)[] calls) external payable returns (tuple(bool success, bytes returnData)[])"
];

const STRATEGY_ABI = [
  "function executeEmergencySwap(address tokenIn, address tokenOut, uint256 amount, string reason) external",
  "function agentOwner() view returns (address)",
  "function authorizedExecutor() view returns (address)"
];

type Strategy = {
  id: string;
  name: string;
  protocol: string;
  apy: string;
  risk: "Low" | "Medium" | "High";
  icon: string;
  color: string;
  description: string;
  tokenIn: string;
  tokenOut: string;
};

const STRATEGIES: Strategy[] = [
  {
    id: "morpho",
    name: "Morpho Lending Strategy",
    protocol: "Morpho",
    apy: "2.4%",
    risk: "Low",
    icon: "⚪",
    color: "#3b82f6",
    description: "Lending protocol that allows anyone to deposit and earn yield. Learn More",
    tokenIn: "USDC",
    tokenOut: "BASE"
  },
  {
    id: "compound",
    name: "Compound Yield",
    protocol: "Compound",
    apy: "3.9%",
    risk: "High",
    icon: "⚪",
    color: "#10b981",
    description: "A decentralized lending platform where anyone can deposit assets to earn passive income. Learn More",
    tokenIn: "USDC",
    tokenOut: "ETH"
  },
  {
    id: "aave",
    name: "AAVE Lending Strategy",
    protocol: "AAVE",
    apy: "10%",
    risk: "Medium",
    icon: "🟡",
    color: "#f59e0b",
    description: "Earn yield effortlessly by depositing into our open lending protocol—accessible to everyone. Learn More",
    tokenIn: "USDC",
    tokenOut: "AAVE"
  },
  {
    id: "atcelo",
    name: "atCelo",
    protocol: "atCelo",
    apy: "2%",
    risk: "Low",
    icon: "🟡",
    color: "#eab308",
    description: "Liquid staking protocol that allows anyone to deposit and earn yield. Learn More",
    tokenIn: "CELO",
    tokenOut: "atCELO"
  },
  {
    id: "ankr",
    name: "Ankr Flow",
    protocol: "ankrFlow",
    apy: "3.8%",
    risk: "Low",
    icon: "🟢",
    color: "#06b6d4",
    description: "Liquid staking protocol that allows anyone to deposit and earn yield. Learn More",
    tokenIn: "FLOW",
    tokenOut: "ankrFLOW"
  },
  {
    id: "kitty",
    name: "Kitty",
    protocol: "Kitty",
    apy: "4.3%",
    risk: "Medium",
    icon: "🟢",
    color: "#8b5cf6",
    description: "Stable coin swapping protocol that allows anyone to deposit and earn yield. Learn More",
    tokenIn: "USDC",
    tokenOut: "DAI"
  },
  {
    id: "flow",
    name: "Flow Yield",
    protocol: "Flow",
    apy: "23%",
    risk: "High",
    icon: "🟢",
    color: "#ec4899",
    description: "Permissionless yield-flow tokens let you earn both liquid staking rewards and swap fees. Learn More",
    tokenIn: "FLOW",
    tokenOut: "stFLOW"
  }
];

export default function InvestPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<"All" | "Low" | "Medium" | "High">("All");
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState<{ message: string; txHash?: string }>({
    message: ""
  });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredStrategies = STRATEGIES.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.protocol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === "All" || s.risk === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const handleInvest = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetch("/api/strategies?range=1W");
      setTimeout(() => setIsRefreshing(false), 1000);
    } catch {
      setIsRefreshing(false);
    }
  };

  const handleConfirmInvest = async (): Promise<string> => {
    if (!selectedStrategy) throw new Error("No strategy selected");
    if (!window.ethereum) throw new Error("MetaMask not found");

    const ethProvider = window.ethereum as ethers.Eip1193Provider & {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };

    // Step 1: Ensure user is on X Layer Testnet
    const X_LAYER_TESTNET_CHAIN_ID_HEX = "0x7a0";
    const currentChainId = (await ethProvider.request({ method: "eth_chainId" })) as string;
    
    if (currentChainId.toLowerCase() !== X_LAYER_TESTNET_CHAIN_ID_HEX) {
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
                rpcUrls: ["https://testrpc.xlayer.tech"],
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

    // Step 2: Get signer and validate
    const browserProvider = new ethers.BrowserProvider(ethProvider);
    const signer = await browserProvider.getSigner();
    const signerAddress = await signer.getAddress();

    // Step 3: Validate contracts
    const executor = new ethers.Contract(EXECUTOR_ADDRESS, EXECUTOR_ABI, signer);
    const strategy = new ethers.Contract(STRATEGY_ADDRESS, STRATEGY_ABI, signer);

    const [agentOwner, authorizedExecutor] = await Promise.all([
      strategy.agentOwner() as Promise<string>,
      strategy.authorizedExecutor() as Promise<string>
    ]);

    console.log("✅ Contract validation:", {
      signerAddress,
      agentOwner,
      authorizedExecutor,
      executorAddress: EXECUTOR_ADDRESS
    });

    // Step 4: Encode strategy call
    const strategyInterface = new ethers.Interface(STRATEGY_ABI);
    const tokenIn = "0x1111111111111111111111111111111111111111";
    const tokenOut = "0x2222222222222222222222222222222222222222";
    const amount = ethers.parseEther("10");
    const reason = `Investment in ${selectedStrategy.name} (${selectedStrategy.protocol}) via X-Guardian UI - Risk: ${selectedStrategy.risk}`;

    const callData = strategyInterface.encodeFunctionData("executeEmergencySwap", [
      tokenIn,
      tokenOut,
      amount,
      reason
    ]);

    // Step 5: Execute via Executor (Multicall)
    const tx = await (executor as ethers.Contract & {
      executeByAgent: (
        calls: Array<{ target: string; allowFailure: boolean; callData: string }>
      ) => Promise<ethers.ContractTransactionResponse>;
    }).executeByAgent([{ target: STRATEGY_ADDRESS, allowFailure: false, callData }]);

    console.log("📤 Transaction sent:", tx.hash);

    // Step 6: Wait for confirmation
    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed:", {
      hash: tx.hash,
      blockNumber: receipt?.blockNumber,
      status: receipt?.status
    });

    // Step 7: Notify agent backend
    try {
      await fetch("/api/agent/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "investment_executed",
          strategy: selectedStrategy.name,
          txHash: tx.hash,
          user: signerAddress,
          timestamp: new Date().toISOString()
        })
      });
    } catch (e) {
      console.warn("⚠️ Agent notification failed (non-critical):", e);
    }

    // Step 8: Show success
    setToastData({
      message: `Successfully invested in ${selectedStrategy.name}`,
      txHash: tx.hash
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 8000);

    return tx.hash;
  };

  return (
    <div className="p-10 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest mb-2 block">
            DeFAI Strategies
          </span>
          <h1 className="text-5xl font-black tracking-tighter">DeFAI Strategies</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-black text-sm uppercase tracking-wider hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all flex items-center gap-2"
          >
            <MessageSquare size={18} />
            Ask DynaVest Bot
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search strategies..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-yellow-400/50 transition-all"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>

        <div className="flex items-center gap-2 bg-white/5 rounded-2xl p-1">
          <Filter size={16} className="text-gray-500 ml-2" />
          {(["All", "Low", "Medium", "High"] as const).map((risk) => (
            <button
              key={risk}
              onClick={() => setRiskFilter(risk)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                riskFilter === risk
                  ? "bg-yellow-400 text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {risk}
            </button>
          ))}
        </div>
      </div>

      {/* Strategy Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStrategies.map((strategy, index) => (
          <motion.div
            key={strategy.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StrategyCard
              name={strategy.name}
              protocol={strategy.protocol}
              apy={strategy.apy}
              risk={strategy.risk}
              icon={strategy.icon}
              color={strategy.color}
              description={strategy.description}
              onInvest={() => handleInvest(strategy)}
            />
          </motion.div>
        ))}
      </div>

      {filteredStrategies.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 font-bold text-lg">
            No strategies found matching your criteria
          </p>
        </div>
      )}

      {/* OneVault Bot Chat (Simulated) */}
      {isChatOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="fixed bottom-10 right-10 w-96 bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-6 z-[100]"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                OV
              </div>
              <div>
                <h4 className="font-black text-sm">OneVault Bot</h4>
                <span className="text-[10px] text-gray-500">Online</span>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-gray-500 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 mb-4">
            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none">
              <p className="text-xs text-gray-300 leading-relaxed">
                Hello! How can I help you with your DeFAI investments today?
              </p>
            </div>
            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none">
              <p className="text-xs text-gray-300 leading-relaxed">
                What is Ankr Flow strategy about?
              </p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl rounded-tr-none">
              <p className="text-xs text-blue-300 leading-relaxed">
                Ankr&apos;s Flow Liquid Staking strategy allows FLOW token holders to
                stake their tokens and receive ankrFLOW tokens in return. These
                tokens can be used in DeFi while still earning staking rewards.
                Current APY is 3.8% with low risk. Would you like to invest?
              </p>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Type your message here..."
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-xs focus:outline-none focus:border-blue-400/50 transition-all"
            />
          </div>
        </motion.div>
      )}

      {/* Modals */}
      {selectedStrategy && (
        <InvestModal
          isOpen={!!selectedStrategy}
          onClose={() => setSelectedStrategy(null)}
          strategyName={selectedStrategy.name}
          protocol={selectedStrategy.protocol}
          apy={selectedStrategy.apy}
          tokenIn={selectedStrategy.tokenIn}
          tokenOut={selectedStrategy.tokenOut}
          onConfirm={handleConfirmInvest}
        />
      )}

      <SuccessToast
        isVisible={showToast}
        message={toastData.message}
        txHash={toastData.txHash}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
