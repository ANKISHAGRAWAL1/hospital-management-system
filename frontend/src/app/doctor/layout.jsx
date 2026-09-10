"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DoctorSidebar from "@/components/doctor/DoctorSidebar";
import DoctorHeader from "@/components/doctor/DoctorHeader";
import { client } from "@/app/components/healper";

export default function DoctorLayout({ children }) {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    let mounted = true;

    const checkAuthentication = async () => {
      try {
        const response = await client.get("auth/doctor/me");

        const data = response.data;

        if (!data?.success || data?.user?.role !== "doctor") {
          router.replace("/doctor/login");
          return;
        }

        if (mounted) {
          setDoctor(data.user);
          setCheckingAuth(false);
        }
      } catch {
        if (mounted) {
          router.replace("/doctor/login");
        }
      }
    };

    checkAuthentication();

    return () => {
      mounted = false;
    };
  }, [router]);

  // ==========================================
  // AUTH CHECKING
  // ==========================================
  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="text-sm font-medium text-slate-600">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PROTECTED DOCTOR PORTAL
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* ==========================================
          SIDEBAR
      ========================================== */}
      <DoctorSidebar doctor={doctor} />

      {/* ==========================================
          HEADER
      ========================================== */}
      <DoctorHeader doctor={doctor} />

      {/* ==========================================
          MAIN CONTENT
      ========================================== */}
      <main className="ml-64 min-h-screen bg-slate-50 pt-16">
        <div className="min-h-[calc(100vh-64px)] p-6">
          {children}
        </div>
      </main>

    </div>
  );
}