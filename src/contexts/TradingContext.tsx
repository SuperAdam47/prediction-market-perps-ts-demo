import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";

export interface Position {
  id: string;
  marketId: string;
  marketTitle: string;
  direction: "long" | "short";
  leverage: number;
  amount: number;
  entryProb: number;
  currentProb: number;
}

interface TradingContextType {
  balance: number;
  positions: Position[];
  recharge: () => void;
  openPosition: (marketId: string, marketTitle: string, amount: number, leverage: number, direction: "long" | "short", entryProb: number) => void;
  closePosition: (positionId: string) => void;
  updatePositionProbabilities: (marketId: string, currentProb: number) => void;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export function TradingProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem("trading_balance");
    return saved ? parseFloat(saved) : 10;
  });
  
  const [positions, setPositions] = useState<Position[]>(() => {
    const saved = localStorage.getItem("trading_positions");
    return saved ? JSON.parse(saved) : [];
  });

  // Save balance to localStorage
  const saveBalance = useCallback((newBalance: number) => {
    setBalance(newBalance);
    localStorage.setItem("trading_balance", newBalance.toString());
  }, []);

  // Save positions to localStorage
  const savePositions = useCallback((newPositions: Position[]) => {
    setPositions(newPositions);
    localStorage.setItem("trading_positions", JSON.stringify(newPositions));
  }, []);

  const recharge = useCallback(() => {
    const newBalance = balance + 10;
    saveBalance(newBalance);
    toast({
      title: "Balance Recharged",
      description: "+10 BNB added to your virtual wallet",
    });
  }, [balance, saveBalance]);

  const openPosition = useCallback((
    marketId: string,
    marketTitle: string,
    amount: number,
    leverage: number,
    direction: "long" | "short",
    entryProb: number
  ) => {
    if (amount > balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough BNB for this trade",
        variant: "destructive",
      });
      return;
    }

    const newPosition: Position = {
      id: `${marketId}-${Date.now()}`,
      marketId,
      marketTitle,
      direction,
      leverage,
      amount,
      entryProb,
      currentProb: entryProb,
    };

    const newPositions = [...positions, newPosition];
    savePositions(newPositions);
    saveBalance(balance - amount);

    toast({
      title: "Trade Opened",
      description: `${direction.toUpperCase()} ${leverage}x on "${marketTitle}"`,
    });
  }, [balance, positions, saveBalance, savePositions]);

  const closePosition = useCallback((positionId: string) => {
    // Use functional updates to avoid stale closure issues
    setPositions((prevPositions) => {
      const position = prevPositions.find((p) => p.id === positionId);
      if (!position) {
        return prevPositions;
      }

      const pnlPercent =
        position.direction === "long"
          ? ((position.currentProb - position.entryProb) / position.entryProb) * 100
          : ((position.entryProb - position.currentProb) / position.entryProb) * 100;
      const pnl = (position.amount * position.leverage * pnlPercent) / 100;

      const newPositions = prevPositions.filter((p) => p.id !== positionId);
      
      // Update balance using functional update
      setBalance((prevBalance) => {
        const newBalance = prevBalance + position.amount + pnl;
        localStorage.setItem("trading_balance", newBalance.toString());
        return newBalance;
      });
      
      // Save positions to localStorage (empty array if no positions remain)
      localStorage.setItem("trading_positions", JSON.stringify(newPositions));

      toast({
        title: "Position Closed",
        description: `${pnl >= 0 ? "Profit" : "Loss"}: ${pnl >= 0 ? "+" : ""}${pnl.toFixed(2)} BNB`,
        variant: pnl >= 0 ? "default" : "destructive",
      });

      return newPositions;
    });
  }, []);

  const updatePositionProbabilities = useCallback((marketId: string, currentProb: number) => {
    setPositions((prevPositions) => {
      // Don't update if positions array is empty (all positions deleted)
      if (prevPositions.length === 0) {
        return prevPositions;
      }
      
      const updated = prevPositions.map((pos) => {
        if (pos.marketId === marketId) {
          return { ...pos, currentProb };
        }
        return pos;
      });
      localStorage.setItem("trading_positions", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <TradingContext.Provider
      value={{
        balance,
        positions,
        recharge,
        openPosition,
        closePosition,
        updatePositionProbabilities,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
}

export function useTrading() {
  const context = useContext(TradingContext);
  if (context === undefined) {
    throw new Error("useTrading must be used within a TradingProvider");
  }
  return context;
}

