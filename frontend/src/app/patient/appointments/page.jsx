"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  Stethoscope,
  MapPin,
  Eye,
  XCircle,
  CheckCircle2,
  RotateCcw,
  Search,
  Filter,
  ChevronRight,
} from "lucide-react";

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [search, setSearch] = useState("");
  const [cancelledIds, setCancelledIds] = useState([]);

  const appointments = [
    {
      id: "AP-20260828-1024",
      doctor: "Dr. Rahul Sharma",
      department: "Cardiology",
      date: "28 Aug 2026",
      time: "10:30 AM",
      token: "#08",
      location: "City Hospital, Jaipur",
      status: "Upcoming",
      fee: "₹800",
    },
    {
      id: "AP-20260902-1145",
      doctor: "Dr. Priya Mehta",
      department: "Dermatology",
      date: "02 Sep 2026",
      time: "04:00 PM",
      token: "#12",
      location: "City Hospital, Jaipur",
      status: "Upcoming",
      fee: "₹600",
    },
    {
      id: "AP-20260810-0912",
      doctor: "Dr. Amit Verma",
      department: "General Medicine",
      date: "10 Aug 2026",
      time: "11:00 AM",
      token: "#05",
      location: "City Hospital, Jaipur",
      status: "Completed",
      fee: "₹500",
    },
    {
      id: "AP-20260725-0834",
      doctor: "Dr. Neha Gupta",
      department: "Neurology",
      date: "25 Jul 2026",
      time: "02:30 PM",
      token: "#09",
      location: "City Hospital, Jaipur",
      status: "Completed",
      fee: "₹900",
    },
    {
      id: "AP-20260712-0718",
      doctor: "Dr. Rahul Sharma",
      department: "Cardiology",
      date: "12 Jul 2026",
      time: "09:30 AM",
      token: "#03",
      location: "City Hospital, Jaipur",
      status: "Cancelled",
      fee: "₹800",
    },
  ];

  const tabs = [
    {
      name: "Upcoming",
      count: appointments.filter(
        (item) =>
          item.status === "Upcoming" &&
          !cancelledIds.includes(item.id)
      ).length,
    },
    {
      name: "Completed",
      count: appointments.filter(
        (item) => item.status === "Completed"
      ).length,
    },
    {
      name: "Cancelled",
      count:
        appointments.filter(
          (item) => item.status === "Cancelled"
        ).length + cancelledIds.length,
    },
  ];

  const filteredAppointments = appointments.filter(
    (appointment) => {
      let status = appointment.status;

      if (cancelledIds.includes(appointment.id)) {
        status = "Cancelled";
      }

      const matchesTab = status === activeTab;

      const searchText = search.toLowerCase();

      const matchesSearch =
        appointment.doctor
          .toLowerCase()
          .includes(searchText) ||
        appointment.department
          .toLowerCase()
          .includes(searchText) ||
        appointment.id
          .toLowerCase()
          .includes(searchText);

      return matchesTab && matchesSearch;
    }
  );

  const cancelAppointment = (id) => {
    setCancelledIds((prev) => [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="p-4 sm:p-6">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">
              My Appointments
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              View and manage all your hospital appointments.
            </p>
          </div>

          <Link
            href="/patient/book-appointment"
            className="w-fit flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-gray-200 transition"
          >
            <CalendarDays size={17} />
            Book Appointment
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <AppointmentStat
            title="Upcoming"
            value={
              appointments.filter(
                (item) =>
                  item.status === "Upcoming" &&
                  !cancelledIds.includes(item.id)
              ).length
            }
            icon={CalendarDays}
          />

          <AppointmentStat
            title="Completed"
            value={
              appointments.filter(
                (item) => item.status === "Completed"
              ).length
            }
            icon={CheckCircle2}
          />

          <AppointmentStat
            title="Cancelled"
            value={
              appointments.filter(
                (item) => item.status === "Cancelled"
              ).length + cancelledIds.length
            }
            icon={XCircle}
          />
        </div>

        {/* Main Card */}
        <div className="border border-gray-800 bg-[#080808] rounded-xl">
          {/* Tabs */}
          <div className="border-b border-gray-800 px-4 sm:px-6">
            <div className="flex gap-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`relative py-4 text-sm whitespace-nowrap transition ${
                    activeTab === tab.name
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {tab.name}

                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${
                      activeTab === tab.name
                        ? "bg-white text-black"
                        : "bg-gray-900 text-gray-500"
                    }`}
                  >
                    {tab.count}
                  </span>

                  {activeTab === tab.name && (
                    <span className="absolute bottom-0 left-0 right-0 h-px bg-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="p-4 sm:p-6 border-b border-gray-800">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                />

                <input
                  type="text"
                  placeholder="Search doctor, department or appointment ID..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full bg-black border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-gray-600"
                />
              </div>

              <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-800 text-sm text-gray-400 hover:text-white hover:bg-gray-900 transition">
                <Filter size={17} />
                Filter
              </button>
            </div>
          </div>

          {/* Appointment List */}
          <div className="p-4 sm:p-6">
            {filteredAppointments.length > 0 ? (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => {
                  const isCancelled =
                    cancelledIds.includes(
                      appointment.id
                    ) ||
                    appointment.status === "Cancelled";

                  return (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      isCancelled={isCancelled}
                      onCancel={cancelAppointment}
                    />
                  );
                })}
              </div>
            ) : (
              <EmptyState
                activeTab={activeTab}
                search={search}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* Appointment Card */

function AppointmentCard({
  appointment,
  isCancelled,
  onCancel,
}) {
  const isCompleted =
    appointment.status === "Completed";

  return (
    <div className="border border-gray-800 rounded-xl p-4 sm:p-5 hover:border-gray-700 transition">
      <div className="flex flex-col xl:flex-row xl:items-center gap-5">
        {/* Doctor */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0">
            <Stethoscope
              size={24}
              className="text-gray-400"
            />
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold truncate">
              {appointment.doctor}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {appointment.department}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin size={13} />
                {appointment.location}
              </span>
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <AppointmentInfo
            icon={CalendarDays}
            label="Date"
            value={appointment.date}
          />

          <AppointmentInfo
            icon={Clock}
            label="Time"
            value={appointment.time}
          />

          <AppointmentInfo
            label="Token"
            value={appointment.token}
          />
        </div>

        {/* Status */}
        <StatusBadge
          status={
            isCancelled
              ? "Cancelled"
              : appointment.status
          }
        />
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 mt-5 pt-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <div>
            <p className="text-[11px] text-gray-600">
              Appointment ID
            </p>

            <p className="text-xs text-gray-400 mt-1">
              {appointment.id}
            </p>
          </div>

          <div>
            <p className="text-[11px] text-gray-600">
              Consultation Fee
            </p>

            <p className="text-xs text-gray-400 mt-1">
              {appointment.fee}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-800 text-xs text-gray-400 hover:text-white hover:bg-gray-900 transition">
            <Eye size={15} />
            View Details
          </button>

          {!isCompleted && !isCancelled && (
            <>
              <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-800 text-xs text-gray-400 hover:text-white hover:bg-gray-900 transition">
                <RotateCcw size={15} />
                Reschedule
              </button>

              <button
                onClick={() =>
                  onCancel(appointment.id)
                }
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-red-900/50 text-xs text-red-400 hover:bg-red-950/30 transition"
              >
                <XCircle size={15} />
                Cancel
              </button>
            </>
          )}

          {isCompleted && (
            <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-800 text-xs text-gray-400 hover:text-white hover:bg-gray-900 transition">
              View Prescription
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* Appointment Info */

function AppointmentInfo({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="min-w-[105px] bg-gray-900 border border-gray-800 rounded-lg px-3 py-2.5">
      <div className="flex items-center gap-1.5">
        {Icon && (
          <Icon
            size={13}
            className="text-gray-600"
          />
        )}

        <p className="text-[10px] text-gray-600">
          {label}
        </p>
      </div>

      <p className="text-xs font-medium text-gray-300 mt-1">
        {value}
      </p>
    </div>
  );
}

/* Status Badge */

function StatusBadge({ status }) {
  const styles = {
    Upcoming:
      "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Completed:
      "bg-green-500/10 text-green-400 border-green-500/20",
    Cancelled:
      "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <span
      className={`w-fit px-3 py-1.5 rounded-full border text-xs ${
        styles[status] || styles.Upcoming
      }`}
    >
      {status}
    </span>
  );
}

/* Stats */

function AppointmentStat({
  title,
  value,
  icon: Icon,
}) {
  return (
    <div className="border border-gray-800 bg-[#080808] rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="text-2xl font-semibold mt-2">
            {String(value).padStart(2, "0")}
          </h2>
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

/* Empty State */

function EmptyState({ activeTab, search }) {
  return (
    <div className="py-16 text-center">
      <div className="w-14 h-14 mx-auto rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center">
        <CalendarDays
          size={25}
          className="text-gray-600"
        />
      </div>

      <h3 className="text-sm font-medium mt-4">
        No {activeTab.toLowerCase()} appointments
      </h3>

      <p className="text-xs text-gray-600 mt-2">
        {search
          ? "No appointment matches your search."
          : "There are no appointments in this category."}
      </p>
    </div>
  );
}