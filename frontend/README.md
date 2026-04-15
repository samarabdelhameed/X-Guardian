# X-Guardian Frontend

Modern Next.js 16 frontend for the X-Guardian DeFAI Portfolio Protector.

## 🎨 Pages

### 1. **AI Advisor** (`/`)
Main dashboard with:
- Real-time X Layer blockchain data
- Agent wallet status
- Market monitoring simulation
- Wallet connection
- Execute protection button

### 2. **Invest** (`/invest`) 🆕
DeFi strategies marketplace:
- 7 pre-configured strategies
- Search and filter by risk
- OneVault Bot chat integration
- Direct investment flow

### 3. **Strategies** (`/strategies`)
Performance analytics:
- Real-time APY charts
- TVL data from DeFi protocols
- Strategy comparison
- Live on-chain data

### 4. **Missions** (`/quests`)
Gamification and rewards (placeholder)

## 🧩 Components

- `ChatWidget.tsx` - Floating AI assistant
- `StrategyCard.tsx` - Investment strategy card 🆕
- `InvestModal.tsx` - Transaction confirmation 🆕
- `SuccessToast.tsx` - Success notifications 🆕
- `StrategyModal.tsx` - Legacy modal (updated)

## 🚀 Quick Start

```bash
pnpm install
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔧 Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- ethers.js v6
- Lucide Icons

## 📱 Features

- Responsive design
- Dark mode optimized
- Wallet integration (MetaMask)
- Real blockchain transactions
- Smooth animations
- Glass morphism UI

## 🎯 Design System

- Primary: Yellow (#fbbf24) to Orange (#f97316)
- Background: Dark (#050505, #0a0a0a)
- Glass panels: white/5 opacity
- Rounded corners: 2xl, 3xl
- Font: Inter

## 📦 Scripts

```bash
pnpm run dev      # Start development server
pnpm run build    # Build for production
pnpm run start    # Start production server
pnpm run lint     # Run ESLint
```

## 📄 License

MIT
