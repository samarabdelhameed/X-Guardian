"use client";
import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StrategyCardProps {
  name: string;
  protocol: string;
  apy: string;
  risk: "Low" | "Medium" | "High";
  icon: string;
  color: string;
  description: string;
  onInvest: () => void;
}

export default function StrategyCard({
  name,
  protocol,
  apy,
  risk,
  icon,
  color,
  description,
  onInvest
}: StrategyCardProps) {
  const riskColors = {
    Low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    High: "bg-red-500/10 text-red-400 border-red-500/20"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass-panel p-6 bg-[#0a0a0a]/80 group cursor-pointer transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
          style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
        >
          {icon}
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${riskColors[risk]}`}>
          {risk}
        </div>
      </div>

      <h3 className="font-black text-xl mb-1">{name}</h3>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-gray-500 font-bold">Protocol:</span>
        <a
          href={`https://${protocol.toLowerCase()}.com`}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-blue-400 hover:underline font-bold"
          onClick={(e) => e.stopPropagation()}
        >
          {protocol} ↗
        </a>
      </div>

      <p className="text-xs text-gray-400 leading-relaxed mb-6 line-clamp-2">
        {description}
      </p>

      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">
            APY
          </span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black" style={{ color }}>
              {apy}
            </span>
            {parseFloat(apy) > 5 ? (
              <TrendingUp size={16} className="text-emerald-400" />
            ) : (
              <TrendingDown size={16} className="text-red-400" />
            )}
          </div>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onInvest();
        }}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black text-sm uppercase tracking-wider hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] transition-all active:scale-95"
      >
        Invest
      </button>
    </motion.div>
  );
}
