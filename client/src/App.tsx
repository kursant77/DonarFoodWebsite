import { useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShoppingCart, { CartItem } from "@/components/ShoppingCart";
import OrderForm from "@/components/OrderForm";

import Home from "@/pages/Home";
import Menu from "@/pages/Menu";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/not-found";

import type { Product } from "@shared/schema";

function AppContent() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);

  // Admin state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Cart functions
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
      title: "Savatga qo'shildi!",
      description: `${product.name} savatga qo'shildi`,
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setShowOrderForm(true);
  };

  const handleOrderSubmit = (data: { name: string; phone: string; address: string }) => {
    console.log('Order submitted:', { ...data, items: cartItems });
    
    //todo: remove mock functionality - submit to backend API
    toast({
      title: "Buyurtma qabul qilindi!",
      description: "Tez orada siz bilan bog'lanamiz.",
    });

    setCartItems([]);
    setShowOrderForm(false);
  };

  // Admin functions
  const handleAdminLogin = (username: string, password: string) => {
    //todo: remove mock functionality - verify with backend
    if (username === "admin" && password === "donarfoof123") {
      setIsAdminLoggedIn(true);
      setLocation("/admin/dashboard");
      toast({
        title: "Xush kelibsiz!",
        description: "Admin panelga kirildi",
      });
    } else {
      toast({
        title: "Xato!",
        description: "Login yoki parol noto'g'ri",
        variant: "destructive",
      });
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setLocation("/admin");
    toast({
      title: "Chiqildi",
      description: "Admin paneldan chiqdingiz",
    });
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
          
          <Route path="/admin">
            {isAdminLoggedIn ? (
              <AdminDashboard onLogout={handleAdminLogout} />
            ) : (
              <AdminLogin onLogin={handleAdminLogin} />
            )}
          </Route>
          
          <Route path="/admin/dashboard">
            {isAdminLoggedIn ? (
              <AdminDashboard onLogout={handleAdminLogout} />
            ) : (
              <AdminLogin onLogin={handleAdminLogin} />
            )}
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
        onCheckout={handleCheckout}
      />

      {showOrderForm && (
        <OrderForm
          total={total}
          onSubmit={handleOrderSubmit}
          onCancel={() => setShowOrderForm(false)}
        />
      )}
    </>
  );
}

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
