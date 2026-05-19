# Prequel — Completion Plan

The marketing site is complete; the on-chain layer that the UI talks about ("Live Markets", "Start Trading", "pre-token price discovery") does not exist yet. This plan adds the missing pieces: a Hardhat workspace with prediction-market contracts + tests, then wires the front-end to read live data through **viem**.

The data shown in `signals-section.tsx` and `work-section.tsx` is currently hard-coded. After this work, the same surfaces are populated from on-chain reads.

---

## Architecture

```
nextui-starter4/                ← existing Next.js app (UI)
├── app/                        ← marketing page + new /trade route
├── components/                 ← existing sections, new wallet + trade UI
├── lib/
│   ├── viem.ts                 ← public client + chain config (NEW)
│   ├── contracts.ts            ← addresses + ABIs (NEW)
│   └── markets.ts              ← read helpers used by SignalsSection (NEW)
└── contracts/                  ← Hardhat workspace (NEW)
    ├── contracts/
    │   ├── MockUSDC.sol        ← 6-decimal ERC20 collateral
    │   ├── PreMarket.sol       ← single binary YES/NO market w/ CPMM
    │   └── PreMarketFactory.sol← deploys + indexes markets
    ├── test/
    │   └── PreMarket.t.ts      ← hardhat + viem tests
    ├── hardhat.config.ts
    └── package.json
```

### Contract design (kept deliberately small)

- **`MockUSDC`** — minimal ERC20 (6 decimals) so tests can fund traders without touching mainnet.
- **`PreMarket`** — one market per pre-token outcome. Holds YES/NO reserves in a constant-product pool (`x * y = k`). Traders pay USDC and receive YES or NO outcome tokens. After expiry the resolver sets the outcome; the winning side redeems 1 USDC per share.
  - `buy(side, amountIn, minOut)` → CPMM swap.
  - `sell(side, amountIn, minOut)` → reverse swap.
  - `resolve(side)` → resolver-only, after `expiry`.
  - `redeem()` → winners only, after `resolve`.
  - `priceYes()` / `priceNo()` → spot price from reserves, scaled 1e18.
- **`PreMarketFactory`** — `createMarket(question, expiry, seedUsdc)`; tracks an array of deployed markets so the front-end can paginate.

### Why CPMM and not LMSR?

LMSR is the textbook pre-market AMM but needs `exp`/`ln` (PRBMath etc.). CPMM gives the same shape of prices for a YES/NO pair, is ~30 lines, and is easy to test deterministically — appropriate for a v0.1 / Beta marker matching the hero copy.

---

## Tasks

### Phase 1 — Hardhat workspace
- [x] Create `contracts/` subdirectory with `package.json`, `tsconfig.json`, `hardhat.config.ts`.
- [x] Pin `hardhat@^2`, `@nomicfoundation/hardhat-toolbox-viem`, `viem`, `typescript`, `chai`, `mocha`.
- [x] Add `.gitignore` covering `cache/`, `artifacts/`, `typechain-types/`, `node_modules/`.

### Phase 2 — Smart contracts
- [x] `MockUSDC.sol` — ERC20 with `mint(address,uint256)` open for tests.
- [x] `PreMarket.sol` — CPMM YES/NO market with buy / sell / resolve / redeem.
- [x] `PreMarketFactory.sol` — `createMarket`, `markets(uint)`, `marketsLength()`.

### Phase 3 — Tests (hardhat + viem)
- [x] `deploys with seeded reserves and reports a 50/50 price`.
- [x] `buy(YES) raises priceYes, lowers priceNo, respects minOut`.
- [x] `sell returns collateral and moves price back toward seed`.
- [x] `resolve before expiry reverts; non-resolver reverts`.
- [x] `winners redeem 1 USDC per share, losers redeem 0`.
- [x] `factory creates markets and indexes them`.

### Phase 4 — Front-end integration (viem)
- [x] Install `viem` in the Next.js app.
- [x] `lib/viem.ts` exporting a `publicClient` (Hardhat local + Sepolia ready).
- [x] `lib/contracts.ts` exporting the factory address + ABIs from Hardhat artifacts.
- [x] `lib/markets.ts` — `getLiveMarkets()` reading factory + each market's question / expiry / `priceYes`.
- [x] Refactor `SignalsSection` to render on-chain markets when available, falling back to the existing hard-coded list (keeps SSG output stable when no RPC is configured).
- [x] Add `NEXT_PUBLIC_RPC_URL` + `NEXT_PUBLIC_FACTORY_ADDRESS` env handling in `lib/viem.ts`.

### Phase 5 — Verify
- [x] `npx hardhat compile` clean.
- [x] `npx hardhat test` — all specs green.
- [x] `npm run build` in the Next.js app — type-checks with the new viem code paths.

---

## Out of scope (deliberately)

- Wallet-connect / write transactions in the UI. The marketing surface only needs reads; a "Start Trading" CTA already exists but wiring writes implies wagmi + a wallet picker, which doubles the surface area. Left as a follow-up.
- Deploy scripts to a public testnet. The Hardhat suite proves correctness against the in-memory chain; a deploy task is a one-liner to add later.
- LMSR / dynamic-fee AMM. CPMM is enough to demonstrate price discovery for a v0.1.
