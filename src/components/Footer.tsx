import { TrendingUp, Twitter, Github, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/20 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                P²
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Trade probabilities like perpetuals. The future of prediction markets.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Product</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="#markets" className="block hover:text-primary transition-colors">Markets</a>
              {/* <a href="https://predictive-perpetuals.gitbook.io/predictive-perp-docs/" className="block hover:text-primary transition-colors">Documentation</a> */}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Community</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="https://t.me/PredictivePerpetuals" className="block hover:text-primary transition-colors">Telegram</a>
              <a href="https://x.com/predictiveperps" className="block hover:text-primary transition-colors">Twitter</a>
            </div>
          </div>

          {/* <div className="space-y-4">
            <h4 className="font-semibold">Legal</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="#terms" className="block hover:text-primary transition-colors">Terms</a>
              <a href="#privacy" className="block hover:text-primary transition-colors">Privacy</a>
            </div>
          </div> */}
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Predictive Perpetuals. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://x.com/predictiveperps" className="text-muted-foreground hover:text-primary transition-colors">
            <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all" fill="currentColor" viewBox="0 0 30 30"><path d="m18.2342,14.1624l8.7424-10.1624h-2.0717l-7.591,8.8238-6.0629-8.8238h-6.9929l9.1684,13.3432-9.1684,10.6568h2.0718l8.0163-9.3183,6.4029,9.3183h6.9929l-9.5083-13.8376h.0005Zm-2.8376,3.2984l-.9289-1.3287L7.0763,5.5596h3.1822l5.9649,8.5323.9289,1.3287,7.7536,11.0907h-3.1822l-6.3272-9.05v-.0005Z"></path></svg>
            </a>
            <a href="https://t.me/PredictivePerpetuals" className="text-muted-foreground hover:text-primary transition-colors">
            <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"></path></svg>
            </a>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
