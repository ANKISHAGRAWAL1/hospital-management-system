"use client";

import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="h-16 bg-black border-b border-gray-800 flex items-center justify-between px-6 text-white">
      
      {/* Left */}
      <div>
        <h2 className="text-lg font-semibold text-white">
          Admin Dashboard
        </h2>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">

        {/* Search */}
        <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-3 py-2 rounded-lg">
          <Search size={18} className="text-gray-400" />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none w-40 text-white placeholder-gray-500"
          />
        </div>

        {/* Notification */}
        <Bell size={21} className="text-gray-300" />

        {/* Admin */}
        <div className="flex items-center gap-2">

          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            A
          </div>

          <div>
            <p className="text-sm font-medium text-white">
              Admin
            </p>

            <p className="text-xs text-gray-400">
              Administrator
            </p>
          </div>

        </div>
      </div>
    </header>
  );
}