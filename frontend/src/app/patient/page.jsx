"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  MapPin,
  Pill,
  Plus,
  UserRound,
  Video,
  XCircle,
} from "lucide-react";

import { getPatientDashboard } from "@/app/components/utils/Api-call/patient-api";

const SERVER_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/?$/, "") ||
  "http://localhost:5000";

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

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) return "—";

  return value.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (time) => {
  if (!time) return "—";

  const parts = String(time).split(":");

  if (parts.length < 2) return time;

  const hour = Number(parts[0]);
  const minute = parts[1];

  if (Number.isNaN(hour)) return time;

  const suffix = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;

  return `${formattedHour}:${minute} ${suffix}`;
};

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return "—";

  const dob = new Date(dateOfBirth);
  const today = new Date();

  if (Number.isNaN(dob.getTime())) return "—";

  let age = today.getFullYear() - dob.getFullYear();

  const monthDifference = today.getMonth() - dob.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < dob.getDate())
  ) {
    age--;
  }

  return age >= 0 ? age : "—";
};

const getDoctorName = (doctor) => {
  if (!doctor) return "Doctor";

  const fullName = [doctor?.firstName, doctor?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (fullName) return fullName;

  return doctor?.name || "Doctor";
};

const getSpecialization = (doctor) => {
  if (!doctor) return "Medical Specialist";

  if (Array.isArray(doctor?.specialization)) {
    return doctor.specialization.length > 0
      ? doctor.specialization.join(", ")
      : "Medical Specialist";
  }

  return (
    doctor?.specialization ||
    doctor?.designation ||
    "Medical Specialist"
  );
};

const getAppointmentType = (appointment) => {
  const type = String(
    appointment?.appointmentType ||
      appointment?.visitType ||
      ""
  ).toLowerCase();

  return type === "video"
    ? "Video Consultation"
    : "Hospital Visit";
};

const getStatus = (appointment) => {
  const status = String(appointment?.status || "").toLowerCase();

  if (status === "confirmed") {
    return {
      label: "Confirmed",
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-700",
      icon: CheckCircle2,
    };
  }

  if (status === "completed") {
    return {
      label: "Completed",
      className:
        "border-blue-200 bg-blue-50 text-blue-700",
      icon: CheckCircle2,
    };
  }

  if (status === "cancelled") {
    return {
      label: "Cancelled",
      className:
        "border-red-200 bg-red-50 text-red-600",
      icon: XCircle,
    };
  }

  if (status === "no-show") {
    return {
      label: "No Show",
      className:
        "border-slate-200 bg-slate-100 text-slate-600",
      icon: XCircle,
    };
  }

  return {
    label: appointment?.status || "Pending",
    className:
      "border-amber-200 bg-amber-50 text-amber-700",
    icon: Clock3,
  };
};

const getAppointmentDateTime = (appointment) => {
  const date = appointment?.appointmentDate;

  if (!date) {
    return Number.MAX_SAFE_INTEGER;
  }

  const time = appointment?.startTime || "00:00";

  const value = new Date(`${date}T${time}`);

  if (Number.isNaN(value.getTime())) {
    return Number.MAX_SAFE_INTEGER;
  }

  return value.getTime();
};

export default function PatientPage() {
  const router = useRouter();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getPatientDashboard();

        if (!active) return;

        setDashboard(
          response?.data ||
            response ||
            {}
        );
      } catch (err) {
        if (!active) return;

        setError(
          err?.message ||
            "Unable to load dashboard."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const patient = useMemo(() => {
    return (
      dashboard?.patient ||
      dashboard?.user ||
      dashboard?.data?.patient ||
      {}
    );
  }, [dashboard]);

  const appointments = useMemo(() => {
    const data =
      dashboard?.appointments ||
      dashboard?.recentAppointments ||
      dashboard?.data?.appointments ||
      [];

    return Array.isArray(data) ? data : [];
  }, [dashboard]);

  const notifications = useMemo(() => {
    const data =
      dashboard?.notifications ||
      dashboard?.data?.notifications ||
      [];

    return Array.isArray(data) ? data : [];
  }, [dashboard]);

  const upcomingAppointment = useMemo(() => {
    const now = Date.now();

    const activeAppointments = appointments.filter(
      (appointment) => {
        const status = String(
          appointment?.status || ""
        ).toLowerCase();

        const appointmentTime =
          getAppointmentDateTime(
            appointment
          );

        return (
          (status === "confirmed" ||
            status === "pending") &&
          appointmentTime >= now
        );
      }
    );

    return (
      [...activeAppointments].sort(
        (a, b) =>
          getAppointmentDateTime(a) -
          getAppointmentDateTime(b)
      )[0] || null
    );
  }, [appointments]);

  const stats = useMemo(() => {
    const total =
      dashboard?.stats?.totalAppointments ??
      dashboard?.totalAppointments ??
      appointments.length;

    const upcoming =
      dashboard?.stats?.upcomingAppointments ??
      dashboard?.upcomingAppointments ??
      appointments.filter(
        (appointment) => {
          const status = String(
            appointment?.status || ""
          ).toLowerCase();

          return (
            status === "confirmed" ||
            status === "pending"
          );
        }
      ).length;

    const completed =
      dashboard?.stats?.completedAppointments ??
      dashboard?.completedAppointments ??
      appointments.filter(
        (appointment) =>
          String(
            appointment?.status || ""
          ).toLowerCase() === "completed"
      ).length;

    const cancelled =
      dashboard?.stats?.cancelledAppointments ??
      dashboard?.cancelledAppointments ??
      appointments.filter(
        (appointment) =>
          String(
            appointment?.status || ""
          ).toLowerCase() === "cancelled"
      ).length;

    const prescriptions =
      dashboard?.stats?.prescriptions ??
      dashboard?.stats?.prescriptionCount ??
      dashboard?.prescriptionsCount ??
      dashboard?.totalPrescriptions ??
      0;

    const reports =
      dashboard?.stats?.medicalReports ??
      dashboard?.stats?.medicalReportCount ??
      dashboard?.reportsCount ??
      dashboard?.totalReports ??
      0;

    return {
      total,
      upcoming,
      completed,
      cancelled,
      prescriptions,
      reports,
    };
  }, [dashboard, appointments]);

  const recentAppointments = useMemo(() => {
    return appointments
      .slice()
      .sort(
        (a, b) =>
          getAppointmentDateTime(b) -
          getAppointmentDateTime(a)
      )
      .slice(0, 4);
  }, [appointments]);

  const patientName =
    patient?.name ||
    [patient?.firstName, patient?.lastName]
      .filter(Boolean)
      .join(" ") ||
    "Patient";

  const patientId =
    patient?.patientId ||
    patient?.patientID ||
    patient?.registrationId ||
    patient?.userId ||
    patient?._id ||
    "—";

  const bloodGroup =
    patient?.bloodGroup ||
    patient?.blood_group ||
    patient?.bloodType ||
    "—";

  const age = calculateAge(
    patient?.dateOfBirth ||
      patient?.dob
  );

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#f7f9fb]">
        <div className="flex flex-col items-center">
          <Loader2
            size={28}
            className="animate-spin text-[#075db5]"
          />

          <p className="mt-3 text-sm text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#f7f9fb] p-6">
        <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <XCircle
              size={25}
              className="text-red-500"
            />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-5 rounded-lg bg-[#075db5] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#064f9a]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f7f9fb]">
      <div className="mx-auto max-w-[1500px] px-5 py-6 lg:px-8">

        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#eef4fb]">
                <UserRound
                  size={34}
                  strokeWidth={1.5}
                  className="text-[#075db5]"
                />
              </div>

              <div className="min-w-0">
                <p className="text-sm text-slate-500">
                  Welcome back
                </p>

                <h1 className="mt-1 truncate text-2xl font-semibold tracking-tight text-slate-900">
                  {patientName}
                </h1>

                <p className="mt-1 text-xs text-slate-500">
                  Patient ID: {patientId}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="min-w-[126px] rounded-2xl border border-slate-200 bg-[#f8fafc] px-5 py-3">
                <p className="text-xs text-slate-400">
                  Blood Group
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {bloodGroup}
                </p>
              </div>

              <div className="min-w-[72px] rounded-2xl border border-slate-200 bg-[#f8fafc] px-5 py-3">
                <p className="text-xs text-slate-400">
                  Age
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {age}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
          <DashboardStat
            icon={CalendarDays}
            label="Upcoming Appointment"
            value={String(
              stats.upcoming
            ).padStart(2, "0")}
            subtitle="Next appointment"
            iconWrapper="bg-[#eef4fb] text-[#075db5]"
          />

          <DashboardStat
            icon={CheckCircle2}
            label="Completed Visits"
            value={String(
              stats.completed
            ).padStart(2, "0")}
            subtitle="Total consultations"
            iconWrapper="bg-[#eef7f3] text-emerald-600"
          />

          <DashboardStat
            icon={Pill}
            label="Prescriptions"
            value={String(
              stats.prescriptions
            ).padStart(2, "0")}
            subtitle="Available prescriptions"
            iconWrapper="bg-[#f1f4fb] text-[#075db5]"
          />

          <DashboardStat
            icon={FileText}
            label="Medical Reports"
            value={String(
              stats.reports
            ).padStart(2, "0")}
            subtitle="Total reports"
            iconWrapper="bg-[#f1f4fb] text-[#075db5]"
          />
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">

          <section>
            {upcomingAppointment ? (
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        Upcoming Appointment
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Your next scheduled appointment
                      </p>
                    </div>

                    <AppointmentStatus
                      appointment={
                        upcomingAppointment
                      }
                    />
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-center gap-5">
                      <DoctorAvatar
                        doctor={
                          upcomingAppointment?.doctor
                        }
                        size="large"
                      />

                      <div className="min-w-0">
                        <h3 className="truncate text-xl font-semibold text-slate-900">
                          Dr.{" "}
                          {getDoctorName(
                            upcomingAppointment?.doctor
                          )}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {getSpecialization(
                            upcomingAppointment?.doctor
                          )}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin
                              size={15}
                              className="text-slate-400"
                            />

                            {upcomingAppointment?.doctor
                              ?.hospitalName ||
                              upcomingAppointment?.doctor
                                ?.hospital ||
                              "Yash Hospital, Jaipur"}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            {getAppointmentType(
                              upcomingAppointment
                            ) ===
                            "Video Consultation" ? (
                              <Video
                                size={15}
                                className="text-slate-400"
                              />
                            ) : (
                              <CalendarDays
                                size={15}
                                className="text-slate-400"
                              />
                            )}

                            {getAppointmentType(
                              upcomingAppointment
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 lg:min-w-[300px]">
                      <div className="rounded-xl border border-slate-200 bg-[#f8fafc] px-5 py-4">
                        <p className="text-xs text-slate-400">
                          Date
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {formatDate(
                            upcomingAppointment?.appointmentDate
                          )}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-[#f8fafc] px-5 py-4">
                        <p className="text-xs text-slate-400">
                          Time
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {formatTime(
                            upcomingAppointment?.startTime
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap gap-8">
                        <div>
                          <p className="text-xs text-slate-400">
                            Appointment ID
                          </p>

                          <p className="mt-1 max-w-[220px] truncate text-sm font-semibold text-slate-900">
                            {upcomingAppointment?._id ||
                              upcomingAppointment?.id ||
                              "—"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">
                            Appointment Type
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-900">
                            {getAppointmentType(
                              upcomingAppointment
                            )}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const id =
                            upcomingAppointment?._id ||
                            upcomingAppointment?.id;

                          if (id) {
                            router.push(
                              `/patient/appointments/${id}`
                            );
                          }
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#075db5] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#064f9a]"
                      >
                        View Details
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#eef4fb]">
                      <CalendarDays
                        size={26}
                        className="text-[#075db5]"
                      />
                    </div>

                    <div>
                      <h2 className="font-semibold text-slate-900">
                        No upcoming appointment
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Schedule your next appointment with a doctor.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      router.push("/appointment")
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-[#075db5] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#064f9a]"
                  >
                    <Plus size={17} />
                    Book Appointment
                  </button>
                </div>
              </section>
            )}

            <section className="mt-6">
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Recent Appointments
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Your latest appointment activity
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/patient/appointments"
                    )
                  }
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#075db5] hover:text-[#064f9a]"
                >
                  View all
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {recentAppointments.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {recentAppointments.map(
                      (appointment, index) => (
                        <AppointmentRow
                          key={
                            appointment?._id ||
                            appointment?.id ||
                            index
                          }
                          appointment={appointment}
                          onClick={() => {
                            const id =
                              appointment?._id ||
                              appointment?.id;

                            if (id) {
                              router.push(
                                `/patient/appointments/${id}`
                              );
                            }
                          }}
                        />
                      )
                    )}
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <CalendarDays
                      size={28}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 text-sm text-slate-500">
                      No appointment history available.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </section>

          <aside className="space-y-6">

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Notifications
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Recent updates
                  </p>
                </div>

                <Bell
                  size={19}
                  strokeWidth={1.7}
                  className="text-slate-400"
                />
              </div>

              <div>
                {notifications.length > 0 ? (
                  notifications
                    .slice(0, 5)
                    .map(
                      (notification, index) => (
                        <NotificationItem
                          key={
                            notification?._id ||
                            notification?.id ||
                            index
                          }
                          notification={
                            notification
                          }
                        />
                      )
                    )
                ) : (
                  <>
                    {upcomingAppointment && (
                      <div className="border-b border-slate-100 px-5 py-5">
                        <div className="flex gap-3">
                          <span className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-[#075db5]" />

                          <div className="min-w-0">
                            <p className="text-[14px] font-medium leading-5 text-slate-800">
                              Appointment Reminder
                            </p>

                            <p className="mt-1.5 text-[12px] font-normal leading-5 text-slate-500">
                              Your appointment with Dr.{" "}
                              {getDoctorName(
                                upcomingAppointment?.doctor
                              )}{" "}
                              is scheduled for{" "}
                              {formatDate(
                                upcomingAppointment?.appointmentDate
                              )}{" "}
                              at{" "}
                              {formatTime(
                                upcomingAppointment?.startTime
                              )}
                              .
                            </p>

                            <p className="mt-1 text-[11px] font-normal text-slate-400">
                              Upcoming appointment
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="border-b border-slate-100 px-5 py-5">
                      <div className="flex gap-3">
                        <span className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-slate-300" />

                        <div className="min-w-0">
                          <p className="text-[14px] font-medium leading-5 text-slate-800">
                            Health Records
                          </p>

                          <p className="mt-1.5 text-[12px] font-normal leading-5 text-slate-500">
                            Your medical records are available from the health records section.
                          </p>

                          <p className="mt-1 text-[11px] font-normal text-slate-400">
                            Health records
                          </p>
                        </div>
                      </div>
                    </div>

                    {!upcomingAppointment && (
                      <div className="px-5 py-5">
                        <p className="text-[13px] font-normal text-slate-400">
                          No new notifications.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <h2 className="font-semibold text-slate-900">
                  Health Records
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Access your medical information
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <RecordCard
                  icon={Pill}
                  title="Prescriptions"
                  count={stats.prescriptions}
                  onClick={() =>
                    router.push(
                      "/patient/prescriptions"
                    )
                  }
                />

                <RecordCard
                  icon={FileText}
                  title="Medical Reports"
                  count={stats.reports}
                  onClick={() =>
                    router.push(
                      "/patient/medical-reports"
                    )
                  }
                />
              </div>
            </section>

          </aside>
        </div>
      </div>
    </div>
  );
}

function DashboardStat({
  icon: Icon,
  label,
  value,
  subtitle,
  iconWrapper,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconWrapper}`}
      >
        <Icon size={21} />
      </div>

      <p className="mt-5 text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {subtitle}
      </p>
    </div>
  );
}

function DoctorAvatar({
  doctor,
  size = "normal",
}) {
  const image = getDoctorImage(
    doctor?.profileImage
  );

  const name = getDoctorName(doctor);

  const sizeClass =
    size === "large"
      ? "h-20 w-20 rounded-xl"
      : "h-12 w-12 rounded-xl";

  return (
    <div
      className={`shrink-0 overflow-hidden bg-[#eef4fb] ${sizeClass}`}
    >
      {image ? (
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover object-top"
          onError={(e) => {
            e.currentTarget.style.display =
              "none";
          }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <UserRound
            size={
              size === "large"
                ? 36
                : 22
            }
            strokeWidth={1.3}
            className="text-[#075db5]"
          />
        </div>
      )}
    </div>
  );
}

function AppointmentStatus({
  appointment,
}) {
  const status = getStatus(appointment);

  const Icon = status.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${status.className}`}
    >
      <Icon size={13} />

      {status.label}
    </span>
  );
}

function AppointmentRow({
  appointment,
  onClick,
}) {
  const doctor =
    appointment?.doctor || {};

  const doctorName =
    getDoctorName(doctor);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-4 px-4 py-4 text-left transition hover:bg-slate-50 sm:px-5"
    >
      <DoctorAvatar
        doctor={doctor}
      />

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-slate-900">
          Dr. {doctorName}
        </h3>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span>
            {formatDate(
              appointment?.appointmentDate
            )}
          </span>

          <span>
            {formatTime(
              appointment?.startTime
            )}
          </span>

          <span>
            {getAppointmentType(
              appointment
            )}
          </span>
        </div>
      </div>

      <AppointmentStatus
        appointment={appointment}
      />

      <ArrowRight
        size={17}
        className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#075db5]"
      />
    </button>
  );
}

function NotificationItem({
  notification,
}) {
  const title =
    notification?.title ||
    notification?.heading ||
    "Notification";

  const message =
    notification?.message ||
    notification?.description ||
    notification?.text ||
    "You have a new update.";

  const createdAt =
    notification?.createdAt ||
    notification?.time ||
    "";

  let timeText = "";

  if (createdAt) {
    const date = new Date(createdAt);

    if (!Number.isNaN(date.getTime())) {
      timeText =
        date.toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
          }
        );
    } else {
      timeText = String(createdAt);
    }
  }

  return (
    <div className="border-b border-slate-100 px-5 py-5 last:border-b-0">
      <div className="flex gap-3">
        <span className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-[#075db5]" />

        <div className="min-w-0">
          <p className="text-[14px] font-medium leading-5 text-slate-800">
            {title}
          </p>

          <p className="mt-1.5 text-[12px] font-normal leading-5 text-slate-500">
            {message}
          </p>

          {timeText && (
            <p className="mt-1 text-[11px] font-normal text-slate-400">
              {timeText}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function RecordCard({
  icon: Icon,
  title,
  count,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:border-blue-100 hover:bg-blue-50"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#075db5] shadow-sm">
        <Icon size={18} />
      </div>

      <p className="mt-3 text-sm font-semibold text-slate-800">
        {title}
      </p>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {count} records
        </span>

        <ArrowRight
          size={14}
          className="text-slate-300 transition group-hover:text-[#075db5]"
        />
      </div>
    </button>
  );
}