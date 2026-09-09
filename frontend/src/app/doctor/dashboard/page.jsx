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
    <div className="min-h-screen bg-[#F6F8FB] text-gray-900 p-6 lg:p-8">

      {/* ========================================= */}
      {/* PAGE HEADER */}
      {/* ========================================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

        <div>
          <p className="text-sm text-gray-500 mb-1">
            Monday, August 24, 2026
          </p>

          <h1 className="text-2xl font-semibold text-gray-900">
            Good Morning, Dr. Raj Sharma
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Here's what's happening with your practice today.
          </p>
        </div>

        {/* Clinic Status */}

        <div
          className="
            inline-flex
            items-center
            gap-2
            px-4
            py-2.5
            bg-white
            border
            border-gray-200
            rounded-xl
            shadow-sm
            w-fit
          "
        >
          <Activity
            size={17}
            className="text-blue-600"
          />

          <span className="text-sm text-gray-600">
            Clinic Status
          </span>

          <span className="w-2 h-2 rounded-full bg-emerald-500" />

          <span className="text-sm font-medium text-emerald-600">
            Active
          </span>
        </div>
      </div>

      {/* ========================================= */}
      {/* KPI CARDS */}
      {/* ========================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-7">

        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="
                bg-white
                border
                border-gray-200
                rounded-2xl
                p-5
                shadow-sm
                hover:shadow-md
                transition
              "
            >
              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm text-gray-500">
                    {item.title}
                  </p>

                  <h2 className="text-3xl font-semibold text-gray-900 mt-3">
                    {item.value}
                  </h2>

                  <p className="text-xs text-gray-500 mt-2">
                    {item.sub}
                  </p>
                </div>

                <div
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-blue-50
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Icon
                    size={19}
                    className="text-blue-600"
                  />
                </div>

              </div>
            </div>
          );
        })}

      </div>

      {/* ========================================= */}
      {/* MAIN DASHBOARD */}
      {/* ========================================= */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ===================================== */}
        {/* APPOINTMENT QUEUE */}
        {/* ===================================== */}

        <div
          className="
            xl:col-span-2
            bg-white
            border
            border-gray-200
            rounded-2xl
            overflow-hidden
            shadow-sm
          "
        >

          {/* Header */}

          <div className="flex items-center justify-between p-5 border-b border-gray-100">

            <div>
              <h2 className="font-semibold text-gray-900">
                Today's Patient Queue
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Real-time appointment status
              </p>
            </div>

            <button
              type="button"
              className="
                p-2
                rounded-lg
                text-gray-500
                hover:bg-gray-100
                hover:text-gray-700
                transition
              "
            >
              <MoreHorizontal size={19} />
            </button>

          </div>

          {/* Appointment List */}

          <div className="divide-y divide-gray-100">

            {appointments.map((appointment) => (

              <div
                key={appointment.id}
                className="
                  px-5
                  py-4
                  flex
                  items-center
                  gap-4
                  hover:bg-gray-50
                  transition
                "
              >

                {/* Time */}

                <div className="w-20 shrink-0">
                  <p className="text-sm font-medium text-gray-800">
                    {appointment.time}
                  </p>
                </div>

                {/* Patient */}

                <div className="flex items-center gap-3 flex-1 min-w-0">

                  <div
                    className="
                      w-10
                      h-10
                      shrink-0
                      rounded-full
                      bg-blue-50
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <UserRound
                      size={18}
                      className="text-blue-600"
                    />
                  </div>

                  <div className="min-w-0">

                    <p className="text-sm font-medium text-gray-900 truncate">
                      {appointment.patient}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {appointment.age} • {appointment.type}
                    </p>

                  </div>

                </div>

                {/* Status */}

                <span
                  className={`
                    text-xs
                    px-3
                    py-1.5
                    rounded-full
                    shrink-0
                    font-medium

                    ${
                      appointment.status === "Completed"
                        ? "bg-emerald-50 text-emerald-700"
                        : appointment.status === "In Progress"
                        ? "bg-blue-50 text-blue-700"
                        : appointment.status === "Waiting"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-gray-100 text-gray-600"
                    }
                  `}
                >
                  {appointment.status}
                </span>

              </div>

            ))}

          </div>
        </div>

        {/* ===================================== */}
        {/* CURRENT PATIENT */}
        {/* ===================================== */}

        <div
          className="
            bg-white
            border
            border-gray-200
            rounded-2xl
            overflow-hidden
            shadow-sm
          "
        >

          {/* Header */}

          <div className="p-5 border-b border-gray-100">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="font-semibold text-gray-900">
                  Current Patient
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Consultation in progress
                </p>

              </div>

              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />

            </div>

          </div>

          {/* Patient */}

          <div className="p-6">

            <div className="flex items-center gap-4">

              <div
                className="
                  w-14
                  h-14
                  rounded-full
                  bg-blue-50
                  flex
                  items-center
                  justify-center
                "
              >
                <UserRound
                  size={25}
                  className="text-blue-600"
                />
              </div>

              <div>

                <h3 className="font-medium text-gray-900">
                  Priya Gupta
                </h3>

                <p className="text-sm text-gray-500">
                  29 yrs • Female
                </p>

                <p className="text-xs text-gray-400 mt-1">
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

                <p className="text-sm text-gray-800 mt-1">
                  11:00 AM • New Visit
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Reason for Visit
                </p>

                <p className="text-sm text-gray-800 mt-1">
                  Chest discomfort and fatigue
                </p>
              </div>

            </div>

            {/* Button */}

            <button
              type="button"
              className="
                w-full
                mt-6
                flex
                items-center
                justify-center
                gap-2
                bg-blue-600
                hover:bg-blue-700
                text-white
                rounded-xl
                py-3
                text-sm
                font-medium
                transition
                shadow-sm
              "
            >
              Continue Consultation

              <ArrowUpRight size={16} />
            </button>

          </div>
        </div>

      </div>

      {/* ========================================= */}
      {/* BOTTOM SECTION */}
      {/* ========================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

        {/* ===================================== */}
        {/* TODAY'S PROGRESS */}
        {/* ===================================== */}

        <div
          className="
            bg-white
            border
            border-gray-200
            rounded-2xl
            p-5
            shadow-sm
          "
        >

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="font-semibold text-gray-900">
                Today's Progress
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Appointment completion
              </p>

            </div>

            <span className="text-sm font-medium text-gray-700">
              7 / 12
            </span>

          </div>

          {/* Progress */}

          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">

            <div
              className="
                h-full
                bg-blue-600
                rounded-full
              "
              style={{ width: "58%" }}
            />

          </div>

          <div className="flex justify-between mt-3 text-xs text-gray-500">

            <span>
              58% Completed
            </span>

            <span>
              5 Remaining
            </span>

          </div>

        </div>

        {/* ===================================== */}
        {/* ALERTS */}
        {/* ===================================== */}

        <div
          className="
            bg-white
            border
            border-gray-200
            rounded-2xl
            p-5
            shadow-sm
          "
        >

          <div className="flex items-center gap-2 mb-5">

            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">

              <AlertCircle
                size={18}
                className="text-amber-600"
              />

            </div>

            <div>

              <h2 className="font-semibold text-gray-900">
                Attention Required
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Important updates
              </p>

            </div>

          </div>

          <div className="space-y-3">

            {/* Waiting patient */}

            <div
              className="
                flex
                items-center
                justify-between
                p-3
                bg-amber-50/50
                border
                border-amber-100
                rounded-xl
              "
            >

              <div>

                <p className="text-sm font-medium text-gray-800">
                  1 patient waiting
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Mohit Singh • 11:30 AM
                </p>

              </div>

              <ArrowUpRight
                size={16}
                className="text-gray-400"
              />

            </div>

            {/* Break */}

            <div
              className="
                flex
                items-center
                justify-between
                p-3
                bg-gray-50
                border
                border-gray-100
                rounded-xl
              "
            >

              <div>

                <p className="text-sm font-medium text-gray-800">
                  Next break
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  01:00 PM - 02:00 PM
                </p>

              </div>

              <Clock
                size={16}
                className="text-gray-400"
              />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}