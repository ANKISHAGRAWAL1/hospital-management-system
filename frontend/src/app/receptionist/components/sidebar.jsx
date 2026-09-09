"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ListChecks,
  UserPlus,
  LogIn,
  Stethoscope,
  Receipt,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/receptionist",
    },
    {
      title: "Patients",
      icon: Users,
      href: "/receptionist/patients",
    },
    {
      title: "Appointments",
      icon: CalendarDays,
      href: "/receptionist/appointments",
    },
    {
      title: "Today's Queue",
      icon: ListChecks,
      href: "/receptionist/queue",
    },
    {
      title: "Walk-in Patient",
      icon: UserPlus,
      href: "/receptionist/walk-in",
    },
    {
      title: "Check-in / Check-out",
      icon: LogIn,
      href: "/receptionist/check-in",
    },
    {
      title: "Doctors Availability",
      icon: Stethoscope,
      href: "/receptionist/doctors",
    },
    {
      title: "Billing",
      icon: Receipt,
      href: "/receptionist/billing",
    },
    {
      title: "Notifications",
      icon: Bell,
      href: "/receptionist/notifications",
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-screen bg-black border-r border-gray-200
      transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {sidebarOpen && (
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              MediCare
            </h1>
            <p className="text-xs text-gray-500">
              Receptionist
            </p>
          </div>
        )}

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
        >
          {sidebarOpen ? (
            <ChevronLeft size={19} />
          ) : (
            <ChevronRight size={19} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-64px)]">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            (item.href !== "/receptionist" &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              title={!sidebarOpen ? item.title : ""}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg
              text-sm font-medium transition-colors
              ${
                active
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon size={19} className="shrink-0" />

              {sidebarOpen && (
                <span>{item.title}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}