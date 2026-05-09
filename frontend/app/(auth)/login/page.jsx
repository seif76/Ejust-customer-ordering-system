// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import API from "../lib/axios";
// import { setToken, setUser } from "../lib/auth";
// import { Eye, EyeOff, User, Mail, Lock, ArrowRight } from "lucide-react";

// export default function LoginPage() {
//   const router = useRouter();
  
//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });
  
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [apiError, setApiError] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!form.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
//       newErrors.email = "Please enter a valid email";
//     }
    
//     if (!form.password) {
//       newErrors.password = "Password is required";
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setApiError("");
    
//     if (!validateForm()) return;
    
//     setLoading(true);
//     try {
//       const response = await API.post("/auth/login", {
//         email: form.email,
//         password: form.password,
//       });
      
//       const { access_token, user } = response.data;
      
//       // Store token and user data
//       setToken(access_token);
//       if (user) {
//         setUser(user);
//       }
      
//       // Redirect to home page
//       router.push("/");
//     } catch (error) {
//       if (error.response?.data?.detail) {
//         setApiError(error.response.data.detail);
//       } else if (error.response?.status === 401) {
//         setApiError("Invalid email or password");
//       } else if (error.response?.status === 0) {
//         setApiError("Cannot connect to server. Please try again.");
//       } else {
//         setApiError("Something went wrong. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//     // Clear field error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: "" }));
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-300 opacity-20 blur-3xl animate-pulse"></div>
//         <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-300 opacity-20 blur-3xl animate-pulse delay-1000"></div>
//       </div>

//       <div className="w-full max-w-md relative">
//         {/* Card */}
//         <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
//           {/* Logo/Brand */}
//           <div className="text-center mb-8">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-4">
//               <Lock className="w-8 h-8 text-white" />
//             </div>
//             <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
//               Welcome Back
//             </h1>
//             <p className="text-gray-500 mt-2">Sign in to your account</p>
//           </div>

//           {/* Success Message (from signup redirect) */}
//           {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('signup') === 'success' && (
//             <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
//               <div className="flex items-center gap-2">
//                 <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
//                   <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-green-800">Account created successfully!</p>
//                   <p className="text-xs text-green-600">Please sign in with your credentials.</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* API Error Alert */}
//           {apiError && (
//             <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
//               <div className="flex items-center gap-2">
//                 <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
//                   <span className="text-red-500 text-lg">!</span>
//                 </div>
//                 <p className="text-sm text-red-600 font-medium">{apiError}</p>
//               </div>
//             </div>
//           )}

//           {/* Login Form */}
//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Email Input */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <div className="relative group">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
//                 </div>
//                 <input
//                   type="email"
//                   name="email"
//                   value={form.email}
//                   onChange={handleChange}
//                   placeholder="john@example.com"
//                   className={`block w-full pl-10 pr-4 py-3 border-2 rounded-xl text-sm transition-all duration-200
//                     focus:outline-none focus:ring-2 focus:ring-purple-500/20
//                     ${errors.email 
//                       ? "border-red-300 focus:border-red-500" 
//                       : "border-gray-200 focus:border-purple-500"
//                     }`}
//                 />
//               </div>
//               {errors.email && (
//                 <p className="mt-1 text-xs text-red-500">{errors.email}</p>
//               )}
//             </div>

//             {/* Password Input */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative group">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
//                 </div>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={form.password}
//                   onChange={handleChange}
//                   placeholder="••••••••"
//                   className={`block w-full pl-10 pr-12 py-3 border-2 rounded-xl text-sm transition-all duration-200
//                     focus:outline-none focus:ring-2 focus:ring-purple-500/20
//                     ${errors.password 
//                       ? "border-red-300 focus:border-red-500" 
//                       : "border-gray-200 focus:border-purple-500"
//                     }`}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                   ) : (
//                     <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="mt-1 text-xs text-red-500">{errors.password}</p>
//               )}
//             </div>

//             {/* Remember Me & Forgot Password */}
//             <div className="flex items-center justify-between">
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={rememberMe}
//                   onChange={(e) => setRememberMe(e.target.checked)}
//                   className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
//                 />
//                 <span className="text-sm text-gray-600">Remember me</span>
//               </label>
//               <Link 
//                 href="/forgot-password" 
//                 className="text-sm font-medium text-purple-600 hover:text-purple-500 transition-colors"
//               >
//                 Forgot password?
//               </Link>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl
//                 font-medium text-sm hover:from-purple-700 hover:to-blue-700 
//                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
//                 transform hover:scale-[1.02] transition-all duration-200
//                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
//                 flex items-center justify-center gap-2"
//             >
//               {loading ? (
//                 <>
//                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Signing in...
//                 </>
//               ) : (
//                 <>
//                   Sign In
//                   <ArrowRight className="w-4 h-4" />
//                 </>
//               )}
//             </button>
//           </form>

//           {/* Signup Link */}
//           <p className="mt-6 text-center text-sm text-gray-500">
//             Don&apos;t have an account?{" "}
//             <Link 
//               href="/signup" 
//               className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
//             >
//               Create one
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import API from "../../lib/axios";
import { setToken, setUser } from "../../lib/auth";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!form.password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // The backend route is /auth/login (without /api/v1 if you didn't add prefix in main.py)
      // Check your backend - if you added prefix="/api/v1" in main.py, the full URL would be /api/v1/auth/login
      // But since your axios baseURL already points to localhost:8000, we just need /auth/login
      const response = await API.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });
      
      console.log("Login response:", response.data);
      
      const { access_token, user } = response.data;
      
      // Store token
      setToken(access_token);
      
      // Store user if available
      if (user) {
        setUser(user);
      }
      
      // Redirect to home
      router.push("/");
      
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response);
      
      // Handle different error types
      if (error.response) {
        // Server responded with an error
        const status = error.response.status;
        const detail = error.response.data?.detail;
        
        if (status === 401) {
          setApiError("Invalid email or password. Please try again.");
        } else if (status === 422) {
          setApiError("Please check your input and try again.");
        } else if (status === 500) {
          setApiError("Server error. Please try again later.");
        } else if (detail) {
          setApiError(detail);
        } else {
          setApiError("Login failed. Please try again.");
        }
      } else if (error.request) {
        // Request was made but no response received
        setApiError("Cannot connect to server. Please check your connection.");
      } else {
        // Something else went wrong
        setApiError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear field error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    // Clear API error when user types
    if (apiError) {
      setApiError("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-300 opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-300 opacity-20 blur-3xl animate-pulse" style={{animationDelay: "1000ms"}}></div>
      </div>

      <div className="w-full max-w-md relative">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-500 mt-2">Sign in to your account</p>
          </div>

          {/* API Error Alert - Always visible when apiError exists */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-500 font-bold">!</span>
                </div>
                <p className="text-sm text-red-600 font-medium">{apiError}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={`block w-full pl-10 pr-4 py-3 border-2 rounded-xl text-sm transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-purple-500/20
                    ${errors.email 
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" 
                      : "border-gray-200 focus:border-purple-500"
                    }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`block w-full pl-10 pr-12 py-3 border-2 rounded-xl text-sm transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-purple-500/20
                    ${errors.password 
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" 
                      : "border-gray-200 focus:border-purple-500"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl
                font-medium text-sm hover:from-purple-700 hover:to-blue-700 
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                transform hover:scale-[1.02] transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Signup Link */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link 
              href="/signup" 
              className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}