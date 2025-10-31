import { useEffect, useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

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
import { supabase } from "@/lib/supabaseClient";

export interface CartItem extends Product {
  id: number;
  quantity: number;
}

function AppContent() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  // 🛒 Savat holati + localStorage sinxron
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(
    localStorage.getItem("isAdmin") === "true"
  );

  // 🔐 Admin login
  const handleAdminLogin = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("AdminLogin")
        .select("*")
        .eq("username", username)
        .eq("password", password)
        .single();

      if (error || !data) {
        toast({
          title: "Xato!",
          description: "Login yoki parol noto‘g‘ri.",
          variant: "destructive",
        });
        return false;
      }

      setIsAdminLoggedIn(true);
      localStorage.setItem("isAdmin", "true");
      setLocation("/admin/dashboard");

      toast({
        title: "Xush kelibsiz!",
        description: "Admin panelga muvaffaqiyatli kirdingiz.",
      });

      return true;
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

  // 🚪 Admin logout
  const handleAdminLogout = async (): Promise<void> => {
    try {
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

  // 🛒 Savat funksiyalari
  const addToCart = (product: Product): void => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 } as CartItem];
    });

    toast({
      title: "Savatga qo‘shildi!",
      description: `${product.name} savatga qo‘shildi.`,
    });
  };

  const updateQuantity = (productId: number, quantity: number): void => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (productId: number): void => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const cartItemCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const isAdminRoute = location.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && (
        <Header
          cartItemCount={cartItemCount}
          onCartClick={() => setIsCartOpen(true)}
        />
      )}

      <main className={isAdminRoute ? "" : "min-h-screen"}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/menu">
            <Menu onAddToCart={addToCart} />
          </Route>
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />

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

          <Route component={NotFound} />
        </Switch>
      </main>

      {!isAdminRoute && <Footer />}

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

export default function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
