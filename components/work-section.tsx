"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const categories = [
  {
    id: "01",
    title: "DeFi Protocols",
    tag: "Decentralised Finance",
    description: "Early price discovery for lending, DEX, yield, and derivatives protocols before token launch.",
    markets: 4,
    pct: 38,
  },
  {
    id: "02",
    title: "Infrastructure",
    tag: "Layer 1 & 2",
    description: "Pre-markets for L1s, ZK rollups, and bridge solutions.",
    markets: 3,
    pct: 25,
  },
  {
    id: "03",
    title: "AI & ML",
    tag: "Emerging Tech",
    description: "Trade on-chain AI inference, data markets, and ML protocol launches.",
    markets: 2,
    pct: 17,
  },
  {
    id: "04",
    title: "Gaming",
    tag: "Web3 Gaming",
    description: "Pre-token markets for blockchain gaming and on-chain metaverse projects.",
    markets: 1,
    pct: 8,
  },
  {
    id: "05",
    title: "NFT & Creator",
    tag: "Creator Economy",
    description: "Early markets for NFT launchpads, royalty protocols, and creator infrastructure.",
    markets: 1,
    pct: 7,
  },
  {
    id: "06",
    title: "RWA",
    tag: "Real World Assets",
    description: "Pre-markets for tokenized treasuries, real estate, and commodity protocols.",
    markets: 1,
    pct: 5,
  },
]

export function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef  = useRef<HTMLDivElement>(null)
  const listRef    = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 92%", toggleActions: "play none none none" } },
      )
      const rows = listRef.current?.children
      if (rows) {
        gsap.fromTo(
          rows,
          { x: -30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: "power3.out",
            scrollTrigger: { trigger: listRef.current, start: "top 92%", toggleActions: "play none none none" } },
        )
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="work" className="relative py-28 px-6 md:px-16">
      {/* Header */}
      <div ref={headerRef} className="flex items-end justify-between mb-12">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">02 / Categories</span>
          <h2 className="mt-2 font-[var(--font-display)] text-5xl md:text-6xl tracking-tight">
            TRADING CATEGORIES
          </h2>
        </div>
        <span className="hidden md:block font-mono text-xs text-muted-foreground">
          {categories.reduce((a, c) => a + c.markets, 0)} total markets
        </span>
      </div>

      {/* Row list */}
      <div ref={listRef} className="flex flex-col divide-y divide-border">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={cn(
              "group flex items-center gap-6 py-5 px-4 cursor-pointer transition-colors duration-150",
              active === cat.id ? "bg-accent/5" : "hover:bg-secondary/30",
            )}
            onMouseEnter={() => setActive(cat.id)}
            onMouseLeave={() => setActive(null)}
          >
            {/* Number */}
            <span className="font-mono text-[11px] text-muted-foreground w-6 shrink-0">{cat.id}</span>

            {/* Title + tag */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span
                  className={cn(
                    "font-[var(--font-display)] text-2xl md:text-3xl tracking-tight transition-colors duration-150",
                    active === cat.id ? "text-accent" : "text-foreground",
                  )}
                >
                  {cat.title}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground shrink-0">
                  {cat.tag}
                </span>
              </div>
              <p className="font-mono text-xs text-muted-foreground mt-1 max-w-lg leading-relaxed">
                {cat.description}
              </p>
            </div>

            {/* Share bar */}
            <div className="hidden md:flex flex-col items-end gap-1.5 w-36 shrink-0">
              <div className="w-full h-1 bg-border overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-500",
                    active === cat.id ? "bg-accent" : "bg-muted-foreground/40",
                  )}
                  style={{ width: `${cat.pct}%` }}
                />
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">
                {cat.markets} market{cat.markets !== 1 ? "s" : ""} · {cat.pct}%
              </span>
            </div>

            {/* Arrow */}
            <span
              className={cn(
                "font-mono text-sm transition-all duration-150 shrink-0",
                active === cat.id ? "text-accent translate-x-1" : "text-muted-foreground/30",
              )}
            >
              →
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
