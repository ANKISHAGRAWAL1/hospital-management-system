"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Stethoscope,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Temporary demo login
    // Backend authentication baad me connect karenge
    router.push("/doctor/dashboard");
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center mb-4">
            <Stethoscope size={28} />
          </div>

          <h1 className="text-2xl font-semibold">
            Hospital Management
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Staff Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0b0b0b] border border-gray-800 rounded-2xl p-6 md:p-8">

          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Welcome Back
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Login to your account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Email / Employee ID
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                />

                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email or employee ID"
                  required
                  className="w-full bg-black border border-gray-800 rounded-lg pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-gray-500 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm text-gray-400">
                  Password
                </label>

                <button
                  type="button"
                  onClick={() =>
                    alert("Forgot password feature coming soon")
                  }
                  className="text-xs text-gray-500 hover:text-white transition"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-black border border-gray-800 rounded-lg pl-11 pr-12 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-gray-500 transition"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 accent-white"
              />

              <label
                htmlFor="remember"
                className="text-sm text-gray-500"
              >
                Remember me
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-white text-black rounded-lg py-3 flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-200 transition"
            >
              Login
              <ArrowRight size={17} />
            </button>
          </form>

          {/* Demo Notice */}
          <div className="mt-6 pt-5 border-t border-gray-800">
            <p className="text-xs text-gray-600 text-center">
              Secure access for authorized hospital staff
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-6">
          © 2026 Hospital Management System
        </p>
      </div>
    </main>
  );
}