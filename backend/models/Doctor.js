const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    profileImage: {
      type: String,
      default: "",
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
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
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    specialization: {
      type: String,
      required: true,
      trim: true,
    },

 department: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Department",
  required: true,
},
    qualification: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: Number,
      default: 0,
      min: 0,
    },

    consultationFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    availableDays: {
      type: [String],
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      default: [],
    },

    startTime: {
      type: String,
      default: "",
    },

    endTime: {
      type: String,
      default: "",
    },

    appointmentDuration: {
      type: Number,
      enum: [15, 30, 45, 60],
      default: 30,
    },

    status: {
      type: Boolean,
      default: true,
    },

    address: {
      fullAddress: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      pincode: {
        type: String,
        trim: true,
      },
    },
    username: {
  type: String,
  unique: true,
  sparse: true,
  trim: true,
  lowercase: true,
},


password: {
  type: String,
  default: "",
},



},
  {
    timestamps: true,
  }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;