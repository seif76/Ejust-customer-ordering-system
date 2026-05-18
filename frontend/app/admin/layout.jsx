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
  Tags,
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
  }, [router, pathname]);

  // Show nothing or a branded spinner while checking auth
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-10 w-10 border-4 border-[#E62334] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/categories", label: "Categories", icon: Tags },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Branded Sidebar */}
      <aside
        className={`${
          collapsed ? "w-16" : "w-64"
        } bg-[#111111] text-white transition-all duration-300 flex flex-col border-r border-neutral-800 shadow-xl`}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between border-b border-neutral-800 min-h-[73px]">
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg tracking-wide text-white">
                E-JUST
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase -mt-1">
                Admin Portal
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-[#E62334] text-white shadow-lg shadow-[#E62334]/20"
                    : "text-gray-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${active ? "text-white" : "text-gray-400"}`} />
                {!collapsed && <span className="tracking-wide">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / Logout */}
        <div className="p-3 border-t border-neutral-800">
          <button
            onClick={adminLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-[#E62334] hover:bg-red-950/20 rounded-lg transition-all duration-200"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="tracking-wide">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Dynamic Frame */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}