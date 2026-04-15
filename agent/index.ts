import { ethers } from "ethers";
import * as dotenv from "dotenv";

// تحميل المتغيرات البيئية
dotenv.config();

// إعدادات الشبكة والعقود
const RPC_URL = process.env.X_LAYER_RPC_URL || "https://rpc.xlayer.tech";
const EXECUTOR_ADDRESS = process.env.EXECUTOR_CONTRACT_ADDRESS!;
const STRATEGY_ADDRESS = process.env.X_GUARDIAN_CONTRACT_ADDRESS!;
const PRIVATE_KEY = process.env.AGENT_PRIVATE_KEY!;

// واجهة التخاطب (ABI) لمحرك التنفيذ المجمع (Executor/Multicall)
const EXECUTOR_ABI = [
  "function executeByAgent(tuple(address target, bool allowFailure, bytes callData)[] calls) external payable returns (tuple(bool success, bytes returnData)[])"
];

// واجهة التخاطب للاستراتيجية لتشفير البيانات فقط
const STRATEGY_ABI = [
  "function executeEmergencySwap(address tokenIn, address tokenOut, uint256 amount, string reason) external"
];

class XGuardianAgent {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private executorContract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(RPC_URL);
    // محفظة الوكيل (Agentic Wallet) التي ستوقع المعاملات
    this.wallet = new ethers.Wallet(PRIVATE_KEY, this.provider);
    this.executorContract = new ethers.Contract(EXECUTOR_ADDRESS, EXECUTOR_ABI, this.wallet);
  }

  // محاكاة جلب بيانات السوق من Onchain OS Market API
  private async fetchMarketData(tokenId: string): Promise<number> {
    console.log(`[Onchain OS] Scanning liquidity and real-time market data for ${tokenId}...`);
    return Math.random() * 100;
  }

  public async monitorAndProtect() {
    console.log("[X-Guardian] AI Agent activated with Multicall Engine...");

    setInterval(async () => {
      try {
        const currentPrice = await this.fetchMarketData("TARGET_TOKEN");

        if (currentPrice < 20) {
          console.log(`[ALERT] Danger detected! Price dropped to $${currentPrice.toFixed(2)}. Initiating emergency Multicall...`);
          await this.executeProtection();
        } else {
          console.log(`[OK] Market stable. Current Price: $${currentPrice.toFixed(2)}. Holding position.`);
        }
      } catch (error) {
        console.error("Error during market monitoring:", error);
      }
    }, 5000);
  }

  private async executeProtection() {
    try {
      const tokenIn = "0x1111111111111111111111111111111111111111";
      const tokenOut = "0x2222222222222222222222222222222222222222";
      const amount = ethers.parseEther("10");
      const reason = "AI Decision: Severe market drop detected via Onchain OS data";

      // 1) تشفير البيانات لعملية الاستراتيجية
      const strategyInterface = new ethers.Interface(STRATEGY_ABI);
      const callData = strategyInterface.encodeFunctionData("executeEmergencySwap", [tokenIn, tokenOut, amount, reason]);

      // 2) تجهيز هيكل Call3 الخاص بالـ Executor
      const call3 = {
        target: STRATEGY_ADDRESS,
        allowFailure: false,
        callData
      };

      console.log(`[X Layer] Sending Batch Transaction via Executor ${EXECUTOR_ADDRESS}...`);

      // 3) التنفيذ المجمع عبر محرك Executor
      const tx = await (this.executorContract as ethers.Contract & {
        executeByAgent: (
          calls: Array<{ target: string; allowFailure: boolean; callData: string }>
        ) => Promise<ethers.ContractTransactionResponse>;
      }).executeByAgent([call3]);
      console.log(`Transaction sent to X Layer! Tx Hash: ${tx.hash}`);

      await tx.wait();
      console.log("[SUCCESS] Portfolio protected successfully onchain using Multicall Engine!");

      process.exit(0);
    } catch (error) {
      console.error("[FAILED] Executor Multicall failed:", error);
      process.exit(1);
    }
  }
}

const agent = new XGuardianAgent();
agent.monitorAndProtect();
