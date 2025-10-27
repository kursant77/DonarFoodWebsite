import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

// 🧩 Components
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShoppingCart, { CartItem } from "@/components/ShoppingCart";

// 🧭 Pages
import Home from "@/pages/Home";
import Menu from "@/pages/Menu";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/not-found";

import type { Product } from "@shared/schema";

// ✅ Backend URL
const API_URL = import.meta.env.VITE_API_URL;

function AppContent() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // 🧠 LocalStorage orqali admin holatini tiklash
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    setIsAdminLoggedIn(isAdmin);
  }, []);

  // 👑 Admin login
  const handleAdminLogin = (username: string, password: string) => {
    if (username === "admin" && password === "donarfood123") {
      setIsAdminLoggedIn(true);
      localStorage.setItem("isAdmin", "true");
      setLocation("/admin/dashboard");

      toast({
        title: "Xush kelibsiz!",
        description: "Admin panelga kirildi.",
      });
    } else {
      toast({
        title: "Xato!",
        description: "Login yoki parol noto‘g‘ri.",
        variant: "destructive",
      });
    }
  };

  // 🚪 Admin chiqish
  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem("isAdmin");
    setLocation("/admin");

    toast({
      title: "Chiqildi",
      description: "Admin paneldan chiqdingiz.",
    });
  };

  // 🛒 Savatga qo‘shish
  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    toast({
      title: "Savatga qo‘shildi!",
      description: `${product.name} savatga qo‘shildi.`,
    });
  };

  // 🔄 Miqdorni o‘zgartirish
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // ❌ Mahsulotni o‘chirish
  const removeItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  // 🔢 Umumiy qiymat
  const cartItemCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const isAdminRoute = location.startsWith("/admin");

  return (
    <>
      {/* 🔝 Header (Admin sahifalarda yashirin) */}
      {!isAdminRoute && (
        <Header
          cartItemCount={cartItemCount}
          onCartClick={() => setIsCartOpen(true)}
        />
      )}

      <main className={isAdminRoute ? "" : "min-h-screen"}>
        <Switch>
          {/* 🌐 Foydalanuvchi sahifalari */}
          <Route path="/" component={Home} />
          <Route path="/menu">
            <Menu onAddToCart={addToCart} />
          </Route>
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />

          {/* 👑 Admin sahifalari */}
          <Route path="/admin/dashboard">
            {isAdminLoggedIn ? (
              <AdminDashboard onLogout={handleAdminLogout} />
            ) : (
              <AdminLogin onLogin={handleAdminLogin} />
            )}
          </Route>

          <Route path="/admin">
            <AdminLogin onLogin={handleAdminLogin} />
          </Route>

          {/* ❌ 404 sahifasi */}
          <Route component={NotFound} />
        </Switch>
      </main>

      {/* 🔚 Footer */}
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

// 🌍 Root Provider
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
