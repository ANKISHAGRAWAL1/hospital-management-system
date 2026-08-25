"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";

export default function AddAppointment() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    patient: "",
    doctor: "",
    department: "",
    date: "",
    time: "",
    type: "New",
    priority: "Normal",
    symptoms: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Appointment Data:", formData);

    // API yahan connect karenge
    alert("Appointment created successfully!");

    router.push("/admin/appointment");
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-semibold">
            Add Appointment
          </h1>
          <p className="text-gray-500 text-sm">
            Create a new patient appointment
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl bg-gray-950 border border-gray-800 rounded-xl p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Patient */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Patient
            </label>

            <select
              name="patient"
              value={formData.patient}
              onChange={handleChange}
              required
              className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-500"
            >
              <option value="">Select Patient</option>
              <option value="P001 - Rahul Sharma">
                P001 - Rahul Sharma
              </option>
              <option value="P002 - Amit Kumar">
                P002 - Amit Kumar
              </option>
              <option value="P003 - Priya Gupta">
                P003 - Priya Gupta
              </option>
            </select>
          </div>

          {/* Doctor */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Doctor
            </label>

            <select
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              required
              className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-500"
            >
              <option value="">Select Doctor</option>
              <option value="Dr. Raj Sharma">
                Dr. Raj Sharma
              </option>
              <option value="Dr. Amit Verma">
                Dr. Amit Verma
              </option>
              <option value="Dr. Neha Gupta">
                Dr. Neha Gupta
              </option>
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Department
            </label>

            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-500"
            >
              <option value="">Select Department</option>
              <option value="Cardiology">Cardiology</option>
              <option value="General Medicine">
                General Medicine
              </option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Dermatology">Dermatology</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Appointment Date
            </label>

            <div className="relative">
              <CalendarDays
                size={18}
                className="absolute left-4 top-3.5 text-gray-500"
              />

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full bg-black border border-gray-800 rounded-lg pl-11 pr-4 py-3 text-sm outline-none focus:border-gray-500"
              />
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Appointment Time
            </label>

            <div className="relative">
              <Clock
                size={18}
                className="absolute left-4 top-3.5 text-gray-500"
              />

              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full bg-black border border-gray-800 rounded-lg pl-11 pr-4 py-3 text-sm outline-none focus:border-gray-500"
              >
                <option value="">Select Time Slot</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="12:30 PM">12:30 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="02:30 PM">02:30 PM</option>
                <option value="03:00 PM">03:00 PM</option>
              </select>
            </div>
          </div>

          {/* Appointment Type */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Appointment Type
            </label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-500"
            >
              <option value="New">New</option>
              <option value="Follow-up">Follow-up</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Priority
            </label>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-500"
            >
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          {/* Symptoms */}
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-300 mb-2">
              Symptoms / Reason
            </label>

            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              rows="3"
              placeholder="Enter patient symptoms or reason..."
              className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-500 resize-none"
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-300 mb-2">
              Notes
            </label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Additional notes..."
              className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-500 resize-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-3 rounded-lg border border-gray-800 text-gray-300 hover:bg-gray-900"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-white text-black font-medium hover:bg-gray-200"
          >
            Create Appointment
          </button>
        </div>
      </form>
    </div>
  );
}