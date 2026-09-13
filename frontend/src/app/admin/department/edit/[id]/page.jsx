"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Image as ImageIcon,
  Save,
  Loader2,
} from "lucide-react";

import {
  getdepartments
  ,
  updateDepartment,
} from "@/app/components/utils/Api-call/get_api";

export default function EditDepartmentPage() {
  const params = useParams();
  const router = useRouter();

  const departmentId = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [department, setDepartment] = useState({
    name: "",
    code: "",
    description: "",
    location: "",
    headDoctor: "",
    image: "",
  });

  const [newImage, setNewImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  // ==========================================
  // IMAGE BASE URL
  // ==========================================

  const IMAGE_BASE_URL =
    "http://localhost:5000/departments";

  // ==========================================
  // GET IMAGE URL
  // ==========================================

  const getImageUrl = (image) => {
    if (!image) return "";

    return `${IMAGE_BASE_URL}/${image}`;
  };

  // ==========================================
  // FETCH DEPARTMENT
  // ==========================================

  useEffect(() => {
    if (!departmentId) return;

    const fetchDepartment = async () => {
      try {
        setLoading(true);

        const response = await getdepartment();

        const departments = response?.data || [];

        const foundDepartment = departments.find(
          (item) => item._id === departmentId
        );

        if (!foundDepartment) {
          alert("Department not found");
          router.push("/admin/department");
          return;
        }

        setDepartment({
          name: foundDepartment.name || "",
          code: foundDepartment.code || "",
          description:
            foundDepartment.description || "",
          location:
            foundDepartment.location || "",
          headDoctor:
            foundDepartment.headDoctor || "",
          image:
            foundDepartment.image || "",
        });

        setPreviewImage(
          getImageUrl(foundDepartment.image)
        );

      } catch (error) {
        console.error(
          "FETCH DEPARTMENT ERROR:",
          error
        );

        alert(
          error?.response?.data?.message ||
            "Failed to load department"
        );

      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [departmentId, router]);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDepartment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // HANDLE IMAGE
  // ==========================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Allowed image types
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Only JPG, JPEG, PNG and WEBP images are allowed"
      );

      e.target.value = "";
      return;
    }

    // Max 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be less than 2MB");

      e.target.value = "";
      return;
    }

    setNewImage(file);

    // Create preview
    const imageUrl =
      URL.createObjectURL(file);

    setPreviewImage(imageUrl);
  };

  // ==========================================
  // HANDLE UPDATE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const data = {
        name: department.name,
        code: department.code,
        description: department.description,
        location: department.location,
        headDoctor: department.headDoctor,
        image: newImage,
      };

      const response = await updateDepartment(
        departmentId,
        data
      );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Failed to update department"
        );
      }

      alert(
        "Department updated successfully"
      );

      router.push("/admin/department");

    } catch (error) {
      console.error(
        "UPDATE DEPARTMENT ERROR:",
        error
      );

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update department"
      );

    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#0000FF]">
          <Loader2
            size={22}
            className="animate-spin"
          />

          <span className="font-medium">
            Loading department...
          </span>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-[#F7F9FC] p-6">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="mb-6 flex items-center justify-between">

        <div>
          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/department"
              )
            }
            className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#0000FF]"
          >
            <ArrowLeft size={17} />

            Back to Departments
          </button>

          <h1 className="text-2xl font-bold text-gray-900">
            Edit Department
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Update department information
          </p>
        </div>

      </div>


      {/* ======================================
          FORM CARD
      ====================================== */}

      <div className="mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-white shadow-sm">

        <form
          onSubmit={handleSubmit}
          className="p-6"
        >

          {/* ====================================
              DEPARTMENT IMAGE
          ==================================== */}

          <div className="mb-8">

            <label className="mb-3 block text-sm font-semibold text-gray-800">
              Department Image
            </label>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

              {/* IMAGE PREVIEW */}

              <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#DADAFF] bg-[#F0F1FF]">

                {previewImage ? (
                  <img
                    src={previewImage}
                    alt={
                      department.name ||
                      "Department"
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon
                    size={35}
                    className="text-[#0000FF]"
                  />
                )}

              </div>


              {/* UPLOAD */}

              <div>
                <label
                  htmlFor="departmentImage"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#0000FF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <ImageIcon size={17} />

                  Choose New Image
                </label>

                <input
                  id="departmentImage"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={
                    handleImageChange
                  }
                  className="hidden"
                />

                <p className="mt-2 text-xs text-gray-500">
                  JPG, JPEG, PNG or WEBP ·
                  Maximum 2MB
                </p>

                {newImage && (
                  <p className="mt-1 text-xs font-medium text-green-600">
                    New image selected:{" "}
                    {newImage.name}
                  </p>
                )}

              </div>

            </div>

          </div>


          {/* ====================================
              FORM GRID
          ==================================== */}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {/* NAME */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Department Name
              </label>

              <div className="relative">

                <Building2
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="name"
                  value={department.name}
                  onChange={handleChange}
                  placeholder="Enter department name"
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#0000FF] focus:ring-2 focus:ring-blue-100"
                  required
                />

              </div>
            </div>


            {/* CODE */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Department Code
              </label>

              <input
                type="text"
                name="code"
                value={department.code}
                onChange={handleChange}
                placeholder="Enter department code"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm uppercase outline-none transition focus:border-[#0000FF] focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>


            {/* HEAD DOCTOR */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Head Doctor
              </label>

              <input
                type="text"
                name="headDoctor"
                value={
                  department.headDoctor
                }
                onChange={handleChange}
                placeholder="Enter head doctor name"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0000FF] focus:ring-2 focus:ring-blue-100"
              />
            </div>


            {/* LOCATION */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={department.location}
                onChange={handleChange}
                placeholder="Enter department location"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0000FF] focus:ring-2 focus:ring-blue-100"
              />
            </div>


            {/* DESCRIPTION */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Description
              </label>

              <textarea
                name="description"
                value={
                  department.description
                }
                onChange={handleChange}
                placeholder="Enter department description"
                rows={5}
                className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0000FF] focus:ring-2 focus:ring-blue-100"
              />

            </div>

          </div>


          {/* ====================================
              ACTIONS
          ==================================== */}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/department"
                )
              }
              disabled={saving}
              className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#0000FF] px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {saving ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Updating...
                </>
              ) : (
                <>
                  <Save size={18} />

                  Update Department
                </>
              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}