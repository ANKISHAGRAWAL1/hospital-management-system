"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Video,
  Building2,
  Stethoscope,
  UserRound,
  IndianRupee,
  CreditCard,
  ShieldCheck,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Phone,
  Mail,
  MapPin,
  Copy,
  ChevronRight,
} from "lucide-react";

import {
  getPatientAppointmentById,
  cancelPatientAppointment,
} from "@/app/components/utils/Api-call/patient-api";

import { notify } from "@/app/components/healper";

const SERVER_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(
    /\/api\/?$/,
    ""
  ) || "http://localhost:5000";

const getDoctorImage = (image) => {
  if (!image) return "";

  const cleanImage = String(image).trim();

  if (
    cleanImage.startsWith("http://") ||
    cleanImage.startsWith("https://") ||
    cleanImage.startsWith("data:")
  ) {
    return cleanImage;
  }

  return `${SERVER_URL}/${cleanImage.replace(/^\/+/, "")}`;
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (time) => {
  if (!time) return "—";

  const value = String(time).trim();

  if (/am|pm/i.test(value)) return value;

  const [hours, minutes] = value.split(":");

  if (!hours || !minutes) return value;

  const hour = Number(hours);

  if (Number.isNaN(hour)) return value;

  const suffix = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;

  return `${formattedHour}:${minutes} ${suffix}`;
};

const formatAmount = (amount) =>
  Number(amount || 0).toLocaleString("en-IN");

const getStatus = (status) => {
  const value = String(status || "").toLowerCase();

  if (value === "confirmed") {
    return {
      label: "Confirmed",
      className:
        "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
      icon: CheckCircle2,
    };
  }

  if (value === "completed") {
    return {
      label: "Completed",
      className:
        "bg-blue-50 text-blue-700 ring-blue-600/10",
      icon: CheckCircle2,
    };
  }

  if (value === "cancelled") {
    return {
      label: "Cancelled",
      className:
        "bg-red-50 text-red-700 ring-red-600/10",
      icon: AlertCircle,
    };
  }

  if (value === "no-show") {
    return {
      label: "No Show",
      className:
        "bg-orange-50 text-orange-700 ring-orange-600/10",
      icon: AlertCircle,
    };
  }

  return {
    label: status || "Pending",
    className:
      "bg-amber-50 text-amber-700 ring-amber-600/10",
    icon: AlertCircle,
  };
};

const getPaymentStatus = (status) => {
  const value = String(status || "").toLowerCase();

  if (value === "paid") {
    return {
      label: "Paid",
      className: "bg-emerald-50 text-emerald-700",
    };
  }

  if (value === "refunded") {
    return {
      label: "Refunded",
      className: "bg-purple-50 text-purple-700",
    };
  }

  if (value === "failed") {
    return {
      label: "Failed",
      className: "bg-red-50 text-red-700",
    };
  }

  if (value === "pending") {
    return {
      label: "Pending",
      className: "bg-amber-50 text-amber-700",
    };
  }

  return {
    label: status || "Unpaid",
    className: "bg-slate-100 text-slate-600",
  };
};

const getDoctorName = (doctor) => {
  if (!doctor) return "Doctor";

  if (doctor.name) return doctor.name;

  return (
    [doctor.firstName, doctor.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() || "Doctor"
  );
};

const getDepartmentName = (department) => {
  if (!department) return "Department";

  return department.name || department.title || "Department";
};

const DetailItem = ({
  icon: Icon,
  label,
  value,
  accent = "teal",
}) => {
  const iconClasses = {
    teal: "bg-teal-50 text-teal-700",
    blue: "bg-blue-50 text-blue-700",
    violet: "bg-violet-50 text-violet-700",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="flex gap-3">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          iconClasses[accent]
        }`}
      >
        <Icon size={18} strokeWidth={1.8} />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-sm font-semibold leading-5 text-slate-800">
          {value || "—"}
        </p>
      </div>
    </div>
  );
};

export default function AppointmentDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const appointmentId = params?.appointmentId;

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadAppointment = async () => {
      if (!appointmentId) return;

      try {
        setLoading(true);

        const response =
          await getPatientAppointmentById(appointmentId);

        const data =
          response?.appointment ||
          response?.data?.appointment ||
          response?.data ||
          null;

        setAppointment(data);
      } catch (error) {
        console.error(
          "Get Patient Appointment Error:",
          error
        );

        notify(
          error?.message ||
            "Failed to load appointment details",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    loadAppointment();
  }, [appointmentId]);

  const doctor = appointment?.doctor;
  const department = appointment?.department;

  const doctorName = useMemo(
    () => getDoctorName(doctor),
    [doctor]
  );

  const departmentName = useMemo(
    () => getDepartmentName(department),
    [department]
  );

  const doctorImage = useMemo(
    () => getDoctorImage(doctor?.profileImage),
    [doctor?.profileImage]
  );

  const appointmentType =
    String(
      appointment?.appointmentType ||
        appointment?.visitType ||
        ""
    ).toLowerCase() === "video"
      ? "Video Consultation"
      : "Hospital Visit";

  const status = getStatus(appointment?.status);
  const StatusIcon = status.icon;

  const paymentStatus = getPaymentStatus(
    appointment?.paymentStatus
  );

  const consultationFee = Number(
    appointment?.consultationFee ??
      doctor?.consultationFee ??
      0
  );

  const serviceFee = 50;
  const totalAmount = consultationFee + serviceFee;

  const appointmentStatus = String(
    appointment?.status || ""
  ).toLowerCase();

  const canCancel =
    appointmentStatus !== "cancelled" &&
    appointmentStatus !== "completed" &&
    appointmentStatus !== "no-show";

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(
        appointment?._id || appointmentId
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      notify("Unable to copy appointment ID", "error");
    }
  };

  const handleCancel = async () => {
    if (!appointmentId) return;

    try {
      setCancelLoading(true);

      const response =
        await cancelPatientAppointment(
          appointmentId,
          cancellationReason.trim()
        );

      const updatedAppointment =
        response?.appointment ||
        response?.data?.appointment ||
        null;

      setAppointment((previous) => ({
        ...previous,
        ...(updatedAppointment || {}),
        status: updatedAppointment?.status || "cancelled",
        cancellationReason:
          updatedAppointment?.cancellationReason ||
          cancellationReason.trim(),
        cancelledAt:
          updatedAppointment?.cancelledAt ||
          new Date().toISOString(),
      }));

      setShowCancelModal(false);
      setCancellationReason("");

      notify(
        response?.message ||
          "Appointment cancelled successfully",
        "success"
      );
    } catch (error) {
      console.error(
        "Cancel Appointment Error:",
        error
      );

      notify(
        error?.message ||
          "Failed to cancel appointment",
        "error"
      );
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f9fb]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />

          <div className="mt-8 h-52 animate-pulse rounded-3xl bg-white" />

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <div className="h-72 animate-pulse rounded-2xl bg-white" />
              <div className="h-52 animate-pulse rounded-2xl bg-white" />
            </div>

            <div className="h-[420px] animate-pulse rounded-2xl bg-white" />
          </div>
        </div>
      </main>
    );
  }

  if (!appointment) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f9fb] px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <AlertCircle
              size={28}
              className="text-red-500"
            />
          </div>

          <h1 className="mt-5 text-xl font-bold text-slate-900">
            Appointment not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            This appointment may have been removed or
            the appointment ID is invalid.
          </p>

          <button
            type="button"
            onClick={() =>
              router.push("/patient/appointments")
            }
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0f766e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b625b]"
          >
            <ArrowLeft size={17} />
            My Appointments
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9fb]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              router.push("/patient/appointments")
            }
            className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#0f766e]"
          >
            <ArrowLeft
              size={17}
              className="transition group-hover:-translate-x-0.5"
            />
            My Appointments
          </button>

          <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
            Appointment
            <ChevronRight size={13} />
            Details
          </div>
        </div>

        <section className="relative mt-7 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
          <div className="absolute inset-x-0 top-0 h-1 bg-[#0f766e]" />

          <div className="p-5 sm:p-7 lg:p-8">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-24 sm:w-24">
                  {doctorImage ? (
                    <img
                      src={doctorImage}
                      alt={doctorName}
                      className="h-full w-full object-cover object-top"
                      onError={(e) => {
                        e.currentTarget.style.display =
                          "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <UserRound
                        size={42}
                        strokeWidth={1.2}
                        className="text-slate-300"
                      />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0f766e]">
                    Appointment Details
                  </p>

                  <h1 className="mt-1 truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    {doctorName}
                  </h1>

                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {doctor?.specialization?.length
                      ? Array.isArray(
                          doctor.specialization
                        )
                        ? doctor.specialization.join(
                            " • "
                          )
                        : doctor.specialization
                      : "Medical Specialist"}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Stethoscope size={14} />
                      {departmentName}
                    </span>

                    <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

                    <span>
                      {appointmentType}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${status.className}`}
                >
                  <StatusIcon size={14} />
                  {status.label}
                </span>

                <button
                  type="button"
                  onClick={handleCopyId}
                  className="group inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 transition hover:border-slate-300 hover:bg-white"
                >
                  <span className="max-w-[190px] truncate">
                    ID:{" "}
                    {appointment?._id ||
                      appointmentId}
                  </span>

                  <Copy
                    size={13}
                    className="text-slate-400 group-hover:text-[#0f766e]"
                  />

                  {copied && (
                    <span className="font-semibold text-[#0f766e]">
                      Copied
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-8 grid overflow-hidden rounded-2xl border border-slate-200 sm:grid-cols-3">
              <div className="border-b border-slate-200 p-4 sm:border-b-0 sm:border-r">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#0f766e]">
                    <CalendarDays size={19} />
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Date
                    </p>

                    <p className="mt-0.5 text-sm font-bold text-slate-800">
                      {formatDate(
                        appointment.appointmentDate
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b border-slate-200 p-4 sm:border-b-0 sm:border-r">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Clock3 size={19} />
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Time
                    </p>

                    <p className="mt-0.5 text-sm font-bold text-slate-800">
                      {formatTime(
                        appointment.startTime
                      )}{" "}
                      –{" "}
                      {formatTime(
                        appointment.endTime
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                    {appointmentType ===
                    "Video Consultation" ? (
                      <Video size={19} />
                    ) : (
                      <Building2 size={19} />
                    )}
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Visit Type
                    </p>

                    <p className="mt-0.5 text-sm font-bold text-slate-800">
                      {appointmentType}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.035)]">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Appointment Information
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Details for your scheduled visit
                  </p>
                </div>
              </div>

              <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
                <DetailItem
                  icon={CalendarDays}
                  label="Appointment Date"
                  value={formatDate(
                    appointment.appointmentDate
                  )}
                />

                <DetailItem
                  icon={Clock3}
                  label="Appointment Time"
                  value={`${formatTime(
                    appointment.startTime
                  )} – ${formatTime(
                    appointment.endTime
                  )}`}
                  accent="blue"
                />

                <DetailItem
                  icon={Stethoscope}
                  label="Department"
                  value={departmentName}
                  accent="violet"
                />

                <DetailItem
                  icon={
                    appointmentType ===
                    "Video Consultation"
                      ? Video
                      : Building2
                  }
                  label="Appointment Type"
                  value={appointmentType}
                  accent="slate"
                />
              </div>
            </section>

            {appointment.reason && (
              <section className="rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.035)]">
                <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-[#0f766e]">
                      <FileText size={17} />
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Reason for Visit
                      </h2>

                      <p className="text-xs text-slate-400">
                        Information provided during
                        booking
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-5 sm:px-6">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                    {appointment.reason}
                  </p>
                </div>
              </section>
            )}

            {appointmentType ===
              "Hospital Visit" && (
              <section className="rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.035)]">
                <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                      <MapPin size={17} />
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Visit Location
                      </h2>

                      <p className="text-xs text-slate-400">
                        Please arrive before your
                        appointment time
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 px-5 py-5 sm:px-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Building2 size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Yash Hospital
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Please visit the hospital reception
                      and provide your appointment details.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {appointmentType ===
              "Video Consultation" && (
              <section className="overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.035)]">
                <div className="bg-indigo-50/60 px-5 py-5 sm:px-6">
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                      <Video size={20} />
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Video Consultation
                      </h2>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        Your online consultation will be
                        available around the scheduled
                        appointment time.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {(doctor?.phone ||
              doctor?.email ||
              doctor?.address) && (
              <section className="rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.035)]">
                <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                  <h2 className="text-base font-bold text-slate-900">
                    Doctor Contact
                  </h2>
                </div>

                <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
                  {doctor?.phone && (
                    <DetailItem
                      icon={Phone}
                      label="Phone"
                      value={doctor.phone}
                      accent="teal"
                    />
                  )}

                  {doctor?.email && (
                    <DetailItem
                      icon={Mail}
                      label="Email"
                      value={doctor.email}
                      accent="blue"
                    />
                  )}

                  {doctor?.address && (
                    <div className="flex gap-3 sm:col-span-2">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                        <MapPin size={18} />
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                          Address
                        </p>

                        <p className="mt-1 text-sm font-semibold leading-6 text-slate-800">
                          {typeof doctor.address ===
                          "string"
                            ? doctor.address
                            : [
                                doctor.address?.address,
                                doctor.address?.city,
                                doctor.address?.state,
                                doctor.address?.pincode,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
              <div className="border-b border-slate-100 px-5 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Payment Summary
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Appointment charges
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-[#0f766e]">
                    <CreditCard size={17} />
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      Consultation fee
                    </span>

                    <span className="text-sm font-semibold text-slate-800">
                      ₹{formatAmount(consultationFee)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      Service fee
                    </span>

                    <span className="text-sm font-semibold text-slate-800">
                      ₹{formatAmount(serviceFee)}
                    </span>
                  </div>

                  <div className="border-t border-dashed border-slate-200 pt-4">
                    <div className="flex items-end justify-between">
                      <span className="text-sm font-bold text-slate-800">
                        Total
                      </span>

                      <span className="flex items-center gap-0.5 text-2xl font-bold tracking-tight text-[#0f766e]">
                        <IndianRupee size={19} />
                        {formatAmount(totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck
                      size={16}
                      className="text-slate-500"
                    />

                    <span className="text-xs font-semibold text-slate-600">
                      Payment status
                    </span>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${paymentStatus.className}`}
                  >
                    {paymentStatus.label}
                  </span>
                </div>

                {appointment.paymentId && (
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-slate-400">
                        Payment ID
                      </span>

                      <span className="max-w-[180px] truncate text-xs font-medium text-slate-600">
                        {appointment.paymentId}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {canCancel && (
              <button
                type="button"
                onClick={() =>
                  setShowCancelModal(true)
                }
                className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                Cancel Appointment
              </button>
            )}

            {!canCancel && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex gap-3">
                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-[#0f766e]"
                  />

                  <p className="text-xs leading-5 text-slate-500">
                    This appointment can no longer be
                    cancelled because its status is{" "}
                    <span className="font-semibold text-slate-700">
                      {status.label.toLowerCase()}
                    </span>
                    .
                  </p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                router.push("/patient/appointments")
              }
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              View All Appointments
              <ChevronRight size={16} />
            </button>
          </aside>
        </div>
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[3px]">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Cancel appointment?
                </h2>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                  This action will cancel your scheduled
                  appointment.
                </p>
              </div>

              <button
                type="button"
                disabled={cancelLoading}
                onClick={() =>
                  setShowCancelModal(false)
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Reason
                <span className="ml-1 font-normal text-slate-400">
                  Optional
                </span>
              </label>

              <textarea
                value={cancellationReason}
                onChange={(e) =>
                  setCancellationReason(
                    e.target.value
                  )
                }
                disabled={cancelLoading}
                rows={4}
                placeholder="Tell us why you are cancelling..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0f766e] focus:bg-white focus:ring-4 focus:ring-teal-50"
              />

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  disabled={cancelLoading}
                  onClick={() =>
                    setShowCancelModal(false)
                  }
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Keep Appointment
                </button>

                <button
                  type="button"
                  disabled={cancelLoading}
                  onClick={handleCancel}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {cancelLoading ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                      Cancelling
                    </>
                  ) : (
                    "Cancel Appointment"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}