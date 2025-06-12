"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { getLiveMarkets, type LiveMarket } from "@/lib/markets"
import { TOKENS } from "@/lib/token-data"

const CATEGORIES = ["All", "DeFi", "Infrastructure", "AI & ML", "Gaming", "NFT & Creator", "RWA"]

const SHORT_CAT: Record<string, string> = {
  "DeFi": "DeFi",
  "Infrastructure": "Infra",
  "AI & ML": "AI",
  "Gaming": "Gaming",
  "NFT & Creator": "NFT",
  "RWA": "RWA",
}

function PriceBar({ pYes }: { pYes: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-border relative overflow-hidden">
        <div className="absolute left-0 top-0 h-full bg-accent" style={{ width: `${pYes * 100}%` }} />
      </div>
      <span className="font-mono text-xs text-accent font-semibold w-9 text-right">
        {(pYes * 100).toFixed(0)}¢
      </span>
    </div>
  )
}

export function MarketsPage() {
  const [filter, setFilter] = useState("All")
  const [search, setSearch] = useState("")
  const [liveData, setLive] = useState<LiveMarket[] | null>(null)

  useEffect(() => {
    getLiveMarkets().then(setLive).catch(() => {})
  }, [])

  const tokens = TOKENS.filter((t) => {
    const matchCat  = filter === "All" || t.category === filter
    const matchSrch = search === "" ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.ticker.toLowerCase().includes(search.toLowerCase()) ||
      t.question.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSrch
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 h-14 border-b border-border/60 bg-background/90 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-2 h-2 bg-accent glow-orange" />
          <span className="font-[var(--font-display)] text-xl tracking-widest group-hover:text-accent transition-colors duration-200">
            PREQUEL
          </span>
        </Link>
        <div className="flex items-center gap-3">
          {liveData && liveData.length > 0 && (
            <span className="hidden md:flex items-center gap-1.5 font-mono text-[10px] text-accent border border-accent/30 px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              {liveData.length} On-chain
            </span>
          )}
          <Link
            href="/"
            className="font-mono text-[11px] uppercase tracking-widest border border-white/20 bg-transparent text-white px-3 py-1.5 hover:border-white hover:text-white transition-colors duration-150"
          >
            ← Home
          </Link>
        </div>
      </header>

      <main className="px-6 md:px-10 py-12">
        {/* Page title */}
        <div className="mb-10">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Pre-Token Markets</span>
          <h1 className="mt-2 font-[var(--font-display)] text-5xl md:text-6xl tracking-tight">ALL MARKETS</h1>
          <p className="mt-3 font-mono text-xs text-muted-foreground max-w-lg leading-relaxed">
            Every listed project has not yet launched its token. Trade YES / NO on the outcome.
            Prices reflect real-time market probability.
          </p>
        </div>

        {/* Filter + Search */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-all duration-150",
                  filter === cat
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border text-muted-foreground hover:border-accent/50 hover:text-foreground",
                )}
              >
                {SHORT_CAT[cat] ?? cat}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search token or question…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:ml-auto w-full md:w-64 bg-secondary border border-border px-4 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors duration-150"
          />
        </div>

        {/* Table */}
        <div className="border border-border overflow-x-auto">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-border bg-secondary/40">
            {["#", "Token", "Cat", "Question", "Expiry", "YES Price", "TVL", ""].map((h, i) => (
              <span
                key={i}
                className={cn(
                  "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
                  i === 0 ? "col-span-1" :
                  i === 1 ? "col-span-1" :
                  i === 2 ? "col-span-1" :
                  i === 3 ? "col-span-3" :
                  i === 4 ? "col-span-1" :
                  i === 5 ? "col-span-2" :
                  i === 6 ? "col-span-1" :
                             "col-span-2",
                )}
              >
                {h}
              </span>
            ))}
          </div>

          {tokens.length === 0 ? (
            <div className="px-5 py-12 text-center font-mono text-xs text-muted-foreground">
              No markets match your filter.
            </div>
          ) : (
            tokens.map((t, i) => (
              <div
                key={t.ticker}
                className="grid grid-cols-12 gap-4 items-center px-5 py-4 border-b border-border/30 last:border-b-0 hover:bg-accent/5 transition-colors duration-150 group"
              >
                <span className="col-span-1 font-mono text-[11px] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="col-span-1 flex flex-col gap-0.5">
                  <span className="font-mono text-sm font-semibold text-foreground group-hover:text-accent transition-colors duration-150">
                    {t.ticker}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">{t.name}</span>
                </div>
                <div className="col-span-1">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-accent/80 border border-accent/20 bg-accent/5 px-1.5 py-0.5">
                    {SHORT_CAT[t.category] ?? t.category}
                  </span>
                </div>
                <span className="col-span-3 font-mono text-xs text-muted-foreground leading-relaxed">
                  {t.question}
                </span>
                <span className="col-span-1 font-mono text-[11px] text-muted-foreground">
                  {t.expiry}
                </span>
                <div className="col-span-2">
                  <PriceBar pYes={t.priceYes} />
                </div>
                <span className="col-span-1 font-mono text-xs text-muted-foreground">{t.tvl}</span>
                <div className="col-span-2 flex justify-end">
                  <Link
                    href={`/trade/${t.ticker}`}
                    className="font-mono text-[10px] uppercase tracking-widest border border-border px-3 py-1.5 text-muted-foreground group-hover:border-accent group-hover:text-accent transition-all duration-150"
                  >
                    Trade →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        <p className="mt-6 font-mono text-[10px] text-muted-foreground">
          Showing {tokens.length} of {TOKENS.length} markets
          {filter !== "All" && ` in ${filter}`}
          {search && ` matching "${search}"`}
        </p>
      </main>
    </div>
  )
}
