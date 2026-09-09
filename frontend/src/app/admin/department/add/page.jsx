
"use client";

import { useState } from "react";
import { ArrowLeft, Save, Building2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { notify } from "@/app/components/healper";
import { createDepartment } from "@/app/components/utils/Api-call/get_api"

export default function AddDepartmentPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    headDoctor: "",
    location: "",
    description: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(false);

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required validation
    if (!formData.name.trim()) {
      notify("Department name is required", false);
      return;
    }

    if (!formData.code.trim()) {
      notify("Department code is required", false);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),

        code: formData.code.trim().toUpperCase(),

        // Empty value ko backend par mat bhejo
        ...(formData.headDoctor.trim() && {
          headDoctor: formData.headDoctor.trim(),
        }),

        location: formData.location.trim(),

        description: formData.description.trim(),

        status: formData.status,
      };

      console.log("Create Department Payload:", payload);

      const response = await createDepartment(payload);

      console.log("Create Department Response:", response);

      if (!response?.success) {
        throw new Error(
          response?.message || "Failed to create department"
        );
      }

      notify(
        response.message || "Department created successfully",
        true
      );

      router.push("/admin/department");

    } catch (error) {
      console.error("Create Department Error:", error);

      notify(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create department",
        false
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFF9FA] p-6 text-[#202728]">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="mb-7 flex items-center gap-4">

        <Link
          href="/admin/department"
          className="
            flex h-10 w-10
            items-center justify-center
            rounded-xl
            border border-[#D8E9EA]
            bg-white
            text-[#697477]
            shadow-[0_2px_8px_rgba(9,121,122,0.05)]
            transition-all
            hover:border-[#B8DADD]
            hover:bg-[#F5FBFB]
            hover:text-[#09797A]
          "
        >
          <ArrowLeft size={19} />
        </Link>

        <div>
          <h1
            className="
              text-2xl
              font-semibold
              tracking-tight
              text-[#202728]
            "
          >
            Add Department
          </h1>

          <p className="mt-1 text-sm text-[#697477]">
            Create a new hospital department
          </p>
        </div>

      </div>

      {/* =====================================================
          FORM
      ====================================================== */}

      <div className="max-w-4xl">

        <form
          onSubmit={handleSubmit}
          className="
            overflow-hidden
            rounded-2xl
            border border-[#D8E9EA]
            bg-white
            shadow-[0_2px_14px_rgba(9,121,122,0.05)]
          "
        >

          {/* FORM HEADER */}

          <div
            className="
              border-b
              border-[#D8E9EA]
              bg-[#F8FCFC]
              px-6
              py-5
            "
          >
            <div className="flex items-center gap-3">

              <div
                className="
                  flex h-10 w-10
                  items-center justify-center
                  rounded-xl
                  bg-[#D0E9EC]
                  text-[#09797A]
                "
              >
                <Building2 size={20} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-[#202728]">
                  Department Information
                </h2>

                <p className="mt-0.5 text-xs text-[#697477]">
                  Enter basic information about the department
                </p>
              </div>

            </div>
          </div>

          {/* FORM BODY */}

          <div className="p-6">

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* DEPARTMENT NAME */}

              <div>
                <label
                  htmlFor="name"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-[#3F4D4F]
                  "
                >
                  Department Name
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Cardiology"
                  disabled={loading}
                  className="
                    w-full
                    rounded-xl
                    border border-[#D8E9EA]
                    bg-[#F8FCFC]
                    px-4
                    py-3
                    text-sm
                    text-[#202728]
                    outline-none
                    transition-all
                    placeholder:text-[#9AA8A9]
                    focus:border-[#8CC9C9]
                    focus:bg-white
                    focus:ring-4
                    focus:ring-[#09797A]/10
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                />
              </div>

              {/* CODE */}

              <div>
                <label
                  htmlFor="code"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-[#3F4D4F]
                  "
                >
                  Department Code
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  id="code"
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g. CARD-01"
                  disabled={loading}
                  className="
                    w-full
                    rounded-xl
                    border border-[#D8E9EA]
                    bg-[#F8FCFC]
                    px-4
                    py-3
                    text-sm
                    uppercase
                    text-[#202728]
                    outline-none
                    transition-all
                    placeholder:text-[#9AA8A9]
                    focus:border-[#8CC9C9]
                    focus:bg-white
                    focus:ring-4
                    focus:ring-[#09797A]/10
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                />
              </div>

              {/* HEAD DOCTOR */}

              <div>
                <label
                  htmlFor="headDoctor"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-[#3F4D4F]
                  "
                >
                  Head Doctor
                </label>

                <input
                  id="headDoctor"
                  type="text"
                  name="headDoctor"
                  value={formData.headDoctor}
                  onChange={handleChange}
                  placeholder="e.g. Dr. Rahul Sharma"
                  disabled={loading}
                  className="
                    w-full
                    rounded-xl
                    border border-[#D8E9EA]
                    bg-[#F8FCFC]
                    px-4
                    py-3
                    text-sm
                    text-[#202728]
                    outline-none
                    transition-all
                    placeholder:text-[#9AA8A9]
                    focus:border-[#8CC9C9]
                    focus:bg-white
                    focus:ring-4
                    focus:ring-[#09797A]/10
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                />

                <p className="mt-1.5 text-xs text-[#8A9697]">
                  Leave empty if no head doctor is assigned.
                </p>
              </div>

              {/* LOCATION */}

              <div>
                <label
                  htmlFor="location"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-[#3F4D4F]
                  "
                >
                  Location
                </label>

                <input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. 2nd Floor"
                  disabled={loading}
                  className="
                    w-full
                    rounded-xl
                    border border-[#D8E9EA]
                    bg-[#F8FCFC]
                    px-4
                    py-3
                    text-sm
                    text-[#202728]
                    outline-none
                    transition-all
                    placeholder:text-[#9AA8A9]
                    focus:border-[#8CC9C9]
                    focus:bg-white
                    focus:ring-4
                    focus:ring-[#09797A]/10
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                />
              </div>

            </div>

            {/* DESCRIPTION */}

            <div className="mt-6">

              <label
                htmlFor="description"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-[#3F4D4F]
                "
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                disabled={loading}
                placeholder="Enter department description..."
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border border-[#D8E9EA]
                  bg-[#F8FCFC]
                  px-4
                  py-3
                  text-sm
                  text-[#202728]
                  outline-none
                  transition-all
                  placeholder:text-[#9AA8A9]
                  focus:border-[#8CC9C9]
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[#09797A]/10
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />

            </div>

            {/* STATUS */}

            <div className="mt-6">

              <label
                htmlFor="status"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-[#3F4D4F]
                "
              >
                Status
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
                className="
                  w-full
                  rounded-xl
                  border border-[#D8E9EA]
                  bg-[#F8FCFC]
                  px-4
                  py-3
                  text-sm
                  text-[#4F6062]
                  outline-none
                  transition-all
                  focus:border-[#8CC9C9]
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[#09797A]/10
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  md:w-1/2
                "
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

            </div>

          </div>

          {/* FOOTER */}

          <div
            className="
              flex
              items-center
              justify-end
              gap-3
              border-t
              border-[#D8E9EA]
              bg-[#FCFEFE]
              px-6
              py-4
            "
          >

            <Link
              href="/admin/department"
              className="
                rounded-xl
                border border-[#D8E9EA]
                bg-white
                px-5
                py-2.5
                text-sm
                font-medium
                text-[#536466]
                transition-all
                hover:border-[#B8DADD]
                hover:bg-[#EFF9FA]
                hover:text-[#075F60]
              "
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="
                flex
                items-center
                gap-2
                rounded-xl
                bg-[#09797A]
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-[0_4px_12px_rgba(9,121,122,0.16)]
                transition-all
                hover:bg-[#075F60]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <Save
                size={17}
                className={loading ? "animate-pulse" : ""}
              />

              {loading ? "Saving..." : "Add Department"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
