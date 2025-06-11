"use client"

import { useEffect, useRef } from "react"
import { ScrambleTextOnHover } from "@/components/scramble-text"
import { SplitFlapText, SplitFlapMuteToggle, SplitFlapAudioProvider } from "@/components/split-flap-text"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { label: "Markets Live",   value: "12+" },
  { label: "Avg. Liquidity", value: "$84K" },
  { label: "Settlements",    value: "100%" },
  { label: "Chains",         value: "1" },
]

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const statsRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return
    const ctx = gsap.context(() => {
      // parallax fade-out on scroll
      gsap.to(contentRef.current, {
        y: -80,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "60% top",
          scrub: 1,
        },
      })
      // stats stagger in
      if (statsRef.current) {
        gsap.from(statsRef.current.children, {
          y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power3.out", delay: 0.8,
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center pt-14 pb-0 text-center overflow-hidden"
    >
      {/* Background orange radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 60%, oklch(0.72 0.22 42 / 0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Ticker tape */}
      <div className="absolute top-14 left-0 right-0 border-y border-border/40 overflow-hidden py-2 bg-background/60 backdrop-blur-sm">
        <div className="ticker-track gap-16 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          {[...Array(2)].flatMap(() => [
            "Project X — YES 52¢",
            "Protocol Y — YES 61¢",
            "Airdrop Z — NO 44¢",
            "Token Launch A — YES 48¢",
            "Milestone B — YES 71¢",
            "Pre-Market C — NO 38¢",
            "TGE Date D — YES 55¢",
          ]).map((t, i) => (
            <span key={i} className="inline-flex items-center gap-4">
              <span className="w-1 h-1 rounded-full bg-accent inline-block" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div ref={contentRef} className="relative z-10 flex flex-col items-center px-6 mt-10">
        {/* Eye-brow tag */}
        <div className="mb-8 flex items-center gap-3 border border-accent/30 bg-accent/5 px-4 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
            Pre-Token Price Discovery Platform
          </span>
        </div>

        {/* Split-flap headline */}
        <SplitFlapAudioProvider>
          <div>
            <SplitFlapText text="PREQUEL" speed={80} />
            <div className="mt-3 flex justify-center">
              <SplitFlapMuteToggle />
            </div>
          </div>
        </SplitFlapAudioProvider>

        {/* Sub-headline */}
        <p className="mt-6 max-w-xl font-mono text-sm text-muted-foreground leading-relaxed">
          Trade YES / NO on token launches, milestones, and unlocks.
          Constant-product AMM pricing. On-chain settlement.
        </p>

        {/* CTA row */}
        <div className="mt-10 flex items-center gap-4 flex-wrap justify-center">
          <a
            href="#signals"
            onClick={(e) => { e.preventDefault(); document.getElementById("signals")?.scrollIntoView({ behavior: "smooth" }) }}
            className="group flex items-center gap-3 bg-accent px-7 py-3 font-mono text-[12px] uppercase tracking-widest text-accent-foreground font-semibold hover:opacity-90 transition-opacity glow-orange"
          >
            <ScrambleTextOnHover text="Start Trading" as="span" duration={0.5} />
          </a>
          <a
            href="#work"
            onClick={(e) => { e.preventDefault(); document.getElementById("work")?.scrollIntoView({ behavior: "smooth" }) }}
            className="flex items-center gap-3 border border-border px-7 py-3 font-mono text-[12px] uppercase tracking-widest text-muted-foreground hover:border-accent hover:text-accent transition-all duration-200"
          >
            Explore Markets
          </a>
        </div>
      </div>

      {/* Stats bar */}
      <div
        ref={statsRef}
        className="absolute bottom-0 left-0 right-0 grid grid-cols-2 md:grid-cols-4 border-t border-border/50"
      >
        {STATS.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center justify-center py-5 border-r border-border/30 last:border-r-0 gap-1 hover:bg-accent/5 transition-colors duration-200"
          >
            <span className="font-[var(--font-display)] text-2xl md:text-3xl text-accent tracking-wide">
              {s.value}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
