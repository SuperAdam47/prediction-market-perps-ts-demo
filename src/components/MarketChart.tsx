import { useEffect, useRef, useState } from "react";

interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
  time: number;
}

interface MarketChartProps {
  probability: number;
  height?: number;
}

export function MarketChart({ probability, height = 400 }: MarketChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [candles, setCandles] = useState<Candle[]>([]);

  // Generate initial candles
  useEffect(() => {
    if (candles.length === 0) {
      const initialCandles: Candle[] = [];
      let currentPrice = probability;
      const now = Date.now();
      
      for (let i = 100; i >= 0; i--) {
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
    }
  }, []);

  // Add new candle when probability changes
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

      return [...prev.slice(-100), newCandle];
    });
  }, [probability, candles.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length < 2) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${height}px`;

    const width = rect.width;
    const chartHeight = height - 60;
    const padding = 40;
    const chartAreaHeight = chartHeight - padding * 2;

    ctx.clearRect(0, 0, width, height);

    const allValues = candles.flatMap((c) => [c.high, c.low]);
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const range = max - min || 1;

    const candleWidth = Math.max(1, (width - padding * 2) / candles.length - 1);
    const candleSpacing = (width - padding * 2) / candles.length;

    // Draw grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartAreaHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      
      // Draw labels
      const value = max - (range / 5) * i;
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.font = "12px Inter";
      ctx.textAlign = "right";
      ctx.fillText(value.toFixed(1) + "%", padding - 10, y + 4);
    }

    candles.forEach((candle, index) => {
      const x = padding + index * candleSpacing;
      const openY = padding + chartAreaHeight - ((candle.open - min) / range) * chartAreaHeight;
      const closeY = padding + chartAreaHeight - ((candle.close - min) / range) * chartAreaHeight;
      const highY = padding + chartAreaHeight - ((candle.high - min) / range) * chartAreaHeight;
      const lowY = padding + chartAreaHeight - ((candle.low - min) / range) * chartAreaHeight;

      const isBullish = candle.close >= candle.open;
      const color = isBullish ? "#00FFA3" : "#FF6EC7";
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.max(Math.abs(closeY - openY), 1);

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

    // Draw current price line
    const currentPriceY = padding + chartAreaHeight - ((probability - min) / range) * chartAreaHeight;
    ctx.strokeStyle = "#e8ac0a";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding, currentPriceY);
    ctx.lineTo(width - padding, currentPriceY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw current price label
    ctx.fillStyle = "#e8ac0a";
    ctx.font = "bold 14px Inter";
    ctx.textAlign = "left";
    ctx.fillText(`Current: ${probability.toFixed(1)}%`, width - padding - 120, currentPriceY - 5);
  }, [candles, probability, height]);

  return (
    <div className="w-full rounded-lg bg-secondary/30 overflow-hidden border border-border/30">
      <canvas ref={canvasRef} className="w-full" style={{ height: `${height}px` }} />
    </div>
  );
}

