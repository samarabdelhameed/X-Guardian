import { ethers } from "ethers";
import * as dotenv from "dotenv";

// تحميل المتغيرات البيئية من ملف .env
dotenv.config();

// إعدادات شبكة X Layer والعقد الذكي
const RPC_URL = process.env.X_LAYER_RPC_URL || "https://testrpc.xlayer.tech";
const CONTRACT_ADDRESS = process.env.X_GUARDIAN_CONTRACT_ADDRESS!;
const PRIVATE_KEY = process.env.AGENT_PRIVATE_KEY!; // مفتاح محفظة الوكيل

// واجهة التخاطب (ABI) مع العقد الذكي الذي قمتِ بنشره
const X_GUARDIAN_ABI = [
  "function executeEmergencySwap(address tokenIn, address tokenOut, uint256 amount, string memory reason) external"
];

class XGuardianAgent {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor() {
    // تهيئة الاتصال بشبكة X Layer
    this.provider = new ethers.JsonRpcProvider(RPC_URL);
    // دمج محفظة الذكاء الاصطناعي (Agentic Wallet)
    this.wallet = new ethers.Wallet(PRIVATE_KEY, this.provider);
    // ربط العقد الذكي للتنفيذ
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, X_GUARDIAN_ABI, this.wallet);
  }

  /**
   * دالة لجلب بيانات السوق الحية باستخدام Onchain OS Market API
   * [تحاكي هنا مراقبة أسعار الأصول في الوقت الفعلي]
   */
  private async fetchMarketData(tokenId: string): Promise<number> {
    console.log(`[Onchain OS] 📊 Scanning liquidity and real-time market data for ${tokenId}...`);
    // محاكاة لحالة السوق (رقم عشوائي لتجربة التدخل الذكي)
    return Math.random() * 100; 
  }

  /**
   * الوظيفة الأساسية للوكيل: العمل بشكل مستقل (Autonomous Loop)
   */
  public async monitorAndProtect() {
    console.log("🚀 [X-Guardian] AI Agent activated and monitoring portfolio...");

    // فحص السوق كل 5 ثواني
    setInterval(async () => {
      try {
        const currentPrice = await this.fetchMarketData("TARGET_TOKEN");
        
        // المنطق الذكي (AI Reasoning): إذا انخفض السعر عن حد الخطر
        if (currentPrice < 20) {
          console.log(`⚠️ [ALERT] Danger detected! Token price dropped to $${currentPrice.toFixed(2)}. Initiating emergency protocol...`);
          await this.executeProtection();
        } else {
          console.log(`✅ [OK] Market stable. Current Price: $${currentPrice.toFixed(2)}. Holding position.`);
        }
      } catch (error) {
        console.error("❌ Error during market monitoring:", error);
      }
    }, 5000); 
  }

  /**
   * تنفيذ المعاملة على شبكة X Layer لحماية المحفظة
   */
  private async executeProtection() {
    try {
      // بيانات وهمية للعملات لأغراض الـ Demo
      const tokenIn = "0x1111111111111111111111111111111111111111"; // العملة المعرضة للخطر
      const tokenOut = "0x2222222222222222222222222222222222222222"; // عملة مستقرة (مثل USDC)
      const amount = ethers.parseEther("0.0001"); // كمية صغيرة جداً للتجربة
      const reason = "AI Decision: Severe market drop detected via Onchain OS data";

      console.log(`[X Layer] ⚙️ Executing Smart Contract Protection on ${CONTRACT_ADDRESS}...`);
      
      // مناداة العقد الذكي
      const tx = await (this.contract as ethers.Contract & {
        executeEmergencySwap: (
          tokenIn: string,
          tokenOut: string,
          amount: bigint,
          reason: string
        ) => Promise<ethers.ContractTransactionResponse>;
      }).executeEmergencySwap(tokenIn, tokenOut, amount, reason);
      console.log(`⏳ Transaction sent to X Layer! Tx Hash: ${tx.hash}`);
      
      // انتظار تأكيد البلوكتشين
      await tx.wait();
      console.log("🛡️ [SUCCESS] Portfolio protected successfully onchain!");
      
      // إنهاء البرنامج بعد التنفيذ الناجح (في الـ Demo)
      process.exit(0);
    } catch (error) {
      console.error("❌ [FAILED] Smart contract execution failed:", error);
      process.exit(1);
    }
  }
}

// بدء تشغيل الوكيل الذكي
const agent = new XGuardianAgent();
agent.monitorAndProtect();
