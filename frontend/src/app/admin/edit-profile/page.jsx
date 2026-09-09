"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  LockKeyhole,
  Save,
  X,
  Camera,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function EditProfilePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "Admin",
    email: "admin@yashhospital.com",
    phone: "+91 98765 43210",
    department: "Hospital Administration",
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove field error while typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    setSuccess(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Mobile number is required";
    } else if (!/^[+0-9\s-]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid mobile number";
    }

    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      /*
        API will be connected here later.

        Example:

        const response = await updateAdminProfile(formData);

      */

      await new Promise((resolve) => setTimeout(resolve, 800));

      setSuccess(true);

      setTimeout(() => {
        router.push("/admin/profile");
      }, 1000);
    } catch (error) {
      console.error("Profile update error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/profile");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}
      <div className="mb-6">

        <button
          type="button"
          onClick={handleCancel}
          className="
            mb-4
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-slate-500
            transition
            hover:text-blue-600
          "
        >
          <ArrowLeft size={17} />
          Back to Profile
        </button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              Edit Profile
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Update your personal and account information
            </p>
          </div>

          <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
            <ShieldCheck size={15} />
            Secure account settings
          </div>
        </div>
      </div>

      {/* =====================================================
          SUCCESS MESSAGE
      ===================================================== */}
      {success && (
        <div
          className="
            mb-6
            flex items-center gap-3
            rounded-xl
            border border-emerald-200
            bg-emerald-50
            px-4 py-3
            text-sm
            text-emerald-700
          "
        >
          <CheckCircle2 size={18} />

          <div>
            <p className="font-semibold">
              Profile updated successfully
            </p>

            <p className="mt-0.5 text-xs text-emerald-600">
              Redirecting to your profile...
            </p>
          </div>
        </div>
      )}

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <form onSubmit={handleSubmit}>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* =================================================
              LEFT SIDE
          ================================================= */}
          <div className="space-y-6 xl:col-span-2">

            {/* ===============================================
                PROFILE PHOTO
            =============================================== */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                <h2 className="text-sm font-bold text-slate-800">
                  Profile Photo
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Update your profile picture
                </p>
              </div>

              <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">

                {/* Avatar */}
                <div className="relative">

                  <div
                    className="
                      flex h-24 w-24
                      items-center justify-center
                      rounded-2xl
                      bg-blue-50
                      text-blue-600
                      ring-1 ring-blue-100
                    "
                  >
                    <UserRound
                      size={42}
                      strokeWidth={1.6}
                    />
                  </div>

                  {/* Camera Button */}
                  <button
                    type="button"
                    title="Change profile photo"
                    className="
                      absolute
                      -bottom-2
                      -right-2
                      flex h-9 w-9
                      items-center justify-center
                      rounded-full
                      border-4
                      border-white
                      bg-blue-600
                      text-white
                      shadow-md
                      transition
                      hover:bg-blue-700
                    "
                  >
                    <Camera size={15} />
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    Admin
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    JPG, PNG or WEBP. Maximum file size 2MB.
                  </p>

                  <button
                    type="button"
                    className="
                      mt-3
                      rounded-lg
                      border border-slate-300
                      bg-white
                      px-3 py-2
                      text-xs
                      font-semibold
                      text-slate-700
                      transition
                      hover:bg-slate-50
                    "
                  >
                    Choose Photo
                  </button>
                </div>
              </div>
            </section>

            {/* ===============================================
                PERSONAL INFORMATION
            =============================================== */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex h-9 w-9
                      items-center justify-center
                      rounded-lg
                      bg-blue-50
                      text-blue-600
                    "
                  >
                    <UserRound size={18} />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-slate-800">
                      Personal Information
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Update your basic personal details
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">

                {/* Full Name */}
                <FormField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  icon={UserRound}
                  placeholder="Enter full name"
                  error={errors.name}
                  required
                />

                {/* Email */}
                <FormField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  icon={Mail}
                  placeholder="Enter email address"
                  error={errors.email}
                  required
                />

                {/* Phone */}
                <FormField
                  label="Mobile Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  icon={Phone}
                  placeholder="Enter mobile number"
                  error={errors.phone}
                  required
                />

                {/* Department */}
                <FormField
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  icon={Building2}
                  placeholder="Enter department"
                  error={errors.department}
                  required
                />
              </div>
            </section>

            {/* ===============================================
                ACCOUNT INFORMATION
            =============================================== */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex h-9 w-9
                      items-center justify-center
                      rounded-lg
                      bg-slate-100
                      text-slate-600
                    "
                  >
                    <ShieldCheck size={18} />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-slate-800">
                      Account Information
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      System managed account details
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">

                {/* Role */}
                <ReadOnlyField
                  label="Role"
                  value="Administrator"
                  icon={ShieldCheck}
                />

                {/* Username */}
                <ReadOnlyField
                  label="Username"
                  value="admin"
                  icon={UserRound}
                />

                {/* Account Status */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-600">
                    Account Status
                  </label>

                  <div
                    className="
                      flex h-11
                      items-center
                      justify-between
                      rounded-lg
                      border border-emerald-200
                      bg-emerald-50
                      px-3
                    "
                  >
                    <div className="flex items-center gap-3">

                      <CheckCircle2
                        size={16}
                        className="text-emerald-600"
                      />

                      <span className="text-sm font-semibold text-emerald-700">
                        Active
                      </span>
                    </div>

                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                </div>

                {/* Created Date */}
                <ReadOnlyField
                  label="Account Created"
                  value="08 September 2026"
                  icon={Building2}
                />
              </div>
            </section>
          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}
          <div className="space-y-6">

            {/* ===============================================
                SECURITY CARD
            =============================================== */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex h-9 w-9
                      items-center justify-center
                      rounded-lg
                      bg-blue-50
                      text-blue-600
                    "
                  >
                    <LockKeyhole size={18} />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-slate-800">
                      Security
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Protect your account
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-5">

                {/* Password */}
                <div className="rounded-xl border border-slate-200 p-4">

                  <div className="flex items-start gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <LockKeyhole size={17} />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">
                        Password
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Keep your password secure and updated.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push("/admin/change-password")}
                    className="
                      mt-4
                      w-full
                      rounded-lg
                      border border-slate-300
                      bg-white
                      px-3 py-2.5
                      text-xs
                      font-semibold
                      text-slate-700
                      transition
                      hover:border-blue-300
                      hover:bg-blue-50
                      hover:text-blue-600
                    "
                  >
                    Change Password
                  </button>
                </div>

                {/* Two Factor */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">

                  <div className="flex items-start gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <ShieldCheck size={17} />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">
                        Two-Factor Authentication
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Add an additional layer of security to your account.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-lg bg-white px-3 py-2.5">

                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />

                      <span className="text-xs font-semibold text-emerald-700">
                        Protected
                      </span>
                    </div>

                    <ShieldCheck
                      size={15}
                      className="text-emerald-600"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* ===============================================
                SECURITY NOTICE
            =============================================== */}
            <div
              className="
                rounded-2xl
                border border-blue-100
                bg-blue-50
                p-5
              "
            >
              <div className="flex gap-3">

                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <div>
                  <h3 className="text-sm font-semibold text-blue-800">
                    Security Notice
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-blue-700">
                    Never share your password or login credentials with
                    anyone. Hospital administration accounts have access
                    to sensitive system information.
                  </p>
                </div>
              </div>
            </div>

            {/* ===============================================
                SAVE BUTTONS
            =============================================== */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <button
                type="submit"
                disabled={saving}
                className="
                  flex w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-blue-600
                  px-4 py-3
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-blue-700
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                <Save size={17} />

                {saving ? "Saving Changes..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="
                  mt-2
                  flex w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border border-slate-300
                  bg-white
                  px-4 py-3
                  text-sm
                  font-semibold
                  text-slate-600
                  transition
                  hover:bg-slate-50
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                <X size={17} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}


/* =========================================================
   FORM FIELD
========================================================= */

function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  icon: Icon,
  placeholder,
  error,
  required = false,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-semibold text-slate-600"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <div className="relative">

        <Icon
          size={16}
          className={`
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            ${
              error
                ? "text-red-500"
                : "text-slate-400"
            }
          `}
        />

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            h-11
            w-full
            rounded-lg
            border
            bg-white
            pl-10
            pr-3
            text-sm
            font-medium
            text-slate-700
            outline-none
            transition

            ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                : "border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            }
          `}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}


/* =========================================================
   READ ONLY FIELD
========================================================= */

function ReadOnlyField({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-600">
        {label}
      </label>

      <div
        className="
          flex h-11
          items-center
          gap-3
          rounded-lg
          border border-slate-200
          bg-slate-50
          px-3
        "
      >
        <Icon
          size={16}
          className="text-slate-400"
        />

        <span className="truncate text-sm font-medium text-slate-600">
          {value}
        </span>
      </div>
    </div>
  );
}