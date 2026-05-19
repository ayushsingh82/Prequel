# Prequel

**Early price discovery for pre-token projects.** Prequel is a prediction-market venue where traders take positions on the outcomes of yet-to-launch crypto projects — token launches, milestones, unlocks — and settle on-chain.

Built on the same insight that drove Hyperliquid's and Pendle's pre-markets to product-market fit: *the market for an asset starts the moment the asset is announced, not the moment it's listed.*

---

## What Prequel does

Pre-token projects today have no clean instrument for price discovery. Discord polls, OTC whispers, and points-program leaderboards stand in for what should be a real market. Prequel replaces that with a venue:

- **Binary outcome markets.** Every market resolves to YES or NO. *"Will Project X mint its TGE by Sep 30?"*, *"Will Protocol Y's points-to-token ratio settle above 1:10?"*, *"Will the airdrop snapshot include holders before block N?"*
- **Continuous on-chain pricing.** A constant-product AMM (CPMM) holds YES and NO outcome tokens. The spot price of YES — between 0 and 1 — is the market-implied probability of YES at any moment.
- **Permissionless market creation.** A factory contract lets anyone seed a new market with collateral and a resolution deadline.
- **Trustless settlement.** Winners redeem 1 USDC per share after the resolver posts the outcome.

The marketing site you see at `/` is the front door; the live market data on it is read directly from the contracts.

---

## How the AMM works (TL;DR)

Each market holds two virtual outcome tokens, **YES** and **NO**, in pool reserves `rY` and `rN`. The invariant `rY × rN = k` is preserved across every trade.

- **1 USDC = 1 YES + 1 NO** (a "complete set"). The contract mints complete sets to the pool whenever a trader buys.
- **Spot price**: `priceYes = rN / (rY + rN)`, `priceNo = rY / (rY + rN)`. They always sum to 1, so the price *is* the market's probability estimate.
- **Buy YES with `dx` USDC**: contract pulls `dx`, mints `dx` complete sets into the pool (`rY += dx`, `rN += dx`), then takes YES out of the pool until the invariant is restored. The trader gets `dx + bonus` YES shares — more than `dx` whenever YES was priced below 0.5.
- **Sell YES**: reverse — solve the CPMM quadratic, return USDC.
- **Resolve & redeem**: after expiry, the resolver picks YES or NO. Winners call `redeem()` for 1 USDC per share. The seeder reclaims the winning-side pool reserve via `claimSeed()`.

This is the same shape as Polymarket's CPMM; Prequel's contract is a from-scratch v0.1 implementation.

---

## Architecture

```
prequel/
├── app/                        Next.js 16 marketing site (React 19, RSC)
├── components/                 Editorial sections, GSAP/Lenis animations
├── lib/
│   ├── viem.ts                 Public client, chain selection (Hardhat / Sepolia)
│   ├── contracts.ts            Factory + market ABIs
│   └── markets.ts              getLiveMarkets() — multicall read helper
└── contracts/                  Hardhat 2 workspace (TypeScript + viem)
    ├── contracts/
    │   ├── MockUSDC.sol        6-decimal ERC20 collateral for local testing
    │   ├── PreMarket.sol       CPMM YES/NO market w/ resolve + redeem + claimSeed
    │   └── PreMarketFactory.sol Deploys, funds, indexes markets
    └── test/PreMarket.t.ts     hardhat-toolbox-viem test suite (7 specs)
```

The Next.js app reads market state via viem only — no wallet connector, no signer. A trading UI with wallet-connect is the next milestone (see *Roadmap*).

---

## Tech stack

| Layer        | Choice                                                                 |
|--------------|------------------------------------------------------------------------|
| Contracts    | Solidity 0.8.24, Hardhat 2, `@nomicfoundation/hardhat-toolbox-viem`    |
| Testing      | Mocha + Chai (chai-as-promised), viem clients via hardhat-viem         |
| Front-end    | Next.js 16 (Turbopack), React 19, Tailwind CSS 4                       |
| Web3 reads   | viem 2.x — `publicClient.multicall`, no wagmi until writes land        |
| Animation    | GSAP (ScrollTrigger), Lenis (smooth scroll), Framer Motion             |
| UI primitives| Radix UI, lucide-react                                                 |
| Hosting      | Static-rendered marketing page (Vercel-ready)                          |

---

## Quickstart

### Prerequisites
- Node.js **20.x** (Hardhat 2 doesn't officially support 21+ — works on 23 but emits a warning)
- npm 10+

### Front-end

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run lint
```

By default the page renders the curated fallback markets. To wire live on-chain reads, see *Environment variables* below.

### Contracts

```bash
cd contracts
npm install
npx hardhat compile
npx hardhat test     # 7 passing
```

### Local end-to-end (contracts + UI)

```bash
# terminal 1 — local chain with funded accounts
cd contracts
npx hardhat node

# terminal 2 — deploy contracts (script TBD, see Roadmap)

# terminal 3 — front-end with the local RPC
cd ..
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545 \
NEXT_PUBLIC_CHAIN_ID=31337 \
NEXT_PUBLIC_FACTORY_ADDRESS=0x... \
npm run dev
```

---

## Environment variables

The front-end reads three optional env vars. All are public (`NEXT_PUBLIC_…`) because they're consumed in the browser:

| Variable                       | Required | Default                  | Notes                                                        |
|--------------------------------|----------|--------------------------|--------------------------------------------------------------|
| `NEXT_PUBLIC_RPC_URL`          | optional | `http://127.0.0.1:8545`  | JSON-RPC endpoint for reads                                  |
| `NEXT_PUBLIC_CHAIN_ID`         | optional | `31337` (Hardhat)        | Set to `11155111` for Sepolia                                |
| `NEXT_PUBLIC_FACTORY_ADDRESS`  | optional | unset → fallback markets | `PreMarketFactory` deployment address                        |

When `NEXT_PUBLIC_FACTORY_ADDRESS` is unset or the RPC fails, the Live Markets section gracefully falls back to the curated copy bundled with the marketing page. The section header switches between `ON-CHAIN` and `PREVIEW` so it's visible at a glance.

---

## Contract API

### `PreMarketFactory`

| Function                                                | Returns       | Notes                                              |
|---------------------------------------------------------|---------------|----------------------------------------------------|
| `createMarket(string question, uint256 expiry, uint256 seed)` | `address`     | Caller pre-approves `seed` collateral.             |
| `markets(uint256 i)`                                    | `address`     | Indexed access to deployed markets.                |
| `marketsLength()`                                       | `uint256`     |                                                    |
| `allMarkets()`                                          | `address[]`   | Convenience for indexers.                          |

### `PreMarket`

| Function                                          | Stateful | Notes                                                    |
|---------------------------------------------------|---------:|----------------------------------------------------------|
| `buy(bool yes, uint256 amountIn, uint256 minOut)` |       ✓  | Slippage-protected CPMM buy.                             |
| `sell(bool yes, uint256 amountIn, uint256 minOut)`|       ✓  | Slippage-protected CPMM sell.                            |
| `resolve(Outcome o)`                              |       ✓  | Resolver-only, after `expiry`.                           |
| `redeem()`                                        |       ✓  | Winners only, post-resolution.                           |
| `claimSeed()`                                     |       ✓  | Creator reclaims the winning-side pool reserve.          |
| `priceYes()` / `priceNo()`                        |          | 1e18-scaled spot prices; always sum to 1e18.             |
| `reserveYes` / `reserveNo`                        |          | Public state.                                            |
| `yesBalance[holder]` / `noBalance[holder]`        |          | Public state.                                            |

Events: `Initialized`, `Bought`, `Sold`, `Resolved`, `Redeemed`, `SeedClaimed`.

---

## Front-end sections

| Section            | ID            | Description                                                                 |
|--------------------|---------------|-----------------------------------------------------------------------------|
| Hero               | `#hero`       | Split-flap "PREQUEL" headline, tagline, Start Trading / Market Activity CTAs|
| Live Markets       | `#signals`    | Horizontal strip of cards; on-chain when configured, curated when not       |
| Trading Categories | `#work`       | Asymmetric grid of categories (DeFi, Infra, AI, Gaming, NFT, RWA)           |
| Why Pre-Markets    | `#principles` | Four pillars: Early Discovery, Liquidity First, Market Signals, Proven Model|
| Colophon           | `#colophon`   | Platform, stack, typography, markets, trading links                         |

Side navigation tracks the visible section via IntersectionObserver and scrolls on click.

---

## Roadmap

- **Wallet-connect + trading UI.** Wagmi + RainbowKit modal, a `/trade/[market]` route with a buy/sell panel and position table.
- **Public testnet deployment.** Hardhat Ignition module for `MockUSDC` + `PreMarketFactory` to Sepolia, plus a verified-contracts task.
- **LMSR market.** Optional second AMM mode for thin markets where CPMM's slippage curve is too punishing.
- **Resolver decentralisation.** Replace the single-resolver address with a UMA-style optimistic oracle or a multisig committee.
- **Indexer + subgraph.** Off-load the multicall read path to a subgraph so the homepage scales beyond ~50 markets.

---

## Project status

**v0.1 / Beta.** Contracts pass their full test suite (7/7). The front-end type-checks and ships a clean production build. No mainnet deployment yet; do not send real funds to any address you find in this repo.

---

## License

Proprietary. © 2025 Prequel. All rights reserved.
