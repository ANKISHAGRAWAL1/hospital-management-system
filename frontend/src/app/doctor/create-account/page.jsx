"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ShieldCheck,
  LockKeyhole,
  Eye,
  EyeOff,
  CheckCircle2,
  Stethoscope,
} from "lucide-react";

import { setDoctorCredentials } from "@/app/components/utils/Api-call/doctor-auth-api";
import { notify } from "@/app/components/healper";

export default function CreateAccountPage() {
  const router = useRouter();

  // ==========================================
  // STATES
  // ==========================================

  const [setupToken, setSetupToken] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [checkingToken, setCheckingToken] =
    useState(true);

  // ==========================================
  // GET SETUP TOKEN
  // ==========================================

  useEffect(() => {
    try {
      const token = sessionStorage.getItem(
        "doctorSetupToken"
      );

      

      // Token nahi mila
      if (!token || token === "undefined" || token === "null") {
        notify(
          "Setup session expired. Please verify OTP again.",
          "error"
        );

        router.replace("/doctor/register");

        return;
      }

      // Token mil gaya
      setSetupToken(token);

      setCheckingToken(false);
    } catch (error) {
      console.error(
        "Setup token error:",
        error
      );

      notify(
        "Unable to access setup session.",
        "error"
      );

      router.replace("/doctor/register");
    }
  }, [router]);

  // ==========================================
  // PASSWORD RULES
  // ==========================================

  const passwordRules = {
    length: password.length >= 8,

    upper: /[A-Z]/.test(password),

    lower: /[a-z]/.test(password),

    number: /[0-9]/.test(password),

    special: /[^A-Za-z0-9]/.test(password),
  };

  const isPasswordValid =
    Object.values(passwordRules).every(Boolean);

  // ==========================================
  // HANDLE SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ==========================================
    // CHECK SETUP TOKEN
    // ==========================================

    if (
      !setupToken ||
      setupToken === "undefined" ||
      setupToken === "null"
    ) {
      notify(
        "Setup token is missing. Please verify OTP again.",
        "error"
      );

      router.replace("/doctor/register");

      return;
    }

    // ==========================================
    // CHECK PASSWORD
    // ==========================================

    if (!password) {
      notify(
        "Please enter your password",
        "error"
      );

      return;
    }

    // ==========================================
    // CHECK PASSWORD RULES
    // ==========================================

    if (!isPasswordValid) {
      notify(
        "Password must contain 8 characters, uppercase, lowercase, number and special character",
        "error"
      );

      return;
    }

    // ==========================================
    // CHECK CONFIRM PASSWORD
    // ==========================================

    if (!confirmPassword) {
      notify(
        "Please confirm your password",
        "error"
      );

      return;
    }

    // ==========================================
    // CHECK PASSWORD MATCH
    // ==========================================

    if (password !== confirmPassword) {
      notify(
        "Passwords do not match",
        "error"
      );

      return;
    }

    try {
      setLoading(true);

      // ==========================================
      // API PAYLOAD
      // ==========================================
      // Backend ko exactly ye 3 fields chahiye:
      //
      // setupToken
      // password
      // confirmPassword
      //
      // ==========================================

      const payload = {
        setupToken: setupToken,
        password: password,
        confirmPassword: confirmPassword,
      };

      console.log(
        "SET CREDENTIALS REQUEST:",
        {
          bodyKeys: Object.keys(payload),

          hasSetupToken:
            Boolean(payload.setupToken),

          hasPassword:
            Boolean(payload.password),

          hasConfirmPassword:
            Boolean(payload.confirmPassword),
        }
      );

      // ==========================================
      // CALL API
      // ==========================================

      const result =
        await setDoctorCredentials(payload);

      console.log(
        "SET CREDENTIALS RESPONSE:",
        result
      );

      // ==========================================
      // SUCCESS
      // ==========================================

      if (result?.success) {
        notify(
          result.message ||
            "Doctor account created successfully",
          "success"
        );

        // ========================================
        // REMOVE SETUP TOKEN
        // ========================================

        sessionStorage.removeItem(
          "doctorSetupToken"
        );

        // ========================================
        // REDIRECT TO LOGIN
        // ========================================

        setTimeout(() => {
          router.replace("/doctor/login");
        }, 1000);

        return;
      }

      // ==========================================
      // BACKEND ERROR
      // ==========================================

      notify(
        result?.message ||
          "Failed to create doctor account",
        "error"
      );
    } catch (error) {
      console.error(
        "Create doctor account error:",
        error
      );

      notify(
        error?.message ||
          error?.response?.data?.message ||
          "Failed to create doctor account",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // TOKEN CHECK LOADING
  // ==========================================

  if (checkingToken) {
    return (
      <main className="min-h-screen bg-[#f5f7f8] flex items-center justify-center px-4">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#d1fae5] border-t-[#059669]" />

          <p className="mt-4 text-sm text-[#66736b]">
            Preparing your account...
          </p>

        </div>

      </main>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <main className="min-h-screen bg-[#f5f7f8] flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-md">

        {/* ======================================
            LOGO / HEADER
        ====================================== */}

        <div className="text-center mb-7">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#064e3b] shadow-lg">

            <Stethoscope className="h-8 w-8 text-white" />

          </div>

          <h1 className="text-2xl font-bold text-[#17211b]">
            Create Your Account
          </h1>

          <p className="mt-2 text-sm text-[#66736b]">
            Set a secure password for your doctor account
          </p>

        </div>

        {/* ======================================
            CARD
        ====================================== */}

        <div className="rounded-2xl border border-[#e2e8e4] bg-white p-6 shadow-xl">

          {/* ====================================
              SECURITY BANNER
          ==================================== */}

          <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#6ee7b7] bg-[#ecfdf5] p-4">

            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#059669]" />

            <div>

              <p className="text-sm font-semibold text-[#064e3b]">
                Secure your account
              </p>

              <p className="mt-1 text-xs leading-5 text-[#46534b]">
                Create a strong password to protect
                your doctor account.
              </p>

            </div>

          </div>

          {/* ====================================
              FORM
          ==================================== */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* ==================================
                CREATE PASSWORD
            ================================== */}

            <div>

              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-[#17211b]"
              >
                Create Password
              </label>

              <div className="relative">

                <LockKeyhole
                  className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94a19a]"
                />

                <input
                  id="password"
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
                  disabled={loading}
                  autoComplete="new-password"
                  className="h-12 w-full rounded-xl border border-[#e2e8e4] bg-white pl-10 pr-12 text-sm text-[#17211b] outline-none transition focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/10 disabled:bg-[#f1f5f3]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#66736b] hover:text-[#059669]"
                  tabIndex={-1}
                >

                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}

                </button>

              </div>

              {/* ==================================
                  PASSWORD RULES
              ================================== */}

               

            </div>

           {/* ==================================
                CONFIRM PASSWORD
            ================================== */}

            <div>

              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-[#17211b]"
              >
                Confirm Password
              </label>

              <div className="relative">

                <LockKeyhole
                  className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94a19a]"
                />

                <input
                  id="confirmPassword"
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
                  placeholder="Confirm your password"
                  disabled={loading}
                  autoComplete="new-password"
                  className={`h-12 w-full rounded-xl border bg-white pl-10 pr-12 text-sm text-[#17211b] outline-none transition focus:ring-2 disabled:bg-[#f1f5f3] ${
                    confirmPassword &&
                    password !== confirmPassword
                      ? "border-red-400 focus:border-red-400 focus:ring-red-400/10"
                      : "border-[#e2e8e4] focus:border-[#059669] focus:ring-[#059669]/10"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#66736b] hover:text-[#059669]"
                  tabIndex={-1}
                >

                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}

                </button>

              </div>

              {/* ==================================
                  PASSWORD ERROR
              ================================== */}

              {confirmPassword &&
                password !== confirmPassword && (
                  <p className="mt-2 text-xs text-red-500">
                    Passwords do not match
                  </p>
                )}

              {/* ==================================
                  PASSWORD MATCH
              ================================== */}

              {confirmPassword &&
                password === confirmPassword && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-[#059669]">

                    <CheckCircle2 className="h-4 w-4" />

                    Passwords match

                  </p>
                )}

            </div>

            {/* ==================================
                SUBMIT BUTTON
            ================================== */}

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-[#059669] text-sm font-semibold text-white shadow-md transition hover:bg-[#047857] disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (
                <div className="flex items-center gap-2">

                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />

                  Creating Account...

                </div>
              ) : (
                "Create Doctor Account"
              )}

            </button>

          </form>

          {/* ======================================
              FOOTER
          ====================================== */}

          <div className="mt-6 flex items-center justify-center gap-2 border-t border-[#edf1ee] pt-5">

            <ShieldCheck className="h-4 w-4 text-[#059669]" />

            <p className="text-xs text-[#66736b]">
              Your account information is securely protected
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}

// ==========================================
// PASSWORD RULE COMPONENT
// ==========================================

function PasswordRule({ valid, text }) {
  return (
    <div className="flex items-center gap-2">

      <CheckCircle2
        className={`h-4 w-4 ${
          valid
            ? "text-[#059669]"
            : "text-[#cbd5cf]"
        }`}
      />

      <span
        className={`text-xs ${
          valid
            ? "text-[#059669]"
            : "text-[#66736b]"
        }`}
      >
        {text}
      </span>

    </div>
  );
}