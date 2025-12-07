import { Position } from "@/contexts/TradingContext";
import { MarketWithProbability, BIAS_FACTOR, LIQUIDATION_THRESHOLD } from "@/constants/markets";

/**
 * Calculate PnL percentage for a position
 */
export function calculatePnlPercent(
  entryProb: number,
  currentProb: number,
  direction: "long" | "short"
): number {
  if (direction === "long") {
    return ((currentProb - entryProb) / entryProb) * 100;
  } else {
    return ((entryProb - currentProb) / entryProb) * 100;
  }
}

/**
 * Calculate leveraged PnL percentage
 */
export function calculateLeveragedPnlPercent(
  entryProb: number,
  currentProb: number,
  direction: "long" | "short",
  leverage: number
): number {
  const pnlPercent = calculatePnlPercent(entryProb, currentProb, direction);
  return pnlPercent * leverage;
}

/**
 * Calculate PnL amount
 */
export function calculatePnl(
  amount: number,
  entryProb: number,
  currentProb: number,
  direction: "long" | "short",
  leverage: number
): number {
  const pnlPercent = calculatePnlPercent(entryProb, currentProb, direction);
  return (amount * leverage * pnlPercent) / 100;
}

/**
 * Generate biased movement for market probability
 */
export function generateBiasedMovement(
  currentProb: number,
  marketId: string,
  userPositions: Position[],
  allMarkets: MarketWithProbability[]
): number {
  const marketPositions = userPositions.filter((p) => p.marketId === marketId);
  
  let bias = 0;
  marketPositions.forEach((pos) => {
    if (pos.direction === "long") {
      bias += BIAS_FACTOR;
    } else {
      bias -= BIAS_FACTOR;
    }
  });

  const baseMove = (Math.random() - 0.5) * 2.5;
  const biasedMove = marketPositions.length > 0 ? baseMove + bias * 0.3 : baseMove;

  return Math.max(1, Math.min(99, currentProb + biasedMove));
}

/**
 * Check if position should be liquidated
 */
export function shouldLiquidate(
  entryProb: number,
  currentProb: number,
  direction: "long" | "short",
  leverage: number
): boolean {
  const leveragedPnlPercent = calculateLeveragedPnlPercent(
    entryProb,
    currentProb,
    direction,
    leverage
  );
  return leveragedPnlPercent <= -LIQUIDATION_THRESHOLD;
}

