"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../lib/adminAxios";
import { setAdminToken, setAdminUser } from "../../lib/adminAuth";
import { Lock, Mail, ArrowRight, ShieldAlert } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/admin/auth/login", { email, password });
      const { access_token, admin } = res.data;
      setAdminToken(access_token);
      setAdminUser(admin);
      router.push("/admin");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-neutral-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-neutral-700 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#E62334] to-[#A31F2A] rounded-2xl mb-4 shadow-lg">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
            <p className="text-neutral-400 mt-2">Secure staff authentication</p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 animate-fade-in">
              <div className="flex-shrink-0 w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                <span className="text-red-400 font-bold">!</span>
              </div>
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-500 group-focus-within:text-[#E62334] transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="block w-full pl-10 pr-4 py-3 bg-neutral-700 border-2 border-neutral-600 rounded-xl text-white text-sm placeholder-neutral-400
                    focus:outline-none focus:border-[#E62334] focus:ring-2 focus:ring-[#E62334]/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-500 group-focus-within:text-[#E62334] transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-3 bg-neutral-700 border-2 border-neutral-600 rounded-xl text-white text-sm placeholder-neutral-400
                    focus:outline-none focus:border-[#E62334] focus:ring-2 focus:ring-[#E62334]/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#E62334] to-[#A31F2A] text-white py-3 px-4 rounded-xl
                font-bold text-sm hover:from-[#ff2a3d] hover:to-[#c12736] 
                focus:outline-none focus:ring-2 focus:ring-[#E62334] focus:ring-offset-2 focus:ring-offset-neutral-800
                transform hover:scale-[1.02] active:scale-[0.98] transition-all
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">
            Default credentials: <span className="text-neutral-300 font-mono">admin@admin.com / admin</span>
          </p>
        </div>
      </div>
    </div>
  );
}