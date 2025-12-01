import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/types/product";
import { useEffect, useState } from "react";
import { ShoppingCart, Sparkles } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isHovered, setIsHovered] = useState(false);

  // 🌗 LocalStorage orqali theme'ni aniqlash
  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    setTheme(saved || "light");

    // Theme o'zgarganda kuzatish
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-500 rounded-2xl shadow-lg border ${
        theme === "dark"
          ? "bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white border-zinc-700/50 hover:border-zinc-600 hover:shadow-2xl hover:shadow-red-500/20"
          : "bg-gradient-to-br from-white via-gray-50 to-white text-zinc-900 border-gray-200/80 hover:border-gray-300 hover:shadow-2xl hover:shadow-red-500/10"
      } hover:scale-[1.02] hover:-translate-y-1`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative gradient overlay */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
          theme === "dark"
            ? "bg-gradient-to-br from-red-600/10 via-transparent to-yellow-500/10"
            : "bg-gradient-to-br from-red-50/50 via-transparent to-yellow-50/50"
        }`}
      />

      <CardContent className="flex flex-col p-0 relative z-10">
        {/* Image Container with overlay effect */}
        <div className="relative overflow-hidden rounded-t-2xl">
          <div
            className={`absolute inset-0 z-10 transition-opacity duration-500 ${
              isHovered ? "opacity-0" : "opacity-100"
            } ${
              theme === "dark"
                ? "bg-gradient-to-t from-zinc-900/60 via-transparent to-transparent"
                : "bg-gradient-to-t from-white/60 via-transparent to-transparent"
            }`}
          />
          <img
            src={product.image || "/no-image.png"}
            alt={product.title || product.name || "Product"}
            className={`w-full h-[220px] object-cover transition-transform duration-700 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
            loading="lazy"
            decoding="async"
          />
          {/* Shine effect on hover */}
          <div
            className={`absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ${
              theme === "dark"
                ? "bg-gradient-to-r from-transparent via-white/10 to-transparent"
                : "bg-gradient-to-r from-transparent via-white/20 to-transparent"
            }`}
          />
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-4">
          {/* Mahsulot nomi */}
          <h3 className="text-xl font-bold leading-tight line-clamp-2 min-h-[3rem] group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">
            {product.title || product.name}
          </h3>

          {/* Price with icon */}
          <div className="flex items-center gap-2">
            <Sparkles className={`h-5 w-5 ${
              theme === "dark" ? "text-yellow-400" : "text-yellow-600"
            }`} />
            <p
              className={`text-2xl font-extrabold ${
                theme === "dark" ? "text-yellow-400" : "text-yellow-600"
              }`}
            >
              {product.price?.toLocaleString()} so'm
            </p>
          </div>

          {/* Savatga qo'shish tugmasi */}
          <Button
            className={`w-full mt-2 rounded-xl font-semibold text-base py-6 transition-all duration-300 group/btn ${
              theme === "dark"
                ? "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:scale-105 shadow-lg shadow-red-600/30 hover:shadow-red-600/50"
                : "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:scale-105 shadow-lg shadow-red-600/30 hover:shadow-red-600/50"
            }`}
            onClick={() => onAddToCart(product)}
          >
            <ShoppingCart className="mr-2 h-5 w-5 group-hover/btn:scale-110 transition-transform duration-300" />
            Savatga qo'shish
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
