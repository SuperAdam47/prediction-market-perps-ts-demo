import { getCategoryImage } from "@/utils/imageUtils";

interface MarketImageProps {
  category: string;
  title: string;
  size?: "small" | "large";
  className?: string;
}

export function MarketImage({ category, title, size = "small", className = "" }: MarketImageProps) {
  const imageUrl = getCategoryImage(category, size);
  const heightClass = size === "small" ? "h-[115px]" : "h-[200px]"; // 1.2x of h-24 (96px * 1.2 = 115.2px)

  return (
    <div className={`w-full ${heightClass} rounded-lg overflow-hidden bg-secondary/30 border border-border/30 ${className}`}>
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to gradient if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          const parent = target.parentElement;
          if (parent) {
            parent.style.background =
              "linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--secondary) / 0.2))";
          }
        }}
      />
    </div>
  );
}

