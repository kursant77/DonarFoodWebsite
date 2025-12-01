import React, { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShoppingCart from "@/components/ShoppingCart";
import Snowflakes from "@/components/Snowflakes";

import type { Product } from "@/types/product";
import { supabase } from "@/lib/supabaseClient";

// Lazy load pages for better performance
const Home = lazy(() => import("@/pages/Home"));
const Menu = lazy(() => import("@/pages/Menu"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Policy = lazy(() => import("@/pages/Policy"));

const AdminLogin = lazy(() => import("@/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const NotFound = lazy(() => import("@/pages/not-found"));

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

  // 🔐 Admin login - remove console.error
  const handleAdminLogin = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      // Validate inputs
      if (!username.trim() || !password.trim()) {
        toast({
          title: "Xato!",
          description: "Login va parolni kiriting.",
          variant: "destructive",
        });
        return false;
      }

      const { data, error } = await supabase
        .from("AdminLogin")
        .select("*")
        .eq("username", username.trim())
        .eq("password", password.trim())
        .single();

      if (error) {
        console.error("Admin login error:", error);
        // Don't reveal if it's a network error or auth error
        if (error.code === "PGRST116") {
          // No rows returned
          toast({
            title: "Xato!",
            description: "Login yoki parol noto'g'ri.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Server xatosi",
            description: "Iltimos, qaytadan urinib ko'ring.",
            variant: "destructive",
          });
        }
        return false;
      }

      if (!data) {
        toast({
          title: "Xato!",
          description: "Login yoki parol noto'g'ri.",
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
        variant: "success",
      });

      return true;
    } catch (err: any) {
      console.error("Admin login exception:", err);
      toast({
        title: "Server xatosi",
        description: err.message || "Iltimos, qaytadan urinib ko'ring.",
        variant: "destructive",
      });
      return false;
    }
  };

  // 🚪 Admin logout - remove console.error
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
      toast({
        title: "Logout xatosi",
        description: "Iltimos, qayta urinib ko'ring.",
        variant: "destructive",
      });
    }
  };

  // �� Savat funksiyalari
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
      title: "Savatga qo'shildi! 🎉",
      description: `${product.title || product.name} muvaffaqiyatli savatga qo'shildi.`,
      variant: "success",
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

      {!isAdminRoute && <Snowflakes />}

      <main className={isAdminRoute ? "" : "min-h-screen"}>
        <Suspense fallback={<LoadingSpinner />}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/menu">
              <Menu onAddToCart={addToCart} />
            </Route>
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/policy" component={Policy} />

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
        </Suspense>
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

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center space-y-4">
      <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
      <p className="text-muted-foreground">Yuklanmoqda...</p>
    </div>
  </div>
);

// Error Boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error caught by boundary:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen flex-col p-8 text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">
            Xatolik yuz berdi
          </h1>
          <p className="text-muted-foreground mb-4">
            Websayt yuklanmadi. Iltimos, sahifani yangilang.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:scale-105 transition-transform duration-200"
          >
            Sahifani yangilash
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <AppContent />
          <Toaster />
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
