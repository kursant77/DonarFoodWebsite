import { Button } from "@/components/ui/button";
import { useState } from "react";

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
    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
      {categories.map((category, index) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onSelectCategory(category)}
          className={`touch-manipulation active:scale-95 transition-all duration-300 text-sm sm:text-base ${
            selectedCategory === category
              ? "animate-in zoom-in-95 scale-105 shadow-lg"
              : "hover:scale-105"
          }`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
