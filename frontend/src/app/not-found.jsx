"use client";

import Link from "next/link";
import {
  Home,
  ArrowLeft,
  SearchX,
  Stethoscope,
  Activity,
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl text-center">

        {/* Medical Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">

            <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Stethoscope
                size={38}
                className="text-emerald-400"
              />
            </div>

            <div className="absolute -right-2 -bottom-2 w-8 h-8 rounded-full bg-black border border-emerald-500/30 flex items-center justify-center">
              <Activity
                size={15}
                className="text-emerald-400"
              />
            </div>

          </div>
        </div>

        {/* 404 */}
        <div className="text-[120px] sm:text-[160px] font-bold leading-none tracking-tight text-white">
          404
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-3xl sm:text-4xl font-semibold">
          Page not found
        </h1>

        {/* Description */}
        <p className="mt-4 text-gray-400 text-base sm:text-lg leading-7 max-w-lg mx-auto">
          Sorry, we couldn't find the page you're looking for.
          The page may have been moved, deleted, or the URL may
          be incorrect.
        </p>

        {/* Search Icon */}
        <div className="flex justify-center mt-8">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <SearchX
              size={22}
              className="text-gray-400"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">

          {/* Back */}
          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200 text-sm font-medium"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          {/* Dashboard */}
          <Link
            href="/admin/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-all duration-200 text-sm font-medium text-white"
          >
            <Home size={18} />
            Go to Dashboard
          </Link>

        </div>

        {/* Footer */}
        <div className="mt-12 flex items-center justify-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          Hospital Management System
        </div>

      </div>
    </main>
  );
}