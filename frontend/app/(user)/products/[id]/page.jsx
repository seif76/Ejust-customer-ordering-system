"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../lib/axios";
import { useCart } from "../../../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, cart } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  // Check if product is already in cart (optional visual feedback)
  useEffect(() => {
    if (product) {
      const inCart = cart.some(item => item.product_id === product.id);
      setAdded(inCart);
    }
  }, [cart, product]);

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      addToCart(product);
      setAdded(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50">
        <p className="text-red-500 font-bold text-lg">This product does not exist.</p>
        <button onClick={() => router.back()} className="mt-4 text-sm font-bold text-gray-500 hover:text-black transition">
          &larr; Back to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-10 max-w-5xl mx-auto">
      <button
        onClick={() => router.back()}
        className="text-sm font-bold text-gray-500 hover:text-black transition mb-6 flex items-center gap-2"
      >
        &larr; Back to Catalog
      </button>

      <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product Image */}
          <div className="bg-gray-100 aspect-square rounded-xl overflow-hidden border flex items-center justify-center">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-gray-400 uppercase font-mono">No Product Image</span>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-black mb-2 tracking-tight">
                {product.name}
              </h1>
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

            {/* Stock & Add to Cart */}
            <div className="pt-6 border-t mt-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-500">Availability:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    product.stock > 0
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {product.stock > 0
                    ? `${product.stock} Units Available`
                    : "Out of Stock"}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full py-3.5 rounded-xl font-bold text-base transition shadow-sm ${
                  product.stock > 0
                    ? added
                      ? "bg-green-600 text-white"
                      : "bg-[#E62334] hover:bg-[#A31F2A] text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {product.stock > 0
                  ? added
                    ? "Added to Cart ✓"
                    : "Add to Cart"
                  : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}