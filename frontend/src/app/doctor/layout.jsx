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
  ];

  // =====================================================
  // CHECK WHETHER CURRENT PAGE IS PUBLIC
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
    // ---------------------------------------------------
    // Public page hai to authentication check nahi karna
    // ---------------------------------------------------
    if (isPublicPage) {
      setCheckingAuth(false);
      return;
    }

    let mounted = true;

    const checkDoctorAuth = async () => {
      try {
        console.log("Checking doctor authentication...");

        const response = await client.get("auth/doctor/me");

        console.log(
          "DOCTOR AUTH RESPONSE:",
          response.data
        );

        if (!mounted) return;

        if (!response.data?.success) {
          router.replace("/doctor/login");
          return;
        }

        setDoctor(response.data.doctor);
        setCheckingAuth(false);
      } catch (error) {
        console.error(
          "DOCTOR AUTH ERROR:",
          error
        );

        if (!mounted) return;

        setDoctor(null);
        setCheckingAuth(false);

        router.replace("/doctor/login");
      }
    };

    checkDoctorAuth();

    return () => {
      mounted = false;
    };
  }, [pathname, isPublicPage, router]);

  // =====================================================
  // PUBLIC PAGE
  // =====================================================
  if (isPublicPage) {
    return <>{children}</>;
  }

  // =====================================================
  // AUTH CHECK LOADING
  // =====================================================
  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="text-sm font-medium text-slate-500">
            Checking doctor authentication...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // PROTECTED DOCTOR PORTAL
  // =====================================================
  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* ================================================
          SIDEBAR
      ================================================= */}
      <DoctorSidebar doctor={doctor} />

      {/* ================================================
          MAIN AREA
      ================================================= */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* ==============================================
            HEADER
        =============================================== */}
        <DoctorHeader doctor={doctor} />

        {/* ==============================================
            PAGE CONTENT
        =============================================== */}
        <main className="flex-1">
          {children}
        </main>

      </div>
    </div>
  );
}