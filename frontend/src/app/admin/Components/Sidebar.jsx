"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserRound,
  Building2,
  Settings,
  LogOut,
  CalendarDays,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Appointments",
      href: "/admin/appointment",
      icon: CalendarDays,
    },
    {
      name: "Doctors",
      href: "/admin/doctor",
      icon: UserRound,
    },
    {
      name: "Patients",
      href: "/admin/patient",
      icon: Users,
    },
    {
      name: "Departments",
      href: "/admin/department",
      icon: Building2,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen border-r border-gray-800 bg-black transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo + Toggle */}
      <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4">
        {!collapsed && (
          <h1 className="text-xl font-bold text-white">
            Hospital<span className="text-blue-500">MS</span>
          </h1>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-900 hover:text-white"
          title={collapsed ? "Open Sidebar" : "Close Sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen size={22} />
          ) : (
            <PanelLeftClose size={22} />
          )}
        </button>
      </div>

      {/* Menu */}
      <nav className="px-3 py-6">
        {!collapsed && (
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Main Menu
          </p>
        )}

        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                title={collapsed ? item.name : ""}
                className={`flex items-center rounded-lg py-3 transition ${
                  collapsed
                    ? "justify-center px-2"
                    : "gap-3 px-3"
                } ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                }`}
              >
                <Icon size={20} />

                {!collapsed && (
                  <span className="text-sm font-medium">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 left-0 w-full border-t border-gray-800 p-3">
        <button
          title={collapsed ? "Logout" : ""}
          className={`flex w-full items-center rounded-lg py-3 text-gray-400 transition hover:bg-gray-900 hover:text-red-400 ${
            collapsed
              ? "justify-center px-2"
              : "gap-3 px-3"
          }`}
        >
          <LogOut size={20} />

          {!collapsed && (
            <span className="text-sm font-medium">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}