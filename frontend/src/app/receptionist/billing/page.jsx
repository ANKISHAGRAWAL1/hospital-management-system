"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Receipt,
  Plus,
  Search,
  Eye,
  Pencil,
  IndianRupee,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";

const initialBills = [
  {
    id: "INV-1001",
    patient: "Rahul Sharma",
    uhid: "UHID-10021",
    doctor: "Dr. Amit Verma",
    service: "Consultation",
    amount: 800,
    paid: 800,
    paymentMethod: "UPI",
    status: "Paid",
    date: "25 Aug 2026",
  },
  {
    id: "INV-1002",
    patient: "Priya Gupta",
    uhid: "UHID-10022",
    doctor: "Dr. Neha Sharma",
    service: "Consultation + Follow-up",
    amount: 1000,
    paid: 500,
    paymentMethod: "Cash",
    status: "Partial",
    date: "25 Aug 2026",
  },
  {
    id: "INV-1003",
    patient: "Mohit Singh",
    uhid: "UHID-10023",
    doctor: "Dr. Raj Mehta",
    service: "Consultation",
    amount: 700,
    paid: 700,
    paymentMethod: "Card",
    status: "Paid",
    date: "25 Aug 2026",
  },
  {
    id: "INV-1004",
    patient: "Anjali Verma",
    uhid: "UHID-10024",
    doctor: "Dr. Amit Verma",
    service: "Consultation",
    amount: 800,
    paid: 0,
    paymentMethod: "-",
    status: "Pending",
    date: "25 Aug 2026",
  },
  {
    id: "INV-1005",
    patient: "Vikas Jain",
    uhid: "UHID-10025",
    doctor: "Dr. Raj Mehta",
    service: "Consultation + X-Ray",
    amount: 1500,
    paid: 1500,
    paymentMethod: "UPI",
    status: "Paid",
    date: "25 Aug 2026",
  },
];

export default function BillingPage() {
  const [bills, setBills] = useState(initialBills);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredBills = useMemo(() => {
    return bills.filter((bill) => {
      const query = search.toLowerCase();

      const matchesSearch =
        bill.id.toLowerCase().includes(query) ||
        bill.patient.toLowerCase().includes(query) ||
        bill.uhid.toLowerCase().includes(query) ||
        bill.doctor.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || bill.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bills, search, statusFilter]);

  const totalAmount = bills.reduce(
    (sum, bill) => sum + bill.amount,
    0
  );

  const totalCollected = bills.reduce(
    (sum, bill) => sum + bill.paid,
    0
  );

  const totalPending = totalAmount - totalCollected;

  const paidBills = bills.filter(
    (bill) => bill.status === "Paid"
  ).length;

  const pendingBills = bills.filter(
    (bill) => bill.status !== "Paid"
  ).length;

  const markAsPaid = (id) => {
    setBills((prev) =>
      prev.map((bill) =>
        bill.id === id
          ? {
              ...bill,
              paid: bill.amount,
              status: "Paid",
              paymentMethod: "Cash",
            }
          : bill
      )
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-[1500px] mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/receptionist"
              className="p-2.5 rounded-lg border border-gray-800 hover:bg-gray-900 transition"
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <div className="flex items-center gap-3">
                <Receipt size={25} />

                <h1 className="text-2xl font-semibold">
                  Billing & Payments
                </h1>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Manage patient bills, payments and receipts
              </p>
            </div>
          </div>

          <Link
            href="/receptionist/billing/add"
            className="bg-white text-black px-5 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition"
          >
            <Plus size={18} />
            Create New Bill
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          <StatCard
            title="Total Billing"
            value={`₹${totalAmount.toLocaleString("en-IN")}`}
            icon={<IndianRupee size={20} />}
          />

          <StatCard
            title="Collected"
            value={`₹${totalCollected.toLocaleString("en-IN")}`}
            icon={<CheckCircle2 size={20} />}
          />

          <StatCard
            title="Pending"
            value={`₹${totalPending.toLocaleString("en-IN")}`}
            icon={<Clock size={20} />}
          />

          <StatCard
            title="Pending Bills"
            value={pendingBills}
            icon={<AlertCircle size={20} />}
          />
        </div>

        {/* Collection Summary */}
        <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl p-5 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>
              <h2 className="text-lg font-medium">
                Today's Collection
              </h2>

              <p className="text-xs text-gray-600 mt-1">
                Summary of today's patient billing
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">

              <div>
                <p className="text-xs text-gray-600">
                  Paid Bills
                </p>

                <p className="text-lg font-semibold mt-1">
                  {paidBills}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-600">
                  Pending Bills
                </p>

                <p className="text-lg font-semibold mt-1">
                  {pendingBills}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-600">
                  Collection
                </p>

                <p className="text-lg font-semibold mt-1">
                  ₹{totalCollected.toLocaleString("en-IN")}
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl p-5 mb-6">

          <div className="flex flex-col lg:flex-row gap-4">

            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search invoice, patient, UHID or doctor..."
                className="w-full bg-black border border-gray-800 rounded-lg pl-11 pr-4 py-3 text-sm outline-none focus:border-gray-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-300 outline-none"
            >
              <option value="All">All Payment Status</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Pending">Pending</option>
              <option value="Refunded">Refunded</option>
            </select>

          </div>
        </div>

        {/* Bills Table */}
        <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl overflow-hidden">

          <div className="p-5 border-b border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">
                Billing Records
              </h2>

              <p className="text-xs text-gray-600 mt-1">
                {filteredBills.length} billing records
              </p>
            </div>

            <CreditCard
              size={19}
              className="text-gray-600"
            />
          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1200px]">

              <thead>
                <tr className="border-b border-gray-800 text-left">

                  <th className="px-5 py-4 text-xs text-gray-600">
                    Invoice
                  </th>

                  <th className="px-5 py-4 text-xs text-gray-600">
                    Patient
                  </th>

                  <th className="px-5 py-4 text-xs text-gray-600">
                    Doctor
                  </th>

                  <th className="px-5 py-4 text-xs text-gray-600">
                    Service
                  </th>

                  <th className="px-5 py-4 text-xs text-gray-600">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-xs text-gray-600">
                    Paid
                  </th>

                  <th className="px-5 py-4 text-xs text-gray-600">
                    Balance
                  </th>

                  <th className="px-5 py-4 text-xs text-gray-600">
                    Payment
                  </th>

                  <th className="px-5 py-4 text-xs text-gray-600">
                    Status
                  </th>

                  <th className="px-5 py-4 text-xs text-gray-600 text-right">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredBills.length > 0 ? (
                  filteredBills.map((bill) => {

                    const balance = bill.amount - bill.paid;

                    return (
                      <tr
                        key={bill.id}
                        className="border-b border-gray-900 hover:bg-[#111] transition"
                      >

                        {/* Invoice */}
                        <td className="px-5 py-4">

                          <div>
                            <p className="text-sm font-medium">
                              {bill.id}
                            </p>

                            <p className="text-xs text-gray-600 mt-1">
                              {bill.date}
                            </p>
                          </div>

                        </td>

                        {/* Patient */}
                        <td className="px-5 py-4">

                          <div>
                            <p className="text-sm font-medium">
                              {bill.patient}
                            </p>

                            <p className="text-xs text-gray-600 mt-1">
                              {bill.uhid}
                            </p>
                          </div>

                        </td>

                        {/* Doctor */}
                        <td className="px-5 py-4">
                          <span className="text-sm text-gray-400">
                            {bill.doctor}
                          </span>
                        </td>

                        {/* Service */}
                        <td className="px-5 py-4">

                          <span className="text-xs text-gray-400">
                            {bill.service}
                          </span>

                        </td>

                        {/* Amount */}
                        <td className="px-5 py-4">
                          <span className="text-sm">
                            ₹{bill.amount.toLocaleString("en-IN")}
                          </span>
                        </td>

                        {/* Paid */}
                        <td className="px-5 py-4">
                          <span className="text-sm text-gray-300">
                            ₹{bill.paid.toLocaleString("en-IN")}
                          </span>
                        </td>

                        {/* Balance */}
                        <td className="px-5 py-4">

                          <span
                            className={`text-sm ${
                              balance > 0
                                ? "text-gray-300"
                                : "text-gray-600"
                            }`}
                          >
                            ₹{balance.toLocaleString("en-IN")}
                          </span>

                        </td>

                        {/* Payment Method */}
                        <td className="px-5 py-4">

                          <span className="text-xs text-gray-500">
                            {bill.paymentMethod}
                          </span>

                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <StatusBadge status={bill.status} />
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">

                          <div className="flex items-center justify-end gap-1">

                            <button
                              title="View Invoice"
                              className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-900 transition"
                            >
                              <Eye size={17} />
                            </button>

                            {bill.status !== "Paid" && (
                              <button
                                onClick={() =>
                                  markAsPaid(bill.id)
                                }
                                className="px-3 py-2 rounded-lg border border-gray-800 text-xs text-gray-400 hover:bg-white hover:text-black transition"
                              >
                                Collect
                              </button>
                            )}

                            <button
                              title="Edit Bill"
                              className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-900 transition"
                            >
                              <Pencil size={17} />
                            </button>

                            <button
                              title="More Actions"
                              className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-900 transition"
                            >
                              <MoreHorizontal size={17} />
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="10"
                      className="px-5 py-14 text-center"
                    >
                      <Receipt
                        size={32}
                        className="mx-auto text-gray-700 mb-3"
                      />

                      <p className="text-sm text-gray-500">
                        No billing records found
                      </p>

                      <p className="text-xs text-gray-700 mt-1">
                        Try changing your search or payment filter
                      </p>
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-gray-800 flex items-center justify-between">

            <p className="text-xs text-gray-600">
              Showing {filteredBills.length} of {bills.length} records
            </p>

            <span className="text-xs text-gray-700">
              Reception Billing Desk
            </span>

          </div>

        </div>

      </div>
    </div>
  );
}

/* ---------------- Stat Card ---------------- */

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl p-5">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h3 className="text-2xl font-semibold mt-2">
            {value}
          </h3>
        </div>

        <div className="p-3 rounded-lg bg-black border border-gray-800 text-gray-500">
          {icon}
        </div>

      </div>

    </div>
  );
}

/* ---------------- Status Badge ---------------- */

function StatusBadge({ status }) {
  const classes = {
    Paid: "border-gray-600 text-gray-300",
    Partial: "border-gray-700 text-gray-400",
    Pending: "border-gray-500 text-gray-300",
    Refunded: "border-gray-800 text-gray-600",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md border text-xs ${
        classes[status] || "border-gray-800 text-gray-500"
      }`}
    >
      {status}
    </span>
  );
}