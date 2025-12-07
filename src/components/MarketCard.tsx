import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTradeValidation } from "@/hooks/useTradeValidation";
import { useTrading } from "@/contexts/TradingContext";
import { LEVERAGE_OPTIONS, LIQUIDATION_THRESHOLD } from "@/constants/markets";
import { MarketImage } from "./MarketImage";
import { TradeButtons } from "./TradeButtons";
import { MiniChart } from "./MiniChart";

interface MarketCardProps {
  id: string;
  title: string;
  category: string;
  initialProbability: number;
  baseProbability?: number; // Base probability for calculating change
  onTrade: (marketId: string, amount: number, leverage: number, direction: "long" | "short") => void;
}

export const MarketCard = memo(function MarketCard({ id, title, category, initialProbability, baseProbability, onTrade }: MarketCardProps) {
  const navigate = useNavigate();
  const [probability, setProbability] = useState(initialProbability);
  const [chartPrice, setChartPrice] = useState<number | null>(null); // Track chart's last close price
  const [amount, setAmount] = useState("");
  const [leverage, setLeverage] = useState("1");
  const [animateChange, setAnimateChange] = useState<"up" | "down" | null>(null);

  // Calculate change from chart's random data (last candle close) vs base probability
  const baseProb = baseProbability !== undefined ? baseProbability : initialProbability;
  const change = useMemo(() => {
    // Use chart price if available (from random chart data), otherwise use initialProbability
    const currentPrice = chartPrice !== null ? chartPrice : initialProbability;
    return currentPrice - baseProb;
  }, [chartPrice, initialProbability, baseProb]);

  // Handle chart price updates from MiniChart
  const handleChartPriceChange = useCallback((closePrice: number) => {
    setChartPrice(closePrice);
  }, []);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    // Don't navigate if clicking on trade inputs or buttons
    const target = e.target as HTMLElement;
    if (target.closest('input, button, [role="combobox"], .select-trigger')) {
      return;
    }
    navigate(`/market/${id}`);
  }, [navigate, id]);

  // Sync with parent probability changes and animate
  useEffect(() => {
    // Always update probability when initialProbability prop changes
    const prevProb = probability;
    const changeAmount = initialProbability - prevProb;
    
    // Always update probability state when prop changes (for chart updates)
    setProbability(initialProbability);
    
    // Animate if change is significant
    if (Math.abs(changeAmount) > 0.1) {
      setAnimateChange(changeAmount > 0 ? "up" : "down");
      setTimeout(() => setAnimateChange(null), 500);
    }
  }, [initialProbability]);

  const { balance } = useTrading();
  const { validateAndShowError } = useTradeValidation({ balance });

  const handleLeverageChange = useCallback((value: string) => {
    const validValues = LEVERAGE_OPTIONS.map(String);
    if (value && validValues.includes(value)) {
      setLeverage(value);
    }
  }, []);

  const handleTrade = useCallback(
    (direction: "long" | "short") => {
      if (!validateAndShowError(amount)) {
        return;
      }

      const tradeAmount = parseFloat(amount);
      const leverageValue = leverage ? parseInt(leverage, 10) : 1;
      const validLeverage = isNaN(leverageValue) || leverageValue < 1 ? 1 : leverageValue;

      onTrade(id, tradeAmount, validLeverage, direction);
      setAmount("");
    },
    [amount, leverage, id, onTrade, validateAndShowError]
  );

  const tradeAmount = useMemo(() => parseFloat(amount) || 0, [amount]);
  const lev = useMemo(() => parseInt(leverage) || 1, [leverage]);
  const positionSize = useMemo(() => tradeAmount * lev, [tradeAmount, lev]);

  return (
    <div 
      onClick={handleCardClick}
      className="glass-card rounded-xl p-2 sm:p-3 gold-glow-hover hover:scale-[1.02] transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 cursor-pointer"
    >
      {/* Header */}
      <div className="mb-1 sm:mb-2">
        {/* Title and Probability on same row */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base sm:text-lg font-bold text-foreground line-clamp-2 flex-1">{title}</h3>
          <div className={`text-2xl sm:text-3xl font-bold text-primary transition-all duration-300 flex-shrink-0 ${animateChange ? `number-change-${animateChange}` : ""}`}>
            {probability.toFixed(1)}%
          </div>
        </div>
        {/* Category and Change below */}
        <div className="flex items-center justify-between gap-2">
          <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-secondary/50 text-secondary-foreground">
            {category}
          </span>
          <div className={`flex items-center gap-1 text-sm font-semibold justify-end ${change > 0 ? "text-bullish" : change < 0 ? "text-bearish" : "text-muted-foreground"}`}>
            {change > 0 ? <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" /> : change < 0 ? <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" /> : null}
            <span>{change > 0 ? "+" : ""}{change.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Chart Section - Standardized Size */}
      <div className="mb-3 space-y-3">
        {/* Market Image */}
        <MarketImage category={category} title={title} size="small" />
        {/* Mini Chart */}
        <div className="w-full h-[77px]">
          <MiniChart probability={probability} onPriceChange={handleChartPriceChange} />
        </div>
      </div>

      {/* Trade Panel */}
      <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-border/50" onClick={(e) => e.stopPropagation()}>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Amount (BNB)</label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-secondary/50 border-border/50"
              step="0.01"
              min="0"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Leverage</label>
            <Select 
              value={leverage} 
              onValueChange={handleLeverageChange}
            >
              <SelectTrigger className="bg-secondary/50 border-border/50">
                <SelectValue placeholder="Select leverage" />
              </SelectTrigger>
              <SelectContent>
                {LEVERAGE_OPTIONS.map((lev) => (
                  <SelectItem key={lev} value={lev.toString()}>
                    {lev}x
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {tradeAmount > 0 && (
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Margin Required:</span>
              <span className="text-foreground font-medium">{tradeAmount.toFixed(2)} BNB</span>
            </div>
            <div className="flex justify-between">
              <span>Position Size:</span>
              <span className="text-foreground font-medium">{positionSize.toFixed(2)} BNB</span>
            </div>
            <div className="flex justify-between">
              <span>Liquidation:</span>
              <span className="text-destructive font-medium">-{LIQUIDATION_THRESHOLD}%</span>
            </div>
          </div>
        )}

        <TradeButtons onTrade={handleTrade} size="sm" />
      </div>
    </div>
  );
});
