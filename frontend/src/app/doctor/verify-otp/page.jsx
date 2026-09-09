"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Stethoscope,
  ShieldCheck,
  ArrowLeft,
  HeartPulse,
  RefreshCw,
} from "lucide-react";

import {
  verifyDoctorOtp,
  resendDoctorOtp,
} from "@/app/components/utils/Api-call/doctor-auth-api";

import { notify } from "@/app/components/healper";

export default function DoctorVerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  const inputRefs = useRef([]);

  // ==========================================
  // RESEND TIMER
  // ==========================================

  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  // ==========================================
  // OTP CHANGE
  // ==========================================

  const handleOtpChange = (value, index) => {
    // Only numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];

    newOtp[index] = value.slice(-1);

    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ==========================================
  // KEYBOARD NAVIGATION
  // ==========================================

  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ==========================================
  // PASTE OTP
  // ==========================================

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedData) return;

    const newOtp = ["", "", "", "", "", ""];

    pastedData.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

    const nextIndex = Math.min(
      pastedData.length,
      5
    );

    inputRefs.current[nextIndex]?.focus();
  };

  // ==========================================
  // RESEND OTP
  // ==========================================

  const handleResendOtp = async () => {
    if (!email) {
      notify("Email not found", false);
      router.push("/doctor/register");
      return;
    }

    if (resendTimer > 0 || resendLoading) {
      return;
    }

    setResendLoading(true);

    try {
      const response = await resendDoctorOtp(email);

      console.log("Resend OTP response:", response);

      if (response?.success) {
        notify(
          response.message || "New OTP sent successfully",
          true
        );

        // Clear old OTP
        setOtp(["", "", "", "", "", ""]);

        // Restart timer
        setResendTimer(60);

        // Focus first input
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 100);
      } else {
        notify(
          response?.message || "Failed to resend OTP",
          false
        );
      }
    } catch (error) {
      console.error("Resend OTP error:", error);

      notify(
        error?.message || "Failed to resend OTP",
        false
      );
    } finally {
      setResendLoading(false);
    }
  };

  // ==========================================
  // VERIFY OTP
  // ==========================================

  const handleVerify = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("").trim();

    console.log("========== OTP VERIFY ==========");
    console.log("Email:", email);
    console.log("Entered OTP:", enteredOtp);
    console.log("OTP Length:", enteredOtp.length);
    console.log("================================");

    // Email validation
    if (!email) {
      notify("Email not found", false);
      router.push("/doctor/register");
      return;
    }

    // OTP validation
    if (!/^\d{6}$/.test(enteredOtp)) {
      notify(
        "Please enter the complete 6-digit OTP",
        false
      );
      return;
    }

    setLoading(true);

    try {
      const response = await verifyDoctorOtp(
        email.trim().toLowerCase(),
        enteredOtp
      );

      console.log(
        "========== VERIFY RESPONSE =========="
      );
      console.log("Verify OTP response:", response);
      console.log(
        "Success:",
        response?.success
      );
      console.log(
        "Setup Token:",
        response?.setupToken
          ? "RECEIVED"
          : "MISSING"
      );
      console.log(
        "====================================="
      );

      // ======================================
      // OTP SUCCESS
      // ======================================

      if (response?.success) {
        const setupToken = response?.setupToken;

        // Backend should return setupToken
        if (!setupToken) {
          console.error(
            "Setup token missing:",
            response
          );

          notify(
            "OTP verified, but setup token was not received.",
            false
          );

          return;
        }

        // Save setup token
        sessionStorage.setItem(
          "doctorSetupToken",
          setupToken
        );

        notify(
          response.message ||
            "OTP verified successfully",
          true
        );

        // Go to create account
        router.push("/doctor/create-account");

        return;
      }

      // ======================================
      // OTP FAILED
      // ======================================

      notify(
        response?.message || "Invalid OTP",
        false
      );
    } catch (error) {
      console.error(
        "OTP verification error:",
        error
      );

      notify(
        error?.message ||
          "OTP verification failed",
        false
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 grid lg:grid-cols-2">

        {/* ===================================== */}
        {/* LEFT SIDE */}
        {/* ===================================== */}

        <div className="hidden lg:flex relative bg-blue-600 p-12 text-white flex-col justify-between overflow-hidden">

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

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-sm text-blue-50 mb-6">

                <HeartPulse size={15} />

                Doctor Portal

              </div>

              <h2 className="text-4xl font-bold leading-tight">
                Almost there,
                <br />
                Doctor.
              </h2>

              <p className="mt-5 text-blue-100 leading-7">
                We've sent a verification code to your
                registered email address. Enter it here
                to securely activate your doctor account.
              </p>

              <div className="mt-8 p-5 rounded-2xl bg-white/10 border border-white/15">

                <p className="text-sm text-blue-50">
                  🔐 Tiny code. Big responsibility.
                </p>

                <p className="mt-1 text-sm text-white font-medium">
                  Don't worry, it's easier than reading
                  <br />
                  a patient's handwriting. 😄
                </p>

              </div>

            </div>

          </div>

          {/* Bottom */}

          <div className="relative z-10 flex items-center gap-2 text-sm text-blue-100">

            <ShieldCheck size={17} />

            Secure OTP verification

          </div>

        </div>

        {/* ===================================== */}
        {/* RIGHT SIDE */}
        {/* ===================================== */}

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

            {/* Back */}

            <button
              type="button"
              onClick={() =>
                router.push("/doctor/register")
              }
              className="
                flex
                items-center
                gap-2
                text-sm
                text-gray-500
                hover:text-blue-600
                transition
                mb-8
              "
            >

              <ArrowLeft size={17} />

              Back

            </button>

            {/* Heading */}

            <div className="mb-8">

              <p className="text-sm font-semibold text-blue-600 mb-2">
                Verification
              </p>

              <h2 className="text-3xl font-bold text-gray-900">
                Verify your email
              </h2>

              <p className="mt-2 text-sm text-gray-500 leading-6">
                Enter the 6-digit verification code we
                sent to
              </p>

              {email && (
                <p className="mt-1 text-sm font-semibold text-gray-700 break-all">
                  {email}
                </p>
              )}

            </div>

            {/* OTP FORM */}

            <form
              onSubmit={handleVerify}
              className="space-y-7"
            >

              {/* OTP */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Verification Code
                </label>

                <div
                  className="flex gap-2 sm:gap-3"
                  onPaste={handlePaste}
                >

                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] =
                          el;
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete={
                        index === 0
                          ? "one-time-code"
                          : "off"
                      }
                      maxLength={1}
                      value={digit}
                      onChange={(e) =>
                        handleOtpChange(
                          e.target.value,
                          index
                        )
                      }
                      onKeyDown={(e) =>
                        handleKeyDown(
                          e,
                          index
                        )
                      }
                      disabled={loading}
                      className="
                        w-full
                        h-14
                        rounded-xl
                        border
                        border-gray-200
                        bg-gray-50
                        text-center
                        text-xl
                        font-bold
                        text-gray-800
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
                  ))}

                </div>

              </div>

              {/* RESEND */}

              <div className="text-center -mt-2">

                {resendTimer > 0 ? (

                  <p className="text-sm text-gray-500">

                    Didn't receive the code?{" "}

                    <span className="font-semibold text-blue-600">
                      Resend in {resendTimer}s
                    </span>

                  </p>

                ) : (

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendLoading}
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      text-sm
                      font-semibold
                      text-blue-600
                      hover:text-blue-700
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                      transition
                    "
                  >

                    <RefreshCw
                      size={16}
                      className={
                        resendLoading
                          ? "animate-spin"
                          : ""
                      }
                    />

                    {resendLoading
                      ? "Sending..."
                      : "Resend OTP"}

                  </button>

                )}

              </div>

              {/* VERIFY */}

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
                  "Verifying..."
                ) : (
                  <>
                    Verify OTP

                    <ShieldCheck size={18} />
                  </>
                )}

              </button>

            </form>

            {/* Security */}

            <div className="mt-8 flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">

              <ShieldCheck
                size={19}
                className="text-blue-600 mt-0.5 shrink-0"
              />

              <div>

                <p className="text-sm font-medium text-blue-900">
                  Never share your OTP
                </p>

                <p className="text-xs text-blue-700/70 mt-1 leading-5">
                  Hospital staff will never ask you
                  for your verification code.
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