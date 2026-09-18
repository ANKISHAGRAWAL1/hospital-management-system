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

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: null,
    },

    bloodGroup: {
      type: String,
      enum: [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
      ],
      default: null,
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    emergencyContact: {
      name: {
        type: String,
        trim: true,
        default: "",
      },
      phone: {
        type: String,
        trim: true,
        default: "",
      },
      relationship: {
        type: String,
        trim: true,
        default: "",
      },
    },

    profileImage: {
      type: String,
      default: "",
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

const User =
  mongoose.models.User ||
  mongoose.model("User", userSchema);

module.exports = User;