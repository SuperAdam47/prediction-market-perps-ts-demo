import { useState, useCallback, useMemo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTradeValidation } from "@/hooks/useTradeValidation";
import { LEVERAGE_OPTIONS, LIQUIDATION_THRESHOLD } from "@/constants/markets";

interface TradingSidebarProps {
  marketId: string;
  marketTitle: string;
  currentProbability: number;
  balance: number;
  onTrade: (marketId: string, amount: number, leverage: number, direction: "long" | "short") => void;
}

export function TradingSidebar({ marketId, marketTitle, currentProbability, balance, onTrade }: TradingSidebarProps) {
  const [amount, setAmount] = useState("");
  const [leverage, setLeverage] = useState("1");
  const [direction, setDirection] = useState<"long" | "short">("long");

  const handleLeverageChange = useCallback((value: string) => {
    const validValues = ["1", "2", "3", "5", "10"];
    if (value && validValues.includes(value)) {
      setLeverage(value);
    }
  }, []);

  const { validateAndShowError } = useTradeValidation({ balance });

  const handleTrade = useCallback(() => {
    if (!validateAndShowError(amount)) {
      return;
    }

    const tradeAmount = parseFloat(amount);
    const leverageValue = leverage ? parseInt(leverage, 10) : 1;
    const validLeverage = isNaN(leverageValue) || leverageValue < 1 ? 1 : leverageValue;

    onTrade(marketId, tradeAmount, validLeverage, direction);
    setAmount("");
  }, [amount, leverage, direction, marketId, onTrade, validateAndShowError]);

  const tradeAmount = useMemo(() => parseFloat(amount) || 0, [amount]);
  const lev = useMemo(() => parseInt(leverage) || 1, [leverage]);
  const positionSize = useMemo(() => tradeAmount * lev, [tradeAmount, lev]);
  const liquidationThreshold = 80;

  return (
    <div className="glass-card rounded-xl p-4 sm:p-6 space-y-4 sticky top-20">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-1">Trade</h3>
        <h2 className="text-lg font-bold text-foreground line-clamp-2">{marketTitle}</h2>
      </div>

      {/* Direction Toggle */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={() => setDirection("long")}
          variant={direction === "long" ? "default" : "outline"}
          className={`transition-all duration-200 font-semibold border-2 ${
            direction === "long"
              ? "bg-bullish text-white border-bullish hover:bg-bullish/90 hover:border-bullish/80 shadow-md shadow-bullish/30"
              : "border-border/50 text-muted-foreground hover:border-bullish/50 hover:text-bullish hover:bg-bullish/10"
          }`}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Long (YES)
        </Button>
        <Button
          onClick={() => setDirection("short")}
          variant={direction === "short" ? "default" : "outline"}
          className={`transition-all duration-200 font-semibold border-2 ${
            direction === "short"
              ? "bg-bearish text-white border-bearish hover:bg-bearish/90 hover:border-bearish/80 shadow-md shadow-bearish/30"
              : "border-border/50 text-muted-foreground hover:border-bearish/50 hover:text-bearish hover:bg-bearish/10"
          }`}
        >
          <TrendingDown className="w-4 h-4 mr-2" />
          Short (NO)
        </Button>
      </div>

      {/* Amount Input */}
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
          max={balance}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Available: {balance.toFixed(2)} BNB</span>
          <button
            onClick={() => setAmount(balance.toFixed(2))}
            className="text-primary hover:underline"
          >
            Max
          </button>
        </div>
      </div>

      {/* Leverage Select */}
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Leverage</label>
        <Select value={leverage} onValueChange={handleLeverageChange}>
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

      {/* Trade Info */}
      {tradeAmount > 0 && (
        <div className="space-y-2 p-3 rounded-lg bg-secondary/30 border border-border/50">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Margin Required:</span>
            <span className="text-foreground font-medium">{tradeAmount.toFixed(2)} BNB</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Position Size:</span>
            <span className="text-foreground font-medium">{positionSize.toFixed(2)} BNB</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Liquidation:</span>
            <span className="text-destructive font-medium">-{LIQUIDATION_THRESHOLD}%</span>
          </div>
        </div>
      )}

      {/* Current Probability */}
      <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
        <div className="text-xs text-muted-foreground mb-1">Current Probability</div>
        <div className="text-2xl font-bold text-primary">{currentProbability.toFixed(1)}%</div>
      </div>

      {/* Trade Button */}
      <Button
        onClick={handleTrade}
        className={`w-full transition-all duration-200 font-semibold border-2 ${
          direction === "long"
            ? "bg-bullish text-white border-bullish hover:bg-bullish/90 hover:border-bullish/80 shadow-md shadow-bullish/30 hover:shadow-bullish/40 active:scale-[0.98]"
            : "bg-bearish text-white border-bearish hover:bg-bearish/90 hover:border-bearish/80 shadow-md shadow-bearish/30 hover:shadow-bearish/40 active:scale-[0.98]"
        }`}
      >
        {direction === "long" ? (
          <>
            <TrendingUp className="w-4 h-4 mr-2" />
            Buy Long
          </>
        ) : (
          <>
            <TrendingDown className="w-4 h-4 mr-2" />
            Sell Short
          </>
        )}
      </Button>
    </div>
  );
}
