"use client";
import React, { useState } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-10 right-10 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] w-[400px] h-[600px] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden mb-6"
          >
            {/* Header */}
            <div className="p-6 flex justify-between items-center border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-yellow-400 flex items-center justify-center text-black font-bold">
                  AI
                </div>
                <div>
                   <h4 className="font-black text-sm tracking-tight">Guardian Assistant</h4>
                   <div className="flex items-center gap-1.5">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></div>
                     <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Autonomous</span>
                   </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors text-gray-500 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
               <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0 text-xs shadow-inner">🤖</div>
                 <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none text-xs leading-relaxed text-gray-300">
                   Hello! I&apos;m your X-Guardian agent. I can help you monitor markets or execute protection swaps on X Layer. What&apos;s on your mind?
                 </div>
               </div>

               <div className="flex gap-4 flex-row-reverse">
                 <div className="w-8 h-8 rounded-xl bg-yellow-400 flex items-center justify-center shrink-0 text-black font-black text-[10px]">
                    U
                 </div>
                 <div className="bg-yellow-400/10 border border-yellow-400/20 p-4 rounded-2xl rounded-tr-none text-xs leading-relaxed text-yellow-500/90">
                   Check current risk score for Morpho vaults.
                 </div>
               </div>

               <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0 text-xs">🤖</div>
                 <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none text-xs leading-relaxed text-gray-300">
                   Analyzing Morpho USDC/ETH vaults... Current risk score: <span className="text-emerald-400 font-bold">2.4/10</span>. Sentiment is stable. No action required.
                 </div>
               </div>
            </div>

            {/* Input */}
            <div className="p-6 border-t border-white/5 bg-[#080808]">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Ask your agent anything..." 
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-6 pr-14 text-xs focus:outline-none focus:border-yellow-400/30 transition-all text-white"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-yellow-400 text-black flex items-center justify-center hover:bg-yellow-500 transition-all active:scale-90">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-18 h-18 rounded-[2rem] bg-yellow-400 text-black shadow-[0_0_30px_rgba(251,191,36,0.3)] flex items-center justify-center hover:scale-110 transition-transform active:scale-95 border-b-4 border-yellow-600 shadow-inner"
      >
        {isOpen ? <X size={32} strokeWidth={3} /> : <MessageSquare size={32} strokeWidth={3} />}
      </button>
    </div>
  );
}
