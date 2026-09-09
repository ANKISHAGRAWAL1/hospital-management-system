"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Plus,
  Search,
  Eye,
  Pencil,
  XCircle,
  Clock,
  CheckCircle2,
  User,
  Stethoscope,
  MoreHorizontal,
} from "lucide-react";

const appointmentsData = [
  {
    id: "APT-1001",
    token: "01",
    patient: "Rahul Sharma",
    uhid: "UHID-10021",
    doctor: "Dr. Amit Verma",
    department: "Cardiology",
    time: "09:00 AM",
    type: "New",
    status: "Checked-in",
    payment: "Paid",
  },
  {
    id: "APT-1002",
    token: "02",
    patient: "Priya Gupta",
    uhid: "UHID-10022",
    doctor: "Dr. Neha Sharma",
    department: "Gynecology",
    time: "09:30 AM",
    type: "Follow-up",
    status: "Scheduled",
    payment: "Paid",
  },
  {
    id: "APT-1003",
    token: "03",
    patient: "Mohit Singh",
    uhid: "UHID-10023",
    doctor: "Dr. Raj Mehta",
    department: "Orthopedics",
    time: "10:00 AM",
    type: "New",
    status: "Completed",
    payment: "Paid",
  },
  {
    id: "APT-1004",
    token: "04",
    patient: "Anjali Verma",
    uhid: "UHID-10024",
    doctor: "Dr. Amit Verma",
    department: "Cardiology",
    time: "10:30 AM",
    type: "Follow-up",
    status: "Scheduled",
    payment: "Pending",
  },
  {
    id: "APT-1005",
    token: "05",
    patient: "Vikas Jain",
    uhid: "UHID-10025",
    doctor: "Dr. Raj Mehta",
    department: "Orthopedics",
    time: "11:00 AM",
    type: "New",
    status: "No-show",
    payment: "Pending",
  },
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState(appointmentsData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredAppointments = appointments.filter((appointment) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      appointment.patient.toLowerCase().includes(searchText) ||
      appointment.uhid.toLowerCase().includes(searchText) ||
      appointment.doctor.toLowerCase().includes(searchText) ||
      appointment.id.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" || appointment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status: newStatus }
          : appointment
      )
    );
  };

  const todayCount = appointments.length;

  const scheduledCount = appointments.filter(
    (item) => item.status === "Scheduled"
  ).length;

  const checkedInCount = appointments.filter(
    (item) => item.status === "Checked-in"
  ).length;

  const completedCount = appointments.filter(
    (item) => item.status === "Completed"
  ).length;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <CalendarDays size={25} />

            <h1 className="text-2xl font-semibold">Appointments</h1>
          </div>

          <p className="text-sm text-gray-500 mt-2">
            Manage today's appointments, queue and patient visits
          </p>
        </div>

        <Link
          href="/receptionist/appointments/add"
          className="bg-white text-black px-5 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition"
        >
          <Plus size={18} />
          New Appointment
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Today's Appointments"
          value={todayCount}
          icon={<CalendarDays size={20} />}
        />

        <StatCard
          title="Scheduled"
          value={scheduledCount}
          icon={<Clock size={20} />}
        />

        <StatCard
          title="Checked-in"
          value={checkedInCount}
          icon={<User size={20} />}
        />

        <StatCard
          title="Completed"
          value={completedCount}
          icon={<CheckCircle2 size={20} />}
        />
      </div>

      {/* Today's Queue */}
      <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-medium">Today's Queue</h2>
            <p className="text-xs text-gray-500 mt-1">
              Current patient appointment flow
            </p>
          </div>

          <span className="text-xs text-gray-500">
            {new Date().toLocaleDateString("en-IN")}
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {appointments.slice(0, 5).map((appointment) => (
            <div
              key={appointment.id}
              className="min-w-[220px] bg-black border border-gray-800 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500">
                  Token #{appointment.token}
                </span>

                <StatusBadge status={appointment.status} />
              </div>

              <p className="font-medium text-sm">{appointment.patient}</p>

              <p className="text-xs text-gray-500 mt-1">
                {appointment.doctor}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-400 mt-3">
                <Clock size={14} />
                {appointment.time}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl p-5 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              placeholder="Search patient, UHID, doctor or appointment ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black border border-gray-800 rounded-lg pl-11 pr-4 py-3 text-sm outline-none focus:border-gray-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-300 outline-none"
          >
            <option value="All">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Checked-in">Checked-in</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="No-show">No-show</option>
          </select>
        </div>
      </div>

      {/* Appointment Table */}
      <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-gray-800">
          <h2 className="text-lg font-medium">Appointment List</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="px-5 py-4 text-xs font-medium text-gray-500">
                  Token
                </th>

                <th className="px-5 py-4 text-xs font-medium text-gray-500">
                  Patient
                </th>

                <th className="px-5 py-4 text-xs font-medium text-gray-500">
                  Doctor
                </th>

                <th className="px-5 py-4 text-xs font-medium text-gray-500">
                  Department
                </th>

                <th className="px-5 py-4 text-xs font-medium text-gray-500">
                  Time
                </th>

                <th className="px-5 py-4 text-xs font-medium text-gray-500">
                  Type
                </th>

                <th className="px-5 py-4 text-xs font-medium text-gray-500">
                  Status
                </th>

                <th className="px-5 py-4 text-xs font-medium text-gray-500">
                  Payment
                </th>

                <th className="px-5 py-4 text-xs font-medium text-gray-500 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="border-b border-gray-900 hover:bg-[#111] transition"
                  >
                    {/* Token */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white text-black text-sm font-semibold">
                        {appointment.token}
                      </span>
                    </td>

                    {/* Patient */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium">
                          {appointment.patient}
                        </p>

                        <p className="text-xs text-gray-600 mt-1">
                          {appointment.uhid}
                        </p>
                      </div>
                    </td>

                    {/* Doctor */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Stethoscope
                          size={16}
                          className="text-gray-500"
                        />

                        <span className="text-sm text-gray-300">
                          {appointment.doctor}
                        </span>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-5 py-4 text-sm text-gray-400">
                      {appointment.department}
                    </td>

                    {/* Time */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock size={15} className="text-gray-500" />
                        {appointment.time}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4">
                      <span className="text-xs px-2.5 py-1 rounded-md border border-gray-800 text-gray-400">
                        {appointment.type}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={appointment.status} />
                    </td>

                    {/* Payment */}
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs ${
                          appointment.payment === "Paid"
                            ? "text-gray-300"
                            : "text-gray-500"
                        }`}
                      >
                        {appointment.payment}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          title="View Appointment"
                          className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-900 transition"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          title="Edit Appointment"
                          className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-900 transition"
                        >
                          <Pencil size={17} />
                        </button>

                        {appointment.status === "Scheduled" && (
                          <button
                            title="Check-in Patient"
                            onClick={() =>
                              updateStatus(
                                appointment.id,
                                "Checked-in"
                              )
                            }
                            className="px-3 py-2 rounded-lg text-xs border border-gray-800 text-gray-400 hover:bg-white hover:text-black transition"
                          >
                            Check-in
                          </button>
                        )}

                        <button
                          title="More Actions"
                          className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-900 transition"
                        >
                          <MoreHorizontal size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-5 py-12 text-center">
                    <CalendarDays
                      size={32}
                      className="mx-auto text-gray-700 mb-3"
                    />

                    <p className="text-sm text-gray-500">
                      No appointments found
                    </p>

                    <p className="text-xs text-gray-700 mt-1">
                      Try changing your search or filter
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-800 flex items-center justify-between">
          <p className="text-xs text-gray-600">
            Showing {filteredAppointments.length} of{" "}
            {appointments.length} appointments
          </p>

          <button className="text-gray-500 hover:text-white transition">
            <XCircle size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Stat Card ---------------- */

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h3 className="text-2xl font-semibold mt-2">{value}</h3>
        </div>

        <div className="p-3 rounded-lg bg-black border border-gray-800 text-gray-400">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Status Badge ---------------- */

function StatusBadge({ status }) {
  const statusClasses = {
    Scheduled: "border-gray-700 text-gray-400",
    "Checked-in": "border-gray-500 text-gray-300",
    Completed: "border-gray-600 text-gray-300",
    Cancelled: "border-gray-800 text-gray-600",
    "No-show": "border-gray-800 text-gray-500",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md border text-xs ${
        statusClasses[status] || "border-gray-800 text-gray-500"
      }`}
    >
      {status}
    </span>
  );
}