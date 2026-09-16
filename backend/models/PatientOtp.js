const mongoose = require("mongoose");

const patientOtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    otp: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      // ❌ yahan index: true mat lagao
    },

    attempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// OTP automatically delete hone ke liye TTL index
patientOtpSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const PatientOtp =
  mongoose.models.PatientOtp ||
  mongoose.model("PatientOtp", patientOtpSchema);

module.exports = PatientOtp;