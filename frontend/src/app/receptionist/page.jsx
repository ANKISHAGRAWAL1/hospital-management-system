"use client";

import {
  CalendarDays,
  Users,
  Clock3,
  UserCheck,
  Stethoscope,
  UserPlus,
  Receipt,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function ReceptionistPage() {
  const stats = [
    {
      title: "Today's Appointments",
      value: "42",
      subtitle: "8 remaining",
      icon: CalendarDays,
    },
    {
      title: "Waiting Patients",
      value: "08",
      subtitle: "Currently waiting",
      icon: Clock3,
    },
    {
      title: "Checked-in",
      value: "18",
      subtitle: "Today's patients",
      icon: UserCheck,
    },
    {
      title: "Available Doctors",
      value: "06",
      subtitle: "Currently available",
      icon: Stethoscope,
    },
  ];

  const appointments = [
    {
      id: "APT-1024",
      patient: "Rahul Sharma",
      doctor: "Dr. Amit Verma",
      department: "Cardiology",
      time: "10:30 AM",
      status: "Waiting",
    },
    {
      id: "APT-1025",
      patient: "Priya Gupta",
      doctor: "Dr. Neha Singh",
      department: "Dermatology",
      time: "11:00 AM",
      status: "Checked-in",
    },
    {
      id: "APT-1026",
      patient: "Rakesh Kumar",
      doctor: "Dr. Raj Meena",
      department: "Orthopedics",
      time: "11:30 AM",
      status: "Scheduled",
    },
    {
      id: "APT-1027",
      patient: "Pooja Sharma",
      doctor: "Dr. Amit Verma",
      department: "Cardiology",
      time: "12:00 PM",
      status: "Waiting",
    },
  ];

  const queue = [
    {
      token: "A-021",
      patient: "Mohit Sharma",
      doctor: "Dr. Amit Verma",
      wait: "12 min",
    },
    {
      token: "A-022",
      patient: "Kavita Gupta",
      doctor: "Dr. Neha Singh",
      wait: "8 min",
    },
    {
      token: "A-023",
      patient: "Anil Kumar",
      doctor: "Dr. Raj Meena",
      wait: "5 min",
    },
  ];

  const quickActions = [
    {
      title: "Register Patient",
      subtitle: "Create new patient",
      icon: UserPlus,
      href: "/receptionist/patients/add",
    },
    {
      title: "Book Appointment",
      subtitle: "Schedule appointment",
      icon: CalendarDays,
      href: "/receptionist/appointments/add",
    },
    {
      title: "Walk-in Patient",
      subtitle: "Create walk-in visit",
      icon: Users,
      href: "/receptionist/walk-in",
    },
    {
      title: "Collect Payment",
      subtitle: "Manage pending payment",
      icon: Receipt,
      href: "/receptionist/billing",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">

      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-white">
          Receptionist Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage patients, appointments and today's front-desk operations.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-7">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="bg-gray-950 border border-gray-800 rounded-xl p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {item.title}
                  </p>

                  <h2 className="text-3xl font-bold text-white mt-2">
                    {item.value}
                  </h2>

                  <p className="text-xs text-gray-500 mt-2">
                    {item.subtitle}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-gray-900">
                  <Icon size={21} className="text-gray-300" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 mb-7">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Quick Actions
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Frequently used receptionist actions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <a
                key={action.title}
                href={action.href}
                className="flex items-center gap-4 p-4 border border-gray-800 rounded-xl hover:border-gray-600 hover:bg-gray-900 transition"
              >
                <div className="p-3 bg-gray-900 rounded-lg">
                  <Icon size={20} className="text-gray-300" />
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white">
                    {action.title}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    {action.subtitle}
                  </p>
                </div>

                <ArrowRight
                  size={17}
                  className="text-gray-600"
                />
              </a>
            );
          })}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Today's Appointments */}
        <div className="xl:col-span-2 bg-gray-950 border border-gray-800 rounded-xl">

          <div className="flex items-center justify-between p-5 border-b border-gray-800">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Today's Appointments
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Upcoming patient appointments
              </p>
            </div>

            <a
              href="/receptionist/appointments"
              className="text-sm font-medium text-gray-400 hover:text-white"
            >
              View All
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              <thead>
                <tr className="border-b border-gray-800 text-left">
                  <th className="px-5 py-3 font-medium text-gray-500">
                    Patient
                  </th>

                  <th className="px-5 py-3 font-medium text-gray-500">
                    Doctor
                  </th>

                  <th className="px-5 py-3 font-medium text-gray-500">
                    Time
                  </th>

                  <th className="px-5 py-3 font-medium text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="border-b border-gray-900 last:border-0"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-white">
                          {appointment.patient}
                        </p>

                        <p className="text-xs text-gray-600 mt-1">
                          {appointment.id}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-gray-300">
                        {appointment.doctor}
                      </p>

                      <p className="text-xs text-gray-600 mt-1">
                        {appointment.department}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-gray-400">
                      {appointment.time}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          appointment.status === "Waiting"
                            ? "bg-yellow-950 text-yellow-400"
                            : appointment.status === "Checked-in"
                            ? "bg-green-950 text-green-400"
                            : "bg-gray-900 text-gray-400"
                        }`}
                      >
                        {appointment.status === "Waiting" && (
                          <AlertCircle size={13} />
                        )}

                        {appointment.status === "Checked-in" && (
                          <CheckCircle2 size={13} />
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

        {/* Waiting Queue */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl">

          <div className="p-5 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">
              Waiting Queue
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Patients currently waiting
            </p>
          </div>

          <div className="p-5 space-y-4">
            {queue.map((patient) => (
              <div
                key={patient.token}
                className="flex items-center gap-3 pb-4 border-b border-gray-900 last:border-0 last:pb-0"
              >
                <div className="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center text-xs font-semibold">
                  {patient.token}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">
                    {patient.patient}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {patient.doctor}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    Waiting
                  </p>

                  <p className="text-xs font-medium text-gray-300 mt-1">
                    {patient.wait}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 pb-5">
            <a
              href="/receptionist/queue"
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-800 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-900 hover:text-white transition"
            >
              Manage Queue
              <ArrowRight size={16} />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}