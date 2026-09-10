"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  CalendarDays,
  Users,
  ClipboardList,
  Clock,
  UserRound,
  LogOut,
  ChevronRight,
} from "lucide-react";

export default function DoctorSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // ==========================================
  // DOCTOR MENU
  // ==========================================

  const menu = [
    {
      name: "Dashboard",
      href: "/doctor/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Appointments",
      href: "/doctor/appointments",
      icon: CalendarDays,
    },
    {
      name: "Patients",
      href: "/doctor/patients",
      icon: Users,
    },
    {
      name: "Consultation",
      href: "/doctor/consultation",
      icon: ClipboardList,
    },
    {
      name: "Schedule",
      href: "/doctor/schedule",
      icon: Clock,
    },
  ];

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    sessionStorage.removeItem("doctorSetupToken");
    sessionStorage.removeItem("doctorOtpEmail");

    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctor");

    router.push("/doctor/login");
  };

  // ==========================================
  // ACTIVE ROUTE
  // ==========================================

  const isActive = (href) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      {/* ======================================
          LOGO
      ====================================== */}

      <div className="flex h-20 shrink-0 items-center border-b border-slate-200 px-5">
        <Link
          href="/doctor/dashboard"
          className="flex items-center gap-3"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
            <img
              src="/logo/yash-hospital-logo.png"
              alt="Yash Hospital"
              className="h-11 w-11 object-contain"
            />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-base font-bold text-slate-900">
              Yash Hospital
            </h1>

            <p className="text-xs font-medium text-slate-500">
              Doctor Portal
            </p>
          </div>
        </Link>
      </div>

      {/* ======================================
          NAVIGATION
      ====================================== */}

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* SECTION TITLE */}

        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Main Menu
        </p>

        {/* MENU */}

        <nav className="space-y-1.5">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {/* ACTIVE INDICATOR */}

                {active && (
                  <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-blue-600" />
                )}

                {/* ICON */}

                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                    active
                      ? "bg-blue-100 text-blue-600"
                      : "bg-slate-50 text-slate-500 group-hover:bg-slate-100 group-hover:text-slate-700"
                  }`}
                >
                  <Icon size={18} strokeWidth={2} />
                </span>

                {/* NAME */}

                <span className="flex-1">{item.name}</span>

                {/* ARROW */}

                {active && (
                  <ChevronRight
                    size={16}
                    className="text-blue-500"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ======================================
            ACCOUNT
        ====================================== */}

        <div className="mt-8">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Account
          </p>

          <Link
            href="/doctor/profile"
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              isActive("/doctor/profile")
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                isActive("/doctor/profile")
                  ? "bg-blue-100 text-blue-600"
                  : "bg-slate-50 text-slate-500 group-hover:bg-slate-100"
              }`}
            >
              <UserRound size={18} />
            </span>

            <span className="flex-1">My Profile</span>

            {isActive("/doctor/profile") && (
              <ChevronRight
                size={16}
                className="text-blue-500"
              />
            )}
          </Link>
        </div>
      </div>

      {/* ======================================
          DOCTOR INFO
      ====================================== */}

      <div className="px-4 pb-3">
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
          <div className="flex items-center gap-3">
            {/* AVATAR */}

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              DR
            </div>

            {/* INFO */}

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                Doctor Portal
              </p>

              <p className="truncate text-xs text-slate-500">
                Medical Workspace
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================
          LOGOUT
      ====================================== */}

      <div className="shrink-0 border-t border-slate-200 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 transition group-hover:bg-red-100">
            <LogOut size={18} />
          </span>

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}