import { memo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Position } from "@/contexts/TradingContext";
import { calculatePnlPercent, calculateLeveragedPnlPercent, calculatePnl } from "@/utils/marketUtils";

interface ActivePositionsProps {
  positions: Position[];
  onClose: (id: string) => void;
}

export const ActivePositions = memo(function ActivePositions({ positions, onClose }: ActivePositionsProps) {
  if (positions.length === 0) return null;

  return (
    <div className="glass-card rounded-xl p-4 sm:p-6 mb-6 animate-in fade-in slide-in-from-top-4">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
        <span className="text-primary">Active Positions</span>
        <span className="text-muted-foreground text-xs sm:text-sm">({positions.length})</span>
      </h2>
      <div className="space-y-2 sm:space-y-3">
        {positions.map((position, index) => {
          // Perp-style PnL calculation using shared utilities
          const pnlPercent = calculatePnlPercent(
            position.entryProb,
            position.currentProb,
            position.direction
          );
          const leveragedPnlPercent = calculateLeveragedPnlPercent(
            position.entryProb,
            position.currentProb,
            position.direction,
            position.leverage
          );
          const pnl = calculatePnl(
            position.amount,
            position.entryProb,
            position.currentProb,
            position.direction,
            position.leverage
          );
          const totalValue = position.amount + pnl;
          const isProfit = pnl > 0;

          // Liquidation warning
          const isNearLiquidation = leveragedPnlPercent <= -60;

          return (
            <div
              key={position.id}
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-secondary/30 border transition-all duration-300 animate-in fade-in slide-in-from-left-4 ${
                isNearLiquidation
                  ? "border-destructive/70 animate-pulse"
                  : "border-border/50 hover:border-primary/30"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={(e) => {
                // Prevent any parent click handlers from interfering
                e.stopPropagation();
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                  <span className="font-semibold text-foreground text-sm sm:text-base line-clamp-2">{position.marketTitle}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                      position.direction === "long"
                        ? "bg-bullish/20 text-bullish border border-bullish/50"
                        : "bg-bearish/20 text-bearish border border-bearish/50"
                    }`}
                  >
                    {position.direction === "long" ? "LONG" : "SHORT"} {position.leverage}x
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                  <span>Margin: {position.amount.toFixed(2)} BNB</span>
                  <span>Size: {(position.amount * position.leverage).toFixed(2)} BNB</span>
                  <span>Entry: {position.entryProb.toFixed(1)}%</span>
                  <span>Current: {position.currentProb.toFixed(1)}%</span>
                </div>
                {isNearLiquidation && (
                  <div className="text-xs text-destructive font-bold mt-2 animate-pulse">
                    ⚠️ LIQUIDATION WARNING - Close position soon!
                  </div>
                )}
              </div>
              <div 
                className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-left sm:text-right">
                  <div className="text-xs text-muted-foreground mb-1">Total Value</div>
                  <div className={`text-base sm:text-lg font-bold transition-colors duration-300 ${isProfit ? "text-bullish" : "text-bearish"}`}>
                    {totalValue.toFixed(2)} BNB
                  </div>
                  <div className={`flex items-center gap-1 text-xs sm:text-sm ${isProfit ? "text-bullish" : "text-bearish"}`}>
                    {isProfit ? <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />}
                    <span>
                      {isProfit ? "+" : ""}
                      {pnl.toFixed(2)} BNB ({leveragedPnlPercent.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log("Closing position:", position.id); // Debug log
                    onClose(position.id);
                  }}
                  className="bg-destructive/20 text-destructive hover:bg-destructive/30 border border-destructive/50 hover:border-destructive/70 transition-all duration-200 font-medium px-3 sm:px-4 py-2 h-auto text-xs sm:text-sm whitespace-nowrap relative z-10"
                  type="button"
                >
                  Close
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
