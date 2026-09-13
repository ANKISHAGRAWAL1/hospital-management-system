"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Save,
  Building2,
  Upload,
  Image as ImageIcon,
  X,
  MapPin,
  UserRound,
  FileText,
  Hash,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { notify } from "@/app/components/healper";
import { createDepartment } from "@/app/components/utils/Api-call/get_api";

export default function AddDepartmentPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    headDoctor: "",
    location: "",
    description: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState("");
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
  // HANDLE IMAGE
  // =========================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // File type validation
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      notify("Only JPG, JPEG, PNG and WEBP images are allowed", false);
      return;
    }

    // 2MB validation
    if (file.size > 2 * 1024 * 1024) {
      notify("Image size must be less than 2MB", false);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  };

  // =========================================================
  // REMOVE IMAGE
  // =========================================================

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));

    setImagePreview("");
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      notify("Department name is required", false);
      return;
    }

    if (!formData.code.trim()) {
      notify("Department code is required", false);
      return;
    }

    if (!formData.image) {
      notify("Department image is required", false);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        headDoctor: formData.headDoctor.trim(),
        location: formData.location.trim(),
        description: formData.description.trim(),
        image: formData.image,
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
        response?.message || "Department created successfully",
        true
      );

      setTimeout(() => {
        router.push("/admin/department");
      }, 800);
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
    <div className="min-h-screen bg-[#F5F9FC] px-4 py-5 text-[#172B4D] sm:px-6 lg:px-8">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="mx-auto mb-6 max-w-6xl">
        <div className="flex items-center gap-4">

          <Link
            href="/admin/department"
            className="
              flex h-10 w-10 shrink-0 items-center justify-center
              rounded-xl border border-[#D9E3EC]
              bg-white text-[#607086]
              shadow-sm transition
              hover:border-[#0B7FAB]
              hover:bg-[#F0F8FC]
              hover:text-[#0B7FAB]
            "
          >
            <ArrowLeft size={19} />
          </Link>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#172B4D] sm:text-2xl">
              Add Department
            </h1>

            <p className="mt-1 text-sm text-[#718096]">
              Create and configure a new hospital department
            </p>
          </div>

        </div>
      </div>

      {/* =====================================================
          MAIN FORM
      ====================================================== */}

      <div className="mx-auto max-w-6xl">

        <form
          onSubmit={handleSubmit}
          className="
            overflow-hidden rounded-2xl
            border border-[#DCE6EF]
            bg-white shadow-[0_4px_20px_rgba(25,55,90,0.06)]
          "
        >

          {/* =================================================
              FORM HEADER
          ================================================= */}

          <div className="border-b border-[#E4EBF2] bg-[#F9FBFD] px-5 py-5 sm:px-7">

            <div className="flex items-center gap-3">

              <div
                className="
                  flex h-11 w-11 items-center justify-center
                  rounded-xl bg-[#E7F4FA] text-[#0B7FAB]
                "
              >
                <Building2 size={21} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-[#172B4D]">
                  Department Information
                </h2>

                <p className="mt-0.5 text-xs text-[#7A8797]">
                  Add department details and profile image
                </p>
              </div>

            </div>

          </div>

          {/* =================================================
              FORM BODY
          ================================================= */}

          <div className="p-5 sm:p-7">

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">

              {/* =================================================
                  IMAGE SECTION
              ================================================= */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-[#344054]">
                  Department Image
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <div
                  className="
                    relative overflow-hidden rounded-2xl
                    border border-[#D9E3EC]
                    bg-[#F8FAFC]
                  "
                >

                  {imagePreview ? (
                    <div className="relative aspect-square w-full">

                      <img
                        src={imagePreview}
                        alt="Department preview"
                        className="h-full w-full object-cover"
                      />

                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent px-3 pb-3 pt-10">

                        <label
                          htmlFor="department-image"
                          className="
                            cursor-pointer rounded-lg
                            bg-white/95 px-3 py-2
                            text-xs font-semibold text-[#172B4D]
                            shadow-sm transition hover:bg-white
                          "
                        >
                          Change Image
                        </label>

                        <button
                          type="button"
                          onClick={removeImage}
                          className="
                            flex h-9 w-9 items-center justify-center
                            rounded-lg bg-red-500 text-white
                            transition hover:bg-red-600
                          "
                          title="Remove image"
                        >
                          <X size={17} />
                        </button>

                      </div>

                    </div>
                  ) : (
                    <label
                      htmlFor="department-image"
                      className="
                        flex aspect-square cursor-pointer
                        flex-col items-center justify-center
                        px-5 text-center
                        transition hover:bg-[#F1F8FC]
                      "
                    >

                      <div
                        className="
                          mb-4 flex h-16 w-16 items-center justify-center
                          rounded-2xl bg-[#E7F4FA] text-[#0B7FAB]
                        "
                      >
                        <ImageIcon size={29} />
                      </div>

                      <p className="text-sm font-semibold text-[#344054]">
                        Upload Department Image
                      </p>

                      <p className="mt-1 text-xs text-[#8793A3]">
                        JPG, PNG or WEBP
                      </p>

                      <p className="mt-0.5 text-xs text-[#8793A3]">
                        Maximum size 2MB
                      </p>

                      <span
                        className="
                          mt-4 inline-flex items-center gap-2
                          rounded-lg bg-[#0B7FAB]
                          px-4 py-2.5 text-xs font-semibold text-white
                          shadow-sm transition hover:bg-[#096B91]
                        "
                      >
                        <Upload size={14} />
                        Choose Image
                      </span>

                    </label>
                  )}

                  <input
                    id="department-image"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    disabled={loading}
                    className="hidden"
                  />

                </div>

                <p className="mt-2 text-xs leading-5 text-[#8793A3]">
                  Use a clear image representing this department.
                </p>

              </div>

              {/* =================================================
                  DETAILS SECTION
              ================================================= */}

              <div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  {/* DEPARTMENT NAME */}

                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#344054]"
                    >
                      <Building2 size={15} className="text-[#0B7FAB]" />
                      Department Name
                      <span className="text-red-500">*</span>
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
                        w-full rounded-xl
                        border border-[#D9E3EC]
                        bg-white px-4 py-3
                        text-sm text-[#172B4D]
                        outline-none transition
                        placeholder:text-[#A0AAB7]
                        focus:border-[#0B7FAB]
                        focus:ring-4 focus:ring-[#0B7FAB]/10
                        disabled:cursor-not-allowed disabled:bg-[#F5F7FA]
                      "
                    />
                  </div>

                  {/* CODE */}

                  <div>
                    <label
                      htmlFor="code"
                      className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#344054]"
                    >
                      <Hash size={15} className="text-[#0B7FAB]" />
                      Department Code
                      <span className="text-red-500">*</span>
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
                        w-full rounded-xl
                        border border-[#D9E3EC]
                        bg-white px-4 py-3
                        text-sm uppercase text-[#172B4D]
                        outline-none transition
                        placeholder:text-[#A0AAB7]
                        focus:border-[#0B7FAB]
                        focus:ring-4 focus:ring-[#0B7FAB]/10
                        disabled:cursor-not-allowed disabled:bg-[#F5F7FA]
                      "
                    />
                  </div>

                  {/* HEAD DOCTOR */}

                  <div>
                    <label
                      htmlFor="headDoctor"
                      className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#344054]"
                    >
                      <UserRound size={15} className="text-[#0B7FAB]" />
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
                        w-full rounded-xl
                        border border-[#D9E3EC]
                        bg-white px-4 py-3
                        text-sm text-[#172B4D]
                        outline-none transition
                        placeholder:text-[#A0AAB7]
                        focus:border-[#0B7FAB]
                        focus:ring-4 focus:ring-[#0B7FAB]/10
                        disabled:cursor-not-allowed disabled:bg-[#F5F7FA]
                      "
                    />

                    <p className="mt-1.5 text-xs text-[#8A96A5]">
                      Leave empty if no head doctor is assigned.
                    </p>
                  </div>

                  {/* LOCATION */}

                  <div>
                    <label
                      htmlFor="location"
                      className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#344054]"
                    >
                      <MapPin size={15} className="text-[#0B7FAB]" />
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
                        w-full rounded-xl
                        border border-[#D9E3EC]
                        bg-white px-4 py-3
                        text-sm text-[#172B4D]
                        outline-none transition
                        placeholder:text-[#A0AAB7]
                        focus:border-[#0B7FAB]
                        focus:ring-4 focus:ring-[#0B7FAB]/10
                        disabled:cursor-not-allowed disabled:bg-[#F5F7FA]
                      "
                    />
                  </div>

                </div>

                {/* DESCRIPTION */}

                <div className="mt-6">

                  <label
                    htmlFor="description"
                    className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#344054]"
                  >
                    <FileText size={15} className="text-[#0B7FAB]" />
                    Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    disabled={loading}
                    placeholder="Enter a short description about this department..."
                    className="
                      w-full resize-none rounded-xl
                      border border-[#D9E3EC]
                      bg-white px-4 py-3
                      text-sm text-[#172B4D]
                      outline-none transition
                      placeholder:text-[#A0AAB7]
                      focus:border-[#0B7FAB]
                      focus:ring-4 focus:ring-[#0B7FAB]/10
                      disabled:cursor-not-allowed disabled:bg-[#F5F7FA]
                    "
                  />

                  <p className="mt-1.5 text-xs text-[#8A96A5]">
                    Briefly describe the services or treatment provided by
                    this department.
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div
            className="
              flex flex-col-reverse gap-3
              border-t border-[#E4EBF2]
              bg-[#FAFCFE]
              px-5 py-4
              sm:flex-row sm:items-center sm:justify-end sm:px-7
            "
          >

            <Link
              href="/admin/department"
              className="
                rounded-xl border border-[#D9E3EC]
                bg-white px-5 py-2.5
                text-center text-sm font-semibold text-[#526174]
                transition hover:bg-[#F4F7FA]
              "
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="
                flex items-center justify-center gap-2
                rounded-xl bg-[#0B7FAB]
                px-5 py-2.5
                text-sm font-semibold text-white
                shadow-[0_4px_12px_rgba(11,127,171,0.18)]
                transition hover:bg-[#096B91]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <Save
                size={17}
                className={loading ? "animate-pulse" : ""}
              />

              {loading ? "Creating..." : "Create Department"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

