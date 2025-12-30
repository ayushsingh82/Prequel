"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

export function TradingPanel() {
  const [orderType, setOrderType] = useState("Limit")
  const [leverage, setLeverage] = useState("Isolated")
  const [isBuy, setIsBuy] = useState(true)
  const [price, setPrice] = useState("0.24")
  const [size, setSize] = useState("0")
  const [tif, setTif] = useState("GTC")

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <h2 className="font-mono text-sm font-semibold text-foreground mb-4">Trade</h2>

        {/* Order Type Selector */}
        <div className="flex gap-1 mb-4">
          {["Market", "Limit", "Pro"].map((type) => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={cn(
                "flex-1 px-3 py-2 rounded font-mono text-xs transition-colors",
                orderType === type
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted/30 text-muted-foreground hover:text-foreground"
              )}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Leverage Selector */}
        <div className="flex gap-1">
          {["Isolated", "3x", "Classic"].map((lev) => (
            <button
              key={lev}
              onClick={() => setLeverage(lev)}
              className={cn(
                "flex-1 px-3 py-2 rounded font-mono text-xs transition-colors",
                leverage === lev
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted/30 text-muted-foreground hover:text-foreground"
              )}
            >
              {lev}
            </button>
          ))}
        </div>
      </div>

      {/* Trading Form */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Buy/Sell Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsBuy(true)}
            className={cn(
              "flex-1 px-4 py-3 rounded font-mono text-sm font-semibold transition-colors",
              isBuy
                ? "bg-green-500/20 text-green-500 border border-green-500/50"
                : "bg-muted/30 text-muted-foreground border border-transparent"
            )}
          >
            Buy
          </button>
          <button
            onClick={() => setIsBuy(false)}
            className={cn(
              "flex-1 px-4 py-3 rounded font-mono text-sm font-semibold transition-colors",
              !isBuy
                ? "bg-red-500/20 text-red-500 border border-red-500/50"
                : "bg-muted/30 text-muted-foreground border border-transparent"
            )}
          >
            Sell
          </button>
        </div>

        {/* Available to Trade */}
        <div className="p-3 bg-muted/20 rounded border border-border/30">
          <div className="flex justify-between items-center mb-1">
            <span className="font-mono text-xs text-muted-foreground">Available to Trade</span>
            <span className="font-mono text-sm text-foreground">0.00 USDC</span>
          </div>
        </div>

        {/* Current Position */}
        <div className="p-3 bg-muted/20 rounded border border-border/30">
          <div className="flex justify-between items-center mb-1">
            <span className="font-mono text-xs text-muted-foreground">Current Position</span>
            <span className="font-mono text-sm text-foreground">0 MEGA</span>
          </div>
        </div>

        {/* Price Input */}
        <div>
          <label className="block font-mono text-xs text-muted-foreground mb-2">
            Price (USDC)
          </label>
          <div className="relative">
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border/30 rounded font-mono text-sm focus:outline-none focus:border-accent"
              placeholder="0.00"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground hover:text-foreground">
              Mid
            </button>
          </div>
        </div>

        {/* Size Input */}
        <div>
          <label className="block font-mono text-xs text-muted-foreground mb-2">
            Size
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="flex-1 px-3 py-2 bg-background border border-border/30 rounded font-mono text-sm focus:outline-none focus:border-accent"
              placeholder="0"
            />
            <select className="px-3 py-2 bg-background border border-border/30 rounded font-mono text-sm focus:outline-none focus:border-accent">
              <option>USDC</option>
              <option>%</option>
            </select>
          </div>
        </div>

        {/* TIF Selector */}
        <div>
          <label className="block font-mono text-xs text-muted-foreground mb-2">TIF</label>
          <div className="flex gap-2">
            {["GTC", "IOC", "FOK"].map((tifOption) => (
              <button
                key={tifOption}
                onClick={() => setTif(tifOption)}
                className={cn(
                  "flex-1 px-3 py-2 rounded font-mono text-xs transition-colors",
                  tif === tifOption
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted/30 text-muted-foreground hover:text-foreground"
                )}
              >
                {tifOption}
              </button>
            ))}
          </div>
        </div>

        {/* Connect Button */}
        <button className="w-full px-4 py-3 bg-accent text-accent-foreground rounded font-mono text-sm font-semibold hover:bg-accent/90 transition-colors">
          Connect Wallet
        </button>

        {/* Trading Info */}
        <div className="space-y-2 pt-4 border-t border-border/30">
          <div className="flex justify-between items-center">
            <span className="font-mono text-xs text-muted-foreground">Liquidation Price</span>
            <span className="font-mono text-xs text-foreground">N/A</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono text-xs text-muted-foreground">Order Value</span>
            <span className="font-mono text-xs text-foreground">N/A</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono text-xs text-muted-foreground">Margin Required</span>
            <span className="font-mono text-xs text-foreground">N/A</span>
          </div>
        </div>
      </div>
    </div>
  )
}

