import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import Analytics from "./Analytics";
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
import { Pencil, Trash2, Plus, LogOut, Sun, Moon, Menu, X } from "lucide-react";

interface AdminDashboardProps {
  onLogout: () => Promise<void>;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  // === Holatlar ===
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "messages" | "analytics">("products");
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [lastSeenOrderId, setLastSeenOrderId] = useState<number | null>(() => {
    const saved = localStorage.getItem("lastSeenOrderId");
    return saved ? Number(saved) : null;
  });



  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    imageFile: null as File | null,
    category: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // === Supabase’dan ma’lumotlarni olish ===
  const loadProducts = async () => {
    const { data, error } = await supabase.from("SCL").select("*").order("id");
    if (!error && data) setProducts(data);
  };

  const loadOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setOrders(data);
  };

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setMessages(data);
  };

  // === Boshlang‘ich yuklash ===
  useEffect(() => {
    loadProducts();
    loadOrders();
    loadMessages();

    // Realtime o‘zgarishlarni kuzatish
    const ordersChannel = supabase
      .channel("orders-listener")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, loadOrders)
      .subscribe();

    const msgChannel = supabase
      .channel("messages-listener")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, loadMessages)
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(msgChannel);
    };
  }, []);

  // === Dark mode boshqaruvi ===
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    async function fetchOrders() {
      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .order("id", { ascending: false });

      if (ordersData && ordersData.length > 0) {
        setOrders(ordersData);

        const latestOrderId = ordersData[0].id;

        // Faqat birinchi yuklashda yoki yangi buyurtma paydo bo‘lganda hisoblaymiz
        if (lastSeenOrderId) {
          const newCount = ordersData.filter(
            (order) => order.id > lastSeenOrderId
          ).length;
          setNewOrdersCount(newCount);
        } else {
          setNewOrdersCount(0); // Dastlabki yuklashda 0 bo‘lsin
        }
      }
    }

    fetchOrders();
    const interval = setInterval(fetchOrders, 2000);
    return () => clearInterval(interval);
  }, [lastSeenOrderId]);

  // === Admin buyurtmalar sahifasiga kirganda counterni nolga tushirish ===
  useEffect(() => {
    if (activeTab === "orders" && orders.length > 0) {
      const latestId = orders[0].id;
      setLastSeenOrderId(latestId);
      localStorage.setItem("lastSeenOrderId", String(latestId));
      setNewOrdersCount(0);
    }
  }, [activeTab, orders]);

  // === Mahsulot qo‘shish / tahrirlash ===
  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category)
      return alert("Nom, narx va kategoriya majburiy!");

    let imageUrl = form.image;
    if (form.imageFile) {
      const file = form.imageFile;
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, file);
      if (uploadError) return alert("❌ Rasm yuklashda xato: " + uploadError.message);
      const { data: publicUrl } = supabase.storage.from("products").getPublicUrl(filePath);
      imageUrl = publicUrl.publicUrl;
    }

    if (editingId) {
      await supabase
        .from("SCL")
        .update({
          name: form.name,
          price: form.price,
          category: form.category,
          image: imageUrl,
        })
        .eq("id", editingId);
      alert("✅ Mahsulot yangilandi!");
    } else {
      await supabase
        .from("SCL")
        .insert([{ name: form.name, price: form.price, category: form.category, image: imageUrl }]);
      alert("✅ Mahsulot qo‘shildi!");
    }

    setForm({ name: "", price: "", image: "", imageFile: null, category: "" });
    setEditingId(null);
    setOpen(false);
    loadProducts();
  };

  // === Mahsulot o‘chirish ===
  const handleDelete = async (id: number) => {
    if (!confirm("Haqiqatan ham o‘chirmoqchimisiz?")) return;
    await supabase.from("SCL").delete().eq("id", id);
    loadProducts();
  };

  // === Buyurtma ichidagi mahsulotlarni chiqarish ===
  const renderOrderItems = (items: any) => {
    try {
      const parsed = typeof items === "string" ? JSON.parse(items) : items;
      if (Array.isArray(parsed)) {
        return (
          <ul className="list-disc list-inside text-sm">
            {parsed.map((it: any, i: number) => (
              <li key={i}>
                {it.name} — {it.qty || 1} × {it.price?.toLocaleString() || "0"} so‘m
              </li>
            ))}
          </ul>
        );
      }
      return <span>{String(items)}</span>;
    } catch {
      return <span>{String(items)}</span>;
    }
  };

  // === UI ===
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden transition-colors">
      {/* === SIDEBAR === */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-md z-50 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
      >
        <div className="flex flex-col h-full p-6 relative">
          <button
            className="md:hidden absolute top-3 right-3 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

          <Button variant="ghost" className="justify-start mb-2" onClick={() => setActiveTab("products")}>
            🍔 Mahsulotlar
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab("orders")}
            className="justify-start mb-2"
          >
            🧾 Buyurtmalar
            {newOrdersCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {newOrdersCount}
              </span>
            )}
          </Button>

          <Button variant="ghost" className="justify-start mb-2" onClick={() => setActiveTab("messages")}>
            💬 Xabarlar
          </Button>
          <Button variant="ghost" className="justify-start mb-2" onClick={() => setActiveTab("analytics")}>
            📊 Analitika
          </Button>


          <Button variant="destructive" className="mt-auto" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Chiqish
          </Button>
        </div>
      </div>

      {/* Overlay (mobil menyu yopish) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* === ASOSIY QISM === */}
      <div className="flex-1 ml-0 md:ml-64 p-4 sm:p-6 overflow-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={() => setSidebarOpen(true)} className="md:hidden">
            <Menu className="w-5 h-5" /> Menu
          </Button>

          <Button variant="ghost" onClick={() => setDarkMode(!darkMode)} className="flex items-center gap-2">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>

        {/* === MAHSULOTLAR === */}
        {activeTab === "products" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
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
                    <Input placeholder="Nom..." value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <Input type="number" placeholder="Narx..." value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                    <Input placeholder="Kategoriya..." value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                    <Input type="file" accept="image/*" onChange={(e) => setForm({ ...form, imageFile: e.target.files?.[0] || null })} />
                    {form.image && <img src={form.image} alt="Oldingi rasm" className="w-20 h-20 rounded-md object-cover mt-2" />}
                    <Button className="w-full" onClick={handleSubmit}>
                      {editingId ? "💾 Yangilash" : "➕ Qo‘shish"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Mobilda card */}
            <div className="grid grid-cols-2 gap-4 md:hidden">
              {products.map((p) => (
                <Card key={p.id} className="flex flex-col p-3">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-32 object-cover rounded-md mb-2" />
                  ) : (
                    <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-md mb-2" />
                  )}
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{p.category || "—"}</p>
                  <p className="font-bold">{p.price} so‘m</p>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(p.id);
                        setForm({ ...p, imageFile: null });
                        setOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Desktopda ro‘yxat */}
            <div className="hidden md:block space-y-3">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="border rounded-lg p-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <div className="flex items-center gap-4">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded-md" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-md" />
                    )}
                    <div>
                      <h3 className="font-semibold">{p.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{p.category || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold">{p.price} so‘m</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(p.id);
                        setForm({ ...p, imageFile: null });
                        setOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === BUYURTMALAR === */}
        {activeTab === "orders" && (
          <Card className="p-4 dark:bg-gray-800">
            <h2 className="text-lg font-semibold mb-3">🧾 Buyurtmalar ro‘yxati</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ism</TableHead>
                  <TableHead>Mahsulotlar</TableHead>
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
                    <TableCell>{renderOrderItems(o.items)}</TableCell>
                    <TableCell>{o.phone}</TableCell>
                    <TableCell>{o.address}</TableCell>
                    <TableCell>{o.total?.toLocaleString()} so‘m</TableCell>
                    <TableCell>{new Date(o.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {orders.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-6">
                Hozircha buyurtma yo‘q.
              </p>
            )}
          </Card>
        )}

        {/* === XABARLAR === */}
        {activeTab === "messages" && (
          <Card className="p-4 dark:bg-gray-800">
            <h2 className="text-lg font-semibold mb-4">💬 Foydalanuvchi xabarlari</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ism</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Xabar</TableHead>
                    <TableHead>Sana</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>{m.name}</TableCell>
                      <TableCell>{m.email}</TableCell>
                      <TableCell className="max-w-[300px] truncate">{m.message}</TableCell>
                      <TableCell>{new Date(m.created_at).toLocaleString("uz-UZ")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {messages.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-6">
                  Hozircha hech qanday xabar yo‘q.
                </p>
              )}
            </div>
          </Card>
        )}

        {/* === ANALITIKA === */}
        {activeTab === "analytics" && (
          <Analytics orders={orders} products={products} messages={messages} />
        )}

      </div>
    </div>
  );
}
