"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Sidebar from "@/app/admin/Components/Sidebar";
import Header from "@/app/admin/Components/Header";

import { getAdminMe } from "@/app/components/utils/Api-call/doctor-auth-api";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [admin, setAdmin] = useState(null);

  // =====================================================
  // PUBLIC ADMIN PAGES
  // =====================================================

  const publicPages = [
    "/admin/login",
    "/admin/doctor/login",
  ];

  // =====================================================
  // CHECK PUBLIC PAGE
  // =====================================================

  const isPublicPage = publicPages.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );

  // =====================================================
  // ADMIN AUTHENTICATION
  // =====================================================

  useEffect(() => {
    let mounted = true;

    // ---------------------------------------------------
    // PUBLIC PAGE
    // ---------------------------------------------------

    if (isPublicPage) {
      setCheckingAuth(false);
      setAdmin(null);

      return () => {
        mounted = false;
      };
    }

    // ---------------------------------------------------
    // PROTECTED ADMIN PAGE
    // ---------------------------------------------------

    const checkAdminAuth = async () => {
      try {
        setCheckingAuth(true);

        console.log(
          "========== CHECKING ADMIN AUTH =========="
        );

        const response = await getAdminMe();

        console.log(
          "ADMIN AUTH RESPONSE:",
          response
        );

        if (!mounted) return;

        // ------------------------------------------------
        // AUTH FAILED
        // ------------------------------------------------

        if (
          !response?.success ||
          !response?.admin
        ) {
          console.log(
            "Admin authentication failed"
          );

          setAdmin(null);
          setCheckingAuth(false);

          router.replace("/admin/login");

          return;
        }

        // ------------------------------------------------
        // ROLE CHECK
        // ------------------------------------------------

        if (
          response.admin.role !== "admin"
        ) {
          console.log(
            "Unauthorized admin access"
          );

          setAdmin(null);
          setCheckingAuth(false);

          router.replace("/admin/login");

          return;
        }

        // ------------------------------------------------
        // AUTH SUCCESS
        // ------------------------------------------------

        console.log(
          "Admin authenticated successfully"
        );

        setAdmin(response.admin);
        setCheckingAuth(false);

      } catch (error) {
        console.error(
          "ADMIN AUTH ERROR:",
          error
        );

        if (!mounted) return;

        setAdmin(null);
        setCheckingAuth(false);

        router.replace("/admin/login");
      }
    };

    checkAdminAuth();

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
  // AUTH CHECKING
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
            Checking authentication...
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Please wait
          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // PROTECTED ADMIN PORTAL
  // =====================================================

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#17211B]">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* =================================================
          MAIN AREA
      ================================================= */}

      <div
        className={`
          min-h-screen
          transition-all
          duration-300
          ${collapsed ? "ml-20" : "ml-64"}
        `}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <Header admin={admin} />

        {/* =================================================
            CONTENT
        ================================================= */}

        <main className="p-6">
          {children}
        </main>

      </div>
    </div>
  );
}