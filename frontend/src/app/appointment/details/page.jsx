"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  IndianRupee,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Video,
  Building2,
  X,
} from "lucide-react";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000/api"
).replace(/\/+$/, "");

const SERVER_URL =
  API_BASE_URL.replace(/\/api\/?$/, "") ||
  "http://localhost:5000";

const VISIT_TYPES = [
  {
    id: "hospital",
    title: "Hospital Visit",
    description: "Visit doctor at hospital",
    icon: Building2,
  },
  {
    id: "video",
    title: "Video Consultation",
    description: "Consult doctor online",
    icon: Video,
  },
];

/* =========================================================
   BASIC HELPERS
========================================================= */

function pad(value) {
  return String(value).padStart(2, "0");
}

function formatDateForStorage(date) {
  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1
  )}-${pad(date.getDate())}`;
}

function parseStoredDate(value) {
  if (!value) return null;

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function getDayName(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
  });
}

function formatDisplayDate(date) {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* =========================================================
   ID HELPERS
========================================================= */

function getDoctorId(doctor) {
  return (
    doctor?._id ||
    doctor?.id ||
    doctor?.doctorId ||
    ""
  );
}

function getDepartmentId(department, doctor) {
  return (
    department?._id ||
    department?.id ||
    department?.departmentId ||
    doctor?.department?._id ||
    doctor?.department?.id ||
    doctor?.department?.departmentId ||
    doctor?.departmentId ||
    ""
  );
}

/* =========================================================
   IMAGE HELPERS
========================================================= */

function getImageValue(value) {
  if (!value) return "";

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "object") {
    return (
      value.url ||
      value.path ||
      value.image ||
      value.imageUrl ||
      value.secure_url ||
      ""
    );
  }

  return "";
}

function getDoctorImageCandidates(doctor) {
  const values = [
    doctor?.profileImage,
    doctor?.image,
    doctor?.imageUrl,
    doctor?.photo,
    doctor?.avatar,
  ];

  const result = [];

  values.forEach((value) => {
    const image = getImageValue(value);

    if (!image) return;

    let finalUrl = image;

    if (
      !image.startsWith("http://") &&
      !image.startsWith("https://") &&
      !image.startsWith("data:")
    ) {
      finalUrl = `${SERVER_URL}/${image.replace(/^\/+/, "")}`;
    }

    if (!result.includes(finalUrl)) {
      result.push(finalUrl);
    }
  });

  return result;
}

/* =========================================================
   TIME HELPERS
========================================================= */

function normalizeTime(value) {
  if (!value) return "";

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function timeToMinutes(value) {
  if (!value) return null;

  const text = normalizeTime(value).toUpperCase();

  let hour;
  let minute;

  if (text.includes("AM") || text.includes("PM")) {
    const cleaned = text.replace(/\s+/g, " ").trim();
    const parts = cleaned.split(" ");

    const timePart = parts[0];
    const period = parts[1];

    const timeParts = timePart.split(":");

    hour = Number(timeParts[0]);
    minute = Number(timeParts[1] || 0);

    if (
      Number.isNaN(hour) ||
      Number.isNaN(minute)
    ) {
      return null;
    }

    if (period === "AM" && hour === 12) {
      hour = 0;
    }

    if (period === "PM" && hour !== 12) {
      hour += 12;
    }

    if (
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59
    ) {
      return null;
    }

    return hour * 60 + minute;
  }

  const parts = text.split(":");

  if (parts.length < 2) {
    return null;
  }

  hour = Number(parts[0]);
  minute = Number(parts[1]);

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute)
  ) {
    return null;
  }

  if (
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  return hour * 60 + minute;
}

function minutesToTime(minutes) {
  if (!Number.isFinite(minutes)) {
    return "";
  }

  const normalizedMinutes =
    ((minutes % 1440) + 1440) % 1440;

  const hour = Math.floor(
    normalizedMinutes / 60
  );

  const minute =
    normalizedMinutes % 60;

  return `${pad(hour)}:${pad(minute)}`;
}

function formatTime(value) {
  const minutes = timeToMinutes(value);

  if (minutes === null) {
    return value || "";
  }

  let hour = Math.floor(minutes / 60);
  const minute = minutes % 60;

  const period =
    hour >= 12 ? "PM" : "AM";

  if (hour === 0) {
    hour = 12;
  } else if (hour > 12) {
    hour -= 12;
  }

  return `${hour}:${pad(minute)} ${period}`;
}

/* =========================================================
   SLOT GENERATOR
========================================================= */

function generateSlots(
  startTime,
  endTime,
  duration
) {
  const slots = [];

  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  const slotDuration = Number(duration);

  if (
    start === null ||
    end === null ||
    !Number.isFinite(slotDuration) ||
    slotDuration <= 0 ||
    end <= start
  ) {
    return slots;
  }

  let current = start;

  while (
    current + slotDuration <= end
  ) {
    const slotStart =
      minutesToTime(current);

    const slotEnd =
      minutesToTime(
        current + slotDuration
      );

    slots.push({
      id: `${slotStart}-${slotEnd}`,
      startTime: slotStart,
      endTime: slotEnd,
      label: `${formatTime(
        slotStart
      )} - ${formatTime(slotEnd)}`,
    });

    current += slotDuration;
  }

  return slots;
}

/* =========================================================
   EXPLICIT SLOT SUPPORT
========================================================= */

function extractSlots(
  availability,
  duration
) {
  if (!availability) {
    return [];
  }

  const possibleSlots =
    availability.slots ||
    availability.timeSlots ||
    availability.availableSlots ||
    [];

  if (!Array.isArray(possibleSlots)) {
    return [];
  }

  return possibleSlots
    .map((slot, index) => {
      if (typeof slot === "string") {
        const parts = slot
          .split("-")
          .map((item) => item.trim());

        if (parts.length >= 2) {
          const startTime =
            normalizeTime(parts[0]);

          const endTime =
            normalizeTime(parts[1]);

          if (
            !startTime ||
            !endTime
          ) {
            return null;
          }

          return {
            id: `${startTime}-${endTime}-${index}`,
            startTime,
            endTime,
            label: `${formatTime(
              startTime
            )} - ${formatTime(endTime)}`,
          };
        }

        const singleTime =
          normalizeTime(parts[0]);

        const startMinutes =
          timeToMinutes(singleTime);

        if (
          startMinutes === null ||
          !duration
        ) {
          return null;
        }

        const endTime =
          minutesToTime(
            startMinutes +
              Number(duration)
          );

        return {
          id: `${singleTime}-${endTime}-${index}`,
          startTime: singleTime,
          endTime,
          label: `${formatTime(
            singleTime
          )} - ${formatTime(endTime)}`,
        };
      }

      const startTime =
        slot?.startTime ||
        slot?.start ||
        slot?.from ||
        slot?.time ||
        slot?.appointmentTime ||
        "";

      let endTime =
        slot?.endTime ||
        slot?.end ||
        slot?.to ||
        "";

      if (
        !endTime &&
        duration
      ) {
        const startMinutes =
          timeToMinutes(
            startTime
          );

        if (
          startMinutes !== null
        ) {
          endTime =
            minutesToTime(
              startMinutes +
                Number(duration)
            );
        }
      }

      if (!endTime) {
        return null;
      }

      return {
        id:
          slot?._id ||
          slot?.id ||
          `${startTime}-${endTime}-${index}`,

        startTime:
          normalizeTime(startTime),

        endTime:
          normalizeTime(endTime),

        label: `${formatTime(
          startTime
        )} - ${formatTime(endTime)}`,
      };
    })
    .filter(Boolean);
}

/* =========================================================
   DOCTOR AVAILABILITY
========================================================= */

function getModeAvailability(
  doctor,
  mode
) {
  if (!doctor) return null;

  const availability =
    doctor.availability ||
    doctor.availabilities ||
    doctor.schedule ||
    doctor.weeklyAvailability ||
    doctor.timings ||
    null;

  if (!availability) {
    return null;
  }

  if (Array.isArray(availability)) {
    const found =
      availability.find((item) => {
        const type =
          item?.appointmentType ||
          item?.visitType ||
          item?.mode ||
          item?.type;

        return (
          !type ||
          String(type).toLowerCase() ===
            String(mode).toLowerCase()
        );
      });

    return found || null;
  }

  if (availability[mode]) {
    return availability[mode];
  }

  if (mode === "hospital") {
    return (
      availability.hospital ||
      availability.inPerson ||
      availability.in_person ||
      availability.hospitalVisit ||
      null
    );
  }

  if (mode === "video") {
    return (
      availability.video ||
      availability.online ||
      availability.videoConsultation ||
      null
    );
  }

  return availability;
}

function getDayAvailability(
  doctor,
  date,
  mode
) {
  if (!doctor || !date) {
    return null;
  }

  const modeAvailability =
    getModeAvailability(
      doctor,
      mode
    );

  if (!modeAvailability) {
    return null;
  }

  const dayName =
    date.toLocaleDateString(
      "en-US",
      {
        weekday: "long",
      }
    );

  const dayShort =
    date.toLocaleDateString(
      "en-US",
      {
        weekday: "short",
      }
    );

  const dayIndex =
    date.getDay();

  const candidates = [
    dayName,
    dayName.toLowerCase(),
    dayShort,
    dayShort.toLowerCase(),
    String(dayIndex),
  ];

  if (
    Array.isArray(
      modeAvailability
    )
  ) {
    const found =
      modeAvailability.find(
        (item) => {
          const itemDay =
            item?.day ||
            item?.dayName ||
            item?.weekday ||
            item?.dayOfWeek;

          return candidates.some(
            (candidate) =>
              String(
                candidate
              ).toLowerCase() ===
              String(
                itemDay || ""
              ).toLowerCase()
          );
        }
      );

    return found || null;
  }

  if (
    modeAvailability[dayName]
  ) {
    return modeAvailability[
      dayName
    ];
  }

  if (
    modeAvailability[
      dayName.toLowerCase()
    ]
  ) {
    return modeAvailability[
      dayName.toLowerCase()
    ];
  }

  if (
    modeAvailability[dayShort]
  ) {
    return modeAvailability[
      dayShort
    ];
  }

  if (
    modeAvailability[
      dayShort.toLowerCase()
    ]
  ) {
    return modeAvailability[
      dayShort.toLowerCase()
    ];
  }

  if (
    modeAvailability[
      String(dayIndex)
    ]
  ) {
    return modeAvailability[
      String(dayIndex)
    ];
  }

  if (
    modeAvailability.startTime ||
    modeAvailability.start ||
    modeAvailability.from
  ) {
    return modeAvailability;
  }

  return null;
}

/* =========================================================
   APPOINTMENT DURATION
========================================================= */

function getAppointmentDuration(
  doctor
) {
  const rawDuration =
    doctor?.appointmentDuration ??
    doctor?.consultationDuration ??
    doctor?.slotDuration ??
    doctor?.duration;

  const duration =
    Number(rawDuration);

  if (
    !Number.isFinite(duration) ||
    duration <= 0
  ) {
    return null;
  }

  return duration;
}

/* =========================================================
   LOCAL SLOT GENERATION
========================================================= */

function getSlotsForMode(
  doctor,
  date,
  mode
) {
  if (
    !doctor ||
    !date ||
    !mode
  ) {
    return [];
  }

  const availability =
    getDayAvailability(
      doctor,
      date,
      mode
    );

  if (!availability) {
    return [];
  }

  const duration =
    getAppointmentDuration(
      doctor
    );

  if (!duration) {
    return [];
  }

  const startTime =
    availability?.startTime ||
    availability?.start ||
    availability?.from ||
    availability?.openingTime;

  const endTime =
    availability?.endTime ||
    availability?.end ||
    availability?.to ||
    availability?.closingTime;

  if (
    startTime &&
    endTime
  ) {
    return generateSlots(
      startTime,
      endTime,
      duration
    );
  }

  return extractSlots(
    availability,
    duration
  );
}

/* =========================================================
   OTHER HELPERS
========================================================= */

function getDoctorName(
  doctor
) {
  return (
    doctor?.name ||
    doctor?.fullName ||
    doctor?.doctorName ||
    "Doctor"
  );
}

function getDoctorSpecialization(
  doctor
) {
  return (
    doctor?.specialization ||
    doctor?.speciality ||
    doctor?.specialty ||
    "Specialist"
  );
}

function getDepartmentName(
  department,
  doctor
) {
  return (
    department?.name ||
    department?.departmentName ||
    doctor?.department?.name ||
    "Department"
  );
}

function getDoctorFee(
  doctor,
  visitType
) {
  if (
    visitType === "video"
  ) {
    return Number(
      doctor?.videoConsultationFee ??
        doctor?.videoFee ??
        doctor?.onlineFee ??
        doctor?.consultationFee ??
        doctor?.fee ??
        0
    );
  }

  return Number(
    doctor?.consultationFee ??
      doctor?.hospitalFee ??
      doctor?.fee ??
      0
  );
}

function getPatientName(
  patient
) {
  return (
    patient?.name ||
    patient?.fullName ||
    `${patient?.firstName || ""} ${
      patient?.lastName || ""
    }`.trim()
  );
}

function getSlotKey(slot) {
  if (!slot) return "";

  return `${normalizeTime(
    slot.startTime
  )}-${normalizeTime(
    slot.endTime
  )}`;
}

/* =========================================================
   NORMALIZE BACKEND SLOT
========================================================= */

function normalizeBackendSlot(
  slot,
  index,
  duration
) {
  if (!slot) {
    return null;
  }

  if (
    typeof slot === "string"
  ) {
    const parts = slot
      .split("-")
      .map((item) => item.trim());

    if (
      parts.length >= 2
    ) {
      const startTime =
        normalizeTime(parts[0]);

      const endTime =
        normalizeTime(parts[1]);

      if (
        !startTime ||
        !endTime
      ) {
        return null;
      }

      return {
        id: `${startTime}-${endTime}-${index}`,
        startTime,
        endTime,
        label: `${formatTime(
          startTime
        )} - ${formatTime(endTime)}`,
      };
    }

    const startTime =
      normalizeTime(parts[0]);

    if (
      !startTime ||
      !duration
    ) {
      return null;
    }

    const startMinutes =
      timeToMinutes(
        startTime
      );

    if (
      startMinutes === null
    ) {
      return null;
    }

    const endTime =
      minutesToTime(
        startMinutes +
          Number(duration)
      );

    return {
      id: `${startTime}-${endTime}-${index}`,
      startTime,
      endTime,
      label: `${formatTime(
        startTime
      )} - ${formatTime(endTime)}`,
    };
  }

  const startTime =
    slot?.startTime ||
    slot?.start ||
    slot?.from ||
    slot?.time ||
    slot?.appointmentTime ||
    "";

  let endTime =
    slot?.endTime ||
    slot?.end ||
    slot?.to ||
    "";

  if (
    !endTime &&
    duration
  ) {
    const startMinutes =
      timeToMinutes(
        startTime
      );

    if (
      startMinutes !== null
    ) {
      endTime =
        minutesToTime(
          startMinutes +
            Number(duration)
        );
    }
  }

  if (
    !startTime ||
    !endTime
  ) {
    return null;
  }

  return {
    id:
      slot?._id ||
      slot?.id ||
      `${startTime}-${endTime}-${index}`,

    startTime:
      normalizeTime(startTime),

    endTime:
      normalizeTime(endTime),

    label: `${formatTime(
      startTime
    )} - ${formatTime(endTime)}`,
  };
}

/* =========================================================
   EXTRACT BACKEND AVAILABILITY
========================================================= */

function getAvailabilityPayload(
  data
) {
  if (
    data &&
    typeof data === "object"
  ) {
    if (
      data.availableSlots !==
        undefined ||
      data.slots !==
        undefined ||
      data.isFull !==
        undefined ||
      data.totalSlots !==
        undefined
    ) {
      return data;
    }

    if (
      data.data &&
      typeof data.data ===
        "object"
    ) {
      return data.data;
    }

    if (
      data.result &&
      typeof data.result ===
        "object"
    ) {
      return data.result;
    }
  }

  return data || {};
}

function extractBackendSlots(
  data,
  duration
) {
  const payload =
    getAvailabilityPayload(
      data
    );

  let serverAvailable = [];

  if (
    Array.isArray(
      payload?.availableSlots
    )
  ) {
    serverAvailable =
      payload.availableSlots;
  } else if (
    Array.isArray(
      payload?.slots
    )
  ) {
    serverAvailable =
      payload.slots;
  } else if (
    Array.isArray(
      payload?.data?.availableSlots
    )
  ) {
    serverAvailable =
      payload.data.availableSlots;
  } else if (
    Array.isArray(
      payload?.data?.slots
    )
  ) {
    serverAvailable =
      payload.data.slots;
  }

  const normalized =
    serverAvailable
      .map(
        (slot, index) =>
          normalizeBackendSlot(
            slot,
            index,
            duration
          )
      )
      .filter(Boolean);

  return {
    payload,
    slots: normalized,
    hasSlotField:
      Array.isArray(
        payload?.availableSlots
      ) ||
      Array.isArray(
        payload?.slots
      ) ||
      Array.isArray(
        payload?.data?.availableSlots
      ) ||
      Array.isArray(
        payload?.data?.slots
      ),
  };
}

/* =========================================================
   PAGE
========================================================= */

export default function AppointmentDetailsPage() {
  const router = useRouter();

  const [doctor, setDoctor] =
    useState(null);

  const [department, setDepartment] =
    useState(null);

  const [patient, setPatient] =
    useState(null);

  const [
    appointmentDate,
    setAppointmentDate,
  ] = useState("");

  const [
    visitType,
    setVisitType,
  ] = useState("hospital");

  const [
    selectedSlot,
    setSelectedSlot,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    loadingSlots,
    setLoadingSlots,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    doctorImageIndex,
    setDoctorImageIndex,
  ] = useState(0);

  const [error, setError] =
    useState("");

  const [toast, setToast] =
    useState("");

  const [
    backendSlots,
    setBackendSlots,
  ] = useState(null);

  const [
    availabilityFull,
    setAvailabilityFull,
  ] = useState(false);

  const [
    availabilityMessage,
    setAvailabilityMessage,
  ] = useState("");

  const [
    availabilityError,
    setAvailabilityError,
  ] = useState(false);

  const [
    availabilityChecked,
    setAvailabilityChecked,
  ] = useState(false);

  /* =====================================================
     TOAST
  ===================================================== */

  useEffect(() => {
    if (!toast) return;

    const timer =
      setTimeout(() => {
        setToast("");
      }, 4000);

    return () =>
      clearTimeout(timer);
  }, [toast]);

  function showToast(message) {
    setToast(message);
  }

  /* =====================================================
     LOAD SESSION DATA
  ===================================================== */

  useEffect(() => {
    try {
      const storedDoctor =
        sessionStorage.getItem(
          "selectedDoctor"
        );

      const storedDepartment =
        sessionStorage.getItem(
          "selectedDepartment"
        );

      const storedDate =
        sessionStorage.getItem(
          "selectedAppointmentDate"
        );

      const storedPatient =
        sessionStorage.getItem(
          "appointmentPatient"
        ) ||
        sessionStorage.getItem(
          "patient"
        ) ||
        sessionStorage.getItem(
          "loggedInPatient"
        );

      const storedAppointmentDetails =
        sessionStorage.getItem(
          "appointmentDetails"
        );

      if (storedDoctor) {
        setDoctor(
          JSON.parse(
            storedDoctor
          )
        );
      }

      if (storedDepartment) {
        setDepartment(
          JSON.parse(
            storedDepartment
          )
        );
      }

      if (storedPatient) {
        try {
          setPatient(
            JSON.parse(
              storedPatient
            )
          );
        } catch {
          setPatient({
            name: storedPatient,
          });
        }
      }

      if (storedDate) {
        setAppointmentDate(
          storedDate
        );
      } else {
        const today =
          new Date();

        const todayString =
          formatDateForStorage(
            today
          );

        setAppointmentDate(
          todayString
        );

        sessionStorage.setItem(
          "selectedAppointmentDate",
          todayString
        );
      }

      if (
        storedAppointmentDetails
      ) {
        try {
          const details =
            JSON.parse(
              storedAppointmentDetails
            );

          if (
            details?.visitType
          ) {
            setVisitType(
              details.visitType
            );
          } else if (
            details?.appointmentType
          ) {
            setVisitType(
              details.appointmentType
            );
          }

          if (
            details?.selectedSlot
          ) {
            setSelectedSlot(
              details.selectedSlot
            );
          }
        } catch {}
      }
    } catch (err) {
      console.error(
        "Appointment details load error:",
        err
      );

      setError(
        "Unable to load appointment details."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /* =====================================================
     IDS
  ===================================================== */

  const doctorId = useMemo(
    () => getDoctorId(doctor),
    [doctor]
  );

  const departmentId = useMemo(
    () =>
      getDepartmentId(
        department,
        doctor
      ),
    [department, doctor]
  );

  /* =====================================================
     IMAGE
  ===================================================== */

  const imageCandidates =
    useMemo(() => {
      return getDoctorImageCandidates(
        doctor
      );
    }, [doctor]);

  useEffect(() => {
    setDoctorImageIndex(0);
  }, [doctor]);

  /* =====================================================
     DATE
  ===================================================== */

  const selectedDateObject =
    useMemo(() => {
      return parseStoredDate(
        appointmentDate
      );
    }, [appointmentDate]);

  /* =====================================================
     DURATION
  ===================================================== */

  const appointmentDuration =
    useMemo(() => {
      return getAppointmentDuration(
        doctor
      );
    }, [doctor]);

  /* =====================================================
     LOCAL SLOTS
  ===================================================== */

  const generatedSlots =
    useMemo(() => {
      return getSlotsForMode(
        doctor,
        selectedDateObject,
        visitType
      );
    }, [
      doctor,
      selectedDateObject,
      visitType,
    ]);

  /* =====================================================
     FETCH BACKEND AVAILABILITY
  ===================================================== */

  useEffect(() => {
    let cancelled = false;

    async function fetchAvailability() {
      if (
        !doctor ||
        !appointmentDate ||
        !visitType
      ) {
        setBackendSlots(null);
        setAvailabilityFull(false);
        setAvailabilityMessage("");
        setAvailabilityError(false);
        setAvailabilityChecked(false);
        return;
      }

      const currentDoctorId =
        getDoctorId(doctor);

      const currentDepartmentId =
        getDepartmentId(
          department,
          doctor
        );

      if (!currentDoctorId) {
        setBackendSlots(null);
        setAvailabilityChecked(false);
        setAvailabilityError(true);
        setAvailabilityMessage(
          "Doctor details are incomplete."
        );
        return;
      }

      if (!currentDepartmentId) {
        setBackendSlots(null);
        setAvailabilityChecked(false);
        setAvailabilityError(true);
        setAvailabilityMessage(
          "Department details are missing. Please select the department again."
        );

        showToast(
          "Department details are missing. Please select the department again."
        );

        return;
      }

      try {
        setLoadingSlots(true);
        setSelectedSlot(null);

        setBackendSlots(null);
        setAvailabilityFull(false);
        setAvailabilityMessage("");
        setAvailabilityError(false);
        setAvailabilityChecked(false);

        const params =
          new URLSearchParams({
            doctor:
              currentDoctorId,

            department:
              currentDepartmentId,

            appointmentDate,

            appointmentType:
              visitType,
          });

        const url =
          `${API_BASE_URL}/appointments/available-slots?${params.toString()}`;

        console.log(
          "Checking appointment availability:",
          {
            doctorId:
              currentDoctorId,
            departmentId:
              currentDepartmentId,
            appointmentDate,
            visitType,
            url,
          }
        );

        const response =
          await fetch(url, {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type":
                "application/json",
            },
            cache: "no-store",
          });

        const data =
          await response
            .json()
            .catch(() => ({}));

        console.log(
          "Appointment availability response:",
          {
            status:
              response.status,
            data,
          }
        );

        if (cancelled) return;

        if (!response.ok) {
          setBackendSlots([]);
          setAvailabilityFull(false);
          setAvailabilityError(true);
          setAvailabilityChecked(true);

          const message =
            data?.message ||
            data?.error ||
            "Unable to load available slots.";

          setAvailabilityMessage(
            message
          );

          showToast(message);

          return;
        }

        const extracted =
          extractBackendSlots(
            data,
            appointmentDuration
          );

        const payload =
          extracted.payload;

        const normalized =
          extracted.slots;

        console.log(
          "Normalized appointment slots:",
          {
            payload,
            normalized,
            generatedSlots,
            appointmentDuration,
          }
        );

        setBackendSlots(
          normalized
        );

        setAvailabilityError(
          false
        );

        setAvailabilityChecked(
          true
        );

        const serverIsFull =
          payload?.isFull ===
            true ||
          payload?.isFull ===
            "true";

        setAvailabilityFull(
          serverIsFull
        );

        const message =
          payload?.message ||
          "";

        setAvailabilityMessage(
          message
        );

        if (serverIsFull) {
          showToast(
            "Appointment Full — No slots available for this date."
          );
        }
      } catch (err) {
        console.error(
          "Availability fetch error:",
          err
        );

        if (cancelled) return;

        setBackendSlots([]);
        setAvailabilityFull(false);
        setAvailabilityError(true);
        setAvailabilityChecked(true);

        const message =
          "Unable to check appointment availability. Please try again.";

        setAvailabilityMessage(
          message
        );

        showToast(message);
      } finally {
        if (!cancelled) {
          setLoadingSlots(false);
        }
      }
    }

    fetchAvailability();

    return () => {
      cancelled = true;
    };
  }, [
    doctor,
    department,
    appointmentDate,
    visitType,
    appointmentDuration,
    generatedSlots,
  ]);

  /* =====================================================
     FINAL AVAILABLE SLOTS
  ===================================================== */

  const availableSlots =
    useMemo(() => {
      if (
        availabilityChecked &&
        !availabilityError &&
        Array.isArray(
          backendSlots
        )
      ) {
        return backendSlots;
      }

      if (
        !availabilityChecked &&
        !availabilityError
      ) {
        return generatedSlots;
      }

      return [];
    }, [
      backendSlots,
      generatedSlots,
      availabilityChecked,
      availabilityError,
    ]);

  /* =====================================================
     FEES
  ===================================================== */

  const consultationFee =
    useMemo(() => {
      return getDoctorFee(
        doctor,
        visitType
      );
    }, [
      doctor,
      visitType,
    ]);

  const serviceFee = 50;

  const totalAmount =
    consultationFee +
    serviceFee;

  /* =====================================================
     DATES
  ===================================================== */

  const dates = useMemo(() => {
    const result = [];

    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    for (
      let i = 0;
      i < 14;
      i++
    ) {
      const date =
        new Date(today);

      date.setDate(
        today.getDate() + i
      );

      result.push(date);
    }

    return result;
  }, []);

  /* =====================================================
     SELECTED SLOT VALIDATION
  ===================================================== */

  useEffect(() => {
    if (!selectedSlot) {
      return;
    }

    if (
      !availabilityChecked ||
      loadingSlots ||
      availabilityError
    ) {
      return;
    }

    const exists =
      availableSlots.some(
        (slot) =>
          getSlotKey(slot) ===
          getSlotKey(
            selectedSlot
          )
      );

    if (!exists) {
      setSelectedSlot(null);
    }
  }, [
    availableSlots,
    selectedSlot,
    availabilityChecked,
    loadingSlots,
    availabilityError,
  ]);

  /* =====================================================
     STORE DATE
  ===================================================== */

  useEffect(() => {
    if (
      !appointmentDate ||
      !doctor ||
      !visitType
    ) {
      return;
    }

    sessionStorage.setItem(
      "selectedAppointmentDate",
      appointmentDate
    );
  }, [
    appointmentDate,
    doctor,
    visitType,
  ]);

  /* =====================================================
     STORE APPOINTMENT DETAILS
  ===================================================== */

  useEffect(() => {
    if (!doctor) return;

    const details = {
      doctorId:
        getDoctorId(doctor),

      departmentId:
        getDepartmentId(
          department,
          doctor
        ),

      appointmentDate,

      appointmentType:
        visitType,

      visitType,

      selectedSlot,

      appointmentDuration,
    };

    sessionStorage.setItem(
      "appointmentDetails",
      JSON.stringify(details)
    );
  }, [
    doctor,
    department,
    appointmentDate,
    visitType,
    selectedSlot,
    appointmentDuration,
  ]);

  /* =====================================================
     DATE CHANGE
  ===================================================== */

  function handleDateChange(
    date
  ) {
    const dateString =
      formatDateForStorage(
        date
      );

    setAppointmentDate(
      dateString
    );

    setSelectedSlot(null);

    setBackendSlots(null);

    setAvailabilityFull(false);

    setAvailabilityMessage("");

    setAvailabilityError(false);

    setAvailabilityChecked(
      false
    );

    setError("");

    sessionStorage.setItem(
      "selectedAppointmentDate",
      dateString
    );
  }

  /* =====================================================
     VISIT TYPE CHANGE
  ===================================================== */

  function handleVisitTypeChange(
    type
  ) {
    setVisitType(type);

    setSelectedSlot(null);

    setBackendSlots(null);

    setAvailabilityFull(false);

    setAvailabilityMessage("");

    setAvailabilityError(false);

    setAvailabilityChecked(
      false
    );

    setError("");

    sessionStorage.setItem(
      "appointmentDetails",
      JSON.stringify({
        doctorId:
          getDoctorId(doctor),

        departmentId:
          getDepartmentId(
            department,
            doctor
          ),

        appointmentDate,

        appointmentType:
          type,

        visitType:
          type,
      })
    );
  }

  /* =====================================================
     SLOT CHANGE
  ===================================================== */

  function handleSlotChange(
    slot
  ) {
    if (
      loadingSlots ||
      availabilityError ||
      availabilityFull
    ) {
      return;
    }

    setSelectedSlot(slot);
    setError("");
  }

  /* =====================================================
     PAYMENT / CHECKOUT
  ===================================================== */

  async function handlePay() {
    setError("");

    if (!doctor) {
      showToast(
        "Doctor details not found."
      );
      return;
    }

    if (!departmentId) {
      showToast(
        "Department details not found. Please select the department again."
      );
      return;
    }

    if (!doctorId) {
      showToast(
        "Doctor ID is missing. Please select the doctor again."
      );
      return;
    }

    if (!patient) {
      showToast(
        "Please login or register before continuing."
      );
      return;
    }

    if (!appointmentDate) {
      showToast(
        "Please select appointment date."
      );
      return;
    }

    if (!visitType) {
      showToast(
        "Please select appointment type."
      );
      return;
    }

    if (!selectedSlot) {
      showToast(
        "Please select a time slot."
      );
      return;
    }

    if (
      !appointmentDuration
    ) {
      showToast(
        "Doctor appointment duration is not configured."
      );
      return;
    }

    if (loadingSlots) {
      showToast(
        "Checking appointment availability. Please wait."
      );
      return;
    }

    if (availabilityError) {
      showToast(
        availabilityMessage ||
          "Unable to verify appointment availability."
      );
      return;
    }

    if (!availabilityChecked) {
      showToast(
        "Please wait while appointment availability is checked."
      );
      return;
    }

    if (availabilityFull) {
      showToast(
        "Appointment Full — No slots available."
      );
      return;
    }

    if (
      availableSlots.length === 0
    ) {
      showToast(
        "No appointment slots are currently available."
      );
      return;
    }

    const selectedStillAvailable =
      availableSlots.some(
        (slot) =>
          getSlotKey(slot) ===
          getSlotKey(
            selectedSlot
          )
      );

    if (
      !selectedStillAvailable
    ) {
      setSelectedSlot(null);

      showToast(
        "This time slot is no longer available. Please select another slot."
      );

      return;
    }

    try {
      setSaving(true);

      /* ===============================================
         FINAL BACKEND AVAILABILITY CHECK
      =============================================== */

      const availabilityParams =
        new URLSearchParams({
          doctor:
            doctorId,

          department:
            departmentId,

          appointmentDate,

          appointmentType:
            visitType,
        });

      const availabilityUrl =
        `${API_BASE_URL}/appointments/available-slots?${availabilityParams.toString()}`;

      console.log(
        "Final availability check:",
        {
          doctorId,
          departmentId,
          appointmentDate,
          appointmentType:
            visitType,
          url:
            availabilityUrl,
        }
      );

      const availabilityResponse =
        await fetch(
          availabilityUrl,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type":
                "application/json",
            },
            cache: "no-store",
          }
        );

      const availabilityData =
        await availabilityResponse
          .json()
          .catch(() => ({}));

      if (
        !availabilityResponse.ok
      ) {
        showToast(
          availabilityData?.message ||
            "Unable to verify slot availability."
        );

        return;
      }

      const latestExtracted =
        extractBackendSlots(
          availabilityData,
          appointmentDuration
        );

      const latestPayload =
        latestExtracted.payload;

      const latestSlots =
        latestExtracted.slots;

      const latestIsFull =
        latestPayload?.isFull ===
          true ||
        latestPayload?.isFull ===
          "true";

      if (latestIsFull) {
        setSelectedSlot(null);

        setBackendSlots([]);

        setAvailabilityFull(
          true
        );

        setAvailabilityChecked(
          true
        );

        showToast(
          "Appointment Full — This date has no available slots."
        );

        return;
      }

      const latestSlotExists =
        latestSlots.some(
          (slot) =>
            getSlotKey(slot) ===
            getSlotKey(
              selectedSlot
            )
        );

      if (
        !latestSlotExists
      ) {
        setSelectedSlot(null);

        setBackendSlots(
          latestSlots
        );

        setAvailabilityFull(
          false
        );

        setAvailabilityChecked(
          true
        );

        showToast(
          "This appointment slot has just been booked. Please select another slot."
        );

        return;
      }

      /* ===============================================
         FINAL TIME
      =============================================== */

      const startTime =
        selectedSlot.startTime;

      const selectedStartMinutes =
        timeToMinutes(
          startTime
        );

      if (
        selectedStartMinutes ===
        null
      ) {
        showToast(
          "Invalid appointment start time."
        );
        return;
      }

      const calculatedEnd =
        minutesToTime(
          selectedStartMinutes +
            appointmentDuration
        );

      const endTime =
        selectedSlot.endTime ||
        calculatedEnd;

      /* ===============================================
         APPOINTMENT DETAILS
      =============================================== */

      const appointmentDetails =
        {
          doctorId,

          departmentId,

          doctor,

          department,

          appointmentDate,

          appointmentType:
            visitType,

          visitType,

          startTime,

          endTime,

          appointmentDuration,

          selectedSlot: {
            ...selectedSlot,

            startTime,

            endTime,
          },

          patient,

          consultationFee,

          serviceFee,

          totalAmount,

          status:
            "pending_payment",

          paymentStatus:
            "unpaid",
        };

      sessionStorage.setItem(
        "appointmentDetails",
        JSON.stringify(
          appointmentDetails
        )
      );

      /* ===============================================
         CHECKOUT QUERY
      =============================================== */

      const query =
        new URLSearchParams({
          doctor:
            doctorId,

          department:
            departmentId,

          appointmentType:
            visitType,

          appointmentDate,

          startTime,

          endTime,
        });

      router.push(
        `/appointment/checkout?${query.toString()}`
      );
    } catch (err) {
      console.error(
        "Continue payment error:",
        err
      );

      showToast(
        "Unable to continue. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-blue-600">
          <Loader2 className="h-6 w-6 animate-spin" />

          <span>
            Loading appointment details...
          </span>
        </div>
      </div>
    );
  }

  /* =====================================================
     DOCTOR NOT FOUND
  ===================================================== */

  if (!doctor) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-md w-full text-center">
          <X className="mx-auto h-12 w-12 text-red-500 mb-4" />

          <h2 className="text-xl font-semibold text-slate-800">
            Doctor details not found
          </h2>

          <p className="text-slate-500 mt-2">
            Please select a doctor again.
          </p>

          <button
            onClick={() =>
              router.back()
            }
            className="mt-6 w-full rounded-xl bg-blue-600 text-white py-3 font-medium hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /* =====================================================
     DISPLAY DATA
  ===================================================== */

  const doctorName =
    getDoctorName(
      doctor
    );

  const specialization =
    getDoctorSpecialization(
      doctor
    );

  const departmentName =
    getDepartmentName(
      department,
      doctor
    );

  const selectedDateText =
    selectedDateObject
      ? formatDisplayDate(
          selectedDateObject
        )
      : "Select date";

  const isFull =
    !loadingSlots &&
    !availabilityError &&
    availabilityChecked &&
    availabilityFull === true;

  const noSlots =
    !loadingSlots &&
    !availabilityError &&
    availabilityChecked &&
    !availabilityFull &&
    availableSlots.length === 0;

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =================================================
          TOAST
      ================================================= */}

      {toast && (
        <div
          role="status"
          className="fixed right-5 top-5 z-[100] max-w-sm rounded-2xl border border-red-200 bg-white px-5 py-4 shadow-xl"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-red-100 p-1.5">
              <X className="h-4 w-4 text-red-600" />
            </div>

            <div className="flex-1">
              <p className="font-semibold text-slate-800">
                Appointment
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {toast}
              </p>
            </div>

            <button
              onClick={() =>
                setToast("")
              }
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        {/* =================================================
            BACK
        ================================================= */}

        <button
          onClick={() =>
            router.back()
          }
          className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* =================================================
                DOCTOR
            ================================================= */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-blue-50">
                  {imageCandidates.length >
                  0 ? (
                    <img
                      src={
                        imageCandidates[
                          doctorImageIndex
                        ]
                      }
                      alt={doctorName}
                      className="h-full w-full object-cover"
                      onError={() => {
                        if (
                          doctorImageIndex <
                          imageCandidates.length -
                            1
                        ) {
                          setDoctorImageIndex(
                            (prev) =>
                              prev + 1
                          );
                        }
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Stethoscope className="h-12 w-12 text-blue-500" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-600">
                    {departmentName}
                  </p>

                  <h1 className="mt-1 text-2xl font-bold text-slate-800">
                    Dr. {doctorName}
                  </h1>

                  <p className="mt-1 text-slate-500">
                    {specialization}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {doctor?.qualification && (
                      <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-600">
                        {
                          doctor.qualification
                        }
                      </span>
                    )}

                    {doctor?.experience && (
                      <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-600">
                        {
                          doctor.experience
                        }{" "}
                        years experience
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                APPOINTMENT TYPE
            ================================================= */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-slate-800">
                  Appointment Type
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Choose how you want to
                  consult the doctor
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {VISIT_TYPES.map(
                  (type) => {
                    const Icon =
                      type.icon;

                    const active =
                      visitType ===
                      type.id;

                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() =>
                          handleVisitTypeChange(
                            type.id
                          )
                        }
                        className={`rounded-2xl border p-4 text-left transition ${
                          active
                            ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                            : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div
                            className={`rounded-xl p-3 ${
                              active
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          {active && (
                            <CheckCircle2 className="h-5 w-5 text-blue-600" />
                          )}
                        </div>

                        <h3 className="mt-4 font-semibold text-slate-800">
                          {
                            type.title
                          }
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {
                            type.description
                          }
                        </p>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* =================================================
                DATE
            ================================================= */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    Select Date
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Choose your appointment
                    date
                  </p>
                </div>

                <CalendarDays className="h-6 w-6 text-blue-600" />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
                {dates.map(
                  (date) => {
                    const value =
                      formatDateForStorage(
                        date
                      );

                    const selected =
                      value ===
                      appointmentDate;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          handleDateChange(
                            date
                          )
                        }
                        className={`rounded-xl border px-3 py-3 text-center transition ${
                          selected
                            ? "border-blue-600 bg-blue-600 text-white shadow-md"
                            : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                      >
                        <div className="text-xs font-medium">
                          {getDayName(
                            date
                          )}
                        </div>

                        <div className="mt-1 text-lg font-bold">
                          {date.getDate()}
                        </div>

                        <div className="text-xs">
                          {date.toLocaleDateString(
                            "en-US",
                            {
                              month:
                                "short",
                            }
                          )}
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* =================================================
                TIME SLOTS
            ================================================= */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    Select Time Slot
                  </h2>

                  <p className="mt-1 text-slate-500">
                    Available slots for{" "}
                    {
                      selectedDateText
                    }
                  </p>
                </div>

                <Clock3 className="h-6 w-6 text-blue-600" />
              </div>

              <div className="mb-5 rounded-2xl bg-blue-50 px-5 py-4">
                <p className="text-blue-600">
                  Doctor consultation
                  duration:{" "}
                  <span className="font-bold">
                    {appointmentDuration
                      ? `${appointmentDuration} minutes`
                      : "Not configured"}
                  </span>
                </p>
              </div>

              {loadingSlots ? (
                <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-8 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />

                  <h3 className="mt-3 font-semibold text-blue-800">
                    Checking available
                    slots...
                  </h3>

                  <p className="mt-1 text-sm text-blue-600">
                    Please wait while we
                    check appointment
                    availability.
                  </p>
                </div>
              ) : availabilityError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <X className="h-6 w-6 text-red-600" />
                  </div>

                  <h3 className="mt-3 text-lg font-semibold text-red-700">
                    Unable to check
                    availability
                  </h3>

                  <p className="mt-1 text-sm text-red-600">
                    {availabilityMessage ||
                      "Please try again."}
                  </p>
                </div>
              ) : isFull ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <X className="h-6 w-6 text-red-600" />
                  </div>

                  <h3 className="mt-3 text-lg font-semibold text-red-700">
                    Appointment Full
                  </h3>

                  <p className="mt-1 text-sm text-red-600">
                    All appointment slots are
                    unavailable for this
                    date.
                  </p>

                  <p className="mt-1 text-sm text-red-500">
                    Please select another
                    date.
                  </p>
                </div>
              ) : availableSlots.length >
                0 ? (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {availableSlots.map(
                      (slot) => {
                        const selected =
                          selectedSlot &&
                          getSlotKey(
                            selectedSlot
                          ) ===
                            getSlotKey(
                              slot
                            );

                        return (
                          <button
                            key={
                              slot.id ||
                              getSlotKey(
                                slot
                              )
                            }
                            type="button"
                            onClick={() =>
                              handleSlotChange(
                                slot
                              )
                            }
                            className={`rounded-2xl border px-4 py-5 text-center transition ${
                              selected
                                ? "border-blue-600 bg-blue-600 text-white shadow-md"
                                : "border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50"
                            }`}
                          >
                            <div className="flex items-center justify-center gap-2">
                              <Clock3 className="h-4 w-4" />

                              <span className="font-semibold">
                                {formatTime(
                                  slot.startTime
                                )}
                              </span>
                            </div>

                            <p
                              className={`mt-1 text-sm ${
                                selected
                                  ? "text-blue-100"
                                  : "text-slate-500"
                              }`}
                            >
                              to{" "}
                              {formatTime(
                                slot.endTime
                              )}
                            </p>
                          </button>
                        );
                      }
                    )}
                  </div>

                  {selectedSlot && (
                    <div className="mt-5 flex items-center gap-3 rounded-2xl bg-green-50 px-5 py-4 text-green-700">
                      <CheckCircle2 className="h-5 w-5 shrink-0" />

                      <span>
                        Selected:{" "}
                        <strong>
                          {formatTime(
                            selectedSlot.startTime
                          )}
                          {" - "}
                          {formatTime(
                            selectedSlot.endTime
                          )}
                        </strong>
                      </span>
                    </div>
                  )}
                </>
              ) : noSlots ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-6 text-center">
                  <Clock3 className="mx-auto h-10 w-10 text-amber-600" />

                  <h3 className="mt-3 font-semibold text-amber-800">
                    No slots available
                  </h3>

                  <p className="mt-1 text-sm text-amber-700">
                    {availabilityMessage ||
                      "Doctor is not available on this date."}
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-6 text-center">
                  <Clock3 className="mx-auto h-10 w-10 text-slate-400" />

                  <h3 className="mt-3 font-semibold text-slate-700">
                    Checking availability
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Please wait...
                  </p>
                </div>
              )}
            </div>

            {/* =================================================
                PATIENT
            ================================================= */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-slate-800">
                  Patient Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Appointment will be booked
                  for this patient
                </p>
              </div>

              {patient ? (
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <UserRound className="h-6 w-6 text-blue-600" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {getPatientName(
                          patient
                        ) ||
                          "Patient"}
                      </h3>

                      {patient?.email && (
                        <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                          <Mail className="h-4 w-4" />

                          {
                            patient.email
                          }
                        </div>
                      )}

                      {patient?.phone && (
                        <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                          <Phone className="h-4 w-4" />

                          {
                            patient.phone
                          }
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <p className="font-medium text-amber-800">
                    Login required
                  </p>

                  <p className="mt-1 text-sm text-amber-700">
                    Please login or register
                    before continuing to
                    payment.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ===================================================
              SUMMARY
          =================================================== */}

          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-800">
                Booking Summary
              </h2>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Doctor
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    Dr. {doctorName}
                  </p>

                  <p className="text-sm text-slate-500">
                    {specialization}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Department
                  </p>

                  <p className="mt-1 text-slate-700">
                    {departmentName}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Visit Type
                  </p>

                  <p className="mt-1 text-slate-700">
                    {visitType ===
                    "video"
                      ? "Video Consultation"
                      : "Hospital Visit"}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Date
                  </p>

                  <p className="mt-1 text-slate-700">
                    {selectedDateText}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Time
                  </p>

                  <p className="mt-1 text-slate-700">
                    {selectedSlot
                      ? `${formatTime(
                          selectedSlot.startTime
                        )} - ${formatTime(
                          selectedSlot.endTime
                        )}`
                      : "Not selected"}
                  </p>
                </div>

                {/* FEE */}

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">
                      Consultation Fee
                    </span>

                    <span className="font-medium text-slate-800">
                      ₹{consultationFee}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-slate-600">
                      Service Fee
                    </span>

                    <span className="font-medium text-slate-800">
                      ₹{serviceFee}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                    <span className="font-semibold text-slate-800">
                      Total
                    </span>

                    <span className="flex items-center gap-1 text-xl font-bold text-blue-600">
                      <IndianRupee className="h-5 w-5" />

                      {totalAmount}
                    </span>
                  </div>
                </div>

                {/* PAY BUTTON */}

                <button
                  type="button"
                  onClick={handlePay}
                  disabled={
                    saving ||
                    loadingSlots ||
                    availabilityError ||
                    !availabilityChecked ||
                    !selectedSlot ||
                    availableSlots.length ===
                      0 ||
                    isFull ||
                    !appointmentDuration ||
                    !departmentId
                  }
                  className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-semibold transition ${
                    saving ||
                    loadingSlots ||
                    availabilityError ||
                    !availabilityChecked ||
                    !selectedSlot ||
                    availableSlots.length ===
                      0 ||
                    isFull ||
                    !appointmentDuration ||
                    !departmentId
                      ? "cursor-not-allowed bg-slate-200 text-slate-400"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />

                      Please wait...
                    </>
                  ) : loadingSlots ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />

                      Checking slots...
                    </>
                  ) : availabilityError ? (
                    <>
                      <X className="h-5 w-5" />

                      Availability Error
                    </>
                  ) : isFull ? (
                    <>
                      <X className="h-5 w-5" />

                      Appointment Full
                    </>
                  ) : (
                    <>
                      Continue to Payment

                      <ChevronRight className="h-5 w-5" />
                    </>
                  )}
                </button>

                {/* SECURITY */}

                <div className="flex items-start gap-3 rounded-xl bg-green-50 p-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

                  <p className="text-xs leading-5 text-green-700">
                    Your appointment details are
                    securely handled. Payment is
                    processed securely at checkout.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}