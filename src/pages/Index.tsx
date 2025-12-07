import { useState, useEffect, useMemo, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { MarketCard } from "@/components/MarketCard";
import { ActivePositions } from "@/components/ActivePositions";
import { CategoryMenu } from "@/components/CategoryMenu";
import { useTrading } from "@/contexts/TradingContext";
import { useMarkets } from "@/hooks/useMarkets";
import { useLiquidationCheck } from "@/hooks/useLiquidationCheck";
import { INITIAL_MARKETS, MARKETS_PER_PAGE, CATEGORIES } from "@/constants/markets";
import { toast } from "@/hooks/use-toast";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import Leaderboard from "@/components/Leaderboard";
import Footer from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import FeedbackModal from "@/components/FeedbackModal";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Index = () => {
  const { balance, positions, recharge, openPosition, closePosition, updatePositionProbabilities } = useTrading();
  const { markets } = useMarkets(INITIAL_MARKETS, positions);
  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyShown, setSurveyShown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<typeof CATEGORIES[number]>("All");

  // Filter markets by category - memoized for performance
  const filteredMarkets = useMemo(() => {
    return selectedCategory === "All" 
      ? markets 
      : markets.filter((market) => market.category === selectedCategory);
  }, [markets, selectedCategory]);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Check for liquidations
  useLiquidationCheck({
    positions,
    markets,
    onLiquidate: closePosition,
  });

  const handleRecharge = useCallback(() => {
    recharge();
  }, [recharge]);

  const handleTrade = useCallback(
    (marketId: string, amount: number, leverage: number, direction: "long" | "short") => {
      const market = markets.find((m) => m.id === marketId);
      if (!market) return;

      openPosition(marketId, market.title, amount, leverage, direction, market.currentProbability);
    },
    [markets, openPosition]
  );

  const handleClosePosition = useCallback((positionId: string) => {
    closePosition(positionId);
  }, [closePosition]);

  // Monitor balance for survey trigger
  useEffect(() => {
    if (balance >= 20 && !surveyShown) {
      setShowSurvey(true);
      setSurveyShown(true);
    }
  }, [balance, surveyShown]);

  // Update position probabilities when markets change
  useEffect(() => {
    // Skip if no positions to avoid unnecessary updates
    if (positions.length === 0) return;
    
    positions.forEach((pos) => {
      const market = markets.find((m) => m.id === pos.marketId);
      if (market) {
        updatePositionProbabilities(pos.marketId, market.currentProbability);
      }
    });
  }, [markets, positions, updatePositionProbabilities]);

  const handleSurveySubmit = (data: { 
    enjoyment: string; 
    favoriteFeature: string; 
    suggestions: string;
    telegramHandle: string;
    brc20Wallet: string;
  }) => {
    console.log("Survey submitted:", data);
    
    toast({
      title: "Survey Submitted! 🎉",
      description: "Thank you for your feedback. You'll receive a special airdrop when the platform launches!",
    });
  };

  return (
    <div className="min-h-screen min-w-screen">
      <Navbar balance={balance} onRecharge={handleRecharge} />
      <CategoryMenu selectedCategory={selectedCategory} onCategoryChange={(cat) => setSelectedCategory(cat as typeof CATEGORIES[number])} />

      <div className="container mx-auto px-4 py-2">
        {/* Hero Banner - Only show when "All" category is selected */}
        {selectedCategory === "All" && (
          <>
            <Hero markets={markets.map(m => ({ id: m.id, title: m.title, currentProbability: m.currentProbability }))} />
            <Ticker />
          </>
        )}

        {/* Active Positions */}
        <ActivePositions positions={positions} onClose={handleClosePosition} />

        {/* Markets Grid */}
        <div id="markets" className="mt-6 sm:mt-8 mb-6 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-1 sm:gap-2">
            <h2 className="text-xl sm:text-2xl font-bold">Markets</h2>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground flex-wrap">
              <span>
                Page {currentPage} of {Math.ceil(filteredMarkets.length / MARKETS_PER_PAGE)}
              </span>
              <span className="text-muted-foreground/50">•</span>
              <span>{filteredMarkets.length} {selectedCategory !== "All" ? selectedCategory : "total"} markets</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
            {filteredMarkets.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground animate-in fade-in">
                No markets found in this category.
              </div>
            ) : (
              filteredMarkets
                .slice((currentPage - 1) * MARKETS_PER_PAGE, currentPage * MARKETS_PER_PAGE)
                .map((market, index) => (
                  <MarketCard
                    key={market.id}
                    id={market.id}
                    title={market.title}
                    category={market.category}
                    initialProbability={market.currentProbability}
                    baseProbability={market.probability}
                    onTrade={handleTrade}
                  />
                ))
            )}
          </div>

          {/* Pagination Controls */}
          {filteredMarkets.length > MARKETS_PER_PAGE && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 disabled:opacity-50 w-full sm:w-auto"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </Button>
              
              <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
                {Array.from({ length: Math.ceil(filteredMarkets.length / MARKETS_PER_PAGE) }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  const totalPages = Math.ceil(filteredMarkets.length / MARKETS_PER_PAGE);
                  const showPage = 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1);
                  
                  if (!showPage && page === currentPage - 2 && currentPage > 3) {
                    return <span key={`ellipsis-start-${page}`} className="px-1 sm:px-2 text-muted-foreground text-sm">...</span>;
                  }
                  if (!showPage && page === currentPage + 2 && currentPage < totalPages - 2) {
                    return <span key={`ellipsis-end-${page}`} className="px-1 sm:px-2 text-muted-foreground text-sm">...</span>;
                  }
                  if (!showPage) return null;
                  
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className={
                        currentPage === page
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 w-8 h-8 sm:w-10 sm:h-10 p-0 text-sm sm:text-base"
                          : "border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 w-8 h-8 sm:w-10 sm:h-10 p-0 text-sm sm:text-base"
                      }
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(Math.ceil(filteredMarkets.length / MARKETS_PER_PAGE), prev + 1))}
                disabled={currentPage === Math.ceil(filteredMarkets.length / MARKETS_PER_PAGE)}
                className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 disabled:opacity-50 w-full sm:w-auto"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <Leaderboard />

      {/* Footer */}
      {/* <Footer /> */}

      {/* Survey Modal */}
      {/* <FeedbackModal
        open={showSurvey}
        onOpenChange={setShowSurvey}
        onSubmit={handleSurveySubmit}
      /> */}
    </div>
  );
};

export default Index;
