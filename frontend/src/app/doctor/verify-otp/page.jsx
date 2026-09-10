"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  ArrowLeft,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";

import {
  verifyDoctorOtp,
  verifyDoctorResetOtp,
  resendDoctorOtp,
} from "@/app/components/utils/Api-call/doctor-auth-api";

export default function DoctorVerifyOtpPage() {
  const router = useRouter();

  // ==========================================
  // STATES
  // ==========================================

  const [email, setEmail] = useState("");

  const [purpose, setPurpose] = useState("setup");

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [timeLeft, setTimeLeft] = useState(300);

  const inputRefs = useRef([]);

  // ==========================================
  // GET EMAIL + PURPOSE FROM SESSION
  // ==========================================

  useEffect(() => {
    const storedEmail =
      sessionStorage.getItem("doctorOtpEmail");

    const storedPurpose =
      sessionStorage.getItem("doctorOtpPurpose") || "setup";

    // ------------------------------------------
    // EMAIL NOT FOUND
    // ------------------------------------------

    if (!storedEmail) {
      toast.error(
        "Verification session expired. Please try again."
      );

      if (storedPurpose === "reset") {
        router.replace("/doctor/forgot-password");
      } else {
        router.replace("/doctor/verify-email");
      }

      return;
    }

    setEmail(storedEmail);
    setPurpose(storedPurpose);

    // ------------------------------------------
    // RESTORE OTP EXPIRY IF AVAILABLE
    // ------------------------------------------

    const storedExpiry =
      sessionStorage.getItem(
        "doctorOtpExpiresAt"
      );

    if (storedExpiry) {
      const remaining = Math.max(
        0,
        Math.floor(
          (Number(storedExpiry) - Date.now()) / 1000
        )
      );

      setTimeLeft(remaining);
    }

    // Focus first OTP input
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 300);
  }, [router]);

  // ==========================================
  // OTP TIMER
  // ==========================================

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) =>
        previous > 0 ? previous - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // ==========================================
  // FORMAT TIMER
  // ==========================================

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(
      2,
      "0"
    )}`;
  };

  // ==========================================
  // OTP CHANGE
  // ==========================================

  const handleOtpChange = (index, value) => {
    const numbersOnly = value
      .replace(/\D/g, "");

    // ------------------------------------------
    // EMPTY INPUT
    // ------------------------------------------

    if (!numbersOnly) {
      const updatedOtp = [...otp];

      updatedOtp[index] = "";

      setOtp(updatedOtp);

      return;
    }

    // ------------------------------------------
    // MULTIPLE DIGITS / PASTE
    // ------------------------------------------

    if (numbersOnly.length > 1) {
      const digits = numbersOnly
        .slice(0, 6)
        .split("");

      const updatedOtp = [
        "",
        "",
        "",
        "",
        "",
        "",
      ];

      digits.forEach((digit, digitIndex) => {
        updatedOtp[digitIndex] = digit;
      });

      setOtp(updatedOtp);

      const nextIndex = Math.min(
        digits.length,
        5
      );

      setTimeout(() => {
        inputRefs.current[nextIndex]?.focus();
      }, 0);

      return;
    }

    // ------------------------------------------
    // SINGLE DIGIT
    // ------------------------------------------

    const updatedOtp = [...otp];

    updatedOtp[index] = numbersOnly;

    setOtp(updatedOtp);

    // Move to next input
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ==========================================
  // KEYBOARD HANDLING
  // ==========================================

  const handleKeyDown = (index, e) => {
    // Backspace
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    // Left Arrow
    if (
      e.key === "ArrowLeft" &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    // Right Arrow
    if (
      e.key === "ArrowRight" &&
      index < 5
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ==========================================
  // PASTE OTP
  // ==========================================

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedOtp = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedOtp) {
      return;
    }

    const digits = pastedOtp.split("");

    const updatedOtp = [
      "",
      "",
      "",
      "",
      "",
      "",
    ];

    digits.forEach((digit, index) => {
      updatedOtp[index] = digit;
    });

    setOtp(updatedOtp);

    const nextIndex = Math.min(
      digits.length,
      5
    );

    setTimeout(() => {
      inputRefs.current[nextIndex]?.focus();
    }, 0);
  };

  // ==========================================
  // VERIFY OTP
  // ==========================================

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    // ------------------------------------------
    // EMAIL CHECK
    // ------------------------------------------

    if (!email) {
      toast.error(
        "Email not found. Please start again."
      );

      if (purpose === "reset") {
        router.replace(
          "/doctor/forgot-password"
        );
      } else {
        router.replace(
          "/doctor/verify-email"
        );
      }

      return;
    }

    // ------------------------------------------
    // COMBINE OTP
    // ------------------------------------------

    const enteredOtp = otp.join("");

    // ------------------------------------------
    // OTP LENGTH
    // ------------------------------------------

    if (enteredOtp.length !== 6) {
      toast.error(
        "Please enter the complete 6-digit OTP"
      );

      return;
    }

    // ------------------------------------------
    // OTP EXPIRED
    // ------------------------------------------

    if (timeLeft <= 0) {
      toast.error(
        "OTP has expired. Please resend a new OTP."
      );

      return;
    }

    try {
      setLoading(true);

      let result;

      // ========================================
      // RESET PASSWORD FLOW
      // ========================================

      if (purpose === "reset") {
        result = await verifyDoctorResetOtp(
          email,
          enteredOtp
        );
      }

      // ========================================
      // FIRST TIME SETUP FLOW
      // ========================================

      else {
        result = await verifyDoctorOtp(
          email,
          enteredOtp
        );
      }

      // ========================================
      // API FAILED
      // ========================================

      if (!result?.success) {
        toast.error(
          result?.message || "Invalid OTP"
        );

        return;
      }

      // ========================================
      // RESET PASSWORD FLOW
      // ========================================

      if (purpose === "reset") {
        if (!result?.resetToken) {
          toast.error(
            "Reset token was not received. Please try again."
          );

          return;
        }

        // Save reset token
        sessionStorage.setItem(
          "doctorResetToken",
          result.resetToken
        );

        // Keep email
        sessionStorage.setItem(
          "doctorOtpEmail",
          email
        );

        // Clear OTP purpose
        sessionStorage.setItem(
          "doctorOtpPurpose",
          "reset"
        );

        // Remove OTP expiry
        sessionStorage.removeItem(
          "doctorOtpExpiresAt"
        );

        toast.success(
          "OTP verified successfully"
        );

        // Go to reset password
        router.push(
          "/doctor/reset-password"
        );

        return;
      }

      // ========================================
      // FIRST TIME SETUP FLOW
      // ========================================

      if (!result?.setupToken) {
        toast.error(
          "Verification token was not received. Please try again."
        );

        return;
      }

      // Save setup token
      sessionStorage.setItem(
        "doctorSetupToken",
        result.setupToken
      );

      // Keep email
      sessionStorage.setItem(
        "doctorOtpEmail",
        email
      );

      // Keep purpose
      sessionStorage.setItem(
        "doctorOtpPurpose",
        "setup"
      );

      // Remove OTP expiry
      sessionStorage.removeItem(
        "doctorOtpExpiresAt"
      );

      toast.success(
        "Email verified successfully"
      );

      // Go to create password
      router.push(
        "/doctor/create-password"
      );
    } catch (error) {
      console.error(
        "VERIFY DOCTOR OTP ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RESEND OTP
  // ==========================================

  const handleResendOtp = async () => {
    if (!email) {
      toast.error(
        "Email not found. Please start again."
      );

      if (purpose === "reset") {
        router.replace(
          "/doctor/forgot-password"
        );
      } else {
        router.replace(
          "/doctor/verify-email"
        );
      }

      return;
    }

    if (resending) {
      return;
    }

    try {
      setResending(true);

      /*
       * IMPORTANT:
       *
       * resendDoctorOtp() currently belongs
       * to the common Doctor OTP flow.
       *
       * Your backend resend endpoint should
       * generate a new OTP for both setup and
       * reset-password flows.
       */

      const result = await resendDoctorOtp(
        email
      );

      if (!result?.success) {
        toast.error(
          result?.message ||
            "Unable to resend OTP"
        );

        return;
      }

      // ------------------------------------------
      // CLEAR OLD OTP
      // ------------------------------------------

      setOtp([
        "",
        "",
        "",
        "",
        "",
        "",
      ]);

      // ------------------------------------------
      // RESET TIMER
      // ------------------------------------------

      setTimeLeft(300);

      // ------------------------------------------
      // SAVE NEW EXPIRY
      // ------------------------------------------

      sessionStorage.setItem(
        "doctorOtpExpiresAt",
        String(
          Date.now() + 300000
        )
      );

      toast.success(
        "New OTP sent successfully"
      );

      // ------------------------------------------
      // FOCUS FIRST BOX
      // ------------------------------------------

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (error) {
      console.error(
        "RESEND DOCTOR OTP ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to resend OTP"
      );
    } finally {
      setResending(false);
    }
  };

  // ==========================================
  // CHANGE EMAIL
  // ==========================================

  const handleChangeEmail = () => {
    sessionStorage.removeItem(
      "doctorOtpEmail"
    );

    sessionStorage.removeItem(
      "doctorOtpExpiresAt"
    );

    sessionStorage.removeItem(
      "doctorSetupToken"
    );

    sessionStorage.removeItem(
      "doctorResetToken"
    );

    sessionStorage.removeItem(
      "doctorOtpPurpose"
    );

    if (purpose === "reset") {
      router.push(
        "/doctor/forgot-password"
      );
    } else {
      router.push(
        "/doctor/verify-email"
      );
    }
  };

  // ==========================================
  // OTP COMPLETE
  // ==========================================

  const isOtpComplete = otp.every(
    (digit) => digit !== ""
  );

  // ==========================================
  // PAGE TEXT
  // ==========================================

  const isResetFlow =
    purpose === "reset";

  const pageTitle = isResetFlow
    ? "Verify your identity"
    : "Verify your email";

  const pageDescription = isResetFlow
    ? "Enter the 6-digit verification code that we sent to your registered email address to securely reset your password."
    : "Enter the 6-digit verification code that we sent to your registered email address.";

  const leftTitle = isResetFlow
    ? "Reset your"
    : "Verify your";

  const leftTitleSecondLine = isResetFlow
    ? "password."
    : "account.";

  const leftDescription = isResetFlow
    ? "Enter the verification code sent to your registered email address to securely reset your doctor account password."
    : "Enter the verification code sent to your registered email address to securely continue creating your doctor account.";

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-2 sm:py-4">
      <div className="w-full max-w-5xl">

        {/* ======================================
            MAIN CARD
        ======================================= */}

        <div className="overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-xl">

          <div className="grid md:grid-cols-2">

            {/* ==================================
                LEFT BLUE SECTION
            =================================== */}

            <div className="relative hidden md:flex min-h-[720px] flex-col justify-between overflow-hidden bg-blue-700 p-10 text-white">

              {/* Top Circle */}

              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-600 opacity-60" />

              {/* Bottom Circle */}

              <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-blue-800 opacity-60" />

              {/* =================================
                  BRAND
              ================================== */}

              <div className="relative z-10">

                <div className="flex items-center">

                  <div className="rounded-2xl bg-white px-4 py-2 shadow-lg">

                    <img
                      src="/logo/yash-hospital-logo.png"
                      alt="Yash Hospital"
                      className="h-12 w-auto max-w-[170px] object-contain"
                    />

                  </div>

                </div>

                {/* =================================
                    LEFT CONTENT
                ================================== */}

                <div className="mt-24">

                  <h1 className="text-4xl font-bold leading-tight">
                    {leftTitle}
                    <br />
                    {leftTitleSecondLine}
                  </h1>

                  <p className="mt-5 max-w-sm text-base leading-7 text-blue-100">
                    {leftDescription}
                  </p>

                </div>

              </div>

              {/* =================================
                  SECURITY BOX
              ================================== */}

              <div className="relative z-10 flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">

                <ShieldCheck
                  size={25}
                  className="shrink-0"
                />

                <div>

                  <p className="text-sm font-semibold">
                    Secure Verification
                  </p>

                  <p className="text-xs text-blue-100">
                    Your OTP is valid for 5 minutes.
                  </p>

                </div>

              </div>

            </div>

            {/* ==================================
                RIGHT SECTION
            =================================== */}

            <div className="flex min-h-[720px] flex-col p-7 sm:p-10 lg:p-12">

              {/* =================================
                  MOBILE LOGO
              ================================== */}

              <div className="mb-7 flex items-center justify-center md:hidden">

                <img
                  src="/logo/yash-hospital-logo.png"
                  alt="Yash Hospital"
                  className="h-12 w-auto max-w-[170px] object-contain"
                />

              </div>

              {/* =================================
                  BACK
              ================================== */}

              <button
                type="button"
                onClick={handleChangeEmail}
                disabled={
                  loading || resending
                }
                className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >

                <ArrowLeft size={18} />

                Back to Email

              </button>

              {/* =================================
                  HEADING
              ================================== */}

              <div className="mb-8">

                {/* Icon */}

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">

                  <Mail
                    size={24}
                    className="text-blue-600"
                  />

                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  {pageTitle}
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {pageDescription}
                </p>

                {/* Email */}

                <div className="mt-4 flex items-center gap-2">

                  <Mail
                    size={16}
                    className="shrink-0 text-slate-400"
                  />

                  <span className="break-all text-sm font-semibold text-slate-700">
                    {email || "Loading..."}
                  </span>

                </div>

              </div>

              {/* =================================
                  OTP FORM
              ================================== */}

              <form
                onSubmit={handleVerifyOtp}
                className="space-y-6"
              >

                {/* =================================
                    OTP INPUTS
                ================================== */}

                <div>

                  <label className="mb-3 block text-sm font-semibold text-slate-700">
                    Verification Code
                  </label>

                  <div
                    className="flex gap-2 sm:gap-3"
                    onPaste={handlePaste}
                  >

                    {otp.map(
                      (digit, index) => (
                        <input
                          key={index}
                          ref={(element) => {
                            inputRefs.current[index] =
                              element;
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
                          disabled={
                            loading ||
                            resending
                          }
                          onChange={(e) =>
                            handleOtpChange(
                              index,
                              e.target.value
                            )
                          }
                          onKeyDown={(e) =>
                            handleKeyDown(
                              index,
                              e
                            )
                          }
                          aria-label={`OTP digit ${
                            index + 1
                          }`}
                          className={`h-12 w-full min-w-0 rounded-xl border bg-white text-center text-xl font-bold text-slate-900 outline-none transition sm:h-14 sm:text-2xl ${
                            digit
                              ? "border-blue-500 bg-blue-50"
                              : "border-slate-300"
                          } focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50`}
                        />
                      )
                    )}

                  </div>

                </div>

                {/* =================================
                    TIMER
                ================================== */}

                <div className="flex items-center justify-between">

                  <p className="text-sm text-slate-500">
                    OTP expires in
                  </p>

                  {timeLeft > 0 ? (
                    <span className="font-semibold text-blue-600">
                      {formatTime(timeLeft)}
                    </span>
                  ) : (
                    <span className="font-semibold text-red-500">
                      OTP Expired
                    </span>
                  )}

                </div>

                {/* =================================
                    VERIFY BUTTON
                ================================== */}

                <button
                  type="submit"
                  disabled={
                    loading ||
                    resending ||
                    !isOtpComplete ||
                    timeLeft <= 0
                  }
                  className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading ? (
                    <>

                      <Loader2
                        size={19}
                        className="animate-spin"
                      />

                      Verifying OTP...

                    </>
                  ) : (
                    <>

                      Verify OTP

                      <CheckCircle2
                        size={18}
                      />

                    </>
                  )}

                </button>

              </form>

              {/* =================================
                  RESEND
              ================================== */}

              <div className="mt-7 text-center">

                <p className="text-sm text-slate-500">
                  Didn&apos;t receive the OTP?
                </p>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={
                    resending ||
                    loading ||
                    timeLeft > 0
                  }
                  className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700 disabled:cursor-not-allowed disabled:text-slate-400"
                >

                  {resending ? (
                    <>

                      <Loader2
                        size={16}
                        className="animate-spin"
                      />

                      Sending OTP...

                    </>
                  ) : (
                    <>

                      <RefreshCw
                        size={16}
                      />

                      Resend OTP

                    </>
                  )}

                </button>

              </div>

              {/* =================================
                  SECURITY NOTICE
              ================================== */}

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
                      Never share your OTP with
                      anyone. Yash Hospital staff
                      will never ask you for your
                      verification code.
                    </p>

                  </div>

                </div>

              </div>

              {/* =================================
                  FOOTER
              ================================== */}

              <p className="mt-auto pt-8 text-center text-xs text-slate-400">
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