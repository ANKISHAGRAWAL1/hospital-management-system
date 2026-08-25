"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Pill,
  CalendarDays,
  UserRound,
  FileText,
  Eye,
  Download,
  Clock3,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  X,
} from "lucide-react";

const prescriptions = [
  {
    id: "RX-20260818-001",
    doctor: "Dr. Rahul Sharma",
    specialization: "Cardiologist",
    date: "18 Aug 2026",
    diagnosis: "Mild hypertension",
    status: "Active",
    medicines: [
      {
        name: "Amlodipine 5mg",
        dosage: "1 tablet",
        frequency: "Once daily",
        timing: "After breakfast",
        duration: "30 Days",
        remaining: "24 Days",
      },
      {
        name: "Atorvastatin 10mg",
        dosage: "1 tablet",
        frequency: "Once daily",
        timing: "After dinner",
        duration: "30 Days",
        remaining: "24 Days",
      },
    ],
    notes:
      "Continue medication regularly and monitor blood pressure.",
  },
  {
    id: "RX-20260810-002",
    doctor: "Dr. Amit Verma",
    specialization: "General Medicine",
    date: "10 Aug 2026",
    diagnosis: "Fever and body ache",
    status: "Completed",
    medicines: [
      {
        name: "Paracetamol 500mg",
        dosage: "1 tablet",
        frequency: "Twice daily",
        timing: "After meals",
        duration: "5 Days",
        remaining: "Completed",
      },
      {
        name: "Azithromycin 500mg",
        dosage: "1 tablet",
        frequency: "Once daily",
        timing: "After breakfast",
        duration: "3 Days",
        remaining: "Completed",
      },
    ],
    notes: "Take adequate rest and stay hydrated.",
  },
  {
    id: "RX-20260725-003",
    doctor: "Dr. Neha Gupta",
    specialization: "Neurologist",
    date: "25 Jul 2026",
    diagnosis: "Migraine",
    status: "Completed",
    medicines: [
      {
        name: "Sumatriptan 50mg",
        dosage: "1 tablet",
        frequency: "As required",
        timing: "During migraine",
        duration: "15 Days",
        remaining: "Completed",
      },
    ],
    notes: "Avoid known migraine triggers.",
  },
  {
    id: "RX-20260712-004",
    doctor: "Dr. Priya Mehta",
    specialization: "Dermatologist",
    date: "12 Jul 2026",
    diagnosis: "Skin irritation",
    status: "Expired",
    medicines: [
      {
        name: "Cetirizine 10mg",
        dosage: "1 tablet",
        frequency: "Once daily",
        timing: "At night",
        duration: "7 Days",
        remaining: "Expired",
      },
      {
        name: "Hydrocortisone Cream",
        dosage: "Thin layer",
        frequency: "Twice daily",
        timing: "Morning & night",
        duration: "7 Days",
        remaining: "Expired",
      },
    ],
    notes: "Follow-up recommended if symptoms continue.",
  },
];

export default function PrescriptionsPage() {
  const [activeTab, setActiveTab] = useState("Active");
  const [search, setSearch] = useState("");
  const [selectedPrescription, setSelectedPrescription] =
    useState(null);

  const tabs = [
    {
      name: "Active",
      count: prescriptions.filter(
        (item) => item.status === "Active"
      ).length,
    },
    {
      name: "Completed",
      count: prescriptions.filter(
        (item) => item.status === "Completed"
      ).length,
    },
    {
      name: "Expired",
      count: prescriptions.filter(
        (item) => item.status === "Expired"
      ).length,
    },
    {
      name: "All",
      count: prescriptions.length,
    },
  ];

  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter((item) => {
      const matchesTab =
        activeTab === "All" ||
        item.status === activeTab;

      const searchText = search.toLowerCase();

      const matchesSearch =
        item.id.toLowerCase().includes(searchText) ||
        item.doctor.toLowerCase().includes(searchText) ||
        item.specialization
          .toLowerCase()
          .includes(searchText) ||
        item.diagnosis
          .toLowerCase()
          .includes(searchText) ||
        item.medicines.some((medicine) =>
          medicine.name
            .toLowerCase()
            .includes(searchText)
        );

      return matchesTab && matchesSearch;
    });
  }, [activeTab, search]);

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">
              Prescriptions
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              View your medicines, dosage instructions and prescription history.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Pill size={16} />
            {prescriptions.length} Prescriptions
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <SummaryCard
            title="Active Prescriptions"
            value={
              prescriptions.filter(
                (item) => item.status === "Active"
              ).length
            }
            icon={Pill}
          />

          <SummaryCard
            title="Total Medicines"
            value={prescriptions.reduce(
              (total, prescription) =>
                total + prescription.medicines.length,
              0
            )}
            icon={FileText}
          />

          <SummaryCard
            title="Latest Prescription"
            value="18 Aug 2026"
            icon={CalendarDays}
          />
        </div>

        {/* Main */}
        <div className="border border-gray-800 bg-[#080808] rounded-xl">
          {/* Tabs */}
          <div className="border-b border-gray-800 px-4 sm:px-6">
            <div className="flex gap-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`relative py-4 text-sm whitespace-nowrap transition ${
                    activeTab === tab.name
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {tab.name}

                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${
                      activeTab === tab.name
                        ? "bg-white text-black"
                        : "bg-gray-900 text-gray-500"
                    }`}
                  >
                    {tab.count}
                  </span>

                  {activeTab === tab.name && (
                    <span className="absolute bottom-0 left-0 right-0 h-px bg-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="p-4 sm:p-6 border-b border-gray-800">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search prescription, doctor, diagnosis or medicine..."
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

          {/* List */}
          <div className="p-4 sm:p-6">
            {filteredPrescriptions.length > 0 ? (
              <div className="space-y-5">
                {filteredPrescriptions.map(
                  (prescription) => (
                    <PrescriptionCard
                      key={prescription.id}
                      prescription={prescription}
                      onView={() =>
                        setSelectedPrescription(
                          prescription
                        )
                      }
                    />
                  )
                )}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </main>

      {/* Details Modal */}
      {selectedPrescription && (
        <PrescriptionModal
          prescription={selectedPrescription}
          onClose={() =>
            setSelectedPrescription(null)
          }
        />
      )}
    </div>
  );
}

/* -------------------------------- */
/* Prescription Card */
/* -------------------------------- */

function PrescriptionCard({
  prescription,
  onView,
}) {
  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition">
      {/* Card Header */}
      <div className="p-5">
        <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0">
              <Pill
                size={22}
                className="text-gray-400"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold">
                  {prescription.id}
                </h2>

                <StatusBadge
                  status={prescription.status}
                />
              </div>

              <p className="text-sm text-gray-400 mt-2">
                {prescription.diagnosis}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-600">
                <span className="flex items-center gap-1.5">
                  <UserRound size={13} />
                  {prescription.doctor}
                </span>

                <span className="flex items-center gap-1.5">
                  <CalendarDays size={13} />
                  {prescription.date}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onView}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-800 text-xs text-gray-400 hover:text-white hover:bg-gray-900 transition"
            >
              <Eye size={15} />
              View
            </button>

            <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-800 text-xs text-gray-400 hover:text-white hover:bg-gray-900 transition">
              <Download size={15} />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Medicines */}
      <div className="border-t border-gray-800">
        <div className="hidden md:grid grid-cols-5 gap-4 px-5 py-3 bg-gray-950 text-[10px] uppercase tracking-wide text-gray-600">
          <span>Medicine</span>
          <span>Dosage</span>
          <span>Frequency</span>
          <span>Timing</span>
          <span>Duration</span>
        </div>

        <div className="divide-y divide-gray-800">
          {prescription.medicines.map(
            (medicine, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4 px-5 py-4"
              >
                <div>
                  <p className="text-xs text-gray-600 md:hidden">
                    Medicine
                  </p>

                  <p className="text-sm font-medium text-gray-300">
                    {medicine.name}
                  </p>
                </div>

                <Detail
                  label="Dosage"
                  value={medicine.dosage}
                />

                <Detail
                  label="Frequency"
                  value={medicine.frequency}
                />

                <Detail
                  label="Timing"
                  value={medicine.timing}
                />

                <Detail
                  label="Duration"
                  value={medicine.duration}
                />
              </div>
            )
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start gap-2">
          <Clock3
            size={14}
            className="text-gray-600 mt-0.5"
          />

          <p className="text-xs text-gray-600">
            {prescription.notes}
          </p>
        </div>

        <button
          onClick={onView}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition"
        >
          Full Prescription
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* -------------------------------- */
/* Modal */
/* -------------------------------- */

function PrescriptionModal({
  prescription,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#080808] border border-gray-800 rounded-xl">
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#080808] border-b border-gray-800 px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold">
              Prescription Details
            </h2>

            <p className="text-xs text-gray-600 mt-1">
              {prescription.id}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-900 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Doctor */}
        <div className="p-5">
          <div className="border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center">
                <UserRound
                  size={22}
                  className="text-gray-400"
                />
              </div>

              <div>
                <h3 className="text-sm font-medium">
                  {prescription.doctor}
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  {prescription.specialization}
                </p>
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <InfoBox
              label="Prescription Date"
              value={prescription.date}
            />

            <InfoBox
              label="Diagnosis"
              value={prescription.diagnosis}
            />

            <InfoBox
              label="Status"
              value={prescription.status}
            />
          </div>

          {/* Medicine Details */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-3">
              Medicines
            </h3>

            <div className="space-y-3">
              {prescription.medicines.map(
                (medicine, index) => (
                  <div
                    key={index}
                    className="border border-gray-800 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-medium">
                          {medicine.name}
                        </h4>

                        <p className="text-xs text-gray-600 mt-1">
                          {medicine.duration}
                        </p>
                      </div>

                      {medicine.remaining !==
                        "Completed" &&
                        medicine.remaining !==
                          "Expired" && (
                          <span className="text-[10px] px-2 py-1 rounded-full bg-gray-900 text-gray-500 border border-gray-800">
                            {medicine.remaining}
                          </span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                      <InfoBox
                        label="Dosage"
                        value={medicine.dosage}
                      />

                      <InfoBox
                        label="Frequency"
                        value={medicine.frequency}
                      />

                      <InfoBox
                        label="Timing"
                        value={medicine.timing}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="border border-gray-800 rounded-lg p-4 mt-5">
            <div className="flex items-start gap-3">
              <AlertCircle
                size={17}
                className="text-gray-500 mt-0.5"
              />

              <div>
                <p className="text-xs font-medium">
                  Doctor's Instructions
                </p>

                <p className="text-xs text-gray-600 mt-1 leading-5">
                  {prescription.notes}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-white text-black text-sm font-medium hover:bg-gray-200 transition">
              <Download size={16} />
              Download Prescription
            </button>

            <button
              onClick={onClose}
              className="px-5 py-3 rounded-lg border border-gray-800 text-sm text-gray-400 hover:text-white hover:bg-gray-900 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- */
/* Components */
/* -------------------------------- */

function SummaryCard({
  title,
  value,
  icon: Icon,
}) {
  return (
    <div className="border border-gray-800 bg-[#080808] rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <p className="text-xl font-semibold mt-2">
            {value}
          </p>
        </div>

        <div className="w-10 h-10 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center">
          <Icon
            size={19}
            className="text-gray-400"
          />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Active:
      "bg-green-500/10 text-green-400 border-green-500/20",
    Completed:
      "bg-gray-900 text-gray-400 border-gray-800",
    Expired:
      "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full border text-[10px] ${
        styles[status]
      }`}
    >
      {status}
    </span>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-[10px] text-gray-600 md:hidden">
        {label}
      </p>

      <p className="text-xs text-gray-400 mt-1 md:mt-0">
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
        <Pill
          size={25}
          className="text-gray-600"
        />
      </div>

      <h3 className="text-sm font-medium mt-4">
        No prescriptions found
      </h3>

      <p className="text-xs text-gray-600 mt-2">
        Try changing your search or prescription status.
      </p>
    </div>
  );
}