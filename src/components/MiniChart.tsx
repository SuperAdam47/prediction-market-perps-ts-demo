import { useEffect, useRef, useState } from "react";

interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
  time: number;
}

interface CandlestickChartProps {
  probability: number;
  onPriceChange?: (closePrice: number) => void;
}

export function MiniChart({ probability, onPriceChange }: CandlestickChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [candles, setCandles] = useState<Candle[]>([]);

  // Generate initial candles
  useEffect(() => {
    if (candles.length === 0) {
      const initialCandles: Candle[] = [];
      let currentPrice = probability;
      const now = Date.now();
      
      for (let i = 30; i >= 0; i--) {
        const open = currentPrice;
        const volatility = 1.5;
        const change = (Math.random() - 0.5) * volatility * 2;
        const close = Math.max(1, Math.min(99, open + change));
        const high = Math.max(open, close) + Math.random() * volatility;
        const low = Math.min(open, close) - Math.random() * volatility;
        
        initialCandles.push({
          open: Math.max(1, Math.min(99, open)),
          high: Math.max(1, Math.min(99, high)),
          low: Math.max(1, Math.min(99, low)),
          close: Math.max(1, Math.min(99, close)),
          time: now - i * 3000,
        });
        
        currentPrice = close;
      }
      
      setCandles(initialCandles);
      // Notify parent of initial price
      if (initialCandles.length > 0 && onPriceChange) {
        onPriceChange(initialCandles[initialCandles.length - 1].close);
      }
    }
  }, [onPriceChange]);

  // Add new candle when probability changes (same logic as MarketChart)
  useEffect(() => {
    if (candles.length === 0) return;

    setCandles((prev) => {
      const lastCandle = prev[prev.length - 1];
      const open = lastCandle.close;
      const close = probability;
      const volatility = 0.8;
      const high = Math.max(open, close) + Math.random() * volatility;
      const low = Math.min(open, close) - Math.random() * volatility;

      const newCandle: Candle = {
        open: Math.max(1, Math.min(99, open)),
        high: Math.max(1, Math.min(99, high)),
        low: Math.max(1, Math.min(99, low)),
        close: Math.max(1, Math.min(99, close)),
        time: Date.now(),
      };

      const newCandles = [...prev.slice(-30), newCandle];
      // Notify parent of price change
      if (onPriceChange) {
        onPriceChange(newCandle.close);
      }
      return newCandles;
    });
  }, [probability, candles.length, onPriceChange]);

  // Continuously generate random candles every 3 seconds (like real-time chart)
  useEffect(() => {
    if (candles.length === 0) return;

    const interval = setInterval(() => {
      setCandles((prev) => {
        if (prev.length === 0) return prev;
        
        const lastCandle = prev[prev.length - 1];
        const open = lastCandle.close;
        // Generate random movement around current probability
        const volatility = 0.8;
        const change = (Math.random() - 0.5) * volatility * 2;
        const close = Math.max(1, Math.min(99, open + change));
        const high = Math.max(open, close) + Math.random() * volatility;
        const low = Math.min(open, close) - Math.random() * volatility;

        const newCandle: Candle = {
          open: Math.max(1, Math.min(99, open)),
          high: Math.max(1, Math.min(99, high)),
          low: Math.max(1, Math.min(99, low)),
          close: Math.max(1, Math.min(99, close)),
          time: Date.now(),
        };

        const newCandles = [...prev.slice(-30), newCandle];
        // Notify parent of price change
        if (onPriceChange) {
          onPriceChange(newCandle.close);
        }
        return newCandles;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [candles.length, onPriceChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length < 2) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 10;
    const chartHeight = height - padding * 2;

    ctx.clearRect(0, 0, width, height);

    const allValues = candles.flatMap((c) => [c.high, c.low]);
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const range = max - min || 1;

    const candleWidth = (width - padding * 2) / candles.length - 2;
    const candleSpacing = (width - padding * 2) / candles.length;

    candles.forEach((candle, index) => {
      const x = padding + index * candleSpacing;
      const openY = padding + chartHeight - ((candle.open - min) / range) * chartHeight;
      const closeY = padding + chartHeight - ((candle.close - min) / range) * chartHeight;
      const highY = padding + chartHeight - ((candle.high - min) / range) * chartHeight;
      const lowY = padding + chartHeight - ((candle.low - min) / range) * chartHeight;

      const isBullish = candle.close >= candle.open;
      const color = isBullish ? "#00FFA3" : "#FF6EC7";
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.abs(closeY - openY) || 1;

      // Draw wick
      ctx.strokeStyle = "#e8ac0a";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2, highY);
      ctx.lineTo(x + candleWidth / 2, lowY);
      ctx.stroke();

      // Draw body
      ctx.fillStyle = color;
      ctx.fillRect(x, bodyTop, candleWidth, bodyHeight);

      // Draw border
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, bodyTop, candleWidth, bodyHeight);
    });

    // Draw horizontal grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
  }, [candles]);

  return (
    <div className="w-full h-24 rounded-lg bg-secondary/30 overflow-hidden border border-border/30">
      <canvas ref={canvasRef} width={400} height={96} className="w-full h-full" />
    </div>
  );
}
