"use client";
import React from "react";
import Link from "next/link";

export default function StorefrontHomePage() {
  return (
    <div className="flex min-h-screen bg-gray-50/50 font-sans">
      
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