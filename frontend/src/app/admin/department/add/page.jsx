"use client";

import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function AddDepartmentPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/departments"
          className="p-2 rounded-lg border border-gray-800 hover:bg-gray-900 transition"
        >
          <ArrowLeft size={20} />
        </Link>

        <div>
          <h1 className="text-2xl font-semibold">
            Add Department
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Create a new hospital department
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">

        <form className="bg-[#0d0d0d] border border-gray-800 rounded-xl p-6">

          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-1">
              Department Information
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              Enter basic information about the department
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Department Name */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Department Name
                </label>

                <input
                  type="text"
                  placeholder="e.g. Cardiology"
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-500"
                />
              </div>

              {/* Department Code */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Department Code
                </label>

                <input
                  type="text"
                  placeholder="e.g. CARD-01"
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm uppercase outline-none focus:border-gray-500"
                />
              </div>

              {/* Head Doctor */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Head Doctor
                </label>

                <select
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-300 outline-none focus:border-gray-500"
                >
                  <option value="">Select Head Doctor</option>
                  <option value="1">Dr. Rahul Sharma</option>
                  <option value="2">Dr. Amit Verma</option>
                  <option value="3">Dr. Mohan Gupta</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Location
                </label>

                <input
                  type="text"
                  placeholder="e.g. 2nd Floor"
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-500"
                />
              </div>

            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <label className="block text-sm text-gray-300 mb-2">
              Description
            </label>

            <textarea
              rows={5}
              placeholder="Enter department description..."
              className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm outline-none resize-none focus:border-gray-500"
            />
          </div>

          {/* Status */}
          <div className="mb-8">
            <label className="block text-sm text-gray-300 mb-2">
              Status
            </label>

            <select
              className="w-full md:w-1/2 bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-300 outline-none focus:border-gray-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-5 border-t border-gray-800">

            <Link
              href="/admin/departments"
              className="px-5 py-2.5 rounded-lg border border-gray-800 text-gray-300 hover:bg-gray-900 transition text-sm"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition text-sm"
            >
              <Save size={17} />
              Add Department
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}