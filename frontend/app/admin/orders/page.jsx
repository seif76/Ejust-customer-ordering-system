"use client";
import { useState, useEffect } from "react";
import API from "../../lib/adminAxios";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/admin");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/admin/${orderId}/status?status=${newStatus}`);
      setMessage(`Order #${orderId} marked as ${newStatus}.`);
      fetchOrders(); // refresh list
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="font-serif text-3xl font-bold text-black">Orders Management</h1>
        <p className="text-gray-500 text-sm mt-1">View and update customer orders.</p>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-green-50 border border-green-500 text-green-700 rounded-lg text-sm font-medium">
          {message}
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-400 py-20">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-400 py-20">No orders found.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="p-4 text-xs font-bold uppercase">Order ID</th>
                <th className="p-4 text-xs font-bold uppercase">Customer</th>
                <th className="p-4 text-xs font-bold uppercase">Total</th>
                <th className="p-4 text-xs font-bold uppercase">Status</th>
                <th className="p-4 text-xs font-bold uppercase">Date</th>
                <th className="p-4 text-xs font-bold uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-xs text-gray-500">#{order.id}</td>
                  <td className="p-4 font-medium">{order.user_id}</td>
                  <td className="p-4 font-semibold">{order.total_amount.toFixed(2)} EGP</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {order.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleStatusChange(order.id, "confirmed")}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-bold"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleStatusChange(order.id, "cancelled")}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-xs font-bold"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {order.status === "confirmed" && (
                      <button
                        onClick={() => handleStatusChange(order.id, "cancelled")}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-xs font-bold"
                      >
                        Cancel
                      </button>
                    )}
                    {order.status === "cancelled" && (
                      <button
                        onClick={() => handleStatusChange(order.id, "pending")}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded text-xs font-bold"
                      >
                        Reopen
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}