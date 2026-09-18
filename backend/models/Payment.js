const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
      index: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
    },

    orderId: {
      type: String,
      default: null,
      trim: true,
      index: true,
    },

    paymentId: {
      type: String,
      default: null,
      trim: true,
      index: true,
    },

    signature: {
      type: String,
      default: null,
      trim: true,
    },

    paymentMethod: {
      type: String,
      enum: ["online", "cash"],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "created",
        "pending",
        "paid",
        "failed",
        "refunded",
      ],
      default: "created",
      index: true,
    },

    // ==================================================
    // TEMPORARY BOOKING DATA
    // Used before online payment is successful
    // ==================================================

    bookingData: {
      type: Object,
      default: null,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    refundId: {
      type: String,
      default: null,
      trim: true,
    },

    refundedAt: {
      type: Date,
      default: null,
    },

    failureReason: {
      type: String,
      default: null,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Payment",
  paymentSchema
);