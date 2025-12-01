import { useEffect, useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import { supabase } from "@/lib/supabaseClient";
import type { Product } from "@/types/product";
import { Loader2 } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

interface MenuProps {
  onAddToCart: (product: Product) => void;
}

export default function Menu({ onAddToCart }: MenuProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Hammasi");
  const [error, setError] = useState("");
  const { elementRef, isVisible } = useScrollAnimation(0.1);

  // 🧩 Supabase'dan mahsulotlarni olish
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase.from("SCL").select("*");
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        setError("Mahsulotlarni olishda xatolik yuz berdi.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // 🔍 Kategoriyalarni aniqlash
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        products
          .map((p) => p.category?.trim())
          .filter((cat): cat is string => Boolean(cat && cat.length))
      )
    ).filter((cat) => cat !== "Hammasi");

    return ["Hammasi", ...uniqueCategories];
  }, [products]);

  // 🔎 Tanlangan kategoriya bo'yicha filterlash
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "Hammasi") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [selectedCategory, products]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
          <p className="text-lg text-muted-foreground">
            ⏳ Mahsulotlar yuklanmoqda...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-center text-red-500 font-medium text-lg">
          {error}
        </p>
      </div>
    );

  return (
    <div 
      ref={elementRef}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      {/* Header */}
      <div 
        className={`text-center mb-8 sm:mb-12 space-y-4 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-100 -translate-y-4"
        }`}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">
          Bizning menyu
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground dark:text-gray-400">
          Tanlang va zavqlaning — yangi taomlar sizni kutmoqda 🍔
        </p>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div 
          className={`mb-8 sm:mb-12 transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-100 translate-y-4"
          }`}
        >
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`transition-all duration-500 ${
                isVisible 
                  ? "opacity-100 translate-y-0 scale-100" 
                  : "opacity-100 translate-y-8 scale-100"
              }`}
              style={{ transitionDelay: `${200 + index * 50}ms` }}
            >
              <ProductCard
                product={{
                  ...product,
                  image: product.image?.startsWith("http")
                    ? product.image
                    : product.image
                      ? `https://omdgrhymirjfcigfuzcb.supabase.co/storage/v1/object/public/menu-images/${product.image}`
                      : "/no-image.png",
                }}
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>
      ) : (
        <div 
          className={`text-center py-12 sm:py-16 transition-all duration-500 ${
            isVisible ? "opacity-100 scale-100" : "opacity-100 scale-100"
          }`}
        >
          <p className="text-lg sm:text-xl text-muted-foreground dark:text-gray-400">
            Hozircha bu kategoriya bo'yicha mahsulotlar mavjud emas.
          </p>
        </div>
      )}
    </div>
  );
}
