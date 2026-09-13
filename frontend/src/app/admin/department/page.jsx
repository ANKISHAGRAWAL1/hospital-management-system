 
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Delete from "@/app/components/Delete";

import {
  Plus,
  Search,
  Pencil,
  Eye,
  RefreshCw,
  Building2,
  Image as ImageIcon,
} from "lucide-react";

import {
  getDepartment,
} from "@/app/components/utils/Api-call/get_api";
// =========================================================
// IMAGE BASE URL
// =========================================================

const IMAGE_BASE_URL = "http://localhost:5000/departments";


export default function DepartmentPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");


  // =========================================================
  // GET DEPARTMENTS
  // =========================================================

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDepartment();

      console.log("Department API Response:", response);

      if (!response?.success) {
        throw new Error(
          response?.message || "Failed to fetch departments"
        );
      }

      setDepartments(response.data || []);

    } catch (error) {
      console.error("Fetch Department Error:", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch departments"
      );

      setDepartments([]);

    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchDepartments();
  }, []);


  // =========================================================
  // SEARCH
  // =========================================================

  const filteredDepartments = departments.filter((department) => {
    const searchText = search.toLowerCase().trim();

    return (
      department?.name?.toLowerCase().includes(searchText) ||
      department?.code?.toLowerCase().includes(searchText) ||
      department?.location?.toLowerCase().includes(searchText) ||
      department?.headDoctor
        ?.toLowerCase?.()
        .includes(searchText)
    );
  });


  // =========================================================
  // IMAGE URL
  // =========================================================

  const getDepartmentImage = (image) => {
    if (!image) return "";

    return `${IMAGE_BASE_URL}/${image}`;
  };


  return (
    <div className="min-h-screen bg-[#F5F7FF] p-6 text-[#202020]">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="flex items-center gap-3">

          <div
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              bg-[#E6E6FF]
              text-[#0000FF]
            "
          >
            <Building2 size={20} />
          </div>

          <div>

            <h1
              className="
                text-2xl
                font-semibold
                tracking-tight
                text-[#202020]
              "
            >
              Department Management
            </h1>

            <p className="mt-1 text-sm text-[#666666]">
              Manage hospital departments and their information
            </p>

          </div>

        </div>


        <div className="flex items-center gap-3">

          {/* REFRESH */}

          <button
            type="button"
            onClick={fetchDepartments}
            disabled={loading}
            title="Refresh departments"
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              border border-[#DADAFF]
              bg-white
              text-[#666666]
              shadow-[0_2px_8px_rgba(0,0,255,0.05)]
              transition-all
              hover:border-[#9999FF]
              hover:bg-[#F4F4FF]
              hover:text-[#0000FF]
              disabled:opacity-50
            "
          >
            <RefreshCw
              size={18}
              className={loading ? "animate-spin" : ""}
            />
          </button>


          {/* ADD DEPARTMENT */}

          <Link
            href="/admin/department/add"
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-[#0000FF]
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              shadow-[0_4px_12px_rgba(0,0,255,0.18)]
              transition-all
              hover:bg-[#0000DD]
            "
          >
            <Plus size={18} />
            Add Department
          </Link>

        </div>

      </div>


      {/* =====================================================
          SEARCH
      ====================================================== */}

      <div
        className="
          mb-5
          rounded-2xl
          border border-[#DADAFF]
          bg-white
          p-4
          shadow-[0_2px_10px_rgba(0,0,255,0.04)]
        "
      >

        <div className="flex items-center">

          <div className="relative w-full md:w-96">

            <Search
              size={18}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-[#888888]
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search department..."
              className="
                w-full
                rounded-xl
                border border-[#DADAFF]
                bg-[#F7F7FF]
                py-2.5
                pl-10
                pr-4
                text-sm
                text-[#202020]
                outline-none
                transition-all
                placeholder:text-[#999999]
                focus:border-[#7777FF]
                focus:bg-white
                focus:ring-4
                focus:ring-[#0000FF]/10
              "
            />

          </div>

        </div>

      </div>


      {/* =====================================================
          TABLE CARD
      ====================================================== */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border border-[#DADAFF]
          bg-white
          shadow-[0_2px_12px_rgba(0,0,255,0.05)]
        "
      >

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            {/* =================================================
                TABLE HEAD
            ================================================== */}

            <thead
              className="
                border-b
                border-[#DADAFF]
                bg-[#F5F5FF]
              "
            >

              <tr className="text-left text-[#555555]">

                {/* IMAGE */}

                <th className="px-5 py-4 text-center font-semibold">
                  Image
                </th>


                {/* DEPARTMENT */}

                <th className="px-5 py-4 font-semibold">
                  Department
                </th>


                {/* CODE */}

                <th className="px-5 py-4 font-semibold">
                  Code
                </th>


                {/* HEAD DOCTOR */}

                <th className="px-5 py-4 font-semibold">
                  Head Doctor
                </th>


                {/* DOCTORS */}

                <th className="px-5 py-4 text-center font-semibold">
                  Doctors
                </th>


                {/* LOCATION */}

                <th className="px-5 py-4 font-semibold">
                  Location
                </th>


                {/* ACTIONS */}

                <th className="px-5 py-4 text-center font-semibold">
                  Actions
                </th>

              </tr>

            </thead>


            {/* =================================================
                TABLE BODY
            ================================================== */}

            <tbody>

              {/* =================================================
                  LOADING
              ================================================== */}

              {loading && (
                <tr>

                  <td
                    colSpan={7}
                    className="px-5 py-14 text-center text-[#888888]"
                  >

                    <div className="flex flex-col items-center gap-3">

                      <RefreshCw
                        size={22}
                        className="animate-spin text-[#0000FF]"
                      />

                      <span>
                        Loading departments...
                      </span>

                    </div>

                  </td>

                </tr>
              )}


              {/* =================================================
                  ERROR
              ================================================== */}

              {!loading && error && (
                <tr>

                  <td
                    colSpan={7}
                    className="px-5 py-14 text-center"
                  >

                    <p className="mb-3 text-red-500">
                      {error}
                    </p>

                    <button
                      type="button"
                      onClick={fetchDepartments}
                      className="
                        rounded-xl
                        border border-[#DADAFF]
                        bg-white
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-[#555555]
                        transition
                        hover:bg-[#F1F1FF]
                        hover:text-[#0000FF]
                      "
                    >
                      Try Again
                    </button>

                  </td>

                </tr>
              )}


              {/* =================================================
                  EMPTY
              ================================================== */}

              {!loading &&
                !error &&
                filteredDepartments.length === 0 && (
                  <tr>

                    <td
                      colSpan={7}
                      className="
                        px-5
                        py-14
                        text-center
                        text-[#888888]
                      "
                    >

                      {departments.length === 0
                        ? "No departments found"
                        : "No departments match your search"}

                    </td>

                  </tr>
                )}


              {/* =================================================
                  DEPARTMENTS
              ================================================== */}

              {!loading &&
                !error &&
                filteredDepartments.map((department) => (

                  <tr
                    key={department._id}
                    className="
                      border-b
                      border-[#EEEEFF]
                      transition
                      last:border-0
                      hover:bg-[#FAFAFF]
                    "
                  >

                    {/* =================================================
                        IMAGE
                    ================================================== */}

                    <td className="px-5 py-4">

                      <div className="flex items-center justify-center">

                        {department.image ? (

                          <img
                            src={getDepartmentImage(
                              department.image
                            )}
                            alt={
                              department.name ||
                              "Department"
                            }
                            className="
                              h-12
                              w-12
                              rounded-xl
                              border
                              border-[#DADAFF]
                              object-cover
                              shadow-sm
                            "
                          />

                        ) : (

                          <div
                            className="
                              flex
                              h-12
                              w-12
                              items-center
                              justify-center
                              rounded-xl
                              bg-[#E8E8FF]
                              text-[#0000FF]
                            "
                          >
                            <ImageIcon size={18} />
                          </div>

                        )}

                      </div>

                    </td>


                    {/* =================================================
                        DEPARTMENT
                    ================================================== */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div>

                          <div
                            className="
                              font-semibold
                              text-[#202020]
                            "
                          >
                            {department.name || "-"}
                          </div>


                          {department.description && (
                            <div
                              className="
                                mt-1
                                max-w-xs
                                truncate
                                text-xs
                                text-[#888888]
                              "
                            >
                              {department.description}
                            </div>
                          )}

                        </div>

                      </div>

                    </td>


                    {/* =================================================
                        CODE
                    ================================================== */}

                    <td className="px-5 py-4">

                      <span
                        className="
                          inline-flex
                          rounded-lg
                          bg-[#EEEEFF]
                          px-2.5
                          py-1
                          text-xs
                          font-semibold
                          text-[#0000FF]
                        "
                      >
                        {department.code || "-"}
                      </span>

                    </td>


                    {/* =================================================
                        HEAD DOCTOR
                    ================================================== */}

                    <td className="px-5 py-4 text-[#555555]">

                      {department.headDoctor ||
                        "Not Assigned"}

                    </td>


                    {/* =================================================
                        DOCTORS
                    ================================================== */}

                    <td className="px-5 py-4 text-center">

                      <span
                        className="
                          inline-flex
                          min-w-8
                          items-center
                          justify-center
                          rounded-lg
                          bg-[#F0F0FF]
                          px-2.5
                          py-1
                          text-xs
                          font-semibold
                          text-[#0000FF]
                        "
                      >
                        {Array.isArray(
                          department.doctors
                        )
                          ? department.doctors.length
                          : department.doctorCount || 0}
                      </span>

                    </td>


                    {/* =================================================
                        LOCATION
                    ================================================== */}

                    <td className="px-5 py-4 text-[#666666]">

                      {department.location || "-"}

                    </td>


                    {/* =================================================
                        ACTIONS
                    ================================================== */}

                    <td className="px-5 py-4">

                      <div className="flex items-center justify-center gap-1">

                        {/* VIEW */}

                        <Link
                          href={`/admin/department/${department._id}`}
                          title="View Department"
                          className="
                            rounded-lg
                            p-2
                            text-[#777777]
                            transition
                            hover:bg-[#E8E8FF]
                            hover:text-[#0000FF]
                          "
                        >
                          <Eye size={17} />
                        </Link>


                        {/* EDIT */}

                        <Link
                          href={`/admin/department/edit/${department._id}`}
                          title="Edit Department"
                          className="
                            rounded-lg
                            p-2
                            text-[#777777]
                            transition
                            hover:bg-[#FFF7E8]
                            hover:text-[#C58A32]
                          "
                        >
                          <Pencil size={17} />
                        </Link>


                        {/* DELETE */}

                        <Delete
                          id={department._id}
                          endpoint="departments"
                        />

                      </div>

                    </td>

                  </tr>

                ))}

            </tbody>

          </table>

        </div>


        {/* =====================================================
            FOOTER
        ====================================================== */}

        <div
          className="
            flex
            flex-col
            items-center
            justify-between
            gap-3
            border-t
            border-[#DADAFF]
            bg-[#FCFCFF]
            px-5
            py-4
            md:flex-row
          "
        >

          <p className="text-sm text-[#666666]">

            Showing{" "}

            <span className="font-semibold text-[#202020]">
              {filteredDepartments.length}
            </span>{" "}

            of{" "}

            <span className="font-semibold text-[#202020]">
              {departments.length}
            </span>{" "}

            departments

          </p>


          <div className="flex gap-2">

            <button
              type="button"
              disabled
              className="
                cursor-not-allowed
                rounded-lg
                border border-[#DADAFF]
                px-3
                py-1.5
                text-sm
                text-[#C4C4C4]
              "
            >
              Previous
            </button>


            <button
              type="button"
              className="
                rounded-lg
                bg-[#0000FF]
                px-3
                py-1.5
                text-sm
                font-semibold
                text-white
                shadow-sm
              "
            >
              1
            </button>


            <button
              type="button"
              disabled
              className="
                cursor-not-allowed
                rounded-lg
                border border-[#DADAFF]
                px-3
                py-1.5
                text-sm
                text-[#C4C4C4]
              "
            >
              Next
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

