"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Stethoscope,
  MapPin,
  Clock,
  CalendarDays,
  Star,
  UserRound,
  ChevronRight,
  X,
} from "lucide-react";

export default function DoctorsPage() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [showFilter, setShowFilter] = useState(false);

  const departments = [
    "All",
    "Cardiology",
    "Dermatology",
    "General Medicine",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
  ];

  const doctors = [
    {
      id: 1,
      name: "Dr. Rahul Sharma",
      department: "Cardiology",
      specialization: "Cardiologist",
      experience: "12 Years",
      fee: "₹800",
      rating: "4.8",
      patients: "1,200+",
      location: "City Hospital, Jaipur",
      availability: "Available Today",
      nextSlot: "10:30 AM",
    },
    {
      id: 2,
      name: "Dr. Priya Mehta",
      department: "Dermatology",
      specialization: "Dermatologist",
      experience: "9 Years",
      fee: "₹600",
      rating: "4.7",
      patients: "950+",
      location: "City Hospital, Jaipur",
      availability: "Available Today",
      nextSlot: "04:00 PM",
    },
    {
      id: 3,
      name: "Dr. Amit Verma",
      department: "General Medicine",
      specialization: "Physician",
      experience: "15 Years",
      fee: "₹500",
      rating: "4.9",
      patients: "1,800+",
      location: "City Hospital, Jaipur",
      availability: "Available Tomorrow",
      nextSlot: "11:00 AM",
    },
    {
      id: 4,
      name: "Dr. Neha Gupta",
      department: "Neurology",
      specialization: "Neurologist",
      experience: "11 Years",
      fee: "₹900",
      rating: "4.8",
      patients: "1,100+",
      location: "City Hospital, Jaipur",
      availability: "Available Today",
      nextSlot: "02:30 PM",
    },
    {
      id: 5,
      name: "Dr. Rajesh Kumar",
      department: "Orthopedics",
      specialization: "Orthopedic Surgeon",
      experience: "14 Years",
      fee: "₹700",
      rating: "4.6",
      patients: "1,050+",
      location: "City Hospital, Jaipur",
      availability: "Available Tomorrow",
      nextSlot: "09:30 AM",
    },
    {
      id: 6,
      name: "Dr. Anjali Singh",
      department: "Pediatrics",
      specialization: "Pediatrician",
      experience: "8 Years",
      fee: "₹550",
      rating: "4.7",
      patients: "800+",
      location: "City Hospital, Jaipur",
      availability: "Available Today",
      nextSlot: "05:00 PM",
    },
  ];

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesDepartment =
      department === "All" ||
      doctor.department === department;

    const searchText = search.toLowerCase();

    const matchesSearch =
      doctor.name.toLowerCase().includes(searchText) ||
      doctor.specialization
        .toLowerCase()
        .includes(searchText) ||
      doctor.department
        .toLowerCase()
        .includes(searchText);

    return matchesDepartment && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="p-4 sm:p-6">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">
              Find Doctors
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Search and find the right doctor for your healthcare needs.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <UserRound size={15} />
            {doctors.length} Doctors Available
          </div>
        </div>

        {/* Search & Filter */}
        <div className="border border-gray-800 bg-[#080808] rounded-xl p-4 sm:p-5 mb-6">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search doctor, specialization..."
                className="w-full bg-black border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-gray-600"
              />
            </div>

            {/* Department */}
            <div className="relative lg:w-64">
              <select
                value={department}
                onChange={(e) =>
                  setDepartment(e.target.value)
                }
                className="w-full appearance-none bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-300 outline-none focus:border-gray-600"
              >
                {departments.map((item) => (
                  <option
                    key={item}
                    value={item}
                    className="bg-black"
                  >
                    {item === "All"
                      ? "All Departments"
                      : item}
                  </option>
                ))}
              </select>

              <Filter
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
              />
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() =>
                setShowFilter(!showFilter)
              }
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-800 text-sm text-gray-400 hover:text-white hover:bg-gray-900"
            >
              <Filter size={17} />
              Filters
            </button>
          </div>

          {/* Department Pills */}
          <div
            className={`${
              showFilter ? "flex" : "hidden"
            } lg:flex flex-wrap gap-2 mt-4`}
          >
            {departments.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setDepartment(item);
                  setShowFilter(false);
                }}
                className={`px-3 py-2 rounded-lg border text-xs transition ${
                  department === item
                    ? "bg-white text-black border-white"
                    : "border-gray-800 text-gray-500 hover:text-white hover:border-gray-600"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">
              Available Doctors
            </h2>

            <p className="text-xs text-gray-600 mt-1">
              Showing {filteredDoctors.length} doctors
            </p>
          </div>

          {(search || department !== "All") && (
            <button
              onClick={() => {
                setSearch("");
                setDepartment("All");
              }}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white"
            >
              <X size={14} />
              Clear Filters
            </button>
          )}
        </div>

        {/* Doctors */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {filteredDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
              />
            ))}
          </div>
        ) : (
          <div className="border border-gray-800 bg-[#080808] rounded-xl py-16 text-center">
            <div className="w-14 h-14 mx-auto rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center">
              <Stethoscope
                size={25}
                className="text-gray-600"
              />
            </div>

            <h3 className="text-sm font-medium mt-4">
              No doctors found
            </h3>

            <p className="text-xs text-gray-600 mt-2">
              Try changing your search or department filter.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

/* Doctor Card */

function DoctorCard({ doctor }) {
  const isToday =
    doctor.availability === "Available Today";

  return (
    <div className="border border-gray-800 bg-[#080808] rounded-xl p-5 hover:border-gray-700 transition">
      {/* Top */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0">
          <Stethoscope
            size={26}
            className="text-gray-300"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div>
              <h3 className="font-semibold">
                {doctor.name}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {doctor.specialization}
              </p>
            </div>

            <span className="w-fit flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-900 border border-gray-800 text-xs text-gray-400">
              <Star
                size={12}
                className="fill-current"
              />
              {doctor.rating}
            </span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
        <InfoItem
          label="Experience"
          value={doctor.experience}
        />

        <InfoItem
          label="Patients"
          value={doctor.patients}
        />

        <InfoItem
          label="Fee"
          value={doctor.fee}
        />

        <InfoItem
          label="Department"
          value={doctor.department}
        />
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mt-5">
        <MapPin size={14} />
        {doctor.location}
      </div>

      {/* Availability */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 p-3 rounded-lg bg-gray-900 border border-gray-800">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isToday
                ? "bg-green-400"
                : "bg-yellow-400"
            }`}
          />

          <span
            className={`text-xs ${
              isToday
                ? "text-green-400"
                : "text-yellow-400"
            }`}
          >
            {doctor.availability}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock size={14} />
          Next slot: {doctor.nextSlot}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2 mt-5">
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-800 text-sm text-gray-400 hover:text-white hover:bg-gray-900 transition">
          <UserRound size={16} />
          View Profile
        </button>

        <Link
          href="/patient/book-appointment"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-gray-200 transition"
        >
          <CalendarDays size={16} />
          Book Appointment
          <ChevronRight size={15} />
        </Link>
      </div>
    </div>
  );
}

/* Info Item */

function InfoItem({ label, value }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
      <p className="text-[10px] text-gray-600">
        {label}
      </p>

      <p className="text-xs text-gray-300 font-medium mt-1 truncate">
        {value}
      </p>
    </div>
  );
}