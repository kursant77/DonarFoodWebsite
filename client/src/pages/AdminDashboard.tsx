import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit2,
  Trash2,
  LogOut,
  ShoppingBag,
  Package,
} from "lucide-react";

// ✅ ID endi string
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
}

interface Order {
  id: string;
  name: string;
  phone: string;
  address: string;
  items: any[];
  total: number;
  date: string;
}

export default function AdminDashboard({
  onLogout,
}: {
  onLogout: () => void;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: null as File | null,
  });

  // ✅ Mahsulotlarni olish
  const loadProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Mahsulotlarni olishda xato:", err);
    }
  };

  // ✅ Buyurtmalarni olish
  const loadOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Buyurtmalarni olishda xato:", err);
    }
  };

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  // ✅ Qo‘shish yoki tahrirlash
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("category", form.category);
    if (form.image) formData.append("image", form.image);

    const url = editing ? `/api/products/${editing.id}` : "/api/products";
    const method = editing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.success) {
        await loadProducts();
        alert(editing ? "✅ Mahsulot yangilandi!" : "✅ Yangi mahsulot qo‘shildi!");
        setIsModalOpen(false);
        setEditing(null);
        setForm({ name: "", price: "", category: "", image: null });
      } else {
        alert("❌ Xato: " + data.message);
      }
    } catch (err) {
      console.error("Saqlashda xato:", err);
      alert("⚠️ Server bilan aloqa yo‘q");
    }

    setLoading(false);
  };

  // ✅ O‘chirish (string id bilan!)
  const handleDelete = async (id: string) => {
    if (!confirm("Mahsulotni o‘chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (res.ok && data.success) {
        alert("🗑️ Mahsulot o‘chirildi!");
        await loadProducts();
      } else {
        alert("❌ Xato: " + data.message);
      }
    } catch (err) {
      console.error("O‘chirishda xato:", err);
      alert("⚠️ Server bilan aloqa yo‘q");
    }
  };

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r flex flex-col">
        <div className="p-6 border-b">
          <div className="text-2xl font-bold text-primary">🍔 Donar Food</div>
          <p className="text-sm text-muted-foreground mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant={activeTab === "products" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("products")}
          >
            <Package className="h-4 w-4 mr-2" /> Mahsulotlar
          </Button>
          <Button
            variant={activeTab === "orders" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingBag className="h-4 w-4 mr-2" /> Buyurtmalar
          </Button>
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2" /> Chiqish
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-8">
        {activeTab === "products" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Mahsulotlar boshqaruvi</h1>
              <Button
                onClick={() => {
                  setEditing(null);
                  setForm({ name: "", price: "", category: "", image: null });
                  setIsModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" /> Qo‘shish
              </Button>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rasm</TableHead>
                    <TableHead>Nomi</TableHead>
                    <TableHead>Kategoriya</TableHead>
                    <TableHead>Narx</TableHead>
                    <TableHead className="text-right">Amallar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        {p.image ? (
                          <img
                            src={p.image}
                            className="w-16 h-16 rounded object-cover"
                          />
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.category}</TableCell>
                      <TableCell>{p.price} so‘m</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setEditing(p);
                            setForm({
                              name: p.name,
                              price: String(p.price),
                              category: p.category,
                              image: null,
                            });
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(p.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </>
        )}

        {activeTab === "orders" && (
          <>
            <h1 className="text-2xl font-bold mb-6">Buyurtmalar tarixi</h1>
            {orders.length === 0 && <p>Hozircha buyurtmalar yo‘q.</p>}
            <div className="grid gap-4">
              {orders.map((order) => (
                <Card key={order.id} className="p-4">
                  <div className="flex justify-between mb-2">
                    <div>
                      <p className="font-bold">{order.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.phone} — {order.address}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-primary">
                        {order.total.toLocaleString()} so‘m
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Mahsulotni tahrirlash" : "Yangi mahsulot"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nomi</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Kategoriya</Label>
              <Input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Narx</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Rasm</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, image: e.target.files?.[0] || null })
                }
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsModalOpen(false)}
              >
                Bekor qilish
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Saqlanmoqda..." : "Saqlash"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
