"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LockKeyhole,
  ArrowLeft,
  ShieldCheck,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  UserRound,
   Mail,
} from "lucide-react";
import { toast } from "react-toastify";

import { setDoctorCredentials } from "@/app/components/utils/Api-call/doctor-auth-api";

export default function DoctorCreatePasswordPage() {
  const router = useRouter();

  // ==========================================
  // STATES
  // ==========================================
  const [setupToken, setSetupToken] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [createdUsername, setCreatedUsername] =
    useState("");

  const [success, setSuccess] = useState(false);

  // ==========================================
  // GET SETUP TOKEN
  // ==========================================
  useEffect(() => {
    const token =
      sessionStorage.getItem("doctorSetupToken");

    const storedEmail =
      sessionStorage.getItem("doctorOtpEmail");

    if (!token) {
      toast.error(
        "Your verification session has expired. Please verify your email again."
      );

      router.replace("/doctor/verify-email");

      return;
    }

    setSetupToken(token);

    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, [router]);

  // ==========================================
  // PASSWORD REQUIREMENTS
  // ==========================================
  const passwordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const isPasswordValid =
    passwordRequirements.length &&
    passwordRequirements.uppercase &&
    passwordRequirements.lowercase &&
    passwordRequirements.number;

  const passwordsMatch =
    password.length > 0 &&
    password === confirmPassword;

  // ==========================================
  // CREATE PASSWORD
  // ==========================================
  const handleCreatePassword = async (e) => {
    e.preventDefault();

    // ========================================
    // TOKEN CHECK
    // ========================================
    if (!setupToken) {
      toast.error(
        "Verification session expired. Please start again."
      );

      router.replace("/doctor/verify-email");

      return;
    }

    // ========================================
    // PASSWORD REQUIRED
    // ========================================
    if (!password) {
      toast.error(
        "Please enter a new password"
      );

      return;
    }

    // ========================================
    // PASSWORD VALIDATION
    // ========================================
    if (!isPasswordValid) {
      toast.error(
        "Password does not meet the required security requirements"
      );

      return;
    }

    // ========================================
    // CONFIRM PASSWORD
    // ========================================
    if (!confirmPassword) {
      toast.error(
        "Please confirm your password"
      );

      return;
    }

    // ========================================
    // PASSWORD MATCH
    // ========================================
    if (password !== confirmPassword) {
      toast.error(
        "Passwords do not match"
      );

      return;
    }

    try {
      setLoading(true);

      const result = await setDoctorCredentials({
        setupToken,
        password,
        confirmPassword,
      });

      if (!result?.success) {
        toast.error(
          result?.message ||
            "Unable to create password"
        );

        return;
      }

      // ========================================
      // USERNAME FROM BACKEND
      // ========================================
      if (result?.username) {
        setCreatedUsername(
          result.username
        );
      }

      // ========================================
      // SUCCESS STATE
      // ========================================
      setSuccess(true);

      // Remove setup token because it
      // should not be reused
      sessionStorage.removeItem(
        "doctorSetupToken"
      );

      sessionStorage.removeItem(
        "doctorOtpEmail"
      );

      toast.success(
        "Password created successfully"
      );
    } catch (error) {
      console.error(
        "CREATE DOCTOR PASSWORD ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to create password"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GO TO LOGIN
  // ==========================================
  const handleGoToLogin = () => {
    router.push("/doctor/login");
  };

  // ==========================================
  // BACK
  // ==========================================
  const handleBack = () => {
    if (loading) return;

    router.push("/doctor/verify-otp");
  };

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
                    Create your
                    <br />
                    password.
                  </h1>

                  <p className="mt-5 max-w-sm text-base leading-7 text-blue-100">
                    Set a secure password for
                    your doctor account. Your
                    credentials will be used to
                    access the Yash Hospital
                    Doctor Portal.
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
                    Secure Account
                  </p>

                  <p className="text-xs text-blue-100">
                    Your password is securely encrypted.
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
              {!success && (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={loading}
                  className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  <ArrowLeft size={18} />

                  Back to Verification

                </button>
              )}

              {/* =================================
                  SUCCESS SCREEN
              ================================== */}
              {success ? (
                <div className="flex flex-1 flex-col justify-center">

                  {/* Success Icon */}
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">

                    <CheckCircle2
                      size={34}
                      className="text-green-600"
                    />

                  </div>

                  <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Account setup complete
                  </h1>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Your doctor account password has
                    been created successfully. You can
                    now sign in to the Yash Hospital
                    Doctor Portal.
                  </p>

                  {/* =================================
                      USERNAME CARD
                  ================================== */}
                  <div className="mt-7 rounded-2xl border border-blue-100 bg-blue-50 p-5">

                    <div className="flex items-start gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">

                        <UserRound
                          size={20}
                          className="text-blue-600"
                        />

                      </div>

                      <div className="min-w-0">

                        <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                          Your Doctor Username
                        </p>

                        <p className="mt-1 break-all text-lg font-bold text-slate-900">
                          {createdUsername ||
                            "Username generated"}
                        </p>

                        <p className="mt-1 text-xs text-blue-700">
                          Please remember this username
                          for your future login.
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* Login Button */}
                  <button
                    type="button"
                    onClick={handleGoToLogin}
                    className="mt-7 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                  >

                    Go to Doctor Login

                    <ArrowLeft
                      size={18}
                      className="rotate-180"
                    />

                  </button>

                  {/* Security Notice */}
                  <div className="mt-7 rounded-xl border border-blue-100 bg-blue-50 p-4">

                    <div className="flex gap-3">

                      <ShieldCheck
                        size={19}
                        className="mt-0.5 shrink-0 text-blue-600"
                      />

                      <div>

                        <p className="text-sm font-semibold text-blue-900">
                          Account security
                        </p>

                        <p className="mt-1 text-xs leading-5 text-blue-700">
                          Keep your username and password
                          confidential. Never share your
                          login credentials with anyone.
                        </p>

                      </div>

                    </div>

                  </div>

                </div>
              ) : (

                /* =================================
                    CREATE PASSWORD FORM
                ================================== */
                <>
                  {/* Heading */}
                  <div className="mb-8">

                    {/* Icon */}
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">

                      <LockKeyhole
                        size={24}
                        className="text-blue-600"
                      />

                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                      Create your password
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      Create a strong password to
                      secure your doctor account and
                      access the hospital portal.
                    </p>

                    {email && (
                      <div className="mt-4 flex items-center gap-2">

                        <MailIcon />

                        <span className="break-all text-sm font-semibold text-slate-700">
                          {email}
                        </span>

                      </div>
                    )}

                  </div>

                  {/* =================================
                      FORM
                  ================================== */}
                  <form
                    onSubmit={handleCreatePassword}
                    className="space-y-5"
                  >

                    {/* =================================
                        PASSWORD
                    ================================== */}
                    <div>

                      <label
                        htmlFor="doctor-password"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        New Password
                      </label>

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
                          autoComplete="new-password"
                          disabled={loading}
                          className="h-13 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-12 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(
                              !showPassword
                            )
                          }
                          disabled={loading}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-600"
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

                    {/* =================================
                        PASSWORD REQUIREMENTS
                    ================================== */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                      <p className="mb-3 text-xs font-semibold text-slate-700">
                        Password requirements
                      </p>

                      <div className="grid grid-cols-2 gap-2">

                        <PasswordRequirement
                          valid={
                            passwordRequirements.length
                          }
                          text="8+ characters"
                        />

                        <PasswordRequirement
                          valid={
                            passwordRequirements.uppercase
                          }
                          text="Uppercase letter"
                        />

                        <PasswordRequirement
                          valid={
                            passwordRequirements.lowercase
                          }
                          text="Lowercase letter"
                        />

                        <PasswordRequirement
                          valid={
                            passwordRequirements.number
                          }
                          text="One number"
                        />

                      </div>

                    </div>

                    {/* =================================
                        CONFIRM PASSWORD
                    ================================== */}
                    <div>

                      <label
                        htmlFor="doctor-confirm-password"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Confirm Password
                      </label>

                      <div className="relative">

                        <LockKeyhole
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          id="doctor-confirm-password"
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
                          placeholder="Re-enter your password"
                          autoComplete="new-password"
                          disabled={loading}
                          className={`h-13 w-full rounded-xl border bg-white pl-11 pr-12 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-50 ${
                            confirmPassword
                              ? passwordsMatch
                                ? "border-green-400 focus:border-green-500 focus:ring-green-50"
                                : "border-red-300 focus:border-red-400 focus:ring-red-50"
                              : "border-slate-300 focus:border-blue-500 focus:ring-blue-50"
                          }`}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(
                              !showConfirmPassword
                            )
                          }
                          disabled={loading}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-600"
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

                      {confirmPassword &&
                        !passwordsMatch && (
                          <p className="mt-2 text-xs font-medium text-red-500">
                            Passwords do not match.
                          </p>
                        )}

                      {confirmPassword &&
                        passwordsMatch && (
                          <p className="mt-2 flex items-center gap-1 text-xs font-medium text-green-600">
                            <CheckCircle2 size={14} />
                            Passwords match.
                          </p>
                        )}

                    </div>

                    {/* =================================
                        CREATE BUTTON
                    ================================== */}
                    <button
                      type="submit"
                      disabled={
                        loading ||
                        !isPasswordValid ||
                        !passwordsMatch
                      }
                      className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                    >

                      {loading ? (
                        <>
                          <Loader2
                            size={19}
                            className="animate-spin"
                          />

                          Creating Password...
                        </>
                      ) : (
                        <>
                          Create Password

                          <CheckCircle2
                            size={18}
                          />
                        </>
                      )}

                    </button>

                  </form>

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
                          Secure account setup
                        </p>

                        <p className="mt-1 text-xs leading-5 text-blue-700">
                          Your password is securely
                          encrypted and cannot be viewed
                          by hospital staff.
                        </p>

                      </div>

                    </div>

                  </div>
                </>
              )}

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

// ==============================================
// PASSWORD REQUIREMENT COMPONENT
// ==============================================
function PasswordRequirement({ valid, text }) {
  return (
    <div className="flex items-center gap-2">

      <div
        className={`flex h-4 w-4 items-center justify-center rounded-full ${
          valid
            ? "bg-green-500"
            : "bg-slate-300"
        }`}
      >
        {valid && (
          <CheckCircle2
            size={11}
            className="text-white"
          />
        )}
      </div>

      <span
        className={`text-xs ${
          valid
            ? "text-green-600"
            : "text-slate-500"
        }`}
      >
        {text}
      </span>

    </div>
  );
}

// ==============================================
// EMAIL ICON
// ==============================================
function MailIcon() {
  return (
    <Mail
      size={16}
      className="shrink-0 text-slate-400"
    />
  );
}