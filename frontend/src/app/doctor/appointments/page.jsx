"use client";

import { useState } from "react";
import {
  Search,
  CalendarDays,
  Clock,
  UserRound,
  MoreHorizontal,
  Eye,
  Play,
  CheckCircle2,
  XCircle,
  Filter,
} from "lucide-react";
import Link from "next/link";

export default function DoctorAppointments() {
  const [activeTab, setActiveTab] = useState("Today");
  const [search, setSearch] = useState("");

  const appointments = [
    {
      id: "APT-1001",
      time: "10:00 AM",
      patient: "Rahul Sharma",
      age: 42,
      gender: "Male",
      type: "New Visit",
      reason: "Chest Pain",
      status: "Completed",
    },
    {
      id: "APT-1002",
      time: "10:30 AM",
      patient: "Amit Kumar",
      age: 35,
      gender: "Male",
      type: "Follow-up",
      reason: "Blood Pressure",
      status: "Completed",
    },
    {
      id: "APT-1003",
      time: "11:00 AM",
      patient: "Priya Gupta",
      age: 29,
      gender: "Female",
      type: "New Visit",
      reason: "Fatigue",
      status: "In Progress",
    },
    {
      id: "APT-1004",
      time: "11:30 AM",
      patient: "Mohit Singh",
      age: 51,
      gender: "Male",
      type: "Follow-up",
      reason: "Diabetes",
      status: "Waiting",
    },
    {
      id: "APT-1005",
      time: "12:00 PM",
      patient: "Neha Sharma",
      age: 38,
      gender: "Female",
      type: "Follow-up",
      reason: "Headache",
      status: "Upcoming",
    },
    {
      id: "APT-1006",
      time: "12:30 PM",
      patient: "Vikas Gupta",
      age: 45,
      gender: "Male",
      type: "New Visit",
      reason: "Back Pain",
      status: "Upcoming",
    },
  ];

  const tabs = [
    "Today",
    "Upcoming",
    "Completed",
    "Cancelled",
  ];

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch = appointment.patient
      .toLowerCase()
      .includes(search.toLowerCase());

    if (activeTab === "Today") {
      return matchesSearch;
    }

    if (activeTab === "Upcoming") {
      return (
        matchesSearch &&
        (appointment.status === "Upcoming" ||
          appointment.status === "Waiting" ||
          appointment.status === "In Progress")
      );
    }

    if (activeTab === "Completed") {
      return (
        matchesSearch &&
        appointment.status === "Completed"
      );
    }

    if (activeTab === "Cancelled") {
      return (
        matchesSearch &&
        appointment.status === "Cancelled"
      );
    }

    return matchesSearch;
  });

  const getStatusClass = (status) => {
    if (status === "Completed") {
      return "bg-gray-800 text-gray-300";
    }

    if (status === "In Progress") {
      return "bg-white text-black";
    }

    if (status === "Waiting") {
      return "border border-gray-700 text-gray-300";
    }

    if (status === "Cancelled") {
      return "bg-gray-900 text-gray-600";
    }

    return "bg-gray-900 text-gray-400";
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-8">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>
          <p className="text-sm text-gray-500 mb-1">
            Monday, August 24, 2026
          </p>

          <h1 className="text-2xl font-semibold">
            Appointments
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage your patient appointments and consultation queue.
          </p>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 bg-gray-950 border border-gray-800 rounded-lg px-4 py-3">
          <CalendarDays size={17} className="text-gray-500" />

          <span className="text-sm text-gray-300">
            August 24, 2026
          </span>
        </div>

      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-500">
            Total Today
          </p>

          <p className="text-2xl font-semibold mt-2">
            12
          </p>
        </div>

        <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-500">
            Waiting
          </p>

          <p className="text-2xl font-semibold mt-2">
            1
          </p>
        </div>

        <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-500">
            In Progress
          </p>

          <p className="text-2xl font-semibold mt-2">
            1
          </p>
        </div>

        <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-500">
            Completed
          </p>

          <p className="text-2xl font-semibold mt-2">
            7
          </p>
        </div>

      </div>

      {/* Main Card */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">

        {/* Tabs + Search */}
        <div className="p-5 border-b border-gray-800">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            {/* Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto">

              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition ${
                    activeTab === tab
                      ? "bg-white text-black"
                      : "text-gray-500 hover:text-white hover:bg-gray-900"
                  }`}
                >
                  {tab}
                </button>
              ))}

            </div>

            {/* Search + Filter */}
            <div className="flex items-center gap-3">

              <div className="flex items-center gap-2 bg-black border border-gray-800 rounded-lg px-3 py-2.5">

                <Search
                  size={17}
                  className="text-gray-500"
                />

                <input
                  type="text"
                  placeholder="Search patient..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="bg-transparent outline-none text-sm text-white placeholder:text-gray-600 w-48"
                />

              </div>

              <button className="flex items-center gap-2 px-3 py-2.5 bg-black border border-gray-800 rounded-lg text-sm text-gray-400 hover:text-white">
                <Filter size={16} />
                Filter
              </button>

            </div>

          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px]">

            <thead>
              <tr className="border-b border-gray-800 text-left">

                <th className="px-5 py-4 text-xs font-medium text-gray-500">
                  TIME
                </th>

                <th className="px-5 py-4 text-xs font-medium text-gray-500">
                  PATIENT
                </th>

                <th className="px-5 py-4 text-xs font-medium text-gray-500">
                  TYPE
                </th>

                <th className="px-5 py-4 text-xs font-medium text-gray-500">
                  REASON
                </th>

                <th className="px-5 py-4 text-xs font-medium text-gray-500">
                  STATUS
                </th>

                <th className="px-5 py-4 text-xs font-medium text-gray-500 text-right">
                  ACTION
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">

              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="hover:bg-black/40 transition"
                  >

                    {/* Time */}
                    <td className="px-5 py-5">

                      <div className="flex items-center gap-2">

                        <Clock
                          size={16}
                          className="text-gray-500"
                        />

                        <span className="text-sm">
                          {appointment.time}
                        </span>

                      </div>

                    </td>

                    {/* Patient */}
                    <td className="px-5 py-5">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                          <UserRound
                            size={18}
                            className="text-gray-400"
                          />
                        </div>

                        <div>
                          <p className="text-sm font-medium">
                            {appointment.patient}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {appointment.age} yrs •{" "}
                            {appointment.gender}
                          </p>
                        </div>

                      </div>

                    </td>

                    {/* Type */}
                    <td className="px-5 py-5">
                      <span className="text-sm text-gray-400">
                        {appointment.type}
                      </span>
                    </td>

                    {/* Reason */}
                    <td className="px-5 py-5">
                      <span className="text-sm text-gray-400">
                        {appointment.reason}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-5">

                      <span
                        className={`inline-flex px-3 py-1.5 rounded-full text-xs ${getStatusClass(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>

                    </td>

                    {/* Actions */}
                    <td className="px-5 py-5">

                      <div className="flex items-center justify-end gap-2">

                        {/* View */}
                        <Link
  href={`/doctor/patients/${appointment.id}`}
  title="View Patient"
  className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-900"
>
  <Eye size={17} />
</Link>
                        {/* Start */}
                        {(appointment.status ===
                          "Waiting" ||
                          appointment.status ===
                            "Upcoming") && (
                          <button
                            title="Start Consultation"
                            className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-900"
                          >
                            <Play size={17} />
                          </button>
                        )}

                        {/* Complete */}
                        {appointment.status ===
                          "In Progress" && (
                          <button
                            title="Complete"
                            className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-900"
                          >
                            <CheckCircle2 size={17} />
                          </button>
                        )}

                        {/* More */}
                        <button
                          title="More"
                          className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-900"
                        >
                          <MoreHorizontal size={17} />
                        </button>

                      </div>

                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-16 text-center"
                  >
                    <p className="text-gray-500 text-sm">
                      No appointments found
                    </p>
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}