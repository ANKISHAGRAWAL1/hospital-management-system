"use client";

import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";

export default function DoctorPage() {
  const doctors = [
    {
      id: 1,
      name: "Dr. Rahul Sharma",
      email: "rahul@hospital.com",
      profile: "/doctors/rahul.jpg",
      specialization: "Cardiologist",
      department: "Cardiology",
      experience: "8 Years",
      patients: 245,
      status: "Active",
    },
    {
      id: 2,
      name: "Dr. Amit Verma",
      email: "amit@hospital.com",
      profile: "/doctors/amit.jpg",
      specialization: "Neurologist",
      department: "Neurology",
      experience: "6 Years",
      patients: 128,
      status: "Active",
    },
    {
      id: 3,
      name: "Dr. Mohan Gupta",
      email: "mohan@hospital.com",
      profile: "/doctors/mohan.jpg",
      specialization: "Orthopedic",
      department: "Orthopedics",
      experience: "10 Years",
      patients: 186,
      status: "Active",
    },
    {
      id: 4,
      name: "Dr. Priya Singh",
      email: "priya@hospital.com",
      profile: "/doctors/priya.jpg",
      specialization: "Dermatologist",
      department: "Dermatology",
      experience: "5 Years",
      patients: 96,
      status: "Inactive",
    },
    {
      id: 5,
      name: "Dr. Neha Sharma",
      email: "neha@hospital.com",
      profile: "/doctors/neha.jpg",
      specialization: "Pediatrician",
      department: "Pediatrics",
      experience: "7 Years",
      patients: 164,
      status: "Active",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-2xl font-semibold">
            Doctor Management
          </h1>

          <p className="text-sm text-gray-400 mt-1">
            Manage hospital doctors
          </p>
        </div>

        <Link
          href="/admin/doctor/add"
          className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition"
        >
          <Plus size={18} />
          Add Doctor
        </Link>

      </div>

      {/* Search & Filters */}
      <div className="flex items-center justify-between mb-4">

        {/* Search */}
        <div className="relative w-80">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type="text"
            placeholder="Search doctor..."
            className="w-full bg-[#111] border border-gray-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-gray-600"
          />

        </div>

        {/* Filters */}
        <div className="flex gap-3">

          <select className="bg-[#111] border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-300 outline-none">
            <option>All Departments</option>
            <option>Cardiology</option>
            <option>Neurology</option>
            <option>Orthopedics</option>
            <option>Dermatology</option>
            <option>Pediatrics</option>
          </select>

          <select className="bg-[#111] border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-300 outline-none">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

        </div>

      </div>

      {/* Table */}
      <div className="bg-[#0d0d0d] border border-gray-800 rounded-xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            {/* Table Header */}
            <thead className="bg-[#151515] border-b border-gray-800">

              <tr className="text-left text-gray-400">

                <th className="px-5 py-4 font-medium">
                  Profile
                </th>

                <th className="px-5 py-4 font-medium">
                  Doctor
                </th>

                <th className="px-5 py-4 font-medium">
                  Specialization
                </th>

                <th className="px-5 py-4 font-medium">
                  Department
                </th>

                <th className="px-5 py-4 font-medium">
                  Experience
                </th>

                <th className="px-5 py-4 font-medium text-center">
                  Patients
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

              {doctors.map((doctor) => (

                <tr
                  key={doctor.id}
                  className="border-b border-gray-800 last:border-0 hover:bg-[#151515] transition"
                >

                  {/* Profile */}
                  <td className="px-5 py-4">

                    <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">

                      <img
                        src={doctor.profile}
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />

                      <span className="text-sm font-semibold text-gray-300">
                        {doctor.name
                          .replace("Dr. ", "")
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                          .slice(0, 2)}
                      </span>

                    </div>

                  </td>

                  {/* Doctor */}
                  <td className="px-5 py-4">

                    <div>
                      <p className="font-medium text-white">
                        {doctor.name}
                      </p>

                      <p className="text-xs text-gray-500 mt-0.5">
                        {doctor.email}
                      </p>
                    </div>

                  </td>

                  {/* Specialization */}
                  <td className="px-5 py-4 text-gray-300">
                    {doctor.specialization}
                  </td>

                  {/* Department */}
                  <td className="px-5 py-4 text-gray-300">
                    {doctor.department}
                  </td>

                  {/* Experience */}
                  <td className="px-5 py-4 text-gray-400">
                    {doctor.experience}
                  </td>

                  {/* Patients */}
                  <td className="px-5 py-4 text-center text-gray-300">
                    {doctor.patients}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">

                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        doctor.status === "Active"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {doctor.status}
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
            Showing {doctors.length} doctors
          </p>

          <div className="flex items-center gap-2">

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