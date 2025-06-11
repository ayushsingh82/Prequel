"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const navItems = [
  { id: "signals",    label: "Markets" },
  { id: "work",       label: "Categories" },
  { id: "principles", label: "Protocol" },
]

export function SideNav() {
  const [activeSection, setActiveSection] = useState("hero")
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id)
        })
      },
      { threshold: 0.3 },
    )
    navItems.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const scroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border/60"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="flex items-center justify-between px-6 md:px-10 h-14">
        {/* Logo */}
        <button
          onClick={() => scroll("hero")}
          className="flex items-center gap-2 group"
        >
          <span className="w-2 h-2 bg-accent glow-orange" />
          <span className="font-[var(--font-display)] text-xl tracking-widest text-foreground group-hover:text-accent transition-colors duration-200">
            PREQUEL
          </span>
        </button>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scroll(id)}
              className={cn(
                "relative px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors duration-200",
                activeSection === id
                  ? "text-accent"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
              {activeSection === id && (
                <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-accent" />
              )}
            </button>
          ))}
        </nav>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/markets"
            className="flex items-center gap-2 bg-black border border-white px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-white font-semibold hover:bg-accent hover:border-accent hover:text-accent-foreground transition-all duration-200"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            All Markets
          </Link>
        </div>
      </div>
    </header>
  )
}
