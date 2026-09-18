"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  IndianRupee,
  Landmark,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  UserRound,
  Video,
  X,
  Sparkles,
  CircleCheck,
  ReceiptText,
} from "lucide-react";

import {
  createPaymentOrder,
  verifyPayment,
  createCashPayment,
} from "@/app/components/utils/Api-call/payment-api";

import { getDoctors } from "@/app/components/utils/Api-call/doctor-api";

const SERVICE_FEE = 50;

const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener(
        "load",
        () => resolve(true),
        { once: true }
      );

      existingScript.addEventListener(
        "error",
        () => resolve(false),
        { once: true }
      );

      return;
    }

    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const doctorId = searchParams.get("doctor") || "";
  const departmentId =
    searchParams.get("department") || "";

  const appointmentType =
    searchParams.get("appointmentType") ||
    "hospital";

  const appointmentDate =
    searchParams.get("appointmentDate") || "";

  const startTime =
    searchParams.get("startTime") || "";

  const endTime =
    searchParams.get("endTime") || "";

  const reason =
    searchParams.get("reason") || "";

  const urlDoctorName =
    searchParams.get("doctorName") || "";

  const urlDepartmentName =
    searchParams.get("departmentName") || "";

  const urlConsultationFee = Number(
    searchParams.get("consultationFee") || 0
  );

  const [doctor, setDoctor] = useState(null);
  const [doctorLoading, setDoctorLoading] =
    useState(true);

  const [patient, setPatient] = useState(null);

  const [paymentMethod, setPaymentMethod] =
    useState("online");

  const [onlineMethod, setOnlineMethod] =
    useState("upi");

  const [processing, setProcessing] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [successType, setSuccessType] =
    useState("");

  const [showSuccess, setShowSuccess] =
    useState(false);

  const [showPaymentModal, setShowPaymentModal] =
    useState(false);

  useEffect(() => {
    const loadDoctor = async () => {
      if (!doctorId) {
        setDoctorLoading(false);
        return;
      }

      try {
        setDoctorLoading(true);

        const response = await getDoctors();

        const doctors = Array.isArray(response)
          ? response
          : Array.isArray(response?.doctors)
          ? response.doctors
          : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.doctors)
          ? response.data.doctors
          : [];

        const foundDoctor = doctors.find(
          (item) =>
            String(item?._id) ===
            String(doctorId)
        );

        if (foundDoctor) {
          setDoctor(foundDoctor);
        } else {
          setError(
            "Selected doctor was not found."
          );
        }
      } catch (doctorError) {
        console.error(
          "LOAD DOCTOR ERROR:",
          doctorError?.response?.data ||
            doctorError?.message
        );

        setError(
          doctorError?.response?.data?.message ||
            "Unable to load doctor details."
        );
      } finally {
        setDoctorLoading(false);
      }
    };

    loadDoctor();
  }, [doctorId]);

  useEffect(() => {
    try {
      const storedPatient =
        sessionStorage.getItem("patient");

      if (storedPatient) {
        setPatient(
          JSON.parse(storedPatient)
        );
      }

      const appointmentDetails =
        sessionStorage.getItem(
          "appointmentDetails"
        );

      if (appointmentDetails) {
        const details = JSON.parse(
          appointmentDetails
        );

        setPatient((current) => {
          if (current) {
            return current;
          }

          if (details?.patient) {
            return details.patient;
          }

          return current;
        });
      }
    } catch (patientError) {
      console.error(
        "LOAD PATIENT ERROR:",
        patientError
      );
    }
  }, []);

  const doctorName = useMemo(() => {
    return (
      doctor?.name ||
      urlDoctorName ||
      "Selected Doctor"
    );
  }, [doctor, urlDoctorName]);

  const departmentName = useMemo(() => {
    if (
      typeof doctor?.department === "object" &&
      doctor?.department?.name
    ) {
      return doctor.department.name;
    }

    return (
      urlDepartmentName ||
      "Selected Department"
    );
  }, [doctor, urlDepartmentName]);

  const consultationFee = useMemo(() => {
    const databaseFee = Number(
      doctor?.fee ??
        doctor?.consultationFee ??
        0
    );

    if (databaseFee > 0) {
      return databaseFee;
    }

    return urlConsultationFee;
  }, [doctor, urlConsultationFee]);

  const totalAmount = useMemo(() => {
    return consultationFee + SERVICE_FEE;
  }, [consultationFee]);

  const formatDate = (dateString) => {
    if (!dateString) {
      return "Not selected";
    }

    const date = new Date(
      `${dateString}T00:00:00`
    );

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatAppointmentType = () => {
    return appointmentType === "video"
      ? "Video Consultation"
      : "Hospital Visit";
  };

  const getBookingPayload = () => {
    return {
      doctor: doctorId,
      department: departmentId,
      appointmentType,
      appointmentDate,
      startTime,
      endTime,
      ...(reason ? { reason } : {}),
    };
  };

  const validateBooking = () => {
    if (!doctorId) {
      return "Doctor information is missing.";
    }

    if (!departmentId) {
      return "Department information is missing.";
    }

    if (
      !["hospital", "video"].includes(
        appointmentType
      )
    ) {
      return "Invalid appointment type.";
    }

    if (!appointmentDate) {
      return "Appointment date is missing.";
    }

    if (!startTime || !endTime) {
      return "Appointment time slot is missing.";
    }

    if (doctorLoading) {
      return "Please wait while doctor details are loading.";
    }

    if (!doctor) {
      return "Unable to load selected doctor.";
    }

    if (consultationFee <= 0) {
      return "Consultation fee is not available for this doctor.";
    }

    if (
      appointmentType === "hospital" &&
      !doctor?.fee &&
      !doctor?.consultationFee
    ) {
      return "Doctor consultation fee is not configured.";
    }

    return "";
  };

  const handleOnlinePayment = async () => {
    if (processing) {
      return;
    }

    setError("");

    const validationError =
      validateBooking();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setProcessing(true);
      setLoading(true);

      const razorpayLoaded =
        await loadRazorpay();

      if (!razorpayLoaded) {
        throw new Error(
          "Unable to load secure payment gateway. Please try again."
        );
      }

      const booking =
        getBookingPayload();

      const orderResponse =
        await createPaymentOrder(
          booking
        );

      if (
        !orderResponse?.success ||
        !orderResponse?.orderId
      ) {
        throw new Error(
          orderResponse?.message ||
            "Unable to create payment order."
        );
      }

      const {
        orderId,
        amount,
        currency,
        keyId,
        paymentId,
      } = orderResponse;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "Yash Hospital",
        description:
          `${formatAppointmentType()} - ${doctorName}`,
        order_id: orderId,

        prefill: {
          name:
            patient?.name || "",
          email:
            patient?.email || "",
          contact:
            patient?.phone ||
            patient?.mobile ||
            "",
        },

        notes: {
          appointmentType,
          doctorId,
          departmentId,
          appointmentDate,
          startTime,
          endTime,
          paymentMethod:
            onlineMethod,
          paymentRecordId:
            paymentId
              ? paymentId.toString()
              : "",
        },

        theme: {
          color: "#0f766e",
        },

        modal: {
          ondismiss: () => {
            setProcessing(false);
            setLoading(false);
          },
        },

        handler: async function (
          razorpayResponse
        ) {
          try {
            setLoading(true);

            const verificationResponse =
              await verifyPayment({
                razorpay_order_id:
                  razorpayResponse.razorpay_order_id,

                razorpay_payment_id:
                  razorpayResponse.razorpay_payment_id,

                razorpay_signature:
                  razorpayResponse.razorpay_signature,
              });

            if (
              !verificationResponse?.success
            ) {
              throw new Error(
                verificationResponse?.message ||
                  "Payment verification failed."
              );
            }

            const confirmedAppointment =
              verificationResponse?.appointment;

            setSuccessType("online");
            setShowSuccess(true);

            const appointmentId =
              confirmedAppointment?._id ||
              "";

            setTimeout(() => {
              router.push(
                `/appointment/confirmation?appointment=${appointmentId}`
              );
            }, 1800);
          } catch (
            verificationError
          ) {
            console.error(
              "PAYMENT VERIFICATION ERROR:",
              verificationError?.response
                ?.data ||
                verificationError?.message
            );

            setError(
              verificationError?.response
                ?.data?.message ||
                verificationError?.message ||
                "Payment verification failed."
            );
          } finally {
            setProcessing(false);
            setLoading(false);
          }
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        (response) => {
          console.error(
            "RAZORPAY PAYMENT FAILED:",
            response
          );

          setError(
            response?.error?.description ||
              "Payment failed. Please try again."
          );

          setProcessing(false);
          setLoading(false);
        }
      );

      razorpay.open();
    } catch (paymentError) {
      console.error(
        "ONLINE PAYMENT ERROR:",
        paymentError?.response?.data ||
          paymentError?.message
      );

      setError(
        paymentError?.response?.data?.message ||
          paymentError?.message ||
          "Unable to start payment."
      );

      setProcessing(false);
      setLoading(false);
    }
  };

  const handleCashPayment = async () => {
    if (processing) {
      return;
    }

    setError("");

    if (appointmentType !== "hospital") {
      setError(
        "Pay at Hospital is available only for hospital visits."
      );
      return;
    }

    const validationError =
      validateBooking();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setProcessing(true);
      setLoading(true);

      const booking =
        getBookingPayload();

      const response =
        await createCashPayment(
          booking
        );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Unable to confirm appointment."
        );
      }

      setSuccessType("cash");
      setShowSuccess(true);

      const appointmentId =
        response?.appointment?._id ||
        "";

      setTimeout(() => {
        router.push(
          `/appointment/confirmation?appointment=${appointmentId}`
        );
      }, 1800);
    } catch (cashError) {
      console.error(
        "CASH PAYMENT FAILED:",
        cashError?.response?.data ||
          cashError?.message
      );

      setError(
        cashError?.response?.data?.message ||
          cashError?.message ||
          "Unable to confirm appointment."
      );
    } finally {
      setProcessing(false);
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (processing) {
      return;
    }

    setError("");

    if (paymentMethod === "cash") {
      handleCashPayment();
      return;
    }

    setShowPaymentModal(true);
  };

  const goBack = () => {
    if (processing) {
      return;
    }

    router.back();
  };

  const initials = doctorName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="min-h-screen bg-[#f5f8fa] text-slate-900">
      <div className="fixed inset-x-0 top-0 z-50 h-1 bg-gradient-to-r from-teal-700 via-teal-500 to-cyan-500" />

      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goBack}
              disabled={processing}
              className="group flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft
                size={18}
                className="transition-transform group-hover:-translate-x-0.5"
              />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-700 to-cyan-600 text-white shadow-sm">
                <Stethoscope size={21} />
              </div>

              <div>
                <p className="text-base font-extrabold tracking-tight text-slate-900">
                  Yash Hospital
                </p>

                <p className="text-[11px] font-medium tracking-wide text-slate-400">
                  HEALTHCARE & WELLNESS
                </p>
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 sm:flex">
            <ShieldCheck size={16} />
            Secure Checkout
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>Appointment</span>
            <ChevronRight size={14} />
            <span className="text-teal-700">
              Checkout
            </span>
          </div>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
                <Sparkles size={13} />
                Almost there
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Complete your appointment
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Review your appointment details, choose
                your preferred payment method, and
                confirm your booking securely.
              </p>
            </div>

            <div className="hidden items-center gap-2 text-xs font-semibold text-slate-400 md:flex">
              <div className="flex items-center gap-2 text-teal-700">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-white">
                  <Check size={14} />
                </span>
                Details
              </div>

              <div className="h-px w-8 bg-slate-200" />

              <div className="flex items-center gap-2 text-teal-700">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-white">
                  2
                </span>
                Checkout
              </div>

              <div className="h-px w-8 bg-slate-200" />

              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white">
                  3
                </span>
                Confirm
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">
            <div className="flex items-start gap-3 border-l-4 border-red-500 bg-red-50/70 px-4 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <X size={17} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-red-800">
                  Unable to continue
                </p>

                <p className="mt-1 text-sm leading-5 text-red-700">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setError("")}
                className="rounded-lg p-1 text-red-400 transition hover:bg-red-100 hover:text-red-700"
              >
                <X size={17} />
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                      <CalendarDays size={20} />
                    </div>

                    <div>
                      <h2 className="font-extrabold text-slate-950">
                        Appointment details
                      </h2>

                      <p className="mt-0.5 text-xs text-slate-400">
                        Your selected consultation
                      </p>
                    </div>
                  </div>

                  <div className="hidden rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500 sm:block">
                    Booking summary
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="mb-5 flex items-center gap-4 rounded-2xl bg-gradient-to-r from-slate-50 to-teal-50/50 p-4">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-teal-700 to-cyan-600 text-lg font-black text-white shadow-sm">
                    {doctorLoading
                      ? "..."
                      : initials}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-teal-600">
                      Specialist
                    </p>

                    <h3 className="mt-0.5 truncate text-lg font-extrabold text-slate-950">
                      {doctorLoading
                        ? "Loading doctor..."
                        : doctorName}
                    </h3>

                    <p className="mt-0.5 truncate text-sm text-slate-500">
                      {doctorLoading
                        ? "Please wait"
                        : departmentName}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoItem
                    icon={<Building2 size={17} />}
                    label="Appointment type"
                    value={
                      formatAppointmentType()
                    }
                  />

                  <InfoItem
                    icon={<CalendarDays size={17} />}
                    label="Date"
                    value={formatDate(
                      appointmentDate
                    )}
                  />

                  <InfoItem
                    icon={<Clock3 size={17} />}
                    label="Time slot"
                    value={`${startTime} - ${endTime}`}
                  />

                  <InfoItem
                    icon={<IndianRupee size={17} />}
                    label="Consultation fee"
                    value={
                      doctorLoading
                        ? "Loading..."
                        : consultationFee > 0
                        ? `₹${consultationFee.toLocaleString(
                            "en-IN"
                          )}`
                        : "Not available"
                    }
                  />
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-3 text-xs text-slate-500">
                  {appointmentType ===
                  "video" ? (
                    <Video
                      size={15}
                      className="shrink-0 text-teal-600"
                    />
                  ) : (
                    <Building2
                      size={15}
                      className="shrink-0 text-teal-600"
                    />
                  )}

                  <span>
                    {appointmentType ===
                    "video"
                      ? "Consultation will be conducted online through video."
                      : "Please arrive at the hospital before your scheduled appointment time."}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                    <UserRound size={20} />
                  </div>

                  <div>
                    <h2 className="font-extrabold text-slate-950">
                      Patient information
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Information associated with your account
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="grid gap-3 sm:grid-cols-3">
                  <PatientItem
                    label="Full name"
                    value={
                      patient?.name ||
                      "Logged-in patient"
                    }
                  />

                  <PatientItem
                    label="Email address"
                    value={
                      patient?.email ||
                      "Registered email"
                    }
                  />

                  <PatientItem
                    label="Phone number"
                    value={
                      patient?.phone ||
                      patient?.mobile ||
                      "Registered phone"
                    }
                  />
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-700">
                  <CircleCheck size={15} />
                  Patient account verified for appointment booking
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                    <CreditCard size={20} />
                  </div>

                  <div>
                    <h2 className="font-extrabold text-slate-950">
                      Choose payment method
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Select how you want to complete this booking
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <PaymentMethodCard
                    active={
                      paymentMethod ===
                      "online"
                    }
                    disabled={processing}
                    icon={
                      <CreditCard
                        size={21}
                      />
                    }
                    title="Pay online"
                    description="UPI, cards, net banking & more"
                    badge="Recommended"
                    onClick={() => {
                      setError("");
                      setPaymentMethod(
                        "online"
                      );
                    }}
                  />

                  <PaymentMethodCard
                    active={
                      paymentMethod ===
                      "cash"
                    }
                    disabled={
                      processing ||
                      appointmentType !==
                        "hospital"
                    }
                    icon={
                      <Landmark size={21} />
                    }
                    title="Pay at hospital"
                    description="Pay at the hospital counter"
                    onClick={() => {
                      if (
                        appointmentType !==
                        "hospital"
                      ) {
                        setError(
                          "Pay at Hospital is available only for hospital visits."
                        );
                        return;
                      }

                      setError("");
                      setPaymentMethod(
                        "cash"
                      );
                    }}
                  />
                </div>

                {appointmentType !==
                  "hospital" && (
                  <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-700">
                    Pay at Hospital is available only for Hospital Visit appointments.
                  </div>
                )}

                {paymentMethod ===
                  "online" && (
                  <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          Preferred payment
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          You can change this inside Razorpay too
                        </p>
                      </div>

                      <LockKeyhole
                        size={16}
                        className="text-teal-600"
                      />
                    </div>

                    <div className="grid gap-2 sm:grid-cols-3">
                      <OnlineOption
                        active={
                          onlineMethod ===
                          "upi"
                        }
                        disabled={processing}
                        icon={
                          <Smartphone
                            size={18}
                          />
                        }
                        title="UPI"
                        onClick={() =>
                          setOnlineMethod(
                            "upi"
                          )
                        }
                      />

                      <OnlineOption
                        active={
                          onlineMethod ===
                          "card"
                        }
                        disabled={processing}
                        icon={
                          <CreditCard
                            size={18}
                          />
                        }
                        title="Card"
                        onClick={() =>
                          setOnlineMethod(
                            "card"
                          )
                        }
                      />

                      <OnlineOption
                        active={
                          onlineMethod ===
                          "netbanking"
                        }
                        disabled={processing}
                        icon={
                          <Landmark
                            size={18}
                          />
                        }
                        title="Net Banking"
                        onClick={() =>
                          setOnlineMethod(
                            "netbanking"
                          )
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <aside className="h-fit lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.07)]">
              <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 px-5 py-6 text-white sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-300">
                      Secure checkout
                    </p>

                    <h2 className="mt-1 text-xl font-extrabold">
                      Payment summary
                    </h2>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
                    <ReceiptText
                      size={19}
                    />
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    {appointmentType ===
                    "video" ? (
                      <Video size={18} />
                    ) : (
                      <Building2 size={18} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">
                      {formatAppointmentType()}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-slate-300">
                      {formatDate(
                        appointmentDate
                      )}{" "}
                      · {startTime}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="space-y-4">
                  <SummaryRow
                    label="Consultation fee"
                    value={
                      consultationFee > 0
                        ? `₹${consultationFee.toLocaleString(
                            "en-IN"
                          )}`
                        : "—"
                    }
                  />

                  <SummaryRow
                    label="Service fee"
                    value={`₹${SERVICE_FEE.toLocaleString(
                      "en-IN"
                    )}`}
                  />
                </div>

                <div className="my-5 border-t border-dashed border-slate-200" />

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Total payable
                    </p>

                    <p className="mt-1 text-3xl font-black tracking-tight text-slate-950">
                      ₹
                      {totalAmount.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <IndianRupee
                      size={18}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={
                    processing ||
                    doctorLoading ||
                    totalAmount <= 0
                  }
                  className="group mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-700 to-cyan-600 px-5 py-4 text-sm font-extrabold text-white shadow-lg shadow-teal-700/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-teal-700/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {processing ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Processing...
                    </>
                  ) : (
                    <>
                      {paymentMethod ===
                      "cash"
                        ? "Confirm Appointment"
                        : "Continue to Payment"}

                      <ArrowRight
                        size={18}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </>
                  )}
                </button>

                <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                  <div className="flex gap-3">
                    <ShieldCheck
                      size={19}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />

                    <div>
                      <p className="text-xs font-bold text-emerald-800">
                        Secure & protected
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-emerald-700">
                        Your payment is processed securely.
                        Online payments are verified before
                        your appointment is confirmed.
                      </p>
                    </div>
                  </div>
                </div>

                {paymentMethod ===
                  "cash" && (
                  <div className="mt-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                    <p className="text-xs font-bold text-amber-800">
                      Pay at hospital
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-amber-700">
                      Your appointment will be confirmed
                      now and payment will be collected at
                      the hospital counter.
                    </p>
                  </div>
                )}

                <div className="mt-5 flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  <LockKeyhole size={12} />
                  100% secure transaction
                </div>
              </div>
            </div>

            <div className="mt-4 hidden items-center justify-center gap-2 text-xs text-slate-400 lg:flex">
              <ShieldCheck
                size={14}
                className="text-teal-600"
              />
              Your information is handled securely
            </div>
          </aside>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
            <div className="bg-gradient-to-br from-slate-950 to-teal-950 px-6 py-6 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <LockKeyhole size={19} />
                  </div>

                  <h3 className="text-xl font-extrabold">
                    Confirm online payment
                  </h3>

                  <p className="mt-1.5 text-sm leading-5 text-slate-300">
                    You will continue to Razorpay's secure
                    payment checkout.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowPaymentModal(
                      false
                    )
                  }
                  disabled={processing}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-slate-300 transition hover:bg-white/20 hover:text-white disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                    {onlineMethod ===
                    "upi" ? (
                      <Smartphone
                        size={19}
                      />
                    ) : onlineMethod ===
                      "card" ? (
                      <CreditCard
                        size={19}
                      />
                    ) : (
                      <Landmark
                        size={19}
                      />
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Preferred option
                    </p>

                    <p className="mt-0.5 text-sm font-bold capitalize text-slate-900">
                      {onlineMethod ===
                      "netbanking"
                        ? "Net Banking"
                        : onlineMethod.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-200 pt-4">
                  <div className="flex items-end justify-between">
                    <span className="text-sm font-semibold text-slate-500">
                      Total payable
                    </span>

                    <span className="text-2xl font-black text-slate-950">
                      ₹
                      {totalAmount.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2 rounded-xl bg-emerald-50 px-3 py-3 text-xs text-emerald-700">
                <ShieldCheck
                  size={15}
                  className="mt-0.5 shrink-0"
                />

                <span>
                  Payment will be securely processed by Razorpay.
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowPaymentModal(
                    false
                  );
                  handleOnlinePayment();
                }}
                disabled={processing}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-700 to-cyan-600 px-5 py-4 text-sm font-extrabold text-white shadow-lg shadow-teal-700/20 transition hover:from-teal-800 hover:to-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processing ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    <LockKeyhole
                      size={17}
                    />
                    Pay ₹
                    {totalAmount.toLocaleString(
                      "en-IN"
                    )}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowPaymentModal(
                    false
                  )
                }
                disabled={processing}
                className="mt-3 w-full rounded-2xl px-5 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-white p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.3)]">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-teal-600 via-emerald-500 to-cyan-500" />

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
              <CheckCircle2
                size={40}
                strokeWidth={2.2}
              />
            </div>

            <div className="mt-6">
              <div className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                <Check size={12} />
                Success
              </div>

              <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                Appointment confirmed
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {successType ===
                "cash"
                  ? "Your appointment has been confirmed. Payment will be collected at the hospital."
                  : "Your payment was successful and your appointment has been confirmed."}
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-left">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  {appointmentType ===
                  "video" ? (
                    <Video size={18} />
                  ) : (
                    <Building2
                      size={18}
                    />
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400">
                    Appointment
                  </p>

                  <p className="text-sm font-bold text-slate-900">
                    {doctorName}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-200 pt-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Date
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-800">
                    {formatDate(
                      appointmentDate
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Time
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-800">
                    {startTime} -{" "}
                    {endTime}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-teal-700">
              <Loader2
                size={15}
                className="animate-spin"
              />
              Redirecting to appointment details...
            </div>
          </div>
        </div>
      )}

      {loading &&
        !showPaymentModal &&
        !showSuccess && (
          <div className="pointer-events-none fixed bottom-5 right-5 z-[60] rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50">
                <Loader2
                  size={17}
                  className="animate-spin text-teal-600"
                />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800">
                  Processing
                </p>

                <p className="text-[10px] text-slate-400">
                  Please wait...
                </p>
              </div>
            </div>
          </div>
        )}
    </main>
  );
}

function InfoItem({
  icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-teal-100 hover:bg-teal-50/30">
      <div className="mb-2 flex items-center gap-2 text-teal-600">
        {icon}

        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </span>
      </div>

      <p className="truncate text-sm font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function PatientItem({
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 break-all text-sm font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function PaymentMethodCard({
  active,
  disabled,
  icon,
  title,
  description,
  badge,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group relative w-full rounded-2xl border p-4 text-left transition-all ${
        active
          ? "border-teal-500 bg-teal-50/60 shadow-sm ring-1 ring-teal-500"
          : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
      } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {badge && active && (
        <span className="absolute right-3 top-3 rounded-full bg-teal-600 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-white">
          {badge}
        </span>
      )}

      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${
            active
              ? "bg-teal-600 text-white shadow-sm"
              : "bg-slate-50 text-slate-600 group-hover:bg-teal-50 group-hover:text-teal-700"
          }`}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1 pr-4">
          <p className="text-sm font-extrabold text-slate-900">
            {title}
          </p>

          <p className="mt-0.5 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>

        <div
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
            active
              ? "border-teal-600 bg-teal-600"
              : "border-slate-300 bg-white"
          }`}
        >
          {active && (
            <Check
              size={12}
              strokeWidth={3}
              className="text-white"
            />
          )}
        </div>
      </div>
    </button>
  );
}

function OnlineOption({
  active,
  disabled,
  icon,
  title,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
        active
          ? "border-teal-500 bg-white text-teal-700 shadow-sm ring-1 ring-teal-500"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
      } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {icon}

      <span className="text-xs font-bold">
        {title}
      </span>

      {active && (
        <Check
          size={15}
          className="ml-auto text-teal-600"
        />
      )}
    </button>
  );
}

function SummaryRow({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-slate-500">
        {label}
      </span>

      <span className="font-bold text-slate-800">
        {value}
      </span>
    </div>
  );
}