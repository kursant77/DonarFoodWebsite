import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, LogOut } from "lucide-react";

interface AdminDashboardProps {
  onLogout: () => Promise<void>;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    price: "",
    image: "",
    imageFile: null as File | null,
    category: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  // 🧩 Mahsulotlarni yuklash
  const loadProducts = async () => {
    const { data, error } = await supabase
      .from("SCL")
      .select("*")
      .order("id", { ascending: true });
    if (!error && data) setProducts(data);
  };

  // 🧾 Buyurtmalarni yuklash
  const loadOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setOrders(data);
  };

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

  // 🧠 Mahsulot qo‘shish yoki yangilash (rasm yuklash bilan)
  const handleSubmit = async () => {
    if (!form.title || !form.price || !form.category) {
      alert("Nom, narx va kategoriya majburiy!");
      return;
    }

    let imageUrl = form.image;

    // Agar fayl tanlangan bo‘lsa — Supabase Storage’ga yuklaymiz
    if (form.imageFile) {
      const file = form.imageFile;
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("products") // bucket nomi
        .upload(filePath, file);

      if (uploadError) {
        alert("❌ Rasm yuklashda xato: " + uploadError.message);
        return;
      }

      // Rasmga public URL olish
      const { data: publicUrl } = supabase.storage
        .from("products")
        .getPublicUrl(filePath);

      imageUrl = publicUrl.publicUrl;
    }

    // 🔄 Yaratish yoki yangilash
    if (editingId) {
      const { error } = await supabase
        .from("SCL")
        .update({
          title: form.title,
          price: form.price,
          category: form.category,
          image: imageUrl,
        })
        .eq("id", editingId);

      if (error) alert(error.message);
      else alert("✅ Mahsulot yangilandi!");
    } else {
      const { error } = await supabase.from("SCL").insert([
        {
          title: form.title,
          price: form.price,
          category: form.category,
          image: imageUrl,
        },
      ]);

      if (error) alert(error.message);
      else alert("✅ Mahsulot qo‘shildi!");
    }

    setForm({
      title: "",
      price: "",
      image: "",
      imageFile: null,
      category: "",
    });
    setEditingId(null);
    setOpen(false);
    loadProducts();
  };

  // ❌ O‘chirish
  const handleDelete = async (id: number) => {
    if (!confirm("Haqiqatan ham o‘chirmoqchimisiz?")) return;
    const { error } = await supabase.from("SCL").delete().eq("id", id);
    if (error) alert(error.message);
    else {
      alert("🗑️ O‘chirildi!");
      loadProducts();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <Button variant="destructive" onClick={onLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Chiqish
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="products">🍔 Mahsulotlar</TabsTrigger>
          <TabsTrigger value="orders">🧾 Buyurtmalar</TabsTrigger>
        </TabsList>

        {/* ===== MAHSULOTLAR ===== */}
        <TabsContent value="products">
          <div className="flex justify-between items-center mt-4 mb-3">
            <h2 className="text-lg font-semibold">Mahsulotlar ro‘yxati</h2>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" /> Qo‘shish
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo‘shish"}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-3 mt-2">
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
                    placeholder="Kategoriya..."
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  />

                  {/* Rasm tanlash */}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        imageFile: e.target.files?.[0] || null,
                      })
                    }
                  />

                  {form.image && (
                    <img
                      src={form.image}
                      alt="Oldingi rasm"
                      className="w-20 h-20 rounded-md object-cover mt-2"
                    />
                  )}

                  <Button className="w-full" onClick={handleSubmit}>
                    {editingId ? "💾 Yangilash" : "➕ Qo‘shish"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rasm</TableHead>
                  <TableHead>Nom</TableHead>
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
                          alt={p.title}
                          className="w-14 h-14 rounded-md object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gray-200 rounded-md" />
                      )}
                    </TableCell>
                    <TableCell>{p.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{p.category || "—"}</Badge>
                    </TableCell>
                    <TableCell>{p.price} so‘m</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(p.id);
                            setForm({
                              title: p.title,
                              price: p.price,
                              category: p.category,
                              image: p.image,
                              imageFile: null,
                            });
                            setOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(p.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* ===== BUYURTMALAR ===== */}
        <TabsContent value="orders">
          <Card className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ism</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead>Manzil</TableHead>
                  <TableHead>Jami</TableHead>
                  <TableHead>Sana</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell>{o.name}</TableCell>
                    <TableCell>{o.phone}</TableCell>
                    <TableCell>{o.address}</TableCell>
                    <TableCell>{o.total} so‘m</TableCell>
                    <TableCell>
                      {new Date(o.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {orders.length === 0 && (
              <p className="text-center text-gray-500 py-6">
                Hozircha buyurtma yo‘q.
              </p>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
