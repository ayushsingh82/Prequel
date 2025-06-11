"use client"

import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { getLiveMarkets, type LiveMarket } from "@/lib/markets"

gsap.registerPlugin(ScrollTrigger)

type Signal = {
  date: string
  title: string
  note: string
  priceYes?: number
  address?: string
}

const fallbackSignals: Signal[] = [
  { date: "2025.09.30", title: "AI Protocol Launch", note: "Will Project X launch a token by EOY?", priceYes: 0.52 },
  { date: "2025.10.15", title: "DeFi Yield Platform", note: "Points-to-token ratio above 1:10?", priceYes: 0.61 },
  { date: "2025.11.01", title: "Layer 2 Scaling", note: "ZK rollup mainnet before block 22M?", priceYes: 0.44 },
  { date: "2025.08.20", title: "NFT Marketplace", note: "Creator-first marketplace TGE?", priceYes: 0.48 },
  { date: "2025.12.01", title: "Gaming Infrastructure", note: "On-chain gaming token launch?", priceYes: 0.71 },
]

function formatExpiry(unix: number) {
  const d = new Date(unix * 1000)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`
}

function liveToSignal(m: LiveMarket): Signal {
  return {
    date: formatExpiry(m.expiry),
    title: m.question.length > 40 ? m.question.slice(0, 40) + "…" : m.question,
    note: m.resolved ? "Resolved" : "Active",
    priceYes: m.priceYes,
    address: m.address,
  }
}

function PriceBar({ pYes }: { pYes: number }) {
  return (
    <div className="flex items-center gap-3">
      {/* YES bar */}
      <div className="flex-1 h-1 bg-border relative overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-accent transition-all duration-700"
          style={{ width: `${pYes * 100}%` }}
        />
      </div>
      <span className="font-mono text-xs text-accent font-semibold w-10 text-right">
        {(pYes * 100).toFixed(0)}¢
      </span>
      <div className="flex-1 h-1 bg-border relative overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-muted-foreground/40 transition-all duration-700"
          style={{ width: `${(1 - pYes) * 100}%` }}
        />
      </div>
      <span className="font-mono text-xs text-muted-foreground w-10">
        {((1 - pYes) * 100).toFixed(0)}¢
      </span>
    </div>
  )
}

export function SignalsSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const headerRef   = useRef<HTMLDivElement>(null)
  const tableRef    = useRef<HTMLDivElement>(null)
  const [signals, setSignals]   = useState<Signal[]>(fallbackSignals)
  const [source, setSource]     = useState<"on-chain" | "curated">("curated")
  const [hovered, setHovered]   = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    getLiveMarkets()
      .then((live) => {
        if (cancelled || !live || live.length === 0) return
        setSignals(live.map(liveToSignal))
        setSource("on-chain")
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        x: -50, opacity: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: headerRef.current, start: "top 85%", toggleActions: "play none none reverse" },
      })
      const rows = tableRef.current?.querySelectorAll("tr")
      if (rows) {
        gsap.from(rows, {
          x: -30, opacity: 0, duration: 0.5, stagger: 0.06, ease: "power3.out",
          scrollTrigger: { trigger: tableRef.current, start: "top 85%", toggleActions: "play none none reverse" },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [signals])

  return (
    <section ref={sectionRef} id="signals" className="relative py-28 px-6 md:px-16">
      {/* Header row */}
      <div ref={headerRef} className="flex items-end justify-between mb-10">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">01 / Markets</span>
          <h2 className="mt-2 font-[var(--font-display)] text-5xl md:text-6xl tracking-tight">
            LIVE MARKETS
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-2 border border-border px-3 py-1.5">
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              source === "on-chain" ? "bg-accent animate-pulse" : "bg-muted-foreground",
            )}
          />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {source === "on-chain" ? "On-Chain" : "Preview"}
          </span>
        </div>
      </div>

      {/* Market table */}
      <div className="border border-border overflow-x-auto">
        {/* Table header */}
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-border bg-secondary/30">
          <span className="col-span-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">#</span>
          <span className="col-span-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Market</span>
          <span className="col-span-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Expiry</span>
          <span className="col-span-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">YES / NO Price</span>
          <span className="col-span-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground text-right">Trade</span>
        </div>

        <div ref={tableRef}>
          {signals.map((signal, i) => (
            <div
              key={i}
              className={cn(
                "grid grid-cols-12 gap-4 items-center px-5 py-4 border-b border-border/40 last:border-b-0 transition-colors duration-150 cursor-pointer",
                hovered === i ? "bg-accent/5" : "bg-transparent hover:bg-secondary/20",
              )}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="col-span-1 font-mono text-xs text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="col-span-4 flex flex-col gap-0.5 min-w-0">
                <span className={cn("font-mono text-sm truncate transition-colors duration-150", hovered === i ? "text-accent" : "text-foreground")}>
                  {signal.title}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground truncate">{signal.note}</span>
              </div>
              <span className="col-span-2 font-mono text-xs text-muted-foreground">
                {signal.date}
              </span>
              <div className="col-span-4">
                {typeof signal.priceYes === "number" ? (
                  <PriceBar pYes={signal.priceYes} />
                ) : (
                  <span className="font-mono text-xs text-muted-foreground">—</span>
                )}
              </div>
              <div className="col-span-1 flex justify-end">
                <span
                  className={cn(
                    "font-mono text-[10px] uppercase tracking-widest transition-colors duration-150",
                    hovered === i ? "text-accent" : "text-muted-foreground",
                  )}
                >
                  →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
