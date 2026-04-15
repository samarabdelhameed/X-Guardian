"use client";
import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Shield, Activity, ArrowUpRight } from "lucide-react";

interface Strategy {
  name: string;
  apy: string;
  risk: string;
  glow: string;
  color: string;
}

const STRATEGIES: Strategy[] = [
  { name: "Morpho Guardian", apy: "4.2%", risk: "Low", glow: "glow-border-blue", color: "#3b82f6" },
  { name: "DeFAI Aggregator", apy: "12.8%", risk: "High", glow: "glow-border-gold", color: "#fbbf24" },
  { name: "X-Layer Vault", apy: "8.5%", risk: "Med", glow: "glow-border-green", color: "#22c55e" },
];

export default function StrategiesPage() {
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
                <span className="text-[10px] text-gray-500 block uppercase font-bold">Total Protected</span>
                <span className="text-xl font-black">$4,260,112</span>
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
               <button className="px-3 py-1.5 bg-yellow-400 text-black rounded-lg">1W</button>
               <button className="px-3 py-1.5 hover:text-white transition-colors">1M</button>
               <button className="px-3 py-1.5 hover:text-white transition-colors">ALL</button>
            </div>
          </div>
          
          {/* Animated SVG Chart Mockup */}
          <div className="flex-1 relative flex items-end gap-1 px-4">
             {[...Array(30)].map((_, i) => (
               <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${((Math.sin(i * 0.5) + 1) / 2) * 60 + 30}%` }}
                transition={{ duration: 1.5, delay: i * 0.03, repeat: Infinity, repeatType: "reverse", repeatDelay: 5 }}
                className="flex-1 bg-gradient-to-t from-yellow-400/5 to-yellow-400/40 rounded-t-sm border-t border-yellow-400/20"
               />
             ))}
             
             {/* Overlay Gradient */}
             <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent h-12 bottom-0"></div>
          </div>
        </motion.div>

        <div className="space-y-6">
           {STRATEGIES.map((s, i) => (
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
                <div className="flex justify-between items-center mt-4">
                   <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Projected APY</span>
                      <span className="text-sm font-black text-white">{s.apy}</span>
                   </div>
                   <span className="text-[9px] px-3 py-1 rounded-full bg-white/5 border border-white/5 font-black uppercase tracking-tighter text-gray-400">{s.risk} Risk</span>
                </div>
             </motion.div>
           ))}
           
           <button className="w-full py-4 bg-white/5 border border-white/5 rounded-[1.5rem] font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
             View All Strategies
           </button>
        </div>
      </div>
    </div>
  );
}
