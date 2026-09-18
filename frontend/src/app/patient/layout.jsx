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
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import PatientHeader from "@/components/pateient/header";

export default function PatientLayout({ children }) {
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isBookAppointmentPage =
    pathname === "/patient/book-appointment";

  const navItems = [
    {
      label: "Dashboard",
      href: "/patient",
      icon: LayoutDashboard,
    },
    {
      label: "Book Appointment",
      href: "/contappointment",
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

  const isActive = (href) => {
    if (href === "/patient/dashboard") {
      return pathname === "/patient/dashboard";
    }

    return pathname.startsWith(href);
  };

  if (isBookAppointmentPage) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900">
        <PatientHeader />

        <main className="min-h-[calc(100vh-64px)] bg-[#f8fafc] pt-16">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[2px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-slate-200 bg-white shadow-[4px_0_24px_rgba(15,23,42,0.05)] transition-all duration-300 ease-in-out lg:translate-x-0 ${
          sidebarCollapsed ? "w-[76px]" : "w-64"
        } ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div
          className={`flex h-20 shrink-0 items-center border-b border-slate-200 transition-all duration-300 ${
            sidebarCollapsed
              ? "justify-center px-3"
              : "justify-between px-5"
          }`}
        >
          <Link
            href="/patient/dashboard"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <img
                src="/logo/yash-hospital-logo.png"
                alt="Yash Hospital"
                className="h-9 w-9 object-contain"
              />
            </div>

            {!sidebarCollapsed && (
              <div className="min-w-0">
                <h1 className="truncate text-sm font-bold tracking-tight text-slate-900">
                  Yash Hospital
                </h1>

                <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Patient Portal
                </p>
              </div>
            )}
          </Link>

          {!sidebarCollapsed && (
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
              aria-label="Close menu"
            >
              <X size={19} />
            </button>
          )}
        </div>

        <div
          className={`shrink-0 border-b border-slate-200 py-5 transition-all duration-300 ${
            sidebarCollapsed
              ? "flex justify-center px-2"
              : "px-5"
          }`}
        >
          <div
            className={`flex items-center ${
              sidebarCollapsed
                ? "justify-center"
                : "gap-3"
            }`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-[#075db5] ring-1 ring-blue-100">
              AG
            </div>

            {!sidebarCollapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  Ankish Gupta
                </p>

                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400">
                  PAT-10024
                </p>
              </div>
            )}
          </div>
        </div>

        <nav
          className={`flex-1 overflow-y-auto py-5 ${
            sidebarCollapsed
              ? "px-2"
              : "px-3"
          }`}
        >
          {!sidebarCollapsed && (
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Patient Menu
            </p>
          )}

          <div className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <div
                  key={item.href}
                  className="relative"
                >
                  <Link
                    href={item.href}
                    onClick={() =>
                      setSidebarOpen(false)
                    }
                    title={
                      sidebarCollapsed
                        ? item.label
                        : undefined
                    }
                    className={`group flex min-h-[44px] items-center rounded-xl text-sm font-medium transition-all duration-200 ${
                      sidebarCollapsed
                        ? "justify-center px-0"
                        : "gap-3 px-3"
                    } ${
                      active
                        ? "bg-[#075db5] text-white shadow-md shadow-blue-100"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon
                      size={19}
                      strokeWidth={
                        active ? 2.2 : 1.9
                      }
                      className={`shrink-0 transition-colors ${
                        active
                          ? "text-white"
                          : "text-slate-400 group-hover:text-[#075db5]"
                      }`}
                    />

                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 truncate">
                          {item.label}
                        </span>

                        {item.badge && (
                          <span
                            className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                              active
                                ? "bg-white text-[#075db5]"
                                : "bg-red-50 text-red-500"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}

                        {active && (
                          <ChevronRight
                            size={15}
                            strokeWidth={2.2}
                          />
                        )}
                      </>
                    )}

                    {sidebarCollapsed &&
                      item.badge && (
                        <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                      )}
                  </Link>
                </div>
              );
            })}
          </div>
        </nav>

        <div
          className={`shrink-0 border-t border-slate-200 p-3 ${
            sidebarCollapsed
              ? "flex justify-center"
              : ""
          }`}
        >
          <button
            type="button"
            title={
              sidebarCollapsed
                ? "Logout"
                : undefined
            }
            className={`group flex items-center rounded-xl py-3 text-sm font-medium text-slate-500 transition-all hover:bg-red-50 hover:text-red-600 ${
              sidebarCollapsed
                ? "justify-center px-3"
                : "w-full gap-3 px-3"
            }`}
          >
            <LogOut
              size={19}
              className="shrink-0 transition-transform group-hover:translate-x-0.5"
            />

            {!sidebarCollapsed && (
              <span>Logout</span>
            )}
          </button>
        </div>

        <div className="hidden border-t border-slate-200 p-2 lg:block">
          <button
            type="button"
            onClick={() =>
              setSidebarCollapsed(
                (value) => !value
              )
            }
            title={
              sidebarCollapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            className="flex h-10 w-full items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-slate-50 hover:text-[#075db5]"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen size={19} />
            ) : (
              <PanelLeftClose size={19} />
            )}
          </button>
        </div>
      </aside>

      <div
        className={`min-h-screen bg-[#f8fafc] transition-all duration-300 ${
          sidebarCollapsed
            ? "lg:ml-[76px]"
            : "lg:ml-64"
        }`}
      >
        <PatientHeader />

        <main className="min-h-[calc(100vh-64px)] bg-[#f8fafc] pt-16">
          {children}
        </main>
      </div>

      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="fixed bottom-5 left-5 z-30 flex h-11 w-11 items-center justify-center rounded-xl bg-[#075db5] text-white shadow-lg shadow-blue-200 transition hover:bg-[#064f9a] lg:hidden"
        aria-label="Open menu"
      >
        <PanelLeftOpen size={20} />
      </button>
    </div>
  );
}