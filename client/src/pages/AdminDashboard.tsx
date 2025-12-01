import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
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
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, Plus, LogOut, Sun, Moon, Menu, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";

// ✅ useToast hook
import { useToast } from "@/hooks/use-toast";

interface AdminDashboardProps {
  onLogout: () => Promise<void>;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { toast } = useToast(); // toast hook

  // === Holatlar ===
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "messages" | "categories" | "analytics">("products");
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [categorySearch, setCategorySearch] = useState("");

  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [lastSeenOrderId, setLastSeenOrderId] = useState<number | null>(() => {
    const saved = localStorage.getItem("lastSeenOrderId");
    return saved ? Number(saved) : null;
  });
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [lastSeenMessageId, setLastSeenMessageId] = useState<number | null>(() => {
    const saved = localStorage.getItem("lastSeenMessageId");
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
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: number | null; type: "product" | "category" | null }>({ open: false, id: null, type: null });

  // Pagination states
  const [ordersPage, setOrdersPage] = useState(1);
  const [messagesPage, setMessagesPage] = useState(1);
  const [categoriesPage, setCategoriesPage] = useState(1);
  const PAGE_SIZE = 10;

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

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("id", { ascending: true });
    if (!error && data) setCategories(data);
  };

  // === Boshlang‘ich yuklash va Realtime ===
  useEffect(() => {
    loadProducts();
    loadOrders();
    loadMessages();
    loadCategories();

    const ordersChannel = supabase
      .channel("orders-listener")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, loadOrders)
      .subscribe();

    const msgChannel = supabase
      .channel("messages-listener")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, loadMessages)
      .subscribe();

    const categoriesChannel = supabase
      .channel("categories-listener")
      .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, loadCategories)
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(msgChannel);
      supabase.removeChannel(categoriesChannel);
    };
  }, []);

  // === Dark mode boshqaruvi ===
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // === Yangi buyurtmalarni tekshirish ===
  useEffect(() => {
    async function fetchOrders() {
      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .order("id", { ascending: false });

      if (ordersData && ordersData.length > 0) {
        setOrders(ordersData);

        const latestOrderId = ordersData[0].id;

        if (lastSeenOrderId) {
          const newCount = ordersData.filter(
            (order) => order.id > lastSeenOrderId
          ).length;
          setNewOrdersCount(newCount);
        } else {
          setNewOrdersCount(0);
        }
      }
    }

    fetchOrders();
    const interval = setInterval(fetchOrders, 2000);
    return () => clearInterval(interval);
  }, [lastSeenOrderId]);

  // === Yangi xabarlarni tekshirish ===
  useEffect(() => {
    async function fetchMessages() {
      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .order("id", { ascending: false });

      if (msgs && msgs.length > 0) {
        setMessages(msgs);

        const latestMsgId = msgs[0].id;
        if (lastSeenMessageId) {
          const newCount = msgs.filter((m) => m.id > lastSeenMessageId).length;
          setNewMessagesCount(newCount);
        } else {
          setNewMessagesCount(0);
        }
      }
    }

    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [lastSeenMessageId]);

  // === Buyurtma sahifasida counterni nolga tushirish ===
  useEffect(() => {
    if (activeTab === "orders" && orders.length > 0) {
      const latestId = orders[0].id;
      setLastSeenOrderId(latestId);
      localStorage.setItem("lastSeenOrderId", String(latestId));
      setNewOrdersCount(0);
    }
    if (activeTab === "messages" && messages.length > 0) {
      const latestMsgId = messages[0].id;
      setLastSeenMessageId(latestMsgId);
      localStorage.setItem("lastSeenMessageId", String(latestMsgId));
      setNewMessagesCount(0);
    }
  }, [activeTab, orders]);

  useEffect(() => {
    if (activeTab === "messages" && messages.length > 0) {
      const latestMsgId = messages[0].id;
      setLastSeenMessageId(latestMsgId);
      localStorage.setItem("lastSeenMessageId", String(latestMsgId));
      setNewMessagesCount(0);
    }
  }, [activeTab, messages]);

  // === Mahsulot qo‘shish / tahrirlash ===
  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category) {
      toast({ title: "Xato", description: "Nom, narx va kategoriya majburiy!", variant: "destructive" });
      return;
    }

    let imageUrl = form.image;
    if (form.imageFile) {
      const file = form.imageFile;
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, file);
      if (uploadError) {
        toast({ title: "Xato", description: "Rasm yuklashda xato: " + uploadError.message, variant: "destructive" });
        return;
      }
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
      toast({ title: "✅ Mahsulot yangilandi", variant: "default" });
    } else {
      await supabase
        .from("SCL")
        .insert([{ name: form.name, price: form.price, category: form.category, image: imageUrl }]);
      toast({ title: "✅ Mahsulot qo‘shildi", variant: "default" });
    }

    setForm({ name: "", price: "", image: "", imageFile: null, category: "" });
    setEditingId(null);
    setOpen(false);
    loadProducts();
  };

  // === Mahsulot o‘chirish ===
  const handleDelete = async (id: number) => {
    await supabase.from("SCL").delete().eq("id", id);
    toast({ title: "✅ Mahsulot o‘chirildi", variant: "default" });
    loadProducts();
  };

  // === Categories CRUD ===
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [categoryForm, setCategoryForm] = useState<{ name: string; description: string }>({ name: "", description: "" });

  const filteredCategories = useMemo(() => {
    const q = categorySearch.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) =>
      (c.name || "").toLowerCase().includes(q) || (c.description || "").toLowerCase().includes(q)
    );
  }, [categories, categorySearch]);

  const totalCategoryPages = Math.max(1, Math.ceil(filteredCategories.length / PAGE_SIZE));
  const pagedCategories = useMemo(() => {
    const start = (categoriesPage - 1) * PAGE_SIZE;
    return filteredCategories.slice(start, start + PAGE_SIZE);
  }, [filteredCategories, categoriesPage]);

  const totalOrdersPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const pagedOrders = useMemo(() => {
    const start = (ordersPage - 1) * PAGE_SIZE;
    return orders.slice(start, start + PAGE_SIZE);
  }, [orders, ordersPage]);

  const totalMessagesPages = Math.max(1, Math.ceil(messages.length / PAGE_SIZE));
  const pagedMessages = useMemo(() => {
    const start = (messagesPage - 1) * PAGE_SIZE;
    return messages.slice(start, start + PAGE_SIZE);
  }, [messages, messagesPage]);

  const submitCategory = async () => {
    if (!categoryForm.name.trim()) {
      toast({ title: "Xato", description: "Kategoriya nomi majburiy", variant: "destructive" });
      return;
    }
    if (editingCategoryId) {
      const { error } = await supabase
        .from("categories")
        .update({ name: categoryForm.name.trim(), description: categoryForm.description.trim() || null })
        .eq("id", editingCategoryId);
      if (error) {
        toast({ title: "Xato", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Category updated successfully" });
    } else {
      const { error } = await supabase
        .from("categories")
        .insert([{ name: categoryForm.name.trim(), description: categoryForm.description.trim() || null }]);
      if (error) {
        toast({ title: "Xato", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Category added successfully" });
    }
    setCategoryForm({ name: "", description: "" });
    setEditingCategoryId(null);
    setCatDialogOpen(false);
    loadCategories();
  };

  const requestDeleteCategory = (id: number) => {
    setDeleteDialog({ open: true, id, type: "category" });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.id || !deleteDialog.type) return;
    if (deleteDialog.type === "product") {
      await supabase.from("SCL").delete().eq("id", deleteDialog.id);
      toast({ title: "✅ Mahsulot o‘chirildi" });
      loadProducts();
    } else if (deleteDialog.type === "category") {
      const { error } = await supabase.from("categories").delete().eq("id", deleteDialog.id);
      if (error) {
        toast({ title: "Xato", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Deleted successfully" });
        loadCategories();
      }
    }
    setDeleteDialog({ open: false, id: null, type: null });
  };

  // === Buyurtma ichidagi mahsulotlarni chiqarish ===
  const formatDateTime = (value?: string | null) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return new Intl.DateTimeFormat("uz-UZ", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Tashkent",
    }).format(date);
  };

  const renderOrderItems = (items: any) => {
    try {
      const parsed = typeof items === "string" ? JSON.parse(items) : items;
      if (Array.isArray(parsed)) {
        return (
          <ul className="list-disc list-inside text-sm">
            {parsed.map((it: any, i: number) => (
              <li key={i}>
                {it.name} — {(it?.qty ?? it?.quantity ?? 1)} × {(typeof it?.price === "number" ? it.price : Number(String(it?.price).replace(/[^\d.-]/g, "")) || 0).toLocaleString()} so‘m
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
    <div className="flex h-screen bg-background text-foreground overflow-hidden transition-colors">
      {/* === SIDEBAR === */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-card border shadow-sm z-50 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
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

          <Button variant="ghost" className="justify-start mb-2" onClick={() => setActiveTab("categories")}>
            🗂️ Kategoriyalar
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

          <Button variant="ghost" className="justify-start mb-2 relative" onClick={() => setActiveTab("messages")}>
            💬 Xabarlar
            {newMessagesCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {newMessagesCount}
              </span>
            )}
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
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
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
                <DialogContent className="max-w-2xl lg:h-[500px] h-[700px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingId ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo‘shish"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="prod-name">Mahsulot nomi</Label>
                        <Input id="prod-name" placeholder="Masalan: Tovuqli lavash" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prod-price">Narx (so‘m)</Label>
                        <Input id="prod-price" type="number" inputMode="numeric" placeholder="25000" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Kategoriya</Label>
                      <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Kategoriya tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.length === 0 && (
                            <div className="px-2 py-1 text-sm text-muted-foreground">Avval kategoriya yarating</div>
                          )}
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="prod-image">Rasm</Label>
                        <Input id="prod-image" type="file" accept="image/*" onChange={(e) => setForm({ ...form, imageFile: e.target.files?.[0] || null })} />
                        <p className="text-xs text-muted-foreground">JPG/PNG, 2MB gacha. 1:1 yoki 4:3 tavsiya etiladi.</p>
                      </div>
                      <div className="flex items-center justify-center">
                        {form.image || form.imageFile ? (
                          <img
                            src={form.imageFile ? URL.createObjectURL(form.imageFile) : form.image}
                            alt="Mahsulot rasm preview"
                            className="w-36 h-36 rounded-md object-cover border"
                          />
                        ) : (
                          <div className="w-36 h-36 rounded-md border border-dashed flex items-center justify-center text-xs text-muted-foreground">
                            Rasm tanlanmagan
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="secondary" onClick={() => setOpen(false)}>Bekor qilish</Button>
                      <Button onClick={handleSubmit}>{editingId ? "💾 Yangilash" : "➕ Qo‘shish"}</Button>
                    </div>
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
                    <div className="w-full h-32 bg-muted rounded-md mb-2" />
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
                    <Button size="sm" variant="destructive" onClick={() => setDeleteDialog({ open: true, id: p.id, type: "product" })}>
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
                  className="border rounded-lg p-3 flex justify-between items-center hover:bg-accent transition"
                >
                  <div className="flex items-center gap-4">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded-md" />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded-md" />
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
                    <Button size="sm" variant="destructive" onClick={() => setDeleteDialog({ open: true, id: p.id, type: "product" })}>
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
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-3">🧾 Buyurtmalar ro‘yxati</h2>
            <Table className="snap-x">
              <TableHeader >
                <TableRow>
                  <TableHead>Ism</TableHead>
                  <TableHead className="min-w-[400px]">Mahsulotlar</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead >Manzil</TableHead>
                  <TableHead>Joylashuv</TableHead>
                  <TableHead>Jami</TableHead>
                  <TableHead>Sana</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedOrders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell>{o.name}</TableCell>
                    <TableCell>{renderOrderItems(o.items)}</TableCell>
                    <TableCell>{o.phone}</TableCell>
                    <TableCell>{o.address}</TableCell>
                    <TableCell>
                      {o.location_url ? (
                        <a
                          href={o.location_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1 text-sm"
                        >
                          <span>📍 Ko'rish</span>
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>{o.total?.toLocaleString()} so'm</TableCell>
                    <TableCell>{formatDateTime(o.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {orders.length === 0 && (
              <p className="text-center text-muted-foreground py-6">
                Hozircha buyurtma yo‘q.
              </p>
            )}
            {orders.length > 0 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setOrdersPage((p) => Math.max(1, p - 1));
                      }}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalOrdersPages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={ordersPage === i + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          setOrdersPage(i + 1);
                        }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setOrdersPage((p) => Math.min(totalOrdersPages, p + 1));
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </Card>
        )}

        {/* === KATEGORIYALAR === */}
        {activeTab === "categories" && (
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">🗂️ Kategoriyalar</h2>
                <Badge variant="secondary" className="font-normal">{filteredCategories.length}/{categories.length}</Badge>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Input
                  placeholder="Qidirish..."
                  value={categorySearch}
                  onChange={(e) => {
                    setCategorySearch(e.target.value);
                    setCategoriesPage(1);
                  }}
                />
                <Dialog open={catDialogOpen} onOpenChange={setCatDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => { setEditingCategoryId(null); setCategoryForm({ name: "", description: "" }); }}>
                      <Plus className="w-4 h-4 mr-2" /> Qo‘shish
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{editingCategoryId ? "Kategoriyani tahrirlash" : "Yangi kategoriya"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                      <div className="space-y-2">
                        <Label htmlFor="cat-name">Kategoriya nomi</Label>
                        <Input id="cat-name" placeholder="Masalan: Burgerlar" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cat-desc">Tavsif (ixtiyoriy)</Label>
                        <Textarea id="cat-desc" placeholder="Qisqacha izoh..." value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => setCatDialogOpen(false)}>Bekor qilish</Button>
                        <Button onClick={submitCategory}>{editingCategoryId ? "💾 Yangilash" : "➕ Qo‘shish"}</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Tavsif</TableHead>
                    <TableHead className="text-right">Amallar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedCategories.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>{c.id}</TableCell>
                      <TableCell>{c.name}</TableCell>
                      <TableCell className="max-w-[400px] truncate">{c.description || "—"}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" variant="outline" onClick={() => { setEditingCategoryId(c.id); setCategoryForm({ name: c.name || "", description: c.description || "" }); setCatDialogOpen(true); }}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => requestDeleteCategory(c.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredCategories.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-6">Hech qanday kategoriya topilmadi.</p>
              )}

              {filteredCategories.length > 0 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCategoriesPage((p) => Math.max(1, p - 1));
                        }}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalCategoryPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          isActive={categoriesPage === i + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            setCategoriesPage(i + 1);
                          }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCategoriesPage((p) => Math.min(totalCategoryPages, p + 1));
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </Card>
        )}


        {/* Global delete confirm */}
        <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>O‘chirishni tasdiqlaysizmi?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteDialog({ open: false, id: null, type: null })}>Bekor qilish</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Ha, o‘chirish</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>


        {/* === XABARLAR === */}
        {activeTab === "messages" && (
          <Card className="p-4">
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
                  {pagedMessages.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>{m.name}</TableCell>
                      <TableCell>{m.email}</TableCell>
                      <TableCell className="max-w-[800px] min-w-[400px]">{m.message}</TableCell>
                      <TableCell className="min-w-[150px]">{formatDateTime(m.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {messages.length === 0 && (
                <p className="text-center text-muted-foreground py-6">
                  Hozircha hech qanday xabar yo‘q.
                </p>
              )}
              {messages.length > 0 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setMessagesPage((p) => Math.max(1, p - 1));
                        }}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalMessagesPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          isActive={messagesPage === i + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            setMessagesPage(i + 1);
                          }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setMessagesPage((p) => Math.min(totalMessagesPages, p + 1));
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </Card>
        )}



        {/* === ANALITIKA === */}
        {activeTab === "analytics" && (
          <Analytics />
        )}

      </div>


    </div>
  );
}
