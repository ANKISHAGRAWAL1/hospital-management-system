"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Stethoscope,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  HeartPulse,
} from "lucide-react";

import { adminLogin } from "@/app/components/utils/Api-call";

export default function AdminLoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // ==========================================
  // HANDLE LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    // Frontend validation
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      console.log("Admin Login Data:", {
        email,
        passwordReceived: Boolean(password),
      });

      const response = await adminLogin({
        email,
        password,
      });

      console.log("Admin Login Response:", response);

      if (!response?.success) {
        setError(
          response?.message || "Invalid email or password."
        );
        return;
      }

      // ==========================================
      // SAVE TOKEN
      // ==========================================

      if (response.token) {
        localStorage.setItem(
          "adminToken",
          response.token
        );
      }

      // Save admin information
      if (response.admin) {
        localStorage.setItem(
          "admin",
          JSON.stringify(response.admin)
        );
      }

      // ==========================================
      // REDIRECT
      // ==========================================

      router.push("/admin/dashboard");

    } catch (error) {
      console.error("Admin Login Error:", error);

      setError(
        error?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f8f7] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden border border-[#e5ebe8]">

        {/* ==========================================
            LEFT SIDE
        ========================================== */}

        <div className="hidden lg:flex relative bg-[#0f3d35] p-12 text-white flex-col justify-between overflow-hidden">

          {/* Decorative circles */}

          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#145247]" />

          <div className="absolute -bottom-32 -left-24 w-80 h-80 rounded-full bg-[#145247]" />

          <div className="relative z-10">

            {/* Logo */}

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Stethoscope size={27} />
              </div>

              <div>
                <h1 className="text-xl font-bold">
                  MediCare
                </h1>

                <p className="text-xs text-[#b7d1ca]">
                  Hospital Management System
                </p>
              </div>

            </div>

            {/* Main Content */}

            <div className="mt-24 max-w-md">

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-sm text-[#d7ebe6] mb-6">
                <HeartPulse size={15} />
                Admin Portal
              </div>

              <h2 className="text-4xl font-bold leading-tight">
                Welcome back,
                <br />
                Administrator.
              </h2>

              <p className="mt-5 text-[#b7d1ca] leading-7">
                Manage doctors, patients, appointments,
                departments and your hospital operations
                from one secure dashboard.
              </p>

              {/* Funny line */}

              <div className="mt-8 p-4 rounded-2xl bg-white/10 border border-white/10">
                <p className="text-sm text-[#d7ebe6]">
                  🏥 The hospital never sleeps.
                  <br />

                  <span className="text-white font-medium">
                    Neither does the admin dashboard.
                  </span>{" "}
                  ☕
                </p>
              </div>

            </div>
          </div>

          {/* Bottom */}

          <div className="relative z-10 flex items-center gap-2 text-sm text-[#a9c6bf]">
            <ShieldCheck size={17} />
            Secure Admin Access
          </div>

        </div>

        {/* ==========================================
            RIGHT SIDE
        ========================================== */}

        <div className="p-7 sm:p-10 lg:p-14 flex items-center">

          <div className="w-full max-w-md mx-auto">

            {/* Mobile Logo */}

            <div className="lg:hidden flex items-center gap-3 mb-10">

              <div className="w-11 h-11 rounded-xl bg-[#0f3d35] text-white flex items-center justify-center">
                <Stethoscope size={23} />
              </div>

              <div>

                <h1 className="font-bold text-[#17342f]">
                  MediCare
                </h1>

                <p className="text-xs text-gray-500">
                  Admin Portal
                </p>

              </div>

            </div>

            {/* Heading */}

            <div className="mb-8">

              <p className="text-sm font-medium text-[#059669] mb-2">
                Admin Portal
              </p>

              <h2 className="text-3xl font-bold text-[#17211b]">
                Sign in to your account
              </h2>

              <p className="mt-2 text-sm text-[#66736b]">
                Enter your admin credentials to continue
                to your dashboard.
              </p>

            </div>

            {/* Error */}

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* ==========================================
                FORM
            ========================================== */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Email */}

              <div>

                <label className="block text-sm font-medium text-[#34413b] mb-2">
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9992]"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-[#dfe7e3] bg-[#fbfcfc] text-[#17211b] placeholder:text-[#9aa59f] outline-none transition focus:border-[#059669] focus:ring-4 focus:ring-[#059669]/10"
                    required
                  />

                </div>

              </div>

              {/* Password */}

              <div>

                <div className="flex items-center justify-between mb-2">

                  <label className="text-sm font-medium text-[#34413b]">
                    Password
                  </label>

                  <Link
                    href="/admin/forgot-password"
                    className="text-sm font-medium text-[#059669] hover:text-[#047857]"
                  >
                    Forgot password?
                  </Link>

                </div>

                <div className="relative">

                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9992]"
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
                    autoComplete="current-password"
                    className="w-full h-12 pl-11 pr-12 rounded-xl border border-[#dfe7e3] bg-[#fbfcfc] text-[#17211b] placeholder:text-[#9aa59f] outline-none transition focus:border-[#059669] focus:ring-4 focus:ring-[#059669]/10"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b9992] hover:text-[#34413b]"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

              </div>

              {/* Remember */}

              <div className="flex items-center gap-2">

                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 accent-[#059669]"
                />

                <label
                  htmlFor="remember"
                  className="text-sm text-[#66736b]"
                >
                  Keep me signed in
                </label>

              </div>

              {/* Login Button */}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-[#059669] hover:bg-[#047857] disabled:bg-[#94a19a] disabled:cursor-not-allowed text-white font-semibold flex items-center justify-center gap-2 transition shadow-sm hover:shadow-md"
              >

                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={18} />
                  </>
                )}

              </button>

            </form>

            {/* Security Note */}

            <div className="mt-8 flex items-start gap-3 p-4 rounded-xl bg-[#f0fdf8] border border-[#d6f4e8]">

              <ShieldCheck
                size={20}
                className="text-[#059669] mt-0.5 shrink-0"
              />

              <div>

                <p className="text-sm font-medium text-[#17483d]">
                  Secure login
                </p>

                <p className="text-xs text-[#668078] mt-1 leading-5">
                  Your admin account is protected using
                  secure authentication.
                </p>

              </div>

            </div>

            {/* Footer */}

            <p className="text-center text-xs text-[#94a19a] mt-8">
              © 2026 MediCare Hospital Management System
            </p>

          </div>

        </div>

      </div>
    </main>
  );
}