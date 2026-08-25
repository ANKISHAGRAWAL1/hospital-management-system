"use client";

import { ArrowLeft, Save, Upload, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AddDoctorPage() {
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">

        <Link
          href="/admin/doctor"
          className="p-2 rounded-lg border border-gray-800 hover:bg-gray-900 transition"
        >
          <ArrowLeft size={20} />
        </Link>

        <div>
          <h1 className="text-2xl font-semibold">
            Add Doctor
          </h1>

          <p className="text-sm text-gray-400 mt-1">
            Add a new doctor to the hospital
          </p>
        </div>

      </div>

      {/* Form */}
      <form className="max-w-5xl">

        <div className="bg-[#0d0d0d] border border-gray-800 rounded-xl p-6">

          {/* ================= PROFILE INFORMATION ================= */}
          <div className="mb-8">

            <h2 className="text-lg font-medium">
              Profile Information
            </h2>

            <p className="text-sm text-gray-500 mt-1 mb-6">
              Upload doctor's profile picture
            </p>

            <div className="flex items-center gap-6">

              {/* Image Preview */}
              <div className="relative">

                <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-900 border border-gray-800 flex items-center justify-center">

                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Doctor"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm">
                      No Image
                    </span>
                  )}

                </div>

                {imagePreview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600"
                  >
                    <X size={15} />
                  </button>
                )}

              </div>

              {/* Upload */}
              <div>

                <label
                  htmlFor="profile"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-black text-sm font-medium cursor-pointer hover:bg-gray-200 transition"
                >
                  <Upload size={17} />
                  Upload Photo
                </label>

                <input
                  id="profile"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG or WEBP. Maximum size 2MB.
                </p>

              </div>

            </div>

          </div>


          {/* ================= PERSONAL INFORMATION ================= */}
          <div className="mb-8">

            <h2 className="text-lg font-medium">
              Personal Information
            </h2>

            <p className="text-sm text-gray-500 mt-1 mb-6">
              Enter doctor's personal details
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* First Name */}
              <div>

                <label className="block text-sm text-gray-300 mb-2">
                  First Name
                </label>

                <input
                  type="text"
                  placeholder="Enter first name"
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-gray-500"
                />

              </div>


              {/* Last Name */}
              <div>

                <label className="block text-sm text-gray-300 mb-2">
                  Last Name
                </label>

                <input
                  type="text"
                  placeholder="Enter last name"
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-gray-500"
                />

              </div>


              {/* Email */}
              <div>

                <label className="block text-sm text-gray-300 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="doctor@example.com"
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-gray-500"
                />

              </div>


              {/* Phone */}
              <div>

                <label className="block text-sm text-gray-300 mb-2">
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-gray-500"
                />

              </div>


              {/* Gender */}
              <div>

                <label className="block text-sm text-gray-300 mb-2">
                  Gender
                </label>

                <select className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-300 outline-none focus:border-gray-500">

                  <option value="">
                    Select Gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>


              {/* Date of Birth */}
              <div>

                <label className="block text-sm text-gray-300 mb-2">
                  Date of Birth
                </label>

                <input
                  type="date"
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-gray-500"
                />

              </div>

            </div>

          </div>


          {/* ================= PROFESSIONAL INFORMATION ================= */}
          <div className="mb-8">

            <h2 className="text-lg font-medium">
              Professional Information
            </h2>

            <p className="text-sm text-gray-500 mt-1 mb-6">
              Enter doctor's professional details
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Specialization */}
              <div>

                <label className="block text-sm text-gray-300 mb-2">
                  Specialization
                </label>

                <input
                  type="text"
                  placeholder="e.g. Cardiologist"
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-gray-500"
                />

              </div>


              {/* Department */}
              <div>

                <label className="block text-sm text-gray-300 mb-2">
                  Department
                </label>

                <select className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-300 outline-none focus:border-gray-500">

                  <option value="">
                    Select Department
                  </option>

                  <option value="Cardiology">
                    Cardiology
                  </option>

                  <option value="Neurology">
                    Neurology
                  </option>

                  <option value="Orthopedics">
                    Orthopedics
                  </option>

                  <option value="Dermatology">
                    Dermatology
                  </option>

                  <option value="Pediatrics">
                    Pediatrics
                  </option>

                </select>

              </div>


              {/* Qualification */}
              <div>

                <label className="block text-sm text-gray-300 mb-2">
                  Qualification
                </label>

                <input
                  type="text"
                  placeholder="e.g. MBBS, MD"
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-gray-500"
                />

              </div>


              {/* Experience */}
              <div>

                <label className="block text-sm text-gray-300 mb-2">
                  Experience (Years)
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 8"
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-gray-500"
                />

              </div>


              {/* Consultation Fee */}
              <div>

                <label className="block text-sm text-gray-300 mb-2">
                  Consultation Fee
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 500"
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-gray-500"
                />

              </div>


              {/* License Number */}
              <div>

                <label className="block text-sm text-gray-300 mb-2">
                  Medical License Number
                </label>

                <input
                  type="text"
                  placeholder="Enter license number"
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-gray-500"
                />

              </div>

            </div>

          </div>


          {/* ================= AVAILABILITY ================= */}
          <div className="mb-8">

            <h2 className="text-lg font-medium">
              Availability
            </h2>

            <p className="text-sm text-gray-500 mt-1 mb-6">
              Set doctor's working schedule
            </p>


            {/* Available Days */}
            <div className="mb-5">

              <label className="block text-sm text-gray-300 mb-3">
                Available Days
              </label>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (

                  <label
                    key={day}
                    className="flex items-center gap-3 bg-black border border-gray-800 rounded-lg px-4 py-3 cursor-pointer hover:border-gray-600 transition"
                  >

                    <input
                      type="checkbox"
                      value={day}
                      className="w-4 h-4 accent-white cursor-pointer"
                    />

                    <span className="text-sm text-gray-300">
                      {day}
                    </span>

                  </label>

                ))}

              </div>

            </div>


            {/* Time & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Start Time */}
              <div>

                <label className="block text-sm text-gray-300 mb-2">
                  Start Time
                </label>

                <input
                  type="time"
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-gray-500"
                />

              </div>


              {/* End Time */}
              <div>

                <label className="block text-sm text-gray-300 mb-2">
                  End Time
                </label>

                <input
                  type="time"
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-gray-500"
                />

              </div>


              {/* Appointment Duration */}
              <div>

                <label className="block text-sm text-gray-300 mb-2">
                  Appointment Duration
                </label>

                <select className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-300 outline-none focus:border-gray-500">

                  <option value="15">
                    15 Minutes
                  </option>

                  <option value="30">
                    30 Minutes
                  </option>

                  <option value="45">
                    45 Minutes
                  </option>

                  <option value="60">
                    60 Minutes
                  </option>

                </select>

              </div>


              {/* Status */}
              <div>

                <label className="block text-sm text-gray-300 mb-2">
                  Status
                </label>

                <select className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-300 outline-none focus:border-gray-500">

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>

              </div>

            </div>

          </div>


          {/* ================= ADDRESS ================= */}
          <div className="mb-8">

            <h2 className="text-lg font-medium">
              Address
            </h2>

            <p className="text-sm text-gray-500 mt-1 mb-6">
              Enter doctor's address
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Full Address */}
              <div className="md:col-span-2">

                <label className="block text-sm text-gray-300 mb-2">
                  Full Address
                </label>

                <textarea
                  rows={3}
                  placeholder="Enter full address"
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none resize-none focus:border-gray-500"
                />

              </div>


              {/* City */}
              <div>

                <label className="block text-sm text-gray-300 mb-2">
                  City
                </label>

                <input
                  type="text"
                  placeholder="Enter city"
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-gray-500"
                />

              </div>


              {/* State */}
              <div>

                <label className="block text-sm text-gray-300 mb-2">
                  State
                </label>

                <input
                  type="text"
                  placeholder="Enter state"
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-gray-500"
                />

              </div>


              {/* Pincode */}
              <div>

                <label className="block text-sm text-gray-300 mb-2">
                  Pincode
                </label>

                <input
                  type="text"
                  placeholder="Enter pincode"
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-gray-500"
                />

              </div>

            </div>

          </div>


          {/* ================= BUTTONS ================= */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-800">

            <Link
              href="/admin/doctor"
              className="px-5 py-2.5 rounded-lg border border-gray-800 text-gray-300 hover:bg-gray-900 transition text-sm"
            >
              Cancel
            </Link>


            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition text-sm"
            >
              <Save size={17} />
              Add Doctor
            </button>

          </div>

        </div>

      </form>

    </div>
  );
}