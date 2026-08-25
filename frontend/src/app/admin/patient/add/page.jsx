"use client";

import { useState } from "react";
import { ArrowLeft, UserPlus } from "lucide-react";
import Link from "next/link";

export default function AddPatientPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    emergencyName: "",
    emergencyPhone: "",
    doctor: "",
    department: "",
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

    alert("Patient added successfully!");
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">

        <Link
          href="/admin/patient"
          className="p-2 rounded-lg bg-gray-900 border border-gray-800 hover:bg-gray-800"
        >
          <ArrowLeft size={20} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold">Add Patient</h1>
          <p className="text-gray-400 text-sm mt-1">
            Add a new patient to the hospital
          </p>
        </div>

      </div>

      <form onSubmit={handleSubmit}>

        {/* Personal Information */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 mb-6">

          <div className="flex items-center gap-2 mb-6">
            <UserPlus size={20} />
            <h2 className="text-lg font-semibold">
              Personal Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {/* First Name */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                First Name *
              </label>

              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                required
                className="input-style"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Last Name *
              </label>

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                required
                className="input-style"
              />
            </div>

            {/* DOB */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Date of Birth *
              </label>

              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className="input-style"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Gender *
              </label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="input-style"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Blood Group
              </label>

              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="input-style"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Phone Number *
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
                className="input-style"
              />
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className="input-style"
              />
            </div>

          </div>
        </div>

        {/* Address */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 mb-6">

          <h2 className="text-lg font-semibold mb-6">
            Address Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">
                Address *
              </label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter complete address"
                rows="3"
                required
                className="input-style resize-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                City *
              </label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                required
                className="input-style"
              />
            </div>

          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 mb-6">

          <h2 className="text-lg font-semibold mb-6">
            Emergency Contact
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Contact Name
              </label>

              <input
                type="text"
                name="emergencyName"
                value={formData.emergencyName}
                onChange={handleChange}
                placeholder="Emergency contact name"
                className="input-style"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Contact Phone
              </label>

              <input
                type="tel"
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handleChange}
                placeholder="Emergency contact number"
                className="input-style"
              />
            </div>

          </div>
        </div>

        {/* Doctor Assignment */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 mb-6">

          <h2 className="text-lg font-semibold mb-6">
            Doctor Assignment
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Department *
              </label>

              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="input-style"
              >
                <option value="">Select Department</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Pediatrics">Pediatrics</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Doctor *
              </label>

              <select
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                required
                className="input-style"
              >
                <option value="">Select Doctor</option>
                <option value="Dr. Amit Sharma">
                  Dr. Amit Sharma
                </option>
                <option value="Dr. Raj Kumar">
                  Dr. Raj Kumar
                </option>
                <option value="Dr. Neha">
                  Dr. Neha
                </option>
              </select>
            </div>

          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">

          <Link
            href="/admin/patient"
            className="px-5 py-2.5 rounded-lg border border-gray-800 text-gray-300 hover:bg-gray-900"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-white text-black font-medium hover:bg-gray-200"
          >
            Add Patient
          </button>

        </div>

      </form>

      {/* Input CSS */}
      <style jsx>{`
        .input-style {
          width: 100%;
          background: black;
          border: 1px solid rgb(31 41 55);
          border-radius: 0.5rem;
          padding: 0.65rem 0.85rem;
          color: white;
          outline: none;
        }

        .input-style:focus {
          border-color: rgb(107 114 128);
        }

        .input-style::placeholder {
          color: rgb(107 114 128);
        }

        select.input-style option {
          background: black;
          color: white;
        }
      `}</style>

    </div>
  );
}