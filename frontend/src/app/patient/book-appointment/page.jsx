 "use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Phone,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Stethoscope,
  UserRound,
  CalendarDays,
  Clock3,
  X,
} from "lucide-react";

import { getDepartment } from "@/app/components/utils/Api-call/get_api";
import { getDoctors } from "@/app/components/utils/Api-call/doctor-api";

const SERVER_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") ||
  "http://localhost:5000";

const getImageUrl = (image) => {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  return `${SERVER_URL}${image.startsWith("/") ? "" : "/"}${image}`;
};

const getInitials = (firstName = "", lastName = "") => {
  const first = firstName?.charAt(0) || "";
  const last = lastName?.charAt(0) || "";

  return `${first}${last}`.toUpperCase() || "DR";
};

const getDoctorName = (doctor) => {
  const name = `${doctor?.firstName || ""} ${
    doctor?.lastName || ""
  }`.trim();

  return name ? `Dr. ${name}` : "Doctor";
};

const getToday = () => {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return today;
};

const formatDate = (date) => {
  if (!date) return "";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

const getNextAvailableDate = (doctor) => {
  /*
    Later you can replace this with real doctor availability
    from backend.

    For now:
    - Today + 1 day
    - If doctor has availableDays, try to match it.
  */

  const today = getToday();

  const availableDays = doctor?.availableDays;

  if (!Array.isArray(availableDays) || availableDays.length === 0) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return tomorrow;
  }

  const normalizedDays = availableDays.map((day) =>
    String(day).toLowerCase().trim()
  );

  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);

    date.setDate(today.getDate() + i);

    const dayName = date
      .toLocaleDateString("en-US", {
        weekday: "long",
      })
      .toLowerCase();

    const shortDay = date
      .toLocaleDateString("en-US", {
        weekday: "short",
      })
      .toLowerCase();

    if (
      normalizedDays.includes(dayName) ||
      normalizedDays.includes(shortDay)
    ) {
      return date;
    }
  }

  const fallback = new Date(today);
  fallback.setDate(fallback.getDate() + 1);

  return fallback;
};

const getDepartmentImage = (department) => {
  return getImageUrl(
    department?.image ||
      department?.imageUrl ||
      department?.icon ||
      department?.profileImage
  );
};

const DEPARTMENT_ICONS = [
  "❤️",
  "🫘",
  "🦴",
  "🧠",
  "🫃",
  "🎗️",
  "👶",
  "🩺",
  "👁️",
  "🦷",
  "🧴",
  "🫁",
];

export default function AppointmentPage() {
  const router = useRouter();

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [selectedDepartment, setSelectedDepartment] =
    useState(null);

  const [departmentSearch, setDepartmentSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");

  const [loadingDepartments, setLoadingDepartments] =
    useState(true);

  const [loadingDoctors, setLoadingDoctors] = useState(true);

  const [error, setError] = useState("");

  const [departmentStart, setDepartmentStart] = useState(0);

  const [showAllDepartments, setShowAllDepartments] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | Load Departments
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setLoadingDepartments(true);
        setError("");

        const response = await getDepartment();

        console.log("DEPARTMENT API RESPONSE:", response);

        const list = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.departments)
          ? response.departments
          : Array.isArray(response)
          ? response
          : [];

        console.log("DEPARTMENT LIST:", list);

        const activeDepartments = list.filter(
          (department) => department?.status !== false
        );

        setDepartments(activeDepartments);
      } catch (err) {
        console.error("GET DEPARTMENT ERROR:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load departments."
        );
      } finally {
        setLoadingDepartments(false);
      }
    };

    loadDepartments();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Load Doctors
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoadingDoctors(true);
        setError("");

        const response = await getDoctors();

        console.log("DOCTORS API RESPONSE:", response);

        const list = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.doctors)
          ? response.doctors
          : Array.isArray(response)
          ? response
          : [];

        console.log("DOCTOR LIST:", list);

        const activeDoctors = list.filter(
          (doctor) => doctor?.status !== false
        );

        setDoctors(activeDoctors);
      } catch (err) {
        console.error("GET DOCTORS ERROR:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load doctors."
        );
      } finally {
        setLoadingDoctors(false);
      }
    };

    loadDoctors();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Department Search
  |--------------------------------------------------------------------------
  */

  const filteredDepartments = useMemo(() => {
    const search = departmentSearch.trim().toLowerCase();

    if (!search) {
      return departments;
    }

    return departments.filter((department) => {
      const name = department?.name?.toLowerCase() || "";
      const code = department?.code?.toLowerCase() || "";
      const location =
        department?.location?.toLowerCase() || "";

      return (
        name.includes(search) ||
        code.includes(search) ||
        location.includes(search)
      );
    });
  }, [departments, departmentSearch]);

  /*
  |--------------------------------------------------------------------------
  | Doctor Filter
  |--------------------------------------------------------------------------
  */

  const filteredDoctors = useMemo(() => {
    const search = doctorSearch.trim().toLowerCase();

    let result = doctors;

    /*
    |--------------------------------------------------------------------------
    | Department Filter
    |--------------------------------------------------------------------------
    */

    if (selectedDepartment?._id) {
      result = result.filter((doctor) => {
        const doctorDepartment =
          doctor?.department?._id ||
          doctor?.department?.id ||
          doctor?.department;

        return (
          String(doctorDepartment) ===
          String(selectedDepartment._id)
        );
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Search Filter
    |--------------------------------------------------------------------------
    */

    if (!search) {
      return result;
    }

    return result.filter((doctor) => {
      const fullName =
        `${doctor?.firstName || ""} ${
          doctor?.lastName || ""
        }`.toLowerCase();

      const specialization =
        doctor?.specialization?.toLowerCase() || "";

      const qualification =
        doctor?.qualification?.toLowerCase() || "";

      return (
        fullName.includes(search) ||
        specialization.includes(search) ||
        qualification.includes(search)
      );
    });
  }, [
    doctors,
    selectedDepartment,
    doctorSearch,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Visible Departments
  |--------------------------------------------------------------------------
  */

  const visibleDepartments = useMemo(() => {
    if (showAllDepartments || departmentSearch.trim()) {
      return filteredDepartments;
    }

    return filteredDepartments.slice(
      departmentStart,
      departmentStart + 8
    );
  }, [
    filteredDepartments,
    departmentStart,
    showAllDepartments,
    departmentSearch,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Select Department
  |--------------------------------------------------------------------------
  */

  const handleDepartmentSelect = (department) => {
    if (
      selectedDepartment?._id === department?._id
    ) {
      setSelectedDepartment(null);
      return;
    }

    setSelectedDepartment(department);

    /*
      Scroll smoothly to doctor section
    */

    setTimeout(() => {
      document
        .getElementById("doctor-list")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  /*
  |--------------------------------------------------------------------------
  | Clear Department
  |--------------------------------------------------------------------------
  */

  const clearDepartment = () => {
    setSelectedDepartment(null);
  };

  /*
  |--------------------------------------------------------------------------
  | Book Appointment
  |--------------------------------------------------------------------------
  */

  const handleBookAppointment = (doctor) => {
    /*
      Store selected doctor temporarily.

      This allows the next appointment page
      to know which doctor the patient selected.
    */

    try {
      localStorage.setItem(
        "selectedDoctor",
        JSON.stringify(doctor)
      );

      if (selectedDepartment) {
        localStorage.setItem(
          "selectedDepartment",
          JSON.stringify(selectedDepartment)
        );
      }
    } catch (error) {
      console.error(
        "Unable to save appointment selection:",
        error
      );
    }

    /*
      Change this route if your booking flow
      uses another URL.
    */

    router.push("/patient/book-appointment");
  };

  /*
  |--------------------------------------------------------------------------
  | Call Doctor
  |--------------------------------------------------------------------------
  */

  const handleCall = (doctor) => {
    const phone =
      doctor?.phone ||
      doctor?.mobile ||
      doctor?.contactNumber;

    if (!phone) {
      return;
    }

    window.location.href = `tel:${phone}`;
  };

  /*
  |--------------------------------------------------------------------------
  | Department Slider
  |--------------------------------------------------------------------------
  */

  const showPreviousDepartments = () => {
    setDepartmentStart((prev) =>
      Math.max(prev - 1, 0)
    );
  };

  const showNextDepartments = () => {
    const maxStart = Math.max(
      filteredDepartments.length - 8,
      0
    );

    setDepartmentStart((prev) =>
      Math.min(prev + 1, maxStart)
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Loading Department Skeleton
  |--------------------------------------------------------------------------
  */

  const DepartmentSkeleton = () => {
    return (
      <div className="flex gap-7 overflow-hidden">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="w-[105px] shrink-0 animate-pulse text-center"
          >
            <div className="mx-auto h-[82px] w-[82px] rounded-full bg-slate-200" />

            <div className="mx-auto mt-3 h-4 w-20 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Doctor Skeleton
  |--------------------------------------------------------------------------
  */

  const DoctorSkeleton = () => {
    return (
      <div className="grid gap-6 xl:grid-cols-3 lg:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-[20px] border border-slate-200 bg-white p-5"
          >
            <div className="flex gap-4">
              <div className="h-[150px] w-[150px] rounded-xl bg-slate-200" />

              <div className="flex-1">
                <div className="h-5 w-32 rounded bg-slate-200" />

                <div className="mt-4 h-3 w-full rounded bg-slate-200" />

                <div className="mt-2 h-3 w-4/5 rounded bg-slate-200" />
              </div>
            </div>

            <div className="mt-6 h-3 w-28 rounded bg-slate-200" />

            <div className="mt-3 h-4 w-full rounded bg-slate-200" />

            <div className="mt-6 h-3 w-20 rounded bg-slate-200" />

            <div className="mt-3 h-4 w-4/5 rounded bg-slate-200" />

            <div className="mt-7 h-12 w-full rounded-xl bg-slate-200" />
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      {/* =========================================================
          PAGE HEADER
      ========================================================== */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1440px] px-6 pb-6 pt-7 lg:px-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-[42px] font-normal tracking-[-1.5px] text-black sm:text-[48px]">
                Find a Doctor
              </h1>

              <p className="mt-2 max-w-2xl text-[15px] leading-6 text-slate-500">
                Find the right doctor for your healthcare
                needs and book your appointment with ease.
              </p>
            </div>

            {/* Search */}

            <div className="relative w-full lg:w-[360px]">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={doctorSearch}
                onChange={(e) =>
                  setDoctorSearch(e.target.value)
                }
                placeholder="Search doctor or specialization"
                className="h-12 w-full rounded-full border border-slate-200 bg-slate-50 pl-11 pr-5 text-sm outline-none transition focus:border-[#0066cc] focus:bg-white focus:ring-4 focus:ring-blue-50"
              />

              {doctorSearch && (
                <button
                  type="button"
                  onClick={() => setDoctorSearch("")}
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          DEPARTMENT SECTION
      ========================================================== */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-7 lg:px-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[18px] font-semibold text-black">
                Browse by Speciality
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Choose a speciality to find a doctor.
              </p>
            </div>

            {selectedDepartment && (
              <button
                type="button"
                onClick={clearDepartment}
                className="flex items-center gap-1.5 text-sm font-medium text-[#005bbb] hover:underline"
              >
                <X size={15} />
                Clear
              </button>
            )}
          </div>

          <div className="relative mt-7">
            {loadingDepartments ? (
              <DepartmentSkeleton />
            ) : filteredDepartments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 py-10 text-center">
                <Stethoscope
                  size={34}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm font-medium text-slate-500">
                  No departments found
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Previous */}

                {!showAllDepartments &&
                  filteredDepartments.length > 8 && (
                    <button
                      type="button"
                      onClick={showPreviousDepartments}
                      disabled={departmentStart === 0}
                      className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#0066cc] hover:text-[#0066cc] disabled:cursor-not-allowed disabled:opacity-30 md:flex"
                    >
                      <ChevronLeft size={18} />
                    </button>
                  )}

                {/* Department List */}

                <div
                  className={`flex flex-1 ${
                    showAllDepartments
                      ? "flex-wrap justify-center"
                      : "overflow-hidden"
                  } gap-x-8 gap-y-7`}
                >
                  {visibleDepartments.map(
                    (department, index) => {
                      const image =
                        getDepartmentImage(
                          department
                        );

                      const selected =
                        selectedDepartment?._id ===
                        department?._id;

                      return (
                        <button
                          key={
                            department?._id ||
                            `department-${index}`
                          }
                          type="button"
                          onClick={() =>
                            handleDepartmentSelect(
                              department
                            )
                          }
                          className="group w-[88px] shrink-0 text-center"
                        >
                          {/* Circle */}

                          <div
                            className={`mx-auto flex h-[82px] w-[82px] items-center justify-center overflow-hidden rounded-full border-2 bg-slate-50 transition-all duration-200 ${
                              selected
                                ? "border-[#0066cc] bg-blue-50 shadow-[0_0_0_4px_rgba(0,102,204,0.08)]"
                                : "border-transparent group-hover:border-[#0066cc] group-hover:shadow-md"
                            }`}
                          >
                            {image ? (
                              <img
                                src={image}
                                alt={
                                  department?.name ||
                                  "Department"
                                }
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display =
                                    "none";
                                }}
                              />
                            ) : (
                              <span className="text-[31px]">
                                {
                                  DEPARTMENT_ICONS[
                                    index %
                                      DEPARTMENT_ICONS.length
                                  ]
                                }
                              </span>
                            )}
                          </div>

                          {/* Name */}

                          <p
                            className={`mt-3 line-clamp-2 text-[14px] leading-5 ${
                              selected
                                ? "font-semibold text-[#005bbb]"
                                : "font-medium text-slate-800"
                            }`}
                          >
                            {department?.name ||
                              "Department"}
                          </p>
                        </button>
                      );
                    }
                  )}
                </div>

                {/* Next */}

                {!showAllDepartments &&
                  filteredDepartments.length > 8 && (
                    <button
                      type="button"
                      onClick={showNextDepartments}
                      disabled={
                        departmentStart >=
                        Math.max(
                          filteredDepartments.length - 8,
                          0
                        )
                      }
                      className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#0066cc] hover:text-[#0066cc] disabled:cursor-not-allowed disabled:opacity-30 md:flex"
                    >
                      <ChevronRight size={18} />
                    </button>
                  )}
              </div>
            )}

            {!showAllDepartments &&
              filteredDepartments.length > 8 && (
                <div className="mt-7 text-center">
                  <button
                    type="button"
                    onClick={() =>
                      setShowAllDepartments(true)
                    }
                    className="text-sm font-semibold text-[#005bbb] hover:underline"
                  >
                    See More
                  </button>
                </div>
              )}

            {showAllDepartments &&
              filteredDepartments.length > 8 && (
                <div className="mt-7 text-center">
                  <button
                    type="button"
                    onClick={() =>
                      setShowAllDepartments(false)
                    }
                    className="text-sm font-semibold text-[#005bbb] hover:underline"
                  >
                    Show Less
                  </button>
                </div>
              )}
          </div>
        </div>
      </section>

      {/* =========================================================
          DOCTOR SECTION
      ========================================================== */}

      <section
        id="doctor-list"
        className="bg-[#f7f9fc] py-9"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
          {/* Section Header */}

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#0066cc]">
                Our Specialists
              </p>

              <h2 className="mt-1 text-[26px] font-semibold tracking-[-0.5px] text-black">
                {selectedDepartment
                  ? `Doctors in ${selectedDepartment.name}`
                  : "Find the right doctor for you"}
              </h2>
            </div>

            {!loadingDoctors && (
              <p className="text-sm text-slate-500">
                {filteredDoctors.length}{" "}
                {filteredDoctors.length === 1
                  ? "doctor"
                  : "doctors"}{" "}
                available
              </p>
            )}
          </div>

          {/* Error */}

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              <X
                size={18}
                className="mt-0.5 shrink-0"
              />

              <div>
                <p className="text-sm font-semibold">
                  Unable to load data
                </p>

                <p className="mt-1 text-sm">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Loading */}

          {loadingDoctors ? (
            <DoctorSkeleton />
          ) : filteredDoctors.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-[#0066cc]">
                <UserRound size={30} />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-800">
                No doctors found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {selectedDepartment
                  ? `There are currently no active doctors available in ${selectedDepartment.name}.`
                  : "Try searching for another doctor or speciality."}
              </p>

              {(selectedDepartment ||
                doctorSearch) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDepartment(null);
                    setDoctorSearch("");
                  }}
                  className="mt-5 rounded-lg bg-[#0066cc] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0052a3]"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 xl:grid-cols-3 lg:grid-cols-2">
              {filteredDoctors.map((doctor) => {
                const image = getImageUrl(
                  doctor?.profileImage
                );

                const doctorName =
                  getDoctorName(doctor);

                const nextDate =
                  getNextAvailableDate(doctor);

                const qualification =
                  doctor?.qualification ||
                  "MBBS";

                const specialization =
                  doctor?.specialization ||
                  "Medical Specialist";

                const experience =
                  doctor?.experience;

                const departmentName =
                  doctor?.department?.name ||
                  selectedDepartment?.name ||
                  "Specialist";

                const location =
                  doctor?.hospitalName ||
                  doctor?.hospital ||
                  doctor?.address?.city ||
                  doctor?.city ||
                  "Yash Hospital";

                const phone =
                  doctor?.phone ||
                  doctor?.mobile ||
                  doctor?.contactNumber;

                return (
                  <article
                    key={doctor?._id}
                    className="group flex min-h-[570px] flex-col rounded-[20px] border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_12px_35px_rgba(15,23,42,0.09)]"
                  >
                    {/* =================================================
                        TOP DOCTOR INFO
                    ================================================== */}

                    <div className="flex gap-4">
                      {/* Doctor Image */}

                      <div className="h-[150px] w-[150px] shrink-0 overflow-hidden rounded-xl bg-slate-100">
                        {image ? (
                          <img
                            src={image}
                            alt={doctorName}
                            className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.03]"
                            onError={(e) => {
                              e.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-[#eef5fb]">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-[#0066cc] shadow-sm">
                              <UserRound
                                size={40}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Name + Specialization */}

                      <div className="min-w-0 flex-1">
                        <h3 className="text-[20px] font-semibold leading-6 text-black">
                          {doctorName}
                        </h3>

                        <p className="mt-3 line-clamp-4 text-[15px] leading-[21px] text-slate-700">
                          {doctor?.shortBio ||
                            doctor?.bio ||
                            `Consultant, ${specialization}`}
                        </p>

                        {experience !==
                          undefined &&
                          experience !== null &&
                          experience !== "" && (
                            <p className="mt-3 text-[13px] font-medium text-slate-500">
                              {experience}{" "}
                              {Number(experience) ===
                              1
                                ? "year"
                                : "years"}{" "}
                              experience
                            </p>
                          )}
                      </div>
                    </div>

                    {/* =================================================
                        QUALIFICATION
                    ================================================== */}

                    <div className="mt-5">
                      <p className="text-[15px] font-medium text-slate-500">
                        Qualifications
                      </p>

                      <p className="mt-2 line-clamp-3 text-[15px] leading-[21px] text-black">
                        {qualification}
                      </p>
                    </div>

                    {/* =================================================
                        AREAS OF EXPERTISE
                    ================================================== */}

                    <div className="mt-5">
                      <p className="text-[15px] font-medium text-slate-500">
                        Areas of Expertise
                      </p>

                      <p className="mt-2 line-clamp-3 text-[15px] leading-[21px] text-black">
                        {doctor?.areasOfExpertise ||
                          doctor?.expertise ||
                          specialization}
                      </p>
                    </div>

                    {/* =================================================
                        LOCATION
                    ================================================== */}

                    <div className="mt-5">
                      <div className="flex items-start gap-2">
                        <MapPin
                          size={17}
                          className="mt-0.5 shrink-0 text-slate-500"
                        />

                        <div className="min-w-0">
                          <p className="text-[15px] font-medium text-slate-500">
                            Location
                          </p>

                          <p className="mt-2 line-clamp-2 text-[15px] leading-[21px] text-black">
                            {location}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* =================================================
                        DEPARTMENT
                    ================================================== */}

                    <div className="mt-4 flex items-center gap-2">
                      <Stethoscope
                        size={16}
                        className="text-[#0066cc]"
                      />

                      <span className="text-[13px] font-medium text-slate-500">
                        {departmentName}
                      </span>
                    </div>

                    {/* =================================================
                        SPACER
                    ================================================== */}

                    <div className="flex-1" />

                    {/* =================================================
                        BOTTOM ACTION
                    ================================================== */}

                    <div className="mt-6 flex items-center gap-3">
                      {/* Book Appointment */}

                      <button
                        type="button"
                        onClick={() =>
                          handleBookAppointment(
                            doctor
                          )
                        }
                        className="flex h-[74px] flex-1 items-center justify-between overflow-hidden rounded-xl bg-[#075db5] text-white transition hover:bg-[#004f9f]"
                      >
                        <div className="flex items-center gap-5 pl-5">
                          <div className="text-left">
                            <p className="text-[13px] font-medium text-blue-100">
                              Available
                            </p>

                            <p className="mt-1 text-[15px] font-semibold">
                              {formatDate(
                                nextDate
                              )}
                            </p>
                          </div>

                          <div className="h-9 w-px bg-blue-300" />

                          <p className="text-[16px] font-semibold">
                            Book Appointment
                          </p>
                        </div>

                        <div className="flex h-full w-12 items-center justify-center">
                          <ChevronRight
                            size={21}
                          />
                        </div>
                      </button>

                      {/* Call */}

                      <button
                        type="button"
                        onClick={() =>
                          handleCall(doctor)
                        }
                        disabled={!phone}
                        aria-label={`Call ${doctorName}`}
                        className="flex h-[74px] w-[66px] shrink-0 items-center justify-center rounded-xl border border-[#0066cc] bg-white text-[#0066cc] transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300"
                      >
                        <Phone
                          size={22}
                          strokeWidth={2.5}
                        />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          BOTTOM INFORMATION
      ========================================================== */}

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-8 lg:px-10">
          <div className="grid gap-5 md:grid-cols-3">
            {/* Appointment */}

            <div className="flex gap-4 rounded-2xl border border-slate-200 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0066cc]">
                <CalendarDays size={21} />
              </div>

              <div>
                <h3 className="font-semibold text-black">
                  Easy Appointment Booking
                </h3>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                  Choose your doctor and book your
                  preferred appointment time.
                </p>
              </div>
            </div>

            {/* Specialists */}

            <div className="flex gap-4 rounded-2xl border border-slate-200 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0066cc]">
                <Stethoscope size={21} />
              </div>

              <div>
                <h3 className="font-semibold text-black">
                  Experienced Specialists
                </h3>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                  Connect with qualified and experienced
                  healthcare professionals.
                </p>
              </div>
            </div>

            {/* Support */}

            <div className="flex gap-4 rounded-2xl border border-slate-200 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0066cc]">
                <Clock3 size={21} />
              </div>

              <div>
                <h3 className="font-semibold text-black">
                  Convenient Healthcare
                </h3>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                  Hospital visits and video consultations
                  available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}