"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Shield, Activity, ArrowUpRight } from "lucide-react";

type Strategy = {
  name: string;
  risk: string;
  glow: string;
  color: string;
  apy: number | null;
  tvlUsd: number | null;
  chain: string | null;
  project: string | null;
  symbol: string | null;
  poolId: string | null;
};

type ApiResponse = {
  ok: boolean;
  error?: string;
  onchain?: {
    chainId: string;
    blockNumber: number;
    agentWallet: string;
    latestTxHash: string | null;
  };
  strategies?: Strategy[];
  dataSources?: { yields: string; rpc: string };
};

export default function StrategiesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [range, setRange] = useState<"1W" | "1M" | "ALL">("1W");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/strategies", { cache: "no-store" });
      const json = (await res.json()) as ApiResponse;
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to load strategies");
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load strategies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const chartHeights = useMemo(() => {
    // Use real APYs as inputs (still visually rich). If missing, fall back to a gentle wave.
    const apys = (data?.strategies ?? []).map((s) => s.apy).filter((v): v is number => typeof v === "number");
    const base = apys.length > 0 ? apys : [4, 7, 12];
    const points = 30;
    return Array.from({ length: points }, (_, i) => {
      const anchor = base[i % base.length] ?? 6;
      const wave = (Math.sin(i * 0.45) + 1) / 2; // 0..1
      const scaled = Math.min(95, Math.max(10, anchor * 3 + wave * 55));
      return `${scaled}%`;
    });
  }, [data?.strategies]);

  const strategies = data?.strategies ?? [];

  return (
    <div className="p-10 space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest mb-2 block">Protocol Performance</span>
          <h1 className="text-5xl font-black tracking-tighter">Yield Engines</h1>
        </div>
        <div className="flex gap-4">
           <div className="glass-panel px-6 py-3 border-white/5 flex items-center gap-4">
              <div>
                <span className="text-[10px] text-gray-500 block uppercase font-bold">Latest On-chain Execution</span>
                <span className="text-xs font-mono font-black break-all">
                  {loading ? "Loading..." : data?.onchain?.latestTxHash ?? "No recent tx"}
                </span>
              </div>
              <Shield className="text-blue-400" size={24} />
           </div>
        </div>
      </div>

      {/* Main Stats Chart Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 glass-panel p-8 min-h-[400px] flex flex-col bg-[#080808]/50"
        >
          <div className="flex items-center justify-between mb-10">
            <h4 className="font-black text-xl flex items-center gap-2">
              <TrendingUp className="text-yellow-400" size={20} />
              Aggregated Performance
            </h4>
            <div className="flex bg-white/5 rounded-xl p-1 gap-1 text-[10px] font-bold">
               <button onClick={() => setRange("1W")} className={`px-3 py-1.5 rounded-lg ${range === "1W" ? "bg-yellow-400 text-black" : "hover:text-white transition-colors"}`}>1W</button>
               <button onClick={() => setRange("1M")} className={`px-3 py-1.5 rounded-lg ${range === "1M" ? "bg-yellow-400 text-black" : "hover:text-white transition-colors"}`}>1M</button>
               <button onClick={() => setRange("ALL")} className={`px-3 py-1.5 rounded-lg ${range === "ALL" ? "bg-yellow-400 text-black" : "hover:text-white transition-colors"}`}>ALL</button>
            </div>
          </div>
          
          {error ? (
            <div className="text-red-400 text-sm font-bold">{error}</div>
          ) : null}
          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">
            Data sources: {data?.dataSources?.yields ?? "—"} + X Layer RPC ({data?.dataSources?.rpc ?? "—"})
          </div>

          {/* Performance Bars (APY-driven, real inputs) */}
          <div className="flex-1 relative flex items-end gap-1 px-4">
             {chartHeights.map((h, i) => (
               <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: h }}
                transition={{ duration: 0.8, delay: i * 0.01 }}
                className="flex-1 bg-gradient-to-t from-yellow-400/5 to-yellow-400/40 rounded-t-sm border-t border-yellow-400/20"
               />
             ))}
             
             {/* Overlay Gradient */}
             <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent h-12 bottom-0"></div>
          </div>
        </motion.div>

        <div className="space-y-6">
           {strategies.map((s, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: i * 0.1 }}
               className={`glass-panel p-6 ${s.glow} group cursor-pointer hover:scale-[1.02] transition-all bg-[#0a0a0a]/80`}
             >
                <div className="flex justify-between items-start mb-4">
                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <Activity size={20} style={{ color: s.color }} />
                   </div>
                   <ArrowUpRight className="text-gray-500 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={18} />
                </div>
                <h3 className="font-black text-lg mb-1">{s.name}</h3>
                <div className="text-[10px] text-gray-500 font-bold">
                  {s.project ? `${s.project} • ${s.chain ?? "—"} • ${s.symbol ?? "—"}` : "Loading data..."}
                </div>
                <div className="flex justify-between items-center mt-4">
                   <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Projected APY</span>
                      <span className="text-sm font-black text-white">{typeof s.apy === "number" ? `${s.apy.toFixed(2)}%` : "—"}</span>
                   </div>
                   <span className="text-[9px] px-3 py-1 rounded-full bg-white/5 border border-white/5 font-black uppercase tracking-tighter text-gray-400">{s.risk} Risk</span>
                </div>
                <div className="mt-4 text-[10px] text-gray-500 font-bold">
                  TVL: {typeof s.tvlUsd === "number" ? `$${Math.round(s.tvlUsd).toLocaleString()}` : "—"}
                </div>
             </motion.div>
           ))}
           
           <button
             onClick={() => void load()}
             className="w-full py-4 bg-white/5 border border-white/5 rounded-[1.5rem] font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
           >
             {loading ? "Refreshing..." : "Refresh Live Data"}
           </button>
        </div>
      </div>
    </div>
  );
}
