"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  CalendarDays,
  Stethoscope,
  Users,
  Building2,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Activity,
} from "lucide-react";

export default function Sidebar({ collapsed, setCollapsed }) {
  const pathname = usePathname();
  const router = useRouter();

  const [loggingOut, setLoggingOut] = useState(false);

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
      icon: Stethoscope,
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

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        router.replace("/admin/login");
        router.refresh();
      } else {
        console.error("Logout failed:", data.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const isActive = (href) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside
      className={`
        fixed
        left-0
        top-0
        z-50
        flex
        h-screen
        flex-col
        border-r
        border-[#DCE8E7]
        bg-white
        shadow-[4px_0_20px_rgba(15,61,57,0.05)]
        transition-all
        duration-300
        ease-in-out
        ${collapsed ? "w-[76px]" : "w-[250px]"}
      `}
    >
      {/* ================= HEADER / LOGO ================= */}
      <div
        className={`
          flex
          h-[76px]
          shrink-0
          items-center
          border-b
          border-[#E5EEED]
          px-4
          ${collapsed ? "justify-center" : "justify-between"}
        `}
      >
        <Link
          href="/admin"
          className="flex min-w-0 items-center gap-3"
        >
          {/* Hospital Logo */}
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-xl
              border
              border-[#D8E9E7]
              bg-white
              shadow-[0_2px_8px_rgba(9,121,122,0.08)]
            "
>
  <img
  src="/logo/yash-hospital-logo.png"
  alt="Hospital Logo"
  className="h-full w-full object-contain p-1"
/>
          </div>

          {/* Brand Text */}
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="truncate text-[15px] font-bold text-[#173B37]">
                HospitalMS
              </h1>

              <p className="truncate text-[11px] font-medium text-[#7B918D]">
                Management System
              </p>
            </div>
          )}
        </Link>

        {/* Collapse Button */}
        {!collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              border-[#DCE8E7]
              bg-[#F8FBFA]
              text-[#607873]
              transition
              hover:border-[#BFD9D5]
              hover:bg-[#EDF7F5]
              hover:text-[#087F73]
            "
            title="Collapse sidebar"
          >
            <ChevronLeft size={17} />
          </button>
        )}
      </div>

      {/* Collapsed Expand Button */}
      {collapsed && (
        <div className="flex justify-center border-b border-[#E5EEED] py-3">
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              border
              border-[#DCE8E7]
              bg-[#F8FBFA]
              text-[#607873]
              transition
              hover:border-[#BFD9D5]
              hover:bg-[#EDF7F5]
              hover:text-[#087F73]
            "
            title="Expand sidebar"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      )}

      {/* ================= NAVIGATION ================= */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-5">
        {/* Section Title */}
        {!collapsed && (
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#9AACA8]">
            Main Menu
          </p>
        )}

        <div className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.name : undefined}
                className={`
                  group
                  relative
                  flex
                  h-11
                  items-center
                  rounded-xl
                  transition-all
                  duration-200
                  ${
                    collapsed
                      ? "justify-center"
                      : "gap-3 px-3"
                  }
                  ${
                    active
                      ? "bg-[#EAF7F4] text-[#087F73]"
                      : "text-[#627773] hover:bg-[#F5F9F8] hover:text-[#173B37]"
                  }
                `}
              >
                {/* Active Indicator */}
                {active && (
                  <span
                    className="
                      absolute
                      left-0
                      top-1/2
                      h-6
                      w-[3px]
                      -translate-y-1/2
                      rounded-r-full
                      bg-[#087F73]
                    "
                  />
                )}

                <Icon
                  size={19}
                  strokeWidth={active ? 2.4 : 2}
                  className={`
                    shrink-0
                    transition
                    ${
                      active
                        ? "text-[#087F73]"
                        : "text-[#78908B] group-hover:text-[#087F73]"
                    }
                  `}
                />

                {!collapsed && (
                  <span
                    className={`
                      truncate
                      text-[13px]
                      font-semibold
                      ${
                        active
                          ? "text-[#087F73]"
                          : "text-[#536B66]"
                      }
                    `}
                  >
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ================= SYSTEM STATUS ================= */}
      <div className="px-3 pb-3">
        {!collapsed ? (
          <div
            className="
              rounded-xl
              border
              border-[#DDEAE7]
              bg-[#F6FBFA]
              p-3
            "
          >
            <div className="flex items-center gap-2.5">
              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#E4F5F0]
                  text-[#087F73]
                "
              >
                <Activity size={16} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-[#35514B]">
                  System Status
                </p>

                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />

                  <span className="text-[10px] font-medium text-[#77908A]">
                    All systems operational
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="
              flex
              justify-center
              rounded-xl
              border
              border-[#DDEAE7]
              bg-[#F6FBFA]
              py-2.5
            "
            title="System operational"
          >
            <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
          </div>
        )}
      </div>

      {/* ================= LOGOUT ================= */}
      <div
        className="
          shrink-0
          border-t
          border-[#E5EEED]
          p-3
        "
      >
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          title={collapsed ? "Logout" : undefined}
          className={`
            group
            flex
            h-11
            w-full
            items-center
            rounded-xl
            text-[#8A625F]
            transition
            hover:bg-[#FFF5F4]
            hover:text-[#C2413B]
            disabled:cursor-not-allowed
            disabled:opacity-50
            ${collapsed ? "justify-center" : "gap-3 px-3"}
          `}
        >
          <LogOut
            size={18}
            className="shrink-0 transition group-hover:text-[#C2413B]"
          />

          {!collapsed && (
            <span className="text-[13px] font-semibold">
              {loggingOut ? "Logging out..." : "Logout"}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}