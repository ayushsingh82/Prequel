"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const tabs = [
  "Balances",
  "Positions",
  "Open Orders",
  "TWAP",
  "Trade History",
  "Funding History",
  "Order History",
  "All",
]

export function AccountTabs() {
  const [activeTab, setActiveTab] = useState("Balances")

  return (
    <div className="h-full flex flex-col bg-background border-t border-foreground/20">
      {/* Tabs */}
      <div className="flex border-b border-border/30 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 font-mono text-xs whitespace-nowrap transition-colors border-b-2",
              activeTab === tab
                ? "text-accent border-accent bg-accent/10"
                : "text-muted-foreground border-transparent hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="font-mono text-xs text-muted-foreground text-center">
          {activeTab} content will appear here
        </div>
      </div>
    </div>
  )
}

