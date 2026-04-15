import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutDashboard, TerminalSquare, Activity, Wallet } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "X-Guardian | DeFAI Agent",
  description: "Autonomous Portfolio Protector on X Layer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0A0A0A] text-white flex min-h-screen overflow-hidden`}>
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/10 bg-black/50 backdrop-blur-xl flex flex-col p-6 hidden md:flex">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 animate-pulse shadow-[0_0_20px_rgba(52,211,153,0.4)]"></div>
            <h1 className="text-xl font-black tracking-tighter">X-GUARDIAN</h1>
          </div>
          
          <nav className="space-y-4 flex-1">
            <a href="/" className="flex items-center gap-3 text-emerald-400 bg-emerald-400/10 p-3 rounded-xl transition-all">
              <LayoutDashboard size={20} />
              <span className="font-medium">Portfolio</span>
            </a>
            <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 p-3 rounded-xl transition-all">
              <TerminalSquare size={20} />
              <span className="font-medium">Agent Console</span>
            </a>
            <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 p-3 rounded-xl transition-all">
              <Activity size={20} />
              <span className="font-medium">Market Radar</span>
            </a>
          </nav>

          {/* Agentic Wallet Status */}
          <div className="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2">
              <Wallet size={16} className="text-gray-400" />
              <span className="text-xs font-bold text-gray-400">ONCHAIN OS TEE</span>
            </div>
            <div className="text-xs text-emerald-400 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              Agent Wallet Active
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-y-auto">
          <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md sticky top-0 z-50">
            <h2 className="text-xl font-semibold text-gray-200">Dashboard</h2>
            <button className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              Connect User Wallet
            </button>
          </header>
          <div className="p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
