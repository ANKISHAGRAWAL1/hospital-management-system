"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  ClipboardList,
  Clock,
  UserRound,
  LogOut,
} from "lucide-react";

export default function DoctorSidebar() {
  const pathname = usePathname();

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
    {
      name: "Profile",
      href: "/doctor/profile",
      icon: UserRound,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-black border-r border-gray-800 text-white">

      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">
          Doctor Portal
        </h1>
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                active
                  ? "bg-gray-900 text-white"
                  : "text-gray-400 hover:bg-gray-900 hover:text-white"
              }`}
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-4 left-4 right-4">
        <Link
          href="/login"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-400 hover:bg-gray-900 hover:text-white transition"
        >
          <LogOut size={19} />
          <span>Logout</span>
        </Link>
      </div>

    </aside>
  );
}