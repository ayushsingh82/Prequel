"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const tokens = [
  { symbol: "PRE", name: "PreKalshi", price: 0.24, change: 15.2, volume: "1.2M" },
  { symbol: "MEGA", name: "Mega Protocol", price: 1.45, change: -3.1, volume: "890K" },
  { symbol: "AI", name: "AI Protocol", price: 0.89, change: 8.7, volume: "2.1M" },
  { symbol: "DEFI", name: "DeFi Yield", price: 2.34, change: 12.4, volume: "1.5M" },
  { symbol: "L2", name: "Layer 2 Scale", price: 0.67, change: -5.2, volume: "980K" },
  { symbol: "NFT", name: "NFT Market", price: 0.45, change: 6.3, volume: "750K" },
  { symbol: "GAME", name: "Gaming Infra", price: 1.12, change: 9.8, volume: "1.1M" },
  { symbol: "RWA", name: "Real World Assets", price: 3.21, change: -2.1, volume: "650K" },
]

export function TokenList() {
  const [selectedToken, setSelectedToken] = useState("PRE")

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border/30">
        <Link href="/" className="block mb-3">
          <h1 className="font-mono text-lg font-bold text-accent hover:text-accent/80 transition-colors">
            PREKALSHI
          </h1>
        </Link>
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">Markets</h2>
        <input
          type="text"
          placeholder="Search tokens..."
          className="w-full px-3 py-2 bg-background border border-border/30 rounded font-mono text-sm focus:outline-none focus:border-accent"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {tokens.map((token) => {
            const isSelected = selectedToken === token.symbol
            const isPositive = token.change >= 0

            return (
              <button
                key={token.symbol}
                onClick={() => setSelectedToken(token.symbol)}
                className={cn(
                  "w-full p-3 rounded mb-1 transition-all duration-200 text-left",
                  isSelected
                    ? "bg-accent/10 border border-accent/50"
                    : "hover:bg-muted/30 border border-transparent"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-foreground">{token.symbol}</span>
                    <span className="font-mono text-xs text-muted-foreground">{token.name}</span>
                  </div>
                  <span className={cn("font-mono text-xs", isPositive ? "text-green-500" : "text-red-500")}>
                    {isPositive ? "+" : ""}
                    {token.change.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-foreground">${token.price.toFixed(2)}</span>
                  <span className="font-mono text-xs text-muted-foreground">Vol: {token.volume}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

