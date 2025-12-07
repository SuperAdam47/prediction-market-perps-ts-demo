export interface Market {
  id: string;
  title: string;
  category: string;
  probability: number;
}

export interface MarketWithProbability extends Market {
  currentProbability: number;
}

export const INITIAL_MARKETS: Market[] = [
  // Crypto
  { id: "btc-100k", title: "BTC reaches $100k by end of 2025", category: "Crypto", probability: 63 },
  { id: "eth-etf", title: "Ethereum ETF approved in 2025", category: "Crypto", probability: 72 },
  { id: "crypto-boom", title: "Crypto market booms in 2025", category: "Crypto", probability: 66 },
  { id: "crypto-crash", title: "Crypto market crashes in 2025", category: "Crypto", probability: 55 },
  
  // Politics
  { id: "trump-2028", title: "Trump wins 2028 election", category: "Politics", probability: 41 },
  { id: "eu-unity", title: "EU passes major integration treaty by 2026", category: "Politics", probability: 38 },
  { id: "china-taiwan", title: "China-Taiwan conflict escalates in 2025", category: "Politics", probability: 32 },
  { id: "uk-election", title: "UK general election results in hung parliament", category: "Politics", probability: 45 },
  { id: "climate-treaty", title: "New global climate treaty signed by 2026", category: "Politics", probability: 58 },
  
  // AI & Tech
  { id: "ai-agi", title: "AGI achieved by 2026", category: "AI & Tech", probability: 28 },
  { id: "ai-regulation", title: "Major AI regulation passed in US/EU by 2025", category: "AI & Tech", probability: 65 },
  { id: "quantum-breakthrough", title: "Quantum computer solves practical problem by 2026", category: "AI & Tech", probability: 42 },
  { id: "self-driving-cars", title: "Fully autonomous cars legalized in 5+ countries by 2026", category: "AI & Tech", probability: 52 },
  { id: "ai-jobs", title: "AI replaces 20% of knowledge worker jobs by 2026", category: "AI & Tech", probability: 48 },
  
  // Economics
  { id: "recession-2025", title: "Global recession in 2025", category: "Economics", probability: 44 },
  { id: "fed-rate-cut", title: "Fed cuts rates by 1%+ in 2025", category: "Economics", probability: 55 },
  { id: "inflation-target", title: "US inflation falls below 2% by end of 2025", category: "Economics", probability: 62 },
  { id: "dollar-decline", title: "US Dollar index drops 10%+ in 2025", category: "Economics", probability: 35 },
  { id: "housing-crash", title: "Major housing market correction in 2025", category: "Economics", probability: 41 },
  
  // Sports
  { id: "world-cup-2026", title: "Brazil wins 2026 FIFA World Cup", category: "Sports", probability: 18 },
  { id: "olympics-2028", title: "USA tops medal count at 2028 Olympics", category: "Sports", probability: 35 },
  { id: "super-bowl-2025", title: "Kansas City Chiefs win Super Bowl 2025", category: "Sports", probability: 12 },
  { id: "nba-champion-2025", title: "Denver Nuggets win NBA championship 2025", category: "Sports", probability: 15 },
  { id: "f1-champion-2025", title: "Max Verstappen wins F1 championship 2025", category: "Sports", probability: 38 },
  { id: "tennis-grand-slam", title: "Novak Djokovic wins 3+ Grand Slams in 2025", category: "Sports", probability: 28 },
  
  // Space
  { id: "elon-mars", title: "SpaceX lands humans on Mars by 2030", category: "Space", probability: 35 },
];

export const CATEGORIES = [
  "All",
  "Crypto",
  "Politics",
  "AI & Tech",
  "Economics",
  "Sports",
  "Space",
] as const;

export const LEVERAGE_OPTIONS = [1, 2, 3, 5, 10] as const;
export const LIQUIDATION_THRESHOLD = 80;
export const MARKETS_PER_PAGE = 6;
export const PROBABILITY_UPDATE_INTERVAL = 3000; // 3 seconds
export const BIAS_FACTOR = 0.65;

