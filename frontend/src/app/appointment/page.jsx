"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Search,
  Phone,
  ChevronRight,
  ChevronLeft,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";

import {
  getDepartment,
} from "@/app/components/utils/Api-call/get_api";

import {
  getDoctors,
} from "@/app/components/utils/Api-call/doctor-api";

import {
  getMyPatients,
} from "@/app/components/utils/Api-call/patient/api/appointmentApi";

import PatientLoginModal from "@/components/pateient/PatientLoginModal";
import PatientSelectionPopup from "@/components/pateient/PatientSelectionPopup";
import PatientProfileModal from "@/components/pateient/PatientProfileModal";

import { client } from "@/app/components/healper";

/* =========================================================
   SERVER URL
========================================================= */

const SERVER_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(
    /\/api\/?$/,
    ""
  ) || "http://localhost:5000";

/* =========================================================
   DOCTOR IMAGE URL
========================================================= */

const getDoctorImage = (image) => {
  if (!image) return "";

  const cleanImage = String(image).trim();

  if (
    cleanImage.startsWith("http://") ||
    cleanImage.startsWith("https://") ||
    cleanImage.startsWith("data:")
  ) {
    return cleanImage;
  }

  return `${SERVER_URL}/${cleanImage.replace(/^\/+/, "")}`;
};

/* =========================================================
   DEPARTMENT IMAGE URL
========================================================= */

const getDepartmentImage = (department) => {
  if (!department?.image) return "";

  const cleanImage = String(department.image).trim();

  if (
    cleanImage.startsWith("http://") ||
    cleanImage.startsWith("https://") ||
    cleanImage.startsWith("data:")
  ) {
    return cleanImage;
  }

  return `${SERVER_URL}/Departments/${cleanImage.replace(
    /^\/+/,
    ""
  )}`;
};

/* =========================================================
   NORMALIZE ARRAY
========================================================= */

const normalizeArray = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

/* =========================================================
   DOCTOR NAME
========================================================= */

const getDoctorName = (doctor) => {
  const firstName = doctor?.firstName || "";
  const lastName = doctor?.lastName || "";

  const fullName = `${firstName} ${lastName}`.trim();

  if (fullName) {
    return fullName.startsWith("Dr.")
      ? fullName
      : `Dr. ${fullName}`;
  }

  if (doctor?.name) {
    return doctor.name.startsWith("Dr.")
      ? doctor.name
      : `Dr. ${doctor.name}`;
  }

  return "Doctor";
};

/* =========================================================
   DOCTOR DESIGNATION
========================================================= */

const getDoctorDesignation = (doctor) => {
  if (doctor?.designation) {
    return doctor.designation;
  }

  if (doctor?.position) {
    return doctor.position;
  }

  const specialization = normalizeArray(
    doctor?.specialization
  );

  if (specialization.length > 0) {
    return `Consultant, ${specialization
      .slice(0, 2)
      .join(", ")}`;
  }

  return "Medical Consultant";
};

/* =========================================================
   DEPARTMENT ICONS
========================================================= */

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

/* =========================================================
   TODAY
========================================================= */

const getToday = () => {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return today;
};

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (date) => {
  if (!date) return "-";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

/* =========================================================
   FORMAT DATE FOR STORAGE
========================================================= */

const formatDateForStorage = (date) => {
  if (!date) return "";

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/* =========================================================
   GET DAY NAME
========================================================= */

const getDayName = (date) => {
  return date
    .toLocaleDateString("en-US", {
      weekday: "long",
    })
    .toLowerCase();
};

/* =========================================================
   GET AVAILABILITY FOR DATE
========================================================= */

const getAvailabilityForDate = (
  doctor,
  date
) => {
  const availability = Array.isArray(
    doctor?.availability
  )
    ? doctor.availability
    : [];

  const selectedDay =
    getDayName(date);

  return (
    availability.find((item) => {
      return (
        String(item?.day || "")
          .trim()
          .toLowerCase() === selectedDay
      );
    }) || null
  );
};

/* =========================================================
   CHECK DOCTOR AVAILABLE ON DATE
========================================================= */

const isDoctorAvailableOnDate = (
  doctor,
  date
) => {
  const availability =
    getAvailabilityForDate(
      doctor,
      date
    );

  if (!availability) {
    return false;
  }

  const hospitalEnabled =
    availability?.hospital?.enabled === true;

  const videoEnabled =
    availability?.video?.enabled === true;

  return (
    hospitalEnabled ||
    videoEnabled
  );
};

/* =========================================================
   GET NEXT AVAILABLE DATE
========================================================= */

const getNextAvailableDate = (
  doctor
) => {
  const today = getToday();

  for (
    let offset = 0;
    offset < 7;
    offset++
  ) {
    const date = new Date(today);

    date.setDate(
      today.getDate() + offset
    );

    if (
      isDoctorAvailableOnDate(
        doctor,
        date
      )
    ) {
      return date;
    }
  }

  return null;
};

/* =========================================================
   PAGE
========================================================= */

export default function AppointmentPage() {
  const router = useRouter();

  /* =========================================================
     DEPARTMENT STATE
  ========================================================== */

  const [
    departments,
    setDepartments,
  ] = useState([]);

  const [
    selectedDepartment,
    setSelectedDepartment,
  ] = useState(null);

  const [
    departmentSearch,
    setDepartmentSearch,
  ] = useState("");

  const [
    departmentStart,
    setDepartmentStart,
  ] = useState(0);

  const [
    showAllDepartments,
    setShowAllDepartments,
  ] = useState(false);

  const [
    loadingDepartments,
    setLoadingDepartments,
  ] = useState(true);

  /* =========================================================
     DOCTOR STATE
  ========================================================== */

  const [
    doctors,
    setDoctors,
  ] = useState([]);

  const [
    doctorSearch,
    setDoctorSearch,
  ] = useState("");

  const [
    loadingDoctors,
    setLoadingDoctors,
  ] = useState(true);

  /* =========================================================
     ERROR
  ========================================================== */

  const [
    error,
    setError,
  ] = useState("");

  /* =========================================================
     PATIENT AUTH
  ========================================================== */

  const [
    showPatientLogin,
    setShowPatientLogin,
  ] = useState(false);

  const [
    showPatientSelection,
    setShowPatientSelection,
  ] = useState(false);

  const [
    showPatientProfile,
    setShowPatientProfile,
  ] = useState(false);

  const [
    selectedDoctorForBooking,
    setSelectedDoctorForBooking,
  ] = useState(null);

  const [
    isPatientLoggedIn,
    setIsPatientLoggedIn,
  ] = useState(false);

  const [
    loggedInPatient,
    setLoggedInPatient,
  ] = useState(null);

  const [
    patientAuthChecked,
    setPatientAuthChecked,
  ] = useState(false);

  /* =========================================================
     ALL PATIENTS
  ========================================================== */

  const [
    patients,
    setPatients,
  ] = useState([]);

  const [
    selectedPatient,
    setSelectedPatient,
  ] = useState(null);

  const [
    loadingPatients,
    setLoadingPatients,
  ] = useState(false);

  /* =========================================================
     CHECK PATIENT AUTHENTICATION
  ========================================================== */

  useEffect(() => {
    const checkPatientAuth = async () => {
      try {
        const response = await client.get(
          "auth/patient/me"
        );

        if (
          response?.data?.success &&
          response?.data?.patient
        ) {
          setIsPatientLoggedIn(true);

          setLoggedInPatient(
            response.data.patient
          );
        } else {
          setIsPatientLoggedIn(false);
          setLoggedInPatient(null);
        }
      } catch (error) {
        console.log(
          "PATIENT AUTH CHECK:",
          error?.response?.data?.message ||
            "Patient is not logged in"
        );

        setIsPatientLoggedIn(false);
        setLoggedInPatient(null);
      } finally {
        setPatientAuthChecked(true);
      }
    };

    checkPatientAuth();
  }, []);

  /* =========================================================
     LOAD PATIENTS
  ========================================================== */

  const loadPatients = async (
    fallbackPatient = null
  ) => {
    const currentPatient =
      fallbackPatient || loggedInPatient;

    if (!isPatientLoggedIn && !currentPatient) {
      setPatients([]);
      return;
    }

    try {
      setLoadingPatients(true);

      const response =
        await getMyPatients();

      console.log(
        "🔥 MY PATIENTS RESPONSE:",
        response
      );

      const list =
        Array.isArray(
          response?.patients
        )
          ? response.patients
          : Array.isArray(
              response?.data?.patients
            )
          ? response.data.patients
          : Array.isArray(
              response?.data?.data
            )
          ? response.data.data
          : Array.isArray(
              response?.data
            )
          ? response.data
          : Array.isArray(response)
          ? response
          : [];

      let finalPatients = [...list];

      if (currentPatient?._id) {
        const alreadyExists =
          finalPatients.some(
            (item) =>
              String(item?._id) ===
              String(currentPatient?._id)
          );

        if (!alreadyExists) {
          finalPatients.unshift(
            currentPatient
          );
        }
      }

      if (
        finalPatients.length === 0 &&
        currentPatient
      ) {
        finalPatients = [
          currentPatient,
        ];
      }

      setPatients(
        finalPatients
      );

      console.log(
        "🔥 FINAL PATIENT LIST:",
        finalPatients
      );
    } catch (error) {
      console.error(
        "❌ GET MY PATIENTS ERROR:",
        error
      );

      if (currentPatient) {
        setPatients([
          currentPatient,
        ]);
      } else {
        setPatients([]);
      }
    } finally {
      setLoadingPatients(false);
    }
  };

  /* =========================================================
     LOAD PATIENTS WHEN LOGIN CHANGES
  ========================================================== */

  useEffect(() => {
    if (
      patientAuthChecked &&
      isPatientLoggedIn &&
      loggedInPatient
    ) {
      loadPatients();
    }
  }, [
    patientAuthChecked,
    isPatientLoggedIn,
    loggedInPatient,
  ]);

  /* =========================================================
     LOAD DEPARTMENTS
  ========================================================== */

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setLoadingDepartments(true);
        setError("");

        const response =
          await getDepartment();

        console.log(
          "🔥 DEPARTMENT API RESPONSE:",
          response
        );

        const list =
          Array.isArray(
            response?.data
          )
            ? response.data
            : Array.isArray(
                response?.departments
              )
            ? response.departments
            : Array.isArray(response)
            ? response
            : [];

        const activeDepartments =
          list.filter(
            (department) =>
              department?.status !== false
          );

        setDepartments(
          activeDepartments
        );
      } catch (err) {
        console.error(
          "GET DEPARTMENT ERROR:",
          err
        );

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

  /* =========================================================
     LOAD DOCTORS
  ========================================================== */

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoadingDoctors(true);
        setError("");

        const response =
          await getDoctors();

        console.log(
          "🔥 DOCTORS API RESPONSE:",
          response
        );

        const list =
          Array.isArray(
            response?.data
          )
            ? response.data
            : Array.isArray(
                response?.doctors
              )
            ? response.doctors
            : Array.isArray(response)
            ? response
            : [];

        console.log(
          "🔥 DOCTOR LIST:",
          list
        );

        const activeDoctors =
          list.filter(
            (doctor) =>
              doctor?.status !== false
          );

        setDoctors(
          activeDoctors
        );
      } catch (err) {
        console.error(
          "GET DOCTORS ERROR:",
          err
        );

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

  /* =========================================================
     FILTER DEPARTMENTS
  ========================================================== */

  const filteredDepartments =
    useMemo(() => {
      const search =
        departmentSearch
          .trim()
          .toLowerCase();

      if (!search) {
        return departments;
      }

      return departments.filter(
        (department) => {
          const name =
            department?.name?.toLowerCase() ||
            "";

          const code =
            department?.code?.toLowerCase() ||
            "";

          const location =
            department?.location?.toLowerCase() ||
            "";

          return (
            name.includes(search) ||
            code.includes(search) ||
            location.includes(search)
          );
        }
      );
    }, [
      departments,
      departmentSearch,
    ]);

  /* =========================================================
     FILTER DOCTORS
  ========================================================== */

  const filteredDoctors =
    useMemo(() => {
      const search =
        doctorSearch
          .trim()
          .toLowerCase();

      let result = doctors;

      if (selectedDepartment?._id) {
        result = result.filter(
          (doctor) => {
            const doctorDepartment =
              doctor?.department?._id ||
              doctor?.department?.id ||
              doctor?.department;

            return (
              String(
                doctorDepartment
              ) ===
              String(
                selectedDepartment._id
              )
            );
          }
        );
      }

      if (!search) {
        return result;
      }

      return result.filter(
        (doctor) => {
          const fullName =
            `${doctor?.firstName || ""} ${
              doctor?.lastName || ""
            }`.toLowerCase();

          const doctorName =
            String(
              doctor?.name || ""
            ).toLowerCase();

          const specialization =
            normalizeArray(
              doctor?.specialization
            )
              .join(" ")
              .toLowerCase();

          const qualification =
            normalizeArray(
              doctor?.qualification
            )
              .join(" ")
              .toLowerCase();

          return (
            fullName.includes(search) ||
            doctorName.includes(search) ||
            specialization.includes(search) ||
            qualification.includes(search)
          );
        }
      );
    }, [
      doctors,
      selectedDepartment,
      doctorSearch,
    ]);

  /* =========================================================
     VISIBLE DEPARTMENTS
  ========================================================== */

  const visibleDepartments =
    useMemo(() => {
      if (
        showAllDepartments ||
        departmentSearch.trim()
      ) {
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

  /* =========================================================
     SELECT DEPARTMENT
  ========================================================== */

  const handleDepartmentSelect = (
    department
  ) => {
    if (
      selectedDepartment?._id ===
      department?._id
    ) {
      setSelectedDepartment(null);
      return;
    }

    setSelectedDepartment(
      department
    );

    setTimeout(() => {
      document
        .getElementById(
          "doctor-list"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  /* =========================================================
     CLEAR DEPARTMENT
  ========================================================== */

  const clearDepartment = () => {
    setSelectedDepartment(null);
  };

  /* =========================================================
     BOOK APPOINTMENT
  ========================================================== */

  const handleBookAppointment = (
    doctor
  ) => {
    const nextAvailableDate =
      getNextAvailableDate(
        doctor
      );

    if (!nextAvailableDate) {
      return;
    }

    if (!patientAuthChecked) {
      return;
    }

    try {
      sessionStorage.setItem(
        "selectedDoctor",
        JSON.stringify(doctor)
      );

      if (selectedDepartment) {
        sessionStorage.setItem(
          "selectedDepartment",
          JSON.stringify(
            selectedDepartment
          )
        );
      } else {
        sessionStorage.removeItem(
          "selectedDepartment"
        );
      }

      sessionStorage.setItem(
        "selectedAppointmentDate",
        formatDateForStorage(
          nextAvailableDate
        )
      );

      setSelectedPatient(null);

      sessionStorage.removeItem(
        "appointmentPatient"
      );

      setSelectedDoctorForBooking(
        doctor
      );

      if (isPatientLoggedIn) {
        sessionStorage.setItem(
          "appointmentPatientType",
          "existing"
        );

        setShowPatientSelection(
          true
        );
      } else {
        sessionStorage.removeItem(
          "appointmentPatientType"
        );

        setShowPatientLogin(true);
      }
    } catch (err) {
      console.error(
        "Unable to save appointment selection:",
        err
      );
    }
  };

  /* =========================================================
     PATIENT LOGIN SUCCESS
  ========================================================== */

  const handlePatientLoginSuccess = (
    patient
  ) => {
    console.log(
      "🔥 PATIENT LOGIN SUCCESS:",
      patient
    );

    setShowPatientLogin(false);

    setIsPatientLoggedIn(true);

    setLoggedInPatient(
      patient
    );

    setSelectedPatient(null);

    sessionStorage.setItem(
      "appointmentPatientType",
      "existing"
    );

    sessionStorage.removeItem(
      "appointmentPatient"
    );

    if (patient) {
      setPatients((prev) => {
        const oldList = Array.isArray(
          prev
        )
          ? prev
          : [];

        const exists =
          oldList.some(
            (item) =>
              String(
                item?._id
              ) ===
              String(
                patient?._id
              )
          );

        if (exists) {
          return oldList;
        }

        return [
          patient,
          ...oldList,
        ];
      });
    }

    setShowPatientSelection(
      true
    );

    setTimeout(() => {
      loadPatients(patient);
    }, 100);
  };

  /* =========================================================
     ADD NEW PATIENT
  ========================================================== */

  const handleAddNewPatient = () => {
    console.log(
      "➕ ADD NEW PATIENT CLICKED"
    );

    sessionStorage.setItem(
      "appointmentPatientType",
      "new"
    );

    sessionStorage.removeItem(
      "appointmentPatient"
    );

    sessionStorage.removeItem(
      "patientSignupToken"
    );

    sessionStorage.removeItem(
      "signupToken"
    );

    setSelectedPatient(null);

    setShowPatientSelection(
      false
    );

    setShowPatientLogin(false);

    setShowPatientProfile(
      true
    );
  };

  /* =========================================================
     NEW PATIENT PROFILE COMPLETE
  ========================================================== */

  const handlePatientProfileComplete = (
    patient
  ) => {
    console.log(
      "🔥 PATIENT PROFILE COMPLETED:",
      patient
    );

    if (!patient) {
      console.error(
        "❌ Patient data missing after profile creation"
      );
      return;
    }

    setShowPatientProfile(
      false
    );

    /*
     * New patient ko list me add karo.
     */

    setPatients((prev) => {
      const oldList = Array.isArray(
        prev
      )
        ? prev
        : [];

      const exists =
        oldList.some(
          (item) =>
            String(
              item?._id ||
                item?.id
            ) ===
            String(
              patient?._id ||
                patient?.id
            )
        );

      if (exists) {
        return oldList.map(
          (item) =>
            String(
              item?._id ||
                item?.id
            ) ===
            String(
              patient?._id ||
                patient?.id
            )
              ? patient
              : item
        );
      }

      return [
        patient,
        ...oldList,
      ];
    });

    /*
     * New patient ko automatically select
     * nahi karna hai.
     *
     * Pehle Select Patient popup open hoga.
     */

    setSelectedPatient(null);

    sessionStorage.removeItem(
      "appointmentPatient"
    );

    sessionStorage.setItem(
      "appointmentPatientType",
      "new"
    );

    /*
     * Select Patient popup reopen.
     */

    setTimeout(() => {
      setShowPatientSelection(
        true
      );
    }, 150);
  };

  /* =========================================================
     SELECT PATIENT
  ========================================================== */

  const handleSelectPatient = (
    patient
  ) => {
    if (!patient) {
      return;
    }

    console.log(
      "🔥 PATIENT SELECTED:",
      patient
    );

    setSelectedPatient(
      patient
    );

    sessionStorage.setItem(
      "appointmentPatient",
      JSON.stringify(patient)
    );

    sessionStorage.setItem(
      "appointmentPatientType",
      "existing"
    );

    setShowPatientSelection(
      false
    );

    router.push(
      "/appointment/details"
    );
  };

  /* =========================================================
     CONTINUE EXISTING PATIENT
  ========================================================== */

  const handleContinueExistingPatient = (
    patient = null
  ) => {
    const finalPatient =
      patient ||
      selectedPatient ||
      loggedInPatient;

    if (!finalPatient) {
      return;
    }

    handleSelectPatient(
      finalPatient
    );
  };

  /* =========================================================
     CLOSE LOGIN
  ========================================================== */

  const handlePatientLoginClose = () => {
    setShowPatientLogin(false);

    setSelectedDoctorForBooking(
      null
    );

    sessionStorage.removeItem(
      "appointmentPatientType"
    );
  };

  /* =========================================================
     CLOSE PATIENT SELECTION
  ========================================================== */

  const handlePatientSelectionClose =
    () => {
      setShowPatientSelection(
        false
      );

      setSelectedDoctorForBooking(
        null
      );

      setSelectedPatient(
        null
      );

      sessionStorage.removeItem(
        "appointmentPatientType"
      );

      sessionStorage.removeItem(
        "appointmentPatient"
      );
    };

  /* =========================================================
     CLOSE PATIENT PROFILE
  ========================================================== */

  const handlePatientProfileClose = () => {
    setShowPatientProfile(
      false
    );

    sessionStorage.removeItem(
      "appointmentPatientType"
    );

    sessionStorage.removeItem(
      "patientSignupToken"
    );

    sessionStorage.removeItem(
      "signupToken"
    );
  };

  /* =========================================================
     CALL DOCTOR
  ========================================================== */

  const handleCall = (doctor) => {
    const phone =
      doctor?.phone ||
      doctor?.mobile ||
      doctor?.contactNumber ||
      doctor?.contact;

    if (!phone) {
      return;
    }

    window.location.href =
      `tel:${phone}`;
  };

  /* =========================================================
     DEPARTMENT PREVIOUS
  ========================================================== */

  const showPreviousDepartments =
    () => {
      setDepartmentStart((prev) =>
        Math.max(
          prev - 1,
          0
        )
      );
    };

  /* =========================================================
     DEPARTMENT NEXT
  ========================================================== */

  const showNextDepartments = () => {
    const maxStart = Math.max(
      filteredDepartments.length -
        8,
      0
    );

    setDepartmentStart((prev) =>
      Math.min(
        prev + 1,
        maxStart
      )
    );
  };

  /* =========================================================
     DEPARTMENT SKELETON
  ========================================================== */

  const DepartmentSkeleton = () => {
    return (
      <div className="flex gap-6 overflow-hidden">
        {Array.from({
          length: 8,
        }).map((_, index) => (
          <div
            key={index}
            className="w-[82px] shrink-0 animate-pulse text-center"
          >
            <div className="mx-auto h-[68px] w-[68px] rounded-full bg-slate-200" />

            <div className="mx-auto mt-3 h-3 w-16 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    );
  };

  /* =========================================================
     DOCTOR SKELETON
  ========================================================== */

  const DoctorSkeleton = () => {
    return (
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-[14px] border border-slate-200 bg-white p-5"
          >
            <div className="flex gap-4">
              <div className="h-[156px] w-[156px] shrink-0 rounded-xl bg-slate-200" />

              <div className="flex-1">
                <div className="h-6 w-36 rounded bg-slate-200" />

                <div className="mt-4 h-4 w-40 rounded bg-slate-200" />

                <div className="mt-2 h-4 w-28 rounded bg-slate-200" />
              </div>
            </div>

            <div className="mt-6 h-4 w-32 rounded bg-slate-200" />

            <div className="mt-3 h-4 w-64 rounded bg-slate-200" />

            <div className="mt-6 h-4 w-36 rounded bg-slate-200" />

            <div className="mt-3 h-4 w-48 rounded bg-slate-200" />

            <div className="mt-6 h-[74px] rounded-xl bg-slate-200" />
          </div>
        ))}
      </div>
    );
  };

  /* =========================================================
     RETURN
  ========================================================== */

  return (
    <main className="min-h-screen bg-[#F7F9FC] text-slate-900">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0066CC]">
                <Stethoscope size={14} />
                Healthcare Specialists
              </div>

              <h1 className="text-[32px] font-semibold tracking-[-1px] text-slate-950 sm:text-[38px]">
                Find a Doctor
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Search by doctor,
                speciality or
                location and find
                the right healthcare
                professional for your
                needs.
              </p>
            </div>

            <div className="relative w-full lg:w-[390px]">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={doctorSearch}
                onChange={(e) =>
                  setDoctorSearch(
                    e.target.value
                  )
                }
                placeholder="Search doctor or speciality"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-10 text-sm outline-none transition focus:border-[#0066CC] focus:bg-white focus:ring-4 focus:ring-blue-50"
              />

              {doctorSearch && (
                <button
                  type="button"
                  onClick={() =>
                    setDoctorSearch("")
                  }
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200"
                >
                  <X size={15} />
                </button>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          DEPARTMENT
      ====================================================== */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1440px] px-5 py-6 sm:px-8 lg:px-10">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[17px] font-semibold text-slate-950">
                Browse by Speciality
              </h2>

              <p className="mt-1 text-[13px] text-slate-500">
                Choose a speciality to
                find the right doctor.
              </p>
            </div>

            {selectedDepartment && (
              <button
                type="button"
                onClick={
                  clearDepartment
                }
                className="flex items-center gap-1.5 text-sm font-semibold text-[#005BBB] hover:underline"
              >
                <X size={14} />
                Clear
              </button>
            )}
          </div>

          <div className="relative mt-6">

            {loadingDepartments ? (
              <DepartmentSkeleton />
            ) : filteredDepartments.length ===
              0 ? (

              <div className="rounded-xl border border-dashed border-slate-300 py-8 text-center">
                <Stethoscope
                  size={30}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-2 text-sm font-medium text-slate-500">
                  No departments found
                </p>
              </div>

            ) : (

              <div className="flex items-center gap-3">

                {!showAllDepartments &&
                  filteredDepartments.length >
                    8 && (

                    <button
                      type="button"
                      onClick={
                        showPreviousDepartments
                      }
                      disabled={
                        departmentStart ===
                        0
                      }
                      className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-[#0066CC] hover:text-[#0066CC] disabled:cursor-not-allowed disabled:opacity-30 md:flex"
                    >
                      <ChevronLeft
                        size={17}
                      />
                    </button>
                  )}

                <div
                  className={`flex flex-1 ${
                    showAllDepartments
                      ? "flex-wrap justify-center"
                      : "overflow-hidden"
                  } gap-x-7 gap-y-6`}
                >

                  {visibleDepartments.map(
                    (
                      department,
                      index
                    ) => {

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
                          className="group w-[78px] shrink-0 text-center"
                        >

                          <div
                            className={`mx-auto flex h-[68px] w-[68px] items-center justify-center overflow-hidden rounded-full border-2 bg-slate-50 transition ${
                              selected
                                ? "border-[#0066CC] bg-blue-50 shadow-[0_0_0_4px_rgba(0,102,204,0.07)]"
                                : "border-transparent group-hover:border-[#0066CC]"
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
                              <span className="text-[26px]">
                                {
                                  DEPARTMENT_ICONS[
                                    index %
                                      DEPARTMENT_ICONS.length
                                  ]
                                }
                              </span>
                            )}

                          </div>

                          <p
                            className={`mt-2.5 line-clamp-2 text-[12px] leading-4 ${
                              selected
                                ? "font-semibold text-[#005BBB]"
                                : "font-medium text-slate-700"
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

                {!showAllDepartments &&
                  filteredDepartments.length >
                    8 && (

                    <button
                      type="button"
                      onClick={
                        showNextDepartments
                      }
                      disabled={
                        departmentStart >=
                        Math.max(
                          filteredDepartments.length -
                            8,
                          0
                        )
                      }
                      className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-[#0066CC] hover:text-[#0066CC] disabled:cursor-not-allowed disabled:opacity-30 md:flex"
                    >
                      <ChevronRight
                        size={17}
                      />
                    </button>
                  )}

              </div>
            )}

            {!showAllDepartments &&
              filteredDepartments.length >
                8 && (

                <div className="mt-5 text-center">
                  <button
                    type="button"
                    onClick={() =>
                      setShowAllDepartments(
                        true
                      )
                    }
                    className="text-[13px] font-semibold text-[#005BBB] hover:underline"
                  >
                    See More
                  </button>
                </div>
              )}

            {showAllDepartments &&
              filteredDepartments.length >
                8 && (

                <div className="mt-5 text-center">
                  <button
                    type="button"
                    onClick={() =>
                      setShowAllDepartments(
                        false
                      )
                    }
                    className="text-[13px] font-semibold text-[#005BBB] hover:underline"
                  >
                    Show Less
                  </button>
                </div>
              )}

          </div>
        </div>
      </section>

      {/* =====================================================
          DOCTOR LIST
      ====================================================== */}

      <section
        id="doctor-list"
        className="bg-[#F7F9FC] py-8"
      >
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#0066CC]">
                Our Specialists
              </p>

              <h2 className="mt-1.5 text-[25px] font-semibold tracking-[-0.5px] text-slate-950">
                {selectedDepartment
                  ? `Doctors in ${selectedDepartment.name}`
                  : "Find the right doctor for you"}
              </h2>
            </div>

            {!loadingDoctors && (
              <div className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[13px] font-medium text-slate-500">

                <span className="font-semibold text-slate-900">
                  {filteredDoctors.length}
                </span>{" "}

                {filteredDoctors.length ===
                1
                  ? "doctor"
                  : "doctors"}{" "}

                available
              </div>
            )}

          </div>

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">

              <X
                size={17}
                className="mt-0.5 shrink-0"
              />

              <div>
                <p className="text-sm font-semibold">
                  Unable to load data
                </p>

                <p className="mt-1 text-xs">
                  {error}
                </p>
              </div>

            </div>
          )}

          {loadingDoctors ? (
            <DoctorSkeleton />
          ) : filteredDoctors.length ===
            0 ? (

            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#0066CC]">
                <UserRound size={27} />
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-800">
                No doctors found
              </h3>

              <p className="mx-auto mt-1.5 max-w-md text-sm leading-6 text-slate-500">
                {selectedDepartment
                  ? `There are currently no active doctors available in ${selectedDepartment.name}.`
                  : "Try searching for another doctor or speciality."}
              </p>

              {(selectedDepartment ||
                doctorSearch) && (

                <button
                  type="button"
                  onClick={() => {
                    setSelectedDepartment(
                      null
                    );

                    setDoctorSearch("");
                  }}
                  className="mt-4 rounded-lg bg-[#0066CC] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0052A3]"
                >
                  Clear Filters
                </button>
              )}

            </div>

          ) : (

            <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">

              {filteredDoctors.map(
                (doctor) => {

                  const image =
                    getDoctorImage(
                      doctor?.profileImage
                    );

                  const doctorName =
                    getDoctorName(
                      doctor
                    );

                  const designation =
                    getDoctorDesignation(
                      doctor
                    );

                  const qualifications =
                    normalizeArray(
                      doctor?.qualification
                    );

                  const specializations =
                    normalizeArray(
                      doctor?.specialization
                    );

                  const phone =
                    doctor?.phone ||
                    doctor?.mobile ||
                    doctor?.contactNumber ||
                    doctor?.contact;

                  const nextAvailableDate =
                    getNextAvailableDate(
                      doctor
                    );

                  const isAvailable =
                    Boolean(
                      nextAvailableDate
                    );

                  const availableDate =
                    nextAvailableDate
                      ? formatDate(
                          nextAvailableDate
                        )
                      : "-";

                  return (
                    <article
                      key={doctor?._id}
                      className="flex min-h-[470px] flex-col rounded-[14px] border border-slate-200 bg-white p-5 shadow-[0_1px_5px_rgba(15,23,42,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_8px_24px_rgba(15,23,42,0.07)]"
                    >

                      <div className="flex gap-5">

                        <div className="h-[156px] w-[156px] shrink-0 overflow-hidden rounded-[10px] bg-[#F0F0F0]">

                          {image ? (
                            <img
                              src={image}
                              alt={doctorName}
                              className="h-full w-full object-cover object-top"
                              onError={(e) => {
                                e.currentTarget.style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-[#F0F0F0]">

                              <UserRound
                                size={72}
                                strokeWidth={1.2}
                                className="text-slate-300"
                              />

                            </div>
                          )}

                        </div>

                        <div className="min-w-0 flex-1">

                          <h3 className="text-[22px] font-medium leading-[1.2] tracking-[-0.3px] text-black">
                            {doctorName}
                          </h3>

                          <p className="mt-4 text-[16px] leading-[1.45] text-black">
                            {designation}
                          </p>

                        </div>

                      </div>

                      <div className="mt-6">

                        <p className="text-[16px] font-normal text-[#777777]">
                          Qualifications
                        </p>

                        <p className="mt-2 text-[16px] leading-6 text-black">
                          {qualifications.length >
                          0
                            ? qualifications.join(
                                ", "
                              )
                            : "MBBS"}
                        </p>

                      </div>

                      <div className="mt-6">

                        <p className="text-[16px] font-normal text-[#777777]">
                          Areas of Expertise
                        </p>

                        <p className="mt-2 text-[16px] leading-6 text-black">
                          {specializations.length >
                          0
                            ? specializations.join(
                                " | "
                              )
                            : "Medical Specialist"}
                        </p>

                      </div>

                      <div className="flex-1" />

                      <div className="mt-7 flex items-stretch gap-4">

                        <div
                          className={`flex h-[74px] min-w-0 flex-1 overflow-hidden rounded-[10px] text-white ${
                            isAvailable
                              ? "bg-[#005BBB]"
                              : "bg-[#DEDEDE]"
                          }`}
                        >

                          <div className="flex w-[138px] shrink-0 flex-col items-center justify-center">

                            <span className="text-[16px] font-normal">
                              Available
                            </span>

                            <span className="mt-1 text-[15px]">
                              {availableDate}
                            </span>

                          </div>

                          <div
                            className={`my-[18px] w-px ${
                              isAvailable
                                ? "bg-white/70"
                                : "bg-white"
                            }`}
                          />

                          <button
                            type="button"
                            disabled={
                              !isAvailable
                            }
                            onClick={() =>
                              handleBookAppointment(
                                doctor
                              )
                            }
                            className={`flex min-w-0 flex-1 items-center justify-center px-4 text-center text-[17px] font-medium ${
                              isAvailable
                                ? "cursor-pointer hover:bg-[#004A99]"
                                : "cursor-not-allowed"
                            }`}
                          >
                            Book Appointment
                          </button>

                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleCall(
                              doctor
                            )
                          }
                          disabled={!phone}
                          aria-label={`Call ${doctorName}`}
                          className="flex h-[74px] w-[66px] shrink-0 items-center justify-center rounded-[10px] border border-[#005BBB] bg-white text-[#005BBB] transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300"
                        >
                          <Phone
                            size={25}
                            strokeWidth={2}
                          />
                        </button>

                      </div>

                    </article>
                  );
                }
              )}

            </div>
          )}

        </div>
      </section>

      {/* =====================================================
          INFORMATION
      ====================================================== */}

      <section className="border-t border-slate-200 bg-white">

        <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 lg:px-10">

          <div className="grid gap-4 md:grid-cols-3">

            <div className="rounded-xl border border-slate-200 bg-white p-4">

              <h3 className="text-sm font-semibold text-slate-950">
                Easy Appointment Booking
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Choose your doctor
                and book your preferred
                appointment time.
              </p>

            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">

              <h3 className="text-sm font-semibold text-slate-950">
                Experienced Specialists
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Connect with qualified
                and experienced
                healthcare professionals.
              </p>

            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">

              <h3 className="text-sm font-semibold text-slate-950">
                Convenient Healthcare
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Hospital visits and
                video consultations
                available.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          PATIENT SELECTION POPUP
      ====================================================== */}

      {showPatientSelection && (
        <PatientSelectionPopup
          open={
            showPatientSelection
          }
          patient={
            loggedInPatient
          }
          patients={
            patients
          }
          selectedPatient={
            selectedPatient
          }
          onSelectPatient={
            handleSelectPatient
          }
          onClose={
            handlePatientSelectionClose
          }
          onAddNewPatient={
            handleAddNewPatient
          }
          onContinueExisting={
            handleContinueExistingPatient
          }
        />
      )}

      {/* =====================================================
          PATIENT LOGIN MODAL
      ====================================================== */}

      {showPatientLogin && (
        <PatientLoginModal
          open={
            showPatientLogin
          }
          onClose={
            handlePatientLoginClose
          }
          onLoginSuccess={
            handlePatientLoginSuccess
          }
        />
      )}

      {/* =====================================================
          PATIENT PROFILE MODAL
      ====================================================== */}

      {showPatientProfile && (
        <PatientProfileModal
          open={
            showPatientProfile
          }
          initialEmail=""
          signupToken=""
          isAdditionalPatient={true}
          onComplete={
            handlePatientProfileComplete
          }
          onClose={
            handlePatientProfileClose
          }
        />
      )}

    </main>
  );
}