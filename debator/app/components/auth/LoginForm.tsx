"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      setAuth(res.data.user, res.data.token);

      toast.success("Welcome back 🚀");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      
      {/* Left Branding */}
      <div className="hidden lg:flex flex-1 relative bg-black text-white items-center justify-center p-12 overflow-hidden">
        
        {/* Gradient blobs */}
        <div className="absolute w-72 h-72 bg-purple-600 rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse" />
        <div className="absolute w-72 h-72 bg-blue-600 rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse" />

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold mb-6">
            Debator 🧠🔥
          </h1>

          <p className="text-gray-300 leading-relaxed mb-6">
            Train your thinking, sharpen your arguments, and build confidence
            with your personal AI debate partner.
          </p>

          <div className="space-y-3 text-gray-400 text-sm">
            <p>✔ Real-time AI debates</p>
            <p>✔ Improve critical thinking</p>
            <p>✔ Practice speaking & interviews</p>
            <p>✔ Personalized feedback</p>
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-6">
        
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-200">
          
          {/* Mobile Branding */}
          <div className="text-center mb-6 lg:hidden">
            <h1 className="text-2xl font-bold">Debator 🧠🔥</h1>
            <p className="text-gray-500 text-sm">AI Debate Partner</p>
          </div>

          <h2 className="text-2xl font-semibold text-center mb-6">
            Welcome Back
          </h2>

          {/* Email */}
          <div className="relative mb-4">
            <input
              type="email"
              className="peer w-full border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none p-3 rounded-lg placeholder-transparent"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="absolute left-3 -top-2 text-xs bg-white px-1 text-gray-500 peer-focus:text-black transition">
              Email Address
            </label>
          </div>

          {/* Password */}
          <div className="relative mb-2">
            <input
              type={showPass ? "text" : "password"}
              className="peer w-full border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none p-3 rounded-lg pr-10 placeholder-transparent"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label className="absolute left-3 -top-2 text-xs bg-white px-1 text-gray-500 peer-focus:text-black transition">
              Password
            </label>

            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Options */}
          <div className="flex justify-between items-center mt-3 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" />
              Remember me
            </label>

            <button
              onClick={() => router.push("/forgot")}
              className="text-gray-600 hover:text-black"
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full mt-6 bg-black text-white p-3 rounded-lg font-medium hover:scale-[1.02] transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

          {/* Signup */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don’t have an account?{" "}
            <button
              onClick={() => router.push("/signup")}
              className="text-black font-semibold hover:underline"
            >
              Create account
            </button>
          </p>

          {/* Trust text */}
          <p className="text-center text-xs text-gray-400 mt-4">
            Secure login • Privacy protected
          </p>
        </div>
      </div>
    </div>
  );
}