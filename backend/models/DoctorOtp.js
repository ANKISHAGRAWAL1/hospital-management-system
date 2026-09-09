const mongoose = require("mongoose");

const doctorOtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    otp: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const DoctorOtp = mongoose.model("DoctorOtp", doctorOtpSchema);

module.exports = DoctorOtp;