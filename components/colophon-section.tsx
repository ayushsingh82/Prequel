"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const links = [
  {
    heading: "Platform",
    items: [
      { label: "Trade Markets", href: "#signals" },
      { label: "Explore Categories", href: "#work" },
      { label: "Protocol Docs", href: "#" },
    ],
  },
  {
    heading: "Contracts",
    items: [
      { label: "PreMarket.sol", href: "#" },
      { label: "PreMarketFactory.sol", href: "#" },
      { label: "MockUSDC.sol", href: "#" },
    ],
  },
  {
    heading: "Stack",
    items: [
      { label: "Next.js 16", href: "#" },
      { label: "Hardhat 2", href: "#" },
      { label: "viem 2.x", href: "#" },
    ],
  },
  {
    heading: "Network",
    items: [
      { label: "Hardhat Local", href: "#" },
      { label: "Sepolia Testnet", href: "#" },
      { label: "Mainnet (soon)", href: "#" },
    ],
  },
]

export function ColophonSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const innerRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(innerRef.current?.children ?? [], {
        y: 30, opacity: 0, duration: 0.7, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: innerRef.current, start: "top 88%", toggleActions: "play none none reverse" },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="colophon"
      className="relative border-t border-border/40 py-24 px-6 md:px-16"
    >
      {/* Brand row */}
      <div className="flex items-center gap-3 mb-16">
        <span className="w-2.5 h-2.5 bg-accent glow-orange" />
        <span className="font-[var(--font-display)] text-3xl tracking-widest text-foreground">PREQUEL</span>
        <span className="ml-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground border border-border px-2 py-0.5">
          v0.1 Beta
        </span>
      </div>

      {/* Link columns */}
      <div ref={innerRef} className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
        {links.map((col) => (
          <div key={col.heading}>
            <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-accent mb-4">
              {col.heading}
            </h4>
            <ul className="space-y-2.5">
              {col.items.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="font-mono text-xs text-muted-foreground hover:text-accent transition-colors duration-150"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-8 border-t border-border/30">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          © 2025 Prequel — Early price discovery for pre-token projects.
        </p>
        <p className="font-mono text-[10px] text-muted-foreground">
          Contracts audited by tests only. Not production-ready. Do not send real funds.
        </p>
      </div>
    </section>
  )
}
