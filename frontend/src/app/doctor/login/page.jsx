"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
  Stethoscope,
  ShieldCheck,
  Loader2,
  ArrowRight,
  KeyRound,
  HelpCircle,
} from "lucide-react";

import { toast } from "react-toastify";

import {
  doctorLogin,
} from "@/app/components/utils/Api-call/doctor-auth-api";

export default function DoctorLoginPage() {
  const router = useRouter();

  // ==========================================
  // FORM STATE
  // ==========================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    // ------------------------------------------
    // Validate email
    // ------------------------------------------

    if (!cleanEmail) {
      toast.error("Please enter your email");
      return;
    }

    // ------------------------------------------
    // Validate password
    // ------------------------------------------

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    try {
      setLoading(true);

      // ----------------------------------------
      // Doctor Login API
      // ----------------------------------------

      const result = await doctorLogin({
        email: cleanEmail,
        password,
      });

      console.log("DOCTOR LOGIN RESULT:", result);

      // ----------------------------------------
      // Login failed
      // ----------------------------------------

      if (!result?.success) {
        toast.error(
          result?.message ||
            "Invalid email or password"
        );

        return;
      }

      // ----------------------------------------
      // SAVE AUTH TOKEN
      // ----------------------------------------

      if (result?.token) {
        localStorage.setItem(
          "doctorToken",
          result.token
        );
      }

      // ----------------------------------------
      // SAVE DOCTOR DATA
      // ----------------------------------------

      if (result?.doctor) {
        localStorage.setItem(
          "doctor",
          JSON.stringify(result.doctor)
        );
      }

      // ----------------------------------------
      // Success
      // ----------------------------------------

      toast.success(
        "Welcome back, Doctor"
      );

      // ----------------------------------------
      // Redirect
      // ----------------------------------------

      router.replace(
        "/doctor/dashboard"
      );
    } catch (error) {
      console.error(
        "DOCTOR LOGIN ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FIRST TIME PASSWORD
  // ==========================================

  const handleCreatePassword = () => {
    if (loading) return;

    router.push(
      "/doctor/verify-email"
    );
  };

  // ==========================================
  // FORGOT PASSWORD
  // ==========================================

  const handleForgotPassword = () => {
    if (loading) return;

    router.push(
      "/doctor/forgot-password"
    );
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-6">
      <div className="w-full max-w-5xl">

        {/* =====================================
            MAIN CARD
        ====================================== */}

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

          <div className="grid md:grid-cols-2">

            {/* ==================================
                LEFT BRAND PANEL
            =================================== */}

            <div className="relative hidden min-h-[680px] overflow-hidden bg-blue-700 p-10 text-white md:flex md:flex-col md:justify-between">

              {/* DECORATIVE BACKGROUND */}

              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-600 opacity-60" />

              <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-blue-800 opacity-60" />

              {/* =================================
                  BRAND
              ================================== */}

              <div className="relative z-10">

                <div className="inline-flex rounded-2xl bg-white px-4 py-2 shadow-lg">
                  <img
                    src="/logo/yash-hospital-logo.png"
                    alt="Yash Hospital"
                    className="h-12 w-auto max-w-[190px] object-contain"
                  />
                </div>

                {/* CONTENT */}

                <div className="mt-24">

                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                    <Stethoscope size={25} />
                  </div>

                  <h1 className="text-4xl font-bold leading-tight">
                    Welcome back,
                    <br />
                    Doctor.
                  </h1>

                  <p className="mt-5 max-w-sm text-base leading-7 text-blue-100">
                    Securely access your Yash Hospital
                    Doctor Portal to manage patients,
                    appointments, consultations and
                    your professional schedule.
                  </p>

                </div>
              </div>

              {/* =================================
                  SECURITY
              ================================== */}

              <div className="relative z-10 flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">

                <ShieldCheck
                  size={25}
                  className="shrink-0"
                />

                <div>
                  <p className="text-sm font-semibold">
                    Secure Doctor Portal
                  </p>

                  <p className="text-xs text-blue-100">
                    Your account and clinical data are protected.
                  </p>
                </div>

              </div>
            </div>

            {/* ==================================
                RIGHT LOGIN PANEL
            =================================== */}

            <div className="flex min-h-[680px] flex-col p-7 sm:p-10 lg:p-12">

              {/* =================================
                  MOBILE LOGO
              ================================== */}

              <div className="mb-8 flex justify-center md:hidden">

                <img
                  src="/logo/yash-hospital-logo.png"
                  alt="Yash Hospital"
                  className="h-12 w-auto max-w-[190px] object-contain"
                />

              </div>

              {/* =================================
                  HEADER
              ================================== */}

              <div className="mb-8">

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">

                  <Stethoscope
                    size={24}
                    className="text-blue-600"
                  />

                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  Doctor Login
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Sign in to securely access your
                  Yash Hospital Doctor Portal.
                </p>

              </div>

              {/* =================================
                  LOGIN FORM
              ================================== */}

              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >

                {/* =================================
                    EMAIL
                ================================== */}

                <div>

                  <label
                    htmlFor="doctor-email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email
                  </label>

                  <div className="relative">

                    <UserRound
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="doctor-email"
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(
                          e.target.value
                        )
                      }
                      placeholder="Enter your registered email"
                      autoComplete="email"
                      disabled={loading}
                      className="h-13 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />

                  </div>

                </div>

                {/* =================================
                    PASSWORD
                ================================== */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="doctor-password"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={
                        handleForgotPassword
                      }
                      disabled={loading}
                      className="text-xs font-semibold text-blue-600 transition hover:text-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Forgot password?
                    </button>

                  </div>

                  <div className="relative">

                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="doctor-password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={loading}
                      className="h-13 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      disabled={loading}
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-600 disabled:cursor-not-allowed"
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>

                  </div>

                </div>

                {/* =================================
                    LOGIN BUTTON
                ================================== */}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading ? (
                    <>
                      <Loader2
                        size={19}
                        className="animate-spin"
                      />

                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in to Doctor Portal

                      <ArrowRight
                        size={18}
                      />
                    </>
                  )}

                </button>

              </form>

              {/* =================================
                  FIRST TIME DOCTOR
              ================================== */}

              <div className="mt-7 rounded-2xl border border-blue-100 bg-blue-50 p-5">

                <div className="flex gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">

                    <KeyRound
                      size={19}
                      className="text-blue-600"
                    />

                  </div>

                  <div className="min-w-0">

                    <p className="text-sm font-semibold text-blue-900">
                      First time accessing your account?
                    </p>

                    <p className="mt-1 text-xs leading-5 text-blue-700">
                      If your hospital administrator has
                      registered your account, create your
                      password using email verification.
                    </p>

                    <button
                      type="button"
                      onClick={
                        handleCreatePassword
                      }
                      disabled={loading}
                      className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Create doctor password

                      <ArrowRight
                        size={15}
                      />
                    </button>

                  </div>

                </div>

              </div>

              {/* =================================
                  HELP / SUPPORT
              ================================== */}

              <div className="mt-5 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">

                <HelpCircle
                  size={18}
                  className="mt-0.5 shrink-0 text-slate-500"
                />

                <div>

                  <p className="text-xs font-semibold text-slate-700">
                    Need help signing in?
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Contact the hospital administrator
                    if your account has not been activated
                    or you cannot access your registered email.
                  </p>

                </div>

              </div>

              {/* =================================
                  SECURITY
              ================================== */}

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">

                <ShieldCheck size={14} />

                Secure hospital authentication

              </div>

              {/* =================================
                  FOOTER
              ================================== */}

              <p className="mt-auto pt-6 text-center text-xs text-slate-400">
                © {new Date().getFullYear()} Yash Hospital.
                All rights reserved.
              </p>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}