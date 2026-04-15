"use client";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, Shield, BarChart3, ArrowRight } from "lucide-react";

export default function Home() {
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
          Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">Alex</span>
        </h1>
        <p className="text-gray-500 font-bold max-w-lg mx-auto text-lg leading-relaxed">
          Which onchain strategy do you want to analyze or execute today?
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
            placeholder="Tell us about your portfolio goals..." 
            className="flex-1 bg-transparent border-none text-xl font-medium focus:outline-none placeholder:text-white/20 text-white"
           />
           <button className="bg-yellow-400 hover:bg-yellow-500 text-black p-3 rounded-2xl transition-all shadow-[0_0_20px_rgba(251,191,36,0.2)] active:scale-95">
             <ArrowRight size={24} />
           </button>
        </div>
      </motion.div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
         <FeatureCard 
          icon={<Shield className="text-orange-400" />} 
          title="Safe Haven" 
          desc="Automated protection for volatile market conditions on X Layer." 
          glow="glow-border-gold"
         />
         <FeatureCard 
          icon={<Zap className="text-blue-400" />} 
          title="Rapid Swap" 
          desc="Optimized multicall execution with minimal gas overhead." 
          glow="glow-border-blue"
         />
         <FeatureCard 
          icon={<BarChart3 className="text-green-400" />} 
          title="Strategy Audit" 
          desc="Deep analysis of real-time protocol yields and risk metrics." 
          glow="glow-border-green"
         />
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
