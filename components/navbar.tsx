"use client";

import Link from "next/link";
import {
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
  MoonIcon,
  SunIcon,
  MagnifyingGlassIcon,
  UserIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/cart-store";
import { useEffect, useState, useCallback } from "react";
import { Button } from "./ui/button";

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { items } = useCartStore();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Dark mode 
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (stored === "dark" || (!stored && prefersDark)) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleDark = useCallback(() => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }, [darkMode]);

  // Scroll effect with throttle
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile on resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Close mobile on escape key
  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const links = [
    { href: "/", label: "Home", icon: null },
    { href: "/products", label: "Products", icon: null },
    { href: "/checkout", label: "Checkout", icon: ShoppingCartIcon },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <nav
        className={`
          sticky top-0 z-50 
          transition-all duration-300 ease-out
          ${scrolled 
            ? "glass shadow-lg border-border/50 backdrop-blur-xl" 
            : "bg-background/80 backdrop-blur-md border-transparent"
          }
          border-b
        `}
      >
        <div className="container-custom relative">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link 
              href="/" 
              className="group relative flex items-center gap-2.5"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-xl gradient-accent blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl gradient-accent text-white text-sm font-black shadow-lg">
                  M
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:to-primary transition-all duration-300">
                MyStore
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="relative px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 group"
                >
                  {label}
                  <span className="absolute inset-x-1 -bottom-0.5 h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-1.5">

              {/* Search Bar Desktop */}
              <div className={`hidden lg:block transition-all duration-300 ${searchOpen ? "w-64" : "w-0"}`}>
                {searchOpen && (
                  <form onSubmit={handleSearch} className="animate-fade-in-right">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full px-4 py-2 pr-10 rounded-xl bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-background transition-colors"
                      >
                        <MagnifyingGlassIcon className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(!searchOpen)}
                className="hidden lg:flex rounded-xl hover:bg-secondary transition-all duration-200"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl hover:bg-secondary transition-all duration-200"
                aria-label="Account"
              >
                <UserIcon className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl hover:bg-secondary transition-all duration-200"
                aria-label="Wishlist"
              >
                <HeartIcon className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDark}
                className="rounded-xl hover:bg-secondary transition-all duration-200"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <SunIcon className="h-5 w-5 transition-transform hover:rotate-90 duration-300" />
                ) : (
                  <MoonIcon className="h-5 w-5 transition-transform hover:-rotate-90 duration-300" />
                )}
              </Button>

              <Link
                href="/checkout"
                className="relative group"
              >
                <div className="relative p-2 rounded-xl hover:bg-secondary transition-all duration-200">
                  <ShoppingCartIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full gradient-accent text-[11px] font-bold text-white shadow-lg animate-bounce-in">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </div>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-xl hover:bg-secondary transition-all duration-200"
                onClick={() => setMobileOpen((p) => !p)}
                aria-label="Menu"
              >
                {mobileOpen ? (
                  <XMarkIcon className="h-5 w-5 animate-fade-in" />
                ) : (
                  <Bars3Icon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {searchOpen && (
            <div className="lg:hidden py-3 animate-fade-in-down">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-4 py-2.5 pr-10 rounded-xl bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-background transition-colors"
                  >
                    <MagnifyingGlassIcon className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
              onClick={() => setMobileOpen(false)}
            />
            <div className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border shadow-xl z-50 animate-slide-in-down">
              <div className="container-custom py-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
                <ul className="space-y-1">
                  {links.map(({ href, label }, index) => (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium hover:bg-secondary transition-all duration-200 animate-fade-in-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                  <li className="pt-2 mt-2 border-t border-border">
                    <Link
                      href="/wishlist"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium hover:bg-secondary transition-all duration-200"
                    >
                      <HeartIcon className="h-5 w-5" />
                      Wishlist
                    </Link>
                    <Link
                      href="/account"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium hover:bg-secondary transition-all duration-200"
                    >
                      <UserIcon className="h-5 w-5" />
                      My Account
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </nav>

      <div className="h-16 lg:h-20" />
    </>
  );
};