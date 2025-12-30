"use client"

import { useEffect, useState } from "react"

const tickerTokens = [
  { symbol: "PRE", price: 0.11, change: 11.7 },
  { symbol: "MEGA", price: 1.45, change: -3.1 },
  { symbol: "AI", price: 0.89, change: 8.7 },
  { symbol: "DEFI", price: 2.34, change: 12.4 },
  { symbol: "L2", price: 0.67, change: -5.2 },
  { symbol: "NFT", price: 0.45, change: 6.3 },
  { symbol: "GAME", price: 1.12, change: 9.8 },
  { symbol: "RWA", price: 3.21, change: -2.1 },
  { symbol: "ZK", price: 0.78, change: 14.5 },
  { symbol: "BRIDGE", price: 0.56, change: -1.3 },
  { symbol: "DEX", price: 1.89, change: 7.2 },
  { symbol: "LEND", price: 0.34, change: 5.6 },
  { symbol: "STABLE", price: 0.98, change: -0.5 },
  { symbol: "DAO", price: 0.23, change: 10.3 },
  { symbol: "METAVERSE", price: 0.67, change: 4.2 },
]

export function FloatingTicker() {
  const [tokens, setTokens] = useState(tickerTokens)

  useEffect(() => {
    // Simulate price updates
    const interval = setInterval(() => {
      setTokens((prev) =>
        prev.map((token) => ({
          ...token,
          price: Math.max(0.01, token.price + (Math.random() - 0.5) * 0.02),
          change: token.change + (Math.random() - 0.5) * 1,
        }))
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Create multiple sets for seamless scrolling
  const tickerItems = [...tokens, ...tokens, ...tokens, ...tokens]

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-10 bg-background/95 backdrop-blur-sm border-b border-foreground/20 flex items-center overflow-hidden">
      <div className="flex items-center gap-8 px-6 animate-ticker-scroll">
        {tickerItems.map((token, index) => {
          const isPositive = token.change >= 0
          return (
            <div key={`${token.symbol}-${index}`} className="flex items-center gap-2 whitespace-nowrap">
              <span className="font-mono text-sm font-semibold text-foreground">{token.symbol}</span>
              <span className="font-mono text-sm text-foreground">${token.price.toFixed(2)}</span>
              <span className={`font-mono text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
                {isPositive ? "↑" : "↓"}
                {Math.abs(token.change).toFixed(1)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

