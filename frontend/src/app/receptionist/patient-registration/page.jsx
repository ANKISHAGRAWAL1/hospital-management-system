"use client";

import { useState } from "react";
import Link from "next/link";
import {
  UserPlus,
  ArrowLeft,
  Save,
  X,
  Search,
  User,
  Phone,
  Mail,
  CalendarDays,
  MapPin,
  ShieldCheck,
} from "lucide-react";

export default function PatientRegistrationPage() {
  const [patientType, setPatientType] = useState("new");

  const [formData, setFormData] = useState({
    uhid: "",
    fullName: "",
    dob: "",
    age: "",
    gender: "",
    bloodGroup: "",
    mobile: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
    idType: "",
    idNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Patient Data:", formData);

    alert("Patient registered successfully!");
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/receptionist"
            className="p-2 rounded-lg border border-gray-800 hover:bg-gray-900 transition"
          >
            <ArrowLeft size={20} />
          </Link>

          <div>
            <h1 className="text-2xl font-semibold">Patient Registration</h1>
            <p className="text-sm text-gray-500 mt-1">
              Register a new patient in the hospital system
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <UserPlus size={18} />
          Reception Desk
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
        {/* Patient Type */}
        <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-medium mb-5">Patient Type</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPatientType("new")}
              className={`p-4 rounded-lg border text-left transition ${
                patientType === "new"
                  ? "border-white bg-white text-black"
                  : "border-gray-800 bg-black text-gray-300 hover:bg-gray-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <UserPlus size={20} />
                <div>
                  <p className="font-medium">New Patient</p>
                  <p
                    className={`text-xs mt-1 ${
                      patientType === "new"
                        ? "text-gray-600"
                        : "text-gray-500"
                    }`}
                  >
                    Register a patient for the first time
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPatientType("existing")}
              className={`p-4 rounded-lg border text-left transition ${
                patientType === "existing"
                  ? "border-white bg-white text-black"
                  : "border-gray-800 bg-black text-gray-300 hover:bg-gray-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Search size={20} />
                <div>
                  <p className="font-medium">Existing Patient</p>
                  <p
                    className={`text-xs mt-1 ${
                      patientType === "existing"
                        ? "text-gray-600"
                        : "text-gray-500"
                    }`}
                  >
                    Search patient using UHID or mobile number
                  </p>
                </div>
              </div>
            </button>
          </div>

          {patientType === "existing" && (
            <div className="mt-5 flex gap-3">
              <input
                type="text"
                placeholder="Enter UHID or mobile number"
                className="flex-1 bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-500"
              />

              <button
                type="button"
                className="px-5 rounded-lg bg-white text-black font-medium flex items-center gap-2"
              >
                <Search size={18} />
                Search
              </button>
            </div>
          )}
        </div>

        {/* Basic Information */}
        <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <User size={19} />
            <h2 className="text-lg font-medium">Basic Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Input
              label="UHID / Patient ID"
              name="uhid"
              value={formData.uhid}
              onChange={handleChange}
              placeholder="Auto generated"
              disabled
            />

            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />

            <Input
              label="Mobile Number"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
              required
            />

            <Input
              label="Date of Birth"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
            />

            <Input
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter age"
            />

            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={["Male", "Female", "Other"]}
            />

            <Select
              label="Blood Group"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              options={[
                "A+",
                "A-",
                "B+",
                "B-",
                "AB+",
                "AB-",
                "O+",
                "O-",
              ]}
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="patient@email.com"
            />
          </div>
        </div>

        {/* Address */}
        <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <MapPin size={19} />
            <h2 className="text-lg font-medium">Address Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-3">
              <label className="block text-sm text-gray-400 mb-2">
                Address
              </label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                placeholder="Enter complete address"
                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-500 resize-none"
              />
            </div>

            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
            />

            <Input
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter state"
            />

            <Input
              label="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Enter pincode"
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Phone size={19} />
            <h2 className="text-lg font-medium">Emergency Contact</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Input
              label="Contact Name"
              name="emergencyName"
              value={formData.emergencyName}
              onChange={handleChange}
              placeholder="Emergency contact name"
            />

            <Input
              label="Relationship"
              name="emergencyRelation"
              value={formData.emergencyRelation}
              onChange={handleChange}
              placeholder="Father / Mother / Spouse"
            />

            <Input
              label="Contact Number"
              name="emergencyPhone"
              value={formData.emergencyPhone}
              onChange={handleChange}
              placeholder="Emergency phone number"
            />
          </div>
        </div>

        {/* Identification */}
        <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck size={19} />
            <h2 className="text-lg font-medium">Identification</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Select
              label="ID Proof Type"
              name="idType"
              value={formData.idType}
              onChange={handleChange}
              options={[
                "Aadhaar Card",
                "PAN Card",
                "Driving License",
                "Passport",
                "Voter ID",
              ]}
            />

            <Input
              label="ID Proof Number"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              placeholder="Enter ID number"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pb-8">
          <Link
            href="/receptionist"
            className="px-6 py-3 rounded-lg border border-gray-800 text-gray-300 hover:bg-gray-900 transition flex items-center justify-center gap-2"
          >
            <X size={18} />
            Cancel
          </Link>

          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Register Patient
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------------- Input Component ---------------- */

function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  disabled = false,
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">
        {label}
        {required && <span className="text-grey  ml-1">*</span>}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full border border-gray-800 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-500 ${
          disabled
            ? "bg-[#111] text-gray-600 cursor-not-allowed"
            : "bg-black text-white"
        }`}
      />
    </div>
  );
}

/* ---------------- Select Component ---------------- */

function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">{label}</label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-300 outline-none focus:border-gray-500"
      >
        <option value="">Select {label}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}