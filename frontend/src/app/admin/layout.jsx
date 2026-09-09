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

  useEffect(() => {
    // ==========================================
    // LOGIN PAGE
    // ==========================================
    if (pathname === "/admin/login") {
      setCheckingAuth(false);
      return;
    }

    // ==========================================
    // CHECK ADMIN AUTHENTICATION
    // ==========================================
    const checkAdminAuth = async () => {
      try {
        console.log("Checking admin authentication...");

        const response = await getAdminMe();

        console.log("ADMIN ME RESPONSE:", response);

        // ==========================================
        // AUTHENTICATION FAILED
        // ==========================================
        if (!response?.success) {
          throw new Error(
            response?.message || "Authentication failed"
          );
        }

        // ==========================================
        // ADMIN ROLE CHECK
        // ==========================================
        if (response?.admin?.role !== "admin") {
          throw new Error("Unauthorized access");
        }

        // ==========================================
        // ADMIN AUTHENTICATED
        // ==========================================
        console.log("Admin authenticated successfully");

        setCheckingAuth(false);
      } catch (error) {
        console.error(
          "Admin authentication error:",
          error
        );

        setCheckingAuth(false);

        // ==========================================
        // REDIRECT TO LOGIN
        // ==========================================
        router.replace("/admin/login");
      }
    };

    checkAdminAuth();
  }, [pathname, router]);

  // ==========================================
  // LOGIN PAGE
  // ==========================================
  if (pathname === "/admin/login") {
    return children;
  }

  // ==========================================
  // AUTH CHECK LOADING
  // ==========================================
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#f5f7f8] flex items-center justify-center">
        <div className="flex flex-col items-center">

          {/* Loader */}
          <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />

          {/* Loading Text */}
          <p className="mt-4 text-sm text-[#66736b]">
            Checking authentication...
          </p>

        </div>
      </div>
    );
  }

  // ==========================================
  // AUTHENTICATED ADMIN LAYOUT
  // ==========================================
  return (
    <div className="min-h-screen bg-[#f5f7f8] text-[#17211b]">

      {/* =====================================
          SIDEBAR
      ===================================== */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* =====================================
          MAIN CONTENT AREA
      ===================================== */}
      <div
        className={`
          min-h-screen
          transition-all
          duration-300
          ${collapsed ? "ml-20" : "ml-64"}
        `}
      >

        {/* ===================================
            HEADER
        =================================== */}
        <Header />

        {/* ===================================
            PAGE CONTENT
        =================================== */}
        <main className="p-6">
          {children}
        </main>

      </div>
    </div>
  );
}