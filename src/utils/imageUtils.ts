/**
 * Get image URL based on category
 */
export function getCategoryImage(category: string, size: "small" | "large" = "small"): string {
  const dimensions = size === "small" ? "w=400&h=96" : "w=800&h=400";
  
  const images: Record<string, string> = {
    "Crypto": `https://images.unsplash.com/photo-1639762681485-074b7f938ba0?${dimensions}&fit=crop&q=80`,
    "Politics": `https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?${dimensions}&fit=crop&q=80`,
    "AI & Tech": `https://images.unsplash.com/photo-1485827404703-89b55fcc595e?${dimensions}&fit=crop&q=80`,
    "Economics": `https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?${dimensions}&fit=crop&q=80`,
    "Sports": `https://images.unsplash.com/photo-1574629810360-7efbbe195018?${dimensions}&fit=crop&q=80`,
    "Space": `https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?${dimensions}&fit=crop&q=80`,
  };
  
  return images[category] || `https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?${dimensions}&fit=crop&q=80`;
}

