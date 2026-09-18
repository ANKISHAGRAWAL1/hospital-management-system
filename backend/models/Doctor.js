const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    // Profile Image
    profileImage: {
      type: String,
      default: "",
      trim: true,
    },

    // Personal Details
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
      index: true,
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

    // Login Credentials
    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      select: false,
    },

    // Professional Details
    specialization: {
      type: [String],
      required: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },

    qualification: {
      type: [String],
      required: true,
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
      index: true,
    },

    // Doctor Availability
    availability: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          required: true,
        },

        // Hospital Visit
        hospital: {
          enabled: {
            type: Boolean,
            default: false,
          },

          slots: [
            {
              startTime: {
                type: String,
                required: true,
                trim: true,
              },

              endTime: {
                type: String,
                required: true,
                trim: true,
              },
            },
          ],
        },

        // Video Consultation
        video: {
          enabled: {
            type: Boolean,
            default: false,
          },

          slots: [
            {
              startTime: {
                type: String,
                required: true,
                trim: true,
              },

              endTime: {
                type: String,
                required: true,
                trim: true,
              },
            },
          ],
        },
      },
    ],

    // Appointment Duration in Minutes
    appointmentDuration: {
      type: Number,
      enum: [15, 30, 45, 60],
      default: 30,
      required: true,
    },

    // Doctor Active / Inactive
    status: {
      type: Boolean,
      default: true,
      index: true,
    },

    // Address
    address: {
      fullAddress: {
        type: String,
        trim: true,
        default: "",
      },

      city: {
        type: String,
        trim: true,
        default: "",
      },

      state: {
        type: String,
        trim: true,
        default: "",
      },

      pincode: {
        type: String,
        trim: true,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Doctor = mongoose.model(
  "Doctor",
  doctorSchema
);

module.exports = Doctor;