import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import type { Product } from "@shared/schema";
import burgerImg1 from "@assets/stock_images/juicy_hamburger_with_6391bb79.jpg";
import burgerImg2 from "@assets/stock_images/juicy_hamburger_with_ae5068b7.jpg";
import shawarmaImg1 from "@assets/stock_images/shawarma_kebab_wrap__cefd1eb4.jpg";
import shawarmaImg2 from "@assets/stock_images/shawarma_kebab_wrap__5d456446.jpg";
import hotdogImg from "@assets/stock_images/hot_dog_with_mustard_9bdc7626.jpg";
import tostImg from "@assets/stock_images/grilled_toast_sandwi_4d302847.jpg";

//todo: remove mock functionality - replace with API data
const mockProducts: Product[] = [
  { id: '1', name: 'Lavash', category: 'Lavash', price: 35000, image: shawarmaImg1 },
  { id: '2', name: 'Pishloqli Lavash', category: 'Lavash', price: 37000, image: shawarmaImg2 },
  { id: '3', name: 'Lavash 2X', category: 'Lavash', price: 40000, image: shawarmaImg1 },
  { id: '4', name: 'Pishloqli Lavash 2X', category: 'Lavash', price: 42000, image: shawarmaImg2 },
  { id: '5', name: 'Shaverma', category: 'Shaverma', price: 25000, image: shawarmaImg1 },
  { id: '6', name: 'Shaverma 2X', category: 'Shaverma', price: 30000, image: shawarmaImg2 },
  { id: '7', name: 'Doner', category: 'Doner', price: 33000, image: shawarmaImg1 },
  { id: '8', name: 'Burger', category: 'Burger', price: 33000, image: burgerImg1 },
  { id: '9', name: 'Burger 2X', category: 'Burger', price: 40000, image: burgerImg2 },
  { id: '10', name: 'Motsarella Burger', category: 'Burger', price: 38000, image: burgerImg1 },
  { id: '11', name: 'Tost Говядина', category: 'Tost', price: 40000, image: tostImg },
  { id: '12', name: 'Tost Chicken', category: 'Tost', price: 35000, image: tostImg },
  { id: '13', name: 'Tost Салями', category: 'Tost', price: 30000, image: tostImg },
  { id: '14', name: 'Hot-dog', category: 'Hot-Dog', price: 13000, image: hotdogImg },
];

interface MenuProps {
  onAddToCart: (product: Product) => void;
}

export default function Menu({ onAddToCart }: MenuProps) {
  const [selectedCategory, setSelectedCategory] = useState("Hammasi");

  const categories = useMemo(() => {
    return Array.from(new Set(mockProducts.map((p) => p.category)));
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "Hammasi") {
      return mockProducts;
    }
    return mockProducts.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Bizning menyu</h1>
        <p className="text-xl text-muted-foreground">
          Tanlang va zavqlaning - 20+ mazali taomlar
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-12">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
}
