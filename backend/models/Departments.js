const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    // ==========================================
    // DEPARTMENT NAME
    // ==========================================
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // ==========================================
    // DEPARTMENT CODE
    // ==========================================
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    // ==========================================
    // DEPARTMENT IMAGE
    // ==========================================
    image: {
      type: String,
      default: "",
    },

    // ==========================================
    // HEAD DOCTOR
    // ==========================================
    headDoctor: {
      type: String,
      default: "",
    },

    // ==========================================
    // DESCRIPTION
    // ==========================================
    description: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================================
    // LOCATION
    // ==========================================
    location: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================================
    // STATUS
    // ==========================================
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Department = mongoose.model(
  "Department",
  departmentSchema
);

module.exports = Department;