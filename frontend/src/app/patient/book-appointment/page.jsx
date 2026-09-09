"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  Stethoscope,
  UserRound,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  User,
  CreditCard,
} from "lucide-react";

const departments = [
  "Cardiology",
  "Dermatology",
  "General Medicine",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
];

const doctors = [
  {
    id: 1,
    name: "Dr. Rahul Sharma",
    department: "Cardiology",
    experience: "12 Years",
    fee: 800,
    duration: 30,
  },
  {
    id: 2,
    name: "Dr. Priya Mehta",
    department: "Dermatology",
    experience: "9 Years",
    fee: 600,
    duration: 30,
  },
  {
    id: 3,
    name: "Dr. Amit Verma",
    department: "General Medicine",
    experience: "15 Years",
    fee: 500,
    duration: 30,
  },
  {
    id: 4,
    name: "Dr. Neha Gupta",
    department: "Neurology",
    experience: "11 Years",
    fee: 900,
    duration: 30,
  },
  {
    id: 5,
    name: "Dr. Vikram Singh",
    department: "Orthopedics",
    experience: "14 Years",
    fee: 700,
    duration: 30,
  },
  {
    id: 6,
    name: "Dr. Anjali Mehta",
    department: "Pediatrics",
    experience: "10 Years",
    fee: 600,
    duration: 30,
  },
];

const visitTypes = [
  {
    id: "new",
    title: "New Consultation",
    description: "First visit with this doctor",
  },
  {
    id: "follow-up",
    title: "Follow-up",
    description: "Review of previous consultation",
  },
];

const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
];

const bookedSlots = ["10:30 AM", "04:30 PM"];

export default function BookAppointmentPage() {
  // Demo patient.
  // Later this will come from logged-in patient account/API.
  const patient = {
    id: "HSP-00010245",
    name: "Rahul Sharma",
    mobile: "98XXXXXXXX",
  };

  const [department, setDepartment] = useState("");
  const [doctor, setDoctor] = useState("");
  const [visitType, setVisitType] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [appointmentId, setAppointmentId] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const filteredDoctors = useMemo(() => {
    return doctors.filter(
      (item) => item.department === department
    );
  }, [department]);

  const selectedDoctor = useMemo(() => {
    return doctors.find(
      (item) => item.id === Number(doctor)
    );
  }, [doctor]);

  const selectedVisitType = visitTypes.find(
    (item) => item.id === visitType
  );

  const availableSlots = timeSlots.filter(
    (time) => !bookedSlots.includes(time)
  );

  const handleDepartment = (value) => {
    setDepartment(value);
    setDoctor("");
    setVisitType("");
    setDate("");
    setSlot("");
  };

  const handleDoctor = (value) => {
    setDoctor(value);
    setVisitType("");
    setDate("");
    setSlot("");
  };

  const handleVisitType = (value) => {
    setVisitType(value);
    setDate("");
    setSlot("");
  };

  const handleDate = (value) => {
    setDate(value);
    setSlot("");
  };

  const confirmAppointment = () => {
    if (
      !department ||
      !doctor ||
      !visitType ||
      !date ||
      !slot
    ) {
      return;
    }

    const randomNumber = Math.floor(
      1000 + Math.random() * 9000
    );

    setAppointmentId(
      `APT-${date.replaceAll("-", "")}-${randomNumber}`
    );

    setConfirmed(true);
  };

  const resetBooking = () => {
    setConfirmed(false);
    setDepartment("");
    setDoctor("");
    setVisitType("");
    setDate("");
    setSlot("");
    setAppointmentId("");
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-black text-white p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">

          <Link
            href="/patient/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-6"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <div className="border border-gray-800 bg-[#080808] rounded-xl p-6 sm:p-8">

            <div className="text-center">

              <div className="w-16 h-16 mx-auto rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center">
                <CheckCircle2
                  size={34}
                  className="text-gray-300"
                />
              </div>

              <h1 className="text-2xl font-semibold mt-5">
                Appointment Confirmed
              </h1>

              <p className="text-sm text-gray-500 mt-2">
                Your appointment has been successfully booked.
              </p>

            </div>

            {/* Appointment ID */}
            <div className="border border-gray-800 rounded-xl p-5 mt-6">

              <div className="text-center">
                <p className="text-xs text-gray-600">
                  Appointment ID
                </p>

                <p className="text-lg font-semibold mt-1">
                  {appointmentId}
                </p>
              </div>

            </div>

            {/* Patient */}
            <div className="border border-gray-800 rounded-xl p-5 mt-4">

              <div className="flex items-center gap-2 mb-4">
                <User size={17} />
                <h2 className="text-sm font-medium">
                  Patient Details
                </h2>
              </div>

              <div className="space-y-3">
                <SummaryRow
                  label="Patient"
                  value={patient.name}
                />

                <SummaryRow
                  label="UHID"
                  value={patient.id}
                />

                <SummaryRow
                  label="Mobile"
                  value={patient.mobile}
                />
              </div>

            </div>

            {/* Appointment */}
            <div className="border border-gray-800 rounded-xl p-5 mt-4">

              <div className="flex items-center gap-2 mb-4">
                <CalendarDays size={17} />
                <h2 className="text-sm font-medium">
                  Appointment Details
                </h2>
              </div>

              <div className="space-y-3">

                <SummaryRow
                  label="Department"
                  value={department}
                />

                <SummaryRow
                  label="Doctor"
                  value={selectedDoctor?.name}
                />

                <SummaryRow
                  label="Visit Type"
                  value={selectedVisitType?.title}
                />

                <SummaryRow
                  label="Date"
                  value={formatDate(date)}
                />

                <SummaryRow
                  label="Time"
                  value={slot}
                />

                <SummaryRow
                  label="Duration"
                  value={`${selectedDoctor?.duration} minutes`}
                />

                <SummaryRow
                  label="Consultation Fee"
                  value={`₹${selectedDoctor?.fee}`}
                />

                <SummaryRow
                  label="Status"
                  value="Confirmed"
                />

              </div>

            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">

              <Link
                href="/patient/appointments"
                className="py-3 rounded-lg bg-white text-black text-sm font-medium hover:bg-gray-200 transition text-center"
              >
                View Appointments
              </Link>

              <button
                type="button"
                onClick={resetBooking}
                className="py-3 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-900 transition text-sm"
              >
                Book Another
              </button>

            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">

      <main className="p-4 sm:p-6">

        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-6">

            <Link
              href="/patient/dashboard"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition mb-4"
            >
              <ArrowLeft size={16} />
              Dashboard
            </Link>

            <h1 className="text-xl sm:text-2xl font-semibold">
              Book Appointment
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Select doctor, visit type, date and available slot.
            </p>

          </div>

          {/* Progress */}
          <div className="border border-gray-800 bg-[#080808] rounded-xl p-4 sm:p-5 mb-6">

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

              <Step
                number="1"
                title="Department"
                active={!department}
                completed={!!department}
              />

              <Step
                number="2"
                title="Doctor"
                active={!!department && !doctor}
                completed={!!doctor}
              />

              <Step
                number="3"
                title="Visit Type"
                active={!!doctor && !visitType}
                completed={!!visitType}
              />

              <Step
                number="4"
                title="Date & Time"
                active={
                  !!visitType && (!date || !slot)
                }
                completed={!!date && !!slot}
              />

              <Step
                number="5"
                title="Confirmation"
                active={false}
                completed={false}
              />

            </div>

          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            <div className="xl:col-span-2 space-y-6">

              {/* Patient */}
              <section className="border border-gray-800 bg-[#080808] rounded-xl p-5 sm:p-6">

                <SectionHeading
                  icon={User}
                  title="Patient"
                  description="Appointment will be booked for your registered patient account."
                />

                <div className="border border-gray-800 rounded-lg p-4 bg-black">

                  <div className="flex items-center justify-between gap-4">

                    <div>
                      <p className="text-sm font-medium">
                        {patient.name}
                      </p>

                      <div className="flex flex-wrap gap-4 mt-2">

                        <span className="text-xs text-gray-500">
                          UHID: {patient.id}
                        </span>

                        <span className="text-xs text-gray-500">
                          Mobile: {patient.mobile}
                        </span>

                      </div>
                    </div>

                    <CheckCircle2
                      size={19}
                      className="text-gray-500 shrink-0"
                    />

                  </div>

                </div>

              </section>

              {/* Department */}
              <section className="border border-gray-800 bg-[#080808] rounded-xl p-5 sm:p-6">

                <SectionHeading
                  icon={Stethoscope}
                  title="Select Department"
                  description="Choose the department you want to visit."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

                  {departments.map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() =>
                        handleDepartment(item)
                      }
                      className={`text-left p-4 rounded-lg border transition ${
                        department === item
                          ? "border-white bg-gray-900"
                          : "border-gray-800 hover:border-gray-600"
                      }`}
                    >
                      <p className="text-sm font-medium">
                        {item}
                      </p>

                      <p className="text-xs text-gray-600 mt-1">
                        Select department
                      </p>
                    </button>
                  ))}

                </div>

              </section>

              {/* Doctor */}
              {department && (
                <section className="border border-gray-800 bg-[#080808] rounded-xl p-5 sm:p-6">

                  <SectionHeading
                    icon={UserRound}
                    title="Select Doctor"
                    description={`Doctors available in ${department}.`}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {filteredDoctors.length > 0 ? (
                      filteredDoctors.map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() =>
                            handleDoctor(
                              String(item.id)
                            )
                          }
                          className={`text-left border rounded-xl p-5 transition ${
                            doctor === String(item.id)
                              ? "border-white bg-gray-900"
                              : "border-gray-800 hover:border-gray-600"
                          }`}
                        >

                          <div className="flex items-start gap-4">

                            <div className="w-12 h-12 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0">
                              <Stethoscope
                                size={21}
                                className="text-gray-400"
                              />
                            </div>

                            <div className="flex-1">

                              <h3 className="font-medium">
                                {item.name}
                              </h3>

                              <p className="text-xs text-gray-500 mt-1">
                                {item.department}
                              </p>

                              <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">

                                <span>
                                  {item.experience}
                                </span>

                                <span>
                                  ₹{item.fee}
                                </span>

                                <span>
                                  {item.duration} min
                                </span>

                              </div>

                            </div>

                          </div>

                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-gray-600">
                        No doctors available.
                      </p>
                    )}

                  </div>

                </section>
              )}

              {/* Visit Type */}
              {doctor && (
                <section className="border border-gray-800 bg-[#080808] rounded-xl p-5 sm:p-6">

                  <SectionHeading
                    icon={UserRound}
                    title="Visit Type"
                    description="Select the type of consultation."
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {visitTypes.map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() =>
                          handleVisitType(item.id)
                        }
                        className={`text-left p-4 rounded-xl border transition ${
                          visitType === item.id
                            ? "border-white bg-gray-900"
                            : "border-gray-800 hover:border-gray-600"
                        }`}
                      >

                        <p className="text-sm font-medium">
                          {item.title}
                        </p>

                        <p className="text-xs text-gray-600 mt-1">
                          {item.description}
                        </p>

                      </button>
                    ))}

                  </div>

                </section>
              )}

              {/* Date & Time */}
              {visitType && (
                <section className="border border-gray-800 bg-[#080808] rounded-xl p-5 sm:p-6">

                  <SectionHeading
                    icon={CalendarDays}
                    title="Select Date & Time"
                    description="Choose an available appointment slot."
                  />

                  <label className="block text-sm text-gray-400 mb-2">
                    Appointment Date
                  </label>

                  <input
                    type="date"
                    value={date}
                    min={today}
                    onChange={(e) =>
                      handleDate(e.target.value)
                    }
                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-gray-500"
                  />

                  {date && (
                    <div className="mt-6">

                      <div className="flex items-center gap-2 mb-3">

                        <Clock
                          size={17}
                          className="text-gray-500"
                        />

                        <p className="text-sm text-gray-400">
                          Available Time Slots
                        </p>

                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">

                        {timeSlots.map((item) => {

                          const isBooked =
                            bookedSlots.includes(item);

                          return (
                            <button
                              type="button"
                              key={item}
                              disabled={isBooked}
                              onClick={() =>
                                setSlot(item)
                              }
                              className={`py-3 rounded-lg border text-sm transition ${
                                isBooked
                                  ? "border-gray-900 text-gray-700 bg-black cursor-not-allowed"
                                  : slot === item
                                  ? "bg-white text-black border-white"
                                  : "border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white"
                              }`}
                            >
                              {item}

                              {isBooked && (
                                <span className="block text-[10px] mt-1">
                                  Booked
                                </span>
                              )}
                            </button>
                          );
                        })}

                      </div>

                    </div>
                  )}

                </section>
              )}

            </div>

            {/* Summary */}
            <div>

              <div className="border border-gray-800 bg-[#080808] rounded-xl p-5 sm:p-6 xl:sticky xl:top-20">

                <h2 className="text-lg font-semibold">
                  Appointment Summary
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Review details before confirming.
                </p>

                <div className="space-y-4 mt-6">

                  <SummaryRow
                    label="Patient"
                    value={patient.name}
                  />

                  <SummaryRow
                    label="UHID"
                    value={patient.id}
                  />

                  <SummaryRow
                    label="Department"
                    value={
                      department || "Not selected"
                    }
                  />

                  <SummaryRow
                    label="Doctor"
                    value={
                      selectedDoctor?.name ||
                      "Not selected"
                    }
                  />

                  <SummaryRow
                    label="Visit Type"
                    value={
                      selectedVisitType?.title ||
                      "Not selected"
                    }
                  />

                  <SummaryRow
                    label="Date"
                    value={
                      date
                        ? formatDate(date)
                        : "Not selected"
                    }
                  />

                  <SummaryRow
                    label="Time"
                    value={
                      slot || "Not selected"
                    }
                  />

                </div>

                {selectedDoctor && (
                  <div className="border-t border-gray-800 mt-5 pt-5 space-y-4">

                    <div className="flex items-center justify-between">

                      <span className="text-sm text-gray-500">
                        Consultation Fee
                      </span>

                      <span className="font-medium">
                        ₹{selectedDoctor.fee}
                      </span>

                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <CreditCard size={14} />
                      Payment can be handled according to hospital policy.
                    </div>

                  </div>
                )}

                <button
                  type="button"
                  onClick={confirmAppointment}
                  disabled={
                    !department ||
                    !doctor ||
                    !visitType ||
                    !date ||
                    !slot
                  }
                  className="w-full mt-6 py-3 rounded-lg bg-white text-black text-sm font-medium hover:bg-gray-200 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  Confirm Appointment
                  <ChevronRight size={17} />
                </button>

                <div className="flex items-start gap-2 mt-4">

                  <Clock
                    size={14}
                    className="text-gray-600 mt-0.5"
                  />

                  <p className="text-[11px] text-gray-600 leading-5">
                    Please arrive 10–15 minutes before your
                    appointment time.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

/* ---------------- Section Heading ---------------- */

function SectionHeading({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="flex items-center gap-3 mb-5">

      <div className="w-10 h-10 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0">
        <Icon
          size={19}
          className="text-gray-400"
        />
      </div>

      <div>

        <h2 className="font-semibold">
          {title}
        </h2>

        <p className="text-xs text-gray-600 mt-1">
          {description}
        </p>

      </div>

    </div>
  );
}

/* ---------------- Step ---------------- */

function Step({
  number,
  title,
  active,
  completed,
}) {
  return (
    <div className="flex items-center gap-3">

      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs border shrink-0 ${
          completed
            ? "bg-white text-black border-white"
            : active
            ? "bg-gray-800 text-white border-gray-600"
            : "bg-black text-gray-600 border-gray-800"
        }`}
      >
        {completed ? (
          <CheckCircle2 size={16} />
        ) : (
          number
        )}
      </div>

      <span
        className={`text-xs sm:text-sm ${
          active || completed
            ? "text-white"
            : "text-gray-600"
        }`}
      >
        {title}
      </span>

    </div>
  );
}

/* ---------------- Summary Row ---------------- */

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">

      <span className="text-xs text-gray-500">
        {label}
      </span>

      <span className="text-sm text-gray-300 text-right">
        {value}
      </span>

    </div>
  );
}

/* ---------------- Date ---------------- */

function formatDate(date) {
  if (!date) return "";

  const formatted = new Date(
    `${date}T00:00:00`
  );

  return formatted.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}