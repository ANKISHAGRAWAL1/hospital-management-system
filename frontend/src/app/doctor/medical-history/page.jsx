"use client";

import Link from "next/link";
import {
  Search,
  UserRound,
  CalendarDays,
  Stethoscope,
  Pill,
  FileText,
  Eye,
  Clock,
} from "lucide-react";
import { useState } from "react";

export default function MedicalHistoryPage() {
  const [search, setSearch] = useState("");

  const history = [
    {
      id: "MH-001",
      patientId: "PT-1024",
      patient: "Priya Gupta",
      date: "24 Aug 2026",
      diagnosis: "Chest discomfort & fatigue",
      doctor: "Dr. Amit Kumar",
      medicines: "Paracetamol 500 mg",
      status: "Completed",
    },
    {
      id: "MH-002",
      patientId: "PT-1024",
      patient: "Priya Gupta",
      date: "10 Aug 2026",
      diagnosis: "Hypertension",
      doctor: "Dr. Amit Kumar",
      medicines: "Amlodipine 5 mg",
      status: "Completed",
    },
    {
      id: "MH-003",
      patientId: "PT-1025",
      patient: "Rahul Sharma",
      date: "22 Aug 2026",
      diagnosis: "Fever & Cold",
      doctor: "Dr. Amit Kumar",
      medicines: "Paracetamol, Cetirizine",
      status: "Completed",
    },
    {
      id: "MH-004",
      patientId: "PT-1026",
      patient: "Neha Verma",
      date: "20 Aug 2026",
      diagnosis: "Migraine",
      doctor: "Dr. Amit Kumar",
      medicines: "Sumatriptan",
      status: "Completed",
    },
  ];

  const filteredHistory = history.filter((item) =>
    `${item.patient} ${item.patientId} ${item.diagnosis}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">
          Medical History
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          View patient consultation and medical history
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">

        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />

        <input
          type="text"
          placeholder="Search patient, ID or diagnosis..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-black border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-gray-600"
        />

      </div>

      {/* History Table */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="border-b border-gray-800">

              <tr>

                <th className="text-left px-5 py-4 text-gray-500 font-medium">
                  Patient
                </th>

                <th className="text-left px-5 py-4 text-gray-500 font-medium">
                  Date
                </th>

                <th className="text-left px-5 py-4 text-gray-500 font-medium">
                  Diagnosis
                </th>

                <th className="text-left px-5 py-4 text-gray-500 font-medium">
                  Doctor
                </th>

                <th className="text-left px-5 py-4 text-gray-500 font-medium">
                  Medicines
                </th>

                <th className="text-left px-5 py-4 text-gray-500 font-medium">
                  Status
                </th>

                <th className="text-center px-5 py-4 text-gray-500 font-medium">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredHistory.length > 0 ? (

                filteredHistory.map((item) => (

                  <tr
                    key={item.id}
                    className="border-b border-gray-800 last:border-0 hover:bg-gray-900/40"
                  >

                    {/* Patient */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-9 h-9 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center">
                          <UserRound
                            size={17}
                            className="text-gray-500"
                          />
                        </div>

                        <div>

                          <p className="font-medium">
                            {item.patient}
                          </p>

                          <p className="text-xs text-gray-600 mt-1">
                            {item.patientId}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Date */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2 text-gray-400">
                        <CalendarDays size={15} />
                        {item.date}
                      </div>

                    </td>

                    {/* Diagnosis */}
                    <td className="px-5 py-4 text-gray-300">
                      {item.diagnosis}
                    </td>

                    {/* Doctor */}
                    <td className="px-5 py-4 text-gray-400">
                      {item.doctor}
                    </td>

                    {/* Medicines */}
                    <td className="px-5 py-4 text-gray-400">
                      {item.medicines}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">

                      <span className="px-3 py-1 rounded-full text-xs bg-green-500/10 text-green-400">
                        {item.status}
                      </span>

                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">

                      <div className="flex justify-center">

                        <Link
                          href={`/doctor/patients/${item.patientId}`}
                          title="View Patient History"
                          className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800"
                        >
                          <Eye size={17} />
                        </Link>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center text-gray-600"
                  >
                    No medical history found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

        <InfoCard
          icon={Stethoscope}
          title="Consultations"
          value="24"
        />

        <InfoCard
          icon={Pill}
          title="Prescriptions"
          value="21"
        />

        <InfoCard
          icon={FileText}
          title="Medical Records"
          value="32"
        />

      </div>

    </div>
  );
}

/* Info Card */
function InfoCard({
  icon: Icon,
  title,
  value,
}) {
  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl p-5">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs text-gray-500">
            {title}
          </p>

          <p className="text-2xl font-semibold mt-2">
            {value}
          </p>

        </div>

        <div className="p-3 bg-gray-900 rounded-lg">
          <Icon
            size={20}
            className="text-gray-400"
          />
        </div>

      </div>

    </div>
  );
}