import { memo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "All",
  "Crypto",
  "Politics",
  "AI & Tech",
  "Economics",
  "Sports",
  "Space",
];

interface CategoryMenuProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryMenu = memo(function CategoryMenu({ selectedCategory, onCategoryChange }: CategoryMenuProps) {
  return (
    <div className="sticky top-14 sm:top-16 z-40 glass-card border-b border-border/50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 animate-in slide-in-from-top-2">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-3 sm:py-4 scrollbar-hide">
          {CATEGORIES.map((category, index) => (
            <Button
              key={category}
              onClick={() => onCategoryChange(category)}
              variant={selectedCategory === category ? "default" : "ghost"}
              className={cn(
                "whitespace-nowrap transition-all duration-300 text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-9 animate-in fade-in slide-in-from-left-4",
                selectedCategory === category
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 gold-glow scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 hover:scale-105"
              )}
              style={{ animationDelay: `${index * 30}ms` }}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
});

