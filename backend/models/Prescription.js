const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },

    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      index: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Departments",
      required: true,
    },

    diagnosis: {
      type: String,
      trim: true,
      default: "",
    },

    symptoms: {
      type: String,
      trim: true,
      default: "",
    },

    medicines: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },

        dosage: {
          type: String,
          required: true,
          trim: true,
        },

        frequency: {
          type: String,
          required: true,
          trim: true,
        },

        duration: {
          type: String,
          required: true,
          trim: true,
        },

        instructions: {
          type: String,
          trim: true,
          default: "",
        },
      },
    ],

    tests: [
      {
        name: {
          type: String,
          trim: true,
        },

        instructions: {
          type: String,
          trim: true,
          default: "",
        },
      },
    ],

    advice: {
      type: String,
      trim: true,
      default: "",
    },

    followUpDate: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

prescriptionSchema.index({
  patient: 1,
  createdAt: -1,
});

prescriptionSchema.index({
  doctor: 1,
  createdAt: -1,
});

module.exports =
  mongoose.models.Prescription ||
  mongoose.model("Prescription", prescriptionSchema);