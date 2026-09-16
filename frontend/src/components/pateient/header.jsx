"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Search,
  CircleHelp,
  Bell,
  LogIn,
  UserRound,
  ChevronDown,
  LogOut,
} from "lucide-react";

import PatientLoginModal from "./PatientLoginModal";
import { client } from "@/app/components/healper";

export default function PatientHeader() {
  const [loginOpen, setLoginOpen] = useState(false);

  const [patient, setPatient] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  // =====================================================
  // CHECK PATIENT LOGIN
  // =====================================================

  useEffect(() => {
    const checkPatientAuth = async () => {
      try {
        const response = await client.get(
          "auth/patient/me"
        );

        if (
          response?.data?.success &&
          response?.data?.patient
        ) {
          setPatient(response.data.patient);
        } else {
          setPatient(null);
        }
      } catch (error) {
        console.log(
          "PATIENT HEADER AUTH CHECK:",
          error?.response?.data?.message ||
            "Patient is not logged in"
        );

        setPatient(null);
      } finally {
        setAuthChecked(true);
      }
    };

    checkPatientAuth();
  }, []);

  // =====================================================
  // LOGIN SUCCESS
  // =====================================================

  const handleLoginSuccess = (loggedInPatient) => {
    console.log(
      "✅ PATIENT HEADER LOGIN SUCCESS:",
      loggedInPatient
    );

    setPatient(loggedInPatient || null);
    setLoginOpen(false);
    setProfileMenuOpen(false);
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    if (logoutLoading) {
      return;
    }

    try {
      setLogoutLoading(true);

      const response = await client.post(
        "auth/patient/logout"
      );

      console.log(
        "PATIENT LOGOUT:",
        response.data
      );

      setPatient(null);
      setProfileMenuOpen(false);

      if (typeof window !== "undefined") {
        sessionStorage.removeItem(
          "appointmentPatient"
        );

        sessionStorage.removeItem(
          "appointmentPatientType"
        );

        sessionStorage.removeItem(
          "patientSignupToken"
        );

        sessionStorage.removeItem(
          "signupToken"
        );
      }
    } catch (error) {
      console.error(
        "PATIENT LOGOUT ERROR:",
        error
      );

      // Even if backend logout fails,
      // clear frontend patient state.
      setPatient(null);
      setProfileMenuOpen(false);
    } finally {
      setLogoutLoading(false);
    }
  };

  // =====================================================
  // PATIENT INITIAL
  // =====================================================

  const getPatientInitial = () => {
    if (!patient?.name) {
      return "P";
    }

    return patient.name
      .trim()
      .charAt(0)
      .toUpperCase();
  };

  return (
    <>
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-slate-200 bg-white shadow-sm">
        <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            href="/patient/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white">
              <img
                src="/logo/yash-hospital-logo.png"
                alt="Yash Hospital"
                className="h-9 w-9 object-contain"
              />
            </div>

            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-slate-900">
                Yash Hospital
              </h1>

              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Patient Portal
              </p>
            </div>
          </Link>

          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="hidden max-w-xl flex-1 px-8 md:block">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search doctors, departments..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#075db5] focus:bg-white"
              />
            </div>
          </div>

          {/* =================================================
              RIGHT ACTIONS
          ================================================= */}

          <div className="flex items-center gap-2 sm:gap-3">

            {/* =================================================
                HELP
            ================================================= */}

            <button
              type="button"
              aria-label="Help"
              className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-[#075db5] sm:flex"
            >
              <CircleHelp size={20} />
            </button>

            {/* =================================================
                NOTIFICATION
            ================================================= */}

            <button
              type="button"
              aria-label="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-[#075db5]"
            >
              <Bell size={20} />

              {patient && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>

            {/* =================================================
                AUTH AREA
            ================================================= */}

            {!authChecked ? (
              <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-100" />
            ) : patient ? (
              /* =================================================
                 LOGGED IN PATIENT
              ================================================= */

              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setProfileMenuOpen(
                      (prev) => !prev
                    )
                  }
                  className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 transition hover:border-blue-200 hover:bg-blue-50"
                >
                  {/* AVATAR */}

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#075db5] text-xs font-bold text-white">
                    {getPatientInitial()}
                  </div>

                  {/* NAME */}

                  <div className="hidden max-w-[130px] text-left sm:block">
                    <p className="truncate text-xs font-bold text-slate-800">
                      {patient.name || "Patient"}
                    </p>

                    <p className="text-[10px] text-slate-400">
                      Patient
                    </p>
                  </div>

                  <ChevronDown
                    size={15}
                    className={`hidden text-slate-400 transition sm:block ${
                      profileMenuOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {/* =================================================
                    PROFILE DROPDOWN
                ================================================= */}

                {profileMenuOpen && (
                  <div className="absolute right-0 top-12 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

                    {/* PATIENT INFO */}

                    <div className="border-b border-slate-100 bg-slate-50 px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#075db5] text-sm font-bold text-white">
                          {getPatientInitial()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900">
                            {patient.name ||
                              "Patient"}
                          </p>

                          {patient.email && (
                            <p className="truncate text-xs text-slate-500">
                              {patient.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* PROFILE */}

                    <Link
                      href="/patient/profile"
                      onClick={() =>
                        setProfileMenuOpen(
                          false
                        )
                      }
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      <UserRound
                        size={17}
                        className="text-slate-400"
                      />

                      My Profile
                    </Link>

                    {/* LOGOUT */}

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={logoutLoading}
                      className="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <LogOut size={17} />

                      {logoutLoading
                        ? "Logging out..."
                        : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* =================================================
                 NOT LOGGED IN
              ================================================= */

              <button
                type="button"
                onClick={() => setLoginOpen(true)}
                className="flex h-10 items-center gap-2 rounded-xl bg-[#075db5] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#064d96]"
              >
                <LogIn size={18} />

                <span className="hidden sm:inline">
                  Login
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* =====================================================
          LOGIN MODAL
      ===================================================== */}

      <PatientLoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}