 
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  Mail,
  ShieldCheck,
  Loader2,
  LockKeyhole,
} from "lucide-react";

import { toast } from "react-toastify";
import { forgotDoctorPassword } from "@/app/components/utils/Api-call/doctor-auth-api";

export default function DoctorForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // EMAIL VALIDATION
  // =====================================================

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  // =====================================================
  // SEND RESET OTP
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      toast.error("Please enter your registered email address.");
      return;
    }

    if (!validateEmail(cleanEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      // Send forgot-password OTP
      const result = await forgotDoctorPassword({
        email: cleanEmail,
      });

      if (!result?.success) {
        toast.error(
          result?.message || "Unable to send password reset OTP."
        );
        return;
      }

      // =================================================
      // SAVE OTP FLOW DATA
      // =================================================

      sessionStorage.setItem("doctorOtpEmail", cleanEmail);
      sessionStorage.setItem("doctorOtpPurpose", "reset");

      const expiresIn = Number(result?.expiresIn) || 300;

      sessionStorage.setItem(
        "doctorOtpExpiresAt",
        String(Date.now() + expiresIn * 1000)
      );

      // =================================================
      // SUCCESS
      // =================================================

      toast.success(
        result?.message ||
          "OTP has been sent to your registered email."
      );

      router.push("/doctor/verify-otp");
    } catch (error) {
      console.error("Forgot password error:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">

        {/* =================================================
            LEFT BRAND PANEL
        ================================================= */}

        <section className="relative hidden overflow-hidden bg-blue-700 lg:flex lg:w-1/2">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.35),transparent_40%)]" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            <div>
              <Image
                src="/logo/yash-hospital-logo.png"
                alt="Yash Hospital"
                width={190}
                height={70}
                priority
                className="h-auto w-auto max-w-[190px] object-contain"
              />
            </div>

            <div className="max-w-xl text-white">

              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                <LockKeyhole
                  size={28}
                  strokeWidth={1.8}
                />
              </div>

              <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
                Securely recover your doctor account.
              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-blue-100 xl:text-lg">
                We will send a secure verification code
                to your registered email address so you
                can create a new password.
              </p>

              <div className="mt-8 space-y-4">

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                    <ShieldCheck size={18} />
                  </div>

                  <span className="text-sm text-blue-50">
                    Secure email verification
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                    <LockKeyhole size={18} />
                  </div>

                  <span className="text-sm text-blue-50">
                    Protected password reset
                  </span>
                </div>

              </div>
            </div>

            <p className="text-sm text-blue-100">
              © {new Date().getFullYear()} Yash Hospital.
              All rights reserved.
            </p>

          </div>
        </section>

        {/* =================================================
            RIGHT FORM PANEL
        ================================================= */}

        <section className="flex w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-1/2">

          <div className="w-full max-w-md">

            {/* MOBILE LOGO */}

            <div className="mb-10 flex justify-center lg:hidden">
              <Image
                src="/logo/yash-hospital-logo.png"
                alt="Yash Hospital"
                width={180}
                height={65}
                priority
                className="h-auto w-auto max-w-[180px] object-contain"
              />
            </div>

            {/* BACK TO LOGIN */}

            <Link
              href="/doctor/login"
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
            >
              <ArrowLeft size={17} />
              Back to Doctor Login
            </Link>

            {/* HEADING */}

            <div className="mb-8">

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <LockKeyhole
                  size={23}
                  strokeWidth={1.8}
                />
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Forgot Password?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Enter your registered doctor email
                address and we&apos;ll send you a
                verification code.
              </p>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* EMAIL */}

              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Registered Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@example.com"
                    autoComplete="email"
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />

                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Use the email address registered
                  with Yash Hospital.
                </p>

              </div>

              {/* SUBMIT BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Sending verification code...
                  </>
                ) : (
                  "Send Verification Code"
                )}
              </button>

            </form>

            {/* SECURITY INFO */}

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <ShieldCheck size={18} />
                </div>

                <div>

                  <h3 className="text-sm font-semibold text-slate-800">
                    Account Security
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Your verification code is valid
                    for a limited time. Never share
                    your OTP with anyone.
                  </p>

                </div>

              </div>

            </div>

            {/* HELP */}

            <p className="mt-6 text-center text-xs text-slate-400">
              Having trouble accessing your email?
              Contact your hospital administrator.
            </p>

          </div>
        </section>

      </div>
    </main>
  );
}
 
