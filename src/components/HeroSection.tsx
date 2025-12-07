import { Check, Coins, TrendingUp } from "lucide-react";

export const HeroSection = () => {
    return (
        <div className="glass-panel rounded-xl p-6 mb-6 animate-slide-up">
            <div className="text-center space-y-4">
                {/* Headline */}
                <h2 className="text-2xl md:text-3xl font-bold text-primary">
                    P² Demo — No Wallet Needed
                </h2>

                {/* Description */}
                <div className="max-w-2xl mx-auto">
                    <p className="text-muted-foreground text-sm md:text-base">
                        Experience perpetual, AI-powered probability trading. Receive 10 Virtual BNB to trade market probabilities with leverage.
                    </p>

                    {/* Feature checks */}
                    <div className="flex flex-wrap justify-center gap-4 pt-4">
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            <span className="text-xs md:text-sm font-medium">No wallet required</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Coins className="w-4 h-4 text-primary" />
                            <span className="text-xs md:text-sm font-medium">Free Virtual BNB</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            <span className="text-xs md:text-sm font-medium">Live Market Simulation</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
