// ------------------------------------------------------------
// 🧩 Asosiy ilova (App.tsx)
// Jaloliddin Manguberdi akademiyasi uchun tayyorlangan
// Frontend: React + TypeScript + Wouter + TanStack Query + Supabase
// ------------------------------------------------------------

import { useState } from "react";
import { Switch, Route, useLocation } from "wouter"; // ⚙️ Marshrutlash uchun
import { QueryClientProvider } from "@tanstack/react-query"; // ⚙️ Ma’lumotlarni keshlash uchun
import { queryClient } from "@/lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast"; // ✅ Toast bildirishnomalar uchun

// -----------------------------
// 🧩 Komponentlar va sahifalar
// -----------------------------
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShoppingCart from "@/components/ShoppingCart";

import Home from "@/pages/Home";
import Menu from "@/pages/Menu";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/not-found";

import type { Product } from "@/types/product";
import { supabase } from "@/lib/supabaseClient"; // ✅ Supabase ulanishi

// ------------------------------------------------------------
// 🧮 Tiplar
// CartItem — Product asosida yaratilgan, ammo unga quantity qo‘shilgan
// ------------------------------------------------------------
export interface CartItem extends Product {
  id: number; // Har bir mahsulot uchun noyob identifikator
  quantity: number; // Savatda nechta dona borligini bildiradi
}

// ============================================================
// 🌟 Asosiy ilova komponenti
// ============================================================
function AppContent() {
  const [location, setLocation] = useLocation(); // Wouter orqali marshrutni boshqarish
  const { toast } = useToast(); // Toast xabarlar uchun

  // 🛒 Savat holatlari
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 🔐 Admin holati
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(
    localStorage.getItem("isAdmin") === "true"
  );

  // ------------------------------------------------------------
  // 🔑 ADMIN LOGIN FUNKSIYASI — Supabase jadvalidan foydalanuvchi tekshiradi
  // ------------------------------------------------------------
  const handleAdminLogin = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      // 🧭 Supabase’dagi “AdminLogin” jadvalidan ma’lumot olish
      const { data, error } = await supabase
        .from("AdminLogin")
        .select("*")
        .eq("username", username)
        .eq("password", password)
        .single();

      // ❌ Agar login yoki parol noto‘g‘ri bo‘lsa
      if (error || !data) {
        toast({
          title: "Xato!",
          description: "Login yoki parol noto‘g‘ri.",
          variant: "destructive",
        });
        return false;
      }

      // ✅ Muvaffaqiyatli login
      setIsAdminLoggedIn(true);
      localStorage.setItem("isAdmin", "true");
      setLocation("/admin/dashboard");

      toast({
        title: "Xush kelibsiz!",
        description: "Admin panelga muvaffaqiyatli kirdingiz.",
      });

      return true; // boolean qaytaradi → AdminLogin bilan mos
    } catch (err) {
      console.error("Login error:", err);
      toast({
        title: "Server xatosi",
        description: "Iltimos, qaytadan urinib ko‘ring.",
        variant: "destructive",
      });
      return false;
    }
  };

  // ------------------------------------------------------------
  // 🚪 ADMIN LOGOUT FUNKSIYASI — hisobdan chiqish
  // ------------------------------------------------------------
  const handleAdminLogout = async (): Promise<void> => {
    try {
      // Agar Supabase Auth ishlatilsa, bu joyda:
      // await supabase.auth.signOut();

      setIsAdminLoggedIn(false);
      localStorage.removeItem("isAdmin");
      setLocation("/admin");

      toast({
        title: "Chiqdingiz",
        description: "Admin paneldan chiqdingiz.",
      });
    } catch (err) {
      console.error("Logout error:", err);
      toast({
        title: "Logout xatosi",
        description: "Iltimos, qayta urinib ko‘ring.",
        variant: "destructive",
      });
    }
  };

  // ------------------------------------------------------------
  // 🛒 SAVAT FUNKSIYALARI — qo‘shish, o‘chirish, miqdorni yangilash
  // ------------------------------------------------------------

  // ➕ Mahsulotni savatga qo‘shish
  const addToCart = (product: Product): void => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      // Agar mahsulot savatda bo‘lsa — miqdorni oshirish
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Yangi mahsulotni qo‘shish
      return [...prev, { ...(product as Product), quantity: 1 } as CartItem];
    });

    // ✅ Toast xabari
    toast({
      title: "Savatga qo‘shildi!",
      description: `${product.name} savatga qo‘shildi.`,
    });
  };

  // 🔄 Mahsulot miqdorini o‘zgartirish
  const updateQuantity = (productId: number, quantity: number): void => {
    if (quantity < 1) return; // 0 yoki manfiy bo‘lishiga ruxsat yo‘q
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // ❌ Mahsulotni savatdan o‘chirish
  const removeItem = (productId: number): void => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  // 📊 Savatdagi umumiy mahsulotlar soni
  const cartItemCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // 🔒 Admin sahifalarini aniqlash (Header/Footer’ni yashirish uchun)
  const isAdminRoute = location.startsWith("/admin");

  // ------------------------------------------------------------
  // 🧱 RENDER QISMI — Barcha sahifalar va komponentlar
  // ------------------------------------------------------------
  return (
    <>
      {/* 🌐 Header (faqat foydalanuvchi sahifalarida) */}
      {!isAdminRoute && (
        <Header
          cartItemCount={cartItemCount}
          onCartClick={() => setIsCartOpen(true)}
        />
      )}

      {/* 📄 Asosiy sahifalar */}
      <main className={isAdminRoute ? "" : "min-h-screen"}>
        <Switch>
          {/* 🏠 Asosiy sahifa */}
          <Route path="/" component={Home} />

          {/* 🍔 Menu sahifasi (mahsulotlar) */}
          <Route path="/menu">
            <Menu onAddToCart={addToCart} />
          </Route>

          {/* ℹ️ Ma’lumot sahifalari */}
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />

          {/* 🔐 Admin sahifalari */}
          <Route path="/admin/dashboard">
            {isAdminLoggedIn ? (
              <AdminDashboard onLogout={handleAdminLogout} />
            ) : (
              <AdminLogin onLogin={handleAdminLogin} />
            )}
          </Route>

          {/* 🧩 Admin login sahifasi */}
          <Route path="/admin">
            <AdminLogin onLogin={handleAdminLogin} />
          </Route>

          {/* 🚫 404 sahifa */}
          <Route component={NotFound} />
        </Switch>
      </main>

      {/* 🌐 Footer (faqat foydalanuvchi sahifalarida) */}
      {!isAdminRoute && <Footer />}

      {/* 🛒 Savat oynasi */}
      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
    </>
  );
}

// ============================================================
// 🌍 Root komponent — barcha kontekstlarni bir joyda boshqaradi
// ============================================================
export default function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <Toaster /> {/* 🔔 Toast bildirishnomalari */}
      </TooltipProvider>
    </QueryClientProvider>
  );
}
