const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: [
        "admin",
        "doctor",
        "receptionist",
        "patient",
      ],
      default: "patient",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ==================================================
    // PATIENT DEPENDENT
    // ==================================================

    parentPatient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isDependent: {
      type: Boolean,
      default: false,
    },

    // ==================================================
    // PATIENT ADDED BY
    // ==================================================

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent OverwriteModelError during reload/watch
const User =
  mongoose.models.User ||
  mongoose.model("User", userSchema);

module.exports = User;