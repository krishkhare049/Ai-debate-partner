"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function SignupForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);

  const handleSignup = async () => {
    if (!agree) {
      toast.error("Please accept terms & conditions");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/signup", {
        name,
        email,
        password,
      });

      setAuth(res.data.user, res.data.token);

      toast.success("Account created 🚀");

      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // simple strength indicator
  const strength =
    password.length > 8
      ? "Strong"
      : password.length > 5
      ? "Medium"
      : password.length > 0
      ? "Weak"
      : "";

  return (
    <div className="min-h-screen flex">
      
      {/* Left Branding */}
      <div className="hidden lg:flex flex-1 relative bg-black text-white items-center justify-center p-12 overflow-hidden">
        
        <div className="absolute w-72 h-72 bg-purple-600 rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse" />
        <div className="absolute w-72 h-72 bg-blue-600 rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse" />

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold mb-6">
            Join Debator 🧠🔥
          </h1>

          <p className="text-gray-300 leading-relaxed mb-6">
            Start training your thinking, speaking, and argument skills with
            your personal AI debate partner.
          </p>

          <div className="space-y-3 text-gray-400 text-sm">
            <p>✔ Real-time AI debates</p>
            <p>✔ Critical thinking growth</p>
            <p>✔ Communication mastery</p>
            <p>✔ Confidence building</p>
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
            Create Account
          </h2>

          {/* Name */}
          <div className="relative mb-4">
            <input
              className="peer w-full border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none p-3 rounded-lg placeholder-transparent"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label className="absolute left-3 -top-2 text-xs bg-white px-1 text-gray-500 peer-focus:text-black">
              Full Name
            </label>
          </div>

          {/* Email */}
          <div className="relative mb-4">
            <input
              type="email"
              className="peer w-full border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none p-3 rounded-lg placeholder-transparent"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="absolute left-3 -top-2 text-xs bg-white px-1 text-gray-500 peer-focus:text-black">
              Email Address
            </label>
          </div>

          {/* Password */}
          <div className="relative mb-1">
            <input
              type={showPass ? "text" : "password"}
              className="peer w-full border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none p-3 rounded-lg pr-10 placeholder-transparent"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label className="absolute left-3 -top-2 text-xs bg-white px-1 text-gray-500 peer-focus:text-black">
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

          {/* Strength */}
          {strength && (
            <p
              className={`text-xs mb-3 ${
                strength === "Strong"
                  ? "text-green-600"
                  : strength === "Medium"
                  ? "text-yellow-600"
                  : "text-red-500"
              }`}
            >
              Password strength: {strength}
            </p>
          )}

          {/* Terms */}
          <label className="flex items-center gap-2 text-sm mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
            />
            I agree to Terms & Privacy Policy
          </label>

          {/* Button */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full mt-2 bg-black text-white p-3 rounded-lg font-medium hover:scale-[1.02] transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          {/* Login */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-black font-semibold hover:underline"
            >
              Login
            </button>
          </p>

          <p className="text-center text-xs text-gray-400 mt-4">
            Secure signup • Your data is protected
          </p>
        </div>
      </div>
    </div>
  );
}