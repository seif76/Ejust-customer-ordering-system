"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getToken, removeToken, getUser } from "../lib/auth";
import { useCart } from "../context/CartContext";   // ⬅️ import cart context
import { 
  Home, ShoppingBag, ShoppingCart, Package, 
  LogOut, Menu, X, User 
} from "lucide-react";

export default function UserLayout({ children }) {
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const user = getUser();
  const { cart } = useCart();       // ⬅️ get cart array
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);  // ⬅️ total items

  // Auth guard (unchanged)
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp * 1000 < Date.now()) {
        removeToken();
        router.replace("/login");
        return;
      }
    } catch (e) {
      removeToken();
      router.replace("/login");
      return;
    }
    setChecking(false);
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/products", label: "Products", icon: ShoppingBag },
    { 
      href: "/cart", 
      label: "Cart", 
      icon: ShoppingCart, 
      badge: cartCount  // ⬅️ add badge only for cart
    },
    { href: "/orders", label: "Orders", icon: Package },
  ];

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay (unchanged) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-50
        w-64 bg-neutral-900 text-white flex flex-col
        h-screen transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        {/* Brand (unchanged) */}
        <div className="p-6 border-b border-neutral-800">
          <h2 className="font-serif text-xl font-bold">E-JUST Store</h2>
          <p className="text-xs text-neutral-400 mt-1">Student Portal</p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  {link.label}
                </span>
                {link.badge != null && link.badge > 0 && (  // ⬅️ badge if > 0
                  <span className="bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer (unchanged) */}
        <div className="p-4 border-t border-neutral-800">
          <div className="flex items-center gap-3 mb-4 px-4">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">
                {user?.name?.charAt(0) || "U"}
              </span>
            </div>
            <span className="text-sm text-neutral-300">{user?.name || "User"}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-neutral-400 hover:text-red-400 transition-colors rounded-lg"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content (unchanged) */}
      <div className="flex-1 flex flex-col">
        <div className="md:hidden bg-white border-b p-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold">E-JUST Store</span>
          <div className="w-6" />
        </div>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}