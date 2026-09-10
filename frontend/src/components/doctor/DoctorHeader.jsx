"use client";

import Link from "next/link";
import {
  Bell,
  Search,
  UserRound,
  ChevronDown,
} from "lucide-react";

export default function DoctorHeader() {
  return (
    <header className="fixed left-64 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      {/* =========================================
          LEFT SECTION
      ========================================= */}

      <div className="flex items-center gap-4">
        {/* HOSPITAL LOGO */}

        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-white">
          <img
            src="/logo/yash-hospital-logo.png"
            alt="Yash Hospital"
            className="h-9 w-9 object-contain"
          />
        </div>

        {/* PAGE TITLE */}

        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Doctor Dashboard
          </h2>

          <p className="hidden text-[11px] text-slate-500 lg:block">
            Manage patients, appointments & consultations
          </p>
        </div>
      </div>

      {/* =========================================
          RIGHT SECTION
      ========================================= */}

      <div className="flex items-center gap-3">
        {/* SEARCH */}

        <div className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50 md:flex">
          <Search
            size={17}
            className="text-slate-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="w-40 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        {/* NOTIFICATION */}

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
        >
          <Bell size={19} />

          <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
        </button>

        {/* PROFILE */}

        <Link
          href="/doctor/profile"
          className="group flex items-center gap-3 border-l border-slate-200 pl-4"
        >
          {/* AVATAR */}

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
            <UserRound size={18} />
          </div>

          {/* DOCTOR INFO */}

          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-800 transition group-hover:text-blue-600">
              Doctor
            </p>

            <p className="text-xs text-slate-500">
              Medical Professional
            </p>
          </div>

          {/* ARROW */}

          <ChevronDown
            size={16}
            className="hidden text-slate-400 transition group-hover:text-blue-600 md:block"
          />
        </Link>
      </div>
    </header>
  );
}