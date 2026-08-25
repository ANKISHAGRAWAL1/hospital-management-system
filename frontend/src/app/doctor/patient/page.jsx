"use client";

import Link from "next/link";
import {
  Search,
  Eye,
  UserRound,
  CalendarDays,
} from "lucide-react";
import { useState } from "react";

export default function PatientsPage() {
  const [search, setSearch] = useState("");

  const patients = [
    {
      id: "PT-1024",
      name: "Priya Gupta",
      age: 29,
      gender: "Female",
      bloodGroup: "B+",
      phone: "9876543210",
      lastVisit: "24 Aug 2026",
      condition: "Chest discomfort",
    },
    {
      id: "PT-1025",
      name: "Rahul Sharma",
      age: 35,
      gender: "Male",
      bloodGroup: "O+",
      phone: "9876543211",
      lastVisit: "22 Aug 2026",
      condition: "Fever",
    },
    {
      id: "PT-1026",
      name: "Neha Verma",
      age: 27,
      gender: "Female",
      bloodGroup: "A+",
      phone: "9876543212",
      lastVisit: "20 Aug 2026",
      condition: "Migraine",
    },
    {
      id: "PT-1027",
      name: "Amit Gupta",
      age: 42,
      gender: "Male",
      bloodGroup: "B-",
      phone: "9876543213",
      lastVisit: "18 Aug 2026",
      condition: "Back pain",
    },
    {
      id: "PT-1028",
      name: "Rohit Singh",
      age: 31,
      gender: "Male",
      bloodGroup: "AB+",
      phone: "9876543214",
      lastVisit: "15 Aug 2026",
      condition: "Diabetes",
    },
  ];

  const filteredPatients = patients.filter((patient) =>
    `${patient.name} ${patient.id} ${patient.phone}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-2xl font-semibold">
            My Patients
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            View and manage your assigned patients
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <UserRound size={18} />
          {patients.length} Patients
        </div>

      </div>

      {/* Search */}
      <div className="relative mb-6">

        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />

        <input
          type="text"
          placeholder="Search patient by name, ID or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-black border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-gray-600"
        />

      </div>

      {/* Patient Table */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="border-b border-gray-800">

              <tr>

                <th className="text-left px-5 py-4 text-gray-500 font-medium">
                  Patient
                </th>

                <th className="text-left px-5 py-4 text-gray-500 font-medium">
                  Age / Gender
                </th>

                <th className="text-left px-5 py-4 text-gray-500 font-medium">
                  Blood Group
                </th>

                <th className="text-left px-5 py-4 text-gray-500 font-medium">
                  Phone
                </th>

                <th className="text-left px-5 py-4 text-gray-500 font-medium">
                  Last Visit
                </th>

                <th className="text-left px-5 py-4 text-gray-500 font-medium">
                  Condition
                </th>

                <th className="text-center px-5 py-4 text-gray-500 font-medium">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredPatients.length > 0 ? (

                filteredPatients.map((patient) => (

                  <tr
                    key={patient.id}
                    className="border-b border-gray-800 last:border-0 hover:bg-gray-900/40"
                  >

                    {/* Patient */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center">
                          <UserRound
                            size={18}
                            className="text-gray-500"
                          />
                        </div>

                        <div>

                          <p className="font-medium">
                            {patient.name}
                          </p>

                          <p className="text-xs text-gray-600 mt-1">
                            {patient.id}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Age Gender */}
                    <td className="px-5 py-4 text-gray-400">
                      {patient.age} yrs / {patient.gender}
                    </td>

                    {/* Blood */}
                    <td className="px-5 py-4">

                      <span className="px-2.5 py-1 rounded-md bg-gray-900 border border-gray-800 text-xs text-gray-300">
                        {patient.bloodGroup}
                      </span>

                    </td>

                    {/* Phone */}
                    <td className="px-5 py-4 text-gray-400">
                      {patient.phone}
                    </td>

                    {/* Last Visit */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2 text-gray-400">

                        <CalendarDays size={15} />

                        {patient.lastVisit}

                      </div>

                    </td>

                    {/* Condition */}
                    <td className="px-5 py-4 text-gray-400">
                      {patient.condition}
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">

                      <div className="flex justify-center">

                        <Link
                          href={`/doctor/patients/${patient.id}`}
                          title="View Patient"
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
                    No patients found
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