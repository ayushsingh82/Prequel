import { FloatingTicker } from "./components/floating-ticker"
import { TokenList } from "./components/token-list"
import { TradingChart } from "./components/trading-chart"
import { TradingPanel } from "./components/trading-panel"
import { AccountTabs } from "./components/account-tabs"

export default function TradePage() {
  return (
    <div className="relative min-h-screen bg-background">
      <FloatingTicker />
      <div className="flex flex-col h-[calc(100vh-40px)] pt-10">
        <div className="flex flex-1 min-h-0">
          {/* Left Panel - Token List (narrower width) */}
          <div className="w-56 border-r border-foreground/20 overflow-y-auto">
            <TokenList />
          </div>

          {/* Middle Panel - Chart (gets more space) */}
          <div className="flex-1 border-r border-foreground/20 overflow-hidden flex flex-col">
            <div className="flex-1 min-h-0">
              <TradingChart />
            </div>
            {/* Account Tabs below chart */}
            <div className="h-64 border-t border-foreground/20">
              <AccountTabs />
            </div>
          </div>

          {/* Right Panel - Trading Interface */}
          <div className="w-96 border-l border-foreground/20 overflow-y-auto">
            <TradingPanel />
          </div>
        </div>
      </div>
    </div>
  )
}

