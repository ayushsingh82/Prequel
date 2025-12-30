"use client"

import { useEffect, useState } from "react"

export function FloatingTicker() {
  const [price, setPrice] = useState(0.1)
  const [change, setChange] = useState(15)

  useEffect(() => {
    // Simulate price updates
    const interval = setInterval(() => {
      setPrice((prev) => prev + (Math.random() - 0.5) * 0.01)
      setChange((prev) => prev + (Math.random() - 0.5) * 2)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const isPositive = change >= 0
  const tickerContent = (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <span className="font-mono text-sm font-semibold text-foreground">PRE</span>
      <span className="font-mono text-sm text-foreground">${price.toFixed(2)}</span>
      <span className={`font-mono text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
        {isPositive ? "↑" : "↓"}
        {Math.abs(change).toFixed(1)}%
      </span>
    </div>
  )

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-10 bg-background/95 backdrop-blur-sm border-b border-border/30 flex items-center overflow-hidden">
      <div className="flex items-center gap-8 px-6" style={{ animation: "scroll 20s linear infinite" }}>
        {tickerContent}
        {tickerContent}
        {tickerContent}
        {tickerContent}
      </div>
      <style jsx global>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  )
}

