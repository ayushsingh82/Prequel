"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const timeIntervals = ["15m", "30m", "1h", "4h", "1d"]

const orderBookData = {
  asks: [
    { price: 0.24335, size: 593, total: 2178 },
    { price: 0.24304, size: 474, total: 1586 },
    { price: 0.24280, size: 315, total: 1112 },
    { price: 0.24263, size: 158, total: 797 },
    { price: 0.24255, size: 118, total: 639 },
    { price: 0.24249, size: 79, total: 521 },
    { price: 0.24248, size: 121, total: 442 },
    { price: 0.24218, size: 40, total: 321 },
    { price: 0.24215, size: 100, total: 280 },
    { price: 0.24214, size: 84, total: 180 },
  ],
  bids: [
    { price: 0.24106, size: 96, total: 96 },
    { price: 0.24056, size: 79, total: 79 },
    { price: 0.24012, size: 150, total: 229 },
    { price: 0.24000, size: 36, total: 265 },
    { price: 0.23813, size: 79, total: 345 },
    { price: 0.23782, size: 100, total: 444 },
    { price: 0.23714, size: 234, total: 678 },
    { price: 0.23712, size: 149, total: 827 },
    { price: 0.23709, size: 292, total: 1119 },
  ],
}

export function TradingChart() {
  const [selectedInterval, setSelectedInterval] = useState("15m")
  const [activeTab, setActiveTab] = useState<"orderbook" | "trades">("orderbook")

  return (
    <div className="h-full flex bg-background">
      {/* Main Chart Area */}
      <div className="flex-1 flex flex-col">
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
      </div>

      {/* Right Sidebar - Order Book */}
      <div className="w-80 border-l border-foreground/20 flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-border/30">
          <button
            onClick={() => setActiveTab("orderbook")}
            className={cn(
              "flex-1 px-4 py-2 font-mono text-xs transition-colors",
              activeTab === "orderbook"
                ? "bg-accent/20 text-accent border-b-2 border-accent"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Order Book
          </button>
          <button
            onClick={() => setActiveTab("trades")}
            className={cn(
              "flex-1 px-4 py-2 font-mono text-xs transition-colors",
              activeTab === "trades"
                ? "bg-accent/20 text-accent border-b-2 border-accent"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Trades
          </button>
        </div>

        {activeTab === "orderbook" ? (
          <div className="flex-1 overflow-y-auto">
            {/* Header */}
            <div className="p-2 border-b border-border/30">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-1">
                <div className="flex-1 text-right">Price</div>
                <div className="flex-1 text-right">Size (USDC)</div>
                <div className="flex-1 text-right">Total (USDC)</div>
              </div>
            </div>

            {/* Asks (Sell Orders) */}
            <div className="space-y-0">
              {orderBookData.asks.map((order, i) => (
                <div
                  key={`ask-${i}`}
                  className="flex items-center justify-between p-1 hover:bg-red-500/10 cursor-pointer"
                >
                  <div className="flex-1 text-right font-mono text-xs text-red-500">{order.price.toFixed(5)}</div>
                  <div className="flex-1 text-right font-mono text-xs text-foreground">{order.size.toLocaleString()}</div>
                  <div className="flex-1 text-right font-mono text-xs text-muted-foreground">
                    {order.total.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Spread */}
            <div className="p-2 border-y border-border/30 bg-muted/20">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground">Spread</span>
                <div className="text-right">
                  <div className="font-mono text-xs text-foreground">0.00050</div>
                  <div className="font-mono text-[10px] text-muted-foreground">0.208%</div>
                </div>
              </div>
            </div>

            {/* Bids (Buy Orders) */}
            <div className="space-y-0">
              {orderBookData.bids.map((order, i) => (
                <div
                  key={`bid-${i}`}
                  className="flex items-center justify-between p-1 hover:bg-green-500/10 cursor-pointer"
                >
                  <div className="flex-1 text-right font-mono text-xs text-green-500">{order.price.toFixed(5)}</div>
                  <div className="flex-1 text-right font-mono text-xs text-foreground">{order.size.toLocaleString()}</div>
                  <div className="flex-1 text-right font-mono text-xs text-muted-foreground">
                    {order.total.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 p-4">
            <div className="font-mono text-xs text-muted-foreground text-center">Trades will appear here</div>
          </div>
        )}
      </div>
    </div>
  )
}

