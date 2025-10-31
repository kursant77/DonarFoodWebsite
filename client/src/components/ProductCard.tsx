import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/types/product";
import { useEffect, useState } from "react";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // 🌗 LocalStorage orqali theme’ni aniqlash
  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    setTheme(saved || "light");

    // Theme o‘zgarganda kuzatish
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <Card
      className={`transition-all duration-300 rounded-2xl shadow-md border ${
        theme === "dark"
          ? "bg-zinc-900 text-white border-zinc-800 hover:border-zinc-700"
          : "bg-white text-zinc-900 border-gray-200 hover:border-gray-300"
      }`}
    >
      <CardContent className="flex flex-col p-5 space-y-3">
        <img
          src={product.image || "/no-image.png"}
          alt={product.title || product.name || "Product"}
          className="w-[100%] h-[100%] object-cover rounded-xl"
        />

        {/* Mahsulot nomi */}
        <h3 className="text-lg font-semibold ">{product.title || product.name}</h3>

        {/* Narx */}
        <p
          className={`text-lg font-bold ${
            theme === "dark" ? "text-yellow-400" : "text-yellow-600"
          }`}
        >
          {product.price?.toLocaleString()} so‘m
        </p>

        {/* Savatga qo‘shish tugmasi */}
        <Button
          className={`w-full mt-2 rounded-xl font-medium transition-all hover:scale-[1.03] ${
            theme === "dark"
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
          onClick={() => onAddToCart(product)}
        >
          Savatga qo‘shish
        </Button>
      </CardContent>
    </Card>
  );
}
