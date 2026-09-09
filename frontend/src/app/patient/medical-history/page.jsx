"use client";

import { useState } from "react";
import {
  Search,
  Eye,
  CalendarDays,
  UserRound,
  Activity,
  Pill,
  FileText,
  Stethoscope,
  AlertTriangle,
  X,
} from "lucide-react";

export default function MedicalHistoryPage() {
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const patients = [
    {
      id: "P-1001",
      name: "Rahul Sharma",
      age: 34,
      gender: "Male",
      bloodGroup: "B+",
      lastVisit: "24 Aug 2026",
      diagnosis: "Hypertension",
      allergies: "Penicillin",
      status: "Active",
    },
    {
      id: "P-1002",
      name: "Priya Verma",
      age: 29,
      gender: "Female",
      bloodGroup: "O+",
      lastVisit: "22 Aug 2026",
      diagnosis: "Migraine",
      allergies: "None",
      status: "Stable",
    },
    {
      id: "P-1003",
      name: "Amit Gupta",
      age: 46,
      gender: "Male",
      bloodGroup: "A+",
      lastVisit: "20 Aug 2026",
      diagnosis: "Type 2 Diabetes",
      allergies: "Sulfa Drugs",
      status: "Active",
    },
    {
      id: "P-1004",
      name: "Neha Singh",
      age: 38,
      gender: "Female",
      bloodGroup: "AB+",
      lastVisit: "18 Aug 2026",
      diagnosis: "Asthma",
      allergies: "Dust",
      status: "Stable",
    },
  ];

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(search.toLowerCase()) ||
      patient.id.toLowerCase().includes(search.toLowerCase())
  );

  const history = [
    {
      date: "24 Aug 2026",
      doctor: "Dr. Anil Sharma",
      department: "Cardiology",
      diagnosis: "Hypertension",
      treatment: "Blood pressure monitoring",
      prescription: "Amlodipine 5mg",
    },
    {
      date: "12 Jul 2026",
      doctor: "Dr. Raj Mehta",
      department: "General Medicine",
      diagnosis: "High BP",
      treatment: "Lifestyle modification",
      prescription: "Amlodipine 5mg",
    },
    {
      date: "05 May 2026",
      doctor: "Dr. Raj Mehta",
      department: "General Medicine",
      diagnosis: "Headache",
      treatment: "Rest and hydration",
      prescription: "Paracetamol 500mg",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900">

      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-semibold">Medical History</h1>
        <p className="text-sm text-gray-500 mt-1">
          View and review complete patient medical records
        </p>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search patient name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-gray-400"
          />
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="font-semibold">Patient Records</h2>
          <p className="text-xs text-gray-500 mt-1">
            Select a patient to view complete medical history
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-gray-600">
                  Patient
                </th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">
                  Patient ID
                </th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">
                  Age / Gender
                </th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">
                  Blood Group
                </th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">
                  Last Visit
                </th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">
                  Diagnosis
                </th>
                <th className="text-right px-5 py-3 font-medium text-gray-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                        <UserRound size={17} className="text-gray-500" />
                      </div>

                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-xs text-gray-500">
                          {patient.allergies === "None"
                            ? "No known allergies"
                            : `Allergy: ${patient.allergies}`}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {patient.id}
                  </td>

                  <td className="px-5 py-4">
                    {patient.age} / {patient.gender}
                  </td>

                  <td className="px-5 py-4 font-medium">
                    {patient.bloodGroup}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {patient.lastVisit}
                  </td>

                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">
                      {patient.diagnosis}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setSelectedPatient(patient)}
                      title="View Medical History"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 text-white text-xs hover:bg-gray-800"
                    >
                      <Eye size={15} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {filteredPatients.length === 0 && (
          <div className="py-12 text-center text-gray-500 text-sm">
            No patient records found.
          </div>
        )}
      </div>

      {/* Medical History Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">

            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-semibold">
                  {selectedPatient.name}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {selectedPatient.id} • {selectedPatient.age} years •{" "}
                  {selectedPatient.gender}
                </p>
              </div>

              <button
                onClick={() => setSelectedPatient(null)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">

              {/* Patient Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
                    <Activity size={15} />
                    Blood Group
                  </div>
                  <p className="font-semibold">
                    {selectedPatient.bloodGroup}
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
                    <Stethoscope size={15} />
                    Diagnosis
                  </div>
                  <p className="font-semibold">
                    {selectedPatient.diagnosis}
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
                    <AlertTriangle size={15} />
                    Allergies
                  </div>
                  <p className="font-semibold">
                    {selectedPatient.allergies}
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
                    <CalendarDays size={15} />
                    Last Visit
                  </div>
                  <p className="font-semibold">
                    {selectedPatient.lastVisit}
                  </p>
                </div>

              </div>

              {/* Medical History */}
              <div className="mb-7">

                <div className="flex items-center gap-2 mb-4">
                  <FileText size={18} />
                  <h3 className="font-semibold">
                    Medical History
                  </h3>
                </div>

                <div className="space-y-4">

                  {history.map((item, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-xl p-5"
                    >

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">

                        <div>
                          <p className="font-semibold">
                            {item.diagnosis}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {item.department} • {item.doctor}
                          </p>
                        </div>

                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <CalendarDays size={14} />
                          {item.date}
                        </span>

                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">
                            Treatment
                          </p>
                          <p className="text-sm">
                            {item.treatment}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                            <Pill size={13} />
                            Prescription
                          </div>

                          <p className="text-sm">
                            {item.prescription}
                          </p>
                        </div>

                      </div>

                    </div>
                  ))}

                </div>
              </div>

              {/* Current Status */}
              <div className="border border-gray-200 rounded-xl p-5">

                <h3 className="font-semibold mb-4">
                  Current Clinical Notes
                </h3>

                <textarea
                  rows={4}
                  placeholder="Add clinical notes..."
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-gray-400 resize-none"
                />

                <div className="flex justify-end mt-3">
                  <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800">
                    Save Notes
                  </button>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}