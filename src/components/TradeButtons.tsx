import { TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TradeButtonsProps {
  onTrade: (direction: "long" | "short") => void;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function TradeButtons({ onTrade, disabled = false, size = "md", className = "" }: TradeButtonsProps) {
  const textSize = size === "sm" ? "text-xs sm:text-sm" : "text-sm";
  const iconSize = size === "sm" ? "w-3 h-3 sm:w-4 sm:h-4" : "w-4 h-4";
  const spacing = size === "sm" ? "mr-1.5 sm:mr-2" : "mr-2";

  return (
    <div className={`grid grid-cols-2 gap-2 ${className}`}>
      <Button
        onClick={() => onTrade("long")}
        variant="default"
        className={`bg-bullish text-white border-2 border-bullish hover:bg-bullish/90 hover:border-bullish/80 shadow-md shadow-bullish/30 hover:shadow-bullish/40 active:scale-[0.98] transition-all duration-200 ${textSize} font-semibold`}
      >
        <TrendingUp className={`${iconSize} ${spacing}`} />
        Long (YES)
      </Button>
      <Button
        onClick={() => onTrade("short")}
        variant="default"
        className={`bg-bearish text-white border-2 border-bearish hover:bg-bearish/90 hover:border-bearish/80 shadow-md shadow-bearish/30 hover:shadow-bearish/40 active:scale-[0.98] transition-all duration-200 ${textSize} font-semibold`}
      >
        <TrendingDown className={`${iconSize} ${spacing}`} />
        Short (NO)
      </Button>
    </div>
  );
}

