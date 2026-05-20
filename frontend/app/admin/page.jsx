"use client";
import { useState, useEffect } from "react";
import API from "../lib/adminAxios";
import {
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  Clock,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_orders: 0,
    pending_orders: 0,
    total_products: 0,
    total_users: 0,
    total_revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/admin/dashboard/stats")
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => console.error("Dashboard fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: "Total Orders",
      value: stats.total_orders,
      icon: ShoppingCart,
      color: "bg-blue-500",
      textColor: "text-blue-700",
      bgLight: "bg-blue-50",
    },
    {
      label: "Pending Orders",
      value: stats.pending_orders,
      icon: Clock,
      color: "bg-amber-500",
      textColor: "text-amber-700",
      bgLight: "bg-amber-50",
    },
    {
      label: "Total Products",
      value: stats.total_products,
      icon: Package,
      color: "bg-purple-500",
      textColor: "text-purple-700",
      bgLight: "bg-purple-50",
    },
    {
      label: "Total Users",
      value: stats.total_users,
      icon: Users,
      color: "bg-green-500",
      textColor: "text-green-700",
      bgLight: "bg-green-50",
    },
    {
      label: "Total Revenue",
      value: `${stats.total_revenue.toFixed(2)} EGP`,
      icon: DollarSign,
      color: "bg-[#E62334]",
      textColor: "text-[#E62334]",
      bgLight: "bg-red-50",
      fullWidth: true,
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="font-serif text-3xl font-bold text-black">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Overview of store performance and metrics.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-[#E62334] border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className={`bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow ${
                  card.fullWidth ? "sm:col-span-2 lg:col-span-4" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`${card.color} p-3 rounded-xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      {card.label}
                    </p>
                    <p
                      className={`text-2xl font-bold mt-1 ${card.textColor}`}
                    >
                      {card.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}