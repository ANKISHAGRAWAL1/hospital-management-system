"use client";

import { useState } from "react";

import {
  X,
  ShieldCheck,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { client } from "@/app/components/healper";
import PatientProfileModal from "./PatientProfileModal";

export default function PatientLoginModal({
  open,
  onClose,
  onLoginSuccess,
}) {
  const [step, setStep] = useState("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [profileOpen, setProfileOpen] = useState(false);
  const [signupToken, setSignupToken] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");

  // =====================================================
  // RESET MODAL
  // =====================================================

  const resetModal = () => {
    setStep("email");
    setEmail("");
    setOtp("");

    setLoading(false);
    setResending(false);

    setError("");
    setSuccessMessage("");

    setProfileOpen(false);
    setSignupToken("");
    setVerifiedEmail("");
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleClose = () => {
    if (loading || resending) {
      return;
    }

    resetModal();

    if (typeof window !== "undefined") {
      sessionStorage.removeItem("patientSignupToken");
      sessionStorage.removeItem("signupToken");
    }

    if (onClose) {
      onClose();
    }
  };

  // =====================================================
  // EMAIL VALIDATION
  // =====================================================

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      value.trim()
    );
  };

  // =====================================================
  // SEND OTP
  // =====================================================

  const handleGetOtp = async () => {
    setError("");
    setSuccessMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      console.log(
        "🔥 PATIENT SEND OTP:",
        cleanEmail
      );

      const response = await client.post(
        "auth/patient/send-otp",
        {
          email: cleanEmail,
        }
      );

      console.log(
        "🔥 PATIENT SEND OTP RESPONSE:",
        response.data
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to send OTP"
        );
      }

      setEmail(cleanEmail);
      setOtp("");
      setStep("otp");

      setSuccessMessage(
        response.data?.message ||
          "OTP sent successfully to your email."
      );
    } catch (error) {
      console.error(
        "❌ PATIENT SEND OTP ERROR:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to send OTP. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // VERIFY OTP
  // =====================================================

  const handleVerifyOtp = async () => {
    setError("");
    setSuccessMessage("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    if (!cleanOtp) {
      setError("Please enter the OTP.");
      return;
    }

    if (!/^\d{6}$/.test(cleanOtp)) {
      setError("OTP must be a 6 digit number.");
      return;
    }

    try {
      setLoading(true);

      console.log(
        "🔥 PATIENT VERIFY OTP:",
        cleanEmail
      );

      const response = await client.post(
        "auth/patient/verify-otp",
        {
          email: cleanEmail,
          otp: cleanOtp,
        }
      );

      console.log(
        "🔥 PATIENT VERIFY OTP RESPONSE:",
        response.data
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "OTP verification failed"
        );
      }

      // =================================================
      // NEW PATIENT
      // =================================================

      if (
        response.data?.isNewPatient === true ||
        response.data?.requiresProfile === true
      ) {
        console.log(
          "🆕 NEW PATIENT DETECTED"
        );

        const token =
          response.data?.signupToken ||
          response.data?.setupToken ||
          "";

        const emailFromResponse =
          response.data?.email ||
          cleanEmail;

        console.log(
          "🔐 SIGNUP TOKEN:",
          token ? "RECEIVED" : "MISSING"
        );

        if (!token) {
          console.error(
            "❌ SIGNUP TOKEN NOT FOUND"
          );

          console.log(
            "AVAILABLE RESPONSE KEYS:",
            Object.keys(response.data || {})
          );

          setError(
            "Signup session was not created. Please try again."
          );

          return;
        }

        // =================================================
        // SAVE TOKEN IN STATE
        // =================================================

        setSignupToken(token);

        // =================================================
        // SAVE TOKEN IN SESSION STORAGE
        // =================================================

        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            "patientSignupToken",
            token
          );

          sessionStorage.setItem(
            "signupToken",
            token
          );
        }

        // =================================================
        // SAVE VERIFIED EMAIL
        // =================================================

        setVerifiedEmail(
          emailFromResponse.trim().toLowerCase()
        );

        setOtp("");
        setError("");
        setSuccessMessage("");

        console.log(
          "✅ PATIENT SIGNUP TOKEN SAVED"
        );

        console.log(
          "📦 TOKEN SAVED IN SESSION STORAGE"
        );

        // =================================================
        // OPEN PROFILE MODAL
        // =================================================

        setProfileOpen(true);

        return;
      }

      // =================================================
      // EXISTING PATIENT
      // =================================================

      if (response.data?.patient) {
        console.log(
          "👤 EXISTING PATIENT LOGIN:",
          response.data.patient
        );

        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            "appointmentPatient",
            JSON.stringify(
              response.data.patient
            )
          );
        }
      }

      setSuccessMessage(
        "Login successful. Continuing to appointment..."
      );

      // =================================================
      // SEND EXISTING PATIENT TO PARENT
      // =================================================

      if (onLoginSuccess) {
        onLoginSuccess(
          response.data.patient
        );
      }

      // =================================================
      // CLOSE LOGIN MODAL
      // =================================================

      setTimeout(() => {
        resetModal();

        if (onClose) {
          onClose();
        }
      }, 500);
    } catch (error) {
      console.error(
        "❌ PATIENT VERIFY OTP ERROR:",
        error
      );

      console.error(
        "❌ VERIFY OTP RESPONSE:",
        error?.response?.data
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Invalid OTP. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RESEND OTP
  // =====================================================

  const handleResendOtp = async () => {
    setError("");
    setSuccessMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (!validateEmail(cleanEmail)) {
      setError(
        "Please enter a valid email address."
      );

      return;
    }

    try {
      setResending(true);

      console.log(
        "🔥 PATIENT RESEND OTP:",
        cleanEmail
      );

      const response = await client.post(
        "auth/patient/send-otp",
        {
          email: cleanEmail,
        }
      );

      console.log(
        "🔥 PATIENT RESEND OTP RESPONSE:",
        response.data
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to resend OTP"
        );
      }

      setOtp("");

      setSuccessMessage(
        response.data?.message ||
          "A new OTP has been sent to your email."
      );
    } catch (error) {
      console.error(
        "❌ PATIENT RESEND OTP ERROR:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to resend OTP.";

      setError(message);
    } finally {
      setResending(false);
    }
  };

  // =====================================================
  // BACK TO EMAIL
  // =====================================================

  const handleBack = () => {
    if (loading || resending) {
      return;
    }

    setError("");
    setSuccessMessage("");
    setOtp("");

    setStep("email");
  };

  // =====================================================
  // PROFILE COMPLETED
  // =====================================================

  const handleProfileComplete = (patient) => {
    console.log(
      "✅ NEW PATIENT PROFILE COMPLETED:",
      patient
    );

    // Close profile popup
    setProfileOpen(false);

    // Clear signup information
    setSignupToken("");
    setVerifiedEmail("");

    if (typeof window !== "undefined") {
      sessionStorage.removeItem(
        "patientSignupToken"
      );

      sessionStorage.removeItem(
        "signupToken"
      );

      // Save newly created patient
      if (patient) {
        sessionStorage.setItem(
          "appointmentPatient",
          JSON.stringify(patient)
        );
      }

      // Mark this patient as new
      sessionStorage.setItem(
        "appointmentPatientType",
        "new"
      );
    }

    // =================================================
    // SEND NEW PATIENT TO APPOINTMENT PAGE
    // =================================================

    if (onLoginSuccess) {
      onLoginSuccess(patient);
    }

    // =================================================
    // CLOSE LOGIN MODAL
    // =================================================

    setTimeout(() => {
      resetModal();

      if (onClose) {
        onClose();
      }
    }, 500);
  };

  // =====================================================
  // PROFILE CLOSE
  // =====================================================

  const handleProfileClose = () => {
    if (loading || resending) {
      return;
    }

    setProfileOpen(false);

    setSignupToken("");
    setVerifiedEmail("");

    if (typeof window !== "undefined") {
      sessionStorage.removeItem(
        "patientSignupToken"
      );

      sessionStorage.removeItem(
        "signupToken"
      );
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      {/* =================================================
          PATIENT LOGIN MODAL
      ================================================= */}

      {open && !profileOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget
            ) {
              handleClose();
            }
          }}
        >
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* CLOSE BUTTON */}

            <button
              type="button"
              onClick={handleClose}
              disabled={
                loading || resending
              }
              aria-label="Close login"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={18} />
            </button>

            {/* HEADER */}

            <div className="bg-[#075db5] px-6 pb-8 pt-8 text-white">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white">
                  <img
                    src="/logo/yash-hospital-logo.png"
                    alt="Yash Hospital"
                    className="h-10 w-10 object-contain"
                  />
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    Yash Hospital
                  </h2>

                  <p className="text-xs text-blue-100">
                    Patient Portal
                  </p>
                </div>
              </div>

              <h3 className="text-2xl font-bold">
                {step === "email"
                  ? "Welcome 👋"
                  : "Verify your email"}
              </h3>

              <p className="mt-1 text-sm text-blue-100">
                {step === "email"
                  ? "Login securely with your email."
                  : `Enter the 6-digit OTP sent to ${email}`}
              </p>
            </div>

            {/* BODY */}

            <div className="p-6">
              {/* SECURITY */}

              <div className="mb-5 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#075db5]">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    Secure Login
                  </p>

                  <p className="text-[11px] text-slate-500">
                    OTP authentication keeps your
                    account secure
                  </p>
                </div>
              </div>

              {/* ERROR */}

              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* SUCCESS */}

              {successMessage && (
                <div className="mb-4 flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <span>
                    {successMessage}
                  </span>
                </div>
              )}

              {/* =================================================
                  EMAIL STEP
              ================================================= */}

              {step === "email" && (
                <>
                  <div className="mb-5">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(
                            e.target.value
                          );

                          setError("");
                          setSuccessMessage("");
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter"
                          ) {
                            handleGetOtp();
                          }
                        }}
                        placeholder="Enter your email address"
                        autoComplete="email"
                        disabled={loading}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#075db5] focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGetOtp}
                    disabled={
                      loading ||
                      !email.trim()
                    }
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#075db5] text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#064d96] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        Get OTP
                        <ArrowRight
                          size={18}
                        />
                      </>
                    )}
                  </button>
                </>
              )}

              {/* =================================================
                  OTP STEP
              ================================================= */}

              {step === "otp" && (
                <>
                  <div className="mb-5">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Enter OTP
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        const value =
                          e.target.value.replace(
                            /\D/g,
                            ""
                          );

                        setOtp(value);
                        setError("");
                      }}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter"
                        ) {
                          handleVerifyOtp();
                        }
                      }}
                      placeholder="Enter 6-digit OTP"
                      autoComplete="one-time-code"
                      disabled={loading}
                      className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-center text-xl font-bold tracking-[0.45em] text-slate-800 outline-none transition focus:border-[#075db5] focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <p className="mt-2 text-center text-xs text-slate-400">
                      OTP is valid for 5 minutes
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={
                      loading ||
                      otp.length !== 6
                    }
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#075db5] text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#064d96] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify & Continue
                        <ArrowRight
                          size={18}
                        />
                      </>
                    )}
                  </button>

                  <div className="mt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={
                        loading ||
                        resending
                      }
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-[#075db5] disabled:opacity-50"
                    >
                      <ArrowLeft
                        size={15}
                      />
                      Change Email
                    </button>

                    <button
                      type="button"
                      onClick={
                        handleResendOtp
                      }
                      disabled={
                        loading ||
                        resending
                      }
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#075db5] transition hover:text-[#064d96] disabled:opacity-50"
                    >
                      {resending && (
                        <Loader2
                          size={14}
                          className="animate-spin"
                        />
                      )}

                      {resending
                        ? "Sending..."
                        : "Resend OTP"}
                    </button>
                  </div>
                </>
              )}

              {/* TERMS */}

              <p className="mt-5 text-center text-[11px] leading-5 text-slate-400">
                By continuing, you agree to our{" "}
                <span className="font-semibold text-[#075db5]">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="font-semibold text-[#075db5]">
                  Privacy Policy
                </span>
                .
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          NEW PATIENT PROFILE POPUP
      ================================================= */}

      <PatientProfileModal
        open={profileOpen}
        email={verifiedEmail}
        signupToken={signupToken}
        onComplete={handleProfileComplete}
        onClose={handleProfileClose}
      />
    </>
  );
}