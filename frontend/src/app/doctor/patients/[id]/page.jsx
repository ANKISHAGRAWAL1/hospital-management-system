"use client";

import Link from "next/link";
import {
  ArrowLeft,
  UserRound,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  Clock,
  HeartPulse,
  AlertCircle,
  FileText,
  Activity,
  Edit3,
} from "lucide-react";

export default function PatientDetails() {
  const patient = {
    id: "PT-1024",
    name: "Priya Gupta",
    age: 29,
    gender: "Female",
    dob: "14 March 1997",
    bloodGroup: "B+",
    phone: "+91 98765 43210",
    email: "priya@example.com",
    address: "Jaipur, Rajasthan",
    emergencyContact: "Rahul Gupta",
    emergencyPhone: "+91 98765 12345",
    allergies: "No known allergies",
    condition: "Fatigue & Chest Discomfort",
  };

  const appointments = [
    {
      date: "24 Aug 2026",
      time: "11:00 AM",
      type: "New Visit",
      doctor: "Dr. Raj Sharma",
      status: "In Progress",
    },
    {
      date: "10 Aug 2026",
      time: "03:30 PM",
      type: "Follow-up",
      doctor: "Dr. Raj Sharma",
      status: "Completed",
    },
    {
      date: "22 Jul 2026",
      time: "11:00 AM",
      type: "Consultation",
      doctor: "Dr. Raj Sharma",
      status: "Completed",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-8">

      {/* Back */}
      <Link
        href="/doctor/appointments"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-6"
      >
        <ArrowLeft size={17} />
        Back to Appointments
      </Link>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div className="flex items-center gap-4">

          <div className="w-16 h-16 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center">
            <UserRound size={30} className="text-gray-400" />
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold">
                {patient.name}
              </h1>

              <span className="px-2.5 py-1 rounded-full bg-gray-900 border border-gray-800 text-xs text-gray-400">
                {patient.id}
              </span>
            </div>

            <p className="text-sm text-gray-500 mt-1">
              {patient.age} years • {patient.gender} • Blood Group{" "}
              {patient.bloodGroup}
            </p>
          </div>

        </div>

        <div className="flex items-center gap-3">

          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-800 text-sm text-gray-400 hover:text-white hover:bg-gray-900">
            <Edit3 size={16} />
            Edit Patient
          </button>

          <Link
            href="/doctor/consultation"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-gray-200"
          >
            <Activity size={16} />
            Start Consultation
          </Link>

        </div>
      </div>

      {/* Alert */}
      <div className="flex items-start gap-3 p-4 mb-6 rounded-xl border border-gray-800 bg-gray-950">

        <AlertCircle
          size={19}
          className="text-gray-400 mt-0.5"
        />

        <div>
          <p className="text-sm font-medium">
            Current Reason for Visit
          </p>

          <p className="text-sm text-gray-500 mt-1">
            {patient.condition}
          </p>
        </div>

      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left */}
        <div className="xl:col-span-2 space-y-6">

          {/* Patient Information */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl">

            <div className="p-5 border-b border-gray-800">
              <h2 className="font-semibold">
                Patient Information
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Personal and contact information
              </p>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">

              <InfoItem
                icon={CalendarDays}
                label="Date of Birth"
                value={patient.dob}
              />

              <InfoItem
                icon={HeartPulse}
                label="Blood Group"
                value={patient.bloodGroup}
              />

              <InfoItem
                icon={Phone}
                label="Phone"
                value={patient.phone}
              />

              <InfoItem
                icon={Mail}
                label="Email"
                value={patient.email}
              />

              <InfoItem
                icon={MapPin}
                label="Address"
                value={patient.address}
              />

              <InfoItem
                icon={UserRound}
                label="Emergency Contact"
                value={`${patient.emergencyContact} (${patient.emergencyPhone})`}
              />

            </div>
          </div>

          {/* Medical Information */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl">

            <div className="p-5 border-b border-gray-800">
              <h2 className="font-semibold">
                Medical Information
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Important medical information
              </p>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">

              <div className="p-4 bg-black border border-gray-800 rounded-lg">
                <p className="text-xs text-gray-500">
                  Allergies
                </p>

                <p className="text-sm mt-2">
                  {patient.allergies}
                </p>
              </div>

              <div className="p-4 bg-black border border-gray-800 rounded-lg">
                <p className="text-xs text-gray-500">
                  Current Condition
                </p>

                <p className="text-sm mt-2">
                  {patient.condition}
                </p>
              </div>

            </div>
          </div>

          {/* Appointment History */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">

            <div className="p-5 border-b border-gray-800">
              <h2 className="font-semibold">
                Appointment History
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Previous and current appointments
              </p>
            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[650px]">

                <thead>
                  <tr className="border-b border-gray-800 text-left">

                    <th className="px-5 py-4 text-xs text-gray-500">
                      DATE
                    </th>

                    <th className="px-5 py-4 text-xs text-gray-500">
                      TIME
                    </th>

                    <th className="px-5 py-4 text-xs text-gray-500">
                      TYPE
                    </th>

                    <th className="px-5 py-4 text-xs text-gray-500">
                      DOCTOR
                    </th>

                    <th className="px-5 py-4 text-xs text-gray-500">
                      STATUS
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-800">

                  {appointments.map((item, index) => (
                    <tr key={index}>

                      <td className="px-5 py-4 text-sm">
                        {item.date}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-400">
                        {item.time}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-400">
                        {item.type}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-400">
                        {item.doctor}
                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`px-3 py-1.5 rounded-full text-xs ${
                            item.status === "In Progress"
                              ? "bg-white text-black"
                              : "bg-gray-800 text-gray-300"
                          }`}
                        >
                          {item.status}
                        </span>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          </div>

        </div>

        {/* Right */}
        <div className="space-y-6">

          {/* Today's Appointment */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl">

            <div className="p-5 border-b border-gray-800">
              <h2 className="font-semibold">
                Today's Appointment
              </h2>
            </div>

            <div className="p-5">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                  <Clock size={19} />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    11:00 AM
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    New Visit
                  </p>
                </div>

              </div>

              <div className="mt-5 pt-5 border-t border-gray-800">

                <p className="text-xs text-gray-500">
                  Appointment Reason
                </p>

                <p className="text-sm mt-2">
                  {patient.condition}
                </p>

              </div>

            </div>
          </div>

          {/* Vitals */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl">

            <div className="p-5 border-b border-gray-800">
              <h2 className="font-semibold">
                Latest Vitals
              </h2>
            </div>

            <div className="p-5 grid grid-cols-2 gap-3">

              <Vital
                label="Blood Pressure"
                value="120/80"
                unit="mmHg"
              />

              <Vital
                label="Heart Rate"
                value="76"
                unit="bpm"
              />

              <Vital
                label="Temperature"
                value="98.4"
                unit="°F"
              />

              <Vital
                label="Weight"
                value="62"
                unit="kg"
              />

            </div>
          </div>

          {/* Notes */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl">

            <div className="p-5 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <FileText size={18} />

                <h2 className="font-semibold">
                  Doctor Notes
                </h2>
              </div>
            </div>

            <div className="p-5">

              <p className="text-sm text-gray-400 leading-6">
                Patient reports occasional chest discomfort
                and fatigue for the last two weeks. Further
                evaluation required.
              </p>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">

      <div className="p-2.5 rounded-lg bg-gray-900">
        <Icon size={17} className="text-gray-400" />
      </div>

      <div>
        <p className="text-xs text-gray-500">
          {label}
        </p>

        <p className="text-sm text-gray-200 mt-1">
          {value}
        </p>
      </div>

    </div>
  );
}

function Vital({ label, value, unit }) {
  return (
    <div className="bg-black border border-gray-800 rounded-lg p-4">

      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="text-lg font-medium mt-2">
        {value}
        <span className="text-xs text-gray-500 ml-1">
          {unit}
        </span>
      </p>

    </div>
  );
}