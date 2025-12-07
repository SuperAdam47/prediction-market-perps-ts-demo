import { useEffect } from "react";
import { Position } from "@/contexts/TradingContext";
import { MarketWithProbability } from "@/constants/markets";
import { shouldLiquidate } from "@/utils/marketUtils";
import { toast } from "@/hooks/use-toast";

interface UseLiquidationCheckProps {
  positions: Position[];
  markets: MarketWithProbability[];
  onLiquidate: (positionId: string) => void;
}

export function useLiquidationCheck({ positions, markets, onLiquidate }: UseLiquidationCheckProps) {
  useEffect(() => {
    positions.forEach((pos) => {
      const market = markets.find((m) => m.id === pos.marketId);
      if (!market) return;

      if (
        shouldLiquidate(pos.entryProb, market.currentProbability, pos.direction, pos.leverage)
      ) {
        toast({
          title: "Position Liquidated",
          description: `Your ${pos.direction.toUpperCase()} position on "${pos.marketTitle}" was liquidated`,
          variant: "destructive",
        });
        onLiquidate(pos.id);
      }
    });
  }, [positions, markets, onLiquidate]);
}

