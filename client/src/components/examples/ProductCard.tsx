import ProductCard from '../ProductCard';
import burgerImg from "@assets/stock_images/juicy_hamburger_with_6391bb79.jpg";

export default function ProductCardExample() {
  const product = {
    id: '1',
    name: 'Burger',
    category: 'Burger',
    price: 33000,
    image: burgerImg,
  };

  return (
    <div className="p-4 max-w-sm">
      <ProductCard 
        product={product} 
        onAddToCart={(p) => console.log('Added to cart:', p.name)} 
      />
    </div>
  );
}
