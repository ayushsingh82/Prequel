"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { Token } from "@/lib/token-data"
import { TOKENS } from "@/lib/token-data"

/* ── Sparkline ────────────────────────────────────────────────────────────── */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 280, h = 60
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 0.01
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w
      const y = h - ((v - min) / range) * (h - 8) - 4
      return `${x},${y}`
    })
    .join(" ")
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16" preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <polyline
        points={`0,${h} ${pts} ${w},${h}`}
        fill={color}
        fillOpacity="0.08"
        stroke="none"
      />
    </svg>
  )
}

/* ── Order book sim ───────────────────────────────────────────────────────── */
function OrderBook({ pYes }: { pYes: number }) {
  const asks = Array.from({ length: 5 }, (_, i) => ({
    price: Math.min(0.99, pYes + 0.02 + i * 0.015).toFixed(2),
    size: (Math.random() * 800 + 200).toFixed(0),
  }))
  const bids = Array.from({ length: 5 }, (_, i) => ({
    price: Math.max(0.01, pYes - 0.01 - i * 0.015).toFixed(2),
    size: (Math.random() * 800 + 200).toFixed(0),
  }))
  return (
    <div className="font-mono text-xs">
      <div className="grid grid-cols-2 gap-4 px-3 py-1.5 border-b border-border text-[10px] uppercase tracking-widest text-muted-foreground">
        <span>Price (YES)</span><span className="text-right">Size (USDC)</span>
      </div>
      {asks.reverse().map((a, i) => (
        <div key={i} className="grid grid-cols-2 gap-4 px-3 py-1 hover:bg-secondary/20">
          <span className="text-red-400">{a.price}</span>
          <span className="text-right text-muted-foreground">{a.size}</span>
        </div>
      ))}
      <div className="grid grid-cols-2 gap-4 px-3 py-2 bg-accent/10 border-y border-accent/30">
        <span className="text-accent font-semibold">{pYes.toFixed(2)}</span>
        <span className="text-right text-accent text-[10px] uppercase tracking-widest">Mid</span>
      </div>
      {bids.map((b, i) => (
        <div key={i} className="grid grid-cols-2 gap-4 px-3 py-1 hover:bg-secondary/20">
          <span className="text-green-400">{b.price}</span>
          <span className="text-right text-muted-foreground">{b.size}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Trade panel ─────────────────────────────────────────────────────────── */
function TradePanel({ token }: { token: Token }) {
  const [side, setSide]       = useState<"YES" | "NO">("YES")
  const [action, setAction]   = useState<"buy" | "sell">("buy")
  const [amount, setAmount]   = useState("")
  const [submitted, setSubmit] = useState(false)

  const price     = action === "buy"
    ? (side === "YES" ? token.priceYes : 1 - token.priceYes)
    : (side === "YES" ? token.priceYes : 1 - token.priceYes)
  const estShares = amount ? (parseFloat(amount) / price).toFixed(2) : "—"
  const estCost   = amount ? parseFloat(amount).toFixed(2) : "—"

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!amount || parseFloat(amount) <= 0) return
    setSubmit(true)
    setTimeout(() => { setSubmit(false); setAmount("") }, 2500)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Buy / Sell toggle */}
      <div className="flex border-b border-border">
        {(["buy", "sell"] as const).map((a) => (
          <button
            key={a}
            onClick={() => setAction(a)}
            className={cn(
              "flex-1 py-3 font-mono text-[11px] uppercase tracking-widest transition-colors duration-150",
              action === a
                ? a === "buy" ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {a}
          </button>
        ))}
      </div>

      <div className="p-5 flex flex-col gap-5 flex-1">
        {/* YES / NO selector */}
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">Outcome</span>
          <div className="flex gap-2">
            {(["YES", "NO"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSide(s)}
                className={cn(
                  "flex-1 py-2.5 font-mono text-sm font-semibold border transition-all duration-150",
                  side === s
                    ? s === "YES"
                      ? "bg-accent border-accent text-accent-foreground"
                      : "bg-secondary border-border text-foreground"
                    : "border-border text-muted-foreground hover:border-foreground/40",
                )}
              >
                {s}
                <span className="block font-mono text-[10px] font-normal opacity-70 mt-0.5">
                  {s === "YES"
                    ? `${(token.priceYes * 100).toFixed(0)}¢`
                    : `${((1 - token.priceYes) * 100).toFixed(0)}¢`}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">
            Amount (USDC)
          </span>
          <input
            type="number"
            min="1"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-secondary border border-border px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors duration-150"
          />
          <div className="flex gap-2 mt-2">
            {["10", "50", "100", "500"].map((v) => (
              <button
                key={v}
                onClick={() => setAmount(v)}
                className="flex-1 font-mono text-[10px] border border-border py-1 text-muted-foreground hover:border-accent hover:text-accent transition-colors duration-150"
              >
                ${v}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="border border-border p-4 flex flex-col gap-2">
          <div className="flex justify-between font-mono text-xs">
            <span className="text-muted-foreground">Avg. price</span>
            <span className="text-foreground">{price.toFixed(3)} USDC / share</span>
          </div>
          <div className="flex justify-between font-mono text-xs">
            <span className="text-muted-foreground">Est. shares</span>
            <span className="text-foreground">{estShares}</span>
          </div>
          <div className="flex justify-between font-mono text-xs">
            <span className="text-muted-foreground">Total cost</span>
            <span className="text-accent font-semibold">${estCost}</span>
          </div>
          <div className="flex justify-between font-mono text-xs">
            <span className="text-muted-foreground">Max payout</span>
            <span className="text-foreground">
              {amount ? `$${parseFloat(amount).toFixed(2)} + profit` : "—"}
            </span>
          </div>
        </div>

        {/* Submit */}
        <form onSubmit={handleSubmit} className="mt-auto">
          <button
            type="submit"
            disabled={!amount || parseFloat(amount) <= 0}
            className={cn(
              "w-full py-3.5 font-mono text-[12px] uppercase tracking-widest font-semibold transition-all duration-200",
              submitted
                ? "bg-green-600 text-white"
                : action === "buy"
                  ? "bg-accent text-accent-foreground hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed glow-orange"
                  : "bg-secondary border border-border text-foreground hover:border-accent disabled:opacity-30 disabled:cursor-not-allowed",
            )}
          >
            {submitted
              ? "Order Placed ✓"
              : `${action === "buy" ? "Buy" : "Sell"} ${side}`}
          </button>
        </form>

        <p className="font-mono text-[9px] text-muted-foreground text-center leading-relaxed">
          Connect wallet to execute on-chain. This UI is a preview — no wallet integration yet.
        </p>
      </div>
    </div>
  )
}

/* ── Recent trades ────────────────────────────────────────────────────────── */
const MOCK_TRADES = [
  { ago: "2m", side: "YES", size: "$340", price: "0.62", type: "buy" },
  { ago: "5m", side: "NO",  size: "$120", price: "0.38", type: "buy" },
  { ago: "9m", side: "YES", size: "$80",  price: "0.61", type: "sell" },
  { ago: "14m",side: "YES", size: "$500", price: "0.60", type: "buy" },
  { ago: "18m",side: "NO",  size: "$200", price: "0.40", type: "buy" },
  { ago: "22m",side: "YES", size: "$150", price: "0.59", type: "buy" },
]

/* ── Related markets ──────────────────────────────────────────────────────── */
function RelatedMarkets({ current }: { current: string }) {
  const related = TOKENS.filter((t) => t.ticker !== current).slice(0, 4)
  return (
    <div className="flex flex-col divide-y divide-border">
      {related.map((t) => (
        <Link
          key={t.ticker}
          href={`/trade/${t.ticker}`}
          className="flex items-center justify-between px-4 py-3 hover:bg-secondary/20 transition-colors duration-150 group"
        >
          <div>
            <span className="font-mono text-sm text-foreground group-hover:text-accent transition-colors duration-150">
              {t.ticker}
            </span>
            <span className="ml-2 font-mono text-[10px] text-muted-foreground">{t.name}</span>
          </div>
          <span className="font-mono text-xs text-accent font-semibold">
            {(t.priceYes * 100).toFixed(0)}¢
          </span>
        </Link>
      ))}
    </div>
  )
}

/* ── Main component ───────────────────────────────────────────────────────── */
export function TradePage({ token }: { token: Token }) {
  const [tab, setTab] = useState<"chart" | "book" | "trades">("chart")

  const shortCat: Record<string, string> = {
    "DeFi": "DeFi", "Infrastructure": "Infra", "AI & ML": "AI",
    "Gaming": "Gaming", "NFT & Creator": "NFT", "RWA": "RWA",
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 flex items-center gap-4 px-6 md:px-10 h-14 border-b border-border/60 bg-background/95 backdrop-blur-md">
        <Link href="/markets" className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors duration-150">
          ← Markets
        </Link>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-3">
          <span className="font-[var(--font-display)] text-xl tracking-wide text-foreground">{token.ticker}</span>
          <span className="font-mono text-xs text-muted-foreground">{token.name}</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent/80 border border-accent/25 bg-accent/5 px-2 py-0.5">
            {shortCat[token.category] ?? token.category}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <span className="hidden md:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Active</span>
          </span>
          <span className="font-[var(--font-display)] text-2xl text-accent">
            {(token.priceYes * 100).toFixed(0)}¢
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">YES</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] min-h-[calc(100vh-56px)] max-w-[1400px] mx-auto w-full px-0">

        {/* ── Left column ── */}
        <div className="flex flex-col border-r border-border/40">

          {/* Market question */}
          <div className="px-8 md:px-12 pt-8 pb-6 border-b border-border/40">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Market Question</span>
            <h1 className="mt-2 font-[var(--font-display)] text-2xl md:text-3xl tracking-tight leading-snug max-w-2xl">
              {token.question}
            </h1>
            <p className="mt-3 font-mono text-xs text-muted-foreground max-w-xl leading-relaxed">
              {token.description}
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-border/40">
            {[
              { label: "YES Price",  value: `${(token.priceYes * 100).toFixed(1)}¢`,  accent: true },
              { label: "NO Price",   value: `${((1 - token.priceYes) * 100).toFixed(1)}¢`, accent: false },
              { label: "Liquidity",  value: token.liquidity, accent: false },
              { label: "Expiry",     value: token.expiry,    accent: false },
            ].map((s) => (
              <div key={s.label} className="flex flex-col gap-1 px-6 py-4 border-r border-border/30 last:border-r-0">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</span>
                <span className={cn("font-[var(--font-display)] text-2xl tracking-tight", s.accent ? "text-accent" : "text-foreground")}>
                  {s.value}
                </span>
              </div>
            ))}
          </div>

          {/* Chart / Order book / Trades tabs */}
          <div className="flex border-b border-border/40">
            {(["chart", "book", "trades"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "px-6 py-3 font-mono text-[11px] uppercase tracking-widest border-b-2 transition-colors duration-150",
                  tab === t
                    ? "border-accent text-accent"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {t === "chart" ? "Price Chart" : t === "book" ? "Order Book" : "Recent Trades"}
              </button>
            ))}
          </div>

          <div className="flex-1 p-8 md:p-12">
            {tab === "chart" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    YES probability — last 12h
                  </span>
                  <span className="font-[var(--font-display)] text-3xl text-accent">
                    {(token.priceYes * 100).toFixed(1)}¢
                  </span>
                </div>
                <div className="border border-border p-4 bg-secondary/10">
                  <Sparkline
                    data={token.history.map((h) => h.yes)}
                    color="oklch(0.72 0.22 42)"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="font-mono text-[10px] text-muted-foreground">12h ago</span>
                    <span className="font-mono text-[10px] text-muted-foreground">Now</span>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  {[
                    { label: "24h Volume", value: token.volume24h },
                    { label: "Total Trades", value: token.trades.toString() },
                    { label: "TVL", value: token.tvl },
                  ].map((s) => (
                    <div key={s.label} className="border border-border p-4">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">{s.label}</span>
                      <span className="font-[var(--font-display)] text-xl text-foreground">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tab === "book" && (
              <div className="border border-border">
                <OrderBook pYes={token.priceYes} />
              </div>
            )}
            {tab === "trades" && (
              <div className="border border-border">
                <div className="grid grid-cols-4 gap-4 px-5 py-3 border-b border-border bg-secondary/30">
                  {["Time", "Side", "Size", "Price"].map((h) => (
                    <span key={h} className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{h}</span>
                  ))}
                </div>
                {MOCK_TRADES.map((tr, i) => (
                  <div key={i} className="grid grid-cols-4 gap-4 px-5 py-3 border-b border-border/20 last:border-b-0 hover:bg-secondary/20">
                    <span className="font-mono text-xs text-muted-foreground">{tr.ago}</span>
                    <span className={cn("font-mono text-xs font-semibold", tr.side === "YES" ? "text-accent" : "text-muted-foreground")}>
                      {tr.side}
                    </span>
                    <span className="font-mono text-xs text-foreground">{tr.size}</span>
                    <span className="font-mono text-xs text-foreground">{tr.price}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Related markets */}
          <div className="border-t border-border/40">
            <div className="px-6 md:px-8 py-4 border-b border-border/30">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Other Markets
              </span>
            </div>
            <RelatedMarkets current={token.ticker} />
          </div>
        </div>

        {/* ── Right column: trade panel ── */}
        <div className="flex flex-col border-t lg:border-t-0">
          <div className="px-5 py-4 border-b border-border/40">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Place Order
            </span>
          </div>
          <TradePanel token={token} />
        </div>

      </div>
    </div>
  )
}
