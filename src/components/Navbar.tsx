import { Coins, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface NavbarProps {
  balance: number;
  onRecharge: () => void;
}

export function Navbar({ balance, onRecharge }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-border backdrop-blur-md">
      <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
        {/* Logo */}
        {/* <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center gold-glow transition-all duration-300 hover:scale-105">
            <a href="#" className="text-primary-foreground font-bold text-lg sm:text-xl">P²</a>
          </div>
        </div> */}

        {/* Virtual Wallet & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="glass-card px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center gap-1.5 sm:gap-2 gold-glow-hover">
            <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span className="font-bold text-primary text-sm sm:text-base">{balance.toFixed(2)}</span>
            <span className="text-muted-foreground text-xs sm:text-sm hidden sm:inline">BNB</span>
          </div>
          {/* {mounted && (
            <Button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-secondary/50 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              ) : (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              )}
            </Button>
          )} */}
          <Button
            onClick={onRecharge}
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 gold-glow text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-9 transition-all duration-200"
          >
            <span className="hidden sm:inline">Recharge</span>
            <span className="sm:hidden">+</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
