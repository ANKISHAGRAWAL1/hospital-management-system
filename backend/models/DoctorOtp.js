const mongoose = require("mongoose");

const doctorOtpSchema = new mongoose.Schema(
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
      minlength: 6,
      maxlength: 6,
      select: true,
    },

    expiresAt: {
      type: Date,
      required: true,
       
    },

    attempts: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// MongoDB automatically removes expired OTP documents
doctorOtpSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

module.exports = mongoose.model("DoctorOtp", doctorOtpSchema);