"use client";

import { useState } from "react";
import {
  Building2,
  Stethoscope,
  CalendarDays,
  Video,
  Hospital,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  UserRound,
} from "lucide-react";

const departments = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Dermatology",
  "General Medicine",
];

const doctors = {
  Cardiology: [
    {
      id: 1,
      name: "Dr. Rahul Sharma",
      specialization: "Cardiologist",
      fee: 800,
    },
    {
      id: 2,
      name: "Dr. Priya Mehta",
      specialization: "Cardiologist",
      fee: 700,
    },
  ],

  Neurology: [
    {
      id: 3,
      name: "Dr. Amit Verma",
      specialization: "Neurologist",
      fee: 900,
    },
  ],

  Orthopedics: [
    {
      id: 4,
      name: "Dr. Rajesh Kumar",
      specialization: "Orthopedic Specialist",
      fee: 600,
    },
  ],

  Dermatology: [
    {
      id: 5,
      name: "Dr. Neha Gupta",
      specialization: "Dermatologist",
      fee: 500,
    },
  ],

  "General Medicine": [
    {
      id: 6,
      name: "Dr. Ankit Singh",
      specialization: "General Physician",
      fee: 400,
    },
  ],
};

const steps = [
  {
    id: 1,
    title: "Department",
    icon: Building2,
  },
  {
    id: 2,
    title: "Doctor",
    icon: Stethoscope,
  },
  {
    id: 3,
    title: "Date",
    icon: CalendarDays,
  },
  {
    id: 4,
    title: "Appointment Type",
    icon: Hospital,
  },
  {
    id: 5,
    title: "Patient Login",
    icon: UserRound,
  },
];

export default function AppointmentPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const [department, setDepartment] = useState("");
  const [doctor, setDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentType, setAppointmentType] = useState("");

  const availableDoctors = department
    ? doctors[department] || []
    : [];

  const handleDepartmentChange = (value) => {
    setDepartment(value);
    setDoctor(null);
  };

  const handleNext = () => {
    if (currentStep === 1 && !department) {
      alert("Please select a department");
      return;
    }

    if (currentStep === 2 && !doctor) {
      alert("Please select a doctor");
      return;
    }

    if (currentStep === 3 && !appointmentDate) {
      alert("Please select appointment date");
      return;
    }

    if (currentStep === 4 && !appointmentType) {
      alert("Please select appointment type");
      return;
    }

    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleLogin = () => {
    // Later:
    // router.push("/patient/login")
    alert("Patient Login page will open here.");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Book an Appointment
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Select your doctor and preferred appointment type
          </p>
        </div>

        {/* Main Card */}
        <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[280px_1fr]">

          {/* LEFT STEPS */}
          <div className="border-b border-slate-200 bg-slate-50 p-6 lg:border-b-0 lg:border-r">
            <h2 className="mb-6 text-lg font-semibold text-slate-800">
              Appointment Steps
            </h2>

            <div className="space-y-5">
              {steps.map((step) => {
                const Icon = step.icon;

                const active = currentStep === step.id;
                const completed = currentStep > step.id;

                return (
                  <div
                    key={step.id}
                    className="flex items-center gap-3"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                        completed
                          ? "border-blue-600 bg-blue-600 text-white"
                          : active
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-slate-300 bg-white text-slate-400"
                      }`}
                    >
                      {completed ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <Icon size={19} />
                      )}
                    </div>

                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          active || completed
                            ? "text-blue-600"
                            : "text-slate-500"
                        }`}
                      >
                        Step {step.id}
                      </p>

                      <p
                        className={`text-sm ${
                          active
                            ? "font-semibold text-slate-900"
                            : "text-slate-500"
                        }`}
                      >
                        {step.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="p-6 md:p-10">

            {/* STEP 1 */}
            {currentStep === 1 && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Select Department
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Choose the department for your consultation.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {departments.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        handleDepartmentChange(item)
                      }
                      className={`rounded-xl border p-5 text-left transition ${
                        department === item
                          ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                          : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                        <Building2 size={21} />
                      </div>

                      <h3 className="font-semibold text-slate-900">
                        {item}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Consultation department
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Select Doctor
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Doctors available in{" "}
                    <span className="font-medium text-slate-700">
                      {department}
                    </span>
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {availableDoctors.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setDoctor(item)}
                      className={`rounded-xl border p-5 text-left transition ${
                        doctor?.id === item.id
                          ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                          : "border-slate-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <Stethoscope size={22} />
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">
                            {item.name}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {item.specialization}
                          </p>

                          <p className="mt-3 text-sm font-semibold text-blue-600">
                            Consultation Fee: ₹{item.fee}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Select Appointment Date
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Choose your preferred consultation date.
                  </p>
                </div>

                <div className="max-w-md">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Appointment Date
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="date"
                      value={appointmentDate}
                      min={
                        new Date()
                          .toISOString()
                          .split("T")[0]
                      }
                      onChange={(e) =>
                        setAppointmentDate(e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {currentStep === 4 && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Select Appointment Type
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Choose how you want to consult the doctor.
                  </p>
                </div>

                <div className="grid max-w-3xl gap-5 md:grid-cols-2">

                  {/* Hospital */}
                  <button
                    type="button"
                    onClick={() =>
                      setAppointmentType("Hospital Visit")
                    }
                    className={`rounded-2xl border p-6 text-left transition ${
                      appointmentType === "Hospital Visit"
                        ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                        : "border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                      <Hospital size={27} />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">
                      Hospital Visit
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Visit the hospital and consult the doctor
                      in person.
                    </p>

                    {appointmentType ===
                      "Hospital Visit" && (
                      <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600">
                        <CheckCircle2 size={18} />
                        Selected
                      </div>
                    )}
                  </button>

                  {/* Video */}
                  <button
                    type="button"
                    onClick={() =>
                      setAppointmentType("Video Consultation")
                    }
                    className={`rounded-2xl border p-6 text-left transition ${
                      appointmentType === "Video Consultation"
                        ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                        : "border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <Video size={27} />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">
                      Video Consultation
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Consult the doctor online through a video
                      appointment.
                    </p>

                    {appointmentType ===
                      "Video Consultation" && (
                      <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600">
                        <CheckCircle2 size={18} />
                        Selected
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5 */}
            {currentStep === 5 && (
              <div>
                <div className="mx-auto max-w-lg text-center">

                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <UserRound size={30} />
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900">
                    Patient Login Required
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Please login or create a patient account to
                    continue with your appointment booking.
                  </p>

                  {/* Summary */}
                  <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left">

                    <h3 className="mb-4 font-semibold text-slate-900">
                      Appointment Summary
                    </h3>

                    <div className="space-y-3 text-sm">

                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500">
                          Department
                        </span>

                        <span className="font-medium text-slate-900">
                          {department}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500">
                          Doctor
                        </span>

                        <span className="font-medium text-slate-900">
                          {doctor?.name}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500">
                          Date
                        </span>

                        <span className="font-medium text-slate-900">
                          {appointmentDate}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500">
                          Type
                        </span>

                        <span className="font-medium text-blue-600">
                          {appointmentType}
                        </span>
                      </div>

                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogin}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Continue to Patient Login
                    <ArrowRight size={18} />
                  </button>

                </div>
              </div>
            )}

            {/* FOOTER BUTTONS */}
            <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-6">

              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <ArrowLeft size={17} />
                  Back
                </button>
              ) : (
                <div />
              )}

              {currentStep < 5 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Continue
                  <ArrowRight size={17} />
                </button>
              )}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}