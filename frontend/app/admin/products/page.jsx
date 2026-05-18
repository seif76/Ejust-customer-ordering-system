"use client";
import { useState, useEffect } from "react";
import API from "../../lib/adminAxios";

export default function AdminProducts() {
  const [products, setProducts] = useState([]); // Stores backend products
  const [categories, setCategories] = useState([]); // Stores backend categories
  
  // Create Form State
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    image_url: "",
    category_id: "",
  });

  // Modal / Edit Form State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState({
    id: null,
    name: "",
    price: "",
    stock: "",
    image_url: "",
    category_id: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loadingData, setLoadingData] = useState(true);

  // 📡 Sync everything from the backend on load
  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        API.get("/categories/"),
        API.get("/products/")
      ]);
      setCategories(categoriesRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      console.error("Failed to sync structural datasets:", err);
      setError("Failed to communicate with database tables during initialization.");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Form handler for Creation Form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Form handler for Modal Editing Form
  const handleEditChange = (e) => {
    setEditingProduct({ ...editingProduct, [e.target.name]: e.target.value });
  };

  // ➕ Create Product Submit
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
        category_id: form.category_id ? parseInt(form.category_id) : null,
      });
      setMessage(`Product "${res.data.name}" added successfully!`);
      setForm({ name: "", price: "", stock: "", image_url: "", category_id: "" });
      fetchData(); // Refresh list records
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong while posting.");
    }
  };

  // ✏️ Open Modal and Populate Target Data
  const openEditModal = (product) => {
    setEditingProduct({
      id: product.id,
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      image_url: product.image_url || "",
      category_id: product.category_id ? product.category_id.toString() : "",
    });
    setIsEditModalOpen(true);
  };

  // 💾 Save / Push Updated Product Data
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await API.put(`/products/${editingProduct.id}`, {
        name: editingProduct.name,
        price: parseFloat(editingProduct.price),
        stock: parseInt(editingProduct.stock),
        image_url: editingProduct.image_url || null,
        category_id: editingProduct.category_id ? parseInt(editingProduct.category_id) : null,
      });
      setMessage(`Changes saved successfully!`);
      setIsEditModalOpen(false);
      fetchData(); // Sync updated listing data
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong updating product data.");
    }
  };

  // ❌ Delete Product
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    setMessage("");
    setError("");
    try {
      await API.delete(`/products/${id}`);
      setMessage(`Product "${name}" deleted successfully.`);
      fetchData(); // Sync remaining listings
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to drop entry row from database.");
    }
  };

  // Helper function to map a category ID to its string label for the table view
  const getCategoryName = (catId) => {
    const found = categories.find((cat) => cat.id === catId);
    return found ? found.name : <span className="text-gray-400 font-normal">—</span>;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans relative">
      {/* Page Header */}
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="font-serif text-3xl font-bold text-black">Products Management</h1>
        <p className="text-gray-500 text-sm mt-1">Catalog, inspect, and adjust campus stock items.</p>
      </div>

      {/* Global Alerts */}
      {message && (
        <div className="mb-6 p-4 bg-green-50 border border-green-500 text-green-700 rounded-lg text-sm font-medium shadow-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-[#E62334] text-[#E62334] rounded-lg text-sm font-medium shadow-sm">
          {error}
        </div>
      )}

      {/* Grid Layout: Left is Submission, Right is Live Table */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        {/* PANEL A: ENTRY FORMS */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-5 sticky top-6">
            <h2 className="font-serif text-xl font-bold text-black mb-4">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E62334] transition"
                  placeholder="e.g., Engineering Drafting T-Square"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-100 bg-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E62334] transition"
                >
                  <option value="">-- Select Category (Optional) --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Price (EGP)</label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E62334] transition"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Stock</label>
                  <input
                    name="stock"
                    type="number"
                    value={form.stock}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E62334] transition"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Image URL</label>
                <input
                  name="image_url"
                  value={form.image_url}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E62334] transition"
                  placeholder="https://..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#E62334] hover:bg-[#A31F2A] text-white py-2.5 rounded-lg font-bold text-sm transition shadow-sm"
              >
                Create Product Profile
              </button>
            </form>
          </div>
        </div>

        {/* PANEL B: RECORDS VIEW LAYOUT */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-200">
                  <th className="p-4 text-xs font-bold text-black uppercase tracking-wider w-16">ID</th>
                  <th className="p-4 text-xs font-bold text-black uppercase tracking-wider">Item Name</th>
                  <th className="p-4 text-xs font-bold text-black uppercase tracking-wider">Category</th>
                  <th className="p-4 text-xs font-bold text-black uppercase tracking-wider">Price</th>
                  <th className="p-4 text-xs font-bold text-black uppercase tracking-wider">Stock</th>
                  <th className="p-4 text-xs font-bold text-black uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {loadingData ? (
                  <tr>
                    <td colSpan="6" className="p-10 text-center text-gray-400 font-medium">Loading synced records from data core...</td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-10 text-center text-gray-400 font-medium">No system products match the active target index.</td>
                  </tr>
                ) : (
                  products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="p-4 text-gray-400 font-mono text-xs">#{prod.id}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {prod.image_url ? (
                            <img src={prod.image_url} alt="" className="w-8 h-8 rounded object-cover bg-gray-100 border" />
                          ) : (
                            <div className="w-8 h-8 rounded bg-gray-100 border border-dashed flex items-center justify-center text-[10px] text-gray-400 font-bold">N/A</div>
                          )}
                          <span className="font-semibold text-black">{prod.name}</span>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-gray-700">{getCategoryName(prod.category_id)}</td>
                      <td className="p-4 font-semibold text-black">{prod.price.toFixed(2)} EGP</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${prod.stock > 10 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                          {prod.stock} left
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-4">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="text-black hover:text-[#E62334] font-semibold text-xs uppercase tracking-wider transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id, prod.name)}
                          className="text-[#E62334] hover:text-[#A31F2A] font-semibold text-xs uppercase tracking-wider transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* 🔳 POPUP EDIT MODAL (Wired to E-JUST Accent specs) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden transform scale-100 transition-all">
            <div className="bg-neutral-900 p-4 text-white flex justify-between items-center">
              <h3 className="font-serif font-bold text-lg">Modify Product Profile</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors font-sans text-xl"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleUpdateSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Name</label>
                <input
                  name="name"
                  value={editingProduct.name}
                  onChange={handleEditChange}
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E62334] transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                <select
                  name="category_id"
                  value={editingProduct.category_id}
                  onChange={handleEditChange}
                  className="w-full border-2 border-gray-200 bg-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E62334] transition"
                >
                  <option value="">-- Select Category (Optional) --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Price (EGP)</label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={handleEditChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E62334] transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Stock</label>
                  <input
                    name="stock"
                    type="number"
                    value={editingProduct.stock}
                    onChange={handleEditChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E62334] transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Image URL</label>
                <input
                  name="image_url"
                  value={editingProduct.image_url}
                  onChange={handleEditChange}
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E62334] transition"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#E62334] hover:bg-[#A31F2A] text-white py-2 rounded-lg font-bold text-sm transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}