"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock,
  Eye,
  PhoneCall,
  Play,
  Search,
  User,
  Users,
  XCircle,
  AlertCircle,
} from "lucide-react";

const initialQueue = [
  {
    id: "APT-1001",
    token: "01",
    patient: "Rahul Sharma",
    uhid: "UHID-10021",
    doctor: "Dr. Amit Verma",
    department: "Cardiology",
    appointmentTime: "09:00 AM",
    arrivalTime: "08:52 AM",
    status: "In Consultation",
    priority: "Normal",
    waitingMinutes: 0,
  },
  {
    id: "APT-1002",
    token: "02",
    patient: "Priya Gupta",
    uhid: "UHID-10022",
    doctor: "Dr. Neha Sharma",
    department: "Gynecology",
    appointmentTime: "09:30 AM",
    arrivalTime: "09:18 AM",
    status: "Waiting",
    priority: "Normal",
    waitingMinutes: 18,
  },
  {
    id: "APT-1003",
    token: "03",
    patient: "Mohit Singh",
    uhid: "UHID-10023",
    doctor: "Dr. Raj Mehta",
    department: "Orthopedics",
    appointmentTime: "10:00 AM",
    arrivalTime: "09:42 AM",
    status: "Checked-in",
    priority: "Normal",
    waitingMinutes: 12,
  },
  {
    id: "APT-1004",
    token: "04",
    patient: "Anjali Verma",
    uhid: "UHID-10024",
    doctor: "Dr. Amit Verma",
    department: "Cardiology",
    appointmentTime: "10:30 AM",
    arrivalTime: null,
    status: "Scheduled",
    priority: "Normal",
    waitingMinutes: 0,
  },
  {
    id: "APT-1005",
    token: "05",
    patient: "Vikas Jain",
    uhid: "UHID-10025",
    doctor: "Dr. Raj Mehta",
    department: "Orthopedics",
    appointmentTime: "11:00 AM",
    arrivalTime: null,
    status: "Scheduled",
    priority: "Emergency",
    waitingMinutes: 0,
  },
  {
    id: "APT-1006",
    token: "06",
    patient: "Neha Agarwal",
    uhid: "UHID-10026",
    doctor: "Dr. Vikram Singh",
    department: "Neurology",
    appointmentTime: "11:30 AM",
    arrivalTime: "11:12 AM",
    status: "Waiting",
    priority: "Normal",
    waitingMinutes: 14,
  },
];

export default function QueuePage() {
  const [queue, setQueue] = useState(initialQueue);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const updateStatus = (id, status) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              arrivalTime:
                status === "Checked-in" || status === "Waiting"
                  ? item.arrivalTime || getCurrentTime()
                  : item.arrivalTime,
            }
          : item
      )
    );
  };

  const callNextPatient = () => {
    const nextPatient = queue.find(
      (item) =>
        item.status === "Waiting" || item.status === "Checked-in"
    );

    if (!nextPatient) {
      alert("No patient is currently waiting.");
      return;
    }

    updateStatus(nextPatient.id, "In Consultation");

    alert(`Token ${nextPatient.token} - ${nextPatient.patient} called.`);
  };

  const filteredQueue = useMemo(() => {
    return queue.filter((item) => {
      const query = search.toLowerCase();

      const matchesSearch =
        item.patient.toLowerCase().includes(query) ||
        item.uhid.toLowerCase().includes(query) ||
        item.doctor.toLowerCase().includes(query) ||
        item.token.includes(query);

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      const matchesDepartment =
        departmentFilter === "All" ||
        item.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [queue, search, statusFilter, departmentFilter]);

  const waitingCount = queue.filter(
    (item) => item.status === "Waiting"
  ).length;

  const checkedInCount = queue.filter(
    (item) => item.status === "Checked-in"
  ).length;

  const consultationCount = queue.filter(
    (item) => item.status === "In Consultation"
  ).length;

  const completedCount = queue.filter(
    (item) => item.status === "Completed"
  ).length;

  const emergencyCount = queue.filter(
    (item) =>
      item.priority === "Emergency" &&
      item.status !== "Completed"
  ).length;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-[1500px] mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/receptionist"
              className="p-2.5 rounded-lg border border-gray-800 hover:bg-gray-900 transition"
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <div className="flex items-center gap-3">
                <Users size={24} />

                <h1 className="text-2xl font-semibold">
                  Check-in & Queue
                </h1>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Manage patient arrivals and today's waiting queue
              </p>
            </div>
          </div>

          <button
            onClick={callNextPatient}
            className="px-5 py-3 rounded-lg bg-white text-black font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition"
          >
            <PhoneCall size={18} />
            Call Next Patient
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <StatCard
            title="Waiting"
            value={waitingCount}
            icon={<Clock size={20} />}
          />

          <StatCard
            title="Checked-in"
            value={checkedInCount}
            icon={<CheckCircle2 size={20} />}
          />

          <StatCard
            title="In Consultation"
            value={consultationCount}
            icon={<Play size={20} />}
          />

          <StatCard
            title="Completed"
            value={completedCount}
            icon={<CheckCircle2 size={20} />}
          />

          <StatCard
            title="Priority Cases"
            value={emergencyCount}
            icon={<AlertCircle size={20} />}
          />
        </div>

        {/* Queue Banner */}
        <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl p-5 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Bell size={18} />

                <h2 className="font-medium">
                  Current Queue
                </h2>
              </div>

              <p className="text-xs text-gray-600 mt-2">
                Patients are called according to appointment time,
                priority and queue position.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-center px-4 py-2 border border-gray-800 rounded-lg">
                <p className="text-xs text-gray-600">
                  Next Token
                </p>

                <p className="text-lg font-semibold mt-1">
                  {getNextToken(queue)}
                </p>
              </div>

              <div className="text-center px-4 py-2 border border-gray-800 rounded-lg">
                <p className="text-xs text-gray-600">
                  Date
                </p>

                <p className="text-sm font-medium mt-1">
                  {new Date().toLocaleDateString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl p-5 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patient, UHID, doctor or token..."
                className="w-full bg-black border border-gray-800 rounded-lg pl-11 pr-4 py-3 text-sm outline-none focus:border-gray-500"
              />
            </div>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-300 outline-none"
            >
              <option value="All">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Checked-in">Checked-in</option>
              <option value="Waiting">Waiting</option>
              <option value="In Consultation">
                In Consultation
              </option>
              <option value="Completed">Completed</option>
              <option value="No-show">No-show</option>
            </select>

            {/* Department */}
            <select
              value={departmentFilter}
              onChange={(e) =>
                setDepartmentFilter(e.target.value)
              }
              className="bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-300 outline-none"
            >
              <option value="All">All Departments</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Gynecology">Gynecology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Neurology">Neurology</option>
            </select>
          </div>
        </div>

        {/* Queue Table */}
        <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">
                Patient Queue
              </h2>

              <p className="text-xs text-gray-600 mt-1">
                {filteredQueue.length} patients shown
              </p>
            </div>

            <CalendarDays
              size={19}
              className="text-gray-600"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1250px]">
              <thead>
                <tr className="border-b border-gray-800 text-left">
                  <th className="px-5 py-4 text-xs text-gray-600">
                    Token
                  </th>

                  <th className="px-5 py-4 text-xs text-gray-600">
                    Patient
                  </th>

                  <th className="px-5 py-4 text-xs text-gray-600">
                    Doctor
                  </th>

                  <th className="px-5 py-4 text-xs text-gray-600">
                    Appointment
                  </th>

                  <th className="px-5 py-4 text-xs text-gray-600">
                    Arrival
                  </th>

                  <th className="px-5 py-4 text-xs text-gray-600">
                    Waiting
                  </th>

                  <th className="px-5 py-4 text-xs text-gray-600">
                    Priority
                  </th>

                  <th className="px-5 py-4 text-xs text-gray-600">
                    Status
                  </th>

                  <th className="px-5 py-4 text-xs text-gray-600 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredQueue.length > 0 ? (
                  filteredQueue.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-900 hover:bg-[#111] transition"
                    >
                      {/* Token */}
                      <td className="px-5 py-4">
                        <div className="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center font-semibold text-sm">
                          {item.token}
                        </div>
                      </td>

                      {/* Patient */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full border border-gray-800 flex items-center justify-center">
                            <User
                              size={16}
                              className="text-gray-500"
                            />
                          </div>

                          <div>
                            <p className="text-sm font-medium">
                              {item.patient}
                            </p>

                            <p className="text-xs text-gray-600 mt-1">
                              {item.uhid}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Doctor */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-300">
                          {item.doctor}
                        </p>

                        <p className="text-xs text-gray-600 mt-1">
                          {item.department}
                        </p>
                      </td>

                      {/* Appointment */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Clock
                            size={15}
                            className="text-gray-600"
                          />

                          <span className="text-sm">
                            {item.appointmentTime}
                          </span>
                        </div>
                      </td>

                      {/* Arrival */}
                      <td className="px-5 py-4">
                        {item.arrivalTime ? (
                          <span className="text-sm text-gray-400">
                            {item.arrivalTime}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-700">
                            Not arrived
                          </span>
                        )}
                      </td>

                      {/* Waiting */}
                      <td className="px-5 py-4">
                        {item.status === "Waiting" ||
                        item.status === "Checked-in" ? (
                          <span className="text-sm text-gray-400">
                            {item.waitingMinutes} min
                          </span>
                        ) : (
                          <span className="text-gray-700">
                            —
                          </span>
                        )}
                      </td>

                      {/* Priority */}
                      <td className="px-5 py-4">
                        <PriorityBadge
                          priority={item.priority}
                        />
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusBadge status={item.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">

                          <button
                            title="View Patient"
                            className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-900 transition"
                          >
                            <Eye size={17} />
                          </button>

                          {item.status === "Scheduled" && (
                            <button
                              onClick={() =>
                                updateStatus(
                                  item.id,
                                  "Checked-in"
                                )
                              }
                              className="px-3 py-2 rounded-lg border border-gray-800 text-xs text-gray-400 hover:bg-white hover:text-black transition"
                            >
                              Check-in
                            </button>
                          )}

                          {item.status === "Checked-in" && (
                            <button
                              onClick={() =>
                                updateStatus(
                                  item.id,
                                  "Waiting"
                                )
                              }
                              className="px-3 py-2 rounded-lg border border-gray-800 text-xs text-gray-400 hover:bg-white hover:text-black transition"
                            >
                              Add to Queue
                            </button>
                          )}

                          {item.status === "Waiting" && (
                            <button
                              onClick={() =>
                                updateStatus(
                                  item.id,
                                  "In Consultation"
                                )
                              }
                              className="px-3 py-2 rounded-lg bg-white text-black text-xs font-medium hover:bg-gray-200 transition"
                            >
                              Call Patient
                            </button>
                          )}

                          {item.status ===
                            "In Consultation" && (
                            <button
                              onClick={() =>
                                updateStatus(
                                  item.id,
                                  "Completed"
                                )
                              }
                              className="px-3 py-2 rounded-lg border border-gray-800 text-xs text-gray-400 hover:bg-white hover:text-black transition"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-5 py-14 text-center"
                    >
                      <Users
                        size={32}
                        className="mx-auto text-gray-700 mb-3"
                      />

                      <p className="text-sm text-gray-500">
                        No patients found
                      </p>

                      <p className="text-xs text-gray-700 mt-1">
                        Try changing your search or filters
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs text-gray-600">
              Showing {filteredQueue.length} of{" "}
              {queue.length} patients
            </p>

            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              Queue updates in real time
            </div>
          </div>
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
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h3 className="text-2xl font-semibold mt-2">
            {value}
          </h3>
        </div>

        <div className="p-3 rounded-lg bg-black border border-gray-800 text-gray-500">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Status Badge ---------------- */

function StatusBadge({ status }) {
  const classes = {
    Scheduled: "border-gray-800 text-gray-500",
    "Checked-in": "border-gray-600 text-gray-300",
    Waiting: "border-gray-500 text-gray-300",
    "In Consultation": "border-gray-400 text-gray-200",
    Completed: "border-gray-700 text-gray-500",
    "No-show": "border-gray-800 text-gray-600",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md border text-xs ${
        classes[status] || "border-gray-800 text-gray-500"
      }`}
    >
      {status}
    </span>
  );
}

/* ---------------- Priority Badge ---------------- */

function PriorityBadge({ priority }) {
  if (priority === "Emergency") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-gray-500 text-xs text-gray-200">
        <AlertCircle size={13} />
        Emergency
      </span>
    );
  }

  return (
    <span className="text-xs text-gray-600">
      Normal
    </span>
  );
}

/* ---------------- Helpers ---------------- */

function getCurrentTime() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getNextToken(queue) {
  const activePatients = queue.filter(
    (item) =>
      item.status === "Waiting" ||
      item.status === "Checked-in"
  );

  if (!activePatients.length) {
    return "—";
  }

  return activePatients[0].token;
}