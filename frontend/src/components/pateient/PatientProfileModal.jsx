"use client";

import { useEffect, useState } from "react";
import {
  UserRound,
  CalendarDays,
  Phone,
  Mail,
  ShieldCheck,
  ArrowRight,
  Loader2,
  CheckCircle2,
  X,
} from "lucide-react";

import {
  completePatientProfile,
  createPatientDependent,
} from "@/app/components/utils/Api-call/patient/api/appointmentApi";

export default function PatientProfileModal({
  open,
  onClose,
  onComplete,
  signupToken = "",
  email = "",
  initialEmail = "",
  isAdditionalPatient = false,
}) {
  const [name, setName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [token, setToken] = useState(signupToken);

  // =========================================================
  // MODAL OPEN
  // =========================================================

  useEffect(() => {
    if (!open) return;

    setName("");
    setDateOfBirth("");
    setPhone("");
    setError("");
    setSuccess("");
    setLoading(false);

    // =======================================================
    // EMAIL
    // =======================================================

    const finalEmail =
      initialEmail?.trim() ||
      email?.trim() ||
      "";

    setPatientEmail(finalEmail);

    // =======================================================
    // SIGNUP TOKEN
    // =======================================================

    let finalToken = "";

    // Additional patient ke liye signup token nahi chahiye
    if (!isAdditionalPatient) {
      finalToken = signupToken;

      if (
        !finalToken &&
        typeof window !== "undefined"
      ) {
        finalToken =
          sessionStorage.getItem(
            "patientSignupToken"
          ) ||
          sessionStorage.getItem(
            "signupToken"
          ) ||
          "";
      }
    }

    setToken(finalToken);

    console.log(
      "PATIENT PROFILE MODAL OPEN"
    );

    console.log(
      "ADDITIONAL PATIENT:",
      isAdditionalPatient
    );

    console.log(
      "SIGNUP TOKEN:",
      finalToken
        ? "TOKEN_PRESENT"
        : "TOKEN_MISSING"
    );

    console.log(
      "EMAIL:",
      finalEmail
    );
  }, [
    open,
    signupToken,
    email,
    initialEmail,
    isAdditionalPatient,
  ]);

  // =========================================================
  // PHONE CHANGE
  // =========================================================

  const handlePhoneChange = (value) => {
    const numbersOnly = value
      .replace(/\D/g, "")
      .slice(0, 10);

    setPhone(numbersOnly);
  };

  // =========================================================
  // EMAIL CHANGE
  // =========================================================

  const handleEmailChange = (value) => {
    setPatientEmail(value);
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const cleanName = name.trim();

    const cleanEmail =
      patientEmail
        .trim()
        .toLowerCase();

    const cleanPhone =
      phone.trim();

    // =======================================================
    // NAME VALIDATION
    // =======================================================

    if (!cleanName) {
      setError(
        "Please enter patient name."
      );
      return;
    }

    if (cleanName.length < 2) {
      setError(
        "Patient name must be at least 2 characters."
      );
      return;
    }

    // =======================================================
    // EMAIL VALIDATION
    // =======================================================

    if (!cleanEmail) {
      setError(
        "Please enter email address."
      );
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    // =======================================================
    // DOB VALIDATION
    // =======================================================

    if (!dateOfBirth) {
      setError(
        "Please select date of birth."
      );
      return;
    }

    const dob =
      new Date(dateOfBirth);

    const today =
      new Date();

    dob.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (dob > today) {
      setError(
        "Date of birth cannot be in the future."
      );
      return;
    }

    // =======================================================
    // PHONE VALIDATION
    // =======================================================

    if (!cleanPhone) {
      setError(
        "Please enter phone number."
      );
      return;
    }

    if (cleanPhone.length !== 10) {
      setError(
        "Phone number must be exactly 10 digits."
      );
      return;
    }

    // =======================================================
    // SUBMIT
    // =======================================================

    try {
      setLoading(true);

      const profileData = {
        signupToken:
          isAdditionalPatient
            ? ""
            : token || "",

        name: cleanName,

        email: cleanEmail,

        dateOfBirth,

        phone: cleanPhone,
      };

      console.log(
        "PATIENT PROFILE SUBMIT"
      );

      console.log({
        type: isAdditionalPatient
          ? "ADDITIONAL_PATIENT"
          : "FIRST_TIME_PATIENT",
        name: cleanName,
        email: cleanEmail,
      });

      // =====================================================
      // IMPORTANT
      // =====================================================
      // First-time patient:
      // completePatientProfile()
      //
      // Add New Patient:
      // createPatientDependent()

      const response =
        isAdditionalPatient
          ? await createPatientDependent(
              profileData
            )
          : await completePatientProfile(
              profileData
            );

      console.log(
        "PATIENT PROFILE RESPONSE:",
        response
      );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Failed to save patient profile."
        );
      }

      const patient =
        response?.patient;

      if (!patient) {
        throw new Error(
          "Patient was saved but patient data was not returned."
        );
      }

      // =====================================================
      // SAVE PATIENT
      // =====================================================

      if (
        typeof window !== "undefined"
      ) {
        sessionStorage.setItem(
          "appointmentPatient",
          JSON.stringify(patient)
        );

        // Signup token sirf first-time signup ke liye tha
        if (!isAdditionalPatient) {
          sessionStorage.removeItem(
            "patientSignupToken"
          );

          sessionStorage.removeItem(
            "signupToken"
          );
        }
      }

      setSuccess(
        isAdditionalPatient
          ? "New patient added successfully."
          : "Patient profile completed successfully."
      );

      // =====================================================
      // CONTINUE
      // =====================================================

      setTimeout(() => {
        onComplete?.(patient);
      }, 500);
    } catch (err) {
      console.error(
        "PATIENT PROFILE ERROR:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // CLOSE
  // =========================================================

  const handleClose = () => {
    if (loading) return;

    setError("");
    setSuccess("");

    onClose?.();
  };

  // =========================================================
  // RENDER
  // =========================================================

  if (!open) return null;

  const isSignupProfile =
    !isAdditionalPatient &&
    Boolean(token);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 py-6">

      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-5 text-white">

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="absolute right-4 top-4 rounded-full p-2 text-white/90 transition hover:bg-white/10 disabled:cursor-not-allowed"
          >
            <X size={22} />
          </button>

          <div className="flex items-center gap-3 pr-10">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
              <UserRound size={26} />
            </div>

            <div>

              <h2 className="text-xl font-bold">
                {isSignupProfile
                  ? "Complete Your Profile"
                  : "Add New Patient"}
              </h2>

              <p className="mt-1 text-sm text-blue-50">
                {isSignupProfile
                  ? "Enter your details to continue"
                  : "Enter patient details to continue"}
              </p>

            </div>

          </div>

        </div>

        {/* ===================================================
            FORM
        ==================================================== */}

        <form
          onSubmit={handleSubmit}
          className="max-h-[calc(100vh-120px)] overflow-y-auto p-6"
        >

          {/* EMAIL */}

          <div className="mb-5">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email Address
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <div className="flex items-center gap-3 rounded-full border border-slate-200 px-5 py-3.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">

              <Mail
                size={19}
                className="shrink-0 text-slate-400"
              />

              <input
                type="email"
                value={patientEmail}
                onChange={(e) =>
                  handleEmailChange(
                    e.target.value
                  )
                }
                placeholder="Enter email address"
                readOnly={
                  isSignupProfile
                }
                disabled={loading}
                className={`w-full bg-transparent text-base outline-none ${
                  isSignupProfile
                    ? "cursor-not-allowed text-slate-500"
                    : "text-slate-900"
                }`}
              />

            </div>

            {isSignupProfile && (
              <p className="mt-2 px-2 text-xs text-slate-400">
                This email was verified using OTP.
              </p>
            )}

          </div>

          {/* NAME */}

          <div className="mb-5">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Patient Name
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <div className="flex items-center gap-3 rounded-full border border-slate-200 px-5 py-3.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">

              <UserRound
                size={19}
                className="text-slate-400"
              />

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter full name"
                disabled={loading}
                className="w-full bg-transparent text-base outline-none"
              />

            </div>

          </div>

          {/* DOB */}

          <div className="mb-5">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Date of Birth
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <div className="flex items-center gap-3 rounded-full border border-slate-200 px-5 py-3.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">

              <CalendarDays
                size={19}
                className="text-slate-400"
              />

              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) =>
                  setDateOfBirth(
                    e.target.value
                  )
                }
                max={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                disabled={loading}
                className="w-full bg-transparent text-base outline-none"
              />

            </div>

          </div>

          {/* PHONE */}

          <div className="mb-5">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Phone Number
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <div className="flex items-center gap-3 rounded-full border border-slate-200 px-5 py-3.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">

              <Phone
                size={19}
                className="text-slate-400"
              />

              <span className="text-sm text-slate-400">
                +91
              </span>

              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  handlePhoneChange(
                    e.target.value
                  )
                }
                placeholder="10 digit mobile number"
                inputMode="numeric"
                maxLength={10}
                disabled={loading}
                className="w-full bg-transparent text-base outline-none"
              />

            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-5 rounded-full border border-red-200 bg-red-50 px-5 py-3.5 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">

              <CheckCircle2 size={19} />

              {success}

            </div>
          )}

          {/* SECURITY */}

          <div className="mb-6 rounded-2xl bg-blue-50 p-5">

            <div className="flex gap-3">

              <ShieldCheck
                size={21}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <div>

                <p className="text-sm font-semibold text-blue-800">
                  Your information is secure
                </p>

                <p className="mt-1 text-xs leading-5 text-blue-700">
                  Your personal information is securely
                  stored and used only for hospital
                  appointment and patient management
                  purposes.
                </p>

              </div>

            </div>

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {loading ? (
              <>
                <Loader2
                  size={19}
                  className="animate-spin"
                />

                Saving...
              </>
            ) : (
              <>
                {isAdditionalPatient
                  ? "Add Patient"
                  : "Continue to Appointment"}

                <ArrowRight size={19} />
              </>
            )}

          </button>

        </form>

      </div>

    </div>
  );
}