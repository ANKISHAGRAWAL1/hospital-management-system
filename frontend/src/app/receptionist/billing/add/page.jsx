"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Receipt,
  Search,
  User,
  Plus,
  Trash2,
  Save,
  X,
  CreditCard,
  Banknote,
  Smartphone,
  Building2,
} from "lucide-react";

const patients = [
  {
    id: "UHID-10021",
    name: "Rahul Sharma",
    phone: "9876543210",
    doctor: "Dr. Amit Verma",
  },
  {
    id: "UHID-10022",
    name: "Priya Gupta",
    phone: "9876543211",
    doctor: "Dr. Neha Sharma",
  },
  {
    id: "UHID-10023",
    name: "Mohit Singh",
    phone: "9876543212",
    doctor: "Dr. Raj Mehta",
  },
  {
    id: "UHID-10024",
    name: "Anjali Verma",
    phone: "9876543213",
    doctor: "Dr. Amit Verma",
  },
];

const serviceOptions = [
  {
    id: "consultation",
    name: "Doctor Consultation",
    price: 800,
  },
  {
    id: "followup",
    name: "Follow-up Consultation",
    price: 500,
  },
  {
    id: "xray",
    name: "X-Ray",
    price: 700,
  },
  {
    id: "blood",
    name: "Blood Test",
    price: 450,
  },
  {
    id: "ecg",
    name: "ECG",
    price: 600,
  },
  {
    id: "ultrasound",
    name: "Ultrasound",
    price: 1200,
  },
];

export default function CreateBillPage() {
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatients, setShowPatients] = useState(false);

  const [items, setItems] = useState([]);

  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);

  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const [paymentStatus, setPaymentStatus] = useState("Paid");

  const [paidAmount, setPaidAmount] = useState("");

  const [notes, setNotes] = useState("");

  const filteredPatients = patients.filter((patient) => {
    const query = patientSearch.toLowerCase();

    return (
      patient.name.toLowerCase().includes(query) ||
      patient.id.toLowerCase().includes(query) ||
      patient.phone.includes(query)
    );
  });

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [items]);

  const discountAmount = Math.min(
    Number(discount) || 0,
    subtotal
  );

  const taxableAmount = subtotal - discountAmount;

  const taxAmount =
    taxableAmount * ((Number(tax) || 0) / 100);

  const grandTotal = taxableAmount + taxAmount;

  const amountPaid =
    paymentStatus === "Paid"
      ? grandTotal
      : Math.min(Number(paidAmount) || 0, grandTotal);

  const balanceAmount = Math.max(
    grandTotal - amountPaid,
    0
  );

  const selectPatient = (patient) => {
    setSelectedPatient(patient);
    setPatientSearch(patient.name);
    setShowPatients(false);
  };

  const addService = () => {
    const service = serviceOptions[0];

    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        serviceId: service.id,
        name: service.name,
        price: service.price,
        quantity: 1,
      },
    ]);
  };

  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (field === "serviceId") {
          const service = serviceOptions.find(
            (item) => item.id === value
          );

          return {
            ...item,
            serviceId: value,
            name: service.name,
            price: service.price,
          };
        }

        return {
          ...item,
          [field]: value,
        };
      })
    );
  };

  const removeItem = (id) => {
    setItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedPatient) {
      alert("Please select a patient.");
      return;
    }

    if (items.length === 0) {
      alert("Please add at least one service.");
      return;
    }

    if (paymentStatus !== "Paid" && amountPaid <= 0) {
      alert("Please enter the paid amount.");
      return;
    }

    const billData = {
      patient: selectedPatient,
      items,
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      total: grandTotal,
      paidAmount: amountPaid,
      balance: balanceAmount,
      paymentMethod,
      paymentStatus,
      notes,
    };

    console.log("Bill Data:", billData);

    alert("Bill generated successfully!");
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/receptionist/billing"
              className="p-2.5 rounded-lg border border-gray-800 hover:bg-gray-900 transition"
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <div className="flex items-center gap-3">
                <Receipt size={24} />

                <h1 className="text-2xl font-semibold">
                  Create New Bill
                </h1>
              </div>

              <p className="text-sm text-gray-500 mt-1">
                Generate patient invoice and collect payment
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Reception Billing Desk
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Patient */}
          <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl p-6 mb-6">

            <div className="flex items-center gap-2 mb-6">
              <User size={19} />

              <h2 className="text-lg font-medium">
                Patient Information
              </h2>
            </div>

            <div className="relative">

              <label className="block text-sm text-gray-400 mb-2">
                Search Patient
                <span className="text-white ml-1">*</span>
              </label>

              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                />

                <input
                  type="text"
                  value={patientSearch}
                  onChange={(e) => {
                    setPatientSearch(e.target.value);
                    setShowPatients(true);
                    setSelectedPatient(null);
                  }}
                  onFocus={() => setShowPatients(true)}
                  placeholder="Search by patient name, UHID or mobile..."
                  className="w-full bg-black border border-gray-800 rounded-lg pl-11 pr-4 py-3 text-sm outline-none focus:border-gray-500"
                />
              </div>

              {showPatients && patientSearch && (
                <div className="absolute z-30 left-0 right-0 mt-2 bg-[#111] border border-gray-800 rounded-lg overflow-hidden">

                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <button
                        key={patient.id}
                        type="button"
                        onClick={() => selectPatient(patient)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-900 border-b border-gray-800 last:border-0"
                      >
                        <p className="text-sm font-medium">
                          {patient.name}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {patient.id} • {patient.phone}
                        </p>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-sm text-gray-500">
                      No patient found
                    </div>
                  )}

                </div>
              )}

            </div>

            {selectedPatient && (
              <div className="mt-5 border border-gray-800 rounded-lg p-4 bg-black">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm font-medium">
                      {selectedPatient.name}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-2">
                      <span className="text-xs text-gray-500">
                        UHID: {selectedPatient.id}
                      </span>

                      <span className="text-xs text-gray-500">
                        Mobile: {selectedPatient.phone}
                      </span>

                      <span className="text-xs text-gray-500">
                        Doctor: {selectedPatient.doctor}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPatient(null);
                      setPatientSearch("");
                    }}
                    className="p-2 text-gray-500 hover:text-white"
                  >
                    <X size={17} />
                  </button>

                </div>

              </div>
            )}

          </div>

          {/* Services */}
          <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl overflow-hidden mb-6">

            <div className="p-6 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div>
                <h2 className="text-lg font-medium">
                  Services & Charges
                </h2>

                <p className="text-xs text-gray-600 mt-1">
                  Add consultation, tests and other hospital services
                </p>
              </div>

              <button
                type="button"
                onClick={addService}
                className="px-4 py-2.5 bg-white text-black rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition"
              >
                <Plus size={17} />
                Add Service
              </button>

            </div>

            {items.length === 0 ? (
              <div className="p-10 text-center">

                <Receipt
                  size={32}
                  className="mx-auto text-gray-700 mb-3"
                />

                <p className="text-sm text-gray-500">
                  No services added
                </p>

                <p className="text-xs text-gray-700 mt-1">
                  Click Add Service to start billing
                </p>

              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full min-w-[750px]">

                  <thead>
                    <tr className="border-b border-gray-800 text-left">

                      <th className="px-5 py-4 text-xs text-gray-600">
                        Service
                      </th>

                      <th className="px-5 py-4 text-xs text-gray-600">
                        Unit Price
                      </th>

                      <th className="px-5 py-4 text-xs text-gray-600">
                        Quantity
                      </th>

                      <th className="px-5 py-4 text-xs text-gray-600">
                        Total
                      </th>

                      <th className="px-5 py-4 text-xs text-gray-600 text-right">
                        Action
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {items.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-900"
                      >

                        <td className="px-5 py-4">

                          <select
                            value={item.serviceId}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "serviceId",
                                e.target.value
                              )
                            }
                            className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2.5 text-sm text-gray-300 outline-none focus:border-gray-500"
                          >
                            {serviceOptions.map(
                              (service) => (
                                <option
                                  key={service.id}
                                  value={service.id}
                                >
                                  {service.name}
                                </option>
                              )
                            )}
                          </select>

                        </td>

                        <td className="px-5 py-4">
                          <span className="text-sm">
                            ₹
                            {item.price.toLocaleString(
                              "en-IN"
                            )}
                          </span>
                        </td>

                        <td className="px-5 py-4">

                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "quantity",
                                Math.max(
                                  1,
                                  Number(e.target.value)
                                )
                              )
                            }
                            className="w-20 bg-black border border-gray-800 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-500"
                          />

                        </td>

                        <td className="px-5 py-4">
                          <span className="text-sm font-medium">
                            ₹
                            {(
                              item.price *
                              item.quantity
                            ).toLocaleString("en-IN")}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">

                          <button
                            type="button"
                            onClick={() =>
                              removeItem(item.id)
                            }
                            className="p-2 rounded-lg text-gray-600 hover:text-white hover:bg-gray-900 transition"
                          >
                            <Trash2 size={17} />
                          </button>

                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </div>

          {/* Discount & Tax */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

            <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl p-6">

              <h2 className="text-lg font-medium mb-6">
                Adjustments
              </h2>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Discount
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0"
                      value={discount}
                      onChange={(e) =>
                        setDiscount(e.target.value)
                      }
                      className="w-full bg-black border border-gray-800 rounded-lg pl-9 pr-4 py-3 text-sm outline-none focus:border-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Tax (%)
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={tax}
                    onChange={(e) =>
                      setTax(e.target.value)
                    }
                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-500"
                  />
                </div>

              </div>

              <div className="mt-5">
                <label className="block text-sm text-gray-400 mb-2">
                  Notes
                </label>

                <textarea
                  rows="4"
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value)
                  }
                  placeholder="Add billing notes..."
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-500 resize-none"
                />
              </div>

            </div>

            {/* Summary */}
            <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl p-6">

              <h2 className="text-lg font-medium mb-6">
                Bill Summary
              </h2>

              <div className="space-y-4">

                <SummaryRow
                  label="Subtotal"
                  value={subtotal}
                />

                <SummaryRow
                  label="Discount"
                  value={discountAmount}
                  negative
                />

                <SummaryRow
                  label={`Tax (${tax || 0}%)`}
                  value={taxAmount}
                />

                <div className="border-t border-gray-800 pt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    Grand Total
                  </span>

                  <span className="text-xl font-semibold">
                    ₹
                    {grandTotal.toLocaleString(
                      "en-IN",
                      {
                        maximumFractionDigits: 2,
                      }
                    )}
                  </span>
                </div>

              </div>

            </div>

          </div>

          {/* Payment */}
          <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl p-6 mb-6">

            <div className="flex items-center gap-2 mb-6">
              <CreditCard size={19} />

              <h2 className="text-lg font-medium">
                Payment Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {/* Status */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Payment Status
                </label>

                <select
                  value={paymentStatus}
                  onChange={(e) =>
                    setPaymentStatus(e.target.value)
                  }
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-300 outline-none focus:border-gray-500"
                >
                  <option value="Paid">Paid</option>
                  <option value="Partial">Partial</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              {/* Method */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Payment Method
                </label>

                <select
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-300 outline-none focus:border-gray-500"
                >
                  <option value="Cash">
                    Cash
                  </option>

                  <option value="UPI">
                    UPI
                  </option>

                  <option value="Card">
                    Card
                  </option>

                  <option value="Bank Transfer">
                    Bank Transfer
                  </option>
                </select>
              </div>

              {/* Paid */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Amount Paid
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={
                      paymentStatus === "Paid"
                        ? grandTotal
                        : paidAmount
                    }
                    onChange={(e) =>
                      setPaidAmount(e.target.value)
                    }
                    disabled={paymentStatus === "Paid"}
                    className="w-full bg-black border border-gray-800 rounded-lg pl-9 pr-4 py-3 text-sm outline-none focus:border-gray-500 disabled:text-gray-600"
                  />

                </div>
              </div>

            </div>

            {/* Payment Methods */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">

              <PaymentMethod
                icon={<Banknote size={18} />}
                label="Cash"
                active={paymentMethod === "Cash"}
                onClick={() =>
                  setPaymentMethod("Cash")
                }
              />

              <PaymentMethod
                icon={<Smartphone size={18} />}
                label="UPI"
                active={paymentMethod === "UPI"}
                onClick={() =>
                  setPaymentMethod("UPI")
                }
              />

              <PaymentMethod
                icon={<CreditCard size={18} />}
                label="Card"
                active={paymentMethod === "Card"}
                onClick={() =>
                  setPaymentMethod("Card")
                }
              />

              <PaymentMethod
                icon={<Building2 size={18} />}
                label="Bank Transfer"
                active={
                  paymentMethod === "Bank Transfer"
                }
                onClick={() =>
                  setPaymentMethod("Bank Transfer")
                }
              />

            </div>

            {/* Balance */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="border border-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-600">
                  Amount Paid
                </p>

                <p className="text-lg font-semibold mt-1">
                  ₹
                  {amountPaid.toLocaleString(
                    "en-IN",
                    {
                      maximumFractionDigits: 2,
                    }
                  )}
                </p>
              </div>

              <div className="border border-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-600">
                  Balance Due
                </p>

                <p className="text-lg font-semibold mt-1">
                  ₹
                  {balanceAmount.toLocaleString(
                    "en-IN",
                    {
                      maximumFractionDigits: 2,
                    }
                  )}
                </p>
              </div>

            </div>

          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pb-8">

            <Link
              href="/receptionist/billing"
              className="px-6 py-3 rounded-lg border border-gray-800 text-gray-400 hover:bg-gray-900 transition flex items-center justify-center gap-2"
            >
              <X size={18} />
              Cancel
            </Link>

            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Generate Bill
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

/* ---------------- Summary Row ---------------- */

function SummaryRow({
  label,
  value,
  negative = false,
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span
        className={`text-sm ${
          negative
            ? "text-gray-500"
            : "text-gray-300"
        }`}
      >
        {negative ? "- " : ""}₹
        {Number(value || 0).toLocaleString(
          "en-IN",
          {
            maximumFractionDigits: 2,
          }
        )}
      </span>
    </div>
  );
}

/* ---------------- Payment Method ---------------- */

function PaymentMethod({
  icon,
  label,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-3 rounded-lg border flex items-center justify-center gap-2 text-sm transition ${
        active
          ? "border-white bg-white text-black"
          : "border-gray-800 text-gray-500 hover:border-gray-600 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}