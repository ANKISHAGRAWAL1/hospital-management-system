"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  LayoutDashboard,
  CalendarPlus,
  CalendarDays,
  UserRound,
  Pill,
  FileText,
  Bell,
  LogOut,
  X,
  ChevronRight,
} from "lucide-react";

import PatientHeader from "@/components/pateient/header";

export default function PatientLayout({ children }) {
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =========================================================
  // BOOK APPOINTMENT PAGE
  // HEADER ONLY — NO SIDEBAR
  // =========================================================

  const isBookAppointmentPage =
    pathname === "/patient/book-appointment";

  // =========================================================
  // PATIENT NAVIGATION
  // =========================================================

  const navItems = [
    {
      label: "Dashboard",
      href: "/patient/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Book Appointment",
      href: "/patient/book-appointment",
      icon: CalendarPlus,
    },
    {
      label: "My Appointments",
      href: "/patient/appointments",
      icon: CalendarDays,
    },
    {
      label: "Find Doctors",
      href: "/patient/doctors",
      icon: UserRound,
    },
    {
      label: "Prescriptions",
      href: "/patient/prescriptions",
      icon: Pill,
    },
    {
      label: "Medical Reports",
      href: "/patient/medical-reports",
      icon: FileText,
    },
    {
      label: "My Profile",
      href: "/patient/profile",
      icon: UserRound,
    },
    {
      label: "Notifications",
      href: "/patient/notifications",
      icon: Bell,
      badge: 3,
    },
  ];

  // =========================================================
  // ACTIVE NAVIGATION
  // =========================================================

  const isActive = (href) => {
    if (href === "/patient/dashboard") {
      return pathname === "/patient/dashboard";
    }

    return pathname.startsWith(href);
  };

  // =========================================================
  // BOOK APPOINTMENT PAGE
  // HEADER ONLY
  // =========================================================

  if (isBookAppointmentPage) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900">

        {/* PATIENT HEADER */}

        <PatientHeader />

        {/* PAGE CONTENT */}

        <main className="min-h-[calc(100vh-64px)] pt-16">
          {children}
        </main>

      </div>
    );
  }

  // =========================================================
  // NORMAL PATIENT PORTAL
  // SIDEBAR + HEADER
  // =========================================================

  return (
    <div className="min-h-screen bg-black text-white">

      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-64
          flex-col
          border-r
          border-white/10
          bg-[#050505]
          transition-transform
          duration-300
          lg:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* ===================================================
            SIDEBAR HEADER
        =================================================== */}

        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">

          <Link
            href="/patient/dashboard"
            className="flex items-center gap-3"
          >

            {/* LOGO */}

            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">

              <img
                src="/logo/yash-hospital-logo.png"
                alt="Yash Hospital"
                className="h-9 w-9 object-contain"
              />

            </div>

            {/* HOSPITAL NAME */}

            <div>

              <h1 className="text-sm font-bold text-white">
                Yash Hospital
              </h1>

              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                Patient Portal
              </p>

            </div>

          </Link>

          {/* MOBILE CLOSE */}

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>

        </div>

        {/* ===================================================
            PATIENT PROFILE
        =================================================== */}

        <div className="border-b border-white/10 px-5 py-5">

          <div className="flex items-center gap-3">

            {/* AVATAR */}

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#075db5] text-sm font-semibold text-white">
              AG
            </div>

            {/* PATIENT DETAILS */}

            <div className="min-w-0">

              <p className="truncate text-sm font-semibold text-white">
                Ankish Gupta
              </p>

              <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500">
                PAT-10024
              </p>

            </div>

          </div>

        </div>

        {/* ===================================================
            NAVIGATION
        =================================================== */}

        <nav className="flex-1 overflow-y-auto px-4 py-5">

          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-600">
            Patient Menu
          </p>

          <div className="space-y-1">

            {navItems.map((item) => {

              const Icon = item.icon;

              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    group
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-sm
                    font-medium
                    transition
                    ${
                      active
                        ? "bg-[#075db5] text-white shadow-lg shadow-blue-900/20"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >

                  {/* ICON */}

                  <Icon
                    size={19}
                    strokeWidth={2}
                    className={`
                      shrink-0
                      ${
                        active
                          ? "text-white"
                          : "text-gray-500 group-hover:text-white"
                      }
                    `}
                  />

                  {/* LABEL */}

                  <span className="flex-1">
                    {item.label}
                  </span>

                  {/* BADGE */}

                  {item.badge && (
                    <span
                      className={`
                        flex
                        h-5
                        min-w-5
                        items-center
                        justify-center
                        rounded-full
                        px-1.5
                        text-[10px]
                        font-bold
                        ${
                          active
                            ? "bg-white text-[#075db5]"
                            : "bg-red-500 text-white"
                        }
                      `}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* ACTIVE ARROW */}

                  {active && (
                    <ChevronRight size={15} />
                  )}

                </Link>
              );
            })}

          </div>

        </nav>

        {/* ===================================================
            LOGOUT
        =================================================== */}

        <div className="border-t border-white/10 p-4">

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
          >

            <LogOut size={19} />

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="min-h-screen lg:ml-64">

        {/* HEADER */}

        <PatientHeader />

        {/* CONTENT */}

        <main className="min-h-[calc(100vh-64px)] pt-16">
          {children}
        </main>

      </div>

    </div>
  );
}