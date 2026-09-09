const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    headDoctor: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

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