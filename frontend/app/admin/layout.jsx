"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { adminLogout, isAdminAuthenticated } from "../lib/adminAuth";
import {
  LayoutDashboard,
  Package,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [checking, setChecking] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // 🔒 Auth guard – redirect to /admin/login if not authenticated
  useEffect(() => {
     if (pathname === "/admin/login") {
      setChecking(false);
      return;
    }
    if (!isAdminAuthenticated()) {
      router.replace("/admin/login");
    } else {
      setChecking(false);
    }
  }, [router]);

  // Show nothing or a spinner while checking auth
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }
   if (pathname === "/admin/login") {
    return <>{children}</>;
  }
  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-16" : "w-64"
        } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {!collapsed && (
            <span className="font-bold text-lg">Admin Panel</span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded hover:bg-gray-700"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                  active
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="p-2 border-t border-gray-700">
          <button
            onClick={adminLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg"
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}