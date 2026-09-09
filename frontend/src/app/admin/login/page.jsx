"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  HeartPulse,
  Stethoscope,
  Activity,
} from "lucide-react";

import { adminLogin } from "@/app/components/utils/Api-call/doctor-auth-api";
import { notify } from "@/app/components/healper";

export default function AdminLoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove field error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // VALIDATION
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await adminLogin({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (response?.success) {
        // Store admin JWT
        localStorage.setItem("adminToken", response.token);

        // Optional: store admin information
        if (response.user) {
          localStorage.setItem(
            "adminUser",
            JSON.stringify(response.user)
          );
        }

        notify(
          response.message || "Login successful",
          "success"
        );

        router.replace("/admin/");
      } else {
        notify(
          response?.message || "Invalid email or password",
          "error"
        );
      }
    } catch (error) {
      console.error("Admin login error:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to login. Please try again.";

      notify(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f7f8] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-[#e5ebe7]">

        {/* ================= LEFT SECTION ================= */}
        <section className="hidden lg:flex relative bg-[#064e3b] p-12 text-white overflow-hidden">

          {/* Background circles */}
          <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-emerald-400/10" />

          <div className="absolute -bottom-40 -right-32 w-96 h-96 rounded-full bg-emerald-300/10" />

          <div className="relative z-10 flex flex-col justify-between w-full">

            {/* BRAND */}
            <div>
              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                  <HeartPulse size={27} />
                </div>

                <div>
                  <h2 className="text-xl font-bold">
                    Hospital Management
                  </h2>

                  <p className="text-sm text-emerald-100">
                    Healthcare Administration
                  </p>
                </div>

              </div>
            </div>

            {/* CENTER CONTENT */}
            <div className="my-12">

              <div className="w-20 h-20 rounded-3xl bg-white/10 border border-white/10 flex items-center justify-center mb-7">
                <Stethoscope size={42} />
              </div>

              <h1 className="text-4xl font-bold leading-tight">
                Manage healthcare
                <br />
                with confidence.
              </h1>

              <p className="mt-5 text-emerald-100 leading-7 max-w-md">
                Access your hospital administration dashboard
                to manage doctors, patients, departments,
                appointments and daily operations.
              </p>

              {/* FEATURES */}
              <div className="mt-8 space-y-4">

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                    <ShieldCheck size={19} />
                  </div>

                  <span className="text-sm text-emerald-50">
                    Secure administration access
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                    <Activity size={19} />
                  </div>

                  <span className="text-sm text-emerald-50">
                    Real-time hospital management
                  </span>
                </div>

              </div>
            </div>

            {/* FOOTER */}
            <p className="text-sm text-emerald-200">
              © {new Date().getFullYear()} Hospital Management System
            </p>

          </div>
        </section>

        {/* ================= RIGHT SECTION ================= */}
        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-14">

          <div className="w-full max-w-md">

            {/* MOBILE BRAND */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-10">

              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <HeartPulse
                  size={26}
                  className="text-emerald-600"
                />
              </div>

              <div>
                <h2 className="font-bold text-[#17211b]">
                  Hospital Management
                </h2>

                <p className="text-xs text-[#66736b]">
                  Healthcare Administration
                </p>
              </div>

            </div>

            {/* HEADING */}
            <div className="mb-8">

              <p className="text-sm font-semibold text-emerald-600 mb-2">
                ADMIN PORTAL
              </p>

              <h1 className="text-3xl sm:text-4xl font-bold text-[#17211b]">
                Welcome back
              </h1>

              <p className="mt-3 text-[#66736b]">
                Sign in to access your administration dashboard.
              </p>

            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* EMAIL */}
              <div>

                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#46534b] mb-2"
                >
                  Email address
                </label>

                <div className="relative">

                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a19a]"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@hospital.com"
                    autoComplete="email"
                    className={`w-full h-12 pl-11 pr-4 rounded-xl bg-[#f8faf9] border ${
                      errors.email
                        ? "border-red-400 focus:ring-red-100"
                        : "border-[#e2e8e4] focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                    } outline-none text-[#17211b] placeholder:text-[#a0aaa4] transition-all`}
                  />

                </div>

                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.email}
                  </p>
                )}

              </div>

              {/* PASSWORD */}
              <div>

                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#46534b] mb-2"
                >
                  Password
                </label>

                <div className="relative">

                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a19a]"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={`w-full h-12 pl-11 pr-12 rounded-xl bg-[#f8faf9] border ${
                      errors.password
                        ? "border-red-400 focus:ring-red-100"
                        : "border-[#e2e8e4] focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                    } outline-none text-[#17211b] placeholder:text-[#a0aaa4] transition-all`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a19a] hover:text-[#46534b] transition-colors"
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

                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.password}
                  </p>
                )}

              </div>

              {/* OPTIONS */}
              <div className="flex items-center justify-between">

                <label className="flex items-center gap-2 cursor-pointer">

                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-[#d5ddd8] text-emerald-600 focus:ring-emerald-500"
                  />

                  <span className="text-sm text-[#66736b]">
                    Remember me
                  </span>

                </label>

                <button
                  type="button"
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                  onClick={() => {
                    notify(
                      "Please contact the system administrator to reset your password.",
                      "info"
                    );
                  }}
                >
                  Forgot password?
                </button>

              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
              >

                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={19} />
                    Sign in
                  </>
                )}

              </button>

            </form>

            {/* SECURITY INFO */}
            <div className="mt-8 p-4 rounded-xl bg-emerald-50 border border-emerald-100">

              <div className="flex gap-3">

                <ShieldCheck
                  size={20}
                  className="text-emerald-600 shrink-0 mt-0.5"
                />

                <div>
                  <p className="text-sm font-semibold text-[#17211b]">
                    Secure login
                  </p>

                  <p className="mt-1 text-xs text-[#66736b] leading-5">
                    Your administrator credentials are protected
                    using secure authentication.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </section>

      </div>
    </main>
  );
}
