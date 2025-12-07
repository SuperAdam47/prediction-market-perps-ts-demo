import { useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { MarketChart } from "@/components/MarketChart";
import { TradingSidebar } from "@/components/TradingSidebar";
import { MarketImage } from "@/components/MarketImage";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useTrading } from "@/contexts/TradingContext";
import { useMarkets } from "@/hooks/useMarkets";
import { useLiquidationCheck } from "@/hooks/useLiquidationCheck";
import { INITIAL_MARKETS } from "@/constants/markets";
import { ActivePositions } from "@/components/ActivePositions";

const MarketDetail = () => {
  const { marketId } = useParams<{ marketId: string }>();
  const navigate = useNavigate();
  const { balance, positions, recharge, openPosition, closePosition, updatePositionProbabilities } = useTrading();
  const { markets, getMarketById } = useMarkets(INITIAL_MARKETS, positions);

  const market = useMemo(() => getMarketById(marketId || ""), [getMarketById, marketId]);

  // Use liquidation check hook
  useLiquidationCheck({ positions, markets, onLiquidate: closePosition });

  // Update position probabilities when market updates
  useEffect(() => {
    if (!market) return;
    // Skip if no positions to avoid unnecessary updates
    if (positions.length === 0) return;
    
    positions.forEach((pos) => {
      if (pos.marketId === marketId) {
        updatePositionProbabilities(pos.marketId, market.currentProbability);
      }
    });
  }, [market, marketId, positions, updatePositionProbabilities]);

  // Redirect if market not found
  useEffect(() => {
    if (!market) {
      toast({
        title: "Market not found",
        description: "Redirecting to home page...",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [market, navigate]);

  const handleRecharge = useCallback(() => {
    recharge();
  }, [recharge]);

  const handleTrade = useCallback((marketId: string, amount: number, leverage: number, direction: "long" | "short") => {
    const market = markets.find((m) => m.id === marketId);
    if (!market) return;

    openPosition(marketId, market.title, amount, leverage, direction, market.currentProbability);
  }, [markets, openPosition]);

  const handleClosePosition = useCallback((positionId: string) => {
    closePosition(positionId);
  }, [closePosition]);

  if (!market) {
    return null;
  }

  const currentProb = market.currentProbability;
  const change = currentProb - market.probability;

  return (
    <div className="min-h-screen">
      <Navbar balance={balance} onRecharge={handleRecharge} />
      
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Back Button */}
        <Button
          onClick={() => navigate("/")}
          variant="ghost"
          className="mb-4 hover:bg-secondary/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Markets
        </Button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Section - Detail and Chart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Market Header */}
            <div className="glass-card rounded-xl p-6 animate-in fade-in slide-in-from-top-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/50 text-secondary-foreground">
                      {market.category}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">{market.title}</h1>
                  
                  <div className="flex items-center gap-6 mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Current Probability</div>
                      <div className={`text-4xl font-bold text-primary transition-all duration-300`}>
                        {currentProb.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Change</div>
                      <div className={`flex items-center gap-1 text-xl font-semibold ${change > 0 ? "text-bullish" : change < 0 ? "text-bearish" : "text-muted-foreground"}`}>
                        {change > 0 ? <TrendingUp className="w-5 h-5" /> : change < 0 ? <TrendingDown className="w-5 h-5" /> : null}
                        <span>{change > 0 ? "+" : ""}{change.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Market Image - Same width as chart, 1/2 height (200px) */}
                  <MarketImage category={market.category} title={market.title} size="large" />
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="glass-card rounded-xl p-4 sm:p-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-lg font-bold mb-4">Price Chart</h2>
              <MarketChart probability={currentProb} height={400} />
            </div>

            {/* Active Positions for this market */}
            <ActivePositions 
              positions={positions.filter(p => p.marketId === marketId)} 
              onClose={handleClosePosition} 
            />
          </div>

          {/* Right Sidebar - Trading */}
          <div className="lg:col-span-1">
            <TradingSidebar
              marketId={market.id}
              marketTitle={market.title}
              currentProbability={currentProb}
              balance={balance}
              onTrade={handleTrade}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketDetail;

