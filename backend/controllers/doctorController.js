const Doctor = require("../models/Doctor");

const {
  sendBadrequest,
  sendConflict,
  sendsuccess,
  sendcreated,
  sendNotfound,
  sendServerError,
} = require("../utils/res");

// =====================================================
// CREATE DOCTOR
// =====================================================

const createDoctor = async (req, res) => {
  try {
    console.log("========================================");
    console.log("CREATE DOCTOR REQUEST");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("========================================");

    // -------------------------------------------------
    // Safety check for multipart/form-data
    // -------------------------------------------------
    if (!req.body) {
      return sendBadrequest(res, "Doctor data is required");
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      dateOfBirth,
      specialization,
      department,
      qualification,
      experience,
      consultationFee,
      licenseNumber,
      availableDays,
      startTime,
      endTime,
      appointmentDuration,
      fullAddress,
      city,
      state,
      pincode,
      username,
      password,
    } = req.body;

    // -------------------------------------------------
    // Required fields
    // -------------------------------------------------
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !gender ||
      !dateOfBirth ||
      !specialization ||
      !department ||
      !qualification ||
      !licenseNumber
    ) {
      return sendBadrequest(
        res,
        "Please provide all required doctor fields"
      );
    }

    // -------------------------------------------------
    // Normalize email
    // -------------------------------------------------
    const cleanEmail = email.trim().toLowerCase();

    // -------------------------------------------------
    // Check duplicate email
    // -------------------------------------------------
    const existingEmail = await Doctor.findOne({
      email: cleanEmail,
    });

    if (existingEmail) {
      return sendConflict(
        res,
        "A doctor with this email already exists"
      );
    }

    // -------------------------------------------------
    // Check duplicate license number
    // -------------------------------------------------
    const existingLicense = await Doctor.findOne({
      licenseNumber: licenseNumber.trim(),
    });

    if (existingLicense) {
      return sendConflict(
        res,
        "A doctor with this license number already exists"
      );
    }

    // -------------------------------------------------
    // Check username if provided
    // -------------------------------------------------
    let cleanUsername = "";

    if (username) {
      cleanUsername = username.trim().toLowerCase();

      const existingUsername = await Doctor.findOne({
        username: cleanUsername,
      });

      if (existingUsername) {
        return sendConflict(
          res,
          "This username is already in use"
        );
      }
    }

    // -------------------------------------------------
    // Validate department ObjectId
    // -------------------------------------------------
    if (!/^[0-9a-fA-F]{24}$/.test(department)) {
      return sendBadrequest(
        res,
        "Invalid department ID"
      );
    }

    // -------------------------------------------------
    // Handle available days
    // -------------------------------------------------
    let parsedAvailableDays = [];

    if (availableDays) {
      if (Array.isArray(availableDays)) {
        parsedAvailableDays = availableDays;
      } else if (typeof availableDays === "string") {
        try {
          // If frontend sends JSON array
          parsedAvailableDays = JSON.parse(availableDays);

          if (!Array.isArray(parsedAvailableDays)) {
            parsedAvailableDays = [availableDays];
          }
        } catch (error) {
          // If frontend sends comma separated values
          parsedAvailableDays = availableDays
            .split(",")
            .map((day) => day.trim())
            .filter(Boolean);
        }
      }
    }

    // -------------------------------------------------
    // Validate available days
    // -------------------------------------------------
    const validDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    const invalidDays = parsedAvailableDays.filter(
      (day) => !validDays.includes(day)
    );

    if (invalidDays.length > 0) {
      return sendBadrequest(
        res,
        `Invalid available days: ${invalidDays.join(", ")}`
      );
    }

    // -------------------------------------------------
    // Convert numeric values
    // -------------------------------------------------
    const parsedExperience =
      experience !== undefined &&
      experience !== ""
        ? Number(experience)
        : 0;

    const parsedConsultationFee =
      consultationFee !== undefined &&
      consultationFee !== ""
        ? Number(consultationFee)
        : 0;

    const parsedAppointmentDuration =
      appointmentDuration !== undefined &&
      appointmentDuration !== ""
        ? Number(appointmentDuration)
        : 30;

    // -------------------------------------------------
    // Validate numbers
    // -------------------------------------------------
    if (
      Number.isNaN(parsedExperience) ||
      parsedExperience < 0
    ) {
      return sendBadrequest(
        res,
        "Experience must be a valid positive number"
      );
    }

    if (
      Number.isNaN(parsedConsultationFee) ||
      parsedConsultationFee < 0
    ) {
      return sendBadrequest(
        res,
        "Consultation fee must be a valid positive number"
      );
    }

    if (
      ![15, 30, 45, 60].includes(
        parsedAppointmentDuration
      )
    ) {
      return sendBadrequest(
        res,
        "Appointment duration must be 15, 30, 45 or 60 minutes"
      );
    }

    // -------------------------------------------------
    // Handle profile image
    // -------------------------------------------------
    let profileImage = "";

    if (req.file) {
      profileImage = `/uploads/doctors/${req.file.filename}`;
    }

    // -------------------------------------------------
    // Create doctor
    // -------------------------------------------------
    const doctor = await Doctor.create({
      profileImage,

      firstName: firstName.trim(),

      lastName: lastName.trim(),

      email: cleanEmail,

      phone: phone.trim(),

      gender,

      dateOfBirth: new Date(dateOfBirth),

      specialization: specialization.trim(),

      department,

      qualification: qualification.trim(),

      experience: parsedExperience,

      consultationFee: parsedConsultationFee,

      licenseNumber: licenseNumber.trim(),

      availableDays: parsedAvailableDays,

      startTime: startTime
        ? startTime.trim()
        : "",

      endTime: endTime
        ? endTime.trim()
        : "",

      appointmentDuration:
        parsedAppointmentDuration,

      // Admin-created doctors are active by default
      status: true,

      address: {
        fullAddress: fullAddress
          ? fullAddress.trim()
          : "",

        city: city
          ? city.trim()
          : "",

        state: state
          ? state.trim()
          : "",

        pincode: pincode
          ? pincode.trim()
          : "",
      },

      // Optional because doctor can create password later
      username: cleanUsername || undefined,

      password: password || "",
    });

    // -------------------------------------------------
    // Populate department
    // -------------------------------------------------
    const createdDoctor = await Doctor.findById(
      doctor._id
    ).populate(
      "department",
      "name code"
    );

    // -------------------------------------------------
    // Success
    // -------------------------------------------------
    return sendcreated(
      res,
      "Doctor created successfully",
      createdDoctor
    );
  } catch (error) {
    console.error(
      "========================================"
    );
    console.error("CREATE DOCTOR ERROR:");
    console.error(error);
    console.error(
      "========================================"
    );

    // -------------------------------------------------
    // MongoDB duplicate key error
    // -------------------------------------------------
    if (error.code === 11000) {
      const duplicateField = Object.keys(
        error.keyPattern || {}
      )[0];

      let message =
        "Doctor already exists";

      if (duplicateField === "email") {
        message =
          "A doctor with this email already exists";
      }

      if (duplicateField === "licenseNumber") {
        message =
          "A doctor with this license number already exists";
      }

      if (duplicateField === "username") {
        message =
          "This username is already in use";
      }

      return sendConflict(
        res,
        message
      );
    }

    // -------------------------------------------------
    // Mongoose validation error
    // -------------------------------------------------
    if (error.name === "ValidationError") {
      const messages = Object.values(
        error.errors
      ).map(
        (err) => err.message
      );

      return sendBadrequest(
        res,
        messages.join(", ")
      );
    }

    // -------------------------------------------------
    // Invalid ObjectId
    // -------------------------------------------------
    if (
      error.name ===
      "CastError"
    ) {
      return sendBadrequest(
        res,
        `Invalid ${error.path}`
      );
    }

    // -------------------------------------------------
    // Server error
    // -------------------------------------------------
    return sendServerError(
      res,
      error.message
    );
  }
};

// =====================================================
// GET ALL DOCTORS
// =====================================================

const getAllDoctors = async (
  req,
  res
) => {
  try {
    const doctors =
      await Doctor.find()
        .populate(
          "department",
          "name code"
        )
        .sort({
          createdAt: -1,
        });

    return sendsuccess(
      res,
      "Doctors fetched successfully",
      doctors
    );
  } catch (error) {
    console.error(
      "Get Doctors Error:",
      error
    );

    return sendServerError(
      res,
      error.message
    );
  }
};

// =====================================================
// GET DOCTOR BY ID
// =====================================================

const getDoctorById = async (
  req,
  res
) => {
  try {
    const doctor =
      await Doctor.findById(
        req.params.id
      ).populate(
        "department",
        "name code"
      );

    if (!doctor) {
      return sendNotfound(
        res,
        "Doctor not found"
      );
    }

    return sendsuccess(
      res,
      "Doctor fetched successfully",
      doctor
    );
  } catch (error) {
    console.error(
      "Get Doctor By ID Error:",
      error
    );

    if (
      error.name ===
      "CastError"
    ) {
      return sendBadrequest(
        res,
        "Invalid doctor ID"
      );
    }

    return sendServerError(
      res,
      error.message
    );
  }
};

// =====================================================
// UPDATE DOCTOR STATUS
// =====================================================

const updateDoctorStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    if (
      typeof status !==
      "boolean"
    ) {
      return sendBadrequest(
        res,
        "Status must be true or false"
      );
    }

    const doctor =
      await Doctor.findByIdAndUpdate(
        req.params.id,
        {
          status,
        },
        {
          new: true,
          runValidators: true,
        }
      ).populate(
        "department",
        "name code"
      );

    if (!doctor) {
      return sendNotfound(
        res,
        "Doctor not found"
      );
    }

    return sendsuccess(
      res,
      "Doctor status updated successfully",
      doctor
    );
  } catch (error) {
    console.error(
      "Update Doctor Status Error:",
      error
    );

    if (
      error.name ===
      "CastError"
    ) {
      return sendBadrequest(
        res,
        "Invalid doctor ID"
      );
    }

    return sendServerError(
      res,
      error.message
    );
  }
};

// =====================================================
// DELETE DOCTOR
// =====================================================

const deleteDoctor = async (
  req,
  res
) => {
  try {
    const doctor =
      await Doctor.findByIdAndDelete(
        req.params.id
      );

    if (!doctor) {
      return sendNotfound(
        res,
        "Doctor not found"
      );
    }

    return sendsuccess(
      res,
      "Doctor deleted successfully",
      {}
    );
  } catch (error) {
    console.error(
      "Delete Doctor Error:",
      error
    );

    if (
      error.name ===
      "CastError"
    ) {
      return sendBadrequest(
        res,
        "Invalid doctor ID"
      );
    }

    return sendServerError(
      res,
      error.message
    );
  }
};

// =====================================================
// EXPORT CONTROLLERS
// =====================================================

module.exports = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctorStatus,
  deleteDoctor,
};