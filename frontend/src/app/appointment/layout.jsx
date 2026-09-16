"use client";

import { usePathname } from "next/navigation";

import PatientHeader from "@/components/pateient/header";

export default function PatientLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">

      {/* =====================================================
          PATIENT HEADER
      ====================================================== */}

      <PatientHeader />

      {/* =====================================================
          PAGE CONTENT
      ====================================================== */}

      <main className="min-h-[calc(100vh-64px)] w-full pt-16">
        {children}
      </main>

    </div>
  );
}