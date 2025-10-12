import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Button
        variant={selectedCategory === "Hammasi" ? "default" : "outline"}
        onClick={() => onSelectCategory("Hammasi")}
        className="rounded-full"
        data-testid="button-category-all"
      >
        Hammasi
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onSelectCategory(category)}
          className="rounded-full"
          data-testid={`button-category-${category.toLowerCase()}`}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
