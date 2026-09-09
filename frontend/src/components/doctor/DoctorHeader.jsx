"use client";

import {
  Bell,
  Search,
  UserRound,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

export default function DoctorHeader() {
  return (
    <header
      className="
        fixed top-0 left-64 right-0
        h-16
        bg-blue-600
        border-b border-blue-700
        flex items-center justify-between
        px-6
        z-50
        shadow-md
      "
    >
      {/* LEFT */}
      <div>
        <h2 className="text-lg font-semibold text-white">
          Doctor Dashboard
        </h2>

        <p className="text-[11px] text-blue-100 hidden lg:block">
          Manage your patients & appointments
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5">

        {/* SEARCH */}
        <div
          className="
            hidden md:flex
            items-center gap-2
            bg-blue-700/50
            border border-blue-400/40
            rounded-xl
            px-3 py-2
            focus-within:border-white
            transition
          "
        >
          <Search
            size={17}
            className="text-blue-100"
          />

          <input
            type="text"
            placeholder="Search..."
            className="
              bg-transparent
              outline-none
              text-sm
              text-white
              placeholder:text-blue-100
              w-40
            "
          />
        </div>

        {/* NOTIFICATION */}
        <button
          type="button"
          className="
            relative
            w-10 h-10
            rounded-xl
            flex items-center justify-center
            text-blue-100
            hover:text-white
            hover:bg-blue-700
            transition
          "
        >
          <Bell size={20} />

          <span
            className="
              absolute
              top-2
              right-2
              w-2
              h-2
              bg-white
              rounded-full
              ring-2 ring-blue-600
            "
          />
        </button>

        {/* DOCTOR PROFILE */}
        <Link
          href="/doctor/profile"
          className="
            flex items-center gap-3
            pl-4
            border-l border-blue-400/40
            group
          "
        >
          {/* AVATAR */}
          <div
            className="
              w-9 h-9
              rounded-full
              bg-white
              flex items-center justify-center
              text-blue-600
              shadow-sm
              group-hover:bg-blue-50
              transition
            "
          >
            <UserRound size={18} />
          </div>

          {/* DOCTOR INFO */}
          <div className="hidden md:block">
            <p
              className="
                text-sm
                font-semibold
                text-white
                group-hover:text-blue-100
                transition
              "
            >
              Dr. Raj Sharma
            </p>

            <p className="text-xs text-blue-100">
              Cardiologist
            </p>
          </div>

          {/* ARROW */}
          <ChevronDown
            size={16}
            className="
              hidden md:block
              text-blue-100
              group-hover:text-white
              transition
            "
          />
        </Link>
      </div>
    </header>
  );
}