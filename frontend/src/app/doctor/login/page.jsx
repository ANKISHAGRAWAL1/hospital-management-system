"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Stethoscope,
  ArrowRight,
  ShieldCheck,
  UserPlus,
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
    <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl">

        {/* ================= MAIN CARD ================= */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden grid md:grid-cols-2">

          {/* ================= LEFT BRANDING ================= */}
          <div className="hidden md:flex bg-blue-600 text-white p-10 flex-col justify-between min-h-[600px]">

            <div>
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-blue-600">
                  <Stethoscope size={24} />
                </div>

                <div>
                  <h1 className="text-lg font-bold">
                    Hospital Management
                  </h1>

                  <p className="text-xs text-blue-100">
                    Doctor Portal
                  </p>
                </div>
              </div>

              {/* Heading */}
              <div className="mt-20">
                <p className="text-sm font-medium text-blue-100 mb-3">
                  Welcome back, Doctor
                </p>

                <h2 className="text-4xl font-bold leading-tight">
                  Your patients
                  <br />
                  are waiting.
                </h2>

                <p className="mt-5 text-sm leading-6 text-blue-100 max-w-sm">
                  Access appointments, patient records,
                  consultations and your daily schedule
                  from one secure portal.
                </p>
              </div>
            </div>

            {/* Bottom Info */}
            <div className="space-y-3">

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Secure Access
                  </p>

                  <p className="text-xs text-blue-100">
                    Your information stays protected
                  </p>
                </div>
              </div>

              <p className="text-xs text-blue-100 pt-4">
                Coffee can wait. Probably. ☕
              </p>
            </div>
          </div>

          {/* ================= RIGHT LOGIN ================= */}
          <div className="p-6 sm:p-10 flex flex-col justify-center">

            {/* Mobile Logo */}
            <div className="md:hidden flex flex-col items-center mb-8">

              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-4 shadow-md">
                <Stethoscope size={28} />
              </div>

              <h1 className="text-xl font-bold text-gray-900">
                Hospital Management
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Doctor Portal
              </p>
            </div>

            {/* Heading */}
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Lock size={16} />
                </div>

                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                  Secure Login
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900">
                Welcome Back
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Login to your doctor account
              </p>
            </div>

            {/* ================= FORM ================= */}
            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* Email / Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email / Username
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email or username"
                    required
                    className="
                      w-full
                      bg-gray-50
                      border
                      border-gray-200
                      rounded-xl
                      pl-11
                      pr-4
                      py-3
                      text-sm
                      text-gray-800
                      placeholder:text-gray-400
                      outline-none
                      focus:bg-white
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-500/10
                      transition
                    "
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">

                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      alert("Forgot password feature coming soon")
                    }
                    className="
                      text-xs
                      font-medium
                      text-blue-600
                      hover:text-blue-700
                    "
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="relative">

                  <Lock
                    size={18}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="
                      w-full
                      bg-gray-50
                      border
                      border-gray-200
                      rounded-xl
                      pl-11
                      pr-12
                      py-3
                      text-sm
                      text-gray-800
                      placeholder:text-gray-400
                      outline-none
                      focus:bg-white
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-500/10
                      transition
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                      hover:text-blue-600
                      transition
                    "
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
                  className="
                    w-4
                    h-4
                    accent-blue-600
                    rounded
                  "
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
                className="
                  w-full
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  rounded-xl
                  py-3.5
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-sm
                  font-semibold
                  shadow-sm
                  hover:shadow-md
                  transition-all
                "
              >
                Login

                <ArrowRight size={17} />
              </button>
            </form>

            {/* ================= REGISTER ================= */}
            <div className="mt-6 text-center">

              <p className="text-sm text-gray-500">
                First time accessing the portal?
              </p>

              <Link
                href="/doctor/register"
                className="
                  mt-2
                  inline-flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-blue-600
                  hover:text-blue-700
                  transition
                "
              >
                <UserPlus size={16} />

                Activate your account
              </Link>
            </div>

            {/* Security Notice */}
            <div className="mt-7 pt-5 border-t border-gray-100">

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck size={14} />

                <span>
                  Secure access for authorized doctors
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 Hospital Management System
        </p>

      </div>
    </main>
  );
}