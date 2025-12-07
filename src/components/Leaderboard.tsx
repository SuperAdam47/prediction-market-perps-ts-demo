import { useState, useEffect } from "react";
import { Trophy, TrendingUp } from "lucide-react";

interface Trader {
  rank: number;
  name: string;
  profit: number; // Store as number for calculations
  accuracy: number; // Store as number for calculations
}

const INITIAL_TRADERS: Omit<Trader, "rank">[] = [
  { name: "CryptoWhale", profit: 124.5, accuracy: 78 },
  { name: "PredictorPro", profit: 98.2, accuracy: 75 },
  { name: "MarketGuru", profit: 87.1, accuracy: 72 },
  { name: "BullRunner", profit: 76.8, accuracy: 71 },
  { name: "OracleAI", profit: 65.3, accuracy: 69 },
];

const Leaderboard = () => {
  const [traders, setTraders] = useState<Trader[]>(() => {
    return INITIAL_TRADERS.map((t, i) => ({ ...t, rank: i + 1 }));
  });

  const [stats, setStats] = useState({
    marketsCreated: 12400,
    tradesSimulated: 28300,
    volume: 2400000,
  });

  useEffect(() => {
    // Update traders with small random changes
    const tradersInterval = setInterval(() => {
      setTraders((prevTraders) => {
        const updated = prevTraders.map((trader) => {
          // Profit changes by -2% to +3% (slight positive bias)
          const profitChange = (Math.random() * 5 - 2) / 100;
          const newProfit = Math.max(10, trader.profit * (1 + profitChange));

          // Accuracy changes by -0.5% to +0.5%
          const accuracyChange = (Math.random() - 0.5) / 100;
          const newAccuracy = Math.max(50, Math.min(95, trader.accuracy + accuracyChange));

          return {
            ...trader,
            profit: newProfit,
            accuracy: newAccuracy,
          };
        });

        // Sort by profit and reassign ranks
        const sorted = [...updated].sort((a, b) => b.profit - a.profit);
        return sorted.map((trader, index) => ({
          ...trader,
          rank: index + 1,
        }));
      });
    }, 4000); // Update every 4 seconds

    // Update stats continuously with increasing values
    const statsInterval = setInterval(() => {
      setStats((prev) => ({
        marketsCreated: prev.marketsCreated + Math.floor(Math.random() * 2) + 1, // Always increase by 1-2
        tradesSimulated: prev.tradesSimulated + Math.floor(Math.random() * 3) + 2, // Always increase by 2-4
        volume: prev.volume + Math.floor(Math.random() * 8000) + 2000, // Always increase by 2K-10K
      }));
    }, 1500); // Update every 1.5 seconds for more frequent updates

    return () => {
      clearInterval(tradersInterval);
      clearInterval(statsInterval);
    };
  }, []);

  const formatProfit = (profit: number): string => {
    return `+$${profit.toFixed(1)}K`;
  };

  const formatAccuracy = (accuracy: number): string => {
    return `${accuracy.toFixed(0)}%`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatWithCommas = (num: number): string => {
    return num.toLocaleString('en-US');
  };

  return (
    <section id="leaderboard" className="container mx-auto px-4 py-16">
      <div className="space-y-8">
        {/* <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold">Top Performers</h2>
          <p className="text-muted-foreground">Demo leaderboard - Track the best predictors</p>
        </div> */}

        {/* <div className="glass-strong rounded-xl overflow-hidden">
          <div className="grid grid-cols-4 gap-4 p-4 bg-muted/30 border-b border-border/50 font-semibold text-sm">
            <div>Rank</div>
            <div>Trader</div>
            <div>Profit</div>
            <div>Accuracy</div>
          </div>

          <div className="divide-y divide-border/50">
            {traders.map((trader) => (
              <div key={trader.name} className="grid grid-cols-4 gap-4 p-4 hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-2">
                  {trader.rank === 1 && <Trophy className="h-5 w-5 text-primary" />}
                  <span className="font-bold">#{trader.rank}</span>
                </div>
                <div className="font-medium">{trader.name}</div>
                <div className="flex items-center gap-1 text-success">
                  <TrendingUp className="h-4 w-4" />
                  {formatProfit(trader.profit)}
                </div>
                <div className="text-muted-foreground">{formatAccuracy(trader.accuracy)}</div>
              </div>
            ))}
          </div>
        </div> */}

        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-xl text-center space-y-2 transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-bold text-primary transition-all duration-500">
              {formatWithCommas(stats.marketsCreated)}
            </div>
            <div className="text-sm text-muted-foreground">Markets Created</div>
          </div>
          <div className="glass p-6 rounded-xl text-center space-y-2 transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-bold text-secondary transition-all duration-500">
              {formatWithCommas(stats.tradesSimulated)}
            </div>
            <div className="text-sm text-muted-foreground">Trades Simulated</div>
          </div>
          <div className="glass p-6 rounded-xl text-center space-y-2 transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-bold text-success transition-all duration-500">
              ${formatWithCommas(stats.volume)}
            </div>
            <div className="text-sm text-muted-foreground">Volume (Demo)</div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Leaderboard;
