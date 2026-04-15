"use client";
import { motion } from "framer-motion";
import { ShieldCheck, TrendingDown, Zap } from "lucide-react";

// إعدادات حركة الظهور للكروت
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Home() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      // كلاسات الـ columns-1 md:columns-2 lg:columns-3 هي التي تصنع شكل الـ Pinterest
      className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
    >
      
      {/* Card 1: System Status (Glassmorphism) */}
      <motion.div variants={itemVariants} className="break-inside-avoid relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-gray-900 to-black p-6 shadow-2xl group hover:border-emerald-500/50 transition-colors">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-400 font-medium">DeFAI Status</h3>
          <ShieldCheck className="text-emerald-400" />
        </div>
        <p className="text-3xl font-black mb-1">Protecting</p>
        <p className="text-sm text-gray-500">Multicall Engine Ready on X Layer</p>
      </motion.div>

      {/* Card 2: Monitored Asset (Tall Card - Pinterest style) */}
      <motion.div variants={itemVariants} className="break-inside-avoid rounded-3xl border border-white/10 bg-[#111] p-6 hover:-translate-y-1 transition-transform duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <span className="text-blue-400 font-bold">T</span>
          </div>
          <div>
            <h3 className="font-bold">TARGET_TOKEN</h3>
            <p className="text-xs text-gray-500">Monitored Asset</p>
          </div>
        </div>
        <div className="h-32 w-full rounded-xl bg-gradient-to-t from-red-500/20 to-transparent flex items-end p-4 border border-red-500/20 relative overflow-hidden">
           {/* رسم بياني وهمي متحرك */}
           <svg className="absolute bottom-0 w-full h-full preserve-3d" viewBox="0 0 100 40" preserveAspectRatio="none">
             <motion.path 
               d="M0 30 Q 20 10, 40 20 T 100 35 L 100 40 L 0 40 Z" 
               fill="rgba(239, 68, 68, 0.2)" 
               initial={{ pathLength: 0 }}
               animate={{ pathLength: 1 }}
               transition={{ duration: 2 }}
             />
             <motion.path 
               d="M0 30 Q 20 10, 40 20 T 100 35" 
               fill="none" 
               stroke="#EF4444" 
               strokeWidth="2"
               initial={{ pathLength: 0 }}
               animate={{ pathLength: 1 }}
               transition={{ duration: 2 }}
             />
           </svg>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-2xl font-bold">$19.42</span>
          <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs flex items-center gap-1 font-bold">
            <Trending Down size={12} /> Risk
          </span>
        </div>
      </motion.div>

      {/* Card 3: Agent Live Terminal */}
      <motion.div variants={itemVariants} className="break-inside-avoid rounded-3xl border border-white/10 bg-black p-6 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="text-yellow-400" size={18} />
          <h3 className="font-bold text-gray-300">Live Execution Logs</h3>
        </div>
        <div className="font-mono text-xs space-y-3 text-gray-400">
          <p className="opacity-50">[12:44:01] Scanning Onchain OS Market...</p>
          <motion.p 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 1 }}
            className="text-red-400"
          >
            &gt; Danger detected! Price dropped.
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 2 }}
            className="text-emerald-400"
          >
            &gt; Multicall Tx: 0x27c8...2994
          </motion.p>
        </div>
      </motion.div>

      {/* Card 4: Safe Haven Asset */}
      <motion.div variants={itemVariants} className="break-inside-avoid rounded-3xl border border-white/10 bg-[#111] p-6 hover:-translate-y-1 transition-transform duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <span className="text-emerald-400 font-bold">$</span>
          </div>
          <div>
            <h3 className="font-bold">USDC</h3>
            <p className="text-xs text-gray-500">Safe Haven Asset</p>
          </div>
        </div>
        <p className="text-2xl font-bold">+ $10.00 <span className="text-sm text-gray-500 font-normal">Protected</span></p>
      </motion.div>

    </motion.div>
  );
}
