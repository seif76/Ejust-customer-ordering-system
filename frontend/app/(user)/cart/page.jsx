"use client";
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "../../lib/axios";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const orderItems = cart.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity
      }));
      await api.post("/orders/", { items: orderItems });
      clearCart();
      router.push("/orders");
    } catch (err) {
      setError(err.response?.data?.detail || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.product_id} className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">${item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    className="px-2 py-1 border rounded">-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="px-2 py-1 border rounded disabled:opacity-50">+</button>
                  <button onClick={() => removeFromCart(item.product_id)}
                    className="ml-4 text-red-500">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-right">
            <p className="text-xl font-bold">Total: ${cartTotal.toFixed(2)}</p>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <button onClick={handleCheckout} disabled={loading}
              className="mt-4 bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50">
              {loading ? "Processing..." : "Place Order (Mock Payment)"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}