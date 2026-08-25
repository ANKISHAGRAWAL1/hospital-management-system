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
  ClipboardList,
  Bell,
  LogOut,
  Menu,
  X,
  Search,
  ChevronRight,
} from "lucide-react";

export default function PatientLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      href: "/patient/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Book Appointment",
      href: "/patient/book-appointment",
      icon: CalendarPlus,
    },
    {
      name: "My Appointments",
      href: "/patient/appointments",
      icon: CalendarDays,
    },
    {
      name: "Find Doctors",
      href: "/patient/doctors",
      icon: UserRound,
    },
    {
      name: "Prescriptions",
      href: "/patient/prescriptions",
      icon: Pill,
    },
    {
      name: "Medical Reports",
      href: "/patient/reports",
      icon: FileText,
    },
    {
      name: "Medical History",
      href: "/patient/medical-history",
      icon: ClipboardList,
    },
    {
      name: "My Profile",
      href: "/patient/profile",
      icon: UserRound,
    },
  ];

  const isActive = (href) => {
    if (href === "/patient/dashboard") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-black border-r border-gray-800 transition-transform duration-300
        ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="h-16 px-5 border-b border-gray-800 flex items-center justify-between">
          <Link
            href="/patient/dashboard"
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-white text-black flex items-center justify-center font-bold">
              H
            </div>

            <div>
              <h1 className="text-sm font-semibold">
                Hospital
              </h1>

              <p className="text-[10px] text-gray-500">
                Patient Portal
              </p>
            </div>
          </Link>

          {/* Mobile Close */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Patient Profile */}
        <div className="px-4 py-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center">
              <UserRound
                size={19}
                className="text-gray-400"
              />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium truncate">
                Ankish Gupta
              </p>

              <p className="text-xs text-gray-600 truncate">
                PAT-10024
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-180px)]">
          <p className="px-3 pt-2 pb-3 text-[10px] uppercase tracking-wider text-gray-600">
            Main Menu
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition ${
                  active
                    ? "bg-white text-black"
                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />

                  <span>{item.name}</span>
                </div>

                {active && (
                  <ChevronRight size={15} />
                )}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-gray-800">
            <Link
              href="/patient/notifications"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition ${
                isActive("/patient/notifications")
                  ? "bg-white text-black"
                  : "text-gray-400 hover:bg-gray-900 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell size={18} />
                <span>Notifications</span>
              </div>

              <span className="text-[10px] min-w-5 h-5 px-1 rounded-full bg-red-500 text-white flex items-center justify-center">
                3
              </span>
            </Link>
          </div>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-800 bg-black">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-900 hover:text-red-400 transition">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="h-16 bg-black border-b border-gray-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900"
            >
              <Menu size={21} />
            </button>

            <div>
              <h2 className="text-sm sm:text-base font-semibold">
                Patient Portal
              </h2>

              <p className="hidden sm:block text-xs text-gray-600">
                Manage your healthcare
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search */}
            <button className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-900 transition">
              <Search size={19} />
            </button>

            {/* Notification */}
            <button className="relative p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-900 transition">
              <Bell size={19} />

              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            </button>

            {/* Profile */}
            <Link
              href="/patient/profile"
              className="flex items-center gap-2 pl-2 sm:pl-3 sm:border-l sm:border-gray-800"
            >
              <div className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center">
                <UserRound
                  size={16}
                  className="text-gray-400"
                />
              </div>

              <div className="hidden md:block">
                <p className="text-xs font-medium">
                  Ankish Gupta
                </p>

                <p className="text-[10px] text-gray-600">
                  Patient
                </p>
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main>{children}</main>
      </div>
    </div>
  );
}