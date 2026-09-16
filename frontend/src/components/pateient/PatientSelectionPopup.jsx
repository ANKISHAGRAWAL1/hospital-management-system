"use client";

import {
  X,
  UserRoundPlus,
  UserRound,
  Check,
  ArrowRight,
} from "lucide-react";

export default function PatientSelectionPopup({
  open,
  patient,
  patients = [],
  selectedPatient,
  onClose,
  onAddNewPatient,
  onContinueExisting,
  onSelectPatient,
}) {
  if (!open) return null;

  // =====================================================
  // BUILD PATIENT LIST
  // =====================================================

  let patientList = Array.isArray(patients)
    ? [...patients]
    : [];

  // Current logged-in patient ko bhi list mein include karo
  if (
    patient &&
    patient?._id &&
    !patientList.some(
      (item) =>
        String(item?._id) === String(patient?._id)
    )
  ) {
    patientList.unshift(patient);
  }

  // Agar patients empty hain lekin patient object available hai
  if (
    patientList.length === 0 &&
    patient
  ) {
    patientList = [patient];
  }

  const activePatient =
    selectedPatient || patient;

  // =====================================================
  // SELECT PATIENT
  // =====================================================

  const handleSelectPatient = (item) => {
    if (onSelectPatient) {
      onSelectPatient(item);
      return;
    }

    if (onContinueExisting) {
      onContinueExisting(item);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 px-4 py-6 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="border-b border-slate-100 bg-white px-6 pb-5 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="pr-10">
            <h2 className="text-xl font-bold text-slate-900">
              Select Patient
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Who is this appointment for?
            </p>
          </div>
        </div>

        {/* =================================================
            PATIENT LIST
        ================================================= */}

        <div className="flex-1 overflow-y-auto px-6 py-5">

          {patientList.length > 0 && (
            <div className="mb-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Your Patients
              </p>

              <div className="space-y-3">
                {patientList.map((item, index) => {
                  const itemId =
                    item?._id ||
                    item?.id ||
                    item?.email ||
                    index;

                  const activeId =
                    activePatient?._id ||
                    activePatient?.id ||
                    activePatient?.email;

                  const isSelected =
                    String(itemId) ===
                    String(activeId);

                  const isLoggedInPatient =
                    patient &&
                    String(
                      item?._id || item?.id
                    ) ===
                      String(
                        patient?._id ||
                          patient?.id
                      );

                  return (
                    <div
                      key={itemId}
                      className={`group rounded-2xl border p-4 transition ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/70 shadow-sm"
                          : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">

                        {/* AVATAR */}

                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          <UserRound size={21} />
                        </div>

                        {/* PATIENT INFO */}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="truncate text-sm font-bold text-slate-900">
                              {item?.name ||
                                "Patient"}
                            </h3>

                            {isLoggedInPatient && (
                              <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                                You
                              </span>
                            )}
                          </div>

                          {item?.email && (
                            <p className="mt-1 truncate text-xs text-slate-500">
                              {item.email}
                            </p>
                          )}

                          {item?.phone && (
                            <p className="mt-1 text-xs text-slate-400">
                              +91 {item.phone}
                            </p>
                          )}
                        </div>

                        {/* SELECT BUTTON */}

                        <button
                          type="button"
                          onClick={() =>
                            handleSelectPatient(
                              item
                            )
                          }
                          className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                            isSelected
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "border border-blue-200 bg-white text-blue-600 hover:bg-blue-600 hover:text-white"
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check size={15} />
                              Selected
                            </>
                          ) : (
                            <>
                              Select
                              <ArrowRight
                                size={15}
                              />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =================================================
              ADD NEW PATIENT
          ================================================= */}

          <button
            type="button"
            onClick={onAddNewPatient}
            className="group mt-4 flex w-full items-center gap-4 rounded-2xl border border-dashed border-teal-300 bg-teal-50/50 p-4 text-left transition hover:border-teal-500 hover:bg-teal-50"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600 transition group-hover:bg-teal-600 group-hover:text-white">
              <UserRoundPlus size={22} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-slate-900">
                Add New Patient
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Add another patient for future appointments
              </p>
            </div>

            <ArrowRight
              size={19}
              className="shrink-0 text-teal-500 transition group-hover:translate-x-1"
            />
          </button>
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
          <p className="text-center text-[11px] leading-5 text-slate-400">
            Select a patient to continue with the
            appointment booking.
          </p>
        </div>
      </div>
    </div>
  );
}