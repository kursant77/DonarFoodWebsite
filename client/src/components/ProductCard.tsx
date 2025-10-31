import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="bg-white shadow-xl rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-56 object-cover"
      />
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-600 text-sm">{product.category}</p>
        <p className="text-primary font-bold">{product.price} so‘m</p>
        <Button
          className="mt-2 bg-green-600 hover:bg-green-700 text-white"
          onClick={() => onAddToCart(product)}
        >
          Savatga qo‘shish
        </Button>
      </div>
    </Card>
  );
}
