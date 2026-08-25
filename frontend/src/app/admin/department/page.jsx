"use client";

import {
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";

export default function DepartmentPage() {
  const departments = [
    {
      id: 1,
      name: "Cardiology",
      code: "CARD-01",
      headDoctor: "Dr. Rahul Sharma",
      doctors: 8,
      patients: 245,
      location: "2nd Floor",
      status: "Active",
    },
    {
      id: 2,
      name: "Neurology",
      code: "NEURO-01",
      headDoctor: "Dr. Amit Verma",
      doctors: 5,
      patients: 128,
      location: "3rd Floor",
      status: "Active",
    },
    {
      id: 3,
      name: "Orthopedics",
      code: "ORTHO-01",
      headDoctor: "Dr. Mohan Gupta",
      doctors: 6,
      patients: 186,
      location: "1st Floor",
      status: "Active",
    },
    {
      id: 4,
      name: "Dermatology",
      code: "DERMA-01",
      headDoctor: "Dr. Priya Singh",
      doctors: 4,
      patients: 96,
      location: "Ground Floor",
      status: "Active",
    },
    {
      id: 5,
      name: "Pediatrics",
      code: "PED-01",
      headDoctor: "Dr. Neha Sharma",
      doctors: 7,
      patients: 164,
      location: "2nd Floor",
      status: "Inactive",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">
            Department Management
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage hospital departments
          </p>
        </div>

        <button className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition">
          <Plus size={18} />
          Add Department
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center justify-between mb-4">

        <div className="relative w-80">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type="text"
            placeholder="Search department..."
            className="w-full bg-[#111] border border-gray-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-gray-600"
          />
        </div>

        <select className="bg-[#111] border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-300 outline-none">
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>

      </div>

      {/* Table */}
      <div className="bg-[#0d0d0d] border border-gray-800 rounded-xl overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            {/* Table Head */}
            <thead className="bg-[#151515] border-b border-gray-800">
              <tr className="text-left text-gray-400">

                <th className="px-5 py-4 font-medium">
                  Department
                </th>

                <th className="px-5 py-4 font-medium">
                  Code
                </th>

                <th className="px-5 py-4 font-medium">
                  Head Doctor
                </th>

                <th className="px-5 py-4 font-medium text-center">
                  Doctors
                </th>

                <th className="px-5 py-4 font-medium text-center">
                  Patients
                </th>

                <th className="px-5 py-4 font-medium">
                  Location
                </th>

                <th className="px-5 py-4 font-medium">
                  Status
                </th>

                <th className="px-5 py-4 font-medium text-center">
                  Actions
                </th>

              </tr>
            </thead>

            {/* Table Body */}
            <tbody>

              {departments.map((department) => (
                <tr
                  key={department.id}
                  className="border-b border-gray-800 last:border-0 hover:bg-[#151515] transition"
                >

                  {/* Department */}
                  <td className="px-5 py-4">
                    <div className="font-medium text-white">
                      {department.name}
                    </div>
                  </td>

                  {/* Code */}
                  <td className="px-5 py-4 text-gray-400">
                    {department.code}
                  </td>

                  {/* Head Doctor */}
                  <td className="px-5 py-4 text-gray-300">
                    {department.headDoctor}
                  </td>

                  {/* Doctors */}
                  <td className="px-5 py-4 text-center text-gray-300">
                    {department.doctors}
                  </td>

                  {/* Patients */}
                  <td className="px-5 py-4 text-center text-gray-300">
                    {department.patients}
                  </td>

                  {/* Location */}
                  <td className="px-5 py-4 text-gray-400">
                    {department.location}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        department.status === "Active"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {department.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">

                      <button
                        title="View"
                        className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        title="Edit"
                        className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        title="Delete"
                        className="p-2 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition"
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-800">

          <p className="text-sm text-gray-500">
            Showing {departments.length} departments
          </p>

          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-gray-800 text-gray-500 text-sm">
              Previous
            </button>

            <button className="px-3 py-1.5 rounded-lg bg-white text-black text-sm font-medium">
              1
            </button>

            <button className="px-3 py-1.5 rounded-lg border border-gray-800 text-gray-400 text-sm hover:bg-gray-800">
              Next
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}