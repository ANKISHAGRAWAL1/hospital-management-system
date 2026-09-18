 
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  CalendarDays,
  Clock3,
  UserRound,
  Stethoscope,
  Building2,
  CreditCard,
  IndianRupee,
  Video,
  MapPin,
  ArrowRight,
  Home,
  Download,
  Loader2,
  ShieldCheck,
} from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export default function AppointmentConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const appointmentId = searchParams.get("appointment");

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!appointmentId) {
      setLoading(false);
      setError("Appointment information is missing.");
      return;
    }

    const loadAppointment = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/appointments/${appointmentId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data?.success) {
          throw new Error(
            data?.message || "Unable to load appointment details."
          );
        }

        setAppointment(data.appointment);
      } catch (err) {
        setError(
          err?.message || "Unable to load appointment details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAppointment();
  }, [appointmentId]);

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "—";

    const [hours, minutes] = String(time).split(":");

    if (hours === undefined || minutes === undefined) {
      return time;
    }

    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getPatientName = () => {
    if (!appointment?.patient) return "Patient";

    if (typeof appointment.patient === "string") {
      return "Patient";
    }

    return (
      appointment.patient.name ||
      appointment.patient.fullName ||
      `${appointment.patient.firstName || ""} ${
        appointment.patient.lastName || ""
      }`.trim() ||
      "Patient"
    );
  };

  const getDoctorName = () => {
    if (!appointment?.doctor) return "Doctor";

    if (typeof appointment.doctor === "string") {
      return "Doctor";
    }

    return (
      appointment.doctor.name ||
      appointment.doctor.fullName ||
      `${appointment.doctor.firstName || ""} ${
        appointment.doctor.lastName || ""
      }`.trim() ||
      "Doctor"
    );
  };

  const getDepartmentName = () => {
    if (!appointment?.department) return "Department";

    if (typeof appointment.department === "string") {
      return appointment.department;
    }

    return (
      appointment.department.name ||
      appointment.department.departmentName ||
      "Department"
    );
  };

  const appointmentType =
    appointment?.appointmentType?.toLowerCase() === "video"
      ? "Video Consultation"
      : "Hospital Visit";

  const isVideo = appointmentType === "Video Consultation";

  const paymentStatus =
    appointment?.paymentStatus ||
    appointment?.payment?.status ||
    "paid";

  const amount =
    appointment?.amount ??
    appointment?.payment?.amount ??
    appointment?.totalAmount ??
    0;

  const handlePrint = () => {
    window.print();
  };

  const handleHome = () => {
    router.push("/");
  };

  const handleAppointments = () => {
    router.push("/patient/appointments");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-sm p-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-teal-50">
            <Loader2 className="h-7 w-7 text-teal-600 animate-spin" />
          </div>

          <h1 className="text-xl font-semibold text-slate-900">
            Loading Appointment
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Please wait while we retrieve your appointment details.
          </p>
        </div>
      </main>
    );
  }

  if (error || !appointment) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-sm p-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <CheckCircle2 className="h-8 w-8 text-red-500" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Appointment Not Found
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {error ||
              "We could not find the appointment associated with this confirmation link."}
          </p>

          <button
            type="button"
            onClick={handleHome}
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 print:bg-white">
      <header className="border-b border-slate-200 bg-white print:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={handleHome}
            className="text-xl font-bold tracking-tight text-teal-700"
          >
            Yash Hospital
          </button>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 sm:text-sm">
            <ShieldCheck className="h-4 w-4 text-teal-600" />
            Secure Appointment
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-gradient-to-b from-teal-50 to-white px-5 py-9 text-center sm:px-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-teal-100">
              <CheckCircle2 className="h-11 w-11 text-teal-600" />
            </div>

            <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-teal-700">
              Payment Successful
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Appointment Confirmed
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Your appointment has been successfully confirmed. Please keep
              your appointment details for future reference.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
              <span className="text-slate-500">Appointment ID:</span>
              <span className="text-teal-700">
                {appointment._id || appointment.id || appointmentId}
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200">
                    <UserRound className="h-5 w-5 text-teal-600" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Patient
                    </p>
                    <p className="mt-1 truncate text-base font-semibold text-slate-900">
                      {getPatientName()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200">
                    <Stethoscope className="h-5 w-5 text-teal-600" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Doctor
                    </p>
                    <p className="mt-1 truncate text-base font-semibold text-slate-900">
                      {getDoctorName()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200">
                    <Building2 className="h-5 w-5 text-teal-600" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Department
                    </p>
                    <p className="mt-1 truncate text-base font-semibold text-slate-900">
                      {getDepartmentName()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200">
                    {isVideo ? (
                      <Video className="h-5 w-5 text-teal-600" />
                    ) : (
                      <MapPin className="h-5 w-5 text-teal-600" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Appointment Type
                    </p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      {appointmentType}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200">
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-base font-bold text-slate-900">
                  Appointment Details
                </h2>
              </div>

              <div className="divide-y divide-slate-100">
                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-teal-600" />
                    <span className="text-sm text-slate-600">
                      Appointment Date
                    </span>
                  </div>

                  <span className="text-right text-sm font-semibold text-slate-900">
                    {formatDate(appointment.appointmentDate)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Clock3 className="h-5 w-5 text-teal-600" />
                    <span className="text-sm text-slate-600">
                      Appointment Time
                    </span>
                  </div>

                  <span className="text-right text-sm font-semibold text-slate-900">
                    {formatTime(appointment.startTime)} -{" "}
                    {formatTime(appointment.endTime)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-teal-600" />
                    <span className="text-sm text-slate-600">
                      Payment Status
                    </span>
                  </div>

                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                    {paymentStatus}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <IndianRupee className="h-5 w-5 text-teal-600" />
                    <span className="text-sm text-slate-600">
                      Amount Paid
                    </span>
                  </div>

                  <span className="text-right text-base font-bold text-slate-900">
                    ₹{Number(amount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {appointment.reason && (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Appointment Reason
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {appointment.reason}
                </p>
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50 p-5">
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Important Information
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Please arrive at the hospital a few minutes before your
                    scheduled appointment time. For video consultations, use
                    the consultation instructions provided by the hospital.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center print:hidden">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Download className="h-4 w-4" />
                Print / Save
              </button>

              <button
                type="button"
                onClick={handleAppointments}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                My Appointments
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={handleHome}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-5 py-3 text-sm font-semibold text-teal-700 transition hover:bg-teal-100"
              >
                <Home className="h-4 w-4" />
                Home
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-slate-500 print:hidden">
          This confirmation is generated electronically by Yash Hospital.
          Please keep your Appointment ID for future reference.
        </p>
      </section>
    </main>
  );
}
 
