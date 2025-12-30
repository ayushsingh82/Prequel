import { FloatingTicker } from "./components/floating-ticker"
import { TokenList } from "./components/token-list"
import { TradingChart } from "./components/trading-chart"
import { TradingPanel } from "./components/trading-panel"

export default function TradePage() {
  return (
    <div className="relative min-h-screen bg-background">
      <FloatingTicker />
      <div className="flex h-[calc(100vh-40px)] pt-10">
        {/* Left Panel - Token List (1/3 width) */}
        <div className="w-1/3 border-r border-border/30 overflow-y-auto">
          <TokenList />
        </div>

        {/* Middle Panel - Chart */}
        <div className="flex-1 border-r border-border/30 overflow-hidden">
          <TradingChart />
        </div>

        {/* Right Panel - Trading Interface */}
        <div className="w-96 border-l border-border/30 overflow-y-auto">
          <TradingPanel />
        </div>
      </div>
    </div>
  )
}

