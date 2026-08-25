"use client";

import Link from "next/link";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  CalendarDays,
  Clock,
} from "lucide-react";

export default function AppointmentPage() {
  const appointments = [
    {
      id: "APT-1001",
      token: "T-01",
      patient: "Rahul Sharma",
      patientId: "P-1001",
      doctor: "Dr. Amit Sharma",
      department: "Cardiology",
      date: "24 Aug 2026",
      time: "10:00 AM",
      duration: "30 min",
      status: "Waiting",
    },
    {
      id: "APT-1002",
      token: "T-02",
      patient: "Priya Gupta",
      patientId: "P-1002",
      doctor: "Dr. Raj Kumar",
      department: "Neurology",
      date: "24 Aug 2026",
      time: "10:30 AM",
      duration: "30 min",
      status: "In Consultation",
    },
    {
      id: "APT-1003",
      token: "T-03",
      patient: "Mohit Singh",
      patientId: "P-1003",
      doctor: "Dr. Neha",
      department: "Orthopedics",
      date: "24 Aug 2026",
      time: "11:00 AM",
      duration: "30 min",
      status: "Completed",
    },
    {
      id: "APT-1004",
      token: "T-04",
      patient: "Sneha Verma",
      patientId: "P-1004",
      doctor: "Dr. Amit Sharma",
      department: "Cardiology",
      date: "24 Aug 2026",
      time: "11:30 AM",
      duration: "30 min",
      status: "Waiting",
    },
    {
      id: "APT-1005",
      token: "T-05",
      patient: "Ravi Meena",
      patientId: "P-1005",
      doctor: "Dr. Raj Kumar",
      department: "Neurology",
      date: "24 Aug 2026",
      time: "12:00 PM",
      duration: "30 min",
      status: "Cancelled",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Waiting":
        return "bg-yellow-950 text-yellow-400";

      case "In Consultation":
        return "bg-blue-950 text-blue-400";

      case "Completed":
        return "bg-green-950 text-green-400";

      case "Cancelled":
        return "bg-red-950 text-red-400";

      default:
        return "bg-gray-800 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl font-bold">
            Appointments
          </h1>

          <p className="text-gray-400 text-sm mt-1">
            Manage doctor appointments and patient schedules
          </p>
        </div>

        <Link
          href="/admin/appointment/add"
          className="flex items-center justify-center gap-2 bg-white text-black px-4 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition"
        >
          <Plus size={18} />
          New Appointment
        </Link>

      </div>

      {/* Filters */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 mb-6">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">

          {/* Search */}
          <div className="relative lg:col-span-2">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              placeholder="Search patient or appointment ID..."
              className="w-full bg-black border border-gray-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-gray-500"
            />

          </div>

          {/* Date */}
          <div className="relative">

            <CalendarDays
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="date"
              className="w-full bg-black border border-gray-800 rounded-lg py-2.5 pl-10 pr-3 text-sm text-gray-300 outline-none focus:border-gray-500"
            />

          </div>

          {/* Doctor */}
          <select className="bg-black border border-gray-800 rounded-lg px-3 py-2.5 text-sm text-gray-300 outline-none focus:border-gray-500">
            <option>All Doctors</option>
            <option>Dr. Amit Sharma</option>
            <option>Dr. Raj Kumar</option>
            <option>Dr. Neha</option>
          </select>

          {/* Status */}
          <select className="bg-black border border-gray-800 rounded-lg px-3 py-2.5 text-sm text-gray-300 outline-none focus:border-gray-500">
            <option>All Status</option>
            <option>Waiting</option>
            <option>In Consultation</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>

        </div>

      </div>

      {/* Appointment Table */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-gray-900 border-b border-gray-800">

              <tr>

                <th className="px-5 py-4 text-xs font-semibold text-gray-400 uppercase">
                  Appointment
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-gray-400 uppercase">
                  Token
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-gray-400 uppercase">
                  Patient
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-gray-400 uppercase">
                  Doctor
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-gray-400 uppercase">
                  Department
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-gray-400 uppercase">
                  Date & Time
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-gray-400 uppercase">
                  Duration
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-gray-400 uppercase">
                  Status
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-gray-400 uppercase text-right">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-800">

              {appointments.map((appointment) => (

                <tr
                  key={appointment.id}
                  className="hover:bg-gray-900 transition"
                >

                  {/* Appointment ID */}
                  <td className="px-5 py-4">

                    <p className="text-sm font-medium text-white">
                      {appointment.id}
                    </p>

                    <p className="text-xs text-gray-500">
                      Appointment
                    </p>

                  </td>

                  {/* Token */}
                  <td className="px-5 py-4">

                    <span className="inline-flex items-center justify-center min-w-12 px-2.5 py-1 rounded-md bg-gray-800 text-gray-200 text-xs font-semibold">
                      {appointment.token}
                    </span>

                  </td>

                  {/* Patient */}
                  <td className="px-5 py-4">

                    <p className="text-sm font-medium text-white">
                      {appointment.patient}
                    </p>

                    <p className="text-xs text-gray-500">
                      {appointment.patientId}
                    </p>

                  </td>

                  {/* Doctor */}
                  <td className="px-5 py-4">

                    <p className="text-sm text-gray-300">
                      {appointment.doctor}
                    </p>

                  </td>

                  {/* Department */}
                  <td className="px-5 py-4">

                    <span className="text-sm text-gray-400">
                      {appointment.department}
                    </span>

                  </td>

                  {/* Date & Time */}
                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">

                      <CalendarDays
                        size={15}
                        className="text-gray-500"
                      />

                      <div>
                        <p className="text-sm text-gray-300">
                          {appointment.date}
                        </p>

                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock size={12} />
                          {appointment.time}
                        </div>
                      </div>

                    </div>

                  </td>

                  {/* Duration */}
                  <td className="px-5 py-4">

                    <span className="text-sm text-gray-400">
                      {appointment.duration}
                    </span>

                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>

                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">

                    <div className="flex items-center justify-end gap-2">

                      <button
                        title="View"
                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        title="Edit"
                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        title="Delete"
                        className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition"
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

          <p className="text-sm text-gray-500">
            Showing {appointments.length} appointments
          </p>

          <div className="flex items-center gap-2">

            <button
              disabled
              className="px-3 py-1.5 rounded-lg border border-gray-800 text-sm text-gray-600"
            >
              Previous
            </button>

            <button className="px-3 py-1.5 rounded-lg bg-white text-black text-sm font-medium">
              1
            </button>

            <button className="px-3 py-1.5 rounded-lg border border-gray-800 text-sm text-gray-300 hover:bg-gray-800">
              2
            </button>

            <button className="px-3 py-1.5 rounded-lg border border-gray-800 text-sm text-gray-300 hover:bg-gray-800">
              Next
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}