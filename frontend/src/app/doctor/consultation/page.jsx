"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  UserRound,
  Clock,
  Activity,
  Stethoscope,
  FileText,
  Pill,
  Plus,
  X,
  Save,
  CheckCircle2,
} from "lucide-react";

export default function ConsultationPage() {
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [symptoms, setSymptoms] = useState(
    "Chest discomfort and fatigue for the last two weeks."
  );

  const [followUp, setFollowUp] = useState("");
  const [followUpInstructions, setFollowUpInstructions] = useState("");

  const [status, setStatus] = useState("In Progress");
  const [message, setMessage] = useState("");

  const [vitals, setVitals] = useState({
    bloodPressure: "120/80",
    heartRate: "76",
    temperature: "98.4",
    weight: "62",
  });

  const [medicines, setMedicines] = useState([
    {
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    },
  ]);

  /* Add Medicine */
  const addMedicine = () => {
    setMedicines([
      ...medicines,
      {
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ]);
  };

  /* Remove Medicine */
  const removeMedicine = (index) => {
    if (medicines.length === 1) {
      return;
    }

    setMedicines(
      medicines.filter((_, i) => i !== index)
    );
  };

  /* Update Medicine */
  const updateMedicine = (index, field, value) => {
    const updated = [...medicines];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setMedicines(updated);
  };

  /* Update Vitals */
  const updateVital = (field, value) => {
    setVitals({
      ...vitals,
      [field]: value,
    });
  };

  /* Save Draft */
  const handleSaveDraft = () => {
    setStatus("Draft Saved");
    setMessage("Consultation draft saved successfully.");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  /* Complete Consultation */
  const handleCompleteConsultation = () => {
    if (!diagnosis.trim()) {
      setMessage("Please enter diagnosis before completing consultation.");
      return;
    }

    const validMedicines = medicines.filter(
      (medicine) => medicine.name.trim() !== ""
    );

    setStatus("Completed");
    setMessage(
      `Consultation completed successfully. ${validMedicines.length} medicine(s) added.`
    );

    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-8">

      {/* Back */}
      <Link
        href="/doctor/patients/PT-1024"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-6"
      >
        <ArrowLeft size={17} />
        Back to Patient
      </Link>

      {/* Success / Error Message */}
      {message && (
        <div className="mb-6 border border-gray-800 bg-gray-950 rounded-xl px-5 py-4 text-sm text-gray-300">
          {message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center">
            <UserRound
              size={27}
              className="text-gray-400"
            />
          </div>

          <div>
            <div className="flex items-center gap-3">

              <h1 className="text-2xl font-semibold">
                Priya Gupta
              </h1>

              <span className="px-2.5 py-1 rounded-full bg-gray-900 border border-gray-800 text-xs text-gray-400">
                PT-1024
              </span>

            </div>

            <p className="text-sm text-gray-500 mt-1">
              29 yrs • Female • Blood Group B+
            </p>
          </div>

        </div>

        <div className="flex items-center gap-4">

          <span className="px-3 py-1.5 rounded-full bg-gray-900 border border-gray-800 text-xs text-gray-400">
            {status}
          </span>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock size={17} />
            Appointment: 11:00 AM
          </div>

        </div>

      </div>

      {/* Patient Alert */}
      <div className="mb-6 p-4 bg-gray-950 border border-gray-800 rounded-xl">

        <div className="flex items-start gap-3">

          <Activity
            size={19}
            className="text-gray-400 mt-0.5"
          />

          <div>

            <p className="text-sm font-medium">
              Current Complaint
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Chest discomfort and fatigue for the last
              two weeks.
            </p>

          </div>

        </div>

      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="xl:col-span-2 space-y-6">

          {/* Vitals */}
          <section className="bg-gray-950 border border-gray-800 rounded-xl">

            <div className="p-5 border-b border-gray-800">

              <div className="flex items-center gap-3">

                <Activity
                  size={19}
                  className="text-gray-400"
                />

                <div>

                  <h2 className="font-semibold">
                    Patient Vitals
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Record current patient measurements
                  </p>

                </div>

              </div>

            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              <VitalInput
                label="Blood Pressure"
                value={vitals.bloodPressure}
                onChange={(value) =>
                  updateVital("bloodPressure", value)
                }
                placeholder="120/80"
                unit="mmHg"
              />

              <VitalInput
                label="Heart Rate"
                value={vitals.heartRate}
                onChange={(value) =>
                  updateVital("heartRate", value)
                }
                placeholder="76"
                unit="bpm"
              />

              <VitalInput
                label="Temperature"
                value={vitals.temperature}
                onChange={(value) =>
                  updateVital("temperature", value)
                }
                placeholder="98.4"
                unit="°F"
              />

              <VitalInput
                label="Weight"
                value={vitals.weight}
                onChange={(value) =>
                  updateVital("weight", value)
                }
                placeholder="62"
                unit="kg"
              />

            </div>

          </section>

          {/* Symptoms */}
          <section className="bg-gray-950 border border-gray-800 rounded-xl">

            <SectionHeader
              icon={Activity}
              title="Symptoms & Examination"
              subtitle="Record patient's symptoms and examination findings"
            />

            <div className="p-5">

              <textarea
                value={symptoms}
                onChange={(e) =>
                  setSymptoms(e.target.value)
                }
                rows={5}
                placeholder="Enter symptoms and examination findings..."
                className="w-full bg-black border border-gray-800 rounded-lg p-4 text-sm text-white placeholder:text-gray-600 outline-none focus:border-gray-600 resize-none"
              />

            </div>

          </section>

          {/* Diagnosis */}
          <section className="bg-gray-950 border border-gray-800 rounded-xl">

            <SectionHeader
              icon={Stethoscope}
              title="Diagnosis"
              subtitle="Enter clinical diagnosis"
            />

            <div className="p-5">

              <textarea
                value={diagnosis}
                onChange={(e) =>
                  setDiagnosis(e.target.value)
                }
                rows={4}
                placeholder="Enter diagnosis..."
                className="w-full bg-black border border-gray-800 rounded-lg p-4 text-sm text-white placeholder:text-gray-600 outline-none focus:border-gray-600 resize-none"
              />

            </div>

          </section>

          {/* Clinical Notes */}
          <section className="bg-gray-950 border border-gray-800 rounded-xl">

            <SectionHeader
              icon={FileText}
              title="Clinical Notes"
              subtitle="Add detailed consultation notes"
            />

            <div className="p-5">

              <textarea
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                rows={6}
                placeholder="Write clinical notes..."
                className="w-full bg-black border border-gray-800 rounded-lg p-4 text-sm text-white placeholder:text-gray-600 outline-none focus:border-gray-600 resize-none"
              />

            </div>

          </section>

          {/* Prescription */}
          <section className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">

            <div className="p-5 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <SectionHeader
                icon={Pill}
                title="Prescription"
                subtitle="Add medicines and instructions"
              />

              <button
                type="button"
                onClick={addMedicine}
                disabled={status === "Completed"}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
                Add Medicine
              </button>

            </div>

            <div className="p-5 space-y-4">

              {medicines.map((medicine, index) => (

                <div
                  key={index}
                  className="bg-black border border-gray-800 rounded-xl p-5"
                >

                  <div className="flex items-center justify-between mb-5">

                    <p className="text-sm font-medium">
                      Medicine {index + 1}
                    </p>

                    {medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeMedicine(index)
                        }
                        disabled={status === "Completed"}
                        className="p-2 text-gray-600 hover:text-white hover:bg-gray-900 rounded-lg disabled:opacity-40"
                      >
                        <X size={17} />
                      </button>
                    )}

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <Input
                      label="Medicine Name"
                      placeholder="e.g. Paracetamol"
                      value={medicine.name}
                      onChange={(value) =>
                        updateMedicine(
                          index,
                          "name",
                          value
                        )
                      }
                      disabled={status === "Completed"}
                    />

                    <Input
                      label="Dosage"
                      placeholder="e.g. 500 mg"
                      value={medicine.dosage}
                      onChange={(value) =>
                        updateMedicine(
                          index,
                          "dosage",
                          value
                        )
                      }
                      disabled={status === "Completed"}
                    />

                    <Select
                      label="Frequency"
                      value={medicine.frequency}
                      onChange={(value) =>
                        updateMedicine(
                          index,
                          "frequency",
                          value
                        )
                      }
                      options={[
                        "Once a day",
                        "Twice a day",
                        "Three times a day",
                        "Four times a day",
                        "As needed",
                      ]}
                      disabled={status === "Completed"}
                    />

                    <Input
                      label="Duration"
                      placeholder="e.g. 5 days"
                      value={medicine.duration}
                      onChange={(value) =>
                        updateMedicine(
                          index,
                          "duration",
                          value
                        )
                      }
                      disabled={status === "Completed"}
                    />

                    <div className="md:col-span-2">

                      <Input
                        label="Instructions"
                        placeholder="e.g. After food"
                        value={medicine.instructions}
                        onChange={(value) =>
                          updateMedicine(
                            index,
                            "instructions",
                            value
                          )
                        }
                        disabled={status === "Completed"}
                      />

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </section>

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* Patient Summary */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl">

            <div className="p-5 border-b border-gray-800">

              <h2 className="font-semibold">
                Patient Summary
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Important patient information
              </p>

            </div>

            <div className="p-5 space-y-5">

              <Summary
                label="Patient ID"
                value="PT-1024"
              />

              <Summary
                label="Age / Gender"
                value="29 yrs / Female"
              />

              <Summary
                label="Blood Group"
                value="B+"
              />

              <Summary
                label="Allergies"
                value="No known allergies"
              />

              <Summary
                label="Current Complaint"
                value="Chest discomfort & fatigue"
              />

            </div>

          </div>

          {/* Previous Diagnosis */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl">

            <div className="p-5 border-b border-gray-800">

              <h2 className="font-semibold">
                Previous Diagnosis
              </h2>

            </div>

            <div className="p-5">

              <div className="p-4 bg-black border border-gray-800 rounded-lg">

                <p className="text-sm">
                  Hypertension
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Diagnosed on 10 Aug 2026
                </p>

              </div>

            </div>

          </div>

          {/* Follow Up */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl">

            <div className="p-5 border-b border-gray-800">

              <h2 className="font-semibold">
                Follow-up
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Schedule patient's next visit
              </p>

            </div>

            <div className="p-5 space-y-4">

              <div>

                <label className="block text-xs text-gray-500 mb-2">
                  Follow-up Date
                </label>

                <input
                  type="date"
                  value={followUp}
                  onChange={(e) =>
                    setFollowUp(e.target.value)
                  }
                  disabled={status === "Completed"}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-gray-600 disabled:opacity-50"
                />

              </div>

              <div>

                <label className="block text-xs text-gray-500 mb-2">
                  Instructions
                </label>

                <textarea
                  rows={4}
                  value={followUpInstructions}
                  onChange={(e) =>
                    setFollowUpInstructions(
                      e.target.value
                    )
                  }
                  disabled={status === "Completed"}
                  placeholder="Follow-up instructions..."
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-gray-600 resize-none disabled:opacity-50"
                />

              </div>

            </div>

          </div>

          {/* Actions */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-5">

            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={status === "Completed"}
              className="w-full flex items-center justify-center gap-2 border border-gray-800 rounded-lg py-3 text-sm text-gray-300 hover:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Save size={17} />
              Save Draft
            </button>

            <button
              type="button"
              onClick={handleCompleteConsultation}
              disabled={status === "Completed"}
              className="w-full mt-3 flex items-center justify-center gap-2 bg-white text-black rounded-lg py-3 text-sm font-medium hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <CheckCircle2 size={17} />
              Complete Consultation
            </button>

            <p className="text-xs text-gray-600 text-center mt-3">
              Completing the consultation will save the
              patient's medical record and prescription.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}

/* Section Header */
function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}) {
  return (
    <div className="flex items-center gap-3">

      <div className="p-2.5 bg-gray-900 rounded-lg">
        <Icon
          size={18}
          className="text-gray-400"
        />
      </div>

      <div>

        <h2 className="font-semibold">
          {title}
        </h2>

        <p className="text-xs text-gray-500 mt-1">
          {subtitle}
        </p>

      </div>

    </div>
  );
}

/* Input */
function Input({
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
}) {
  return (
    <div>

      <label className="block text-xs text-gray-500 mb-2">
        {label}
      </label>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      />

    </div>
  );
}

/* Select */
function Select({
  label,
  value,
  onChange,
  options,
  disabled = false,
}) {
  return (
    <div>

      <label className="block text-xs text-gray-500 mb-2">
        {label}
      </label>

      <select
        value={value}
        disabled={disabled}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >

        <option value="">
          Select frequency
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

    </div>
  );
}

/* Vital Input */
function VitalInput({
  label,
  value,
  onChange,
  placeholder,
  unit,
}) {
  return (
    <div>

      <label className="block text-xs text-gray-500 mb-2">
        {label}
      </label>

      <div className="relative">

        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 pr-14 text-sm text-white outline-none focus:border-gray-600"
        />

        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-600">
          {unit}
        </span>

      </div>

    </div>
  );
}

/* Summary */
function Summary({ label, value }) {
  return (
    <div>

      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="text-sm text-gray-300 mt-1">
        {value}
      </p>

    </div>
  );
}