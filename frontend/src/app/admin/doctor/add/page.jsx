"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Select from "react-select";

import {
  createDoctor,
} from "@/app/components/utils/Api-call/doctor-api";

import {
  getDepartment,
} from "@/app/components/utils/Api-call/get_api";

import { notify } from "@/app/components/healper";

// =====================================================
// DAYS
// =====================================================

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// =====================================================
// CREATE EMPTY DAY
// =====================================================

const createDayAvailability = (day) => ({
  day,

  hospital: {
    enabled: false,
    slots: [
      {
        startTime: "",
        endTime: "",
      },
    ],
  },

  video: {
    enabled: false,
    slots: [
      {
        startTime: "",
        endTime: "",
      },
    ],
  },
});

// =====================================================
// INITIAL FORM DATA
// =====================================================

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  gender: "",
  dateOfBirth: "",

  specialization: [],
  department: "",
  qualification: [],

  experience: "",
  consultationFee: "",
  licenseNumber: "",

  availability: [],

  appointmentDuration: "30",

  fullAddress: "",
  city: "",
  state: "",
  pincode: "",
};

// =====================================================
// QUALIFICATION OPTIONS
// =====================================================

const qualificationOptions = [
  { value: "MBBS", label: "MBBS" },
  { value: "BDS", label: "BDS" },
  { value: "BAMS", label: "BAMS" },
  { value: "BHMS", label: "BHMS" },
  { value: "BUMS", label: "BUMS" },
  { value: "MD", label: "MD" },
  { value: "MS", label: "MS" },
  { value: "DNB", label: "DNB" },
  { value: "DM", label: "DM" },
  { value: "MCh", label: "MCh" },
  { value: "MDS", label: "MDS" },
];

// =====================================================
// SPECIALIZATION OPTIONS
// =====================================================

const specializationOptions = [
  { value: "General Medicine", label: "General Medicine" },
  { value: "Cardiology", label: "Cardiology" },
  {
    value: "Interventional Cardiology",
    label: "Interventional Cardiology",
  },
  { value: "Orthopedics", label: "Orthopedics" },
  { value: "Pediatrics", label: "Pediatrics" },
  { value: "General Surgery", label: "General Surgery" },
  { value: "Gynecology", label: "Gynecology" },
  { value: "Obstetrics", label: "Obstetrics" },
  { value: "Neurology", label: "Neurology" },
  { value: "Neurosurgery", label: "Neurosurgery" },
  { value: "Dermatology", label: "Dermatology" },
  { value: "Psychiatry", label: "Psychiatry" },
  { value: "Radiology", label: "Radiology" },
  { value: "Anesthesiology", label: "Anesthesiology" },
  { value: "Ophthalmology", label: "Ophthalmology" },
  { value: "ENT", label: "ENT" },
  { value: "Pulmonology", label: "Pulmonology" },
  { value: "Gastroenterology", label: "Gastroenterology" },
  { value: "Nephrology", label: "Nephrology" },
  { value: "Urology", label: "Urology" },
  { value: "Oncology", label: "Oncology" },
  { value: "Endocrinology", label: "Endocrinology" },
  { value: "Dentistry", label: "Dentistry" },
];

// =====================================================
// COMPONENT
// =====================================================

export default function AddDoctorPage() {
  const router = useRouter();

  const [formData, setFormData] = useState(initialFormData);

  const [departments, setDepartments] = useState([]);

  const [errors, setErrors] = useState({});

  const [profileImage, setProfileImage] = useState(null);

  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);

  const [departmentLoading, setDepartmentLoading] = useState(true);

  // =====================================================
  // GET DEPARTMENTS
  // =====================================================

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getDepartment();

        const data = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.data)
          ? response.data.data
          : [];

        setDepartments(data);
      } catch (error) {
        console.error("Department error:", error);

        notify(
          "Failed to load departments",
          false
        );
      } finally {
        setDepartmentLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "phone") {
      newValue = value
        .replace(/\D/g, "")
        .slice(0, 10);
    }

    if (name === "pincode") {
      newValue = value
        .replace(/\D/g, "")
        .slice(0, 6);
    }

    if (name === "experience") {
      newValue = value
        .replace(/\D/g, "")
        .slice(0, 2);
    }

    if (name === "consultationFee") {
      newValue = value.replace(
        /[^0-9.]/g,
        ""
      );
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // =====================================================
  // SPECIALIZATION CHANGE
  // =====================================================

  const handleSpecializationChange = (selected) => {
    const values = selected
      ? selected.map((item) => item.value)
      : [];

    setFormData((prev) => ({
      ...prev,
      specialization: values,
    }));

    setErrors((prev) => ({
      ...prev,
      specialization: "",
    }));
  };

  // =====================================================
  // QUALIFICATION CHANGE
  // =====================================================

  const handleQualificationChange = (selected) => {
    const values = selected
      ? selected.map((item) => item.value)
      : [];

    setFormData((prev) => ({
      ...prev,
      qualification: values,
    }));

    setErrors((prev) => ({
      ...prev,
      qualification: "",
    }));
  };

  // =====================================================
  // DEPARTMENT CHANGE
  // =====================================================

  const handleDepartmentChange = (selected) => {
    setFormData((prev) => ({
      ...prev,
      department: selected?.value || "",
    }));

    setErrors((prev) => ({
      ...prev,
      department: "",
    }));
  };

  // =====================================================
  // ADD / REMOVE DAY
  // =====================================================

  const handleDayChange = (day) => {
    setFormData((prev) => {
      const exists = prev.availability.some(
        (item) => item.day === day
      );

      if (exists) {
        return {
          ...prev,
          availability: prev.availability.filter(
            (item) => item.day !== day
          ),
        };
      }

      return {
        ...prev,
        availability: [
          ...prev.availability,
          createDayAvailability(day),
        ],
      };
    });

    setErrors((prev) => ({
      ...prev,
      availability: "",
    }));
  };

  // =====================================================
  // TOGGLE HOSPITAL / VIDEO
  // =====================================================

  const handleModeToggle = (day, mode) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.map(
        (item) =>
          item.day === day
            ? {
                ...item,
                [mode]: {
                  ...item[mode],
                  enabled: !item[mode].enabled,
                },
              }
            : item
      ),
    }));

    setErrors((prev) => ({
      ...prev,
      availability: "",
    }));
  };

  // =====================================================
  // CHANGE TIME
  // =====================================================

  const handleTimeChange = (
    day,
    mode,
    slotIndex,
    field,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.map(
        (item) => {
          if (item.day !== day) {
            return item;
          }

          const updatedSlots =
            item[mode].slots.map(
              (slot, index) =>
                index === slotIndex
                  ? {
                      ...slot,
                      [field]: value,
                    }
                  : slot
            );

          return {
            ...item,
            [mode]: {
              ...item[mode],
              slots: updatedSlots,
            },
          };
        }
      ),
    }));

    setErrors((prev) => ({
      ...prev,
      availability: "",
    }));
  };

  // =====================================================
  // ADD TIMING
  // =====================================================

  const addTiming = (day, mode) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.map(
        (item) =>
          item.day === day
            ? {
                ...item,
                [mode]: {
                  ...item[mode],
                  slots: [
                    ...item[mode].slots,
                    {
                      startTime: "",
                      endTime: "",
                    },
                  ],
                },
              }
            : item
      ),
    }));
  };

  // =====================================================
  // REMOVE TIMING
  // =====================================================

  const removeTiming = (
    day,
    mode,
    slotIndex
  ) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.map(
        (item) => {
          if (item.day !== day) {
            return item;
          }

          if (item[mode].slots.length === 1) {
            return item;
          }

          return {
            ...item,
            [mode]: {
              ...item[mode],
              slots: item[mode].slots.filter(
                (_, index) => index !== slotIndex
              ),
            },
          };
        }
      ),
    }));
  };

  // =====================================================
  // IMAGE
  // =====================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      notify(
        "Only JPG, PNG and WEBP images are allowed",
        false
      );
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      notify(
        "Image must be less than 2MB",
        false
      );
      return;
    }

    setProfileImage(file);

    setImagePreview(
      URL.createObjectURL(file)
    );
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview("");
  };

  // =====================================================
  // TIME VALIDATION HELPERS
  // =====================================================

  const timeToMinutes = (time) => {
    if (!time) return null;

    const [hours, minutes] =
      time.split(":").map(Number);

    return hours * 60 + minutes;
  };

  const validateSlots = (
    slots,
    day,
    mode,
    newErrors
  ) => {
    if (!Array.isArray(slots)) {
      return false;
    }

    for (
      let index = 0;
      index < slots.length;
      index++
    ) {
      const slot = slots[index];

      if (
        !slot.startTime ||
        !slot.endTime
      ) {
        newErrors.availability =
          `${day}: ${mode} start and end time are required`;

        return false;
      }

      const start = timeToMinutes(
        slot.startTime
      );

      const end = timeToMinutes(
        slot.endTime
      );

      if (
        start === null ||
        end === null
      ) {
        newErrors.availability =
          `${day}: Invalid ${mode} timing`;

        return false;
      }

      if (start >= end) {
        newErrors.availability =
          `${day}: ${mode} end time must be greater than start time`;

        return false;
      }
    }

    const sortedSlots = [...slots].sort(
      (a, b) =>
        timeToMinutes(a.startTime) -
        timeToMinutes(b.startTime)
    );

    for (
      let i = 0;
      i < sortedSlots.length - 1;
      i++
    ) {
      const current = sortedSlots[i];
      const next = sortedSlots[i + 1];

      if (
        timeToMinutes(next.startTime) <
        timeToMinutes(current.endTime)
      ) {
        newErrors.availability =
          `${day}: ${mode} timings cannot overlap`;

        return false;
      }
    }

    return true;
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName =
        "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName =
        "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone =
        "Mobile number is required";
    } else if (
      !/^[6-9]\d{9}$/.test(
        formData.phone
      )
    ) {
      newErrors.phone =
        "Enter valid mobile number";
    }

    if (!formData.gender) {
      newErrors.gender =
        "Gender is required";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth =
        "Date of birth is required";
    }

    if (
      !Array.isArray(
        formData.specialization
      ) ||
      formData.specialization.length === 0
    ) {
      newErrors.specialization =
        "Select at least one specialization";
    }

    if (!formData.department) {
      newErrors.department =
        "Department is required";
    }

    if (
      !Array.isArray(
        formData.qualification
      ) ||
      formData.qualification.length === 0
    ) {
      newErrors.qualification =
        "Select at least one qualification";
    }

    if (!formData.experience) {
      newErrors.experience =
        "Experience is required";
    }

    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber =
        "License number is required";
    }

    if (!formData.availability.length) {
      newErrors.availability =
        "Select at least one day";
    } else {
      for (
        const dayAvailability of
          formData.availability
      ) {
        const {
          day,
          hospital,
          video,
        } = dayAvailability;

        if (
          !hospital.enabled &&
          !video.enabled
        ) {
          newErrors.availability =
            `${day}: Enable Hospital Visit or Video Consultation`;

          break;
        }

        if (hospital.enabled) {
          if (!hospital.slots.length) {
            newErrors.availability =
              `${day}: Hospital timing is required`;

            break;
          }

          const valid = validateSlots(
            hospital.slots,
            day,
            "Hospital Visit",
            newErrors
          );

          if (!valid) {
            break;
          }
        }

        if (video.enabled) {
          if (!video.slots.length) {
            newErrors.availability =
              `${day}: Video consultation timing is required`;

            break;
          }

          const valid = validateSlots(
            video.slots,
            day,
            "Video Consultation",
            newErrors
          );

          if (!valid) {
            break;
          }
        }
      }
    }

    if (!formData.fullAddress.trim()) {
      newErrors.fullAddress =
        "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city =
        "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state =
        "State is required";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode =
        "Pincode is required";
    } else if (
      !/^\d{6}$/.test(
        formData.pincode
      )
    ) {
      newErrors.pincode =
        "Enter valid 6 digit pincode";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      notify(
        "Please fill all required fields",
        false
      );
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append(
        "firstName",
        formData.firstName
      );

      data.append(
        "lastName",
        formData.lastName
      );

      data.append(
        "email",
        formData.email
      );

      data.append(
        "phone",
        formData.phone
      );

      data.append(
        "gender",
        formData.gender
      );

      data.append(
        "dateOfBirth",
        formData.dateOfBirth
      );

      data.append(
        "specialization",
        JSON.stringify(
          formData.specialization
        )
      );

      data.append(
        "department",
        formData.department
      );

      data.append(
        "qualification",
        JSON.stringify(
          formData.qualification
        )
      );

      data.append(
        "experience",
        formData.experience
      );

      data.append(
        "consultationFee",
        formData.consultationFee
      );

      data.append(
        "licenseNumber",
        formData.licenseNumber
      );

      data.append(
        "availability",
        JSON.stringify(
          formData.availability
        )
      );

      data.append(
        "appointmentDuration",
        formData.appointmentDuration
      );

      data.append(
        "fullAddress",
        formData.fullAddress
      );

      data.append(
        "city",
        formData.city
      );

      data.append(
        "state",
        formData.state
      );

      data.append(
        "pincode",
        formData.pincode
      );

      data.append(
        "status",
        "true"
      );

      if (profileImage) {
        data.append(
          "profile",
          profileImage
        );
      }

      const response =
        await createDoctor(data);

      if (response?.success) {
        notify(
          "Doctor created successfully",
          true
        );

        router.push(
          "/admin/doctor"
        );
      } else {
        notify(
          response?.message ||
            "Failed to create doctor",
          false
        );
      }
    } catch (error) {
      console.error(
        "Create doctor error:",
        error
      );

      notify(
        error?.response?.data?.message ||
          "Something went wrong",
        false
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INPUT CLASS
  // =====================================================

  const inputClass = (name) =>
    `
      w-full
      rounded-lg
      border
      bg-white
      px-4
      py-2.5
      text-sm
      text-[#0F172A]
      outline-none
      transition
      placeholder:text-[#94A3B8]
      ${
        errors[name]
          ? "border-red-500 focus:ring-2 focus:ring-red-100"
          : "border-[#E2E8F0] focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
      }
    `;

  // =====================================================
  // ERROR MESSAGE
  // =====================================================

  const ErrorMessage = ({ name }) => {
    if (!errors[name]) {
      return null;
    }

    return (
      <p className="mt-1 text-xs text-red-500">
        {errors[name]}
      </p>
    );
  };

  // =====================================================
  // DEPARTMENT OPTIONS
  // =====================================================

  const departmentOptions =
    departments.map(
      (department) => ({
        value:
          department._id ||
          department.id,

        label:
          department.name ||
          department.departmentName ||
          department.title ||
          "Department",
      })
    );

  const selectedDepartment =
    departmentOptions.find(
      (item) =>
        item.value ===
        formData.department
    ) || null;

  // =====================================================
  // REACT SELECT STYLES
  // =====================================================

  const selectStyles = (fieldName) => ({
    control: (base, state) => ({
      ...base,
      backgroundColor: "#FFFFFF",

      borderColor:
        errors[fieldName]
          ? "#EF4444"
          : state.isFocused
          ? "#0F766E"
          : "#E2E8F0",

      boxShadow:
        state.isFocused
          ? "0 0 0 2px rgba(15,118,110,0.10)"
          : "none",

      minHeight: "42px",
      borderRadius: "8px",

      "&:hover": {
        borderColor:
          errors[fieldName]
            ? "#EF4444"
            : "#0F766E",
      },
    }),

    menu: (base) => ({
      ...base,
      backgroundColor: "#FFFFFF",
      border: "1px solid #E2E8F0",
      boxShadow:
        "0 8px 20px rgba(15,23,42,0.08)",
      zIndex: 50,
    }),

    option: (base, state) => ({
      ...base,

      backgroundColor:
        state.isSelected
          ? "#0F766E"
          : state.isFocused
          ? "#F0FDFA"
          : "#FFFFFF",

      color:
        state.isSelected
          ? "#FFFFFF"
          : "#0F172A",

      cursor: "pointer",
    }),

    singleValue: (base) => ({
      ...base,
      color: "#0F172A",
    }),

    input: (base) => ({
      ...base,
      color: "#0F172A",
    }),

    placeholder: (base) => ({
      ...base,
      color: "#94A3B8",
    }),

    multiValue: (base) => ({
      ...base,
      backgroundColor: "#F0FDFA",
      borderRadius: "6px",
    }),

    multiValueLabel: (base) => ({
      ...base,
      color: "#0F766E",
      fontWeight: 500,
    }),

    multiValueRemove: (base) => ({
      ...base,
      color: "#0F766E",

      ":hover": {
        backgroundColor: "#CCFBF1",
        color: "#115E59",
      },
    }),
  });

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 text-[#0F172A]">
      <div className="mx-auto max-w-[1400px]">

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">

            <Link
              href="/admin/doctor"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                border
                border-[#E2E8F0]
                bg-white
                text-[#475569]
                shadow-sm
                transition
                hover:border-[#0F766E]
                hover:bg-[#F0FDFA]
                hover:text-[#0F766E]
              "
            >
              <ArrowLeft size={19} />
            </Link>

            <div>
              <h1 className="text-2xl font-bold text-[#0F172A]">
                Add Doctor
              </h1>

              <p className="mt-1 text-sm text-[#64748B]">
                Add a new doctor to the hospital
              </p>
            </div>

          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div
            className="
              mb-6
              rounded-xl
              border
              border-[#E2E8F0]
              bg-white
              p-6
              shadow-sm
            "
          >
            <h2 className="mb-5 text-lg font-semibold text-[#0F172A]">
              Profile Photo
            </h2>

            <div className="flex items-center gap-5">

              <div
                className="
                  flex
                  h-24
                  w-24
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-full
                  border
                  border-[#CCFBF1]
                  bg-[#F0FDFA]
                "
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-medium text-[#64748B]">
                    No Image
                  </span>
                )}
              </div>

              <div>

                <label
                  className="
                    inline-flex
                    cursor-pointer
                    items-center
                    gap-2
                    rounded-lg
                    bg-[#0F766E]
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-[#115E59]
                  "
                >
                  <Upload size={17} />

                  Upload Photo

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {imagePreview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="
                      ml-3
                      inline-flex
                      items-center
                      gap-1
                      rounded-lg
                      border
                      border-red-200
                      bg-red-50
                      px-3
                      py-2
                      text-sm
                      font-medium
                      text-red-600
                      transition
                      hover:bg-red-100
                    "
                  >
                    <X size={16} />
                    Remove
                  </button>
                )}

                <p className="mt-2 text-xs text-[#64748B]">
                  JPG, PNG or WEBP. Maximum 2MB.
                </p>

              </div>
            </div>
          </div>

          <div
            className="
              mb-6
              rounded-xl
              border
              border-[#E2E8F0]
              bg-white
              p-6
              shadow-sm
            "
          >
            <h2 className="mb-5 text-lg font-semibold text-[#0F172A]">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium text-[#475569]">
                  First Name *
                </label>

                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className={inputClass("firstName")}
                />

                <ErrorMessage name="firstName" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#475569]">
                  Last Name *
                </label>

                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className={inputClass("lastName")}
                />

                <ErrorMessage name="lastName" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#475569]">
                  Email *
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="doctor@example.com"
                  className={inputClass("email")}
                />

                <ErrorMessage name="email" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#475569]">
                  Mobile Number *
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={10}
                  inputMode="numeric"
                  placeholder="Enter 10 digit mobile number"
                  className={inputClass("phone")}
                />

                <ErrorMessage name="phone" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#475569]">
                  Gender *
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={inputClass("gender")}
                >
                  <option value="">
                    Select gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>

                <ErrorMessage name="gender" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#475569]">
                  Date of Birth *
                </label>

                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={inputClass("dateOfBirth")}
                />

                <ErrorMessage name="dateOfBirth" />
              </div>

            </div>
          </div>

          <div
            className="
              mb-6
              rounded-xl
              border
              border-[#E2E8F0]
              bg-white
              p-6
              shadow-sm
            "
          >
            <h2 className="mb-5 text-lg font-semibold text-[#0F172A]">
              Professional Information
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium text-[#475569]">
                  Specialization *
                </label>

                <Select
                  isMulti
                  options={specializationOptions}
                  value={specializationOptions.filter(
                    (option) =>
                      formData.specialization.includes(
                        option.value
                      )
                  )}
                  onChange={handleSpecializationChange}
                  placeholder="Select specialization"
                  styles={selectStyles("specialization")}
                  isSearchable
                  closeMenuOnSelect={false}
                />

                <ErrorMessage name="specialization" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#475569]">
                  Department *
                </label>

                <Select
                  options={departmentOptions}
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                  placeholder={
                    departmentLoading
                      ? "Loading..."
                      : "Select department"
                  }
                  isDisabled={departmentLoading}
                  styles={selectStyles("department")}
                  isSearchable
                />

                <ErrorMessage name="department" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#475569]">
                  Qualification *
                </label>

                <Select
                  isMulti
                  options={qualificationOptions}
                  value={qualificationOptions.filter(
                    (option) =>
                      formData.qualification.includes(
                        option.value
                      )
                  )}
                  onChange={handleQualificationChange}
                  placeholder="Select qualification"
                  styles={selectStyles("qualification")}
                  isSearchable
                  closeMenuOnSelect={false}
                />

                <ErrorMessage name="qualification" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#475569]">
                  Experience (Years) *
                </label>

                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  maxLength={2}
                  inputMode="numeric"
                  placeholder="e.g. 5"
                  className={inputClass("experience")}
                />

                <ErrorMessage name="experience" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#475569]">
                  Consultation Fee
                </label>

                <input
                  type="text"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleChange}
                  placeholder="e.g. 500"
                  className={inputClass("consultationFee")}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#475569]">
                  License Number *
                </label>

                <input
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="Enter license number"
                  className={inputClass("licenseNumber")}
                />

                <ErrorMessage name="licenseNumber" />
              </div>

            </div>
          </div>

          <div
            className="
              mb-6
              rounded-xl
              border
              border-[#E2E8F0]
              bg-white
              p-6
              shadow-sm
            "
          >

            <div className="mb-5">
              <h2 className="text-lg font-semibold text-[#0F172A]">
                Availability
              </h2>

              <p className="mt-1 text-sm text-[#64748B]">
                Select working days and set separate timings for hospital visits and video consultations.
              </p>
            </div>

            <div className="mb-6">

              <label className="mb-3 block text-sm font-medium text-[#475569]">
                Available Days *
              </label>

              <div className="flex flex-wrap gap-2">

                {days.map((day) => {

                  const selected =
                    formData.availability.some(
                      (item) =>
                        item.day === day
                    );

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() =>
                        handleDayChange(day)
                      }
                      className={`
                        rounded-lg
                        border
                        px-4
                        py-2
                        text-sm
                        font-medium
                        transition
                        ${
                          selected
                            ? "border-[#0F766E] bg-[#0F766E] text-white"
                            : "border-[#E2E8F0] bg-white text-[#475569] hover:border-[#0F766E] hover:bg-[#F0FDFA] hover:text-[#0F766E]"
                        }
                      `}
                    >
                      {day}
                    </button>
                  );
                })}

              </div>

              <ErrorMessage name="availability" />
            </div>

            <div className="space-y-5">

              {formData.availability.map(
                (dayAvailability) => {

                  const {
                    day,
                    hospital,
                    video,
                  } = dayAvailability;

                  return (
                    <div
                      key={day}
                      className="
                        rounded-xl
                        border
                        border-[#E2E8F0]
                        bg-[#F8FAFC]
                        p-5
                      "
                    >

                      <div className="mb-5 flex items-center justify-between">

                        <h3 className="text-base font-semibold text-[#0F172A]">
                          {day}
                        </h3>

                        <button
                          type="button"
                          onClick={() =>
                            handleDayChange(day)
                          }
                          className="
                            inline-flex
                            items-center
                            gap-1
                            text-xs
                            font-medium
                            text-red-600
                            hover:text-red-700
                          "
                        >
                          <X size={15} />
                          Remove Day
                        </button>

                      </div>

                      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                        <div
                          className="
                            rounded-xl
                            border
                            border-[#E2E8F0]
                            bg-white
                            p-5
                          "
                        >

                          <div className="mb-4 flex items-center justify-between">

                            <div>
                              <h4 className="text-sm font-semibold text-[#0F172A]">
                                Hospital Visit
                              </h4>

                              <p className="mt-1 text-xs text-[#64748B]">
                                In-person appointment timing
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleModeToggle(
                                  day,
                                  "hospital"
                                )
                              }
                              className={`
                                relative
                                h-6
                                w-11
                                rounded-full
                                transition
                                ${
                                  hospital.enabled
                                    ? "bg-[#0F766E]"
                                    : "bg-[#CBD5E1]"
                                }
                              `}
                            >
                              <span
                                className={`
                                  absolute
                                  top-1
                                  h-4
                                  w-4
                                  rounded-full
                                  bg-white
                                  shadow-sm
                                  transition
                                  ${
                                    hospital.enabled
                                      ? "left-6"
                                      : "left-1"
                                  }
                                `}
                              />
                            </button>

                          </div>

                          {hospital.enabled && (
                            <div className="space-y-3">

                              {hospital.slots.map(
                                (
                                  slot,
                                  index
                                ) => (
                                  <div
                                    key={index}
                                    className="
                                      rounded-lg
                                      border
                                      border-[#E2E8F0]
                                      bg-[#F8FAFC]
                                      p-3
                                    "
                                  >

                                    <div className="mb-2 flex items-center justify-between">

                                      <span className="text-xs font-medium text-[#64748B]">
                                        Timing {index + 1}
                                      </span>

                                      {hospital.slots.length >
                                        1 && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            removeTiming(
                                              day,
                                              "hospital",
                                              index
                                            )
                                          }
                                          className="text-red-500 hover:text-red-600"
                                        >
                                          <Trash2 size={15} />
                                        </button>
                                      )}

                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                                      <div>
                                        <label className="mb-1.5 block text-xs font-medium text-[#475569]">
                                          Start Time
                                        </label>

                                        <input
                                          type="time"
                                          value={slot.startTime}
                                          onChange={(e) =>
                                            handleTimeChange(
                                              day,
                                              "hospital",
                                              index,
                                              "startTime",
                                              e.target.value
                                            )
                                          }
                                          className={inputClass(
                                            "hospitalStart"
                                          )}
                                        />
                                      </div>

                                      <div>
                                        <label className="mb-1.5 block text-xs font-medium text-[#475569]">
                                          End Time
                                        </label>

                                        <input
                                          type="time"
                                          value={slot.endTime}
                                          onChange={(e) =>
                                            handleTimeChange(
                                              day,
                                              "hospital",
                                              index,
                                              "endTime",
                                              e.target.value
                                            )
                                          }
                                          className={inputClass(
                                            "hospitalEnd"
                                          )}
                                        />
                                      </div>

                                    </div>
                                  </div>
                                )
                              )}

                              <button
                                type="button"
                                onClick={() =>
                                  addTiming(
                                    day,
                                    "hospital"
                                  )
                                }
                                className="
                                  inline-flex
                                  items-center
                                  gap-2
                                  rounded-lg
                                  border
                                  border-dashed
                                  border-[#0F766E]
                                  px-3
                                  py-2
                                  text-xs
                                  font-semibold
                                  text-[#0F766E]
                                  transition
                                  hover:bg-[#F0FDFA]
                                "
                              >
                                <Plus size={15} />
                                Add Timing
                              </button>

                            </div>
                          )}

                        </div>

                        <div
                          className="
                            rounded-xl
                            border
                            border-[#E2E8F0]
                            bg-white
                            p-5
                          "
                        >

                          <div className="mb-4 flex items-center justify-between">

                            <div>
                              <h4 className="text-sm font-semibold text-[#0F172A]">
                                Video Consultation
                              </h4>

                              <p className="mt-1 text-xs text-[#64748B]">
                                Online consultation timing
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleModeToggle(
                                  day,
                                  "video"
                                )
                              }
                              className={`
                                relative
                                h-6
                                w-11
                                rounded-full
                                transition
                                ${
                                  video.enabled
                                    ? "bg-[#0F766E]"
                                    : "bg-[#CBD5E1]"
                                }
                              `}
                            >
                              <span
                                className={`
                                  absolute
                                  top-1
                                  h-4
                                  w-4
                                  rounded-full
                                  bg-white
                                  shadow-sm
                                  transition
                                  ${
                                    video.enabled
                                      ? "left-6"
                                      : "left-1"
                                  }
                                `}
                              />
                            </button>

                          </div>

                          {video.enabled && (
                            <div className="space-y-3">

                              {video.slots.map(
                                (
                                  slot,
                                  index
                                ) => (
                                  <div
                                    key={index}
                                    className="
                                      rounded-lg
                                      border
                                      border-[#E2E8F0]
                                      bg-[#F8FAFC]
                                      p-3
                                    "
                                  >

                                    <div className="mb-2 flex items-center justify-between">

                                      <span className="text-xs font-medium text-[#64748B]">
                                        Timing {index + 1}
                                      </span>

                                      {video.slots.length >
                                        1 && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            removeTiming(
                                              day,
                                              "video",
                                              index
                                            )
                                          }
                                          className="text-red-500 hover:text-red-600"
                                        >
                                          <Trash2 size={15} />
                                        </button>
                                      )}

                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                                      <div>
                                        <label className="mb-1.5 block text-xs font-medium text-[#475569]">
                                          Start Time
                                        </label>

                                        <input
                                          type="time"
                                          value={slot.startTime}
                                          onChange={(e) =>
                                            handleTimeChange(
                                              day,
                                              "video",
                                              index,
                                              "startTime",
                                              e.target.value
                                            )
                                          }
                                          className={inputClass(
                                            "videoStart"
                                          )}
                                        />
                                      </div>

                                      <div>
                                        <label className="mb-1.5 block text-xs font-medium text-[#475569]">
                                          End Time
                                        </label>

                                        <input
                                          type="time"
                                          value={slot.endTime}
                                          onChange={(e) =>
                                            handleTimeChange(
                                              day,
                                              "video",
                                              index,
                                              "endTime",
                                              e.target.value
                                            )
                                          }
                                          className={inputClass(
                                            "videoEnd"
                                          )}
                                        />
                                      </div>

                                    </div>

                                  </div>
                                )
                              )}

                              <button
                                type="button"
                                onClick={() =>
                                  addTiming(
                                    day,
                                    "video"
                                  )
                                }
                                className="
                                  inline-flex
                                  items-center
                                  gap-2
                                  rounded-lg
                                  border
                                  border-dashed
                                  border-[#0F766E]
                                  px-3
                                  py-2
                                  text-xs
                                  font-semibold
                                  text-[#0F766E]
                                  transition
                                  hover:bg-[#F0FDFA]
                                "
                              >
                                <Plus size={15} />
                                Add Timing
                              </button>

                            </div>
                          )}

                        </div>

                      </div>
                    </div>
                  );
                }
              )}

            </div>

            <div className="mt-6 max-w-sm">

              <label className="mb-2 block text-sm font-medium text-[#475569]">
                Appointment Duration
              </label>

              <select
                name="appointmentDuration"
                value={formData.appointmentDuration}
                onChange={handleChange}
                className={inputClass(
                  "appointmentDuration"
                )}
              >
                <option value="15">
                  15 Minutes
                </option>

                <option value="30">
                  30 Minutes
                </option>

                <option value="45">
                  45 Minutes
                </option>

                <option value="60">
                  60 Minutes
                </option>
              </select>

            </div>

          </div>

          <div
            className="
              mb-6
              rounded-xl
              border
              border-[#E2E8F0]
              bg-white
              p-6
              shadow-sm
            "
          >

            <h2 className="mb-5 text-lg font-semibold text-[#0F172A]">
              Address
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-medium text-[#475569]">
                  Full Address *
                </label>

                <textarea
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter full address"
                  className={inputClass("fullAddress")}
                />

                <ErrorMessage name="fullAddress" />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-[#475569]">
                  City *
                </label>

                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  className={inputClass("city")}
                />

                <ErrorMessage name="city" />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-[#475569]">
                  State *
                </label>

                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  className={inputClass("state")}
                />

                <ErrorMessage name="state" />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-[#475569]">
                  Pincode *
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  maxLength={6}
                  inputMode="numeric"
                  placeholder="Enter 6 digit pincode"
                  className={inputClass("pincode")}
                />

                <ErrorMessage name="pincode" />

              </div>

            </div>

          </div>

          <div className="flex justify-end gap-3 pb-6">

            <Link
              href="/admin/doctor"
              className="
                rounded-lg
                border
                border-[#E2E8F0]
                bg-white
                px-5
                py-2.5
                text-sm
                font-semibold
                text-[#475569]
                shadow-sm
                transition
                hover:border-[#0F766E]
                hover:bg-[#F0FDFA]
                hover:text-[#0F766E]
              "
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="
                inline-flex
                items-center
                gap-2
                rounded-lg
                bg-[#0F766E]
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-[#115E59]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              <Save size={17} />

              {loading
                ? "Saving..."
                : "Add Doctor"}

            </button>

          </div>

        </form>
      </div>
    </div>
  );
}