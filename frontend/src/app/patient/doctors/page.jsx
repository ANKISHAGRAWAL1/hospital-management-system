 "use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  Search,
  Filter,
  Stethoscope,
  MapPin,
  Clock,
  CalendarDays,
  Star,
  UserRound,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";

import { getDepartment } from "@/app/components/utils/Api-call/get_api";
import { getDoctors } from "@/app/components/utils/Api-call/doctor-api";

const SERVER_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(
    /\/api\/?$/,
    ""
  ) || "http://localhost:5000";

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

const getDoctorName = (doctor) => {
  const fullName = [
    doctor?.firstName,
    doctor?.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (fullName) {
    return `Dr. ${fullName}`;
  }

  return doctor?.name || "Doctor";
};

const getDepartmentName = (doctor) => {
  if (!doctor?.department) return "General";

  if (typeof doctor.department === "string") {
    return doctor.department;
  }

  return (
    doctor.department?.name ||
    doctor.department?.title ||
    "General"
  );
};

const getSpecialization = (doctor) => {
  if (Array.isArray(doctor?.specialization)) {
    return doctor.specialization.join(", ");
  }

  return doctor?.specialization || "Specialist";
};

const getExperience = (doctor) => {
  if (
    doctor?.experience === undefined ||
    doctor?.experience === null ||
    doctor?.experience === ""
  ) {
    return "N/A";
  }

  return `${doctor.experience} Years`;
};

const getFee = (doctor) => {
  if (
    doctor?.consultationFee === undefined ||
    doctor?.consultationFee === null ||
    doctor?.consultationFee === ""
  ) {
    return "N/A";
  }

  return `₹${doctor.consultationFee}`;
};

const getNextAvailability = (doctor) => {
  if (!Array.isArray(doctor?.availability)) {
    return {
      text: "Availability not set",
      slot: "",
      available: false,
    };
  }

  const availableDays = doctor.availability.filter(
    (item) =>
      item?.hospital?.enabled ||
      item?.video?.enabled
  );

  if (availableDays.length === 0) {
    return {
      text: "Currently unavailable",
      slot: "",
      available: false,
    };
  }

  const firstDay = availableDays[0];

  const hospitalSlots =
    firstDay?.hospital?.enabled &&
    Array.isArray(firstDay?.hospital?.slots)
      ? firstDay.hospital.slots
      : [];

  const videoSlots =
    firstDay?.video?.enabled &&
    Array.isArray(firstDay?.video?.slots)
      ? firstDay.video.slots
      : [];

  const slots =
    hospitalSlots.length > 0
      ? hospitalSlots
      : videoSlots;

  if (slots.length === 0) {
    return {
      text: "Available",
      slot: "",
      available: true,
    };
  }

  const firstSlot = slots[0];

  let startTime = "";

  if (typeof firstSlot === "string") {
    startTime = firstSlot;
  } else {
    startTime =
      firstSlot?.startTime ||
      firstSlot?.start ||
      firstSlot?.from ||
      "";
  }

  return {
    text: `Available ${firstDay?.day || ""}`.trim(),
    slot: startTime,
    available: true,
  };
};

const getArrayFromResponse = (response, keys = []) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  for (const key of keys) {
    if (Array.isArray(response?.[key])) {
      return response[key];
    }

    if (Array.isArray(response?.data?.[key])) {
      return response.data[key];
    }
  }

  return [];
};

export default function DoctorsPage() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [showFilter, setShowFilter] = useState(false);

  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          departmentResponse,
          doctorResponse,
        ] = await Promise.all([
          getDepartment(),
          getDoctors(),
        ]);

        const departmentData = getArrayFromResponse(
          departmentResponse,
          ["departments"]
        );

        const doctorData = getArrayFromResponse(
          doctorResponse,
          ["doctors"]
        );

        setDepartments(
          departmentData.filter(
            (item) => item?.status !== false
          )
        );

        setDoctors(
          doctorData.filter(
            (item) => item?.status !== false
          )
        );
      } catch (error) {
        console.error(
          "Find Doctors Load Error:",
          error
        );

        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load doctors";

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredDoctors = useMemo(() => {
    const searchText = search
      .trim()
      .toLowerCase();

    return doctors.filter((doctor) => {
      const departmentName =
        getDepartmentName(doctor);

      const specialization =
        getSpecialization(doctor);

      const doctorName =
        getDoctorName(doctor);

      const matchesDepartment =
        department === "All" ||
        departmentName
          .trim()
          .toLowerCase() ===
          department
            .trim()
            .toLowerCase();

      const matchesSearch =
        !searchText ||
        doctorName
          .toLowerCase()
          .includes(searchText) ||
        specialization
          .toLowerCase()
          .includes(searchText) ||
        departmentName
          .toLowerCase()
          .includes(searchText);

      return (
        matchesDepartment &&
        matchesSearch
      );
    });
  }, [doctors, search, department]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-[-0.025em] text-slate-900 sm:text-2xl">
              Find Doctors
            </h1>

            <p className="mt-1 text-[13px] leading-5 text-slate-500">
              Find the right doctor for your healthcare needs.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium tracking-[-0.005em] text-slate-500 shadow-sm">
            <UserRound
              size={15}
              className="text-[#075db5]"
            />

            {doctors.length} Doctors Available
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search doctor, specialization..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#075db5] focus:bg-white focus:ring-2 focus:ring-blue-50"
              />
            </div>

            <div className="relative lg:w-64">
              <select
                value={department}
                onChange={(e) =>
                  setDepartment(e.target.value)
                }
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-[13px] text-slate-700 outline-none transition focus:border-[#075db5] focus:bg-white focus:ring-2 focus:ring-blue-50"
              >
                <option value="All">
                  All Departments
                </option>

                {departments.map((item) => (
                  <option
                    key={
                      item?._id ||
                      item?.id
                    }
                    value={item?.name}
                  >
                    {item?.name}
                  </option>
                ))}
              </select>

              <Filter
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                setShowFilter(!showFilter)
              }
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50 lg:hidden"
            >
              <Filter size={17} />
              Filters
            </button>
          </div>

          <div
            className={`
              ${
                showFilter
                  ? "flex"
                  : "hidden"
              }
              mt-4
              flex-wrap
              gap-2
              lg:flex
            `}
          >
            <button
              type="button"
              onClick={() => {
                setDepartment("All");
                setShowFilter(false);
              }}
              className={`
                rounded-lg
                border
                px-3
                py-2
                text-xs
                font-medium
                transition
                ${
                  department === "All"
                    ? "border-[#075db5] bg-[#075db5] text-white"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900"
                }
              `}
            >
              All
            </button>

            {departments.map((item) => (
              <button
                type="button"
                key={
                  item?._id ||
                  item?.id
                }
                onClick={() => {
                  setDepartment(item?.name);
                  setShowFilter(false);
                }}
                className={`
                  rounded-lg
                  border
                  px-3
                  py-2
                  text-xs
                  font-medium
                  transition
                  ${
                    department ===
                    item?.name
                      ? "border-[#075db5] bg-[#075db5] text-white"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900"
                  }
                `}
              >
                {item?.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.02em] text-slate-900">
              Available Doctors
            </h2>

            <p className="mt-1 text-[12px] leading-5 text-slate-500">
              {loading
                ? "Loading doctors..."
                : `Showing ${filteredDoctors.length} doctors`}
            </p>
          </div>

          {(search ||
            department !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setDepartment("All");
              }}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-[#075db5]"
            >
              <X size={14} />
              Clear Filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col items-center gap-3">
              <Loader2
                size={28}
                className="animate-spin text-[#075db5]"
              />

              <p className="text-[13px] text-slate-500">
                Loading doctors...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <Stethoscope size={25} />
            </div>

            <h3 className="mt-4 text-[13px] font-semibold tracking-[-0.01em] text-slate-900">
              Unable to load doctors
            </h3>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              {error}
            </p>
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {filteredDoctors.map((doctor) => (
              <DoctorCard
                key={
                  doctor?._id ||
                  doctor?.id ||
                  `${doctor?.firstName}-${doctor?.lastName}`
                }
                doctor={doctor}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
              <Stethoscope size={25} />
            </div>

            <h3 className="mt-4 text-[13px] font-semibold tracking-[-0.01em] text-slate-900">
              No doctors found
            </h3>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Try changing your search or department filter.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function DoctorCard({ doctor }) {
  const doctorName = getDoctorName(doctor);

  const specialization =
    getSpecialization(doctor);

  const departmentName =
    getDepartmentName(doctor);

  const image = getDoctorImage(
    doctor?.profileImage
  );

  const availability =
    getNextAvailability(doctor);

  const doctorId =
    doctor?._id || doctor?.id;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
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
            <div className="flex h-full w-full items-center justify-center">
              <UserRound
                size={30}
                strokeWidth={1.4}
                className="text-slate-300"
              />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3 className="truncate text-[15px] font-semibold tracking-[-0.015em] text-slate-900">
                {doctorName}
              </h3>

              <p className="mt-1 text-[13px] leading-5 text-slate-500">
                {specialization}
              </p>
            </div>

            {doctor?.rating && (
              <span className="flex w-fit shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-600">
                <Star
                  size={12}
                  className="fill-current"
                />

                {doctor.rating}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <InfoItem
          label="Experience"
          value={getExperience(doctor)}
        />

        <InfoItem
          label="Consultation"
          value={getFee(doctor)}
        />

        <InfoItem
          label="Department"
          value={departmentName}
        />

        <InfoItem
          label="Location"
          value="Yash Hospital, Jaipur"
        />
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
        <MapPin
          size={14}
          className="shrink-0 text-slate-400"
        />

        <span className="truncate">
          Yash Hospital, Jaipur
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`
              h-2
              w-2
              shrink-0
              rounded-full
              ${
                availability.available
                  ? "bg-emerald-500"
                  : "bg-slate-400"
              }
            `}
          />

          <span
            className={`
              text-xs
              font-medium
              ${
                availability.available
                  ? "text-emerald-600"
                  : "text-slate-500"
              }
            `}
          >
            {availability.text}
          </span>
        </div>

        {availability.slot && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock size={14} />

            <span>
              Next slot: {availability.slot}
            </span>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Link
          href={
            doctorId
              ? `/patient/doctors/${doctorId}`
              : "#"
          }
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-[13px] font-medium tracking-[-0.005em] text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          <UserRound size={16} />

          View Profile
        </Link>

        <Link
          href={
            doctorId
              ? `/appointment/details/?doctor=${doctorId}`
              : "#"
          }
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#075db5] px-4 py-2.5 text-[13px] font-medium tracking-[-0.005em] text-white shadow-sm transition hover:bg-[#064f9a]"
        >
          <CalendarDays size={16} />

          Book Appointment

          <ChevronRight size={15} />
        </Link>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50 p-3">
      <p className="text-[10px] font-medium uppercase tracking-[0.06em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-[12px] font-semibold tracking-[-0.005em] text-slate-700">
        {value}
      </p>
    </div>
  );
}