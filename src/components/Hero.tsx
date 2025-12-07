import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { HeroSection } from "./HeroSection";

interface Market {
  id: string;
  title: string;
  currentProbability: number;
}

interface HeroProps {
  markets?: Market[];
}

const Hero = ({ markets = [] }: HeroProps) => {
  // Get first 3 markets or use defaults
  const displayMarkets = markets.slice(0, 3);
  
  // Color classes for different markets
  const colorClasses = ["text-primary", "text-secondary", "text-success"];

  const handleExploreMarkets = () => {
    const marketsSection = document.getElementById("markets");
    if (marketsSection) {
      marketsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleLearnMore = () => {
    window.open("https://predictive-perpetuals.gitbook.io/predictive-perp-docs/", "_blank", "noopener,noreferrer");
  };

  return (
    <section className="container mx-auto px-4 py-4 md:py-10 text-center">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Trade probabilities
            <br />
            <span className="text-primary transition-colors duration-300">
              like perpetuals
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Predict global events, earn from your conviction.
          </p>
        </div>
        <HeroSection />
        <div className="flex gap-3 sm:gap-4 justify-center flex-wrap">
          <Button 
            size="lg" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 glow-gold transition-all duration-300 hover:scale-105 text-sm sm:text-base"
            onClick={handleExploreMarkets}
          >
            Explore Markets
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          {/* <Button 
            size="lg" 
            variant="outline" 
            className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
            onClick={handleLearnMore}
          >
            Learn More
          </Button> */}
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          {displayMarkets.map((market, index) => (
            <div key={market.id} className="glass p-6 rounded-xl space-y-2">
              <div className={`text-3xl font-bold ${colorClasses[index] || "text-primary"}`}>
                {(market.currentProbability).toFixed(2)}%
              </div>
              <div className="text-sm text-muted-foreground">{market.title}</div>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
};

export default Hero;
