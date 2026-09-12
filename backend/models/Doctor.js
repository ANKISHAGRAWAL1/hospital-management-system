const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    // ==========================================
    // PROFILE IMAGE
    // ==========================================
    profileImage: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // PERSONAL DETAILS
    // ==========================================
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

    // ==========================================
    // LOGIN CREDENTIALS
    // ==========================================
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

    // ==========================================
    // PROFESSIONAL DETAILS
    // ==========================================

    // Doctor can have multiple specializations
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

    // Doctor can have multiple qualifications
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

    // ==========================================
    // DOCTOR AVAILABILITY
    // ==========================================
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

        // ======================================
        // HOSPITAL VISIT
        // ======================================
        hospital: {
          enabled: {
            type: Boolean,
            default: false,
          },

          slots: [
            {
              startTime: {
                type: String,
                trim: true,
              },

              endTime: {
                type: String,
                trim: true,
              },
            },
          ],
        },

        // ======================================
        // VIDEO CONSULTATION
        // ======================================
        video: {
          enabled: {
            type: Boolean,
            default: false,
          },

          slots: [
            {
              startTime: {
                type: String,
                trim: true,
              },

              endTime: {
                type: String,
                trim: true,
              },
            },
          ],
        },
      },
    ],

    // ==========================================
    // APPOINTMENT DURATION
    // ==========================================
    appointmentDuration: {
      type: Number,
      enum: [15, 30, 45, 60],
      default: 30,
    },

    // ==========================================
    // DOCTOR STATUS
    // ==========================================
    status: {
      type: Boolean,
      default: true,
      index: true,
    },

    // ==========================================
    // ADDRESS
    // ==========================================
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

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;