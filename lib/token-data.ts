export type Token = {
  name: string
  ticker: string
  category: string
  question: string
  expiry: string
  priceYes: number
  status: "active" | "resolved" | "pending"
  tvl: string
  description: string
  volume24h: string
  liquidity: string
  trades: number
  history: { time: string; yes: number }[]
}

// Synthetic price history for the sparkline (last 12 points)
function hist(start: number, end: number): { time: string; yes: number }[] {
  const points = 12
  return Array.from({ length: points }, (_, i) => {
    const noise = (Math.sin(i * 2.1 + start * 10) * 0.06) + (Math.cos(i * 1.3) * 0.04)
    const t = i / (points - 1)
    return {
      time: `${points - i}h ago`,
      yes: Math.min(0.98, Math.max(0.02, start + (end - start) * t + noise)),
    }
  })
}

export const TOKENS: Token[] = [
  {
    name: "AquaFi", ticker: "AQF", category: "DeFi",
    question: "Will AquaFi TGE before Sep 30, 2025?",
    expiry: "2025.09.30", priceYes: 0.62, status: "active",
    tvl: "$18.4K", volume24h: "$3.2K", liquidity: "$18.4K", trades: 142,
    description: "AquaFi is a next-generation yield optimiser building on top of lending markets. Its token has been announced but not yet launched. This market resolves YES if the TGE occurs before September 30.",
    history: hist(0.44, 0.62),
  },
  {
    name: "YieldArc", ticker: "YAC", category: "DeFi",
    question: "Will YieldArc token points-to-token ratio exceed 1:10?",
    expiry: "2025.10.15", priceYes: 0.48, status: "active",
    tvl: "$12.1K", volume24h: "$1.8K", liquidity: "$12.1K", trades: 98,
    description: "YieldArc runs a points programme for early liquidity providers. This market resolves YES if the final conversion ratio announced at TGE is above 1 point : 10 tokens.",
    history: hist(0.55, 0.48),
  },
  {
    name: "NexusSwap", ticker: "NXS", category: "DeFi",
    question: "Will NexusSwap launch on mainnet before Q4 2025?",
    expiry: "2025.09.01", priceYes: 0.71, status: "active",
    tvl: "$9.8K", volume24h: "$2.1K", liquidity: "$9.8K", trades: 214,
    description: "NexusSwap is a concentrated liquidity DEX targeting cross-chain swaps. The team has indicated a Q3 mainnet target. Resolves YES if mainnet goes live before October 1.",
    history: hist(0.50, 0.71),
  },
  {
    name: "VaultDAO", ticker: "VLT", category: "DeFi",
    question: "Will VaultDAO governance token launch before Dec 2025?",
    expiry: "2025.11.30", priceYes: 0.35, status: "active",
    tvl: "$6.2K", volume24h: "$0.9K", liquidity: "$6.2K", trades: 67,
    description: "VaultDAO is a community-governed treasury vault. Development is ongoing; the team has not committed to a firm TGE date. Market resolves YES if the token launches before December 2025.",
    history: hist(0.50, 0.35),
  },
  {
    name: "ZeroChain", ticker: "ZRC", category: "Infrastructure",
    question: "Will ZeroChain ZK mainnet go live before Dec 2025?",
    expiry: "2025.12.01", priceYes: 0.55, status: "active",
    tvl: "$22.7K", volume24h: "$4.4K", liquidity: "$22.7K", trades: 311,
    description: "ZeroChain is a ZK-rollup L1 with native account abstraction. The project raised a Series A in early 2025 and has a public testnet live. Resolves YES if mainnet launches before December 1.",
    history: hist(0.38, 0.55),
  },
  {
    name: "BridgeX", ticker: "BRX", category: "Infrastructure",
    question: "Will BridgeX token airdrop include pre-mainnet users?",
    expiry: "2025.10.31", priceYes: 0.67, status: "active",
    tvl: "$8.3K", volume24h: "$1.6K", liquidity: "$8.3K", trades: 119,
    description: "BridgeX is a modular bridging protocol. Early users accrued points; the team has hinted at a retroactive airdrop. Resolves YES if the airdrop explicitly includes pre-mainnet activity.",
    history: hist(0.50, 0.67),
  },
  {
    name: "RelayNet", ticker: "RLN", category: "Infrastructure",
    question: "Will RelayNet L2 reach 1M TPS in a public benchmark?",
    expiry: "2025.11.15", priceYes: 0.41, status: "active",
    tvl: "$5.1K", volume24h: "$0.7K", liquidity: "$5.1K", trades: 53,
    description: "RelayNet claims theoretical throughput of 2M TPS using a custom sequencer. This market resolves YES if a publicly verifiable benchmark confirms ≥1M TPS before November 15.",
    history: hist(0.55, 0.41),
  },
  {
    name: "NeuralDAO", ticker: "NRL", category: "AI & ML",
    question: "Will NeuralDAO on-chain inference token launch before Oct 2025?",
    expiry: "2025.10.01", priceYes: 0.58, status: "active",
    tvl: "$14.9K", volume24h: "$2.8K", liquidity: "$14.9K", trades: 188,
    description: "NeuralDAO is building a decentralised AI inference network with on-chain payment rails. The token is in the design phase. Resolves YES if the token goes live before October 1.",
    history: hist(0.42, 0.58),
  },
  {
    name: "AIMarket", ticker: "AIM", category: "AI & ML",
    question: "Will AIMarket data protocol TGE before Nov 2025?",
    expiry: "2025.11.01", priceYes: 0.44, status: "active",
    tvl: "$7.6K", volume24h: "$1.1K", liquidity: "$7.6K", trades: 76,
    description: "AIMarket is a marketplace for training datasets. The founding team has announced intent to tokenise governance. Resolves YES if TGE happens before November 1.",
    history: hist(0.50, 0.44),
  },
  {
    name: "Realm3", ticker: "RLM", category: "Gaming",
    question: "Will Realm3 gaming token release before Jan 15, 2026?",
    expiry: "2026.01.15", priceYes: 0.38, status: "active",
    tvl: "$4.4K", volume24h: "$0.6K", liquidity: "$4.4K", trades: 44,
    description: "Realm3 is an on-chain RPG funded in a 2024 seed round. The in-game economy depends on a not-yet-launched token. Resolves YES if the token launches before January 15, 2026.",
    history: hist(0.50, 0.38),
  },
  {
    name: "DropLabs", ticker: "DRP", category: "NFT & Creator",
    question: "Will DropLabs royalty protocol token launch before Jan 2026?",
    expiry: "2025.12.31", priceYes: 0.52, status: "active",
    tvl: "$3.8K", volume24h: "$0.5K", liquidity: "$3.8K", trades: 39,
    description: "DropLabs is building on-chain royalty infrastructure for NFT creators. Token design is complete; audit is pending. Resolves YES if the token launches before year-end.",
    history: hist(0.50, 0.52),
  },
  {
    name: "TerraToken", ticker: "TRT", category: "RWA",
    question: "Will TerraToken RWA protocol pass a governance vote before Oct 20?",
    expiry: "2025.10.20", priceYes: 0.61, status: "active",
    tvl: "$6.0K", volume24h: "$1.2K", liquidity: "$6.0K", trades: 88,
    description: "TerraToken is tokenising commercial real estate on-chain. A governance proposal to launch the token is scheduled for a community vote. Resolves YES if the vote passes before October 20.",
    history: hist(0.45, 0.61),
  },
]

export function getToken(ticker: string | undefined | null): Token | undefined {
  if (!ticker) return undefined
  return TOKENS.find((t) => t.ticker.toLowerCase() === ticker.toLowerCase())
}
