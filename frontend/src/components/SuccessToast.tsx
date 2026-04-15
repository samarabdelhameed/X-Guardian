"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

interface SuccessToastProps {
  isVisible: boolean;
  message: string;
  txHash?: string;
  onClose: () => void;
}

export default function SuccessToast({
  isVisible,
  message,
  txHash,
  onClose
}: SuccessToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-10 right-10 z-[120] max-w-md"
        >
          <div className="bg-[#0a0a0a] border border-emerald-500/30 rounded-3xl p-6 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                <CheckCircle2 size={24} className="text-emerald-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-black text-sm mb-1 text-emerald-400">
                  Investment successful!
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed mb-3">
                  {message}
                </p>
                {txHash && (
                  <a
                    href={`https://www.oklink.com/xlayer-test/tx/${txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-emerald-400 hover:underline font-mono break-all"
                  >
                    {txHash.slice(0, 20)}...{txHash.slice(-10)}
                  </a>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-full shrink-0"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
