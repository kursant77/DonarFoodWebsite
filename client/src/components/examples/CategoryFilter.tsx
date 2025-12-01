import { useState } from 'react';
import CategoryFilter from '../CategoryFilter';

export default function CategoryFilterExample() {
  const [selected, setSelected] = useState('Hammasi');
  const categories = ['Lavash', 'Shaverma', 'Doner', 'Burger', '', 'Hot-Dog'];

  return (
    <div className="p-4">
      <CategoryFilter
        categories={categories}
        selectedCategory={selected}
        onSelectCategory={setSelected}
      />
    </div>
  );
}
