import { ShoppingCart, Menu as MenuIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
}

export default function Header({ cartItemCount, onCartClick }: HeaderProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartAnimation, setCartAnimation] = useState(false);
  const [prevCartCount, setPrevCartCount] = useState(cartItemCount);
  const [scrolled, setScrolled] = useState(false);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Savatga mahsulot qo'shilganda animatsiya
  useEffect(() => {
    if (cartItemCount > prevCartCount) {
      setCartAnimation(true);
      setTimeout(() => setCartAnimation(false), 1000);
    }
    setPrevCartCount(cartItemCount);
  }, [cartItemCount, prevCartCount]);

  const navLinks = [
    { href: "/", label: "Bosh sahifa" },
    { href: "/menu", label: "Menyu" },
    { href: "/about", label: "Biz haqimizda" },
    { href: "/contact", label: "Bog'lanish" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg"
          : "bg-background/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo with animation */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="text-xl sm:text-2xl font-bold text-primary transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
            🍔 Döner Food
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-6">
          {navLinks.map((link, index) => (
            <Link key={link.href} href={link.href}>
              <span
                className={`text-sm font-medium transition-all duration-300 hover-elevate px-3 py-2 rounded-md cursor-pointer relative group ${
                  location === link.href
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.label}
                {location === link.href && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full animate-in slide-in-from-left duration-300" />
                )}
              </span>
            </Link>
          ))}
        </nav>

        {/* Cart Button & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <Button
            size="icon"
            variant="ghost"
            onClick={onCartClick}
            className="relative touch-manipulation active:scale-95 transition-transform duration-200"
          >
            <ShoppingCart
              className={`h-5 w-5 transition-all duration-500 ${
                cartAnimation
                  ? "animate-bounce scale-150 text-primary drop-shadow-lg"
                  : ""
              }`}
            />
            {cartItemCount > 0 && (
              <Badge
                variant="destructive"
                className={`absolute -top-0.5 -right-0.5 h-5 min-w-[1.25rem] flex items-center justify-center px-1 text-xs font-semibold transition-all duration-500 ${
                  cartAnimation
                    ? "animate-pulse scale-150 ring-2 ring-primary ring-offset-2"
                    : ""
                }`}
              >
                {cartItemCount}
              </Badge>
            )}
          </Button>

          {/* Mobile Menu Button */}
          <Button
            size="icon"
            variant="ghost"
            className="md:hidden touch-manipulation active:scale-95 transition-transform duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 animate-in rotate-in-90 duration-300" />
            ) : (
              <MenuIcon className="h-5 w-5 animate-in fade-in duration-300" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation with smooth animation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          mobileMenuOpen
            ? "max-h-96 opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-3"
        }`}
      >
        <nav className="border-t px-4 py-4 bg-background/95 backdrop-blur-md">
          {navLinks.map((link, index) => (
            <Link key={link.href} href={link.href}>
              <span
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 hover-elevate cursor-pointer touch-manipulation active:scale-95 ${
                  location === link.href
                    ? "text-primary bg-accent animate-in slide-in-from-left"
                    : "text-foreground hover:text-primary hover:bg-accent/50"
                }`}
                onClick={() => setMobileMenuOpen(false)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
