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
  Stethoscope,
  ChevronRight,
} from "lucide-react";

export default function DoctorSidebar() {
  const pathname = usePathname();
  const router = useRouter();

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

  const handleLogout = () => {
    // Future me JWT/token yahan remove karenge
    sessionStorage.removeItem("doctorSetupToken");

    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctor");

    router.push("/doctor/login");
  };

  return (
    <aside
      className="
        fixed
        left-0
        top-0
        z-40
        h-screen
        w-64
        bg-white
        border-r
        border-gray-200
        flex
        flex-col
      "
    >
      {/* ================= LOGO ================= */}

      <div className="h-20 px-6 border-b border-gray-200 flex items-center">
        <div className="flex items-center gap-3">

          {/* Logo Icon */}
          <div
            className="
              w-11
              h-11
              rounded-xl
              bg-blue-600
              text-white
              flex
              items-center
              justify-center
              shadow-sm
            "
          >
            <Stethoscope size={23} />
          </div>

          {/* Logo Text */}
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              MediCare
            </h1>

            <p className="text-xs text-gray-500">
              Doctor Portal
            </p>
          </div>

        </div>
      </div>

      {/* ================= NAVIGATION ================= */}

      <div className="flex-1 overflow-y-auto px-4 py-6">

        {/* Section Title */}

        <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Main Menu
        </p>

        <nav className="space-y-1.5">

          {menu.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group
                  relative
                  flex
                  items-center
                  gap-3
                  px-3
                  py-3
                  rounded-xl
                  text-sm
                  font-medium
                  transition-all
                  duration-200

                  ${
                    active
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
                      -translate-y-1/2
                      w-1
                      h-7
                      bg-blue-600
                      rounded-r-full
                    "
                  />
                )}

                {/* Icon */}

                <span
                  className={`
                    w-9
                    h-9
                    rounded-lg
                    flex
                    items-center
                    justify-center
                    transition

                    ${
                      active
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-50 text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-700"
                    }
                  `}
                >
                  <Icon size={18} />
                </span>

                {/* Name */}

                <span className="flex-1">
                  {item.name}
                </span>

                {/* Arrow */}

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

        {/* ================= ACCOUNT ================= */}

        <div className="mt-8">

          <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Account
          </p>

          <Link
            href="/doctor/profile"
            className={`
              group
              flex
              items-center
              gap-3
              px-3
              py-3
              rounded-xl
              text-sm
              font-medium
              transition

              ${
                pathname === "/doctor/profile"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }
            `}
          >

            <span
              className="
                w-9
                h-9
                rounded-lg
                bg-gray-50
                flex
                items-center
                justify-center
                text-gray-500
                group-hover:bg-gray-100
              "
            >
              <UserRound size={18} />
            </span>

            <span>
              My Profile
            </span>

          </Link>

        </div>

      </div>

      {/* ================= DOCTOR INFO ================= */}

      <div className="px-4 pb-3">

        <div
          className="
            p-3
            rounded-xl
            bg-blue-50
            border
            border-blue-100
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                w-9
                h-9
                rounded-full
                bg-blue-600
                text-white
                flex
                items-center
                justify-center
                text-sm
                font-semibold
              "
            >
              DR
            </div>

            <div className="min-w-0">

              <p className="text-sm font-semibold text-gray-800 truncate">
                Doctor Portal
              </p>

              <p className="text-xs text-gray-500 truncate">
                Medical Workspace
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ================= LOGOUT ================= */}

      <div className="p-4 border-t border-gray-200">

        <button
          type="button"
          onClick={handleLogout}
          className="
            w-full
            flex
            items-center
            gap-3
            px-3
            py-3
            rounded-xl
            text-sm
            font-medium
            text-gray-600
            hover:bg-red-50
            hover:text-red-600
            transition
            group
          "
        >

          <span
            className="
              w-9
              h-9
              rounded-lg
              bg-gray-50
              group-hover:bg-red-100
              flex
              items-center
              justify-center
              transition
            "
          >
            <LogOut size={18} />
          </span>

          <span>
            Logout
          </span>

        </button>

      </div>

    </aside>
  );
}