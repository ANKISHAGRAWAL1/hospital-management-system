"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  User,
  Stethoscope,
  Building2,
  Save,
  X,
  Search,
} from "lucide-react";

const patients = [
  {
    id: "UHID-10021",
    name: "Rahul Sharma",
    phone: "9876543210",
  },
  {
    id: "UHID-10022",
    name: "Priya Gupta",
    phone: "9876543211",
  },
  {
    id: "UHID-10023",
    name: "Mohit Singh",
    phone: "9876543212",
  },
];

const doctors = {
  Cardiology: [
    {
      id: "DOC001",
      name: "Dr. Amit Verma",
      experience: "12 Years",
    },
    {
      id: "DOC002",
      name: "Dr. Rakesh Jain",
      experience: "8 Years",
    },
  ],

  Gynecology: [
    {
      id: "DOC003",
      name: "Dr. Neha Sharma",
      experience: "10 Years",
    },
  ],

  Orthopedics: [
    {
      id: "DOC004",
      name: "Dr. Raj Mehta",
      experience: "15 Years",
    },
  ],

  Neurology: [
    {
      id: "DOC005",
      name: "Dr. Vikram Singh",
      experience: "11 Years",
    },
  ],
};

const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
];

export default function AddAppointmentPage() {
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [formData, setFormData] = useState({
    department: "",
    doctor: "",
    date: "",
    time: "",
    appointmentType: "New",
    reason: "",
    notes: "",
  });

  const [showPatients, setShowPatients] = useState(false);

  const filteredPatients = patients.filter((patient) => {
    const search = patientSearch.toLowerCase();

    return (
      patient.name.toLowerCase().includes(search) ||
      patient.id.toLowerCase().includes(search) ||
      patient.phone.includes(search)
    );
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "department") {
      setFormData((prev) => ({
        ...prev,
        department: value,
        doctor: "",
        time: "",
      }));
    }

    if (name === "doctor") {
      setFormData((prev) => ({
        ...prev,
        doctor: value,
        time: "",
      }));
    }
  };

  const selectPatient = (patient) => {
    setSelectedPatient(patient);
    setPatientSearch(patient.name);
    setShowPatients(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedPatient) {
      alert("Please select a patient.");
      return;
    }

    if (!formData.department) {
      alert("Please select department.");
      return;
    }

    if (!formData.doctor) {
      alert("Please select doctor.");
      return;
    }

    if (!formData.date) {
      alert("Please select appointment date.");
      return;
    }

    if (!formData.time) {
      alert("Please select appointment time.");
      return;
    }

    console.log({
      patient: selectedPatient,
      appointment: formData,
    });

    alert("Appointment booked successfully!");
  };

  const availableDoctors = formData.department
    ? doctors[formData.department] || []
    : [];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/receptionist/appointments"
              className="p-2.5 rounded-lg border border-gray-800 hover:bg-gray-900 transition"
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <h1 className="text-2xl font-semibold">
                New Appointment
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Book an appointment for a patient
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CalendarDays size={18} />
            Appointment Desk
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Patient Selection */}
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
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
                <div className="absolute z-20 left-0 right-0 mt-2 bg-[#111] border border-gray-800 rounded-lg overflow-hidden shadow-xl">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <button
                        key={patient.id}
                        type="button"
                        onClick={() => selectPatient(patient)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-900 border-b border-gray-800 last:border-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">
                              {patient.name}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              {patient.id} • {patient.phone}
                            </p>
                          </div>

                          <User
                            size={17}
                            className="text-gray-600"
                          />
                        </div>
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

            <div className="mt-4">
              <Link
                href="/receptionist/patient-registration"
                className="text-xs text-gray-500 hover:text-white transition"
              >
                + Register new patient
              </Link>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <Stethoscope size={19} />

              <h2 className="text-lg font-medium">
                Appointment Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Department */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Department
                  <span className="text-white ml-1">*</span>
                </label>

                <div className="relative">
                  <Building2
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  />

                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full bg-black border border-gray-800 rounded-lg pl-11 pr-4 py-3 text-sm text-gray-300 outline-none focus:border-gray-500"
                  >
                    <option value="">
                      Select Department
                    </option>

                    {Object.keys(doctors).map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Doctor */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Doctor
                  <span className="text-white ml-1">*</span>
                </label>

                <select
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleChange}
                  disabled={!formData.department}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-300 outline-none focus:border-gray-500 disabled:text-gray-700"
                >
                  <option value="">
                    {formData.department
                      ? "Select Doctor"
                      : "Select Department First"}
                  </option>

                  {availableDoctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} — {doctor.experience}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Appointment Date
                  <span className="text-white ml-1">*</span>
                </label>

                <div className="relative">
                  <CalendarDays
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  />

                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-black border border-gray-800 rounded-lg pl-11 pr-4 py-3 text-sm text-gray-300 outline-none focus:border-gray-500"
                  />
                </div>
              </div>

              {/* Appointment Type */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Appointment Type
                </label>

                <select
                  name="appointmentType"
                  value={formData.appointmentType}
                  onChange={handleChange}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-300 outline-none focus:border-gray-500"
                >
                  <option value="New">New Patient</option>
                  <option value="Follow-up">
                    Follow-up
                  </option>
                  <option value="Emergency">
                    Emergency
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Time Slots */}
          <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={19} />

              <h2 className="text-lg font-medium">
                Available Time Slots
              </h2>
            </div>

            <p className="text-xs text-gray-600 mb-5">
              Select an available appointment slot
            </p>

            {!formData.doctor || !formData.date ? (
              <div className="border border-dashed border-gray-800 rounded-lg p-8 text-center">
                <CalendarDays
                  size={28}
                  className="mx-auto text-gray-700 mb-3"
                />

                <p className="text-sm text-gray-500">
                  Select doctor and appointment date first
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {timeSlots.map((slot, index) => {
                  const isBooked = index === 2 || index === 7;

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isBooked}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          time: slot,
                        }))
                      }
                      className={`py-3 rounded-lg border text-sm transition ${
                        isBooked
                          ? "border-gray-900 text-gray-700 bg-[#080808] cursor-not-allowed"
                          : formData.time === slot
                          ? "bg-white text-black border-white"
                          : "border-gray-800 text-gray-400 hover:border-gray-500 hover:text-white"
                      }`}
                    >
                      {slot}

                      {isBooked && (
                        <span className="block text-[10px] mt-1">
                          Booked
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Visit Information */}
          <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-medium mb-6">
              Visit Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Reason for Visit
                </label>

                <input
                  type="text"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="e.g. Chest pain, fever, follow-up..."
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Additional Notes
                </label>

                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any additional information..."
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Appointment Summary */}
          {selectedPatient &&
            formData.doctor &&
            formData.date &&
            formData.time && (
              <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl p-6 mb-6">
                <h2 className="text-lg font-medium mb-5">
                  Appointment Summary
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  <Summary
                    label="Patient"
                    value={selectedPatient.name}
                  />

                  <Summary
                    label="Department"
                    value={formData.department}
                  />

                  <Summary
                    label="Date"
                    value={formData.date}
                  />

                  <Summary
                    label="Time"
                    value={formData.time}
                  />
                </div>
              </div>
            )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pb-8">
            <Link
              href="/receptionist/appointments"
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
              Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------------- Summary ---------------- */

function Summary({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-600 mb-1">{label}</p>

      <p className="text-sm text-gray-300">{value}</p>
    </div>
  );
}