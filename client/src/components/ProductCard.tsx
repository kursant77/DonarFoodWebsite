import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {product.category}
          </span>
        </div>
        
        <h3 className="text-xl font-semibold mb-3" data-testid={`text-product-name-${product.id}`}>
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-mono font-bold text-primary" data-testid={`text-price-${product.id}`}>
            {product.price.toLocaleString()} so'm
          </div>
          
          <Button
            size="icon"
            onClick={() => onAddToCart(product)}
            className="rounded-full"
            data-testid={`button-add-to-cart-${product.id}`}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
