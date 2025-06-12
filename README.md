# Prequel

> **Early price discovery for pre-token projects.**

Prequel is an on-chain prediction-market venue where traders take YES / NO positions on the outcomes of yet-to-launch crypto projects — token launches, milestone deadlines, airdrop snapshots — and settle trustlessly against a constant-product AMM.

---

## Table of Contents

1. [What it does](#what-it-does)
2. [How the AMM works](#how-the-amm-works)
3. [Repository layout](#repository-layout)
4. [Tech stack](#tech-stack)
5. [Quickstart](#quickstart)
6. [Local end-to-end (contracts + UI)](#local-end-to-end)
7. [Sepolia testnet deploy](#sepolia-testnet-deploy)
8. [Environment variables](#environment-variables)
9. [Contract API reference](#contract-api-reference)
10. [Front-end sections](#front-end-sections)
11. [Test suite](#test-suite)
12. [Roadmap](#roadmap)
13. [Project status](#project-status)

---

## What it does

Pre-token projects have no clean instrument for price discovery today. Discord polls, OTC whispers, and points-program leaderboards substitute for what should be a real market. Prequel replaces that:

| Feature | Detail |
|---|---|
| **Binary outcome markets** | Every market resolves YES or NO. *"Will Project X mint its TGE by Sep 30?"* |
| **Continuous on-chain pricing** | CPMM holds YES and NO tokens. Spot price of YES ∈ (0, 1) = market probability. |
| **Permissionless creation** | Factory contract lets anyone seed a market with collateral + a deadline. |
| **Trustless settlement** | Winners redeem 1 USDC per share after the resolver posts the outcome. |
| **Live on-chain reads** | Marketing site pulls market data via `viem` multicall — no wallet required. |

---

## How the AMM works

Each market holds reserves `rY` (YES) and `rN` (NO). The invariant **`rY × rN = k`** is preserved across every trade.

```
Spot price of YES  =  rN / (rY + rN)
Spot price of NO   =  rY / (rY + rN)
priceYes + priceNo = 1  (always)
```

**Buying YES with `dx` USDC**

1. Contract pulls `dx` USDC from the trader.
2. Mints `dx` complete sets into the pool: `rY += dx`, `rN += dx`.
3. Solves the CPMM invariant — pulls YES out until `rY × rN = k` again.
4. Trader receives `dx + bonus` YES shares (bonus > 0 when YES < 0.5).

**Selling YES** reverses the quadratic: solve for how much USDC to return, adjust reserves.

**Resolution & redemption**

After `expiry`, the resolver calls `resolve(YES | NO)`. Winners call `redeem()` for exactly 1 USDC per share. The seeder recovers the winning-side pool reserve via `claimSeed()`.

> Same shape as Polymarket's CPMM. Prequel's contract is a clean-room v0.1 implementation.

---

## Repository layout

```
prequel/
│
├── app/                            Next.js 16 pages (React 19, RSC)
│   ├── layout.tsx                  Root layout, font loading, metadata
│   ├── page.tsx                    Single-page marketing app
│   └── globals.css                 Design tokens, dark theme, orange accent
│
├── components/
│   ├── side-nav.tsx                Fixed top navigation bar
│   ├── hero-section.tsx            Full-viewport hero with ticker + stats bar
│   ├── signals-section.tsx         Live market data table (on-chain / fallback)
│   ├── work-section.tsx            Trading category grid
│   ├── principles-section.tsx      Why pre-markets — 4-card grid
│   ├── colophon-section.tsx        Footer with links and stack info
│   ├── split-flap-text.tsx         Mechanical split-flap headline animation
│   ├── scramble-text.tsx           Hover-triggered character scramble
│   ├── highlight-text.tsx          Scroll-parallax highlight text
│   ├── animated-noise.tsx          SVG noise texture overlay
│   ├── bitmap-chevron.tsx          Pixel-art chevron icon
│   ├── draw-text.tsx               SVG path draw-on animation
│   └── smooth-scroll.tsx           Lenis smooth scroll wrapper
│
├── lib/
│   ├── viem.ts                     Public viem client + chain config
│   ├── contracts.ts                Factory + PreMarket hand-trimmed ABIs
│   └── markets.ts                  getLiveMarkets() — multicall read helper
│
└── contracts/                      Hardhat 2 workspace
    ├── contracts/
    │   ├── MockUSDC.sol            6-decimal ERC20 for local testing
    │   ├── PreMarket.sol           CPMM binary market (buy/sell/resolve/redeem)
    │   └── PreMarketFactory.sol    Deploys, funds, and indexes markets
    ├── scripts/
    │   └── deploy.ts               Deploy + seed two sample markets, print .env snippet
    ├── test/
    │   └── PreMarket.t.ts          12-spec test suite (hardhat-toolbox-viem)
    └── hardhat.config.ts           Hardhat + localhost + Sepolia + gas reporter
```

---

## Tech stack

| Layer | Technology |
|---|---|
| Smart contracts | Solidity 0.8.24, Hardhat 2, `@nomicfoundation/hardhat-toolbox-viem` |
| Contract testing | Mocha + Chai + viem wallet clients via hardhat-viem |
| Front-end framework | Next.js 16 (Turbopack), React 19 |
| Styling | Tailwind CSS 4, IBM Plex Sans / Mono, Bebas Neue |
| Web3 reads | viem 2.x — `publicClient.multicall`, no wallet signer on marketing page |
| Animations | GSAP 3 (ScrollTrigger), Lenis (smooth scroll), Framer Motion |
| UI primitives | Radix UI, lucide-react |
| Deployment | Vercel (static rendering, zero server) |

---

## Quickstart

### Prerequisites

```
Node.js  ≥ 20.x   (Hardhat 2 warns on 21+, runs fine on 23)
npm      ≥ 10.x
```

### 1 — Install and run the front-end

```bash
npm install
npm run dev        # → http://localhost:3000
npm run build      # production build
npm run lint
```

Without any env vars the page renders **curated preview markets**. Wire live data by following the steps below.

### 2 — Compile and test contracts

```bash
cd contracts
npm install
npx hardhat compile
npx hardhat test
```

Expected output:

```
  PreMarket
    ✔ deploys with seeded reserves and reports a 50/50 price
    ✔ buy(YES) raises priceYes, lowers priceNo, respects minOut
    ✔ sell returns collateral and moves price back toward seed
    ✔ resolve before expiry reverts; non-resolver reverts
    ✔ winners redeem 1 USDC per share, losers redeem 0
    ✔ creator reclaims winning-side seed after resolution
    ✔ double-redeem is blocked
    ✔ sell reverts when balance is insufficient
    ✔ claimSeed reverts for non-creator
    ✔ buy and sell on NO side work symmetrically
    ✔ priceYes + priceNo == 1e18 after multiple trades

  PreMarketFactory
    ✔ creates markets and indexes them

  12 passing
```

### 3 — Gas report (optional)

```bash
cd contracts
REPORT_GAS=true npx hardhat test
```

---

## Local end-to-end

Run the three commands in three separate terminal tabs.

```bash
# ── Terminal 1: persistent local chain ────────────────────────────────
cd contracts
npx hardhat node
# Hardhat prints 20 funded accounts and listens on http://127.0.0.1:8545

# ── Terminal 2: deploy + seed two sample markets ──────────────────────
cd contracts
npx hardhat run scripts/deploy.ts --network localhost
# Prints:
#   MockUSDC        : 0x…
#   PreMarketFactory: 0x…
#   [0] 0x…  YES=50.0¢  "Will Project X launch a token before end of Q3 2025?"
#   [1] 0x…  YES=50.0¢  "Will Protocol Y airdrop snapshot include holders before block 20000000?"
#
#   NEXT_PUBLIC_FACTORY_ADDRESS=0x…   ← copy this

# ── Terminal 3: Next.js with live on-chain reads ──────────────────────
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545 \
NEXT_PUBLIC_CHAIN_ID=31337 \
NEXT_PUBLIC_FACTORY_ADDRESS=<paste address> \
npm run dev
# → http://localhost:3000
# The Live Markets section badge switches from PREVIEW → ON-CHAIN
```

Or save the three vars to `.env.local` in the project root and just run `npm run dev`.

---

## Sepolia testnet deploy

```bash
# Set credentials
export DEPLOYER_PRIVATE_KEY=0x…          # account with Sepolia ETH
export SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/…
export ETHERSCAN_API_KEY=…               # optional, for contract verification

cd contracts
npx hardhat run scripts/deploy.ts --network sepolia
```

Then set the three `NEXT_PUBLIC_…` vars in Vercel (or `.env.local`) to point at the Sepolia deployment:

```
NEXT_PUBLIC_RPC_URL=<your Sepolia RPC>
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_FACTORY_ADDRESS=<factory address from deploy output>
```

---

## Environment variables

All vars are `NEXT_PUBLIC_` — they are consumed in the browser.

| Variable | Required | Default | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_RPC_URL` | optional | `http://127.0.0.1:8545` | JSON-RPC endpoint for reads |
| `NEXT_PUBLIC_CHAIN_ID` | optional | `31337` (Hardhat) | `11155111` for Sepolia |
| `NEXT_PUBLIC_FACTORY_ADDRESS` | optional | unset → fallback copy | `PreMarketFactory` deployment address |

When `NEXT_PUBLIC_FACTORY_ADDRESS` is unset or the RPC fails, the page falls back to curated copy and shows a `PREVIEW` badge. No errors are thrown.

---

## Contract API reference

### `PreMarketFactory`

Deployed once per environment. Holds a shared `collateral` (USDC) and `resolver` address.

| Function | Signature | Returns | Notes |
|---|---|---|---|
| Create market | `createMarket(string question, uint256 expiry, uint256 seed)` | `address` | Caller pre-approves `seed` to factory. |
| Read by index | `markets(uint256 i)` | `address` | |
| Count | `marketsLength()` | `uint256` | |
| All at once | `allMarkets()` | `address[]` | Convenience for indexers. |

Events: `MarketCreated(address market, address creator, string question, uint256 expiry, uint256 seed)`

---

### `PreMarket`

One contract per outcome question.

| Function | Signature | Stateful | Notes |
|---|---|---|---|
| Buy | `buy(bool yes, uint256 amountIn, uint256 minOut)` | ✓ | Slippage-protected CPMM buy. |
| Sell | `sell(bool yes, uint256 amountIn, uint256 minOut)` | ✓ | Reverse CPMM swap. |
| Resolve | `resolve(Outcome o)` | ✓ | Resolver-only. Requires `block.timestamp ≥ expiry`. |
| Redeem | `redeem()` | ✓ | Winners only. Returns 1 USDC per share. |
| Claim seed | `claimSeed()` | ✓ | Creator reclaims winning-side pool reserve. |
| Price reads | `priceYes()` / `priceNo()` | — | 1e18-scaled. Always sum to 1e18. |
| State | `reserveYes` / `reserveNo` | — | Public. |
| Balances | `yesBalance[addr]` / `noBalance[addr]` | — | Public. |

Events: `Initialized`, `Bought`, `Sold`, `Resolved`, `Redeemed`, `SeedClaimed`

---

### `MockUSDC`

Minimal 6-decimal ERC20 for local testing. The `mint(address, uint256)` function is open — do not deploy to mainnet.

---

## Front-end sections

| Section | Anchor | Description |
|---|---|---|
| Hero | `#hero` | Split-flap headline, ticker tape, stats bar (markets, liquidity, settlement, chains) |
| Live Markets | `#signals` | Data table — market question, expiry, YES / NO price bars. On-chain or curated fallback. |
| Trading Categories | `#work` | 2-column category grid: DeFi, Infra, AI, Gaming, NFT, RWA |
| Why Pre-Markets | `#principles` | 4-card grid with stat callouts: Early Discovery, Liquidity First, Market Signals, Proven Model |
| About | `#colophon` | Footer — platform links, contract names, stack, network, copyright |

The top nav bar tracks the active section via `IntersectionObserver` and underlines the matching link.

---

## Test suite

**12 / 12 passing** · `contracts/test/PreMarket.t.ts` · hardhat-toolbox-viem

| # | Description |
|---|---|
| 1 | Deploys with seeded reserves and reports a 50/50 price |
| 2 | `buy(YES)` raises priceYes, lowers priceNo, respects minOut slippage guard |
| 3 | `sell` returns collateral and moves price back toward seed |
| 4 | `resolve` before expiry reverts; non-resolver reverts |
| 5 | Winners redeem 1 USDC per share; losers get nothing |
| 6 | Creator reclaims winning-side seed after resolution |
| 7 | Double-redeem is blocked (balance zeroed after first redeem) |
| 8 | `sell` reverts when selling more than held balance |
| 9 | `claimSeed` reverts for non-creator caller |
| 10 | Buy and sell on NO side work symmetrically |
| 11 | `priceYes + priceNo == 1e18` invariant holds after multiple trades |
| 12 | Factory creates multiple markets and indexes them correctly |

---

## Roadmap

- **Wallet-connect + trading UI** — Wagmi + RainbowKit modal, `/trade/[market]` route with buy/sell panel and position table.
- **Hardhat Ignition deploy module** — deterministic deployment to Sepolia with verified contracts on Etherscan.
- **LMSR AMM mode** — optional alternative for thin markets where CPMM slippage is too punishing.
- **Resolver decentralisation** — replace single-address resolver with UMA-style optimistic oracle or multisig committee.
- **Subgraph indexer** — replace multicall read path so the homepage scales beyond ~50 markets without latency.

---

## Project status

**v0.1 / Beta** — Contracts pass all 12 tests. Front-end type-checks and ships a clean production build. No mainnet deployment. Do not send real funds to any address in this repository.

---

## License

Proprietary. © 2025 Prequel. All rights reserved.
