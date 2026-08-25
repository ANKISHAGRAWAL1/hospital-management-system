"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Clock3,
  FileText,
  HeartPulse,
  Hospital,
  Search,
  ShieldAlert,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";

const consultations = [
  {
    id: "CON-20260818-001",
    date: "18 Aug 2026",
    doctor: "Dr. Rahul Sharma",
    specialization: "Cardiologist",
    hospital: "City Hospital, Jaipur",
    diagnosis: "Mild Hypertension",
    reason: "Routine cardiac consultation",
    status: "Completed",
    notes:
      "Blood pressure slightly elevated. Continue medication and monitor BP regularly.",
    vitals: {
      bloodPressure: "138/88 mmHg",
      pulse: "78 bpm",
      temperature: "98.4 °F",
      weight: "68 kg",
      oxygen: "98%",
    },
  },
  {
    id: "CON-20260810-002",
    date: "10 Aug 2026",
    doctor: "Dr. Amit Verma",
    specialization: "General Medicine",
    hospital: "City Hospital, Jaipur",
    diagnosis: "Viral Fever",
    reason: "Fever and body ache",
    status: "Completed",
    notes:
      "Patient advised rest, hydration and prescribed medication for five days.",
    vitals: {
      bloodPressure: "124/82 mmHg",
      pulse: "82 bpm",
      temperature: "100.2 °F",
      weight: "68.5 kg",
      oxygen: "97%",
    },
  },
  {
    id: "CON-20260725-003",
    date: "25 Jul 2026",
    doctor: "Dr. Neha Gupta",
    specialization: "Neurologist",
    hospital: "Metro Care Hospital, Jaipur",
    diagnosis: "Migraine",
    reason: "Recurring headache",
    status: "Completed",
    notes:
      "Migraine triggers discussed. Patient advised adequate sleep and hydration.",
    vitals: {
      bloodPressure: "120/80 mmHg",
      pulse: "76 bpm",
      temperature: "98.2 °F",
      weight: "69 kg",
      oxygen: "99%",
    },
  },
  {
    id: "CON-20260712-004",
    date: "12 Jul 2026",
    doctor: "Dr. Priya Mehta",
    specialization: "Dermatologist",
    hospital: "City Hospital, Jaipur",
    diagnosis: "Skin Irritation",
    reason: "Skin redness and itching",
    status: "Completed",
    notes:
      "Allergic reaction suspected. Medication prescribed and follow-up advised.",
    vitals: {
      bloodPressure: "122/80 mmHg",
      pulse: "75 bpm",
      temperature: "98.1 °F",
      weight: "69 kg",
      oxygen: "98%",
    },
  },
];

const conditions = [
  {
    name: "Mild Hypertension",
    since: "Aug 2026",
    status: "Under Monitoring",
  },
  {
    name: "Migraine",
    since: "Jul 2026",
    status: "Managed",
  },
];

const allergies = [
  {
    name: "Dust",
    reaction: "Sneezing / Nasal irritation",
    severity: "Moderate",
  },
  {
    name: "Penicillin",
    reaction: "Skin rash",
    severity: "Severe",
  },
];

const procedures = [
  {
    name: "Appendectomy",
    date: "12 Mar 2021",
    hospital: "City Hospital, Jaipur",
    doctor: "Dr. Rajiv Meena",
  },
];

const vitalsHistory = [
  {
    date: "18 Aug 2026",
    bloodPressure: "138/88",
    pulse: "78",
    weight: "68 kg",
    oxygen: "98%",
  },
  {
    date: "10 Aug 2026",
    bloodPressure: "124/82",
    pulse: "82",
    weight: "68.5 kg",
    oxygen: "97%",
  },
  {
    date: "25 Jul 2026",
    bloodPressure: "120/80",
    pulse: "76",
    weight: "69 kg",
    oxygen: "99%",
  },
];

export default function MedicalHistoryPage() {
  const [search, setSearch] = useState("");
  const [selectedConsultation, setSelectedConsultation] =
    useState(null);

  const filteredConsultations = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return consultations;

    return consultations.filter((item) => {
      return (
        item.id.toLowerCase().includes(query) ||
        item.doctor.toLowerCase().includes(query) ||
        item.specialization.toLowerCase().includes(query) ||
        item.hospital.toLowerCase().includes(query) ||
        item.diagnosis.toLowerCase().includes(query) ||
        item.reason.toLowerCase().includes(query)
      );
    });
  }, [search]);

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="p-4 sm:p-6">

        {/* PAGE HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardList
                size={22}
                className="text-gray-400"
              />

              <h1 className="text-xl sm:text-2xl font-semibold">
                Medical History
              </h1>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              View your consultations, diagnoses, conditions,
              allergies and health history.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FileText size={15} />
            Patient ID: PAT-10024
          </div>
        </div>

        {/* PATIENT OVERVIEW */}
        <div className="border border-gray-800 bg-[#080808] rounded-xl p-5 sm:p-6 mb-6">
          <div className="flex flex-col xl:flex-row xl:items-center gap-6">

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center">
                <UserRound
                  size={27}
                  className="text-gray-400"
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  Ankish Gupta
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Patient ID: PAT-10024
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 xl:ml-auto">
              <OverviewItem
                label="Blood Group"
                value="B+"
              />

              <OverviewItem
                label="Age"
                value="24 Years"
              />

              <OverviewItem
                label="Height"
                value="172 cm"
              />

              <OverviewItem
                label="Weight"
                value="68 kg"
              />
            </div>
          </div>
        </div>

        {/* ALERTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

          {/* Allergies */}
          <div className="border border-red-500/20 bg-red-500/[0.03] rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <ShieldAlert
                  size={18}
                  className="text-red-400"
                />
              </div>

              <div>
                <h2 className="text-sm font-semibold">
                  Known Allergies
                </h2>

                <p className="text-xs text-gray-600 mt-1">
                  Important information for healthcare providers
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {allergies.map((allergy) => (
                <div
                  key={allergy.name}
                  className="border border-gray-800 bg-black/30 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">
                      {allergy.name}
                    </p>

                    <span className="text-[10px] px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                      {allergy.severity}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    Reaction: {allergy.reaction}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Conditions */}
          <div className="border border-gray-800 bg-[#080808] rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center">
                <Activity
                  size={18}
                  className="text-gray-400"
                />
              </div>

              <div>
                <h2 className="text-sm font-semibold">
                  Chronic / Existing Conditions
                </h2>

                <p className="text-xs text-gray-600 mt-1">
                  Conditions currently recorded in your profile
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {conditions.map((condition) => (
                <div
                  key={condition.name}
                  className="border border-gray-800 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">
                      {condition.name}
                    </p>

                    <span className="text-[10px] px-2 py-1 rounded-full bg-gray-900 text-gray-400 border border-gray-800">
                      {condition.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 mt-2">
                    Since: {condition.since}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PROCEDURES */}
        <section className="border border-gray-800 bg-[#080808] rounded-xl p-5 sm:p-6 mb-6">
          <SectionHeader
            icon={Hospital}
            title="Surgeries & Procedures"
            description="Previous surgeries and major medical procedures"
          />

          <div className="mt-5 space-y-3">
            {procedures.map((procedure) => (
              <div
                key={procedure.name}
                className="border border-gray-800 rounded-lg p-4"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-medium">
                      {procedure.name}
                    </h3>

                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={13} />
                        {procedure.date}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Hospital size={13} />
                        {procedure.hospital}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <UserRound size={13} />
                        {procedure.doctor}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] px-2.5 py-1 rounded-full border border-gray-800 bg-gray-900 text-gray-500">
                    Historical
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* VITALS */}
        <section className="border border-gray-800 bg-[#080808] rounded-xl p-5 sm:p-6 mb-6">
          <SectionHeader
            icon={HeartPulse}
            title="Vitals History"
            description="Recent recorded vital signs"
          />

          <div className="overflow-x-auto mt-5">
            <table className="w-full min-w-[650px]">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-[10px] uppercase tracking-wide text-gray-600 font-medium py-3">
                    Date
                  </th>

                  <th className="text-left text-[10px] uppercase tracking-wide text-gray-600 font-medium py-3">
                    Blood Pressure
                  </th>

                  <th className="text-left text-[10px] uppercase tracking-wide text-gray-600 font-medium py-3">
                    Pulse
                  </th>

                  <th className="text-left text-[10px] uppercase tracking-wide text-gray-600 font-medium py-3">
                    Weight
                  </th>

                  <th className="text-left text-[10px] uppercase tracking-wide text-gray-600 font-medium py-3">
                    SpO₂
                  </th>
                </tr>
              </thead>

              <tbody>
                {vitalsHistory.map((vital) => (
                  <tr
                    key={vital.date}
                    className="border-b border-gray-800 last:border-0"
                  >
                    <td className="py-4 text-xs text-gray-300">
                      {vital.date}
                    </td>

                    <td className="py-4 text-xs text-gray-400">
                      {vital.bloodPressure} mmHg
                    </td>

                    <td className="py-4 text-xs text-gray-400">
                      {vital.pulse} bpm
                    </td>

                    <td className="py-4 text-xs text-gray-400">
                      {vital.weight}
                    </td>

                    <td className="py-4 text-xs text-gray-400">
                      {vital.oxygen}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CONSULTATIONS */}
        <section className="border border-gray-800 bg-[#080808] rounded-xl">
          <div className="p-5 sm:p-6 border-b border-gray-800">
            <SectionHeader
              icon={Stethoscope}
              title="Consultation History"
              description="Your previous doctor visits and diagnoses"
            />

            <div className="relative mt-5">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search doctor, diagnosis, hospital or consultation..."
                className="w-full bg-black border border-gray-800 rounded-lg pl-10 pr-10 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-gray-600"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {filteredConsultations.length > 0 ? (
              <div className="relative">

                {/* Timeline Line */}
                <div className="absolute left-[19px] top-3 bottom-3 w-px bg-gray-800 hidden sm:block" />

                <div className="space-y-5">
                  {filteredConsultations.map(
                    (consultation) => (
                      <ConsultationCard
                        key={consultation.id}
                        consultation={consultation}
                        onView={() =>
                          setSelectedConsultation(
                            consultation
                          )
                        }
                      />
                    )
                  )}
                </div>
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </section>
      </main>

      {/* CONSULTATION MODAL */}
      {selectedConsultation && (
        <ConsultationModal
          consultation={selectedConsultation}
          onClose={() =>
            setSelectedConsultation(null)
          }
        />
      )}
    </div>
  );
}

/* ================================= */
/* Consultation Card */
/* ================================= */

function ConsultationCard({
  consultation,
  onView,
}) {
  return (
    <div className="relative sm:pl-12">
      {/* Timeline Dot */}
      <div className="hidden sm:flex absolute left-0 top-3 w-10 h-10 rounded-full bg-gray-900 border border-gray-800 items-center justify-center z-10">
        <Stethoscope
          size={17}
          className="text-gray-500"
        />
      </div>

      <div className="border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition">
        <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500">
                {consultation.date}
              </span>

              <span className="text-[10px] px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                {consultation.status}
              </span>
            </div>

            <h3 className="text-base font-semibold mt-3">
              {consultation.diagnosis}
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              {consultation.reason}
            </p>

            <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-600">
              <span className="flex items-center gap-1.5">
                <UserRound size={13} />
                {consultation.doctor}
              </span>

              <span className="flex items-center gap-1.5">
                <Stethoscope size={13} />
                {consultation.specialization}
              </span>

              <span className="flex items-center gap-1.5">
                <Hospital size={13} />
                {consultation.hospital}
              </span>
            </div>
          </div>

          <button
            onClick={onView}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-800 text-xs text-gray-400 hover:text-white hover:bg-gray-900 transition"
          >
            View Details
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="border-t border-gray-800 mt-5 pt-4">
          <p className="text-[10px] uppercase tracking-wide text-gray-600">
            Doctor's Notes
          </p>

          <p className="text-xs text-gray-500 mt-2 leading-5">
            {consultation.notes}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================================= */
/* Consultation Modal */
/* ================================= */

function ConsultationModal({
  consultation,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#080808] border border-gray-800 rounded-xl">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#080808] border-b border-gray-800 px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold">
              Consultation Details
            </h2>

            <p className="text-xs text-gray-600 mt-1">
              {consultation.id}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-900"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">

          {/* Doctor */}
          <div className="border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center">
                <UserRound
                  size={22}
                  className="text-gray-400"
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold">
                  {consultation.doctor}
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  {consultation.specialization}
                </p>

                <p className="text-xs text-gray-600 mt-1">
                  {consultation.hospital}
                </p>
              </div>
            </div>
          </div>

          {/* Visit Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
            <InfoBox
              label="Visit Date"
              value={consultation.date}
            />

            <InfoBox
              label="Diagnosis"
              value={consultation.diagnosis}
            />

            <InfoBox
              label="Visit Reason"
              value={consultation.reason}
            />
          </div>

          {/* Vitals */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-3">
              Recorded Vitals
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <InfoBox
                label="Blood Pressure"
                value={consultation.vitals.bloodPressure}
              />

              <InfoBox
                label="Pulse"
                value={consultation.vitals.pulse}
              />

              <InfoBox
                label="Temperature"
                value={consultation.vitals.temperature}
              />

              <InfoBox
                label="Weight"
                value={consultation.vitals.weight}
              />

              <InfoBox
                label="SpO₂"
                value={consultation.vitals.oxygen}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="border border-gray-800 rounded-xl p-5 mt-5">
            <div className="flex items-center gap-2">
              <FileText
                size={17}
                className="text-gray-500"
              />

              <h3 className="text-sm font-medium">
                Clinical Notes
              </h3>
            </div>

            <p className="text-xs text-gray-500 mt-3 leading-6">
              {consultation.notes}
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-5">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-800 text-sm text-gray-400 hover:text-white hover:bg-gray-900 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================= */
/* Small Components */
/* ================================= */

function SectionHeader({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center">
        <Icon
          size={18}
          className="text-gray-400"
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold">
          {title}
        </h2>

        <p className="text-xs text-gray-600 mt-1">
          {description}
        </p>
      </div>
    </div>
  );
}

function OverviewItem({ label, value }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 min-w-[105px]">
      <p className="text-[10px] text-gray-600">
        {label}
      </p>

      <p className="text-sm font-medium text-gray-300 mt-1">
        {value}
      </p>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
      <p className="text-[10px] text-gray-600">
        {label}
      </p>

      <p className="text-xs text-gray-300 mt-1">
        {value}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-16 text-center">
      <div className="w-14 h-14 mx-auto rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center">
        <ClipboardList
          size={25}
          className="text-gray-600"
        />
      </div>

      <h3 className="text-sm font-medium mt-4">
        No medical history found
      </h3>

      <p className="text-xs text-gray-600 mt-2">
        Try changing your search criteria.
      </p>
    </div>
  );
}