import { useEffect, useState } from "react";
import { supabase } from "../supabase"; // ✅ Supabase ulanishi
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AdminDashboardProps {
  onLogout: () => Promise<void>;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");

  // 🍔 SCL jadvalidan mahsulotlar
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  const [form, setForm] = useState({
    title: "",
    price: "",
    image: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  // ==========================
  // MAHSULOTLARNI O‘QISH (SCL)
  // ==========================
  const loadProducts = async () => {
    const { data, error } = await supabase
      .from("SCL")
      .select("*")
      .order("id", { ascending: true });

    if (error) console.error("❌ Xato (SCL):", error);
    else setProducts(data || []);
  };

  // ==========================
  // BUYURTMALARNI O‘QISH (orders)
  // ==========================
  const loadOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("❌ Xato (orders):", error);
    else setOrders(data || []);
  };

  // ==========================
  // REAL-TIME KUZATUV (orders)
  // ==========================
  useEffect(() => {
    loadProducts();
    loadOrders();

    const channel = supabase
      .channel("orders-listener")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        loadOrders
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ==========================
  // MAHSULOT QO‘SHISH
  // ==========================
  const handleAdd = async () => {
    if (!form.title || !form.price) return alert("Nom va narx majburiy!");

    const { error } = await supabase.from("SCL").insert([
      {
        title: form.title,
        price: form.price,
        image: form.image || null,
      },
    ]);

    if (error) alert("❌ Xato: " + error.message);
    else {
      alert("✅ Mahsulot qo‘shildi!");
      setForm({ title: "", price: "", image: "" });
      loadProducts();
    }
  };

  // ==========================
  // TAHRIRLASH
  // ==========================
  const handleEdit = (p: any) => {
    setForm(p);
    setEditingId(p.id);
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    const { error } = await supabase
      .from("SCL")
      .update({
        title: form.title,
        price: form.price,
        image: form.image || null,
      })
      .eq("id", editingId);

    if (error) alert("❌ Xato: " + error.message);
    else {
      alert("✅ Yangilandi!");
      setEditingId(null);
      setForm({ title: "", price: "", image: "" });
      loadProducts();
    }
  };

  // ==========================
  // O‘CHIRISH
  // ==========================
  const handleDelete = async (id: number) => {
    if (!confirm("Haqiqatan ham o‘chirmoqchimisiz?")) return;

    const { error } = await supabase.from("SCL").delete().eq("id", id);
    if (error) alert("❌ Xato: " + error.message);
    else {
      alert("🗑️ O‘chirildi!");
      loadProducts();
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between mb-6">
        <div className="flex gap-3">
          <Button
            variant={activeTab === "products" ? "default" : "outline"}
            onClick={() => setActiveTab("products")}
          >
            🍔 Mahsulotlar
          </Button>
          <Button
            variant={activeTab === "orders" ? "default" : "outline"}
            onClick={() => setActiveTab("orders")}
          >
            🧾 Buyurtmalar
          </Button>
        </div>

        <Button variant="destructive" onClick={onLogout}>
          🚪 Chiqish
        </Button>
      </div>

      {/* PRODUCTS */}
      {activeTab === "products" && (
        <Card className="p-4 space-y-4">
          <h2 className="text-xl font-semibold">🍟 Mahsulot qo‘shish / tahrirlash</h2>

          <div className="grid md:grid-cols-2 gap-3">
            <Input
              placeholder="Nom..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Narx..."
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <Input
              placeholder="Rasm URL"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={editingId ? handleUpdate : handleAdd}>
              {editingId ? "💾 Yangilash" : "➕ Qo‘shish"}
            </Button>
            {editingId && (
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setForm({ title: "", price: "", image: "" });
                }}
              >
                Bekor qilish
              </Button>
            )}
          </div>

          <hr className="my-4" />

          <div className="grid md:grid-cols-3 gap-4">
            {products.map((p) => (
              <Card key={p.id} className="p-3 space-y-2">
                {p.image && (
                  <img
                    src={p.image}
                    alt={p.title}
                    className="rounded-md w-full h-40 object-cover"
                  />
                )}
                <h3 className="font-bold text-lg">{p.title}</h3>
                <p>{p.price} so‘m</p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleEdit(p)}>
                    ✏️
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(p.id)}
                  >
                    🗑️
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* ORDERS */}
      {activeTab === "orders" && (
        <Card className="p-4 space-y-4">
          <h2 className="text-xl font-semibold mb-4">🧾 Buyurtmalar ro‘yxati</h2>
          {orders.length === 0 ? (
            <p>Hozircha buyurtma yo‘q.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <Card key={o.id} className="p-3">
                  <p>
                    <b>👤 Ism:</b> {o.name}
                  </p>
                  <p>
                    <b>📞 Telefon:</b> {o.phone}
                  </p>
                  <p>
                    <b>📍 Manzil:</b> {o.address}
                  </p>
                  <p>
                    <b>💰 Jami:</b> {o.total} so‘m
                  </p>
                  <p>
                    <b>🕒 Sana:</b>{" "}
                    {new Date(o.created_at).toLocaleString()}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
