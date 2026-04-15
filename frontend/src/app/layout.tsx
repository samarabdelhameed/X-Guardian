"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LayoutDashboard, MessageSquare, Target, User, Search, Plus, MoreHorizontal } from "lucide-react";
import ChatWidget from "@/components/ChatWidget";

const inter = Inter({ subsets: ["latin"] });

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, listener: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, listener: (...args: unknown[]) => void) => void;
    };
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: unknown) => {
      if (Array.isArray(accounts) && accounts.length > 0 && typeof accounts[0] === "string") {
        setWalletAddress(accounts[0]);
      } else {
        setWalletAddress(null);
      }
    };

    void window.ethereum
      .request({ method: "eth_accounts" })
      .then(handleAccountsChanged)
      .catch(() => {
        setWalletAddress(null);
      });

    window.ethereum.on?.("accountsChanged", handleAccountsChanged);
    return () => {
      window.ethereum?.removeListener?.("accountsChanged", handleAccountsChanged);
    };
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setWalletError("MetaMask not found");
      return;
    }
    setWalletError(null);
    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (Array.isArray(accounts) && accounts.length > 0 && typeof accounts[0] === "string") {
        setWalletAddress(accounts[0]);
      }
    } catch {
      setWalletError("Wallet connection rejected");
    } finally {
      setIsConnecting(false);
    }
  };

  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : null;

  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground flex h-screen overflow-hidden`}>
        {/* Sidebar - BuildHub Style */}
        <aside className="w-72 bg-[#0a0a0a] border-r border-white/5 flex flex-col p-6 hidden lg:flex shrink-0">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-black">X</div>
            <h1 className="text-xl font-black tracking-tighter">X-Guardian</h1>
          </div>

          <div className="flex-1 space-y-8 overflow-y-auto pr-2">
            <div>
              <div className="flex items-center justify-between mb-4 px-2">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Navigation</span>
                <Plus size={14} className="text-gray-500 hover:text-white cursor-pointer" />
              </div>
              <nav className="space-y-1">
                <SideNavItem href="/" icon={<MessageSquare size={18} />} label="AI Advisor" active={pathname === "/"} />
                <SideNavItem href="/strategies" icon={<LayoutDashboard size={18} />} label="Strategies" active={pathname === "/strategies"} />
                <SideNavItem href="/quests" icon={<Target size={18} />} label="Missions" active={pathname === "/quests"} />
              </nav>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-4 block px-2">Recents</span>
              <div className="space-y-4 px-2">
                <div className="text-xs text-gray-400 py-1 hover:text-white cursor-pointer flex justify-between group">
                  Top performing Base strategies <MoreHorizontal size={14} className="opacity-0 group-hover:opacity-100" />
                </div>
                <div className="text-xs text-gray-400 py-1 hover:text-white cursor-pointer flex justify-between group">
                  Risk analysis for Morpho <MoreHorizontal size={14} className="opacity-0 group-hover:opacity-100" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-2xl p-4 relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer">
              <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400/20 blur-[40px] rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform"></div>
              <p className="text-[10px] font-bold text-yellow-500 uppercase mb-1">X-Guardian Plus</p>
              <h4 className="text-xs font-bold mb-2">Unlock Advanced Agents</h4>
              <button className="w-full bg-yellow-400 text-black py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Upgrade Now</button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative overflow-hidden bg-[#050505]">
          {/* Header */}
          <header className="h-16 flex items-center justify-between px-10 border-b border-white/5 backdrop-blur-md z-50">
             <div className="relative w-64">
                <input type="text" placeholder="Quick Search..." className="w-full bg-white/5 border border-white/10 rounded-xl py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:border-yellow-400/50" />
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
             </div>
             <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</span>
                  <span className="text-xs font-mono font-bold text-blue-400">ACTIVE_X_LAYER</span>
                </div>
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="px-4 h-10 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-black tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isConnecting ? "Connecting..." : shortAddress ?? "Connect Wallet"}
                </button>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.2)]">
                  <User className="text-black" size={20} />
                </div>
             </div>
          </header>
          {walletError ? (
            <div className="px-10 py-2 text-[11px] text-red-400 border-b border-red-500/20 bg-red-500/5">
              {walletError}
            </div>
          ) : null}

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto scroll-smooth">
             {children}
          </div>
        </main>
        
        <ChatWidget />
      </body>
    </html>
  );
}

function SideNavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
        active 
          ? "bg-white/5 text-yellow-400 border border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]" 
          : "text-gray-500 hover:text-white hover:bg-white/[0.02]"
      }`}
    >
      {icon}
      <span className="text-sm font-bold tracking-tight">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_10px_#fbbf24]"></div>}
    </Link>
  );
}
