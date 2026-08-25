"use client";

import {
  CalendarDays,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  UserRound,
  ArrowUpRight,
  MoreHorizontal,
  Activity,
} from "lucide-react";

export default function DoctorDashboard() {
  const stats = [
    {
      title: "Today's Appointments",
      value: "12",
      sub: "+2 from yesterday",
      icon: CalendarDays,
    },
    {
      title: "Patients Seen",
      value: "07",
      sub: "58% of today's schedule",
      icon: Users,
    },
    {
      title: "Completed",
      value: "07",
      sub: "5 remaining",
      icon: CheckCircle2,
    },
    {
      title: "Avg. Consultation",
      value: "24 min",
      sub: "6 min below target",
      icon: Clock,
    },
  ];

  const appointments = [
    {
      id: 1,
      time: "10:00 AM",
      patient: "Rahul Sharma",
      age: "42 yrs",
      type: "New Visit",
      status: "Completed",
    },
    {
      id: 2,
      time: "10:30 AM",
      patient: "Amit Kumar",
      age: "35 yrs",
      type: "Follow-up",
      status: "Completed",
    },
    {
      id: 3,
      time: "11:00 AM",
      patient: "Priya Gupta",
      age: "29 yrs",
      type: "New Visit",
      status: "In Progress",
    },
    {
      id: 4,
      time: "11:30 AM",
      patient: "Mohit Singh",
      age: "51 yrs",
      type: "Follow-up",
      status: "Waiting",
    },
    {
      id: 5,
      time: "12:00 PM",
      patient: "Neha Sharma",
      age: "38 yrs",
      type: "Follow-up",
      status: "Upcoming",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-8">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <p className="text-sm text-gray-500 mb-1">
            Monday, August 24, 2026
          </p>

          <h1 className="text-2xl font-semibold">
            Good Morning, Dr. Raj Sharma
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Here's what's happening with your practice today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-lg">
            <Activity size={17} className="text-gray-400" />

            <span className="text-sm text-gray-300">
              Clinic Status
            </span>

            <span className="w-2 h-2 rounded-full bg-white" />

            <span className="text-sm text-gray-400">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="bg-gray-950 border border-gray-800 rounded-xl p-5"
            >
              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm text-gray-500">
                    {item.title}
                  </p>

                  <h2 className="text-3xl font-semibold mt-3">
                    {item.value}
                  </h2>

                  <p className="text-xs text-gray-500 mt-2">
                    {item.sub}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-gray-900">
                  <Icon size={19} className="text-gray-300" />
                </div>

              </div>
            </div>
          );
        })}

      </div>

      {/* Main Dashboard */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Appointment Queue */}
        <div className="xl:col-span-2 bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">

          <div className="flex items-center justify-between p-5 border-b border-gray-800">

            <div>
              <h2 className="font-semibold">
                Today's Patient Queue
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Real-time appointment status
              </p>
            </div>

            <button className="p-2 rounded-lg hover:bg-gray-900">
              <MoreHorizontal size={19} />
            </button>

          </div>

          <div className="divide-y divide-gray-800">

            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="px-5 py-4 flex items-center gap-4"
              >

                {/* Time */}
                <div className="w-20 shrink-0">
                  <p className="text-sm font-medium">
                    {appointment.time}
                  </p>
                </div>

                {/* Patient */}
                <div className="flex items-center gap-3 flex-1 min-w-0">

                  <div className="w-10 h-10 shrink-0 rounded-full bg-gray-900 flex items-center justify-center">
                    <UserRound size={18} className="text-gray-400" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {appointment.patient}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {appointment.age} • {appointment.type}
                    </p>
                  </div>

                </div>

                {/* Status */}
                <span
                  className={`text-xs px-3 py-1.5 rounded-full shrink-0 ${
                    appointment.status === "Completed"
                      ? "bg-gray-800 text-gray-300"
                      : appointment.status === "In Progress"
                      ? "bg-white text-black"
                      : appointment.status === "Waiting"
                      ? "border border-gray-700 text-gray-300"
                      : "text-gray-500"
                  }`}
                >
                  {appointment.status}
                </span>

              </div>
            ))}

          </div>
        </div>

        {/* Current Patient */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">

          <div className="p-5 border-b border-gray-800">
            <div className="flex items-center justify-between">

              <div>
                <h2 className="font-semibold">
                  Current Patient
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Consultation in progress
                </p>
              </div>

              <span className="w-2.5 h-2.5 rounded-full bg-white" />

            </div>
          </div>

          <div className="p-6">

            {/* Patient Profile */}
            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center">
                <UserRound size={25} className="text-gray-400" />
              </div>

              <div>
                <h3 className="font-medium">
                  Priya Gupta
                </h3>

                <p className="text-sm text-gray-500">
                  29 yrs • Female
                </p>

                <p className="text-xs text-gray-600 mt-1">
                  Patient ID: PT-1024
                </p>
              </div>

            </div>

            {/* Consultation Info */}
            <div className="mt-6 space-y-4">

              <div>
                <p className="text-xs text-gray-500">
                  Appointment
                </p>

                <p className="text-sm mt-1">
                  11:00 AM • New Visit
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Reason for Visit
                </p>

                <p className="text-sm mt-1">
                  Chest discomfort and fatigue
                </p>
              </div>

            </div>

            <button className="w-full mt-6 flex items-center justify-center gap-2 bg-white text-black rounded-lg py-3 text-sm font-medium hover:bg-gray-200">
              Continue Consultation
              <ArrowUpRight size={16} />
            </button>

          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

        {/* Today's Progress */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-5">

          <div className="flex items-center justify-between mb-5">

            <div>
              <h2 className="font-semibold">
                Today's Progress
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Appointment completion
              </p>
            </div>

            <span className="text-sm text-gray-400">
              7 / 12
            </span>

          </div>

          <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: "58%" }}
            />
          </div>

          <div className="flex justify-between mt-3 text-xs text-gray-500">
            <span>58% Completed</span>
            <span>5 Remaining</span>
          </div>

        </div>

        {/* Alerts */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-5">

          <div className="flex items-center gap-2 mb-5">
            <AlertCircle size={18} className="text-gray-400" />

            <div>
              <h2 className="font-semibold">
                Attention Required
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Important updates
              </p>
            </div>
          </div>

          <div className="space-y-3">

            <div className="flex items-center justify-between p-3 bg-black border border-gray-800 rounded-lg">

              <div>
                <p className="text-sm">
                  1 patient waiting
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Mohit Singh • 11:30 AM
                </p>
              </div>

              <ArrowUpRight size={16} className="text-gray-500" />

            </div>

            <div className="flex items-center justify-between p-3 bg-black border border-gray-800 rounded-lg">

              <div>
                <p className="text-sm">
                  Next break
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  01:00 PM - 02:00 PM
                </p>
              </div>

              <Clock size={16} className="text-gray-500" />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}