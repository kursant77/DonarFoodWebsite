import { useEffect, useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import type { Product } from "@shared/schema";

interface MenuProps {
  onAddToCart: (product: Product) => void;
}

export default function Menu({ onAddToCart }: MenuProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Hammasi");
  const [error, setError] = useState("");

  // ✅ Backend URL .env fayldan olinadi
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // 🧩 Backenddan mahsulotlarni olish
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        if (!res.ok) throw new Error("Mahsulotlarni olishda xato yuz berdi.");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("❌ API xato:", err);
        setError("Mahsulotlarni serverdan olishda xatolik yuz berdi.");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [API_URL]);

  // 🔍 Kategoriyalarni aniqlash (dublikatlarni olib tashlaymiz)
  const categories = useMemo(() => {
    const allCats = Array.from(
      new Set(products.map((p) => p.category).filter(Boolean))
    );
    return allCats.includes("Hammasi") ? allCats : ["Hammasi", ...allCats];
  }, [products]);

  // 🔎 Tanlangan kategoriya bo‘yicha filterlash
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "Hammasi") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [selectedCategory, products]);

  if (loading)
    return <p className="text-center mt-10 text-lg">⏳ Mahsulotlar yuklanmoqda...</p>;

  if (error)
    return <p className="text-center mt-10 text-red-500 font-medium">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Bizning menyu</h1>
        <p className="text-xl text-muted-foreground">
          Tanlang va zavqlaning — yangi taomlar sizni kutmoqda 🍔
        </p>
      </div>

      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="mb-12">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                image: product.image?.startsWith("http")
                  ? product.image
                  : `${API_URL}${product.image}`,
              }}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-lg mt-10">
          Hozircha bu kategoriya bo‘yicha mahsulotlar mavjud emas.
        </p>
      )}
    </div>
  );
}
