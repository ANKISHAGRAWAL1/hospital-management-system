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

    // Department
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },

    // Doctor
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

    // Appointment Start Time
    startTime: {
      type: String,
      required: true,
    },

    // Appointment End Time
    endTime: {
      type: String,
      required: true,
    },

    // Doctor Consultation Fee
    consultationFee: {
      type: Number,
      required: true,
      min: 0,
    },

    // Appointment Status
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

    // Payment Status
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

    // Razorpay Payment ID
    paymentId: {
      type: String,
      default: null,
      trim: true,
    },

    // Appointment Reason
    reason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },

    // Cancellation Time
    cancelledAt: {
      type: Date,
      default: null,
    },

    // Cancellation Reason
    cancellationReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },

    // Additional Notes
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// --------------------------------------------------
// Prevent Double Booking
// --------------------------------------------------
//
// Same doctor + same date + same time
// cannot have two active appointments.
//
// Cancelled and no-show appointments are ignored
// by the application booking logic.
//

appointmentSchema.index({
  doctor: 1,
  appointmentDate: 1,
  startTime: 1,
  endTime: 1,
  status: 1,
});

module.exports = mongoose.model(
  "Appointment",
  appointmentSchema
);