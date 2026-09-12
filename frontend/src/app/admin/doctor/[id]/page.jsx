"use client";

import {
  ArrowLeft,
  Pencil,
  UserRound,
  Mail,
  Phone,
  CalendarDays,
  MapPin,
  BriefcaseMedical,
  GraduationCap,
  Stethoscope,
  Clock3,
  IndianRupee,
  IdCard,
  Building2,
  Video,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  getDoctorById,
  getDoctorImageUrl,
} from "@/app/components/utils/Api-call/doctor-api";

import { notify } from "@/app/components/healper";

export default function DoctorViewPage() {
  const params = useParams();
  const doctorId = params?.id;

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH DOCTOR
  // ==========================================

  useEffect(() => {
    if (!doctorId) return;

    const fetchDoctor = async () => {
      try {
        setLoading(true);

        const response = await getDoctorById(doctorId);

        console.log("Doctor API Response:", response);

        if (response?.success) {
          /*
            Depending on your backend response structure,
            support both:

            data: doctor
            data: { data: doctor }
          */

          const doctorData =
            response?.data?.data ||
            response?.data ||
            null;

          setDoctor(doctorData);
        } else {
          notify(
            response?.message || "Doctor not found",
            false
          );
        }
      } catch (error) {
        console.error(
          "Get Doctor Error:",
          error
        );

        notify(
          error?.response?.data?.message ||
            error?.message ||
            "Unable to fetch doctor details",
          false
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  // ==========================================
  // DOCTOR NAME
  // ==========================================

  const getDoctorName = () => {
    if (!doctor) return "Doctor";

    const fullName = [
      doctor?.firstName,
      doctor?.lastName,
    ]
      .filter(Boolean)
      .join(" ");

    return fullName || "Doctor";
  };

  // ==========================================
  // DEPARTMENT
  // ==========================================

  const getDepartmentName = () => {
    const department = doctor?.department;

    if (!department) {
      return "—";
    }

    if (typeof department === "string") {
      return department;
    }

    return department?.name || "—";
  };

  // ==========================================
  // SPECIALIZATION
  // ==========================================

  const getSpecialization = () => {
    const specialization =
      doctor?.specialization;

    if (!specialization) {
      return "—";
    }

    if (Array.isArray(specialization)) {
      return specialization.length
        ? specialization.join(", ")
        : "—";
    }

    return String(specialization);
  };

  // ==========================================
  // QUALIFICATION
  // ==========================================

  const getQualification = () => {
    const qualification =
      doctor?.qualification;

    if (!qualification) {
      return "—";
    }

    if (Array.isArray(qualification)) {
      return qualification.length
        ? qualification.join(", ")
        : "—";
    }

    return String(qualification);
  };

  // ==========================================
  // PHONE
  // ==========================================

  const getPhone = () => {
    return doctor?.phone || "—";
  };

  // ==========================================
  // EXPERIENCE
  // ==========================================

  const getExperience = () => {
    if (
      doctor?.experience !== undefined &&
      doctor?.experience !== null &&
      doctor?.experience !== ""
    ) {
      return `${doctor.experience} Years`;
    }

    return "—";
  };

  // ==========================================
  // CONSULTATION FEE
  // ==========================================

  const getConsultationFee = () => {
    if (
      doctor?.consultationFee !== undefined &&
      doctor?.consultationFee !== null &&
      doctor?.consultationFee !== ""
    ) {
      return `₹${doctor.consultationFee}`;
    }

    return "—";
  };

  // ==========================================
  // ADDRESS
  // ==========================================

  const getAddress = () => {
    const address = doctor?.address;

    if (!address) {
      return "—";
    }

    if (typeof address === "string") {
      return address;
    }

    if (typeof address === "object") {
      if (address?.fullAddress) {
        return address.fullAddress;
      }

      const parts = [
        address?.city,
        address?.state,
        address?.pincode,
      ].filter(Boolean);

      return parts.length
        ? parts.join(", ")
        : "—";
    }

    return "—";
  };

  // ==========================================
  // CITY
  // ==========================================

  const getCity = () => {
    if (
      doctor?.address &&
      typeof doctor.address === "object"
    ) {
      return doctor.address?.city || "—";
    }

    return "—";
  };

  // ==========================================
  // STATE
  // ==========================================

  const getState = () => {
    if (
      doctor?.address &&
      typeof doctor.address === "object"
    ) {
      return doctor.address?.state || "—";
    }

    return "—";
  };

  // ==========================================
  // PINCODE
  // ==========================================

  const getPincode = () => {
    if (
      doctor?.address &&
      typeof doctor.address === "object"
    ) {
      return doctor.address?.pincode || "—";
    }

    return "—";
  };

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "—";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // AVAILABILITY
  // ==========================================

  const availability = Array.isArray(
    doctor?.availability
  )
    ? doctor.availability
    : [];

  // ==========================================
  // PROFILE IMAGE
  // ==========================================

  const profileImage =
    doctor?.profileImage || "";

  // ==========================================
  // STATUS
  // ==========================================

  const isActive =
    doctor?.status === true;

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-6">
        <div className="mx-auto max-w-[1400px]">

          <div className="mb-6 flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-lg bg-slate-200" />

            <div>
              <div className="h-7 w-48 animate-pulse rounded bg-slate-200" />

              <div className="mt-2 h-4 w-64 animate-pulse rounded bg-slate-200" />
            </div>
          </div>

          <div className="h-48 animate-pulse rounded-xl bg-white" />

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="h-80 animate-pulse rounded-xl bg-white" />
            <div className="h-80 animate-pulse rounded-xl bg-white" />
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // NOT FOUND
  // ==========================================

  if (!doctor) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-6">
        <div className="mx-auto max-w-[1400px]">

          <Link
            href="/admin/doctor"
            className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-medium text-[#475569] shadow-sm transition hover:border-[#0F766E] hover:bg-[#F0FDFA] hover:text-[#0F766E]"
          >
            <ArrowLeft size={17} />
            Back to Doctors
          </Link>

          <div className="mt-6 rounded-xl border border-[#E2E8F0] bg-white px-6 py-16 text-center shadow-sm">

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
              <UserRound size={25} />
            </div>

            <h2 className="text-lg font-semibold text-[#0F172A]">
              Doctor Not Found
            </h2>

            <p className="mt-1 text-sm text-[#64748B]">
              The requested doctor could not be found.
            </p>

          </div>
        </div>
      </div>
    );
  }

  const doctorName = getDoctorName();

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 text-[#0F172A]">

      <div className="mx-auto max-w-[1400px]">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <Link
              href="/admin/doctor"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#475569] shadow-sm transition hover:border-[#0F766E] hover:bg-[#F0FDFA] hover:text-[#0F766E]"
            >
              <ArrowLeft size={19} />
            </Link>

            <div>
              <h1 className="text-2xl font-bold text-[#0F172A]">
                Doctor Details
              </h1>

              <p className="mt-1 text-sm text-[#64748B]">
                View complete doctor information
              </p>
            </div>

          </div>

          <Link
            href={`/admin/doctor/edit/${doctor._id}`}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#115E59]"
          >
            <Pencil size={17} />
            Edit Doctor
          </Link>

        </div>

        {/* ==========================================
            PROFILE CARD
        ========================================== */}

        <div className="mb-6 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">

          <div className="p-6">

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

              {/* PROFILE */}

              <div className="flex items-center gap-5">

                <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[#CCFBF1] bg-[#F0FDFA]">

                  {profileImage ? (
                    <img
                      src={getDoctorImageUrl(
                        profileImage
                      )}
                      alt={doctorName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-[#0F766E]">
                      {doctorName
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  )}

                </div>

                <div>

                  <div className="flex flex-wrap items-center gap-3">

                    <h2 className="text-2xl font-bold text-[#0F172A]">
                      {doctorName}
                    </h2>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                        isActive
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-red-200 bg-red-50 text-red-600"
                      }`}
                    >

                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActive
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        }`}
                      />

                      {isActive
                        ? "Active"
                        : "Inactive"}

                    </span>

                  </div>

                  <p className="mt-2 text-sm font-medium text-[#0F766E]">
                    {getSpecialization()}
                  </p>

                  <p className="mt-1 text-sm text-[#64748B]">
                    {getDepartmentName()}
                  </p>

                  {doctor?.email && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-[#64748B]">
                      <Mail size={15} />
                      {doctor.email}
                    </div>
                  )}

                </div>

              </div>

              {/* QUICK INFO */}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                <QuickInfo
                  label="Experience"
                  value={getExperience()}
                />

                <QuickInfo
                  label="Qualification"
                  value={getQualification()}
                />

                <QuickInfo
                  label="Consultation"
                  value={getConsultationFee()}
                />

              </div>

            </div>

          </div>

        </div>

        {/* ==========================================
            INFORMATION GRID
        ========================================== */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* ==========================================
              PERSONAL INFORMATION
          ========================================== */}

          <InfoSection
            icon={UserRound}
            title="Personal Information"
          >

            <InfoItem
              icon={UserRound}
              label="First Name"
              value={doctor?.firstName}
            />

            <InfoItem
              icon={UserRound}
              label="Last Name"
              value={doctor?.lastName}
            />

            <InfoItem
              icon={Mail}
              label="Email"
              value={doctor?.email}
            />

            <InfoItem
              icon={Phone}
              label="Mobile Number"
              value={getPhone()}
            />

            <InfoItem
              icon={UserRound}
              label="Gender"
              value={doctor?.gender}
            />

            <InfoItem
              icon={CalendarDays}
              label="Date of Birth"
              value={formatDate(
                doctor?.dateOfBirth
              )}
            />

          </InfoSection>

          {/* ==========================================
              PROFESSIONAL INFORMATION
          ========================================== */}

          <InfoSection
            icon={Stethoscope}
            title="Professional Information"
          >

            <InfoItem
              icon={Stethoscope}
              label="Specialization"
              value={getSpecialization()}
            />

            <InfoItem
              icon={Building2}
              label="Department"
              value={getDepartmentName()}
            />

            <InfoItem
              icon={GraduationCap}
              label="Qualification"
              value={getQualification()}
            />

            <InfoItem
              icon={BriefcaseMedical}
              label="Experience"
              value={getExperience()}
            />

            <InfoItem
              icon={IndianRupee}
              label="Consultation Fee"
              value={getConsultationFee()}
            />

            <InfoItem
              icon={IdCard}
              label="License Number"
              value={doctor?.licenseNumber}
            />

          </InfoSection>

          {/* ==========================================
              AVAILABILITY
          ========================================== */}

          <InfoSection
            icon={Clock3}
            title="Availability"
          >

            <div className="col-span-full">

              <div className="mb-4 flex items-center justify-between">

                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">
                    Doctor Schedule
                  </p>

                  <p className="mt-1 text-xs text-[#64748B]">
                    Hospital and video consultation timings
                  </p>
                </div>

              </div>

              {availability.length === 0 ? (
                <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-5 text-center">
                  <Clock3
                    size={24}
                    className="mx-auto text-[#94A3B8]"
                  />

                  <p className="mt-2 text-sm text-[#64748B]">
                    No availability specified
                  </p>
                </div>
              ) : (
                <div className="space-y-4">

                  {availability.map(
                    (item, index) => {

                      const hospitalSlots =
                        Array.isArray(
                          item?.hospital?.slots
                        )
                          ? item.hospital.slots
                          : [];

                      const videoSlots =
                        Array.isArray(
                          item?.video?.slots
                        )
                          ? item.video.slots
                          : [];

                      return (
                        <div
                          key={`${item?.day}-${index}`}
                          className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4"
                        >

                          {/* DAY */}

                          <div className="mb-4 flex items-center justify-between">

                            <span className="rounded-lg border border-[#CCFBF1] bg-[#F0FDFA] px-3 py-1.5 text-xs font-semibold text-[#0F766E]">
                              {item?.day || "Day"}
                            </span>

                          </div>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                            {/* HOSPITAL */}

                            <div className="rounded-lg border border-[#E2E8F0] bg-white p-4">

                              <div className="flex items-center gap-2">

                                <Building2
                                  size={16}
                                  className="text-[#0F766E]"
                                />

                                <p className="text-sm font-semibold text-[#0F172A]">
                                  Hospital
                                </p>

                              </div>

                              {!item?.hospital?.enabled ? (
                                <p className="mt-3 text-xs text-[#94A3B8]">
                                  Not Available
                                </p>
                              ) : hospitalSlots.length === 0 ? (
                                <p className="mt-3 text-xs text-[#94A3B8]">
                                  No slots configured
                                </p>
                              ) : (
                                <div className="mt-3 space-y-2">

                                  {hospitalSlots.map(
                                    (
                                      slot,
                                      slotIndex
                                    ) => (
                                      <div
                                        key={slotIndex}
                                        className="flex items-center gap-2 text-xs font-medium text-[#475569]"
                                      >
                                        <Clock3
                                          size={14}
                                          className="text-[#0F766E]"
                                        />

                                        <span>
                                          {slot?.startTime ||
                                            "—"}{" "}
                                          -{" "}
                                          {slot?.endTime ||
                                            "—"}
                                        </span>
                                      </div>
                                    )
                                  )}

                                </div>
                              )}

                            </div>

                            {/* VIDEO */}

                            <div className="rounded-lg border border-[#E2E8F0] bg-white p-4">

                              <div className="flex items-center gap-2">

                                <Video
                                  size={16}
                                  className="text-[#0F766E]"
                                />

                                <p className="text-sm font-semibold text-[#0F172A]">
                                  Video Consultation
                                </p>

                              </div>

                              {!item?.video?.enabled ? (
                                <p className="mt-3 text-xs text-[#94A3B8]">
                                  Not Available
                                </p>
                              ) : videoSlots.length === 0 ? (
                                <p className="mt-3 text-xs text-[#94A3B8]">
                                  No slots configured
                                </p>
                              ) : (
                                <div className="mt-3 space-y-2">

                                  {videoSlots.map(
                                    (
                                      slot,
                                      slotIndex
                                    ) => (
                                      <div
                                        key={slotIndex}
                                        className="flex items-center gap-2 text-xs font-medium text-[#475569]"
                                      >
                                        <Clock3
                                          size={14}
                                          className="text-[#0F766E]"
                                        />

                                        <span>
                                          {slot?.startTime ||
                                            "—"}{" "}
                                          -{" "}
                                          {slot?.endTime ||
                                            "—"}
                                        </span>
                                      </div>
                                    )
                                  )}

                                </div>
                              )}

                            </div>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>
              )}

            </div>

            <InfoItem
              icon={Clock3}
              label="Appointment Duration"
              value={
                doctor?.appointmentDuration
                  ? `${doctor.appointmentDuration} Minutes`
                  : "—"
              }
            />

            <InfoItem
              icon={Clock3}
              label="Status"
              value={
                isActive
                  ? "Active"
                  : "Inactive"
              }
            />

          </InfoSection>

          {/* ==========================================
              ADDRESS
          ========================================== */}

          <InfoSection
            icon={MapPin}
            title="Address"
          >

            <div className="col-span-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">

              <p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                Full Address
              </p>

              <p className="mt-2 text-sm leading-6 text-[#0F172A]">
                {getAddress()}
              </p>

            </div>

            <InfoItem
              icon={MapPin}
              label="City"
              value={getCity()}
            />

            <InfoItem
              icon={MapPin}
              label="State"
              value={getState()}
            />

            <InfoItem
              icon={MapPin}
              label="Pincode"
              value={getPincode()}
            />

          </InfoSection>

        </div>

        {/* ==========================================
            FOOTER
        ========================================== */}

        <div className="mt-6 flex justify-end">

          <Link
            href="/admin/doctor"
            className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-semibold text-[#475569] shadow-sm transition hover:border-[#0F766E] hover:bg-[#F0FDFA] hover:text-[#0F766E]"
          >
            <ArrowLeft size={17} />
            Back to Doctors
          </Link>

        </div>

      </div>
    </div>
  );
}

// ==========================================
// INFO SECTION
// ==========================================

function InfoSection({
  icon: Icon,
  title,
  children,
}) {
  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm">

      <div className="border-b border-[#E2E8F0] px-6 py-4">

        <div className="flex items-center gap-2">

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F0FDFA] text-[#0F766E]">
            <Icon size={18} />
          </div>

          <h3 className="font-semibold text-[#0F172A]">
            {title}
          </h3>

        </div>

      </div>

      <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
        {children}
      </div>

    </section>
  );
}

// ==========================================
// INFO ITEM
// ==========================================

function InfoItem({
  icon: Icon,
  label,
  value,
}) {
  let displayValue = "—";

  if (
    value !== null &&
    value !== undefined &&
    value !== ""
  ) {
    if (Array.isArray(value)) {
      displayValue = value.length
        ? value.join(", ")
        : "—";
    } else if (
      typeof value === "object"
    ) {
      displayValue =
        value?.name ||
        value?.title ||
        value?.fullAddress ||
        "—";
    } else {
      displayValue = String(value);
    }
  }

  return (
    <div>

      <div className="flex items-center gap-2">

        <Icon
          size={15}
          className="text-[#0F766E]"
        />

        <p className="text-xs font-medium text-[#64748B]">
          {label}
        </p>

      </div>

      <p className="mt-1.5 break-words text-sm font-medium text-[#0F172A]">
        {displayValue}
      </p>

    </div>
  );
}

// ==========================================
// QUICK INFO
// ==========================================

function QuickInfo({
  label,
  value,
}) {
  let displayValue = "—";

  if (
    value !== null &&
    value !== undefined &&
    value !== ""
  ) {
    if (Array.isArray(value)) {
      displayValue = value.length
        ? value.join(", ")
        : "—";
    } else {
      displayValue = String(value);
    }
  }

  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">

      <p className="text-xs text-[#64748B]">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-[#0F172A]">
        {displayValue}
      </p>

    </div>
  );
}