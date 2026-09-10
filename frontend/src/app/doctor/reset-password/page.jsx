"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import { toast } from "react-toastify";

import {
  resetDoctorPassword,
} from "@/app/components/utils/Api-call/doctor-auth-api";

export default function ResetPasswordPage() {
  const router = useRouter();

  // ==========================================
  // STATE
  // ==========================================

  const [resetToken, setResetToken] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // ==========================================
  // GET RESET SESSION
  // ==========================================

  useEffect(() => {
    let redirectTimer;

    try {
      const token =
        sessionStorage.getItem(
          "doctorResetToken"
        );

      const savedEmail =
        sessionStorage.getItem(
          "doctorOtpEmail"
        );

      const purpose =
        sessionStorage.getItem(
          "doctorOtpPurpose"
        );

      // ----------------------------------------
      // RESET TOKEN CHECK
      // ----------------------------------------

      if (!token) {
        toast.error(
          "Password reset session expired. Please try again."
        );

        redirectTimer = setTimeout(() => {
          router.replace(
            "/doctor/forgot-password"
          );
        }, 1000);

        return;
      }

      // ----------------------------------------
      // RESET PURPOSE CHECK
      // ----------------------------------------

      if (
        purpose &&
        purpose !== "reset"
      ) {
        sessionStorage.removeItem(
          "doctorResetToken"
        );

        sessionStorage.removeItem(
          "doctorOtpPurpose"
        );

        toast.error(
          "Invalid password reset session."
        );

        redirectTimer = setTimeout(() => {
          router.replace(
            "/doctor/forgot-password"
          );
        }, 1000);

        return;
      }

      // ----------------------------------------
      // SAVE TOKEN
      // ----------------------------------------

      setResetToken(token);

      // ----------------------------------------
      // SAVE EMAIL
      // ----------------------------------------

      if (savedEmail) {
        setEmail(
          String(savedEmail)
            .trim()
            .toLowerCase()
        );
      }
    } catch {
      toast.error(
        "Unable to load password reset session."
      );

      redirectTimer = setTimeout(() => {
        router.replace(
          "/doctor/forgot-password"
        );
      }, 1000);
    } finally {
      setInitializing(false);
    }

    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [router]);

  // ==========================================
  // PASSWORD RULES
  // ==========================================

  const passwordRules = {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const isPasswordValid =
    passwordRules.minLength &&
    passwordRules.uppercase &&
    passwordRules.lowercase &&
    passwordRules.number;

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const passwordsDoNotMatch =
    confirmPassword.length > 0 &&
    password !== confirmPassword;

  // ==========================================
  // CLEAR RESET SESSION
  // ==========================================

  const clearResetSession = () => {
    sessionStorage.removeItem(
      "doctorResetToken"
    );

    sessionStorage.removeItem(
      "doctorOtpEmail"
    );

    sessionStorage.removeItem(
      "doctorOtpPurpose"
    );

    sessionStorage.removeItem(
      "doctorOtpExpiresAt"
    );

    sessionStorage.removeItem(
      "doctorResetEmail"
    );
  };

  // ==========================================
  // RESET PASSWORD
  // ==========================================

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Prevent duplicate requests
    if (loading) {
      return;
    }

    // ----------------------------------------
    // TOKEN CHECK
    // ----------------------------------------

    if (!resetToken) {
      toast.error(
        "Invalid or expired reset session."
      );

      router.replace(
        "/doctor/forgot-password"
      );

      return;
    }

    // ----------------------------------------
    // PASSWORD CHECK
    // ----------------------------------------

    if (!password) {
      toast.error(
        "Please enter your new password."
      );

      return;
    }

    if (!confirmPassword) {
      toast.error(
        "Please confirm your new password."
      );

      return;
    }

    // ----------------------------------------
    // PASSWORD STRENGTH
    // ----------------------------------------

    if (!isPasswordValid) {
      toast.error(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number."
      );

      return;
    }

    // ----------------------------------------
    // PASSWORD MATCH
    // ----------------------------------------

    if (password !== confirmPassword) {
      toast.error(
        "Passwords do not match."
      );

      return;
    }

    try {
      setLoading(true);

      // --------------------------------------
      // API
      // --------------------------------------

      const result =
        await resetDoctorPassword({
          resetToken,
          password,
          confirmPassword,
        });

      // --------------------------------------
      // API ERROR
      // --------------------------------------

      if (!result?.success) {
        toast.error(
          result?.message ||
            "Unable to reset password."
        );

        return;
      }

      // --------------------------------------
      // SUCCESS
      // --------------------------------------

      toast.success(
        result?.message ||
          "Password reset successfully."
      );

      // --------------------------------------
      // CLEAR SESSION
      // --------------------------------------

      clearResetSession();

      // --------------------------------------
      // LOGIN
      // --------------------------------------

      setTimeout(() => {
        router.replace(
          "/doctor/login"
        );
      }, 1200);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // BACK TO OTP
  // ==========================================

  const handleBack = () => {
    if (loading) {
      return;
    }

    router.push(
      "/doctor/verify-otp"
    );
  };

  // ==========================================
  // INITIAL LOADING
  // ==========================================

  if (initializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

        <div className="flex flex-col items-center gap-3">

          <Loader2
            size={30}
            className="animate-spin text-blue-600"
          />

          <p className="text-sm text-slate-500">
            Loading secure reset session...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-md">

        {/* ======================================
            LOGO
        ======================================= */}

        <div className="text-center mb-8">

          <div className="flex justify-center mb-4">

            <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center border border-slate-100">

              <img
                src="/logo/yash-hospital-logo.png"
                alt="Yash Hospital"
                className="w-12 h-12 object-contain"
              />

            </div>

          </div>

          <h1 className="text-2xl font-bold text-slate-800">
            Yash Hospital
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Doctor Portal
          </p>

        </div>

        {/* ======================================
            CARD
        ======================================= */}

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-7">

          {/* ====================================
              HEADER
          ===================================== */}

          <div className="text-center mb-7">

            <div className="mx-auto w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-4">

              <LockKeyhole
                size={27}
                className="text-blue-600"
              />

            </div>

            <h2 className="text-xl font-bold text-slate-800">
              Reset Password
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Create a new password for your
              doctor account.
            </p>

            {email && (
              <div className="mt-3 inline-flex max-w-full rounded-lg bg-slate-50 px-3 py-2">

                <p className="text-xs text-slate-500 break-all">
                  {email}
                </p>

              </div>
            )}

          </div>

          {/* ====================================
              FORM
          ===================================== */}

          <form
            onSubmit={handleResetPassword}
            className="space-y-5"
          >

            {/* ==================================
                NEW PASSWORD
            =================================== */}

            <div>

              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                New Password
              </label>

              <div className="relative">

                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="new-password"
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
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full h-12 pl-10 pr-12 rounded-xl border border-slate-200 outline-none text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition disabled:bg-slate-50 disabled:cursor-not-allowed"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:opacity-50"
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

            {/* ==================================
                PASSWORD REQUIREMENTS
            =================================== */}

            <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">

              <p className="text-xs font-semibold text-slate-600 mb-3">
                Password requirements
              </p>

              <div className="grid grid-cols-1 gap-2">

                <PasswordRule
                  valid={
                    passwordRules.minLength
                  }
                  text="At least 8 characters"
                />

                <PasswordRule
                  valid={
                    passwordRules.uppercase
                  }
                  text="One uppercase letter"
                />

                <PasswordRule
                  valid={
                    passwordRules.lowercase
                  }
                  text="One lowercase letter"
                />

                <PasswordRule
                  valid={
                    passwordRules.number
                  }
                  text="One number"
                />

              </div>

            </div>

            {/* ==================================
                CONFIRM PASSWORD
            =================================== */}

            <div>

              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Confirm Password
              </label>

              <div className="relative">

                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  disabled={loading}
                  className={`w-full h-12 pl-10 pr-12 rounded-xl border outline-none text-sm text-slate-800 placeholder:text-slate-400 transition disabled:bg-slate-50 disabled:cursor-not-allowed ${
                    passwordsDoNotMatch
                      ? "border-red-300 focus:ring-2 focus:ring-red-100"
                      : passwordsMatch
                      ? "border-green-300 focus:ring-2 focus:ring-green-100"
                      : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:opacity-50"
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

              {/* PASSWORD MISMATCH */}

              {passwordsDoNotMatch && (
                <p className="text-xs text-red-500 mt-2">
                  Passwords do not match.
                </p>
              )}

              {/* PASSWORD MATCH */}

              {passwordsMatch && (
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">

                  <CheckCircle2
                    size={14}
                  />

                  Passwords match

                </p>
              )}

            </div>

            {/* ==================================
                SUBMIT BUTTON
            =================================== */}

            <button
              type="submit"
              disabled={
                loading ||
                !isPasswordValid ||
                password !== confirmPassword
              }
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold text-sm transition flex items-center justify-center gap-2"
            >

              {loading ? (
                <>
                  <Loader2
                    size={19}
                    className="animate-spin"
                  />

                  Resetting Password...
                </>
              ) : (
                <>
                  <ShieldCheck
                    size={18}
                  />

                  Reset Password
                </>
              )}

            </button>

          </form>

          {/* ====================================
              BACK BUTTON
          ===================================== */}

          <button
            type="button"
            onClick={handleBack}
            disabled={loading}
            className="w-full mt-5 flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition disabled:cursor-not-allowed disabled:opacity-50"
          >

            <ArrowLeft size={16} />

            Back to OTP Verification

          </button>

        </div>

        {/* ======================================
            SECURITY NOTE
        ======================================= */}

        <div className="mt-5 flex items-start gap-3 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100">

          <ShieldCheck
            size={19}
            className="text-blue-600 mt-0.5 shrink-0"
          />

          <p className="text-xs text-blue-700 leading-5">
            For your security, use a unique password
            and never share it with anyone.
          </p>

        </div>

        {/* ======================================
            FOOTER
        ======================================= */}

        <p className="text-center text-xs text-slate-400 mt-6">
          © {new Date().getFullYear()} Yash Hospital.
          All rights reserved.
        </p>

      </div>
    </div>
  );
}

// ==========================================
// PASSWORD RULE COMPONENT
// ==========================================

function PasswordRule({ valid, text }) {
  return (
    <div className="flex items-center gap-2">

      <CheckCircle2
        size={15}
        className={
          valid
            ? "text-green-500"
            : "text-slate-300"
        }
      />

      <span
        className={`text-xs ${
          valid
            ? "text-green-600"
            : "text-slate-400"
        }`}
      >
        {text}
      </span>

    </div>
  );
}