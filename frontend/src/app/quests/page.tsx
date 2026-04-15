"use client";
import React from "react";
import { motion } from "framer-motion";
import { Star, Shield, Zap, ArrowRight, Trophy } from "lucide-react";

interface Quest {
  id: number;
  title: string;
  desc: string;
  reward: string;
  progress: number;
  icon: React.ReactNode;
  color: string;
}

const QUESTS: Quest[] = [
  { id: 1, title: "Onchain Guardian", desc: "Execute 5 emergency protection swaps on X Layer Testnet.", reward: "2,500 XP", progress: 60, icon: <Shield size={24} />, color: "text-blue-400" },
  { id: 2, title: "Yield Hunter", desc: "Scan and audit 10 different Morpho strategy vaults.", reward: "1,200 XP", progress: 30, icon: <Zap size={24} />, color: "text-yellow-400" },
  { id: 3, title: "Alpha Contributor", desc: "Provide liquidity to 3 premium strategies for over 24h.", reward: "Unique Badge", progress: 90, icon: <Star size={24} />, color: "text-emerald-400" },
];

export default function QuestsPage() {
  return (
    <div className="p-10 max-w-6xl mx-auto space-y-12">
      <div className="flex justify-between items-center bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 blur-[80px] rounded-full translate-x-32 -translate-y-32"></div>
        <div className="z-10">
          <h1 className="text-5xl font-black tracking-tighter mb-2">Agent Missions</h1>
          <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Complete tasks to increase your Guardian tier</p>
        </div>
        <div className="text-right z-10">
          <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-6 py-4 rounded-2xl">
             <Trophy className="text-yellow-400" size={32} />
             <div className="text-left">
               <span className="text-[10px] font-bold text-gray-500 block uppercase">CURRENT LEVEL</span>
               <span className="text-2xl font-black tracking-tight">Silver Tier</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {QUESTS.map((quest, i) => (
          <motion.div 
            key={quest.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-8 bg-[#080808] border-white/5 flex items-center justify-between group hover:border-white/10 transition-all"
          >
            <div className="flex items-center gap-8">
              <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center ${quest.color} shadow-[0_0_20px_rgba(255,255,255,0.02)]`}>
                {quest.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black">{quest.title}</h3>
                <p className="text-sm text-gray-500 font-bold max-w-md">{quest.desc}</p>
                <div className="pt-4 flex items-center gap-4 w-64">
                   <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${quest.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-yellow-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                      />
                   </div>
                   <span className="text-[10px] font-black text-gray-400">{quest.progress}%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-10">
              <div className="text-right">
                <span className="text-[10px] font-bold text-gray-600 block uppercase tracking-widest">Reward</span>
                <span className="text-sm font-black text-yellow-500 uppercase">{quest.reward}</span>
              </div>
              <button className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-gray-500 group-hover:text-yellow-400 group-hover:border-yellow-400 transition-all">
                <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
