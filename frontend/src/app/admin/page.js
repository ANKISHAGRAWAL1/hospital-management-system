"use client";
import Link from "next/link";
import {
  Users,
  UserRound,
  CalendarDays,
  ClipboardList,
  Clock,
  CheckCircle,
} from "lucide-react";
 

export default function AdminPage() {
  const stats = [
    {
      title: "Total Patients",
      value: "1,248",
      icon: Users,
    },
    {
      title: "Total Doctors",
      value: "48",
      icon: UserRound,
    },
    {
      title: "Appointments",
      value: "326",
      icon: CalendarDays,
    },
    {
      title: "Pending",
      value: "24",
      icon: Clock,
    },
  ];

  const appointments = [
    {
      patient: "Rahul Sharma",
      doctor: "Dr. Amit Kumar",
      date: "19 Aug 2026",
      time: "10:30 AM",
      status: "Confirmed",
    },
    {
      patient: "Priya Gupta",
      doctor: "Dr. Neha Sharma",
      date: "19 Aug 2026",
      time: "11:00 AM",
      status: "Pending",
    },
    {
      patient: "Mohit Singh",
      doctor: "Dr. Raj Verma",
      date: "19 Aug 2026",
      time: "12:30 PM",
      status: "Completed",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">
          Welcome back, Admin. Here's what's happening today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-xl border border-gray-800 bg-gray-950 p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{item.title}</p>
                  <h2 className="mt-2 text-3xl font-bold">{item.value}</h2>
                </div>

                <div className="rounded-lg bg-blue-500/10 p-3 text-blue-500">
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Appointments */}
      <div className="mt-8 rounded-xl border border-gray-800 bg-gray-950">
        <div className="flex items-center justify-between border-b border-gray-800 p-5">
          <div>
            <h2 className="text-lg font-semibold">Recent Appointments</h2>
            <p className="text-sm text-gray-500">
              Latest patient appointments
            </p>
          </div>

          <CalendarDays className="text-gray-500" size={22} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800 text-sm text-gray-500">
                <th className="px-5 py-4">Patient</th>
                <th className="px-5 py-4">Doctor</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Time</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appointment, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-800 last:border-0 hover:bg-gray-900"
                >
                  <td className="px-5 py-4 font-medium">
                    {appointment.patient}
                  </td>

                  <td className="px-5 py-4 text-gray-400">
                    {appointment.doctor}
                  </td>

                  <td className="px-5 py-4 text-gray-400">
                    {appointment.date}
                  </td>

                  <td className="px-5 py-4 text-gray-400">
                    {appointment.time}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                        appointment.status === "Confirmed"
                          ? "bg-green-500/10 text-green-400"
                          : appointment.status === "Pending"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-blue-500/10 text-blue-400"
                      }`}
                    >
                      {appointment.status === "Completed" && (
                        <CheckCircle size={13} />
                      )}
                      {appointment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <button className="rounded-xl border border-gray-800 bg-gray-950 p-5 text-left transition hover:border-blue-500 hover:bg-gray-900">
            <Users className="mb-3 text-blue-500" size={24} />
            <h3 className="font-semibold">Add Patient</h3>
            <p className="mt-1 text-sm text-gray-500">
              Register a new patient
            </p>
          </button>
  {/* Add Doctor */}
    <Link
      href="/admin/doctor/add"
      className="rounded-xl border border-gray-800 bg-gray-950 p-5 text-left transition hover:border-blue-500 hover:bg-gray-900"
    >
      <UserRound className="mb-3 text-blue-500" size={24} />

      <h3 className="font-semibold">
        Add Doctor
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        Register a new doctor
      </p>
    </Link>

          <button className="rounded-xl border border-gray-800 bg-gray-950 p-5 text-left transition hover:border-blue-500 hover:bg-gray-900">
            <ClipboardList className="mb-3 text-blue-500" size={24} />
            <h3 className="font-semibold">View Appointments</h3>
            <p className="mt-1 text-sm text-gray-500">
              Manage all appointments
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}