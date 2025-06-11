"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const principles = [
  {
    id: "01",
    title: "EARLY DISCOVERY",
    accent: "EARLY",
    description:
      "The market for an asset starts the moment it is announced — not when it lists. Prequel lets traders price pre-token projects 6–12 months before TGE.",
    stat: "6–12 mo",
    statLabel: "Before TGE",
  },
  {
    id: "02",
    title: "LIQUIDITY FIRST",
    accent: "LIQUIDITY",
    description:
      "Constant-product AMM means there is always a price and always a counterparty. Seed collateral bootstraps the market from day one.",
    stat: "CPMM",
    statLabel: "AMM model",
  },
  {
    id: "03",
    title: "MARKET SIGNALS",
    accent: "SIGNALS",
    description:
      "YES price ∈ (0, 1) is the market's real-time probability estimate. Researchers, hedgers, and speculators read the same number.",
    stat: "0–100¢",
    statLabel: "YES range",
  },
  {
    id: "04",
    title: "PROVEN MODEL",
    accent: "PROVEN",
    description:
      "Hyperliquid and Pendle pre-markets found PMF. Prequel applies identical mechanics to the long tail of emerging protocols.",
    stat: "100%",
    statLabel: "On-chain settlement",
  },
]

export function PrinciplesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef  = useRef<HTMLDivElement>(null)
  const gridRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 92%", toggleActions: "play none none none" } },
      )
      const cards = gridRef.current?.children
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: gridRef.current, start: "top 90%", toggleActions: "play none none none" } },
        )
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="principles" className="relative py-28 px-6 md:px-16">
      {/* Header */}
      <div ref={headerRef} className="mb-14">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">03 / Protocol</span>
        <h2 className="mt-2 font-[var(--font-display)] text-5xl md:text-6xl tracking-tight">
          WHY PRE-MARKETS
        </h2>
      </div>

      {/* 2 × 2 grid */}
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border/60">
        {principles.map((p) => (
          <article
            key={p.id}
            className="group relative bg-background p-8 hover:bg-secondary/20 transition-colors duration-200 flex flex-col gap-6"
          >
            {/* Top row: number + stat */}
            <div className="flex items-start justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {p.id}
              </span>
              <div className="text-right">
                <div className="font-[var(--font-display)] text-2xl text-accent leading-none">{p.stat}</div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">{p.statLabel}</div>
              </div>
            </div>

            {/* Title */}
            <h3 className="font-[var(--font-display)] text-3xl md:text-4xl tracking-tight leading-none">
              {p.title.split(" ").map((word, i) => (
                <span
                  key={i}
                  className={word === p.accent
                    ? "text-accent"
                    : "text-foreground group-hover:text-foreground/80 transition-colors duration-200"}
                >
                  {word}{" "}
                </span>
              ))}
            </h3>

            {/* Description */}
            <p className="font-mono text-xs text-muted-foreground leading-relaxed mt-auto">
              {p.description}
            </p>

            {/* Bottom accent line reveal */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </article>
        ))}
      </div>
    </section>
  )
}
