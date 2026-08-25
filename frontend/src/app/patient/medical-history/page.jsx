"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  FileText,
  FlaskConical,
  ScanLine,
  HeartPulse,
  CalendarDays,
  UserRound,
  Eye,
  Download,
  CheckCircle2,
  Clock3,
  X,
} from "lucide-react";

const reports = [
  {
    id: "LAB-20260820-001",
    name: "Complete Blood Count (CBC)",
    type: "Lab Test",
    category: "Laboratory",
    date: "20 Aug 2026",
    doctor: "Dr. Rahul Sharma",
    hospital: "City Hospital, Jaipur",
    status: "Available",
    summary: "Hemoglobin and blood cell counts are within normal range.",
  },
  {
    id: "LAB-20260815-002",
    name: "Lipid Profile",
    type: "Lab Test",
    category: "Laboratory",
    date: "15 Aug 2026",
    doctor: "Dr. Rahul Sharma",
    hospital: "City Hospital, Jaipur",
    status: "Available",
    summary: "Cholesterol levels require routine monitoring.",
  },
  {
    id: "RAD-20260805-003",
    name: "Chest X-Ray",
    type: "Radiology",
    category: "Radiology",
    date: "05 Aug 2026",
    doctor: "Dr. Amit Verma",
    hospital: "City Hospital, Jaipur",
    status: "Available",
    summary: "No acute abnormality detected in the chest X-ray.",
  },
  {
    id: "LAB-20260728-004",
    name: "Blood Sugar - Fasting",
    type: "Lab Test",
    category: "Laboratory",
    date: "28 Jul 2026",
    doctor: "Dr. Amit Verma",
    hospital: "City Hospital, Jaipur",
    status: "Available",
    summary: "Fasting blood glucose level recorded successfully.",
  },
  {
    id: "RAD-20260718-005",
    name: "MRI Brain",
    type: "Radiology",
    category: "Radiology",
    date: "18 Jul 2026",
    doctor: "Dr. Neha Gupta",
    hospital: "City Hospital, Jaipur",
    status: "Processing",
    summary: "Report is being reviewed by the radiology department.",
  },
];

export default function MedicalReportsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  const tabs = [
    {
      name: "All",
      count: reports.length,
    },
    {
      name: "Laboratory",
      count: reports.filter(
        (item) => item.category === "Laboratory"
      ).length,
    },
    {
      name: "Radiology",
      count: reports.filter(
        (item) => item.category === "Radiology"
      ).length,
    },
  ];

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesTab =
        activeTab === "All" ||
        report.category === activeTab;

      const text = search.toLowerCase();

      const matchesSearch =
        report.name.toLowerCase().includes(text) ||
        report.id.toLowerCase().includes(text) ||
        report.doctor.toLowerCase().includes(text) ||
        report.type.toLowerCase().includes(text);

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
              Medical Reports
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Access your laboratory, diagnostic and radiology reports.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FileText size={16} />
            {reports.length} Reports
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <SummaryCard
            title="Total Reports"
            value={reports.length}
            icon={FileText}
          />

          <SummaryCard
            title="Lab Reports"
            value={
              reports.filter(
                (item) => item.category === "Laboratory"
              ).length
            }
            icon={FlaskConical}
          />

          <SummaryCard
            title="Radiology Reports"
            value={
              reports.filter(
                (item) => item.category === "Radiology"
              ).length
            }
            icon={ScanLine}
          />
        </div>

        {/* Main Card */}
        <div className="border border-gray-800 bg-[#080808] rounded-xl">
          {/* Tabs */}
          <div className="border-b border-gray-800 px-4 sm:px-6">
            <div className="flex gap-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`relative py-4 text-sm whitespace-nowrap ${
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search report, test, doctor or report ID..."
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

          {/* Reports */}
          <div className="p-4 sm:p-6">
            {filteredReports.length > 0 ? (
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    onView={() =>
                      setSelectedReport(report)
                    }
                  />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </main>

      {/* Report Modal */}
      {selectedReport && (
        <ReportModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}

/* -------------------------------- */
/* Report Card */
/* -------------------------------- */

function ReportCard({ report, onView }) {
  const isRadiology = report.category === "Radiology";
  const isAvailable = report.status === "Available";

  return (
    <div className="border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition">
      <div className="flex flex-col xl:flex-row xl:items-center gap-5">
        {/* Icon + Name */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0">
            {isRadiology ? (
              <ScanLine
                size={23}
                className="text-gray-400"
              />
            ) : (
              <FlaskConical
                size={23}
                className="text-gray-400"
              />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">
                {report.name}
              </h3>

              <StatusBadge status={report.status} />
            </div>

            <p className="text-xs text-gray-500 mt-1">
              {report.type}
            </p>

            <p className="text-xs text-gray-600 mt-2">
              {report.id}
            </p>
          </div>
        </div>

        {/* Information */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <InfoItem
            icon={CalendarDays}
            label="Test Date"
            value={report.date}
          />

          <InfoItem
            icon={UserRound}
            label="Doctor"
            value={report.doctor}
          />

          <InfoItem
            icon={HeartPulse}
            label="Hospital"
            value={report.hospital}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onView}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-gray-800 text-xs text-gray-400 hover:text-white hover:bg-gray-900 transition"
          >
            <Eye size={15} />
            View
          </button>

          <button
            disabled={!isAvailable}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-gray-800 text-xs text-gray-400 hover:text-white hover:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <Download size={15} />
            Download
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="border-t border-gray-800 mt-5 pt-4">
        <div className="flex items-start gap-2">
          <FileText
            size={14}
            className="text-gray-600 mt-0.5"
          />

          <div>
            <p className="text-[10px] text-gray-600 uppercase tracking-wide">
              Result Summary
            </p>

            <p className="text-xs text-gray-400 mt-1 leading-5">
              {report.summary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- */
/* Modal */
/* -------------------------------- */

function ReportModal({ report, onClose }) {
  const isAvailable = report.status === "Available";

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#080808] border border-gray-800 rounded-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#080808] border-b border-gray-800 px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold">
              Medical Report
            </h2>

            <p className="text-xs text-gray-600 mt-1">
              {report.id}
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
          {/* Report Title */}
          <div className="border border-gray-800 rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center">
                {report.category === "Radiology" ? (
                  <ScanLine
                    size={23}
                    className="text-gray-400"
                  />
                ) : (
                  <FlaskConical
                    size={23}
                    className="text-gray-400"
                  />
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">
                    {report.name}
                  </h3>

                  <StatusBadge
                    status={report.status}
                  />
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {report.type}
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
            <InfoBox
              label="Report ID"
              value={report.id}
            />

            <InfoBox
              label="Test Date"
              value={report.date}
            />

            <InfoBox
              label="Doctor"
              value={report.doctor}
            />

            <InfoBox
              label="Hospital"
              value={report.hospital}
            />

            <InfoBox
              label="Category"
              value={report.category}
            />

            <InfoBox
              label="Status"
              value={report.status}
            />
          </div>

          {/* Result */}
          <div className="border border-gray-800 rounded-xl p-5 mt-5">
            <div className="flex items-center gap-2">
              <CheckCircle2
                size={17}
                className="text-gray-400"
              />

              <h3 className="text-sm font-medium">
                Result Summary
              </h3>
            </div>

            <p className="text-sm text-gray-400 mt-3 leading-6">
              {report.summary}
            </p>
          </div>

          {/* Report Preview */}
          <div className="border border-gray-800 rounded-xl mt-5 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText
                  size={16}
                  className="text-gray-500"
                />

                <span className="text-sm">
                  Report Document
                </span>
              </div>

              <span className="text-[10px] text-gray-600">
                PDF
              </span>
            </div>

            <div className="h-52 flex items-center justify-center bg-gray-950">
              <div className="text-center">
                <FileText
                  size={35}
                  className="mx-auto text-gray-700"
                />

                <p className="text-xs text-gray-600 mt-3">
                  Report preview
                </p>

                <p className="text-[10px] text-gray-700 mt-1">
                  PDF viewer will be connected with backend later
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <button
              disabled={!isAvailable}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-white text-black text-sm font-medium hover:bg-gray-200 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed transition"
            >
              <Download size={16} />
              Download Report
            </button>

            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg border border-gray-800 text-sm text-gray-400 hover:text-white hover:bg-gray-900 transition"
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

function InfoItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2.5 min-w-[105px]">
      <div className="flex items-center gap-1.5">
        <Icon
          size={12}
          className="text-gray-600"
        />

        <p className="text-[10px] text-gray-600">
          {label}
        </p>
      </div>

      <p className="text-xs text-gray-300 mt-1 truncate">
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

function StatusBadge({ status }) {
  const styles = {
    Available:
      "bg-green-500/10 text-green-400 border-green-500/20",
    Processing:
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full border text-[10px] ${
        styles[status] ||
        "bg-gray-900 text-gray-400 border-gray-800"
      }`}
    >
      {status}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="py-16 text-center">
      <div className="w-14 h-14 mx-auto rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center">
        <FileText
          size={25}
          className="text-gray-600"
        />
      </div>

      <h3 className="text-sm font-medium mt-4">
        No medical reports found
      </h3>

      <p className="text-xs text-gray-600 mt-2">
        Try changing your search or report category.
      </p>
    </div>
  );
}