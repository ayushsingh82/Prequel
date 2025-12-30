"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const timeIntervals = ["15m", "30m", "1h", "4h", "1d"]

export function TradingChart() {
  const [selectedInterval, setSelectedInterval] = useState("15m")

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Chart Header */}
      <div className="p-4 border-b border-border/30 flex items-center justify-between">
        <div>
          <h2 className="font-mono text-sm font-semibold text-foreground">PRE/USDC</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-lg text-foreground">$0.24</span>
            <span className="font-mono text-sm text-green-500">+15.2%</span>
          </div>
        </div>

        {/* Time Interval Selector */}
        <div className="flex items-center gap-1 bg-muted/30 rounded p-1">
          {timeIntervals.map((interval) => (
            <button
              key={interval}
              onClick={() => setSelectedInterval(interval)}
              className={cn(
                "px-3 py-1 rounded font-mono text-xs transition-colors",
                selectedInterval === interval
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {interval}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 relative bg-muted/5 flex items-center justify-center">
        <div className="text-center">
          <div className="font-mono text-sm text-muted-foreground mb-2">Trading View Chart</div>
          <div className="font-mono text-xs text-muted-foreground/60">
            Chart integration placeholder ({selectedInterval} interval)
          </div>
        </div>

        {/* Placeholder chart visualization */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 200" preserveAspectRatio="none">
          <polyline
            points="0,180 50,160 100,140 150,120 200,100 250,110 300,90 350,80 400,70"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Order Book / Depth Chart (optional bottom section) */}
      <div className="h-32 border-t border-border/30 p-4">
        <div className="font-mono text-xs text-muted-foreground mb-2">Order Book</div>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="text-red-500 font-mono">Bids</div>
            <div className="space-y-1 mt-1">
              {[0.241, 0.240, 0.239].map((price, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-foreground">{price.toFixed(3)}</span>
                  <span className="text-muted-foreground">1.2K</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-green-500 font-mono">Asks</div>
            <div className="space-y-1 mt-1">
              {[0.242, 0.243, 0.244].map((price, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-foreground">{price.toFixed(3)}</span>
                  <span className="text-muted-foreground">0.8K</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

