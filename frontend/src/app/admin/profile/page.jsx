 
"use client";

import { useEffect, useRef, useState } from "react";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Camera,
  Trash2,
  Save,
  X,
  Loader2,
  CalendarDays,
  Shield,
} from "lucide-react";

import { toast } from "react-toastify";

import {
  getAdminProfile,
  updateAdminProfile,
  uploadAdminProfileImage,
  removeAdminProfileImage,
} from "@/app/components/utils/Api-call/adminProfileApi";

export default function AdminProfilePage() {
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    profileImage: null,
    createdAt: null,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // =========================================================
  // GET ADMIN PROFILE
  // =========================================================

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await getAdminProfile();

      console.log("ADMIN PROFILE RESPONSE:", response);

      if (!response?.success) {
        throw new Error(
          response?.message || "Failed to load admin profile"
        );
      }

      /*
        Backend response can normally be:

        {
          success: true,
          data: {...}
        }

        So first try response.data.
      */

      const adminData =
        response?.data?.user ||
        response?.data?.admin ||
        response?.data ||
        {};

      setProfile({
        name: adminData?.name || "",
        email: adminData?.email || "",
        phone: adminData?.phone || "",
        role: adminData?.role || "admin",
        profileImage: adminData?.profileImage || null,
        createdAt: adminData?.createdAt || null,
      });

      setFormData({
        name: adminData?.name || "",
        email: adminData?.email || "",
        phone: adminData?.phone || "",
      });
    } catch (error) {
      console.error("GET PROFILE ERROR:", error);

      toast.error(
        error?.message ||
          error?.response?.data?.message ||
          "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // IMAGE SELECT
  // =========================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Only JPG, JPEG, PNG and WEBP images are allowed"
      );

      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");

      e.target.value = "";
      return;
    }

    // Remove old preview URL if exists
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }

    const preview = URL.createObjectURL(file);

    setSelectedFile(file);
    setPreviewImage(preview);

    toast.success("Profile image selected");
  };

  // =========================================================
  // CANCEL SELECTED IMAGE
  // =========================================================

  const handleRemoveSelectedImage = () => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }

    setPreviewImage(null);
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    toast.info("Selected image removed");
  };

  // =========================================================
  // REMOVE CURRENT PROFILE IMAGE
  // =========================================================

  const handleRemoveCurrentImage = async () => {
    try {
      const response = await removeAdminProfileImage();

      console.log("REMOVE IMAGE RESPONSE:", response);

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Failed to remove profile image"
        );
      }

      setProfile((prev) => ({
        ...prev,
        profileImage: null,
      }));

      toast.success(
        response?.message ||
          "Profile image removed successfully"
      );
    } catch (error) {
      console.error("REMOVE IMAGE ERROR:", error);

      toast.error(
        error?.message ||
          error?.response?.data?.message ||
          "Failed to remove profile image"
      );
    }
  };

  // =========================================================
  // SAVE PROFILE
  // =========================================================

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();

    if (!name) {
      toast.error("Name is required");
      return;
    }

    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (!phone) {
      toast.error("Phone number is required");
      return;
    }

    try {
      setSaving(true);

      const response = await updateAdminProfile({
        name,
        email,
        phone,
      });

      console.log("UPDATE PROFILE RESPONSE:", response);

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Failed to update profile"
        );
      }

      const updatedData =
        response?.data?.user ||
        response?.data?.admin ||
        response?.data ||
        {};

      setProfile((prev) => ({
        ...prev,
        name: updatedData?.name || name,
        email: updatedData?.email || email,
        phone: updatedData?.phone || phone,
      }));

      setFormData({
        name: updatedData?.name || name,
        email: updatedData?.email || email,
        phone: updatedData?.phone || phone,
      });

      toast.success(
        response?.message ||
          "Profile updated successfully"
      );
    } catch (error) {
      console.error("UPDATE PROFILE ERROR:", error);

      toast.error(
        error?.message ||
          error?.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // UPLOAD PROFILE IMAGE
  // =========================================================

  const handleUploadImage = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    try {
      setUploading(true);

      const data = new FormData();

      data.append("profileImage", selectedFile);

      const response =
        await uploadAdminProfileImage(data);

      console.log("UPLOAD IMAGE RESPONSE:", response);

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Failed to upload profile image"
        );
      }

      /*
        IMPORTANT:

        Never save previewImage here.

        previewImage = blob:http://...

        That URL is temporary.

        We need the actual path returned
        by backend, for example:

        /uploads/admins/admin-123-123456.jpg
      */

      const imageData =
        response?.data?.user ||
        response?.data?.admin ||
        response?.data ||
        {};

      const uploadedImage =
        imageData?.profileImage ||
        response?.profileImage ||
        null;

      // Update profile with backend image path
      if (uploadedImage) {
        setProfile((prev) => ({
          ...prev,
          profileImage: uploadedImage,
        }));
      }

      // Remove temporary preview
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }

      setPreviewImage(null);
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success(
        response?.message ||
          "Profile image updated successfully"
      );

      /*
        Fetch fresh data from database.

        This guarantees that after upload
        frontend uses exactly what backend saved.
      */

      await fetchProfile();
    } catch (error) {
      console.error("UPLOAD IMAGE ERROR:", error);

      toast.error(
        error?.message ||
          error?.response?.data?.message ||
          "Failed to upload profile image"
      );
    } finally {
      setUploading(false);
    }
  };

  // =========================================================
  // IMAGE URL
  // =========================================================

  const getImageUrl = (image) => {
    if (!image) return null;

    // Temporary browser preview
    if (image.startsWith("blob:")) {
      return image;
    }

    // Backend already returned complete URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL?.replace(
        /\/api\/?$/,
        ""
      ) || "http://localhost:5000";

    return `${baseUrl}${
      image.startsWith("/") ? image : `/${image}`
    }`;
  };

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7f8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />

          <p className="text-sm text-slate-500">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // CURRENT IMAGE
  // =========================================================

  const currentImage =
    previewImage || getImageUrl(profile.profileImage);

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-[#f5f7f8] text-[#17211b]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="border-b border-[#e2e8e4] bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">

          <div className="flex items-center justify-between">

            <div>
              <h1 className="text-2xl font-bold text-[#17211b]">
                Admin Profile
              </h1>

              <p className="mt-1 text-sm text-[#66736b]">
                Manage your account information and profile image
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ecfdf5] border border-[#d1fae5]">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />

              <span className="text-sm font-medium text-emerald-700">
                Administrator
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* =================================================
              LEFT PROFILE CARD
          ================================================= */}

          <div className="lg:col-span-1">

            <div className="bg-white border border-[#e2e8e4] rounded-2xl shadow-sm overflow-hidden">

              <div className="h-28 bg-gradient-to-r from-emerald-700 to-emerald-500" />

              <div className="px-6 pb-6">

                {/* Profile Image */}

                <div className="-mt-14 flex justify-center">

                  <div className="relative">

                    <div className="w-28 h-28 rounded-full bg-white p-1.5 shadow-lg">

                      <div className="w-full h-full rounded-full overflow-hidden bg-[#ecfdf5] flex items-center justify-center">

                        {currentImage ? (
                          <img
                            src={currentImage}
                            alt="Admin Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-12 h-12 text-emerald-600" />
                        )}

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md transition"
                    >
                      <Camera className="w-4 h-4" />
                    </button>

                  </div>

                </div>

                {/* Name */}

                <div className="text-center mt-4">

                  <h2 className="text-xl font-bold text-[#17211b]">
                    {profile.name || "Admin"}
                  </h2>

                  <p className="text-sm text-[#66736b] mt-1">
                    {profile.email || "No email"}
                  </p>

                  <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-[#ecfdf5] border border-[#d1fae5]">

                    <Shield className="w-3.5 h-3.5 text-emerald-600" />

                    <span className="text-xs font-semibold text-emerald-700 uppercase">
                      {profile.role || "admin"}
                    </span>

                  </div>

                </div>

                <div className="border-t border-[#edf1ee] my-6" />

                {/* Account Info */}

                <div className="space-y-4">

                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-lg bg-[#f1f5f3] flex items-center justify-center">
                      <CalendarDays className="w-4 h-4 text-emerald-600" />
                    </div>

                    <div>
                      <p className="text-xs text-[#94a19a]">
                        Account Created
                      </p>

                      <p className="text-sm font-medium text-[#46534b]">
                        {formatDate(profile.createdAt)}
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-lg bg-[#f1f5f3] flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </div>

                    <div>
                      <p className="text-xs text-[#94a19a]">
                        Account Status
                      </p>

                      <p className="text-sm font-medium text-emerald-600">
                        Active
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              RIGHT
          ================================================= */}

          <div className="lg:col-span-2 space-y-6">

            {/* =================================================
                PERSONAL INFORMATION
            ================================================= */}

            <form
              onSubmit={handleSaveProfile}
              className="bg-white border border-[#e2e8e4] rounded-2xl shadow-sm"
            >

              <div className="px-6 py-5 border-b border-[#edf1ee]">

                <h2 className="text-lg font-semibold text-[#17211b]">
                  Personal Information
                </h2>

                <p className="text-sm text-[#66736b] mt-1">
                  Update your basic account information
                </p>

              </div>

              <div className="p-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* Name */}

                  <div>

                    <label className="block text-sm font-medium text-[#46534b] mb-2">
                      Full Name
                    </label>

                    <div className="relative">

                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a19a]" />

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter full name"
                        className="w-full h-11 pl-10 pr-4 rounded-lg border border-[#dfe6e2] bg-[#f8faf9] text-[#17211b] placeholder:text-[#94a19a] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                      />

                    </div>

                  </div>

                  {/* Email */}

                  <div>

                    <label className="block text-sm font-medium text-[#46534b] mb-2">
                      Email Address
                    </label>

                    <div className="relative">

                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a19a]" />

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        className="w-full h-11 pl-10 pr-4 rounded-lg border border-[#dfe6e2] bg-[#f8faf9] text-[#17211b] placeholder:text-[#94a19a] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                      />

                    </div>

                  </div>

                  {/* Phone */}

                  <div>

                    <label className="block text-sm font-medium text-[#46534b] mb-2">
                      Phone Number
                    </label>

                    <div className="relative">

                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a19a]" />

                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className="w-full h-11 pl-10 pr-4 rounded-lg border border-[#dfe6e2] bg-[#f8faf9] text-[#17211b] placeholder:text-[#94a19a] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                      />

                    </div>

                  </div>

                  {/* Role */}

                  <div>

                    <label className="block text-sm font-medium text-[#46534b] mb-2">
                      Role
                    </label>

                    <div className="relative">

                      <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a19a]" />

                      <input
                        type="text"
                        value="Administrator"
                        disabled
                        className="w-full h-11 pl-10 pr-4 rounded-lg border border-[#dfe6e2] bg-[#f1f5f3] text-[#66736b] outline-none cursor-not-allowed"
                      />

                    </div>

                  </div>

                </div>

                {/* Save */}

                <div className="flex justify-end mt-6 pt-5 border-t border-[#edf1ee]">

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 px-5 h-11 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-medium transition shadow-sm"
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

            </form>

            {/* =================================================
                PROFILE PHOTO
            ================================================= */}

            <div className="bg-white border border-[#e2e8e4] rounded-2xl shadow-sm">

              <div className="px-6 py-5 border-b border-[#edf1ee]">

                <h2 className="text-lg font-semibold text-[#17211b]">
                  Profile Photo
                </h2>

                <p className="text-sm text-[#66736b] mt-1">
                  Upload a professional profile image
                </p>

              </div>

              <div className="p-6">

                <div className="flex flex-col sm:flex-row items-center gap-6">

                  {/* Preview */}

                  <div className="w-28 h-28 rounded-xl border border-[#dfe6e2] bg-[#f8faf9] overflow-hidden flex items-center justify-center">

                    {currentImage ? (
                      <img
                        src={currentImage}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-[#94a19a]" />
                    )}

                  </div>

                  {/* Controls */}

                  <div className="flex-1 w-full">

                    <div className="flex flex-wrap gap-3">

                      <button
                        type="button"
                        onClick={() =>
                          fileInputRef.current?.click()
                        }
                        className="inline-flex items-center gap-2 px-4 h-10 rounded-lg border border-[#dfe6e2] bg-white hover:bg-[#f8faf9] text-[#46534b] font-medium transition"
                      >
                        <Camera className="w-4 h-4" />
                        Choose Image
                      </button>

                      {selectedFile && (
                        <>
                          <button
                            type="button"
                            onClick={handleUploadImage}
                            disabled={uploading}
                            className="inline-flex items-center gap-2 px-4 h-10 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-medium transition"
                          >

                            {uploading ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" />
                                Upload
                              </>
                            )}

                          </button>

                          <button
                            type="button"
                            onClick={handleRemoveSelectedImage}
                            disabled={uploading}
                            className="inline-flex items-center gap-2 px-4 h-10 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-medium transition disabled:opacity-50"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </>
                      )}

                      {!selectedFile &&
                        profile.profileImage && (
                          <button
                            type="button"
                            onClick={handleRemoveCurrentImage}
                            className="inline-flex items-center gap-2 px-4 h-10 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-medium transition"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        )}

                    </div>

                    {selectedFile && (
                      <p className="text-sm text-emerald-600 mt-3">
                        Selected: {selectedFile.name}
                      </p>
                    )}

                    <p className="text-xs text-[#94a19a] mt-3">
                      Supported formats: JPG, JPEG, PNG, WEBP
                      <br />
                      Maximum file size: 5MB
                    </p>

                  </div>

                </div>

                {/* Hidden File Input */}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

