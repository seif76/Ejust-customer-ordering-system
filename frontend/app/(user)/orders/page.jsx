"use client";
import { useEffect, useState } from "react";
import api from "../../lib/axios";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/").then(res => setOrders(res.data)).catch(console.error);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="border rounded-xl p-6 shadow">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Order #{order.id}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                  order.status === "confirmed" ? "bg-green-100 text-green-700" :
                  order.status === "cancelled" ? "bg-red-100 text-red-700" :
                  "bg-yellow-100 text-yellow-700"
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="mt-4 space-y-2">
                {order.items?.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.product_name || `Product #${item.product_id}`} x {item.quantity}</span>
                    <span>${item.total_price?.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-right font-bold">Total: ${order.total_amount?.toFixed(2)}</div>
              <div className="text-xs text-gray-400 mt-2">
                Placed on {new Date(order.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}