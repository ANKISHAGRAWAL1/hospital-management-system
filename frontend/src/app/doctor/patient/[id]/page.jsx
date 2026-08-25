"use client";

import Link from "next/link";
import {
  ArrowLeft,
  UserRound,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  Activity,
  FileText,
  Pill,
  Stethoscope,
  Clock,
} from "lucide-react";

export default function PatientDetailsPage() {
  const patient = {
    id: "PT-1024",
    name: "Priya Gupta",
    age: 29,
    gender: "Female",
    bloodGroup: "B+",
    phone: "9876543210",
    email: "priya@example.com",
    address: "Jaipur, Rajasthan",
    allergies: "No known allergies",
    lastVisit: "24 Aug 2026",
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-8">

      {/* Back */}
      <Link
        href="/doctor/patients"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-6"
      >
        <ArrowLeft size={17} />
        Back to Patients
      </Link>

      {/* Header */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 mb-6">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center">
              <UserRound
                size={30}
                className="text-gray-400"
              />
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
                {patient.age} yrs • {patient.gender} • Blood Group{" "}
                {patient.bloodGroup}
              </p>

            </div>

          </div>

          <Link
            href="/doctor/consultations"
            className="inline-flex items-center justify-center gap-2 bg-white text-black px-5 py-3 rounded-lg text-sm font-medium hover:bg-gray-200"
          >
            <Stethoscope size={17} />
            Start Consultation
          </Link>

        </div>

      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="xl:col-span-2 space-y-6">

          {/* Personal Information */}
          <section className="bg-gray-950 border border-gray-800 rounded-xl">

            <div className="p-5 border-b border-gray-800">

              <h2 className="font-semibold">
                Personal Information
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Patient contact and basic information
              </p>

            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">

              <Info
                icon={UserRound}
                label="Full Name"
                value={patient.name}
              />

              <Info
                icon={CalendarDays}
                label="Age / Gender"
                value={`${patient.age} yrs / ${patient.gender}`}
              />

              <Info
                icon={Phone}
                label="Phone"
                value={patient.phone}
              />

              <Info
                icon={Mail}
                label="Email"
                value={patient.email}
              />

              <Info
                icon={MapPin}
                label="Address"
                value={patient.address}
              />

              <Info
                icon={Activity}
                label="Blood Group"
                value={patient.bloodGroup}
              />

            </div>

          </section>

          {/* Medical Information */}
          <section className="bg-gray-950 border border-gray-800 rounded-xl">

            <div className="p-5 border-b border-gray-800">

              <h2 className="font-semibold">
                Medical Information
              </h2>

            </div>

            <div className="p-5 space-y-5">

              <div>

                <p className="text-xs text-gray-500">
                  Allergies
                </p>

                <p className="text-sm text-gray-300 mt-1">
                  {patient.allergies}
                </p>

              </div>

              <div>

                <p className="text-xs text-gray-500">
                  Current Complaint
                </p>

                <p className="text-sm text-gray-300 mt-1">
                  Chest discomfort and fatigue
                </p>

              </div>

            </div>

          </section>

          {/* Medical History */}
          <section className="bg-gray-950 border border-gray-800 rounded-xl">

            <div className="p-5 border-b border-gray-800">

              <div className="flex items-center gap-3">

                <FileText
                  size={19}
                  className="text-gray-400"
                />

                <div>

                  <h2 className="font-semibold">
                    Medical History
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Previous diagnoses and consultations
                  </p>

                </div>

              </div>

            </div>

            <div className="p-5 space-y-4">

              <HistoryItem
                date="24 Aug 2026"
                title="Chest discomfort"
                doctor="Dr. Amit Kumar"
                description="Patient reported chest discomfort and fatigue."
              />

              <HistoryItem
                date="10 Aug 2026"
                title="Hypertension"
                doctor="Dr. Amit Kumar"
                description="Blood pressure monitoring advised."
              />

              <HistoryItem
                date="02 Jul 2026"
                title="Routine Checkup"
                doctor="Dr. Amit Kumar"
                description="General health examination completed."
              />

            </div>

          </section>

          {/* Prescriptions */}
          <section className="bg-gray-950 border border-gray-800 rounded-xl">

            <div className="p-5 border-b border-gray-800">

              <div className="flex items-center gap-3">

                <Pill
                  size={19}
                  className="text-gray-400"
                />

                <div>

                  <h2 className="font-semibold">
                    Previous Prescriptions
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Patient's previous medicines
                  </p>

                </div>

              </div>

            </div>

            <div className="p-5 space-y-4">

              <Prescription
                date="24 Aug 2026"
                medicine="Paracetamol 500 mg"
                frequency="Twice a day"
                duration="5 days"
              />

              <Prescription
                date="10 Aug 2026"
                medicine="Amlodipine 5 mg"
                frequency="Once a day"
                duration="30 days"
              />

            </div>

          </section>

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* Quick Info */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl">

            <div className="p-5 border-b border-gray-800">

              <h2 className="font-semibold">
                Patient Overview
              </h2>

            </div>

            <div className="p-5 space-y-5">

              <Summary
                label="Patient ID"
                value={patient.id}
              />

              <Summary
                label="Blood Group"
                value={patient.bloodGroup}
              />

              <Summary
                label="Allergies"
                value={patient.allergies}
              />

              <Summary
                label="Last Visit"
                value={patient.lastVisit}
              />

            </div>

          </div>

          {/* Recent Consultation */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl">

            <div className="p-5 border-b border-gray-800">

              <div className="flex items-center gap-3">

                <Clock
                  size={18}
                  className="text-gray-400"
                />

                <h2 className="font-semibold">
                  Recent Consultation
                </h2>

              </div>

            </div>

            <div className="p-5">

              <p className="text-sm text-gray-300">
                Chest discomfort and fatigue
              </p>

              <p className="text-xs text-gray-600 mt-2">
                24 Aug 2026 • 11:00 AM
              </p>

              <div className="mt-4 p-3 bg-black border border-gray-800 rounded-lg">

                <p className="text-xs text-gray-500">
                  Diagnosis
                </p>

                <p className="text-sm text-gray-300 mt-1">
                  Under evaluation
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

/* Info */
function Info({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="p-2.5 bg-black border border-gray-800 rounded-lg">
        <Icon
          size={17}
          className="text-gray-500"
        />
      </div>

      <div>

        <p className="text-xs text-gray-500">
          {label}
        </p>

        <p className="text-sm text-gray-300 mt-1">
          {value}
        </p>

      </div>

    </div>
  );
}

/* Summary */
function Summary({
  label,
  value,
}) {
  return (
    <div>

      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="text-sm text-gray-300 mt-1">
        {value}
      </p>

    </div>
  );
}

/* History */
function HistoryItem({
  date,
  title,
  doctor,
  description,
}) {
  return (
    <div className="p-4 bg-black border border-gray-800 rounded-lg">

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">

        <div>

          <p className="text-sm font-medium">
            {title}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            {doctor}
          </p>

        </div>

        <span className="text-xs text-gray-600">
          {date}
        </span>

      </div>

      <p className="text-xs text-gray-500 mt-3">
        {description}
      </p>

    </div>
  );
}

/* Prescription */
function Prescription({
  date,
  medicine,
  frequency,
  duration,
}) {
  return (
    <div className="p-4 bg-black border border-gray-800 rounded-lg">

      <div className="flex justify-between gap-3">

        <div>

          <p className="text-sm font-medium">
            {medicine}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            {frequency} • {duration}
          </p>

        </div>

        <span className="text-xs text-gray-600">
          {date}
        </span>

      </div>

    </div>
  );
}