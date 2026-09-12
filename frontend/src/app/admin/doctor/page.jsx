"use client";

import {
  Plus,
  Search,
  Eye,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  getDoctors,
  getDoctorImageUrl,
} from "@/app/components/utils/Api-call/doctor-api";

import Delete from "@/app/components/Delete";
import Status from "@/app/components/Status";
import { notify } from "@/app/components/healper";

export default function DoctorPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] =
    useState("All");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // =========================
  // GET DOCTORS
  // =========================
  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const response = await getDoctors();

      if (response?.success) {
        setDoctors(response?.data || []);
      } else {
        setDoctors([]);

        notify(
          response?.message ||
            "Unable to fetch doctors",
          false
        );
      }
    } catch (error) {
      console.error(
        "Fetch Doctors Error:",
        error
      );

      setDoctors([]);

      notify(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to fetch doctors",
        false
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // =========================
  // DOCTOR NAME
  // =========================
  const getDoctorName = (doctor) => {
    if (!doctor) return "—";

    if (doctor.name) {
      return doctor.name;
    }

    const fullName = [
      doctor.firstName,
      doctor.lastName,
    ]
      .filter(Boolean)
      .join(" ");

    return fullName || "—";
  };

  // =========================
  // DEPARTMENT NAME
  // =========================
  const getDepartmentName = (doctor) => {
    if (!doctor?.department) {
      return "—";
    }

    if (
      typeof doctor.department === "string"
    ) {
      return doctor.department;
    }

    return (
      doctor.department?.name ||
      doctor.department?.departmentName ||
      "—"
    );
  };

  // =========================
  // SPECIALIZATION
  // =========================
  const getSpecialization = (doctor) => {
    const specialization =
      doctor?.specialization ??
      doctor?.speciality ??
      doctor?.specialty;

    if (!specialization) {
      return "—";
    }

    // New schema: [String]
    if (Array.isArray(specialization)) {
      return specialization.length > 0
        ? specialization.join(", ")
        : "—";
    }

    // Old data: String
    return String(specialization);
  };

  // =========================
  // QUALIFICATION
  // =========================
  const getQualification = (doctor) => {
    const qualification =
      doctor?.qualification ??
      doctor?.qualifications;

    if (!qualification) {
      return "—";
    }

    // New schema: [String]
    if (Array.isArray(qualification)) {
      return qualification.length > 0
        ? qualification.join(", ")
        : "—";
    }

    // Old data: String
    return String(qualification);
  };

  // =========================
  // EXPERIENCE
  // =========================
  const getExperience = (doctor) => {
    if (
      doctor?.experience !== undefined &&
      doctor?.experience !== null &&
      doctor?.experience !== ""
    ) {
      return `${doctor.experience} Years`;
    }

    return "—";
  };

  // =========================
  // MOBILE
  // =========================
  const getMobileNumber = (doctor) => {
    return (
      doctor?.phone ||
      doctor?.mobile ||
      doctor?.mobileNumber ||
      "—"
    );
  };

  // =========================
  // DEPARTMENTS
  // =========================
  const departments = useMemo(() => {
    const departmentList = doctors
      .map((doctor) =>
        getDepartmentName(doctor)
      )
      .filter(
        (department) =>
          department &&
          department !== "—"
      );

    return [
      "All",
      ...new Set(departmentList),
    ];
  }, [doctors]);

  // =========================
  // FILTER DOCTORS
  // =========================
  const filteredDoctors = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return doctors.filter((doctor) => {
      const doctorName =
        String(
          getDoctorName(doctor)
        ).toLowerCase();

      const email =
        String(
          doctor?.email || ""
        ).toLowerCase();

      const specialization =
        String(
          getSpecialization(doctor)
        ).toLowerCase();

      const department =
        String(
          getDepartmentName(doctor)
        ).toLowerCase();

      const phone =
        String(
          getMobileNumber(doctor)
        ).toLowerCase();

      const matchesSearch =
        !searchValue ||
        doctorName.includes(searchValue) ||
        email.includes(searchValue) ||
        specialization.includes(searchValue) ||
        department.includes(searchValue) ||
        phone.includes(searchValue);

      const matchesDepartment =
        departmentFilter === "All" ||
        getDepartmentName(doctor) ===
          departmentFilter;

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" &&
          doctor?.status === true) ||
        (statusFilter === "Inactive" &&
          doctor?.status === false);

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [
    doctors,
    search,
    departmentFilter,
    statusFilter,
  ]);

  // =========================
  // PAGINATION
  // =========================
  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredDoctors.length /
        itemsPerPage
    )
  );

  const paginatedDoctors = useMemo(() => {
    const start =
      (currentPage - 1) *
      itemsPerPage;

    return filteredDoctors.slice(
      start,
      start + itemsPerPage
    );
  }, [
    filteredDoctors,
    currentPage,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    departmentFilter,
    statusFilter,
  ]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  const startItem =
    filteredDoctors.length === 0
      ? 0
      : (currentPage - 1) *
          itemsPerPage +
        1;

  const endItem = Math.min(
    currentPage * itemsPerPage,
    filteredDoctors.length
  );

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-6">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-6">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />

            <div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="h-[500px] animate-pulse rounded-xl border border-[#E2E8F0] bg-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 text-[#0F172A]">
      <div className="mx-auto max-w-[1600px]">

        {/* ================= HEADER ================= */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
              Doctors
            </h1>

            <p className="mt-1 text-sm text-[#64748B]">
              Manage hospital doctors and
              their information
            </p>
          </div>

          <Link
            href="/admin/doctor/add"
            className="
              inline-flex
              h-10
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-[#0F766E]
              px-4
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-[#115E59]
              hover:shadow
            "
          >
            <Plus size={18} />
            Add Doctor
          </Link>
        </div>

        {/* ================= FILTER CARD ================= */}
        <div
          className="
            mb-5
            rounded-xl
            border
            border-[#E2E8F0]
            bg-white
            p-4
            shadow-sm
          "
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">

            {/* SEARCH */}
            <div className="relative md:col-span-2">
              <Search
                size={18}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-[#94A3B8]
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search doctor, email, specialization..."
                className="
                  h-10
                  w-full
                  rounded-lg
                  border
                  border-[#E2E8F0]
                  bg-white
                  pl-10
                  pr-4
                  text-sm
                  text-[#0F172A]
                  outline-none
                  placeholder:text-[#94A3B8]
                  focus:border-[#0F766E]
                  focus:ring-2
                  focus:ring-[#0F766E]/10
                "
              />
            </div>

            {/* DEPARTMENT */}
            <select
              value={departmentFilter}
              onChange={(e) =>
                setDepartmentFilter(
                  e.target.value
                )
              }
              className="
                h-10
                rounded-lg
                border
                border-[#E2E8F0]
                bg-white
                px-3
                text-sm
                text-[#475569]
                outline-none
                focus:border-[#0F766E]
                focus:ring-2
                focus:ring-[#0F766E]/10
              "
            >
              {departments.map(
                (department) => (
                  <option
                    key={department}
                    value={department}
                  >
                    {department === "All"
                      ? "All Departments"
                      : department}
                  </option>
                )
              )}
            </select>

            {/* STATUS */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="
                h-10
                rounded-lg
                border
                border-[#E2E8F0]
                bg-white
                px-3
                text-sm
                text-[#475569]
                outline-none
                focus:border-[#0F766E]
                focus:ring-2
                focus:ring-[#0F766E]/10
              "
            >
              <option value="All">
                All Status
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>
          </div>
        </div>

        {/* ================= TABLE CARD ================= */}
        <div
          className="
            overflow-hidden
            rounded-xl
            border
            border-[#E2E8F0]
            bg-white
            shadow-sm
          "
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1250px] border-collapse">

              {/* TABLE HEADER */}
              <thead>
                <tr
                  className="
                    border-b
                    border-[#E2E8F0]
                    bg-[#F1F5F9]
                  "
                >
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#475569]">
                    Profile
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#475569]">
                    Doctor
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#475569]">
                    Specialization
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#475569]">
                    Department
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#475569]">
                    Qualification
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#475569]">
                    Experience
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#475569]">
                    Mobile Number
                  </th>

                  <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-[#475569]">
                    Status
                  </th>

                  <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-[#475569]">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* TABLE BODY */}
              <tbody>
                {paginatedDoctors.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-5 py-16 text-center"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div
                          className="
                            mb-3
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-full
                            bg-[#F0FDFA]
                            text-[#0F766E]
                          "
                        >
                          <Search size={22} />
                        </div>

                        <p className="text-sm font-semibold text-[#0F172A]">
                          No doctors found
                        </p>

                        <p className="mt-1 text-xs text-[#64748B]">
                          Try changing your
                          search or filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedDoctors.map(
                    (doctor) => {
                      const doctorName =
                        getDoctorName(
                          doctor
                        );

                      const profileImage =
                        doctor?.profileImage ||
                        doctor?.profile ||
                        doctor?.image;

                      return (
                        <tr
                          key={doctor?._id}
                          className="
                            border-b
                            border-[#E2E8F0]
                            last:border-0
                            transition
                            hover:bg-[#F8FAFC]
                          "
                        >
                          {/* PROFILE */}
                          <td className="px-5 py-4">
                            <div
                              className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                overflow-hidden
                                rounded-full
                                border
                                border-[#CCFBF1]
                                bg-[#F0FDFA]
                              "
                            >
                              {profileImage ? (
                                <img
                                  src={getDoctorImageUrl(
                                    profileImage
                                  )}
                                  alt={
                                    doctorName
                                  }
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span
                                  className="
                                    text-sm
                                    font-bold
                                    text-[#0F766E]
                                  "
                                >
                                  {doctorName
                                    .charAt(
                                      0
                                    )
                                    .toUpperCase()}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* DOCTOR */}
                          <td className="px-5 py-4">
                            <div>
                              <p className="text-sm font-semibold text-[#0F172A]">
                                {doctorName}
                              </p>

                              <p className="mt-1 text-xs text-[#64748B]">
                                {doctor?.email ||
                                  "—"}
                              </p>
                            </div>
                          </td>

                          {/* SPECIALIZATION */}
                          <td className="px-5 py-4">
                            <span className="text-sm text-[#475569]">
                              {getSpecialization(
                                doctor
                              )}
                            </span>
                          </td>

                          {/* DEPARTMENT */}
                          <td className="px-5 py-4">
                            <span
                              className="
                                inline-flex
                                items-center
                                rounded-md
                                border
                                border-[#CCFBF1]
                                bg-[#F0FDFA]
                                px-2.5
                                py-1
                                text-xs
                                font-medium
                                text-[#0F766E]
                              "
                            >
                              {getDepartmentName(
                                doctor
                              )}
                            </span>
                          </td>

                          {/* QUALIFICATION */}
                          <td className="px-5 py-4">
                            <span className="text-sm text-[#475569]">
                              {getQualification(
                                doctor
                              )}
                            </span>
                          </td>

                          {/* EXPERIENCE */}
                          <td className="px-5 py-4">
                            <span className="text-sm font-medium text-[#475569]">
                              {getExperience(
                                doctor
                              )}
                            </span>
                          </td>

                          {/* MOBILE */}
                          <td className="px-5 py-4">
                            <span className="text-sm text-[#475569]">
                              {getMobileNumber(
                                doctor
                              )}
                            </span>
                          </td>

                          {/* STATUS */}
                          <td className="px-5 py-4 text-center">
                            <Status
                              value={
                                doctor?.status
                              }
                              id={doctor?._id}
                              endpoint="doctors"
                            />
                          </td>

                          {/* ACTIONS */}
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-center gap-1">

                              {/* VIEW */}
                              <Link
                                href={`/admin/doctor/${doctor?._id}`}
                                title="View Doctor"
                                className="
                                  flex
                                  h-8
                                  w-8
                                  items-center
                                  justify-center
                                  rounded-lg
                                  text-[#64748B]
                                  transition
                                  hover:bg-[#F0FDFA]
                                  hover:text-[#0F766E]
                                "
                              >
                                <Eye
                                  size={17}
                                />
                              </Link>

                              {/* EDIT */}
                              <Link
                                href={`/admin/doctors/edit/${doctor?._id}`}
                                title="Edit Doctor"
                                className="
                                  flex
                                  h-8
                                  w-8
                                  items-center
                                  justify-center
                                  rounded-lg
                                  text-[#64748B]
                                  transition
                                  hover:bg-[#F0FDFA]
                                  hover:text-[#0F766E]
                                "
                              >
                                <Pencil
                                  size={17}
                                />
                              </Link>

                              {/* DELETE */}
                              <Delete
                                id={doctor?._id}
                                endpoint="doctors"
                                onSuccess={
                                  fetchDoctors
                                }
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* ================= FOOTER ================= */}
          <div
            className="
              flex
              flex-col
              gap-3
              border-t
              border-[#E2E8F0]
              bg-white
              px-5
              py-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            {/* RESULT COUNT */}
            <p className="text-xs text-[#64748B]">
              Showing{" "}
              <span className="font-semibold text-[#475569]">
                {startItem}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-[#475569]">
                {endItem}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#475569]">
                {filteredDoctors.length}
              </span>{" "}
              doctors
            </p>

            {/* PAGINATION */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  setCurrentPage(
                    (prev) =>
                      Math.max(
                        1,
                        prev - 1
                      )
                  )
                }
                className="
                  rounded-lg
                  border
                  border-[#E2E8F0]
                  bg-white
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  text-[#475569]
                  transition
                  hover:border-[#0F766E]
                  hover:text-[#0F766E]
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) =>
                  index + 1
              )
                .slice(
                  Math.max(
                    0,
                    currentPage - 3
                  ),
                  Math.min(
                    totalPages,
                    currentPage + 2
                  )
                )
                .map((page) => (
                  <button
                    type="button"
                    key={page}
                    onClick={() =>
                      setCurrentPage(
                        page
                      )
                    }
                    className={`
                      h-8
                      min-w-8
                      rounded-lg
                      px-2
                      text-xs
                      font-semibold
                      transition
                      ${
                        currentPage ===
                        page
                          ? "bg-[#0F766E] text-white"
                          : "border border-[#E2E8F0] bg-white text-[#475569] hover:border-[#0F766E] hover:text-[#0F766E]"
                      }
                    `}
                  >
                    {page}
                  </button>
                ))}

              <button
                type="button"
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (prev) =>
                      Math.min(
                        totalPages,
                        prev + 1
                      )
                  )
                }
                className="
                  rounded-lg
                  border
                  border-[#E2E8F0]
                  bg-white
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  text-[#475569]
                  transition
                  hover:border-[#0F766E]
                  hover:text-[#0F766E]
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}