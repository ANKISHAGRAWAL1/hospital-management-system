"use client";

import Link from "next/link";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  HeartPulse,
  ShieldCheck,
  Pencil,
  Clock3,
  Stethoscope,
  FileText,
} from "lucide-react";

export default function PatientDetailsPage() {
  const patient = {
    id: "PAT-1001",
    name: "Rahul Sharma",
    firstName: "Rahul",
    lastName: "Sharma",
    age: 34,
    gender: "Male",
    dob: "12 May 1992",
    bloodGroup: "B+",
    phone: "+91 98765 43210",
    email: "rahul.sharma@example.com",
    address: "45 Shastri Nagar",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302016",
    registered: "25 Aug 2026",
    status: "Active",
    emergencyName: "Amit Sharma",
    emergencyPhone: "+91 98765 11111",
    emergencyRelation: "Brother",
    insuranceProvider: "Star Health Insurance",
    insuranceNumber: "SHI-458921",
  };

  const appointments = [
    {
      id: "APT-1024",
      doctor: "Dr. Amit Verma",
      department: "Cardiology",
      date: "25 Aug 2026",
      time: "10:30 AM",
      status: "Waiting",
    },
    {
      id: "APT-0988",
      doctor: "Dr. Neha Singh",
      department: "Dermatology",
      date: "12 Aug 2026",
      time: "11:00 AM",
      status: "Completed",
    },
    {
      id: "APT-0942",
      doctor: "Dr. Raj Meena",
      department: "Orthopedics",
      date: "28 Jul 2026",
      time: "04:30 PM",
      status: "Completed",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-7">

        <div className="flex items-center gap-4">
          <Link
            href="/receptionist/patients"
            className="p-2.5 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-900 transition"
          >
            <ArrowLeft size={19} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold">
              Patient Details
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              View patient information and appointment history
            </p>
          </div>
        </div>

        <Link
          href={`/receptionist/patients/${patient.id}/edit`}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-gray-200 transition"
        >
          <Pencil size={16} />
          Edit Patient
        </Link>

      </div>

      {/* Patient Overview */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 mb-6">

        <div className="flex flex-col md:flex-row md:items-center gap-5">

          <div className="w-20 h-20 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center">
            <User size={34} className="text-gray-400" />
          </div>

          <div className="flex-1">

            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold">
                {patient.name}
              </h2>

              <span className="px-2.5 py-1 rounded-full bg-green-950 text-green-400 text-xs font-medium">
                {patient.status}
              </span>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              Patient ID:{" "}
              <span className="text-gray-300">
                {patient.id}
              </span>
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-gray-400">
              <span>
                {patient.age} Years
              </span>

              <span>
                {patient.gender}
              </span>

              <span className="text-red-400">
                Blood Group: {patient.bloodGroup}
              </span>
            </div>

          </div>

          <div className="text-left md:text-right">
            <p className="text-xs text-gray-600">
              Registered On
            </p>

            <p className="text-sm text-gray-300 mt-1">
              {patient.registered}
            </p>
          </div>

        </div>

      </div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">

        {/* Personal Information */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl">

          <div className="flex items-center gap-3 p-5 border-b border-gray-800">
            <div className="p-2.5 rounded-lg bg-gray-900">
              <User size={18} className="text-gray-300" />
            </div>

            <div>
              <h2 className="font-semibold">
                Personal Information
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Basic patient information
              </p>
            </div>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">

            <InfoItem
              label="First Name"
              value={patient.firstName}
            />

            <InfoItem
              label="Last Name"
              value={patient.lastName}
            />

            <InfoItem
              label="Date of Birth"
              value={patient.dob}
            />

            <InfoItem
              label="Gender"
              value={patient.gender}
            />

            <InfoItem
              label="Blood Group"
              value={patient.bloodGroup}
            />

            <InfoItem
              label="Patient ID"
              value={patient.id}
            />

          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl">

          <div className="flex items-center gap-3 p-5 border-b border-gray-800">
            <div className="p-2.5 rounded-lg bg-gray-900">
              <Phone size={18} className="text-gray-300" />
            </div>

            <div>
              <h2 className="font-semibold">
                Contact Information
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Patient contact details
              </p>
            </div>
          </div>

          <div className="p-5 space-y-5">

            <InfoRow
              icon={Phone}
              label="Mobile Number"
              value={patient.phone}
            />

            <InfoRow
              icon={Mail}
              label="Email Address"
              value={patient.email}
            />

            <InfoRow
              icon={MapPin}
              label="Address"
              value={`${patient.address}, ${patient.city}, ${patient.state} - ${patient.pincode}`}
            />

          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl">

          <div className="flex items-center gap-3 p-5 border-b border-gray-800">
            <div className="p-2.5 rounded-lg bg-gray-900">
              <HeartPulse size={18} className="text-gray-300" />
            </div>

            <div>
              <h2 className="font-semibold">
                Emergency Contact
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Emergency contact information
              </p>
            </div>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-5">

            <InfoItem
              label="Name"
              value={patient.emergencyName}
            />

            <InfoItem
              label="Phone"
              value={patient.emergencyPhone}
            />

            <InfoItem
              label="Relationship"
              value={patient.emergencyRelation}
            />

          </div>
        </div>

        {/* Insurance */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl">

          <div className="flex items-center gap-3 p-5 border-b border-gray-800">
            <div className="p-2.5 rounded-lg bg-gray-900">
              <ShieldCheck size={18} className="text-gray-300" />
            </div>

            <div>
              <h2 className="font-semibold">
                Insurance Information
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Insurance and policy details
              </p>
            </div>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">

            <InfoItem
              label="Provider"
              value={patient.insuranceProvider}
            />

            <InfoItem
              label="Policy Number"
              value={patient.insuranceNumber}
            />

          </div>
        </div>

      </div>

      {/* Appointment History */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl">

        <div className="flex items-center justify-between p-5 border-b border-gray-800">

          <div className="flex items-center gap-3">

            <div className="p-2.5 rounded-lg bg-gray-900">
              <CalendarDays size={18} className="text-gray-300" />
            </div>

            <div>
              <h2 className="font-semibold">
                Appointment History
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Recent and upcoming appointments
              </p>
            </div>

          </div>

          <Link
            href="/receptionist/appointments/add"
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-800 text-xs text-gray-400 hover:bg-gray-900 hover:text-white transition"
          >
            <CalendarDays size={14} />
            New Appointment
          </Link>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="border-b border-gray-800 text-left">

                <th className="px-5 py-4 text-gray-500 font-medium">
                  Appointment
                </th>

                <th className="px-5 py-4 text-gray-500 font-medium">
                  Doctor
                </th>

                <th className="px-5 py-4 text-gray-500 font-medium">
                  Date & Time
                </th>

                <th className="px-5 py-4 text-gray-500 font-medium">
                  Status
                </th>

                <th className="px-5 py-4 text-gray-500 font-medium">
                  Action
                </th>

              </tr>
            </thead>

            <tbody>

              {appointments.map((appointment) => (
                <tr
                  key={appointment.id}
                  className="border-b border-gray-900 last:border-0"
                >

                  <td className="px-5 py-4">

                    <p className="font-medium text-white">
                      {appointment.id}
                    </p>

                    <p className="text-xs text-gray-600 mt-1">
                      {appointment.department}
                    </p>

                  </td>

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">
                      <Stethoscope
                        size={15}
                        className="text-gray-600"
                      />

                      <span className="text-gray-300">
                        {appointment.doctor}
                      </span>
                    </div>

                  </td>

                  <td className="px-5 py-4">

                    <p className="text-gray-300">
                      {appointment.date}
                    </p>

                    <p className="text-xs text-gray-600 mt-1">
                      {appointment.time}
                    </p>

                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        appointment.status === "Completed"
                          ? "bg-green-950 text-green-400"
                          : "bg-yellow-950 text-yellow-400"
                      }`}
                    >
                      {appointment.status === "Completed" ? (
                        <Clock3 size={12} />
                      ) : (
                        <CalendarDays size={12} />
                      )}

                      {appointment.status}
                    </span>

                  </td>

                  <td className="px-5 py-4">

                    <Link
                      href={`/receptionist/appointments/${appointment.id}`}
                      className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-white transition"
                    >
                      <FileText size={14} />
                      View
                    </Link>

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

/* Small Info Component */
function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-600 mb-1">
        {label}
      </p>

      <p className="text-sm text-gray-300">
        {value}
      </p>
    </div>
  );
}

/* Icon Info Component */
function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">

      <div className="p-2 rounded-lg bg-gray-900">
        <Icon size={16} className="text-gray-400" />
      </div>

      <div>
        <p className="text-xs text-gray-600">
          {label}
        </p>

        <p className="text-sm text-gray-300 mt-1">
          {value}
        </p>
      </div>

    </div>
  );
}