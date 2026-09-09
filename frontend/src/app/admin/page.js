"use client";

import Link from "next/link";
import {
  Users,
  UserRound,
  CalendarDays,
  ClipboardList,
  Clock3,
  CheckCircle2,
  ArrowUpRight,
  Activity,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Building2,
} from "lucide-react";

export default function AdminPage() {
  const stats = [
    {
      title: "Total Patients",
      value: "1,248",
      change: "+12.5%",
      label: "vs last month",
      icon: Users,
      positive: true,
    },
    {
      title: "Total Doctors",
      value: "48",
      change: "+4.2%",
      label: "vs last month",
      icon: UserRound,
      positive: true,
    },
    {
      title: "Appointments",
      value: "326",
      change: "+8.1%",
      label: "vs last month",
      icon: CalendarDays,
      positive: true,
    },
    {
      title: "Pending",
      value: "24",
      change: "-2.4%",
      label: "vs last month",
      icon: Clock3,
      positive: false,
    },
  ];

  const appointments = [
    {
      patient: "Rahul Sharma",
      doctor: "Dr. Amit Kumar",
      department: "Cardiology",
      date: "19 Aug 2026",
      time: "10:30 AM",
      status: "Confirmed",
    },
    {
      patient: "Priya Gupta",
      doctor: "Dr. Neha Sharma",
      department: "Neurology",
      date: "19 Aug 2026",
      time: "11:00 AM",
      status: "Pending",
    },
    {
      patient: "Mohit Singh",
      doctor: "Dr. Raj Verma",
      department: "Orthopedics",
      date: "19 Aug 2026",
      time: "12:30 PM",
      status: "Completed",
    },
  ];

  const quickActions = [
    {
      title: "Add Patient",
      description: "Register a new patient",
      href: "/admin/patient/add",
      icon: Users,
    },
    {
      title: "Add Doctor",
      description: "Register a new doctor",
      href: "/admin/doctor/add",
      icon: UserRound,
    },
    {
      title: "Appointments",
      description: "Manage today's visits",
      href: "/admin/appointment",
      icon: ClipboardList,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F8F7] text-[#172522]">
      {/* PAGE HEADER */}
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-1.5 flex items-center gap-2.5">
            <h1 className="text-[25px] font-bold tracking-[-0.02em] text-[#17332E]">
              Dashboard
            </h1>

            <span className="rounded-full border border-[#BFE8DE] bg-[#E7F8F4] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#087F70]">
              Admin
            </span>
          </div>

          <p className="text-[13px] text-[#71827D]">
            Here's an overview of your hospital's activity today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Hospital Status */}
          <div className="hidden items-center gap-2.5 rounded-xl border border-[#DDEAE6] bg-white px-3.5 py-2.5 shadow-[0_2px_8px_rgba(20,60,50,0.04)] sm:flex">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5EEAD4] opacity-50" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#0D9488]" />
            </span>

            <span className="text-[11px] font-semibold text-[#52645F]">
              Hospital Operational
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 rounded-xl border border-[#DDEAE6] bg-white px-4 py-2.5 text-[11px] font-semibold text-[#52645F] shadow-[0_2px_8px_rgba(20,60,50,0.04)]">
            <CalendarDays size={14} className="text-[#0D9488]" />
            19 August 2026
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="group rounded-2xl border border-[#DDEAE6] bg-white p-5 shadow-[0_2px_8px_rgba(20,60,50,0.035)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#A9DDD3] hover:shadow-[0_10px_25px_rgba(20,60,50,0.08)]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[12px] font-semibold text-[#74847F]">
                    {item.title}
                  </p>

                  <h2 className="mt-2 text-[29px] font-bold tracking-[-0.03em] text-[#17332E]">
                    {item.value}
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#CDEDE6] bg-[#E9F8F5] text-[#0D8276] transition group-hover:bg-[#DDF5F0]">
                  <Icon size={19} strokeWidth={2} />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                    item.positive ? "text-[#0F9F87]" : "text-[#D97706]"
                  }`}
                >
                  {item.positive ? (
                    <TrendingUp size={12} />
                  ) : (
                    <TrendingDown size={12} />
                  )}

                  {item.change}
                </span>

                <span className="text-[11px] text-[#9AA8A4]">
                  {item.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* MAIN CONTENT */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* RECENT APPOINTMENTS */}
        <div className="overflow-hidden rounded-2xl border border-[#DDEAE6] bg-white shadow-[0_2px_8px_rgba(20,60,50,0.035)] xl:col-span-2">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#EAF1EF] px-5 py-4.5">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8F7F4] text-[#0D8276]">
                  <CalendarDays size={15} />
                </div>

                <h2 className="text-[15px] font-bold text-[#17332E]">
                  Recent Appointments
                </h2>
              </div>

              <p className="mt-1 pl-10 text-[11px] text-[#7B8985]">
                Latest scheduled patient visits
              </p>
            </div>

            <Link
              href="/admin/appointment"
              className="group flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[11px] font-bold text-[#0D8276] transition hover:bg-[#EAF8F5]"
            >
              View all
              <ArrowUpRight
                size={13}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-[#EAF1EF] bg-[#F7FAF9]">
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-[#91A09B]">
                    Patient
                  </th>

                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-[#91A09B]">
                    Doctor
                  </th>

                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-[#91A09B]">
                    Department
                  </th>

                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-[#91A09B]">
                    Schedule
                  </th>

                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-[#91A09B]">
                    Status
                  </th>

                  <th className="px-5 py-3.5" />
                </tr>
              </thead>

              <tbody>
                {appointments.map((appointment, index) => (
                  <tr
                    key={index}
                    className="border-b border-[#EEF3F1] last:border-0 transition hover:bg-[#F8FBFA]"
                  >
                    {/* Patient */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#CDEDE6] bg-[#E9F8F5] text-[11px] font-bold text-[#087F70]">
                          {appointment.patient
                            .split(" ")
                            .map((name) => name[0])
                            .join("")}
                        </div>

                        <div>
                          <p className="text-[12px] font-bold text-[#263A35]">
                            {appointment.patient}
                          </p>

                          <p className="mt-0.5 text-[10px] text-[#9AA8A4]">
                            Patient
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Doctor */}
                    <td className="px-5 py-4">
                      <p className="text-[12px] font-semibold text-[#52635E]">
                        {appointment.doctor}
                      </p>
                    </td>

                    {/* Department */}
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-lg border border-[#E0EAE7] bg-[#F4F7F6] px-2.5 py-1.5 text-[10px] font-semibold text-[#596A65]">
                        {appointment.department}
                      </span>
                    </td>

                    {/* Schedule */}
                    <td className="px-5 py-4">
                      <p className="text-[11px] font-semibold text-[#52635E]">
                        {appointment.date}
                      </p>

                      <p className="mt-0.5 text-[10px] text-[#9AA8A4]">
                        {appointment.time}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] font-bold ${
                          appointment.status === "Confirmed"
                            ? "border-[#BCE8D8] bg-[#ECFBF5] text-[#087F70]"
                            : appointment.status === "Pending"
                            ? "border-[#F5DDA8] bg-[#FFFAEC] text-[#B7791F]"
                            : "border-[#C9E4F2] bg-[#F0F8FC] text-[#14749B]"
                        }`}
                      >
                        {appointment.status === "Confirmed" && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#0D9488]" />
                        )}

                        {appointment.status === "Pending" && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]" />
                        )}

                        {appointment.status === "Completed" && (
                          <CheckCircle2 size={12} />
                        )}

                        {appointment.status}
                      </span>
                    </td>

                    {/* More */}
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9AA8A4] transition hover:bg-[#EAF3F1] hover:text-[#47605A]"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-6">
          {/* QUICK ACTIONS */}
          <div className="rounded-2xl border border-[#DDEAE6] bg-white p-5 shadow-[0_2px_8px_rgba(20,60,50,0.035)]">
            <div className="mb-5">
              <h2 className="text-[15px] font-bold text-[#17332E]">
                Quick Actions
              </h2>

              <p className="mt-1 text-[11px] text-[#7B8985]">
                Common administrative tasks
              </p>
            </div>

            <div className="space-y-2.5">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="group flex items-center gap-3 rounded-xl border border-[#E1EBE8] bg-white p-3 transition-all duration-200 hover:border-[#A9DDD3] hover:bg-[#F7FCFB] hover:shadow-[0_4px_12px_rgba(20,100,85,0.05)]"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#CDEDE6] bg-[#E9F8F5] text-[#0D8276]">
                      <Icon size={17} />
                    </div>

                    <div className="flex-1">
                      <p className="text-[12px] font-bold text-[#263A35]">
                        {action.title}
                      </p>

                      <p className="mt-0.5 text-[10px] text-[#9AA8A4]">
                        {action.description}
                      </p>
                    </div>

                    <ArrowUpRight
                      size={15}
                      className="text-[#A6B2AE] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#0D8276]"
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* SYSTEM STATUS */}
          <div className="overflow-hidden rounded-2xl border border-[#BFE8DE] bg-gradient-to-br from-[#EAF9F6] to-[#F7FCFB] shadow-[0_2px_8px_rgba(20,100,85,0.04)]">
            <div className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#C7EBE4] bg-white text-[#0D8276] shadow-sm">
                  <Activity size={18} />
                </div>

                <div>
                  <p className="text-[12px] font-bold text-[#145A50]">
                    Today's Overview
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-[#438078]">
                    Hospital operations are running normally.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <div className="rounded-xl border border-[#D5EDE8] bg-white/80 p-3">
                  <p className="text-[10px] font-medium text-[#81918C]">
                    Departments
                  </p>

                  <p className="mt-1 text-[17px] font-bold text-[#17332E]">
                    12
                  </p>
                </div>

                <div className="rounded-xl border border-[#D5EDE8] bg-white/80 p-3">
                  <p className="text-[10px] font-medium text-[#81918C]">
                    Active Doctors
                  </p>

                  <p className="mt-1 text-[17px] font-bold text-[#17332E]">
                    42
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2.5">
                <span className="h-2 w-2 rounded-full bg-[#0D9488]" />

                <span className="text-[10px] font-semibold text-[#438078]">
                  All systems operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}