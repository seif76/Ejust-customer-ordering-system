"use client";
import React from "react";
import Link from "next/link";

export default function StorefrontHomePage() {
  return (
    <div className="flex min-h-screen bg-gray-50/50 font-sans">
      
      {/* 🧭 SIDEBAR NAVIGATION PANEL */}
      <aside className="w-64 bg-neutral-900 text-white flex flex-col justify-between p-6 shadow-xl sticky top-0 h-screen">
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
              className="flex items-center gap-3 px-4 py-3 bg-neutral-800 text-white font-semibold rounded-xl text-sm transition-all"
            >
              <span>🏠</span> Home Dashboard
            </Link>
            
            <Link 
              href="/products" 
              className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:bg-neutral-800 hover:text-white font-medium rounded-xl text-sm transition-all"
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

      {/* 🏙️ MAIN HUB LANDING DISPLAY VIEWPORTS */}
      <main className="flex-1 p-10 flex flex-col justify-center items-start max-w-4xl mx-auto">
        <div className="space-y-6">
          <div className="inline-block bg-red-50 text-[#E62334] font-bold text-xs px-3 py-1 rounded-full uppercase tracking-widest border border-red-100">
            Welcome to Campus Commerce
          </div>
          <h1 className="font-serif text-5xl font-bold text-black tracking-tight leading-none">
            Your Premium Source for <br />
            <span className="text-[#E62334]">E-JUST Merchandise.</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-xl leading-relaxed">
            Access certified university apparel, standard supply materials, and technical research tools directly through our centralized customer network database catalog.
          </p>
          <div className="pt-4">
            <Link 
              href="/products" 
              className="inline-block bg-[#E62334] hover:bg-[#A31F2A] text-white px-8 py-3.5 rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              Explore Store Catalog &rarr;
            </Link>
          </div>
        </div>
      </main>

    </div>
  );
}