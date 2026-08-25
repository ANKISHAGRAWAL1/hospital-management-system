"use client";

import { Bell, Search, UserRound } from "lucide-react";
import Link from "next/link";

export default function DoctorHeader() {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-black border-b border-gray-800 flex items-center justify-between px-6 z-50">

      {/* Left */}
      <div>
        <h2 className="text-lg font-semibold">
          Doctor Dashboard
        </h2>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-950 border border-gray-800 rounded-lg px-3 py-2">
          <Search size={17} className="text-gray-500" />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm text-white w-40"
          />
        </div>

        {/* Notification */}
        <button className="relative text-gray-400 hover:text-white">
          <Bell size={20} />

          <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full" />
        </button>

        {/* Doctor */}
     {/* Doctor */}
<Link
  href="/doctor/profile"
  className="flex items-center gap-3"
>
  <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center">
    <UserRound size={18} />
  </div>
</Link>

          <div className="hidden md:block">
            <p className="text-sm font-medium">
              Dr. Raj Sharma
            </p>

            <p className="text-xs text-gray-500">
              Cardiologist
            </p>
          </div>
        </div>

    
    </header>
  );
}