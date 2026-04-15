"use client";
import React, { useState } from "react";
import { X, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InvestModalProps {
  isOpen: boolean;
  onClose: () => void;
  strategyName: string;
  protocol: string;
  apy: string;
  tokenIn: string;
  tokenOut: string;
  onConfirm: () => Promise<string>; // Returns tx hash
}

export default function InvestModal({
  isOpen,
  onClose,
  strategyName,
  protocol,
  apy,
  tokenIn,
  tokenOut,
  onConfirm
}: InvestModalProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsExecuting(true);
    setError(null);
    try {
      const hash = await onConfirm();
      setTxHash(hash);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Transaction failed");
    } finally {
      setIsExecuting(false);
    }
  };

  const handleClose = () => {
    setTxHash(null);
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={handleClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-[3rem] w-full max-w-lg shadow-[0_0_100px_rgba(0,0,0,1)] relative overflow-hidden p-10 z-10"
          >
            <button
              onClick={handleClose}
              className="absolute right-8 top-8 text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-4xl mb-6 shadow-inner border border-white/5">
                🛡️
              </div>
              <h3 className="font-black text-3xl tracking-tighter mb-2">
                {strategyName}
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-yellow-400 font-black text-sm uppercase tracking-widest">
                  {protocol}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                <span className="text-gray-500 font-bold text-sm tracking-tight">
                  APY {apy}
                </span>
              </div>
            </div>

            {!txHash && !error && (
              <div className="space-y-8">
                <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-3xl">
                  <div className="flex items-center gap-3 text-orange-400 font-black uppercase text-xs tracking-widest mb-2">
                    <AlertCircle size={16} />
                    <span>Insufficient Balance!!!</span>
                  </div>
                  <p className="text-gray-300 text-sm font-bold leading-relaxed">
                    Do you want to swap{" "}
                    <span className="text-white underline">
                      {tokenIn} from ETHEREUM
                    </span>{" "}
                    to{" "}
                    <span className="text-white underline">{tokenOut}</span>?
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleClose}
                    disabled={isExecuting}
                    className="py-4 rounded-2xl bg-white/5 border border-white/5 font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-50"
                  >
                    Decline
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={isExecuting}
                    className="py-4 rounded-2xl bg-yellow-400 text-black font-black text-xs uppercase tracking-widest hover:bg-yellow-500 transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isExecuting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Confirm Swap"
                    )}
                  </button>
                </div>
              </div>
            )}

            {txHash && (
              <div className="space-y-6">
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-3xl">
                  <div className="flex items-center gap-3 text-emerald-400 font-black uppercase text-xs tracking-widest mb-3">
                    <CheckCircle2 size={20} />
                    <span>Investment successful!</span>
                  </div>
                  <p className="text-gray-300 text-sm font-bold leading-relaxed mb-4">
                    Order placed successfully! Order hash:
                  </p>
                  <div className="bg-black/30 p-4 rounded-2xl">
                    <a
                      href={`https://www.oklink.com/xlayer-test/tx/${txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 text-xs font-mono break-all hover:underline"
                    >
                      {txHash}
                    </a>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full py-4 rounded-2xl bg-yellow-400 text-black font-black text-xs uppercase tracking-widest hover:bg-yellow-500 transition-all"
                >
                  Close
                </button>
              </div>
            )}

            {error && (
              <div className="space-y-6">
                <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl">
                  <div className="flex items-center gap-3 text-red-400 font-black uppercase text-xs tracking-widest mb-3">
                    <AlertCircle size={20} />
                    <span>Transaction Failed</span>
                  </div>
                  <p className="text-gray-300 text-sm font-bold leading-relaxed">
                    {error}
                  </p>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full py-4 rounded-2xl bg-white/5 border border-white/5 font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
