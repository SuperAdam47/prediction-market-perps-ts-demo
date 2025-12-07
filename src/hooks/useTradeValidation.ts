import { useCallback } from "react";
import { toast } from "@/hooks/use-toast";

interface UseTradeValidationProps {
  balance: number;
}

export function useTradeValidation({ balance }: UseTradeValidationProps) {
  const validateTrade = useCallback(
    (amount: string | number): { isValid: boolean; error?: string } => {
      const tradeAmount = typeof amount === "string" ? parseFloat(amount) : amount;

      if (!amount || tradeAmount <= 0) {
        return {
          isValid: false,
          error: "Amount Required - Please enter an amount to place a trade",
        };
      }

      if (tradeAmount > balance) {
        return {
          isValid: false,
          error: `Insufficient Balance - You only have ${balance.toFixed(2)} BNB available`,
        };
      }

      return { isValid: true };
    },
    [balance]
  );

  const validateAndShowError = useCallback(
    (amount: string | number): boolean => {
      const validation = validateTrade(amount);
      if (!validation.isValid && validation.error) {
        toast({
          title: validation.error.includes("Amount") ? "Amount Required" : "Insufficient Balance",
          description: validation.error,
          variant: "destructive",
        });
        return false;
      }
      return validation.isValid;
    },
    [validateTrade]
  );

  return { validateTrade, validateAndShowError };
}

