"use client";
import { useState } from "react";
import API from "../../lib/adminAxios";

export default function AdminProducts() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    image_url: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await API.post("/products/", {
        name: form.name,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        image_url: form.image_url || null,
      });
      setMessage(`Product "${res.data.name}" added successfully!`);
      setForm({ name: "", price: "", stock: "", image_url: "" });
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Products</h1>
      
      <div className="bg-white rounded-xl shadow p-6 max-w-xl">
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                name="price"
                type="number"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image URL (optional)</label>
            <input
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="https://..."
            />
          </div>
          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}