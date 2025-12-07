import { useState, useEffect, useCallback, useMemo } from "react";
import { Market, MarketWithProbability } from "@/constants/markets";
import { Position } from "@/contexts/TradingContext";
import { generateBiasedMovement } from "@/utils/marketUtils";
import { PROBABILITY_UPDATE_INTERVAL } from "@/constants/markets";

export function useMarkets(initialMarkets: Market[], positions: Position[]) {
  const [markets, setMarkets] = useState<MarketWithProbability[]>(
    initialMarkets.map((m) => ({ ...m, currentProbability: m.probability }))
  );

  // Update market probabilities
  useEffect(() => {
    const interval = setInterval(() => {
      setMarkets((prevMarkets) =>
        prevMarkets.map((market) => ({
          ...market,
          currentProbability: generateBiasedMovement(
            market.currentProbability,
            market.id,
            positions,
            prevMarkets
          ),
        }))
      );
    }, PROBABILITY_UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [positions]);

  const updateMarketProbability = useCallback((marketId: string, probability: number) => {
    setMarkets((prev) =>
      prev.map((m) => (m.id === marketId ? { ...m, currentProbability: probability } : m))
    );
  }, []);

  const getMarketById = useCallback(
    (marketId: string) => markets.find((m) => m.id === marketId),
    [markets]
  );

  return {
    markets,
    setMarkets,
    updateMarketProbability,
    getMarketById,
  };
}

