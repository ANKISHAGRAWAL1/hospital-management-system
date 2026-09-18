"use client";

import { useEffect, useRef, useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  CalendarDays,
  MapPin,
  Droplets,
  ShieldCheck,
  Camera,
  Save,
  Loader2,
  HeartPulse,
  UsersRound,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import {
  getPatientProfile,
  updatePatientProfile,
} from "@/app/components/utils/Api-call/patient/profile-api";

const SERVER_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/?$/, "") ||
  "http://localhost:5000";

const getProfileImage = (image) => {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  return `${SERVER_URL}/${image.replace(/^\/+/, "")}`;
};

const getDateValue = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toISOString().split("T")[0];
};

export default function PatientProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    profileImage: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const response = await getPatientProfile();
      const data = response?.data;

      if (!data) {
        toast.error("Patient profile not found");
        return;
      }

      setProfile({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        dateOfBirth: getDateValue(data.dateOfBirth),
        gender: data.gender || "",
        bloodGroup: data.bloodGroup || "",
        address: data.address || "",
        emergencyContactName: data.emergencyContact?.name || "",
        emergencyContactPhone: data.emergencyContact?.phone || "",
        emergencyContactRelationship:
          data.emergencyContact?.relationship || "",
        profileImage: data.profileImage || "",
      });

      if (data.profileImage) {
        setPreviewImage(getProfileImage(data.profileImage));
      }
    } catch (error) {
      console.error("LOAD PATIENT PROFILE ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load patient profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB");
      return;
    }

    setSelectedImage(file);

    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!profile.name.trim()) {
      toast.error("Patient name is required");
      return;
    }

    if (!profile.email.trim()) {
      toast.error("Email is required");
      return;
    }

    const formData = new FormData();

    formData.append("name", profile.name.trim());
    formData.append("email", profile.email.trim());
    formData.append("phone", profile.phone.trim());
    formData.append("dateOfBirth", profile.dateOfBirth || "");
    formData.append("gender", profile.gender || "");
    formData.append("bloodGroup", profile.bloodGroup || "");
    formData.append("address", profile.address.trim());

    formData.append(
      "emergencyContactName",
      profile.emergencyContactName.trim()
    );

    formData.append(
      "emergencyContactPhone",
      profile.emergencyContactPhone.trim()
    );

    formData.append(
      "emergencyContactRelationship",
      profile.emergencyContactRelationship.trim()
    );

    if (selectedImage) {
      formData.append("profileImage", selectedImage);
    }

    try {
      setSaving(true);

      const response = await updatePatientProfile(formData);

      const updatedData = response?.data;

      if (updatedData) {
        setProfile({
          name: updatedData.name || "",
          email: updatedData.email || "",
          phone: updatedData.phone || "",
          dateOfBirth: getDateValue(updatedData.dateOfBirth),
          gender: updatedData.gender || "",
          bloodGroup: updatedData.bloodGroup || "",
          address: updatedData.address || "",
          emergencyContactName:
            updatedData.emergencyContact?.name || "",
          emergencyContactPhone:
            updatedData.emergencyContact?.phone || "",
          emergencyContactRelationship:
            updatedData.emergencyContact?.relationship || "",
          profileImage: updatedData.profileImage || "",
        });

        if (updatedData.profileImage) {
          setPreviewImage(getProfileImage(updatedData.profileImage));
        }
      }

      setSelectedImage(null);

      toast.success(
        response?.message || "Profile updated successfully"
      );
    } catch (error) {
      console.error("SAVE PATIENT PROFILE ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const getInitials = () => {
    if (!profile.name) return "P";

    return profile.name
      .trim()
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
          <p className="text-sm text-slate-500">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-teal-600 hover:border-teal-200 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              My Profile
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your personal and emergency contact information
            </p>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-teal-600 to-cyan-600" />

                <div className="px-6 pb-6">
                  <div className="relative -mt-12 flex justify-center">
                    <div className="relative">
                      <div className="w-28 h-28 rounded-full bg-white p-1.5 shadow-lg">
                        <div className="w-full h-full rounded-full overflow-hidden bg-teal-50 flex items-center justify-center">
                          {previewImage ? (
                            <img
                              src={previewImage}
                              alt="Patient profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-3xl font-bold text-teal-600">
                              {getInitials()}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute right-0 bottom-1 w-9 h-9 rounded-full bg-teal-600 text-white border-4 border-white flex items-center justify-center hover:bg-teal-700 transition shadow-sm"
                      >
                        <Camera className="w-4 h-4" />
                      </button>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    <h2 className="text-xl font-bold text-slate-900">
                      {profile.name || "Patient"}
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      {profile.email || "Patient Account"}
                    </p>

                    <div className="inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Patient Account
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
                        <Mail className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400">
                          Email
                        </p>
                        <p className="text-sm text-slate-700 truncate">
                          {profile.email || "Not added"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
                        <Phone className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">
                          Phone
                        </p>
                        <p className="text-sm text-slate-700">
                          {profile.phone || "Not added"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full mt-6 h-10 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Change Profile Photo
                  </button>

                  <p className="text-[11px] text-center text-slate-400 mt-2">
                    JPG, PNG or WEBP · Max 5 MB
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                    <UserRound className="w-5 h-5 text-teal-600" />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Personal Information
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Keep your personal details up to date
                    </p>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField
                    label="Full Name"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    icon={<UserRound />}
                    required
                  />

                  <InputField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    icon={<Mail />}
                    required
                  />

                  <InputField
                    label="Phone Number"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    icon={<Phone />}
                  />

                  <InputField
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={handleChange}
                    icon={<CalendarDays />}
                  />

                  <SelectField
                    label="Gender"
                    name="gender"
                    value={profile.gender}
                    onChange={handleChange}
                    options={[
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                      { value: "other", label: "Other" },
                    ]}
                  />

                  <SelectField
                    label="Blood Group"
                    name="bloodGroup"
                    value={profile.bloodGroup}
                    onChange={handleChange}
                    options={[
                      { value: "A+", label: "A+" },
                      { value: "A-", label: "A-" },
                      { value: "B+", label: "B+" },
                      { value: "B-", label: "B-" },
                      { value: "AB+", label: "AB+" },
                      { value: "AB-", label: "AB-" },
                      { value: "O+", label: "O+" },
                      { value: "O-", label: "O-" },
                    ]}
                    icon={<Droplets />}
                  />

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Address
                    </label>

                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />

                      <textarea
                        name="address"
                        value={profile.address}
                        onChange={handleChange}
                        placeholder="Enter your address"
                        rows={4}
                        className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-50 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                    <HeartPulse className="w-5 h-5 text-rose-600" />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Emergency Contact
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Someone we can contact in an emergency
                    </p>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField
                    label="Contact Name"
                    name="emergencyContactName"
                    value={profile.emergencyContactName}
                    onChange={handleChange}
                    placeholder="Enter contact name"
                    icon={<UsersRound />}
                  />

                  <InputField
                    label="Contact Phone"
                    name="emergencyContactPhone"
                    value={profile.emergencyContactPhone}
                    onChange={handleChange}
                    placeholder="Enter contact phone"
                    icon={<Phone />}
                  />

                  <InputField
                    label="Relationship"
                    name="emergencyContactRelationship"
                    value={profile.emergencyContactRelationship}
                    onChange={handleChange}
                    placeholder="e.g. Father, Mother, Brother"
                    icon={<UsersRound />}
                  />
                </div>
              </section>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Save your changes
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Your updated information will be saved securely.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto min-w-[160px] h-11 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white text-sm font-semibold flex items-center justify-center gap-2 transition shadow-sm"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  required = false,
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon &&
            typeof icon.type !== "undefined" &&
            Object.cloneElement?.(icon, {
              className: "w-4 h-4",
            })}
        </div>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full h-11 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-50"
        />
      </div>
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  icon,
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {Object.cloneElement?.(icon, {
              className: "w-4 h-4",
            })}
          </div>
        )}

        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full h-11 rounded-xl border border-slate-200 bg-white ${
            icon ? "pl-10" : "pl-4"
          } pr-4 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-50`}
        >
          <option value="">Select {label}</option>

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}