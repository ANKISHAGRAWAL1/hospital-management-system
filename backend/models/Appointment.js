const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    // Patient
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Selected Department
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Departments",
      required: true,
      index: true,
    },

    // Selected Doctor
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },

    // Hospital Visit OR Video Consultation
    appointmentType: {
      type: String,
      enum: ["hospital", "video"],
      required: true,
    },

    // Appointment Date
    appointmentDate: {
      type: Date,
      required: true,
      index: true,
    },

    // Selected Time Slot
    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    // Optional reason for appointment
    reason: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    // Doctor consultation fee
    consultationFee: {
      type: Number,
      required: true,
      min: 0,
    },

    // Appointment status
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "completed",
        "cancelled",
        "no-show",
      ],
      default: "pending",
      index: true,
    },

    // Payment status
    paymentStatus: {
      type: String,
      enum: [
        "unpaid",
        "pending",
        "paid",
        "failed",
        "refunded",
      ],
      default: "unpaid",
      index: true,
    },

    // Payment gateway transaction ID
    paymentId: {
      type: String,
      default: null,
      trim: true,
    },

    // Cancellation details
    cancelledAt: {
      type: Date,
      default: null,
    },

    cancellationReason: {
      type: String,
      default: null,
      trim: true,
      maxlength: 500,
    },

    // Additional notes
    notes: {
      type: String,
      default: null,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);