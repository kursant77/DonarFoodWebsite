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
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, LogOut, Sun, Moon, Menu, X } from "lucide-react";

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
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mahsulotlar va buyurtmalarni yuklash
  const loadProducts = async () => {
    const { data, error } = await supabase.from("SCL").select("*").order("id", { ascending: true });
    if (!error && data) setProducts(data);
  };

  const loadOrders = async () => {
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (!error && data) setOrders(data);
  };

  useEffect(() => {
    loadProducts();
    loadOrders();
    const channel = supabase
      .channel("orders-listener")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, loadOrders)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  // Mahsulot qo'shish yoki yangilash
  const handleSubmit = async () => {
    if (!form.title || !form.price || !form.category) return alert("Nom, narx va kategoriya majburiy!");
    let imageUrl = form.image;
    if (form.imageFile) {
      const file = form.imageFile;
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;
      const { error: uploadError } = await supabase.storage.from("products").upload(filePath, file);
      if (uploadError) return alert("❌ Rasm yuklashda xato: " + uploadError.message);
      const { data: publicUrl } = supabase.storage.from("products").getPublicUrl(filePath);
      imageUrl = publicUrl.publicUrl;
    }

    if (editingId) {
      const { error } = await supabase
        .from("SCL")
        .update({ title: form.title, price: form.price, category: form.category, image: imageUrl })
        .eq("id", editingId);
      if (error) alert(error.message);
      else alert("✅ Mahsulot yangilandi!");
    } else {
      const { error } = await supabase.from("SCL").insert([{ title: form.title, price: form.price, category: form.category, image: imageUrl }]);
      if (error) alert(error.message);
      else alert("✅ Mahsulot qo‘shildi!");
    }

    setForm({ title: "", price: "", image: "", imageFile: null, category: "" });
    setEditingId(null);
    setOpen(false);
    loadProducts();
  };

  // Mahsulotni o'chirish
  const handleDelete = async (id: number) => {
    if (!confirm("Haqiqatan ham o‘chirmoqchimisiz?")) return;
    const { error } = await supabase.from("SCL").delete().eq("id", id);
    if (error) alert(error.message);
    else loadProducts();
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors overflow-hidden">
      {/* ===== Sidebar ===== */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-md z-50 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="flex flex-col h-full p-6 relative">
          <button
            className="md:hidden absolute top-3 right-3 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5"/>
          </button>
          <h2 className="text-xl font-bold mb-6">Admin Menu</h2>
          <Button variant="ghost" className="justify-start mb-2" onClick={() => { setActiveTab("products"); setSidebarOpen(false); }}>🍔 Mahsulotlar</Button>
          <Button variant="ghost" className="justify-start mb-2" onClick={() => { setActiveTab("orders"); setSidebarOpen(false); }}>🧾 Buyurtmalar</Button>
          <Button variant="ghost" className="justify-start mb-2 flex items-center gap-2" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun className="w-4 h-4"/> : <Moon className="w-4 h-4"/>} {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>
          <Button variant="destructive" className="mt-auto" onClick={onLogout}><LogOut className="w-4 h-4 mr-2"/> Chiqish</Button>
        </div>
      </div>

      {/* Overlay mobil ekranlarda */}
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>}

      {/* ===== Main Content ===== */}
      <div className="flex-1 ml-0 md:ml-64 p-4 sm:p-6 overflow-auto">
        {/* Mobile Hamburger */}
        <div className="md:hidden mb-4">
          <Button variant="outline" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5"/> Menu
          </Button>
        </div>

        {/* ===== PRODUCTS TAB ===== */}
        {activeTab === "products" ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <h2 className="text-lg font-semibold">Mahsulotlar ro‘yxati</h2>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2"/> Qo‘shish
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader><DialogTitle>{editingId ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo‘shish"}</DialogTitle></DialogHeader>
                  <div className="space-y-3 mt-2">
                    <Input placeholder="Nom..." value={form.title} onChange={(e) => setForm({...form, title: e.target.value})}/>
                    <Input type="number" placeholder="Narx..." value={form.price} onChange={(e) => setForm({...form, price: e.target.value})}/>
                    <Input placeholder="Kategoriya..." value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}/>
                    <Input type="file" accept="image/*" onChange={(e) => setForm({...form, imageFile: e.target.files?.[0] || null})}/>
                    {form.image && <img src={form.image} alt="Oldingi rasm" className="w-20 h-20 rounded-md object-cover mt-2"/>}
                    <Button className="w-full" onClick={handleSubmit}>{editingId ? "💾 Yangilash" : "➕ Qo‘shish"}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p) => (
                <Card key={p.id} className="flex flex-col p-3">
                  {p.image ? <img src={p.image} alt={p.title} className="w-full h-32 object-cover rounded-md mb-2"/> : <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-md mb-2"/>}
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{p.category || "—"}</p>
                  <p className="font-bold">{p.price} so‘m</p>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditingId(p.id); setForm({...p,imageFile:null}); setOpen(true); }}>
                      <Pencil className="w-4 h-4"/>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="w-4 h-4"/>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* ===== ORDERS TAB ===== */
          <Card className="overflow-x-auto">
            <div className="min-w-[500px]">
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
                      <TableCell>{new Date(o.created_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {orders.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-6">Hozircha buyurtma yo‘q.</p>}
          </Card>
        )}
      </div>
    </div>
  );
}
