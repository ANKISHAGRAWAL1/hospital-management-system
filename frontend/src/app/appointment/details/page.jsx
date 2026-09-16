"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Stethoscope,
  UserRound,
  Video,
} from "lucide-react";

const SERVER_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/?$/, "") ||
  "http://localhost:5000";

const VISIT_TYPES = {
  hospital: {
    label: "Hospital Visit",
    icon: Stethoscope,
  },
  video: {
    label: "Video Consultation",
    icon: Video,
  },
};

const pad = (value) => String(value).padStart(2, "0");

const formatDateForStorage = (date) => {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
};

const parseStoredDate = (value) => {
  if (!value) return null;

  const parts = String(value).split("-");
  if (parts.length !== 3) return null;

  const year = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  const day = Number(parts[2]);

  const date = new Date(year, month, day);

  if (Number.isNaN(date.getTime())) return null;

  return date;
};

const getDayName = (date) =>
  date.toLocaleDateString("en-US", {
    weekday: "long",
  }).toLowerCase();

const formatDisplayDate = (value) => {
  const date = typeof value === "string" ? parseStoredDate(value) : value;

  if (!date) return "";

  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getImageValue = (value) => {
  if (!value) return null;

  if (typeof value === "string") return value;

  if (typeof value === "object") {
    return (
      value.url ||
      value.path ||
      value.filename ||
      value.fileName ||
      value.image ||
      value.src ||
      null
    );
  }

  return null;
};

const getDoctorImageCandidates = (doctor) => {
  if (!doctor) return [];

  const rawValues = [
    getImageValue(doctor.profileImage),
    getImageValue(doctor.image),
    getImageValue(doctor.imageUrl),
    getImageValue(doctor.photo),
  ].filter(Boolean);

  const candidates = [];

  rawValues.forEach((raw) => {
    const value = String(raw).trim();

    if (!value) return;

    if (/^https?:\/\//i.test(value)) {
      candidates.push(value);
      return;
    }

    if (value.startsWith("/")) {
      candidates.push(`${SERVER_URL}${value}`);
      return;
    }

    if (value.startsWith("uploads/")) {
      candidates.push(`${SERVER_URL}/${value}`);
      return;
    }

    candidates.push(`${SERVER_URL}/uploads/doctors/${value}`);
    candidates.push(`${SERVER_URL}/doctors/${value}`);
    candidates.push(`${SERVER_URL}/${value}`);
  });

  return [...new Set(candidates)];
};

const normalizeTime = (value) => {
  if (!value) return null;

  const text = String(value).trim();

  if (/^\d{1,2}:\d{2}$/.test(text)) {
    const [hour, minute] = text.split(":").map(Number);

    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      return `${pad(hour)}:${pad(minute)}`;
    }
  }

  const match = text.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);

  if (match) {
    let hour = Number(match[1]);
    const minute = Number(match[2] || 0);
    const period = match[3].toUpperCase();

    if (hour === 12) hour = 0;
    if (period === "PM") hour += 12;

    return `${pad(hour)}:${pad(minute)}`;
  }

  return null;
};

const formatTime = (value) => {
  const normalized = normalizeTime(value);

  if (!normalized) return String(value || "");

  const [hourText, minute] = normalized.split(":");
  let hour = Number(hourText);
  const suffix = hour >= 12 ? "PM" : "AM";

  hour %= 12;
  if (hour === 0) hour = 12;

  return `${hour}:${minute} ${suffix}`;
};

const timeToMinutes = (value) => {
  const normalized = normalizeTime(value);

  if (!normalized) return null;

  const [hour, minute] = normalized.split(":").map(Number);
  return hour * 60 + minute;
};

const generateSlots = (startTime, endTime, interval = 30) => {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  if (start === null || end === null || start >= end) return [];

  const slots = [];

  for (let current = start; current + interval <= end; current += interval) {
    const hour = Math.floor(current / 60);
    const minute = current % 60;

    slots.push(`${pad(hour)}:${pad(minute)}`);
  }

  return slots;
};

const extractSlots = (source) => {
  if (!source) return [];

  if (Array.isArray(source)) {
    return source
      .map((item) => {
        if (typeof item === "string" || typeof item === "number") {
          return normalizeTime(item);
        }

        if (item && typeof item === "object") {
          return normalizeTime(
            item.time ||
              item.startTime ||
              item.slot ||
              item.label ||
              item.value
          );
        }

        return null;
      })
      .filter(Boolean);
  }

  if (typeof source === "object") {
    const possibleArrays = [
      source.slots,
      source.timeSlots,
      source.availableSlots,
      source.times,
    ];

    for (const array of possibleArrays) {
      const result = extractSlots(array);

      if (result.length) return result;
    }
  }

  return [];
};

const getModeAvailability = (availability, mode) => {
  if (!availability) return null;

  const modeKeys =
    mode === "video"
      ? ["video", "videoConsultation", "video_consultation", "online"]
      : ["hospital", "hospitalVisit", "hospital_visit", "offline", "clinic"];

  for (const key of modeKeys) {
    if (availability[key]) return availability[key];
  }

  return availability;
};

const getAvailabilityForDate = (doctor, date) => {
  if (!doctor || !date) return null;

  const dayName = getDayName(date);

  const sources = [
    doctor.availability,
    doctor.availabilities,
    doctor.weeklyAvailability,
    doctor.weeklySchedule,
    doctor.schedule,
  ];

  for (const source of sources) {
    if (!source) continue;

    if (Array.isArray(source)) {
      const found = source.find((item) => {
        const day = String(
          item?.day ||
            item?.dayName ||
            item?.weekday ||
            item?.weekDay ||
            ""
        ).toLowerCase();

        return day === dayName;
      });

      if (found) return found;
    }

    if (typeof source === "object" && source[dayName]) {
      return source[dayName];
    }
  }

  return null;
};

const getSlotsForMode = (doctor, date, mode) => {
  const availability = getAvailabilityForDate(doctor, date);

  if (!availability) return [];

  const modeAvailability = getModeAvailability(availability, mode);

  if (!modeAvailability) return [];

  if (
    modeAvailability.enabled === false ||
    modeAvailability.isAvailable === false
  ) {
    return [];
  }

  const explicitSlots = extractSlots(modeAvailability);

  if (explicitSlots.length) {
    return [...new Set(explicitSlots)].sort(
      (a, b) => timeToMinutes(a) - timeToMinutes(b)
    );
  }

  const start =
    modeAvailability.startTime ||
    modeAvailability.from ||
    modeAvailability.start ||
    availability.startTime ||
    availability.from ||
    availability.start;

  const end =
    modeAvailability.endTime ||
    modeAvailability.to ||
    modeAvailability.end ||
    availability.endTime ||
    availability.to ||
    availability.end;

  return generateSlots(start, end, 30);
};

const getDoctorName = (doctor) =>
  doctor?.name ||
  doctor?.doctorName ||
  [doctor?.firstName, doctor?.lastName].filter(Boolean).join(" ") ||
  "Doctor";

const getDepartmentName = (doctor, department) =>
  doctor?.department?.name ||
  doctor?.departmentName ||
  department?.name ||
  "Department";

const getConsultationFee = (doctor) =>
  Number(
    doctor?.consultationFee ??
      doctor?.fee ??
      doctor?.consultation_fee ??
      doctor?.fees ??
      0
  ) || 0;

const getPatientName = (patient) =>
  patient?.name ||
  [patient?.firstName, patient?.lastName].filter(Boolean).join(" ") ||
  "";

const getPatientPhone = (patient) =>
  patient?.phone ||
  patient?.phoneNumber ||
  patient?.mobile ||
  patient?.contact ||
  "";

const getPatientDob = (patient) =>
  patient?.dateOfBirth || patient?.dob || "";

export default function AppointmentDetailsPage() {
  const router = useRouter();

  const [doctor, setDoctor] = useState(null);
  const [department, setDepartment] = useState(null);
  const [patient, setPatient] = useState(null);

  const [appointmentDate, setAppointmentDate] = useState("");
  const [visitType, setVisitType] = useState("hospital");
  const [selectedSlot, setSelectedSlot] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [doctorImageCandidates, setDoctorImageCandidates] = useState([]);
  const [doctorImageIndex, setDoctorImageIndex] = useState(0);

  const today = useMemo(() => {
    const date = new Date();

    date.setHours(0, 0, 0, 0);

    return date;
  }, []);

  const upcomingDates = useMemo(() => {
    const dates = [];

    for (let index = 0; index < 14; index += 1) {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      dates.push(date);
    }

    return dates;
  }, [today]);

  useEffect(() => {
    try {
      const storedDoctor = sessionStorage.getItem("selectedDoctor");
      const storedDepartment = sessionStorage.getItem("selectedDepartment");
      const storedDate = sessionStorage.getItem("selectedAppointmentDate");

      const storedPatient =
        sessionStorage.getItem("appointmentPatient") ||
        sessionStorage.getItem("patient") ||
        sessionStorage.getItem("loggedInPatient");

      const storedDetails = sessionStorage.getItem("appointmentDetails");

      if (storedDoctor) {
        setDoctor(JSON.parse(storedDoctor));
      }

      if (storedDepartment) {
        setDepartment(JSON.parse(storedDepartment));
      }

      if (storedPatient) {
        setPatient(JSON.parse(storedPatient));
      }

      if (storedDate) {
        setAppointmentDate(storedDate);
      }

      if (storedDetails) {
        const details = JSON.parse(storedDetails);

        if (!storedDate && details?.appointmentDate) {
          setAppointmentDate(details.appointmentDate);
        }

        if (details?.visitType) {
          setVisitType(details.visitType);
        }

        if (details?.selectedSlot || details?.timeSlot) {
          setSelectedSlot(details.selectedSlot || details.timeSlot);
        }

        if (!storedPatient && details?.patient) {
          setPatient(details.patient);
        }
      }

      setLoading(false);
    } catch {
      setError("Unable to load appointment details.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!doctor) return;

    const candidates = getDoctorImageCandidates(doctor);

    setDoctorImageCandidates(candidates);
    setDoctorImageIndex(0);
  }, [doctor]);

  useEffect(() => {
    if (!appointmentDate || !doctor) return;

    const date = parseStoredDate(appointmentDate);

    if (!date) {
      setSelectedSlot("");
      return;
    }

    const slots = getSlotsForMode(doctor, date, visitType);

    if (!slots.includes(selectedSlot)) {
      setSelectedSlot("");
    }
  }, [appointmentDate, doctor, visitType, selectedSlot]);

  const selectedDateObject = useMemo(
    () => parseStoredDate(appointmentDate),
    [appointmentDate]
  );

  const availableSlots = useMemo(() => {
    if (!doctor || !selectedDateObject) return [];

    return getSlotsForMode(
      doctor,
      selectedDateObject,
      visitType
    );
  }, [doctor, selectedDateObject, visitType]);

  const doctorImage = doctorImageCandidates[doctorImageIndex] || "";

  const patientName = getPatientName(patient);
  const patientEmail = patient?.email || "";
  const patientPhone = getPatientPhone(patient);
  const patientDob = getPatientDob(patient);

  const consultationFee = getConsultationFee(doctor);
  const serviceFee = 50;
  const totalAmount = consultationFee + serviceFee;

  const isDateSelected = Boolean(appointmentDate);
  const isSlotSelected = Boolean(selectedSlot);
  const canPay =
    Boolean(doctor) &&
    Boolean(patient) &&
    isDateSelected &&
    isSlotSelected &&
    Boolean(visitType) &&
    !saving;

  const handleDateChange = (date) => {
    const value = formatDateForStorage(date);

    setAppointmentDate(value);
    setSelectedSlot("");
    setError("");

    sessionStorage.setItem("selectedAppointmentDate", value);
  };

  const handleVisitTypeChange = (type) => {
    setVisitType(type);
    setSelectedSlot("");
    setError("");
  };

  const handleSlotChange = (slot) => {
    setSelectedSlot(slot);
    setError("");
  };

  const handlePay = async () => {
    if (!doctor) {
      setError("Doctor information is missing.");
      return;
    }

    if (!patient) {
      setError(
        "Patient information is missing. Please complete patient login first."
      );
      return;
    }

    if (!appointmentDate) {
      setError("Please select an appointment date.");
      return;
    }

    if (!selectedSlot) {
      setError("Please select a time slot.");
      return;
    }

    if (!visitType) {
      setError("Please select an appointment type.");
      return;
    }

    setSaving(true);
    setError("");

    const appointmentDetails = {
      doctor,
      department,
      patient,
      appointmentDate,
      date: appointmentDate,
      visitType,
      appointmentType: visitType,
      selectedSlot,
      timeSlot: selectedSlot,
      consultationFee,
      serviceFee,
      totalAmount,
      status: "pending_payment",
      createdAt: new Date().toISOString(),
    };

    try {
      sessionStorage.setItem(
        "appointmentDetails",
        JSON.stringify(appointmentDetails)
      );

      sessionStorage.setItem(
        "appointmentPatient",
        JSON.stringify(patient)
      );

      sessionStorage.setItem(
        "selectedAppointmentDate",
        appointmentDate
      );

      router.push("/appointment/checkout");
    } catch {
      setError("Unable to continue to payment.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <div className="h-5 w-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
          Loading appointment details...
        </div>
      </main>
    );
  }

  if (!doctor) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-700"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Stethoscope size={28} />
            </div>

            <h1 className="text-xl font-bold text-slate-900">
              Doctor information missing
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Please go back and select a doctor again.
            </p>

            <button
              type="button"
              onClick={() => router.push("/appointment")}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Select Doctor
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-12">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Yash Hospital
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Appointment Details
            </h1>
          </div>

          <div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex">
            <CheckCircle2 size={18} className="text-green-600" />
            Secure Booking
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-700"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                  {doctorImage ? (
                    <img
                      src={doctorImage}
                      alt={getDoctorName(doctor)}
                      className="h-full w-full object-cover"
                      onError={() => {
                        setDoctorImageIndex((current) => {
                          if (
                            current + 1 <
                            doctorImageCandidates.length
                          ) {
                            return current + 1;
                          }

                          return current;
                        });
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      <UserRound size={42} />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-600">
                    Doctor
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {getDoctorName(doctor)}
                  </h2>

                  <p className="mt-1 text-sm text-slate-600">
                    {doctor?.specialization ||
                      doctor?.speciality ||
                      "Medical Specialist"}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Stethoscope size={16} />
                      {getDepartmentName(doctor, department)}
                    </span>

                    {doctor?.experience && (
                      <span>
                        {doctor.experience} years experience
                      </span>
                    )}

                    {doctor?.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={16} />
                        {doctor.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-900">
                  Appointment Type
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Select how you want to consult the doctor.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(VISIT_TYPES).map(
                  ([type, config]) => {
                    const Icon = config.icon;
                    const active = visitType === type;

                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          handleVisitTypeChange(type)
                        }
                        className={`rounded-xl border p-4 text-left transition ${
                          active
                            ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                            : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                              active
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <Icon size={20} />
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900">
                              {config.label}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {type === "video"
                                ? "Consult online from anywhere"
                                : "Visit hospital clinic"}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-900">
                  Select Date
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Choose your preferred appointment date.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
                {upcomingDates.map((date) => {
                  const value = formatDateForStorage(date);
                  const active = appointmentDate === value;
                  const slots = getSlotsForMode(
                    doctor,
                    date,
                    visitType
                  );

                  return (
                    <button
                      key={value}
                      type="button"
                      disabled={slots.length === 0}
                      onClick={() => handleDateChange(date)}
                      className={`rounded-xl border p-3 text-center transition ${
                        active
                          ? "border-blue-600 bg-blue-600 text-white"
                          : slots.length
                            ? "border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50"
                            : "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                      }`}
                    >
                      <p className="text-xs font-medium">
                        {date.toLocaleDateString("en-IN", {
                          weekday: "short",
                        })}
                      </p>

                      <p className="mt-1 text-xl font-bold">
                        {date.getDate()}
                      </p>

                      <p className="text-xs">
                        {date.toLocaleDateString("en-IN", {
                          month: "short",
                        })}
                      </p>

                      <p
                        className={`mt-2 text-[10px] ${
                          active
                            ? "text-blue-100"
                            : slots.length
                              ? "text-green-600"
                              : "text-slate-300"
                        }`}
                      >
                        {slots.length
                          ? `${slots.length} slots`
                          : "Unavailable"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Select Time Slot
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {appointmentDate
                      ? `Available slots for ${formatDisplayDate(
                          appointmentDate
                        )}`
                      : "Select a date first."}
                  </p>
                </div>

                <Clock3 className="text-blue-600" size={22} />
              </div>

              {!appointmentDate ? (
                <div className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                  Please select an appointment date first.
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-8 text-center text-sm text-amber-700">
                  No slots are available for this date and appointment
                  type.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {availableSlots.map((slot) => {
                    const active = selectedSlot === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => handleSlotChange(slot)}
                        className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                          active
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50"
                        }`}
                      >
                        {formatTime(slot)}
                      </button>
                    );
                  })}
                </div>
              )}

              {selectedSlot && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                  <CheckCircle2 size={18} />
                  Selected: {formatTime(selectedSlot)}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <UserRound size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Patient Details
                  </h2>
                  <p className="text-sm text-slate-500">
                    Details from your patient profile
                  </p>
                </div>
              </div>

              {patient ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Name
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {patientName || "Not available"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Email
                    </p>
                    <p className="mt-1 font-semibold text-slate-900 break-all">
                      {patientEmail || "Not available"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Phone
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {patientPhone || "Not available"}
                    </p>
                  </div>

                  {patientDob && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Date of Birth
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {patientDob}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-700">
                  Patient profile information is not available in this
                  booking session. Please go back and complete patient
                  login/profile first.
                </div>
              )}
            </div>
          </section>

          <aside className="lg:sticky lg:top-6 lg:h-fit">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-5">
                <h2 className="text-lg font-bold text-slate-900">
                  Booking Summary
                </h2>
              </div>

              <div className="space-y-5 p-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Doctor
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {getDoctorName(doctor)}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {getDepartmentName(doctor, department)}
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarDays
                    size={19}
                    className="mt-0.5 text-blue-600"
                  />
                  <div>
                    <p className="text-xs text-slate-400">Date</p>
                    <p className="font-semibold text-slate-900">
                      {appointmentDate
                        ? formatDisplayDate(appointmentDate)
                        : "Not selected"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock3
                    size={19}
                    className="mt-0.5 text-blue-600"
                  />
                  <div>
                    <p className="text-xs text-slate-400">Time</p>
                    <p className="font-semibold text-slate-900">
                      {selectedSlot
                        ? formatTime(selectedSlot)
                        : "Not selected"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  {visitType === "video" ? (
                    <Video
                      size={19}
                      className="mt-0.5 text-blue-600"
                    />
                  ) : (
                    <Stethoscope
                      size={19}
                      className="mt-0.5 text-blue-600"
                    />
                  )}

                  <div>
                    <p className="text-xs text-slate-400">
                      Appointment Type
                    </p>
                    <p className="font-semibold text-slate-900">
                      {VISIT_TYPES[visitType]?.label}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      Consultation Fee
                    </span>
                    <span className="font-medium text-slate-900">
                      ₹{consultationFee.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      Service Fee
                    </span>
                    <span className="font-medium text-slate-900">
                      ₹{serviceFee.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                    <span className="font-bold text-slate-900">
                      Total
                    </span>
                    <span className="text-xl font-bold text-blue-600">
                      ₹{totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-blue-50 p-3 text-xs leading-5 text-blue-700">
                  {isDateSelected && isSlotSelected
                    ? "Date and time slot selected. You can continue to payment."
                    : "Select both date and time slot to continue to payment."}
                </div>

                {isDateSelected && isSlotSelected && (
                  <button
                    type="button"
                    disabled={!canPay}
                    onClick={handlePay}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    <CreditCard size={19} />
                    {saving
                      ? "Preparing Payment..."
                      : "Continue to Payment"}
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
