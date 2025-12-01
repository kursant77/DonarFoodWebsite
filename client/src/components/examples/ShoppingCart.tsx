import { useState } from 'react';
import ShoppingCart, { CartItem } from '../ShoppingCart';
import burgerImg from "@assets/stock_images/juicy_hamburger_with_6391bb79.jpg";
import shawarmaImg from "@assets/stock_images/shawarma_kebab_wrap__cefd1eb4.jpg";

export default function ShoppingCartExample() {
  const [items] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Burger',
      category: 'Burger',
      price: 33000,
      image: burgerImg,
      quantity: 2,
    },
    {
      id: '2',
      name: 'Shaverma',
      category: 'Shaverma',
      price: 25000,
      image: shawarmaImg,
      quantity: 1,
    },
  ]);

  return (
    <ShoppingCart
      isOpen={true}
      onClose={() => console.log('Close cart')}
      items={items}
      onUpdateQuantity={(id, qty) => console.log('Update quantity:', id, qty)}
      onRemoveItem={(id) => console.log('Remove item:', id)}
      onCheckout={() => console.log('Checkout')}
    />
  );
}
