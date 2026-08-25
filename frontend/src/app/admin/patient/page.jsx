"use client";

import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  UserRound,
} from "lucide-react";

export default function PatientPage() {
  const patients = [
    {
      id: "P-1001",
      name: "Rahul Sharma",
      age: 32,
      gender: "Male",
      phone: "9876543210",
      bloodGroup: "B+",
      doctor: "Dr. Amit Sharma",
      department: "Cardiology",
      lastVisit: "24 Aug 2026",
      status: "Active",
    },
    {
      id: "P-1002",
      name: "Priya Gupta",
      age: 28,
      gender: "Female",
      phone: "9876543211",
      bloodGroup: "O+",
      doctor: "Dr. Raj Kumar",
      department: "Neurology",
      lastVisit: "23 Aug 2026",
      status: "Active",
    },
    {
      id: "P-1003",
      name: "Mohit Singh",
      age: 45,
      gender: "Male",
      phone: "9876543212",
      bloodGroup: "A+",
      doctor: "Dr. Neha",
      department: "Orthopedics",
      lastVisit: "22 Aug 2026",
      status: "Inactive",
    },
    {
      id: "P-1004",
      name: "Sneha Verma",
      age: 35,
      gender: "Female",
      phone: "9876543213",
      bloodGroup: "AB+",
      doctor: "Dr. Amit Sharma",
      department: "Cardiology",
      lastVisit: "21 Aug 2026",
      status: "Active",
    },
    {
      id: "P-1005",
      name: "Ravi Meena",
      age: 52,
      gender: "Male",
      phone: "9876543214",
      bloodGroup: "O-",
      doctor: "Dr. Raj Kumar",
      department: "Neurology",
      lastVisit: "20 Aug 2026",
      status: "Active",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Patients</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage all hospital patients
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 bg-white text-black px-4 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition">
          <Plus size={18} />
          Add Patient
        </button>
      </div>

      {/* Search + Filter */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              placeholder="Search patient by name, ID or phone..."
              className="w-full bg-black border border-gray-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-gray-500"
            />
          </div>

          {/* Status Filter */}
          <select className="bg-black border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-300 outline-none">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          {/* Gender Filter */}
          <select className="bg-black border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-300 outline-none">
            <option>All Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            
            <thead className="bg-gray-900 border-b border-gray-800">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold text-gray-400 uppercase">
                  Patient
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-gray-400 uppercase">
                  Age / Gender
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-gray-400 uppercase">
                  Phone
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-gray-400 uppercase">
                  Blood
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-gray-400 uppercase">
                  Doctor
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-gray-400 uppercase">
                  Department
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-gray-400 uppercase">
                  Last Visit
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-gray-400 uppercase">
                  Status
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-gray-400 uppercase text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {patients.map((patient) => (
                <tr
                  key={patient.id}
                  className="hover:bg-gray-900 transition"
                >
                  {/* Patient */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                        <UserRound size={19} className="text-gray-300" />
                      </div>

                      <div>
                        <p className="font-medium text-white">
                          {patient.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {patient.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Age / Gender */}
                  <td className="px-5 py-4 text-sm text-gray-300">
                    {patient.age} / {patient.gender}
                  </td>

                  {/* Phone */}
                  <td className="px-5 py-4 text-sm text-gray-300">
                    {patient.phone}
                  </td>

                  {/* Blood */}
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-md bg-red-950 text-red-400 text-xs font-semibold">
                      {patient.bloodGroup}
                    </span>
                  </td>

                  {/* Doctor */}
                  <td className="px-5 py-4 text-sm text-gray-300">
                    {patient.doctor}
                  </td>

                  {/* Department */}
                  <td className="px-5 py-4 text-sm text-gray-400">
                    {patient.department}
                  </td>

                  {/* Last Visit */}
                  <td className="px-5 py-4 text-sm text-gray-400">
                    {patient.lastVisit}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        patient.status === "Active"
                          ? "bg-green-950 text-green-400"
                          : "bg-gray-800 text-gray-400"
                      }`}
                    >
                      {patient.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      
                      <button
                        title="View"
                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        title="Edit"
                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        title="Delete"
                        className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition"
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
        <div className="px-5 py-4 border-t border-gray-800 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {patients.length} patients
          </p>

          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-gray-800 text-sm text-gray-500">
              Previous
            </button>

            <button className="px-3 py-1.5 rounded-lg bg-white text-black text-sm font-medium">
              1
            </button>

            <button className="px-3 py-1.5 rounded-lg border border-gray-800 text-sm text-gray-300 hover:bg-gray-800">
              2
            </button>

            <button className="px-3 py-1.5 rounded-lg border border-gray-800 text-sm text-gray-300 hover:bg-gray-800">
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}