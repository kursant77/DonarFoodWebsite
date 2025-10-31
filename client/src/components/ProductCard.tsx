import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "next-themes";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { theme } = useTheme();

  return (
    <Card
      className={`transition-all duration-300 rounded-2xl shadow-lg ${
        theme === "dark"
          ? "bg-zinc-800 text-white border-zinc-700"
          : "bg-white text-zinc-800 border-gray-200"
      }`}
    >
      <CardContent className="flex flex-col items-center p-5 space-y-3">
        <img
          src={product.image || "/placeholder.png"}
          alt={product.name}
          className="w-40 h-40 object-cover rounded-xl"
        />
        <h3 className="text-xl font-semibold">{product.name}</h3>
        {product.title && (
          <p className="text-sm text-muted-foreground">{product.title}</p>
        )}
        <p className="text-lg font-bold">{product.price.toLocaleString()} so'm</p>
        <Button
          className="w-full mt-2 rounded-xl font-medium transition-all hover:scale-[1.02]"
          onClick={() => onAddToCart(product)}
        >
          Savatga qo‘shish
        </Button>
      </CardContent>
    </Card>
  );
}
