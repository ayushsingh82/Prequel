import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Link from "next/link"
import "./globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Prequel | Early Price Discovery for Pre-Token Projects",
  description:
    "Prequel is a prediction-market venue for pre-token price discovery. Trade YES/NO outcomes on token launches, milestones, and unlocks, settled on-chain.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <div className="flex-1">{children}</div>

        {/* Global footer — shown on every page */}
        <footer className="border-t border-border/40 bg-background">
          <div className="px-6 md:px-10 py-10">
            {/* Brand + tagline */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-10">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-accent glow-orange" />
                <span className="font-[var(--font-display)] text-2xl tracking-widest">PREQUEL</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground border border-border px-2 py-0.5 ml-2">
                  v0.1 Beta
                </span>
              </div>
              <p className="font-mono text-xs text-muted-foreground max-w-sm leading-relaxed">
                Early price discovery for pre-token projects. On-chain prediction markets powered by a constant-product AMM.
              </p>
            </div>

            {/* Link columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
              <div>
                <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-accent mb-4">Platform</h4>
                <ul className="space-y-2.5">
                  <li><Link href="/markets" className="font-mono text-xs text-muted-foreground hover:text-accent transition-colors duration-150">All Markets</Link></li>
                  <li><Link href="/#signals"  className="font-mono text-xs text-muted-foreground hover:text-accent transition-colors duration-150">Live Markets</Link></li>
                  <li><Link href="/#work"     className="font-mono text-xs text-muted-foreground hover:text-accent transition-colors duration-150">Categories</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-accent mb-4">Contracts</h4>
                <ul className="space-y-2.5">
                  <li><span className="font-mono text-xs text-muted-foreground">PreMarket.sol</span></li>
                  <li><span className="font-mono text-xs text-muted-foreground">PreMarketFactory.sol</span></li>
                  <li><span className="font-mono text-xs text-muted-foreground">MockUSDC.sol</span></li>
                </ul>
              </div>
              <div>
                <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-accent mb-4">Stack</h4>
                <ul className="space-y-2.5">
                  <li><span className="font-mono text-xs text-muted-foreground">Next.js 16</span></li>
                  <li><span className="font-mono text-xs text-muted-foreground">Hardhat 2 + viem</span></li>
                  <li><span className="font-mono text-xs text-muted-foreground">Tailwind CSS 4</span></li>
                </ul>
              </div>
              <div>
                <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-accent mb-4">Network</h4>
                <ul className="space-y-2.5">
                  <li><span className="font-mono text-xs text-muted-foreground">Hardhat Local</span></li>
                  <li><span className="font-mono text-xs text-muted-foreground">Sepolia Testnet</span></li>
                  <li><span className="font-mono text-xs text-muted-foreground">Mainnet (soon)</span></li>
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-6 border-t border-border/30">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                © 2025 Prequel. All rights reserved.
              </p>
              <p className="font-mono text-[10px] text-muted-foreground">
                Not production-ready. Do not send real funds.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
