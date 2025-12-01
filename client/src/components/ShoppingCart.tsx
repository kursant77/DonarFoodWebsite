import { Button } from "@/components/ui/button";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Product } from "@/types/product";
import { useState, useEffect } from "react";
import OrderForm from "@/components/OrderForm";

export interface CartItem extends Product {
  quantity: number;
}

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
}

export default function ShoppingCart({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}: ShoppingCartProps) {
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal < 50000 ? 10000 : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (items.length === 0) return alert("Savat bo'sh!");
    localStorage.setItem("cart", JSON.stringify(items));
    setIsOrderFormOpen(true);
  };

  const handleRemoveItem = (id: number) => {
    setRemovingId(id);
    setTimeout(() => {
      onRemoveItem(id);
      setRemovingId(null);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-full sm:w-[400px] lg:w-[450px] bg-background border-l shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-500 ease-out">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gradient-to-r from-primary/5 to-transparent">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-primary animate-pulse" />
            <span>Savat</span>
            {items.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({items.length})
              </span>
            )}
          </h2>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={onClose}
            className="touch-manipulation active:scale-95 transition-transform duration-200"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center animate-in fade-in zoom-in-95 duration-500">
              <ShoppingBag className="h-16 w-16 sm:h-20 sm:w-20 text-muted-foreground mb-4 animate-bounce" />
              <p className="text-lg sm:text-xl font-semibold text-muted-foreground">
                Savat bo'sh
              </p>
              <p className="text-sm sm:text-base text-muted-foreground mt-2">
                Mahsulot qo'shishni boshlang
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {items.map((item, index) => (
                <Card
                  key={item.id}
                  className={`p-3 sm:p-4 transition-all duration-500 ${
                    removingId === item.id
                      ? "animate-out fade-out slide-out-to-right scale-95"
                      : "animate-in fade-in slide-in-from-right"
                  } hover:shadow-lg hover:scale-[1.02] touch-manipulation`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex gap-3 sm:gap-4">
                    <img
                      src={
                        item.image?.startsWith("http")
                          ? item.image
                          : item.image
                            ? `https://omdgrhymirjfcigfuzcb.supabase.co/storage/v1/object/public/menu-images/${item.image}`
                            : "/no-image.png"
                      }
                      alt={item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md flex-shrink-0 hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base truncate">
                            {item.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {item.category}
                          </p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0 touch-manipulation active:scale-95 transition-transform duration-200"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <X className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between gap-2 sm:gap-4">
                        <div className="flex items-center gap-1 sm:gap-2 border rounded-md">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 sm:h-8 sm:w-8 touch-manipulation active:scale-95"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <span className="w-6 sm:w-8 text-center font-medium text-sm sm:text-base">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 sm:h-8 sm:w-8 touch-manipulation active:scale-95"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                        <div className="font-mono font-bold text-primary text-sm sm:text-base">
                          {(item.price * item.quantity).toLocaleString()} so'm
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-4 sm:p-6 space-y-4 bg-gradient-to-t from-primary/5 to-transparent animate-in slide-in-from-bottom duration-500">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm sm:text-base">
                <span>Mahsulotlar:</span>
                <span className="font-mono">
                  {subtotal.toLocaleString()} so'm
                </span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex items-center justify-between text-sm sm:text-base text-muted-foreground">
                  <span>Yetkazib berish:</span>
                  <span className="font-mono">
                    {deliveryFee.toLocaleString()} so'm
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-base sm:text-lg font-bold pt-2 border-t">
                <span>Jami:</span>
                <span className="font-mono text-primary text-xl sm:text-2xl">
                  {total.toLocaleString()} so'm
                </span>
              </div>
            </div>
            <Button
              className="w-full py-5 sm:py-6 text-base sm:text-lg rounded-xl font-semibold hover:scale-105 active:scale-95 transition-transform duration-300 touch-manipulation"
              onClick={handleCheckout}
            >
              Buyurtma berish
            </Button>
          </div>
        )}
      </div>

      {isOrderFormOpen && (
        <OrderForm
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          total={total}
          onSubmit={() => {
            localStorage.removeItem("cart");
            items.forEach((item) => onRemoveItem(item.id));
            setIsOrderFormOpen(false);
            onClose();
          }}
          onCancel={() => setIsOrderFormOpen(false)}
        />
      )}
    </>
  );
}
