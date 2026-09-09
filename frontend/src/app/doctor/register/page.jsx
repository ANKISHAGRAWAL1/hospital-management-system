"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Stethoscope,
  Mail,
  ArrowRight,
  ShieldCheck,
  HeartPulse,
  CheckCircle2,
} from "lucide-react";

import { sendDoctorOtp } from "@/app/components/utils/Api-call/doctor-auth-api";
import { notify } from "@/app/components/healper";

export default function DoctorRegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // SEND OTP
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    // ------------------------------------------
    // EMAIL VALIDATION
    // ------------------------------------------

    if (!cleanEmail) {
      notify("Please enter your registered email", false);
      return;
    }

    setLoading(true);

    try {
      const response = await sendDoctorOtp(cleanEmail);

      console.log("Send OTP response:", response);

      if (!response?.success) {
        notify(
          response?.message || "Failed to send OTP",
          false
        );
        return;
      }

      notify("OTP sent successfully", true);

      // ==========================================
      // GO TO VERIFY OTP PAGE
      // ==========================================

      router.push(
        `/doctor/verify-otp?email=${encodeURIComponent(
          cleanEmail
        )}`
      );
    } catch (error) {
      console.error("Send OTP error:", error);

      notify(
        error?.message ||
          "Something went wrong while sending OTP",
        false
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 grid lg:grid-cols-2">

        {/* ==========================================
            LEFT SIDE
        ========================================== */}

        <div className="hidden lg:flex relative bg-blue-600 p-12 text-white flex-col justify-between overflow-hidden">

          {/* Decorative circles */}

          <div className="absolute -top-28 -right-28 w-80 h-80 rounded-full bg-blue-500" />

          <div className="absolute -bottom-32 -left-28 w-80 h-80 rounded-full bg-blue-700" />

          <div className="relative z-10">

            {/* Logo */}

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                <Stethoscope size={27} />
              </div>

              <div>
                <h1 className="text-xl font-bold">
                  MediCare
                </h1>

                <p className="text-xs text-blue-100">
                  Hospital Management System
                </p>
              </div>

            </div>

            {/* Content */}

            <div className="mt-24 max-w-md">

              {/* Badge */}

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-sm text-blue-50 mb-6">
                <HeartPulse size={15} />
                Doctor Portal
              </div>

              {/* Heading */}

              <h2 className="text-4xl font-bold leading-tight">
                Your practice,
                <br />
                your dashboard.
              </h2>

              <p className="mt-5 text-blue-100 leading-7">
                Activate your doctor account and get access
                to appointments, patients, consultations and
                your complete medical workspace.
              </p>

              {/* Info card */}

              <div className="mt-8 p-5 rounded-2xl bg-white/10 border border-white/15">

                <p className="text-sm text-blue-50">
                  🩺 Almost there, Doctor!
                </p>

                <p className="mt-1 text-sm text-white font-medium">
                  One OTP away from pretending
                  <br />
                  you have your life organized. 😄
                </p>

              </div>

            </div>
          </div>

          {/* Bottom */}

          <div className="relative z-10 flex items-center gap-2 text-sm text-blue-100">
            <ShieldCheck size={17} />
            Secure account activation
          </div>

        </div>

        {/* ==========================================
            RIGHT SIDE
        ========================================== */}

        <div className="p-7 sm:p-10 lg:p-14 flex items-center">

          <div className="w-full max-w-md mx-auto">

            {/* Mobile Logo */}

            <div className="lg:hidden flex items-center gap-3 mb-10">

              <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                <Stethoscope size={23} />
              </div>

              <div>
                <h1 className="font-bold text-gray-900">
                  MediCare
                </h1>

                <p className="text-xs text-gray-500">
                  Doctor Portal
                </p>
              </div>

            </div>

            {/* Heading */}

            <div className="mb-8">

              <p className="text-sm font-semibold text-blue-600 mb-2">
                Doctor Registration
              </p>

              <h2 className="text-3xl font-bold text-gray-900">
                Activate your account
              </h2>

              <p className="mt-2 text-sm text-gray-500 leading-6">
                Enter the email address registered by the
                hospital administrator. We'll send you a
                verification OTP.
              </p>

            </div>

            {/* ==========================================
                INFORMATION
            ========================================== */}

            <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-100">

              <div className="flex items-start gap-3">

                <CheckCircle2
                  size={20}
                  className="text-blue-600 mt-0.5 shrink-0"
                />

                <div>

                  <p className="text-sm font-semibold text-blue-900">
                    Hospital-registered email only
                  </p>

                  <p className="text-xs text-blue-700/70 mt-1 leading-5">
                    Your doctor account must already be created
                    by the hospital administrator.
                  </p>

                </div>

              </div>

            </div>

            {/* ==========================================
                FORM
            ========================================== */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Email */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registered Email
                </label>

                <div className="relative">

                  <Mail
                    size={19}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="doctor@hospital.com"
                    autoComplete="email"
                    required
                    disabled={loading}
                    className="
                      w-full
                      h-12
                      pl-11
                      pr-4
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      text-gray-800
                      placeholder:text-gray-400
                      outline-none
                      transition
                      focus:bg-white
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-500/10
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                    "
                  />

                </div>

                <p className="mt-2 text-xs text-gray-400">
                  Use the same email provided to you by the hospital.
                </p>

              </div>

              {/* ==========================================
                  CONTINUE BUTTON
              ========================================== */}

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  h-12
                  rounded-xl
                  bg-blue-600
                  hover:bg-blue-700
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                  text-white
                  font-semibold
                  flex
                  items-center
                  justify-center
                  gap-2
                  transition
                  shadow-sm
                  hover:shadow-md
                "
              >

                {loading ? (
                  "Sending OTP..."
                ) : (
                  <>
                    Continue
                    <ArrowRight size={18} />
                  </>
                )}

              </button>

            </form>

            {/* ==========================================
                LOGIN
            ========================================== */}

            <div className="mt-7 text-center">

              <p className="text-sm text-gray-500">

                Already have an account?{" "}

                <Link
                  href="/doctor/login"
                  className="
                    font-semibold
                    text-blue-600
                    hover:text-blue-700
                  "
                >
                  Sign in
                </Link>

              </p>

            </div>

            {/* ==========================================
                SECURITY
            ========================================== */}

            <div className="mt-8 flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">

              <ShieldCheck
                size={19}
                className="text-blue-600 mt-0.5 shrink-0"
              />

              <div>

                <p className="text-sm font-medium text-gray-700">
                  Your information is secure
                </p>

                <p className="text-xs text-gray-400 mt-1 leading-5">
                  We use OTP verification to make sure only
                  the registered doctor can activate the account.
                </p>

              </div>

            </div>

            {/* Footer */}

            <p className="text-center text-xs text-gray-400 mt-8">
              © 2026 MediCare Hospital Management System
            </p>

          </div>

        </div>

      </div>
    </main>
  );
}