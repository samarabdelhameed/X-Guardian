import React from 'react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white p-8 font-sans selection:bg-emerald-500 selection:text-white">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center border-b border-gray-800 pb-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">
              X-Guardian
            </h1>
            <p className="text-gray-400 mt-2 text-sm">Autonomous DeFAI Portfolio Protector on X Layer</p>
          </div>
          <button className="bg-white text-black hover:bg-gray-200 px-6 py-2.5 rounded-full font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            Connect Wallet
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Portfolio Section */}
          <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              💼 Portfolio Status
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-5 bg-gray-800/50 rounded-2xl border border-gray-700/50">
                <div>
                  <p className="font-bold text-lg">TARGET_TOKEN</p>
                  <p className="text-xs text-gray-400">Monitored Asset</p>
                </div>
                <div className="text-right">
                  <span className="text-red-400 font-bold bg-red-400/10 px-3 py-1 rounded-full text-sm">Risk Detected 📉</span>
                </div>
              </div>
              <div className="flex justify-between items-center p-5 bg-gray-800/50 rounded-2xl border border-gray-700/50">
                <div>
                  <p className="font-bold text-lg">USDC</p>
                  <p className="text-xs text-gray-400">Safe Haven Asset</p>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold bg-emerald-400/10 px-3 py-1 rounded-full text-sm">+ Protected 🛡️</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Agent Logs Section */}
          <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              🧠 Onchain OS Agent Logs
            </h2>
            <div className="font-mono text-sm bg-black/80 p-5 rounded-2xl h-64 overflow-y-auto border border-gray-800 shadow-inner space-y-3">
              <p className="text-gray-500">[{new Date().toLocaleTimeString()}] System Initialized...</p>
              <p className="text-blue-400">&gt; 🚀 [X-Guardian] AI Agent activated and monitoring portfolio...</p>
              <p className="text-gray-400">&gt; 📊 Scanning liquidity and real-time market data...</p>
              <p className="text-yellow-400">&gt; ⚠️ [ALERT] Danger detected! Initiating emergency protocol...</p>
              <p className="text-purple-400">&gt; ⚙️ Executing Smart Contract Protection on X Layer...</p>
              <p className="text-emerald-400 font-bold">&gt; 🛡️ [SUCCESS] Portfolio protected successfully onchain!</p>
              <p className="text-gray-500 break-all">&gt; Tx Hash: 0xe93805263740e0ac44c230322b1d7727f0d91178bea194cc41d5e12a521cd34d</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
