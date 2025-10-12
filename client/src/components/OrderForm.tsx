import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface OrderFormProps {
  total: number;
  onSubmit: (data: { name: string; phone: string; address: string }) => void;
  onCancel: () => void;
}

export default function OrderForm({ total, onSubmit, onCancel }: OrderFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, phone, address });
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
              data-testid="input-name"
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
              data-testid="input-phone"
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
              data-testid="input-address"
            />
          </div>

          <div className="border-t pt-4 mt-6">
            <div className="flex items-center justify-between text-lg font-bold mb-4">
              <span>Jami to'lov:</span>
              <span className="font-mono text-primary text-2xl">
                {total.toLocaleString()} so'm
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onCancel}
              data-testid="button-cancel-order"
            >
              Bekor qilish
            </Button>
            <Button
              type="submit"
              className="flex-1"
              data-testid="button-submit-order"
            >
              Tasdiqlash
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
