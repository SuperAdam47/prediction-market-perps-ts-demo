const Ticker = () => {
    const items = [
      { text: "BTC > $100k", value: "↑ 63%", color: "text-success" },
      { text: "Trump 2028 Win", value: "↓ 41%", color: "text-destructive" },
      { text: "ETH > $10k", value: "↑ 54%", color: "text-success" },
      { text: "AI IPO > $100B", value: "↑ 48%", color: "text-primary" },
      { text: "Fed Rate Cut 2025", value: "↑ 67%", color: "text-success" },
      { text: "Apple $4T Market Cap", value: "↓ 39%", color: "text-destructive" },
    ];
  
    return (
      <div className="bg-muted/30 border-y border-border/50 py-1 overflow-hidden">
        <div className="flex animate-ticker gap-5">
          {[...items, ...items].map((item, index) => (
            <div key={index} className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-foreground font-medium">{item.text}</span>
              <span className={`${item.color} font-bold`}>{item.value}</span>
              <span className="text-border mx-4">•</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Ticker;
  