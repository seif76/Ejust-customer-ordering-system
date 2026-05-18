"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8000/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50/50 font-sans">
        {/* Render persistent sidebar here so layout doesn't jump while loading */}
        <aside className="w-64 bg-neutral-900 text-white flex flex-col justify-between p-6 shadow-xl sticky top-0 h-screen">
          <div>
            <div className="mb-10 border-b border-neutral-800 pb-5">
              <h2 className="font-serif text-xl font-bold tracking-tight text-white">E-JUST Store</h2>
              <p className="text-xs text-neutral-400 mt-1">University Digital Portal</p>
            </div>
            <nav className="space-y-2">
              <Link href="/" className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:bg-neutral-800 hover:text-white font-medium rounded-xl text-sm transition-all">
                <span>🏠</span> Home Dashboard
              </Link>
              <Link href="/products" className="flex items-center gap-3 px-4 py-3 bg-neutral-800 text-white font-semibold rounded-xl text-sm transition-all">
                <span>🛍️</span> Browse Products
              </Link>
            </nav>
          </div>
          <div className="border-t border-neutral-800 pt-4">
            <Link href="/admin/login" className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-[#E62334] transition-colors py-2 border border-neutral-800 rounded-lg hover:border-[#E62334]">
              🔒 Staff Login
            </Link>
          </div>
        </aside>
        <main className="flex-1 text-center p-20 text-gray-400">Loading item details...</main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen bg-gray-50/50 font-sans">
        <aside className="w-64 bg-neutral-900 text-white flex flex-col justify-between p-6 shadow-xl sticky top-0 h-screen">
          <div>
            <div className="mb-10 border-b border-neutral-800 pb-5">
              <h2 className="font-serif text-xl font-bold tracking-tight text-white">E-JUST Store</h2>
              <p className="text-xs text-neutral-400 mt-1">University Digital Portal</p>
            </div>
            <nav className="space-y-2">
              <Link href="/" className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:bg-neutral-800 hover:text-white font-medium rounded-xl text-sm transition-all">
                <span>🏠</span> Home Dashboard
              </Link>
              <Link href="/products" className="flex items-center gap-3 px-4 py-3 bg-neutral-800 text-white font-semibold rounded-xl text-sm transition-all">
                <span>🛍️</span> Browse Products
              </Link>
            </nav>
          </div>
          <div className="border-t border-neutral-800 pt-4">
            <Link href="/admin/login" className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-[#E62334] transition-colors py-2 border border-neutral-800 rounded-lg hover:border-[#E62334]">
              🔒 Staff Login
            </Link>
          </div>
        </aside>
        <main className="flex-1 text-center p-20 text-red-500 font-bold">This product does not exist.</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50/50 font-sans">
      
      {/* 🧭 SIDEBAR NAVIGATION PANEL (Exactly from your homepage markup) */}
      <aside className="w-64 bg-neutral-900 text-white flex flex-col justify-between p-6 shadow-xl sticky top-0 h-screen shrink-0">
        <div>
          {/* Top Brand Flag */}
          <div className="mb-10 border-b border-neutral-800 pb-5">
            <h2 className="font-serif text-xl font-bold tracking-tight text-white">E-JUST Store</h2>
            <p className="text-xs text-neutral-400 mt-1">University Digital Portal</p>
          </div>

          {/* Navigation Route Map links */}
          <nav className="space-y-2">
            <Link 
              href="/" 
              className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:bg-neutral-800 hover:text-white font-medium rounded-xl text-sm transition-all"
            >
              <span>🏠</span> Home Dashboard
            </Link>
            
            <Link 
              href="/products" 
              className="flex items-center gap-3 px-4 py-3 bg-neutral-800 text-white font-semibold rounded-xl text-sm transition-all"
            >
              <span>🛍️</span> Browse Products
            </Link>
          </nav>
        </div>

        {/* Admin Backdoor Short-Link Portal Footer */}
        <div className="border-t border-neutral-800 pt-4">
          <Link 
            href="/admin/login" 
            className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-[#E62334] transition-colors py-2 border border-neutral-800 rounded-lg hover:border-[#E62334]"
          >
            🔒 Staff Login
          </Link>
        </div>
      </aside>

      {/* 🏙️ MAIN HUB PRODUCT DETAILS DISPLAY VIEWPORT */}
      <main className="flex-1 p-10 max-w-5xl mx-auto">
        <button onClick={() => router.back()} className="text-sm font-bold text-gray-500 hover:text-black transition mb-6 flex items-center gap-2">
          &larr; Back to Catalog
        </button>
        
        <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Product Image Frame */}
            <div className="bg-gray-100 aspect-square rounded-xl overflow-hidden border flex items-center justify-center">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-gray-400 uppercase font-mono">No Product Image</span>
              )}
            </div>
            
            {/* Metadata Fields Profile */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="font-serif text-3xl font-bold text-black mb-2 tracking-tight">{product.name}</h1>
                <div className="inline-block px-2.5 py-1 rounded bg-gray-100 border text-xs font-bold text-gray-600 mb-6">
                  SKU Ref: #{product.id}
                </div>
                <div className="text-2xl font-serif font-bold text-black mb-4">
                  {product.price.toFixed(2)} EGP
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Premium E-JUST campus utility product profile. Sourced and handled in compliance with official store distribution standards.
                </p>
              </div>

              {/* Action Operations & Availability */}
              <div className="pt-6 border-t mt-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-gray-500">Availability Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {product.stock > 0 ? `${product.stock} Units Available` : 'Out of Stock'}
                  </span>
                </div>
                
                <button 
                  disabled={product.stock === 0}
                  className="w-full bg-[#E62334] hover:bg-[#A31F2A] disabled:bg-gray-200 disabled:text-gray-400 text-white py-3.5 rounded-xl font-bold text-base transition shadow-sm"
                >
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>

    </div>
  );
}