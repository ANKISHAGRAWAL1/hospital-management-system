"use client";

import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  FileText,
} from "lucide-react";

export default function PrescriptionsPage() {
  const prescriptions = [
    {
      id: "PR-001",
      patient: "Rahul Sharma",
      doctor: "Dr. Amit Kumar",
      date: "24 Aug 2026",
      medicines: "Paracetamol, Cetirizine",
      status: "Active",
    },
    {
      id: "PR-002",
      patient: "Priya Gupta",
      doctor: "Dr. Neha Singh",
      date: "23 Aug 2026",
      medicines: "Azithromycin",
      status: "Completed",
    },
    {
      id: "PR-003",
      patient: "Rohit Verma",
      doctor: "Dr. Raj Sharma",
      date: "22 Aug 2026",
      medicines: "Amoxicillin, Vitamin D",
      status: "Active",
    },
  ];

  return (
    <div className="p-6 bg-black min-h-screen text-white">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Prescriptions</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage patient prescriptions
          </p>
        </div>

        <button className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200">
          <Plus size={18} />
          Add Prescription
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          type="text"
          placeholder="Search patient, doctor or prescription..."
          className="w-full bg-black border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-gray-500"
        />
      </div>

      {/* Table */}
      <div className="border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="bg-gray-950 border-b border-gray-800">
              <tr>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">
                  Prescription ID
                </th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">
                  Patient
                </th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">
                  Doctor
                </th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">
                  Date
                </th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">
                  Medicines
                </th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">
                  Status
                </th>
                <th className="text-center px-5 py-4 text-gray-400 font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {prescriptions.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-800 last:border-0 hover:bg-gray-950"
                >
                  <td className="px-5 py-4 font-medium">
                    {item.id}
                  </td>

                  <td className="px-5 py-4">
                    {item.patient}
                  </td>

                  <td className="px-5 py-4 text-gray-300">
                    {item.doctor}
                  </td>

                  <td className="px-5 py-4 text-gray-400">
                    {item.date}
                  </td>

                  <td className="px-5 py-4 text-gray-300">
                    {item.medicines}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        item.status === "Active"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-gray-500/10 text-gray-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-2">

                      <button
                        title="View Prescription"
                        className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        title="Edit Prescription"
                        className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        title="Delete Prescription"
                        className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-gray-800"
                      >
                        <Trash2 size={17} />
                      </button>

                      <button
                        title="Prescription"
                        className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800"
                      >
                        <FileText size={17} />
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}