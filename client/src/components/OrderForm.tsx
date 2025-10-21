import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface OrderFormProps {
  total: number;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function OrderForm({ total, onSubmit, onCancel }: OrderFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) return alert("Barcha maydonlarni to‘ldiring!");

    setLoading(true);

    try {
      // 🛒 Savatdagi mahsulotlar
      const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");

      // 🚀 Serverga yuborish
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          address,
          items: cartItems,
          total,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("✅ Buyurtma muvaffaqiyatli yuborildi!");
        localStorage.removeItem("cart");
        onSubmit(); // Formani yopish va holatni yangilash
      } else {
        alert("❌ Xato: " + (data.message || "Buyurtma yuborishda xato"));
      }
    } catch (err) {
      console.error("Order xato:", err);
      alert("⚠️ Server bilan aloqa o‘rnatilmadi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
        <h2 className="text-2xl font-bold mb-6">Buyurtma berish</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Ismingiz *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ismingizni kiriting"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefon raqam *</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998 90 123 45 67"
              required
            />
          </div>

          <div>
            <Label htmlFor="address">Manzil *</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Yetkazib berish manzilini kiriting"
              required
              rows={3}
            />
          </div>

          <div className="border-t pt-4 mt-6">
            <div className="flex items-center justify-between text-lg font-bold mb-4">
              <span>Jami to‘lov:</span>
              <span className="font-mono text-primary text-2xl">
                {total.toLocaleString()} so‘m
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onCancel}
            >
              Bekor qilish
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? "Yuborilmoqda..." : "Tasdiqlash"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
