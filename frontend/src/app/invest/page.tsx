"use client";
import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, PieChart, Wallet, ArrowUpRight, ShieldCheck } from "lucide-react";

export default function InvestPage() {
  return (
    <div className="p-10 space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-yellow-400 text-xs font-black uppercase tracking-[0.3em] mb-3 block">Portfolio Management</span>
          <h2 className="text-5xl font-black tracking-tighter">Invest Explorer</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass-panel p-8 min-h-[400px] flex flex-col justify-center items-center text-center space-y-6"
        >
          <div className="w-20 h-20 rounded-3xl bg-yellow-400/10 flex items-center justify-center text-yellow-400 mb-4">
            <PieChart size={40} />
          </div>
          <h3 className="text-2xl font-black">Direct Deployment Coming Soon</h3>
          <p className="text-gray-500 max-w-md font-bold">
            We are integrating with top liquidity pools on X Layer to allow one-click investment directly from this dashboard.
          </p>
          <div className="flex gap-4">
            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400">
              Audit Pending
            </div>
            <div className="px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-[10px] font-black uppercase tracking-widest text-yellow-400">
              X Layer Mainnet Ready
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          <InvestmentMetricCard icon={<Wallet className="text-blue-400" />} label="Available Balance" value="$0.00" sub="Connect wallet to view" />
          <InvestmentMetricCard icon={<TrendingUp className="text-emerald-400" />} label="Projected PnL" value="+0.00%" sub="Dynamic estimation" />
          <InvestmentMetricCard icon={<ShieldCheck className="text-orange-400" />} label="Security Score" value="A+" sub="Verified by X-Guardian" />
        </div>
      </div>
    </div>
  );
}

function InvestmentMetricCard({ icon, label, value, sub }: { icon: React.ReactNode, label: string, value: string, sub: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-panel p-6 border-white/5 hover:border-white/10 transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <ArrowUpRight className="text-gray-600 group-hover:text-white transition-colors" size={16} />
      </div>
      <div>
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{label}</span>
        <div className="text-xl font-black mt-1">{value}</div>
        <div className="text-[9px] text-gray-600 font-bold mt-1">{sub}</div>
      </div>
    </motion.div>
  );
}
