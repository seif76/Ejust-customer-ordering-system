"use client";

import React, { useState, useEffect } from 'react';
import adminAxios from '../../lib/adminAxios'; 

export default function BrandedAdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const [message, setMessage] = useState(''); // Added to match product feedback styling
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await adminAxios.get('/categories/');
      setCategories(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage('');
    try {
      const res = await adminAxios.post('/categories/', { name, description });
      setMessage(`Category "${res.data.name || name}" created successfully!`);
      setName('');
      setDescription('');
      fetchCategories(); 
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create category.");
    }
  };

  const startEdit = (category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditDescription(category.description || '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage('');
    try {
      await adminAxios.put(`/categories/${editingId}`, {
        name: editName,
        description: editDescription
      });
      setMessage("Changes saved successfully!");
      setEditingId(null);
      fetchCategories(); 
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update category.");
    }
  };

  const handleDelete = async (id) => {
    const target = categories.find(c => c.id === id);
    if (!window.confirm(`Are you sure you want to permanently delete "${target?.name || 'this category'}"?`)) return;
    setError(null);
    setMessage('');
    try {
      await adminAxios.delete(`/categories/${id}`);
      setMessage("Category deleted successfully.");
      fetchCategories(); 
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete category.");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans relative">
      {/* Page Branded Header (Aligned Left - Matches Product Page) */}
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="font-serif text-3xl font-bold text-black">Category Management</h1>
        <p className="text-gray-500 text-sm mt-1">Add and catalog catalog structures for store inventory.</p>
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

      {/* Grid Layout: Left is Submission Form, Right is Table List */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        {/* PANEL A: ENTRY FORMS */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-5 sticky top-6">
            {editingId ? (
              // EDITING FORM HOUSING
              <form onSubmit={handleUpdate} className="space-y-4">
                <h2 className="font-serif text-xl font-bold text-black mb-4">Edit Category</h2>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border-2 border-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E62334] transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full border-2 border-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E62334] transition"
                    rows="3"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-[#E62334] hover:bg-[#A31F2A] text-white py-2 rounded-lg font-bold text-sm transition shadow-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              // STANDARD CREATION FORM HOUSING
              <form onSubmit={handleCreate} className="space-y-4">
                <h2 className="font-serif text-xl font-bold text-black mb-4">Add New Category</h2>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="e.g., University Apparel"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-2 border-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E62334] transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                  <textarea
                    placeholder="Optional details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border-2 border-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E62334] transition"
                    rows="3"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#E62334] hover:bg-[#A31F2A] text-white py-2.5 rounded-lg font-bold text-sm transition shadow-sm"
                >
                  Create Category Profile
                </button>
              </form>
            )}
          </div>
        </div>

        {/* PANEL B: RECORDS VIEW LAYOUT */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-200">
                  <th className="p-4 text-xs font-bold text-black uppercase tracking-wider w-16">ID</th>
                  <th className="p-4 text-xs font-bold text-black uppercase tracking-wider">Category Name</th>
                  <th className="p-4 text-xs font-bold text-black uppercase tracking-wider">Description</th>
                  <th className="p-4 text-xs font-bold text-black uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-gray-400 font-medium">Loading synced records from data core...</td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-gray-400 font-medium">No system categories match the active target index.</td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="p-4 text-gray-400 font-mono text-xs">#{category.id}</td>
                      <td className="p-4">
                        <span className="font-semibold text-black">{category.name}</span>
                      </td>
                      <td className="p-4 text-gray-600 max-w-xs truncate">{category.description || <span className="text-gray-400 font-normal">—</span>}</td>
                      <td className="p-4 text-right space-x-4">
                        <button
                          onClick={() => startEdit(category)}
                          className="text-black hover:text-[#E62334] font-semibold text-xs uppercase tracking-wider transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
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
    </div>
  );
}