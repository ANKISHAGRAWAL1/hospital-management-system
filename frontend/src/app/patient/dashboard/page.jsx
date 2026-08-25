"use client";

import Link from "next/link";
import {
  CalendarDays,
  Clock,
  Stethoscope,
  FileText,
  Pill,
  FlaskConical,
  Bell,
  ArrowRight,
  CheckCircle2,
  CircleUserRound,
  MapPin,
  Activity,
  ChevronRight,
} from "lucide-react";

export default function PatientDashboard() {
  const quickActions = [
    {
      title: "Book Appointment",
      description: "Find a doctor and book an appointment",
      icon: CalendarDays,
      href: "/patient/book-appointment",
    },
    {
      title: "My Appointments",
      description: "View and manage your appointments",
      icon: Clock,
      href: "/patient/appointments",
    },
    {
      title: "Prescriptions",
      description: "View your medicines and prescriptions",
      icon: Pill,
      href: "/patient/prescriptions",
    },
    {
      title: "Medical Reports",
      description: "View your medical test reports",
      icon: FlaskConical,
      href: "/patient/reports",
    },
  ];

  const notifications = [
    {
      title: "Appointment Reminder",
      message:
        "Your appointment with Dr. Rahul Sharma is tomorrow at 10:30 AM.",
      time: "10 min ago",
    },
    {
      title: "Lab Report Available",
      message: "Your CBC blood test report is now available.",
      time: "2 hours ago",
    },
    {
      title: "Prescription Updated",
      message: "Dr. Rahul Sharma added a new prescription.",
      time: "Yesterday",
    },
  ];

  const prescriptions = [
    {
      medicine: "Paracetamol 500mg",
      dosage: "1 tablet",
      frequency: "Twice a day",
      duration: "5 Days",
    },
    {
      medicine: "Azithromycin 500mg",
      dosage: "1 tablet",
      frequency: "Once a day",
      duration: "3 Days",
    },
    {
      medicine: "Vitamin D3",
      dosage: "1 capsule",
      frequency: "Once a week",
      duration: "4 Weeks",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="p-4 sm:p-6">
        {/* Welcome Card */}
        <div className="border border-gray-800 bg-[#080808] rounded-xl p-5 sm:p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0">
                <CircleUserRound
                  size={30}
                  className="text-gray-300"
                />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Welcome back
                </p>

                <h1 className="text-xl font-semibold mt-1">
                  Ankish Gupta
                </h1>

                <p className="text-xs text-gray-500 mt-1">
                  Patient ID: PAT-10024
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800">
                <p className="text-xs text-gray-500">
                  Blood Group
                </p>

                <p className="text-sm font-medium mt-1">
                  B+
                </p>
              </div>

              <div className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800">
                <p className="text-xs text-gray-500">
                  Age
                </p>

                <p className="text-sm font-medium mt-1">
                  24
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Upcoming Appointment"
            value="01"
            description="Next appointment"
            icon={CalendarDays}
          />

          <StatCard
            title="Completed Visits"
            value="12"
            description="Total consultations"
            icon={CheckCircle2}
          />

          <StatCard
            title="Prescriptions"
            value="08"
            description="Available prescriptions"
            icon={Pill}
          />

          <StatCard
            title="Medical Reports"
            value="15"
            description="Total reports"
            icon={FileText}
          />
        </div>

        {/* Appointment + Notifications */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          {/* Upcoming Appointment */}
          <div className="xl:col-span-2 border border-gray-800 bg-[#080808] rounded-xl p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <div>
                <h2 className="text-lg font-semibold">
                  Upcoming Appointment
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Your next scheduled appointment
                </p>
              </div>

              <span className="w-fit px-3 py-1.5 rounded-full text-xs bg-green-500/10 text-green-400 border border-green-500/20">
                Confirmed
              </span>
            </div>

            <div className="border border-gray-800 rounded-xl p-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0">
                    <Stethoscope
                      size={26}
                      className="text-gray-300"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Dr. Rahul Sharma
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Cardiologist
                    </p>

                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                      <MapPin size={14} />
                      City Hospital, Jaipur
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <InfoSmall
                    label="Date"
                    value="28 Aug 2026"
                  />

                  <InfoSmall
                    label="Time"
                    value="10:30 AM"
                  />
                </div>
              </div>

              <div className="border-t border-gray-800 mt-5 pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex gap-6">
                  <div>
                    <p className="text-xs text-gray-500">
                      Appointment ID
                    </p>

                    <p className="text-sm font-medium mt-1">
                      AP-20260828-1024
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Token
                    </p>

                    <p className="text-sm font-medium mt-1">
                      #08
                    </p>
                  </div>
                </div>

                <Link
                  href="/patient/appointments"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-gray-200 transition"
                >
                  View Appointment
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="border border-gray-800 bg-[#080808] rounded-xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold">
                  Notifications
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Recent updates
                </p>
              </div>

              <Bell
                size={18}
                className="text-gray-500"
              />
            </div>

            <div className="space-y-4">
              {notifications.map((item, index) => (
                <div
                  key={index}
                  className="pb-4 border-b border-gray-800 last:border-0"
                >
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-white mt-2 shrink-0" />

                    <div>
                      <h3 className="text-sm font-medium">
                        {item.title}
                      </h3>

                      <p className="text-xs text-gray-500 mt-1 leading-5">
                        {item.message}
                      </p>

                      <p className="text-[11px] text-gray-600 mt-2">
                        {item.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/patient/notifications"
              className="w-full mt-4 py-2.5 border border-gray-800 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-900 transition flex items-center justify-center"
            >
              View All Notifications
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              Quick Actions
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Quickly access important features
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {quickActions.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  href={item.href}
                  key={item.title}
                  className="text-left border border-gray-800 bg-[#080808] rounded-xl p-5 hover:bg-gray-900 hover:border-gray-700 transition group"
                >
                  <div className="w-11 h-11 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center mb-4">
                    <Icon
                      size={20}
                      className="text-gray-300"
                    />
                  </div>

                  <h3 className="font-medium">
                    {item.title}
                  </h3>

                  <p className="text-xs text-gray-500 mt-2 leading-5">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-4 group-hover:text-white">
                    Open
                    <ChevronRight size={14} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Prescriptions */}
          <div className="border border-gray-800 bg-[#080808] rounded-xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold">
                  Recent Prescriptions
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Your latest prescribed medicines
                </p>
              </div>

              <Pill
                size={19}
                className="text-gray-500"
              />
            </div>

            <div className="space-y-3">
              {prescriptions.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-800 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-medium">
                      {item.medicine}
                    </h3>

                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-gray-900 text-gray-400 border border-gray-800">
                      {item.duration}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-[11px] text-gray-600">
                        Dosage
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {item.dosage}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] text-gray-600">
                        Frequency
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {item.frequency}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/patient/prescriptions"
              className="w-full mt-4 py-2.5 border border-gray-800 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-900 transition flex items-center justify-center"
            >
              View All Prescriptions
            </Link>
          </div>

          {/* Medical Summary */}
          <div className="border border-gray-800 bg-[#080808] rounded-xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold">
                  Medical Summary
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Your basic health information
                </p>
              </div>

              <Activity
                size={19}
                className="text-gray-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InfoBox
                label="Blood Group"
                value="B+"
              />

              <InfoBox
                label="Height"
                value="172 cm"
              />

              <InfoBox
                label="Weight"
                value="68 kg"
              />

              <InfoBox
                label="Allergies"
                value="None"
              />

              <InfoBox
                label="Emergency Contact"
                value="+91 98765 43210"
              />

              <InfoBox
                label="Insurance"
                value="Active"
              />
            </div>

            <div className="flex items-center justify-between border-t border-gray-800 mt-5 pt-5">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Activity size={16} />
                Insurance Status
              </div>

              <span className="text-xs text-green-400">
                Active
              </span>
            </div>

            <Link
              href="/patient/medical-history"
              className="w-full mt-4 py-2.5 border border-gray-800 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-900 transition flex items-center justify-center"
            >
              View Medical History
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------------- Stat Card ---------------- */

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}) {
  return (
    <div className="border border-gray-800 bg-[#080808] rounded-xl p-5 hover:border-gray-700 transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h3 className="text-2xl font-semibold mt-2">
            {value}
          </h3>

          <p className="text-xs text-gray-600 mt-1">
            {description}
          </p>
        </div>

        <div className="w-10 h-10 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center">
          <Icon
            size={19}
            className="text-gray-400"
          />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Small Info ---------------- */

function InfoSmall({ label, value }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 min-w-[115px]">
      <p className="text-[11px] text-gray-600">
        {label}
      </p>

      <p className="text-xs font-medium text-gray-300 mt-1">
        {value}
      </p>
    </div>
  );
}

/* ---------------- Info Box ---------------- */

function InfoBox({ label, value }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <p className="text-[11px] text-gray-600">
        {label}
      </p>

      <p className="text-sm font-medium text-gray-300 mt-1">
        {value}
      </p>
    </div>
  );
}