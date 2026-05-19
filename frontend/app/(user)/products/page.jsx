"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Filtering & State Queries
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Sync Categories
  useEffect(() => {
    axios.get("http://localhost:8000/categories/")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Failed to load categories:", err));
  }, []);

  // Sync Catalog Products
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: page,
          limit: 6,
          ...(search && { search }),
          ...(selectedCategory && { category_id: selectedCategory })
        });
        
        const res = await axios.get(`http://localhost:8000/products/?${queryParams.toString()}`);
        setProducts(res.data.products);
        setTotalPages(Math.ceil(res.data.total / res.data.limit) || 1);
      } catch (err) {
        console.error("Catalog sync failure:", err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchCatalog();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, selectedCategory, page]);

  return (
    <div className="flex min-h-screen bg-gray-50/50 font-sans">
      
     

      {/* 🏙️ MAIN HUB STORE CATALOG VIEWPORT */}
      <main className="flex-1 p-10 max-w-6xl mx-auto">
        
        {/* Top Control Header: Title & Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b pb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-black tracking-tight">Campus Store</h1>
            <p className="text-gray-500 text-sm mt-1">Browse verified high-fidelity merchandise</p>
          </div>
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Search items by keyword..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#E62334] bg-white transition shadow-sm"
            />
          </div>
        </div>

        {/* Core Inner Page Layout (Categories sidebar filter panel + Products grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Inner Content Filter Panel: Categories Column */}
          <div className="lg:col-span-1 space-y-2">
            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">Filter by Category</h3>
            <button
              onClick={() => { setSelectedCategory(""); setPage(1); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${!selectedCategory ? 'bg-[#E62334] text-white shadow-sm' : 'bg-white hover:bg-gray-100 border text-gray-700'}`}
            >
              All Merchandise
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
                className={`w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${selectedCategory === cat.id ? 'bg-[#E62334] text-white shadow-sm' : 'bg-white hover:bg-gray-100 border text-gray-700'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Product Cards Grid panel */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center p-20 text-gray-400 font-medium">Syncing live catalog...</div>
            ) : products.length === 0 ? (
              <div className="text-center bg-white border rounded-xl p-20 text-gray-400 font-medium shadow-sm">No items found matching your filters.</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {products.map((item) => (
                    <div key={item.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                      <div className="bg-gray-100 aspect-square w-full relative flex items-center justify-center border-b">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">No Image</span>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-black text-base line-clamp-1 mb-1">{item.name}</h4>
                          <span className="text-xs font-semibold text-gray-400">Stock: {item.stock} left</span>
                        </div>
                        <div className="mt-4 flex justify-between items-center pt-2 border-t border-gray-50">
                          <span className="font-serif font-bold text-black text-base">{item.price.toFixed(2)} EGP</span>
                          <Link href={`/products/${item.id}`} className="bg-neutral-900 hover:bg-black text-white text-xs font-bold px-3 py-2 rounded-lg transition">
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Suite Row */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-12 pt-6 border-t">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                      className="px-4 py-2 bg-white border rounded-xl text-sm font-semibold hover:bg-gray-50 transition disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span className="text-sm font-bold text-gray-600">Page {page} of {totalPages}</span>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(p => p + 1)}
                      className="px-4 py-2 bg-white border rounded-xl text-sm font-semibold hover:bg-gray-50 transition disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </main>

    </div>
  );
}