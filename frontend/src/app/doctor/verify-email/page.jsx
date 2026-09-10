"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  ArrowLeft,
  ShieldCheck,
  Loader2,
  Stethoscope,
} from "lucide-react";
import { toast } from "react-toastify";
import { sendDoctorOtp } from "@/app/components/utils/Api-call/doctor-auth-api";

export default function DoctorVerifyEmailPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      toast.error("Please enter your registered email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      const result = await sendDoctorOtp(cleanEmail);

      if (!result?.success) {
        toast.error(result?.message || "Unable to send OTP");
        return;
      }

      // Keep email temporarily for OTP verification page
       
      sessionStorage.setItem("doctorOtpEmail", cleanEmail);
       sessionStorage.setItem("doctorOtpPurpose", "setup");
     toast.success("OTP sent successfully to your email");

      router.push("/doctor/verify-otp");
    } catch (error) {
      console.error("SEND DOCTOR OTP ERROR:", error);

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
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl">
        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl border border-slate-200">
          <div className="grid md:grid-cols-2">
            {/* ================= LEFT BRANDING ================= */}
            <div className="relative hidden md:flex flex-col justify-between overflow-hidden bg-blue-700 p-10 text-white">
              {/* Background decoration */}
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-600 opacity-60" />
              <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-blue-800 opacity-60" />

              <div className="relative z-10">
                {/* Hospital Logo */}
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg">
                    <Stethoscope
                      size={30}
                      className="text-blue-700"
                    />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">
                      Hospital Management
                    </h2>
                    <p className="text-sm text-blue-100">
                      Healthcare Portal
                    </p>
                  </div>
                </div>

                {/* Welcome */}
                <div className="mt-24">
                  <h1 className="text-4xl font-bold leading-tight">
                    Secure access
                    <br />
                    for doctors.
                  </h1>

                  <p className="mt-5 max-w-sm text-base leading-7 text-blue-100">
                    Verify your registered email address to securely create
                    your doctor account password.
                  </p>
                </div>
              </div>

              {/* Security */}
              <div className="relative z-10 flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <ShieldCheck size={25} />

                <div>
                  <p className="text-sm font-semibold">
                    Secure Verification
                  </p>
                  <p className="text-xs text-blue-100">
                    Your account is protected with OTP verification.
                  </p>
                </div>
              </div>
            </div>

            {/* ================= RIGHT FORM ================= */}
            <div className="p-7 sm:p-10 lg:p-12">
              {/* Mobile Logo */}
              <div className="mb-8 flex items-center gap-3 md:hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <Stethoscope size={25} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Hospital Management
                  </h2>
                  <p className="text-xs text-slate-500">
                    Doctor Portal
                  </p>
                </div>
              </div>

              {/* Back */}
              <button
                type="button"
                onClick={() => router.push("/doctor/login")}
                disabled={loading}
                className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={17} />
                Back to Login
              </button>

              {/* Heading */}
              <div className="mb-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                  <Mail className="text-blue-600" size={24} />
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  Verify your email
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Enter the email address registered by your hospital
                  administrator. We&apos;ll send a one-time password (OTP)
                  to verify your account.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="doctor-email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Registered Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="doctor-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="doctor@example.com"
                      autoComplete="email"
                      disabled={loading}
                      className="h-13 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />
                  </div>
                </div>

                {/* Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={19} className="animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Send Verification OTP
                      <ShieldCheck size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Information */}
              <div className="mt-7 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex gap-3">
                  <ShieldCheck
                    size={19}
                    className="mt-0.5 shrink-0 text-blue-600"
                  />

                  <div>
                    <p className="text-sm font-semibold text-blue-900">
                      Account verification
                    </p>

                    <p className="mt-1 text-xs leading-5 text-blue-700">
                      Only doctors whose email is registered in the hospital
                      system can continue with password creation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <p className="mt-8 text-center text-xs text-slate-400">
                © {new Date().getFullYear()} Hospital Management System
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}