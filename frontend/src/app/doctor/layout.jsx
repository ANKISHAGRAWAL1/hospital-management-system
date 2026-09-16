"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import DoctorSidebar from "@/components/doctor/DoctorSidebar";
import DoctorHeader from "@/components/doctor/DoctorHeader";
import { client } from "@/app/components/healper";

export default function DoctorLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [doctor, setDoctor] = useState(null);

  // =====================================================
  // PUBLIC DOCTOR PAGES
  // =====================================================

  const publicPrefixes = [
    "/doctor/login",
    "/doctor/verify-email",
    "/doctor/verify-otp",
    "/doctor/create-password",
    "/doctor/forgot-password",
    "/doctor/reset-password",
  ];

  // =====================================================
  // CHECK PUBLIC PAGE
  // =====================================================

  const isPublicPage = publicPrefixes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );

  // =====================================================
  // DOCTOR AUTHENTICATION
  // =====================================================

  useEffect(() => {
    let mounted = true;

    // ---------------------------------------------------
    // PUBLIC PAGE
    // Authentication ki zarurat nahi
    // ---------------------------------------------------

    if (isPublicPage) {
      setCheckingAuth(false);
      setDoctor(null);

      return () => {
        mounted = false;
      };
    }

    // ---------------------------------------------------
    // Protected page par authentication check
    // ---------------------------------------------------

    const checkDoctorAuth = async () => {
      try {
        setCheckingAuth(true);

        console.log(
          "Checking doctor authentication..."
        );

        const response = await client.get(
          "/auth/doctor/me"
        );

        console.log(
          "DOCTOR AUTH RESPONSE:",
          response.data
        );

        if (!mounted) return;

        // ------------------------------------------------
        // Backend authentication failed
        // ------------------------------------------------

        if (
          !response?.data?.success ||
          !response?.data?.doctor
        ) {
          setDoctor(null);

          router.replace("/doctor/login");

          return;
        }

        // ------------------------------------------------
        // Doctor authenticated
        // ------------------------------------------------

        setDoctor(response.data.doctor);
        setCheckingAuth(false);

      } catch (error) {
        console.error(
          "DOCTOR AUTH ERROR:",
          error
        );

        if (!mounted) return;

        setDoctor(null);

        // ------------------------------------------------
        // Token missing / invalid / expired
        // 401 / 403 / any auth failure
        // ------------------------------------------------

        router.replace("/doctor/login");

        // IMPORTANT:
        // checkingAuth ko false nahi karna.
        // Login page par redirect hone tak loading rahegi.
      }
    };

    checkDoctorAuth();

    return () => {
      mounted = false;
    };
  }, [pathname, isPublicPage, router]);

  // =====================================================
  // PUBLIC PAGES
  // =====================================================

  if (isPublicPage) {
    return <>{children}</>;
  }

  // =====================================================
  // AUTHENTICATION CHECKING
  // =====================================================

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center">

          <div className="relative h-11 w-11">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200" />

            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#0F766E]" />
          </div>

          <p className="mt-4 text-sm font-medium text-slate-600">
            Checking doctor authentication...
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Please wait
          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // IF DOCTOR IS NOT AUTHENTICATED
  // EXTRA SAFETY CHECK
  // =====================================================

  if (!doctor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center">

          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#0F766E]" />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Redirecting to login...
          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // PROTECTED DOCTOR PORTAL
  // =====================================================

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">

      {/* =================================================
          DOCTOR SIDEBAR
      ================================================= */}

      <DoctorSidebar doctor={doctor} />

      {/* =================================================
          MAIN CONTENT AREA
      ================================================= */}

      <div className="flex min-w-0 flex-1 flex-col">

        {/* =================================================
            DOCTOR HEADER
        ================================================= */}

        <DoctorHeader doctor={doctor} />

        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <main className="min-w-0 flex-1">
          {children}
        </main>

      </div>
    </div>
  );
}