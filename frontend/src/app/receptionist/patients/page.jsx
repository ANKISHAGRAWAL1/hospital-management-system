"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  UserPlus,
  Eye,
  Pencil,
  Phone,
  Filter,
  Users,
  X,
} from "lucide-react";

export default function PatientsPage() {
  const [search, setSearch] = useState("");

  const patients = [
    {
      id: "PAT-1001",
      name: "Rahul Sharma",
      age: 34,
      gender: "Male",
      phone: "+91 98765 43210",
      bloodGroup: "B+",
      registered: "25 Aug 2026",
      status: "Active",
    },
    {
      id: "PAT-1002",
      name: "Priya Gupta",
      age: 28,
      gender: "Female",
      phone: "+91 98765 12345",
      bloodGroup: "O+",
      registered: "24 Aug 2026",
      status: "Active",
    },
    {
      id: "PAT-1003",
      name: "Rakesh Kumar",
      age: 46,
      gender: "Male",
      phone: "+91 99887 66554",
      bloodGroup: "A+",
      registered: "23 Aug 2026",
      status: "Active",
    },
    {
      id: "PAT-1004",
      name: "Pooja Sharma",
      age: 31,
      gender: "Female",
      phone: "+91 97654 32109",
      bloodGroup: "AB+",
      registered: "22 Aug 2026",
      status: "Inactive",
    },
    {
      id: "PAT-1005",
      name: "Mohit Verma",
      age: 39,
      gender: "Male",
      phone: "+91 96543 21098",
      bloodGroup: "O-",
      registered: "21 Aug 2026",
      status: "Active",
    },
  ];

  const filteredPatients = patients.filter((patient) => {
    const value = search.toLowerCase();

    return (
      patient.name.toLowerCase().includes(value) ||
      patient.id.toLowerCase().includes(value) ||
      patient.phone.toLowerCase().includes(value)
    );
  });

  return (
    <div className="min-h-screen bg-black text-white p-6">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-7">

        <div>
          <h1 className="text-2xl font-bold">
            Patients
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Search and manage registered patients.
          </p>
        </div>

        <Link
          href="/receptionist/patients/add"
          className="inline-flex items-center justify-center gap-2 bg-white text-black px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
        >
          <UserPlus size={17} />
          Register Patient
        </Link>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">

        <div className="bg-gray-950 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Patients
              </p>

              <h2 className="text-2xl font-bold mt-2">
                1,248
              </h2>
            </div>

            <div className="p-3 rounded-lg bg-gray-900">
              <Users size={20} className="text-gray-300" />
            </div>
          </div>
        </div>

        <div className="bg-gray-950 border border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Registered Today
          </p>

          <h2 className="text-2xl font-bold mt-2">
            18
          </h2>
        </div>

        <div className="bg-gray-950 border border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Active Patients
          </p>

          <h2 className="text-2xl font-bold mt-2">
            1,196
          </h2>
        </div>

      </div>

      {/* Search & Filter */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 mb-6">

        <div className="flex flex-col md:flex-row gap-3">

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-3.5 text-gray-600"
            />

            <input
              type="text"
              placeholder="Search by patient name, ID or mobile number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black border border-gray-800 rounded-lg pl-11 pr-10 py-3 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-gray-500"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-3 text-gray-600 hover:text-white"
              >
                <X size={17} />
              </button>
            )}
          </div>

          <button className="flex items-center justify-center gap-2 px-5 py-3 border border-gray-800 rounded-lg text-sm text-gray-400 hover:bg-gray-900 hover:text-white transition">
            <Filter size={17} />
            Filters
          </button>

        </div>

      </div>

      {/* Patient Table */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">

        <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="font-semibold">
              Patient Records
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              {filteredPatients.length} patients found
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="border-b border-gray-800 text-left">

                <th className="px-5 py-4 text-gray-500 font-medium">
                  Patient
                </th>

                <th className="px-5 py-4 text-gray-500 font-medium">
                  Contact
                </th>

                <th className="px-5 py-4 text-gray-500 font-medium">
                  Age / Gender
                </th>

                <th className="px-5 py-4 text-gray-500 font-medium">
                  Blood Group
                </th>

                <th className="px-5 py-4 text-gray-500 font-medium">
                  Registered
                </th>

                <th className="px-5 py-4 text-gray-500 font-medium">
                  Status
                </th>

                <th className="px-5 py-4 text-gray-500 font-medium text-right">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-b border-gray-900 last:border-0 hover:bg-gray-900/40 transition"
                  >

                    {/* Patient */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center font-semibold text-gray-300">
                          {patient.name.charAt(0)}
                        </div>

                        <div>
                          <p className="font-medium text-white">
                            {patient.name}
                          </p>

                          <p className="text-xs text-gray-600 mt-1">
                            {patient.id}
                          </p>
                        </div>

                      </div>

                    </td>

                    {/* Contact */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2 text-gray-400">
                        <Phone size={14} />
                        {patient.phone}
                      </div>

                    </td>

                    {/* Age Gender */}
                    <td className="px-5 py-4 text-gray-400">
                      {patient.age} yrs
                      <span className="mx-2 text-gray-700">•</span>
                      {patient.gender}
                    </td>

                    {/* Blood */}
                    <td className="px-5 py-4">

                      <span className="inline-flex px-2.5 py-1 rounded-md bg-red-950 text-red-400 text-xs font-medium">
                        {patient.bloodGroup}
                      </span>

                    </td>

                    {/* Registered */}
                    <td className="px-5 py-4 text-gray-400">
                      {patient.registered}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">

                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          patient.status === "Active"
                            ? "bg-green-950 text-green-400"
                            : "bg-gray-900 text-gray-500"
                        }`}
                      >
                        {patient.status}
                      </span>

                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">

                      <div className="flex items-center justify-end gap-2">

                        <Link
                          href={`/receptionist/patients/${patient.id}`}
                          title="View Patient"
                          className="p-2 rounded-lg border border-gray-800 text-gray-500 hover:text-white hover:bg-gray-900 transition"
                        >
                          <Eye size={16} />
                        </Link>

                        <Link
                          href={`/receptionist/patients/${patient.id}/edit`}
                          title="Edit Patient"
                          className="p-2 rounded-lg border border-gray-800 text-gray-500 hover:text-white hover:bg-gray-900 transition"
                        >
                          <Pencil size={16} />
                        </Link>

                      </div>

                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-14 text-center"
                  >
                    <div className="flex flex-col items-center">

                      <Users
                        size={32}
                        className="text-gray-700 mb-3"
                      />

                      <p className="text-gray-400 font-medium">
                        No patients found
                      </p>

                      <p className="text-gray-600 text-sm mt-1">
                        Try searching with another name, ID or mobile number.
                      </p>

                    </div>
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>
      </div>
    </div>
  );
}