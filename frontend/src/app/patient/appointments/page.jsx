"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock3,
  Video,
  Building2,
  Stethoscope,
  Search,
  ChevronRight,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  CalendarCheck2,
  IndianRupee,
  MapPin,
  ArrowUpRight,
  RefreshCw,
  SlidersHorizontal,
  CalendarClock,
} from "lucide-react";

import {
  getPatientAppointments,
  cancelPatientAppointment,
} from "@/app/components/utils/Api-call/patient-api";

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

const statusConfig = {
  pending: {
    label: "Pending",
    icon: AlertCircle,
    className: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-500",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-blue-50 text-blue-700 ring-blue-200",
    dot: "bg-blue-500",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-red-50 text-red-700 ring-red-200",
    dot: "bg-red-500",
  },
  "no-show": {
    label: "No Show",
    icon: XCircle,
    className: "bg-slate-100 text-slate-600 ring-slate-200",
    dot: "bg-slate-500",
  },
};

export default function PatientAppointmentsPage() {
  const router = useRouter();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [status, setStatus] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const loadAppointments = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const response = await getPatientAppointments({
        ...(status ? { status } : {}),
        ...(appointmentType ? { appointmentType } : {}),
      });

      const list =
        response?.appointments ||
        response?.data?.appointments ||
        response?.data ||
        [];

      setAppointments(Array.isArray(list) ? list : []);
    } catch (error) {
      setError(
        error.message || "Unable to load appointments"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [status, appointmentType]);

  const filteredAppointments = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return appointments;

    return appointments.filter((appointment) => {
      const doctorName =
        `${appointment.doctor?.firstName || ""} ${
          appointment.doctor?.lastName || ""
        }`.toLowerCase();

      const department =
        appointment.department?.name?.toLowerCase() || "";

      const specialization = Array.isArray(
        appointment.doctor?.specialization
      )
        ? appointment.doctor.specialization
            .join(" ")
            .toLowerCase()
        : String(
            appointment.doctor?.specialization || ""
          ).toLowerCase();

      return (
        doctorName.includes(value) ||
        department.includes(value) ||
        specialization.includes(value)
      );
    });
  }, [appointments, search]);

  const stats = useMemo(
    () => ({
      total: appointments.length,
      upcoming: appointments.filter((item) =>
        ["pending", "confirmed"].includes(item.status)
      ).length,
      completed: appointments.filter(
        (item) => item.status === "completed"
      ).length,
      cancelled: appointments.filter((item) =>
        ["cancelled", "no-show"].includes(item.status)
      ).length,
    }),
    [appointments]
  );

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "-";

    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();

    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDoctorName = (appointment) => {
    if (!appointment?.doctor) return "Doctor";

    return (
      `${appointment.doctor.firstName || ""} ${
        appointment.doctor.lastName || ""
      }`.trim() || "Doctor"
    );
  };

  const getDoctorInitials = (appointment) => {
    const first =
      appointment?.doctor?.firstName?.charAt(0) || "D";

    const last =
      appointment?.doctor?.lastName?.charAt(0) || "R";

    return `${first}${last}`.toUpperCase();
  };

  const getSpecialization = (appointment) => {
    const specialization =
      appointment?.doctor?.specialization;

    if (Array.isArray(specialization)) {
      return specialization[0] || "Medical Specialist";
    }

    return specialization || "Medical Specialist";
  };

  const getStatus = (value) =>
    statusConfig[value] || {
      label: value || "Unknown",
      icon: AlertCircle,
      className:
        "bg-slate-100 text-slate-600 ring-slate-200",
      dot: "bg-slate-500",
    };

  const canCancel = (appointment) =>
    ["pending", "confirmed"].includes(appointment.status);

  const openCancelModal = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelReason("");
    setCancelModal(true);
  };

  const closeCancelModal = () => {
    if (cancelling) return;

    setCancelModal(false);
    setSelectedAppointment(null);
    setCancelReason("");
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointment?._id) return;

    try {
      setCancelling(true);
      setError("");

      await cancelPatientAppointment(
        selectedAppointment._id,
        cancelReason.trim()
      );

      setCancelModal(false);
      setSelectedAppointment(null);
      setCancelReason("");

      await loadAppointments(false);
    } catch (error) {
      setError(
        error.message || "Unable to cancel appointment"
      );
    } finally {
      setCancelling(false);
    }
  };

  const clearFilters = () => {
    setStatus("");
    setAppointmentType("");
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-[#f6f9fb]">
      <div className="mx-auto max-w-[1380px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-6">
          <div className="flex flex-col gap-5 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:flex-row lg:items-end lg:justify-between lg:p-8">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-teal-700">
                <CalendarCheck2 size={15} />
                Patient Portal
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                My Appointments
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                View and manage your upcoming consultations
                and appointment history.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => loadAppointments(false)}
                disabled={refreshing}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 disabled:opacity-60"
              >
                <RefreshCw
                  size={17}
                  className={
                    refreshing ? "animate-spin" : ""
                  }
                />
                Refresh
              </button>

              <button
                onClick={() =>
                  router.push(
                    "/patient/book-appointment"
                  )
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 text-sm font-bold text-white transition hover:bg-teal-800"
              >
                <CalendarDays size={17} />
                <span className="hidden sm:inline">
                  Book Appointment
                </span>
                <span className="sm:hidden">Book</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <SummaryCard
            icon={CalendarDays}
            label="Total Appointments"
            value={stats.total}
          />

          <SummaryCard
            icon={CalendarClock}
            label="Upcoming"
            value={stats.upcoming}
            highlight
          />

          <SummaryCard
            icon={CheckCircle2}
            label="Completed"
            value={stats.completed}
          />

          <SummaryCard
            icon={XCircle}
            label="Cancelled"
            value={stats.cancelled}
          />
        </div>

        <div className="mb-5 rounded-[22px] border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search doctor, department or specialization"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
              />
            </div>

            <button
              onClick={() =>
                setShowFilters(!showFilters)
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 lg:hidden"
            >
              <SlidersHorizontal size={17} />
              Filters
            </button>

            <div
              className={`${
                showFilters ? "flex" : "hidden"
              } flex-col gap-3 lg:flex lg:flex-row`}
            >
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="h-11 min-w-[150px] rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">
                  Confirmed
                </option>
                <option value="completed">
                  Completed
                </option>
                <option value="cancelled">
                  Cancelled
                </option>
                <option value="no-show">No Show</option>
              </select>

              <select
                value={appointmentType}
                onChange={(e) =>
                  setAppointmentType(e.target.value)
                }
                className="h-11 min-w-[175px] rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
              >
                <option value="">
                  All Appointment Types
                </option>
                <option value="hospital">
                  Hospital Visit
                </option>
                <option value="video">
                  Video Consultation
                </option>
              </select>

              {(status ||
                appointmentType ||
                search) && (
                <button
                  onClick={clearFilters}
                  className="h-11 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between px-1">
            <p className="text-xs font-semibold text-slate-400">
              Showing{" "}
              <span className="text-slate-700">
                {filteredAppointments.length}
              </span>{" "}
              appointment
              {filteredAppointments.length !== 1
                ? "s"
                : ""}
            </p>

            {(status || appointmentType) && (
              <span className="text-xs font-bold text-teal-700">
                Filters applied
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-medium text-red-700">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <span className="flex-1">{error}</span>

            <button
              onClick={() => setError("")}
              className="rounded-lg p-1 hover:bg-red-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {loading ? (
          <LoadingState />
        ) : filteredAppointments.length === 0 ? (
          <EmptyState
            hasFilters={
              Boolean(search) ||
              Boolean(status) ||
              Boolean(appointmentType)
            }
            onClear={clearFilters}
            onBook={() =>
              router.push(
                "/patient/book-appointment"
              )
            }
          />
        ) : (
          <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
            <div className="hidden border-b border-slate-100 bg-slate-50/80 px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 lg:grid lg:grid-cols-[2fr_1.1fr_1fr_1fr_130px] lg:items-center lg:gap-5">
              <span>Doctor</span>
              <span>Appointment</span>
              <span>Payment</span>
              <span>Status</span>
              <span></span>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredAppointments.map(
                (appointment) => (
                  <AppointmentRow
                    key={appointment._id}
                    appointment={appointment}
                    router={router}
                    onCancel={openCancelModal}
                    canCancel={canCancel(appointment)}
                    formatDate={formatDate}
                    formatTime={formatTime}
                    getDoctorName={getDoctorName}
                    getDoctorInitials={
                      getDoctorInitials
                    }
                    getSpecialization={
                      getSpecialization
                    }
                    getStatus={getStatus}
                  />
                )
              )}
            </div>
          </div>
        )}
      </div>

      {cancelModal && selectedAppointment && (
        <CancelModal
          appointment={selectedAppointment}
          reason={cancelReason}
          setReason={setCancelReason}
          cancelling={cancelling}
          onClose={closeCancelModal}
          onConfirm={handleCancelAppointment}
          formatDate={formatDate}
          formatTime={formatTime}
          getDoctorName={getDoctorName}
        />
      )}
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  highlight = false,
}) {
  return (
    <div
      className={`rounded-[20px] border p-4 shadow-sm sm:p-5 ${
        highlight
          ? "border-teal-200 bg-teal-50/70"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            highlight
              ? "bg-teal-100 text-teal-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          <Icon size={19} />
        </div>

        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-slate-400">
            {label}
          </p>

          <p className="mt-0.5 text-xl font-black text-slate-950">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function AppointmentRow({
  appointment,
  router,
  onCancel,
  canCancel,
  formatDate,
  formatTime,
  getDoctorName,
  getDoctorInitials,
  getSpecialization,
  getStatus,
}) {
  const isVideo =
    appointment.appointmentType === "video";

  const statusData = getStatus(appointment.status);
  const StatusIcon = statusData.icon;

  const image = getDoctorImage(
    appointment?.doctor?.profileImage
  );

  const consultationFee =
    Number(
      appointment.consultationFee ??
        appointment.doctor?.consultationFee ??
        0
    ) || 0;

  const paymentStatus =
    appointment.paymentStatus || "unpaid";

  return (
    <div className="group px-4 py-5 transition hover:bg-slate-50/70 sm:px-6">
      <div className="grid gap-5 lg:grid-cols-[2fr_1.1fr_1fr_1fr_130px] lg:items-center lg:gap-5">
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
            {image ? (
              <img
                src={image}
                alt={getDoctorName(appointment)}
                className="h-full w-full object-cover object-top"
                onError={(e) => {
                  e.currentTarget.style.display = "none";

                  if (
                    e.currentTarget.nextElementSibling
                  ) {
                    e.currentTarget.nextElementSibling.style.display =
                      "flex";
                  }
                }}
              />
            ) : null}

            <div
              style={{
                display: image ? "none" : "flex",
              }}
              className="h-full w-full items-center justify-center bg-teal-50 text-sm font-black text-teal-700"
            >
              {getDoctorInitials(appointment)}
            </div>

            {appointment.status === "confirmed" && (
              <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-sm font-black text-slate-950 sm:text-base">
                Dr. {getDoctorName(appointment)}
              </h2>

              <span className="hidden rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 sm:inline">
                {isVideo ? "VIDEO" : "VISIT"}
              </span>
            </div>

            <p className="mt-0.5 truncate text-xs font-semibold text-teal-700">
              {getSpecialization(appointment)}
            </p>

            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-medium text-slate-400">
              <span className="inline-flex items-center gap-1">
                <Stethoscope size={12} />
                {appointment.department?.name ||
                  "Medical Department"}
              </span>

              <span className="inline-flex items-center gap-1">
                {isVideo ? (
                  <Video size={12} />
                ) : (
                  <Building2 size={12} />
                )}
                {isVideo ? "Online" : "Hospital"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:max-w-sm lg:grid-cols-1">
          <div className="rounded-xl bg-slate-50 px-3 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Date
            </p>
            <p className="mt-0.5 text-xs font-black text-slate-800">
              {formatDate(appointment.appointmentDate)}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 px-3 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Time
            </p>
            <p className="mt-0.5 text-xs font-black text-slate-800">
              {formatTime(appointment.startTime)}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
            <IndianRupee size={13} />
            Payment
          </div>

          <p className="mt-1 text-sm font-black text-slate-800">
            {consultationFee > 0
              ? `₹${consultationFee}`
              : "—"}
          </p>

          <span
            className={`mt-1 inline-flex rounded-full px-2 py-1 text-[10px] font-bold ${
              paymentStatus === "paid"
                ? "bg-emerald-50 text-emerald-700"
                : paymentStatus === "pending"
                ? "bg-amber-50 text-amber-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {paymentStatus.charAt(0).toUpperCase() +
              paymentStatus.slice(1)}
          </span>
        </div>

        <div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-bold ring-1 ${statusData.className}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${statusData.dot}`}
            />
            <StatusIcon size={12} />
            {statusData.label}
          </span>
        </div>

        <div className="flex items-center gap-2 lg:justify-end">
          {canCancel && (
            <button
              onClick={() => onCancel(appointment)}
              className="rounded-xl border border-red-200 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
            >
              Cancel
            </button>
          )}

          <button
            onClick={() =>
              router.push(
                `/patient/appointments/${appointment._id}`
              )
            }
            className="inline-flex items-center justify-center gap-1 rounded-xl bg-slate-950 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-teal-700"
          >
            View
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
      <div className="divide-y divide-slate-100">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="animate-pulse px-5 py-5 sm:px-6"
          >
            <div className="flex gap-4">
              <div className="h-14 w-14 shrink-0 rounded-2xl bg-slate-200" />

              <div className="flex-1">
                <div className="h-4 w-48 rounded bg-slate-200" />
                <div className="mt-2 h-3 w-32 rounded bg-slate-100" />
                <div className="mt-3 h-8 w-full max-w-xl rounded-xl bg-slate-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({
  hasFilters,
  onClear,
  onBook,
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
        <CalendarDays size={30} />
      </div>

      <h2 className="mt-5 text-xl font-black text-slate-950">
        {hasFilters
          ? "No matching appointments"
          : "No appointments yet"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {hasFilters
          ? "Try changing your search or filters."
          : "Your appointment history will appear here once you book your first consultation."}
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {hasFilters && (
          <button
            onClick={onClear}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Clear Filters
          </button>
        )}

        <button
          onClick={onBook}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-800"
        >
          <CalendarDays size={16} />
          Book Appointment
        </button>
      </div>
    </div>
  );
}

function CancelModal({
  appointment,
  reason,
  setReason,
  cancelling,
  onClose,
  onConfirm,
  formatDate,
  formatTime,
  getDoctorName,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-[24px] bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
          <div>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <XCircle size={21} />
            </div>

            <h2 className="text-xl font-black text-slate-950">
              Cancel Appointment
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Are you sure you want to cancel this
              appointment?
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={cancelling}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-teal-50">
                {getDoctorImage(
                  appointment?.doctor?.profileImage
                ) ? (
                  <img
                    src={getDoctorImage(
                      appointment?.doctor?.profileImage
                    )}
                    alt={getDoctorName(appointment)}
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-black text-teal-700">
                    {getDoctorName(
                      appointment
                    )
                      .split(" ")
                      .map((name) => name.charAt(0))
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-black text-slate-900">
                  Dr. {getDoctorName(appointment)}
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {formatDate(
                    appointment.appointmentDate
                  )}{" "}
                  •{" "}
                  {formatTime(
                    appointment.startTime
                  )}
                </p>
              </div>
            </div>
          </div>

          <label className="mb-2 mt-5 block text-sm font-bold text-slate-700">
            Cancellation reason
            <span className="ml-1 font-normal text-slate-400">
              (optional)
            </span>
          </label>

          <textarea
            value={reason}
            onChange={(e) =>
              setReason(e.target.value)
            }
            maxLength={500}
            rows={4}
            placeholder="Tell us why you want to cancel..."
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
          />

          <div className="mt-1 text-right text-xs font-medium text-slate-400">
            {reason.length}/500
          </div>

          <div className="mt-5 flex flex-col-reverse gap-2.5 sm:flex-row">
            <button
              onClick={onClose}
              disabled={cancelling}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Keep Appointment
            </button>

            <button
              onClick={onConfirm}
              disabled={cancelling}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cancelling && (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              )}

              {cancelling
                ? "Cancelling..."
                : "Cancel Appointment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}