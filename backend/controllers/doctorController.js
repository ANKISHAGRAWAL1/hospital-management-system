const Doctor = require("../models/Doctor");
const Departments = require("../models/Departments");

const {
  sendBadrequest,
  sendConflict,
  sendsuccess,
  sendcreated,
  sendNotfound,
  sendServerError,
} = require("../utils/res");

// ==========================================
// TIME VALIDATION
// ==========================================
const isValidTime = (time) => {
  if (typeof time !== "string") return false;

  // HH:mm format
  const match = time.match(/^([01]\d|2[0-3]):([0-5]\d)$/);

  return !!match;
};

// ==========================================
// TIME COMPARISON
// ==========================================
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
};

// ==========================================
// CHECK SLOT OVERLAPPING
// ==========================================
const hasOverlappingSlots = (slots) => {
  if (!Array.isArray(slots) || slots.length <= 1) {
    return false;
  }

  const sortedSlots = [...slots].sort(
    (a, b) =>
      timeToMinutes(a.startTime) -
      timeToMinutes(b.startTime)
  );

  for (let i = 0; i < sortedSlots.length - 1; i++) {
    const current = sortedSlots[i];
    const next = sortedSlots[i + 1];

    if (
      timeToMinutes(next.startTime) <
      timeToMinutes(current.endTime)
    ) {
      return true;
    }
  }

  return false;
};

// ==========================================
// CREATE DOCTOR
// ==========================================
const createDoctor = async (req, res) => {
  try {
    // ======================================
    // SAFETY CHECK
    // ======================================

    if (!req.body) {
      return sendBadrequest(
        res,
        "Doctor data is required"
      );
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
      availability,
      appointmentDuration,
      fullAddress,
      city,
      state,
      pincode,
    } = req.body;

    // ======================================
    // REQUIRED BASIC FIELDS
    // ======================================

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

    // ======================================
    // PARSE SPECIALIZATION
    // ======================================

    let parsedSpecialization = [];

    if (Array.isArray(specialization)) {
      parsedSpecialization = specialization;
    } else if (
      typeof specialization === "string"
    ) {
      try {
        parsedSpecialization =
          JSON.parse(specialization);
      } catch (error) {
        return sendBadrequest(
          res,
          "Invalid specialization format"
        );
      }
    }

    // ======================================
    // VALIDATE SPECIALIZATION
    // ======================================

    if (
      !Array.isArray(parsedSpecialization) ||
      parsedSpecialization.length === 0
    ) {
      return sendBadrequest(
        res,
        "Please select at least one specialization"
      );
    }

    // ======================================
    // CLEAN SPECIALIZATION
    // ======================================

    parsedSpecialization =
      parsedSpecialization
        .map((item) =>
          String(item).trim()
        )
        .filter(Boolean);

    if (
      parsedSpecialization.length === 0
    ) {
      return sendBadrequest(
        res,
        "Please select at least one specialization"
      );
    }

    // ======================================
    // PARSE QUALIFICATION
    // ======================================

    let parsedQualification = [];

    if (Array.isArray(qualification)) {
      parsedQualification = qualification;
    } else if (
      typeof qualification === "string"
    ) {
      try {
        parsedQualification =
          JSON.parse(qualification);
      } catch (error) {
        return sendBadrequest(
          res,
          "Invalid qualification format"
        );
      }
    }

    // ======================================
    // VALIDATE QUALIFICATION
    // ======================================

    if (
      !Array.isArray(parsedQualification) ||
      parsedQualification.length === 0
    ) {
      return sendBadrequest(
        res,
        "Please select at least one qualification"
      );
    }

    // ======================================
    // CLEAN QUALIFICATION
    // ======================================

    parsedQualification =
      parsedQualification
        .map((item) =>
          String(item).trim()
        )
        .filter(Boolean);

    if (
      parsedQualification.length === 0
    ) {
      return sendBadrequest(
        res,
        "Please select at least one qualification"
      );
    }

    // ======================================
    // NORMALIZE DATA
    // ======================================

    const cleanFirstName =
      firstName.trim();

    const cleanLastName =
      lastName.trim();

    const cleanEmail =
      email.trim().toLowerCase();

    const cleanPhone =
      phone.trim();

    const cleanLicenseNumber =
      licenseNumber.trim();

    // ======================================
    // CHECK DUPLICATE EMAIL
    // ======================================

    const existingEmail =
      await Doctor.findOne({
        email: cleanEmail,
      });

    if (existingEmail) {
      return sendConflict(
        res,
        "A doctor with this email already exists"
      );
    }

    // ======================================
    // CHECK DUPLICATE LICENSE
    // ======================================

    const existingLicense =
      await Doctor.findOne({
        licenseNumber:
          cleanLicenseNumber,
      });

    if (existingLicense) {
      return sendConflict(
        res,
        "A doctor with this license number already exists"
      );
    }

    // ======================================
    // VALIDATE DEPARTMENT ID
    // ======================================

    if (
      !/^[0-9a-fA-F]{24}$/.test(
        department
      )
    ) {
      return sendBadrequest(
        res,
        "Invalid department ID"
      );
    }

    // ======================================
    // CHECK DEPARTMENT EXISTS
    // ======================================

    const existingDepartment =
      await Departments.findById(
        department
      );

    if (!existingDepartment) {
      return sendBadrequest(
        res,
        "Selected department does not exist"
      );
    }

    // ======================================
    // PARSE AVAILABILITY
    // ======================================

    let parsedAvailability = [];

    if (availability) {
      if (
        Array.isArray(availability)
      ) {
        parsedAvailability =
          availability;
      } else if (
        typeof availability ===
        "string"
      ) {
        try {
          parsedAvailability =
            JSON.parse(availability);
        } catch (error) {
          return sendBadrequest(
            res,
            "Invalid availability format"
          );
        }
      }
    }

    // ======================================
    // VALIDATE AVAILABILITY ARRAY
    // ======================================

    if (
      !Array.isArray(
        parsedAvailability
      )
    ) {
      return sendBadrequest(
        res,
        "Availability must be an array"
      );
    }

    // ======================================
    // VALID DAYS
    // ======================================

    const validDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    const usedDays =
      new Set();

    // ======================================
    // VALIDATE EACH DAY
    // ======================================

    for (
      const dayAvailability of
        parsedAvailability
    ) {
      const {
        day,
        hospital,
        video,
      } =
        dayAvailability;

      // ------------------------------------
      // Validate day
      // ------------------------------------

      if (
        !validDays.includes(day)
      ) {
        return sendBadrequest(
          res,
          `Invalid day: ${day}`
        );
      }

      // ------------------------------------
      // Prevent duplicate day
      // ------------------------------------

      if (
        usedDays.has(day)
      ) {
        return sendBadrequest(
          res,
          `${day} availability is added more than once`
        );
      }

      usedDays.add(day);

      // ====================================
      // HOSPITAL VALIDATION
      // ====================================

      if (hospital) {
        if (
          hospital.enabled === true &&
          (
            !Array.isArray(
              hospital.slots
            ) ||
            hospital.slots.length === 0
          )
        ) {
          return sendBadrequest(
            res,
            `${day}: Hospital timing is required`
          );
        }

        if (
          Array.isArray(
            hospital.slots
          )
        ) {
          for (
            const slot of
              hospital.slots
          ) {
            if (
              !slot.startTime ||
              !slot.endTime
            ) {
              return sendBadrequest(
                res,
                `${day}: Hospital start time and end time are required`
              );
            }

            if (
              !isValidTime(
                slot.startTime
              ) ||
              !isValidTime(
                slot.endTime
              )
            ) {
              return sendBadrequest(
                res,
                `${day}: Invalid hospital timing format. Use HH:mm`
              );
            }

            if (
              timeToMinutes(
                slot.startTime
              ) >=
              timeToMinutes(
                slot.endTime
              )
            ) {
              return sendBadrequest(
                res,
                `${day}: Hospital end time must be greater than start time`
              );
            }
          }

          if (
            hasOverlappingSlots(
              hospital.slots
            )
          ) {
            return sendBadrequest(
              res,
              `${day}: Hospital timings cannot overlap`
            );
          }
        }
      }

      // ====================================
      // VIDEO VALIDATION
      // ====================================

      if (video) {
        if (
          video.enabled === true &&
          (
            !Array.isArray(
              video.slots
            ) ||
            video.slots.length === 0
          )
        ) {
          return sendBadrequest(
            res,
            `${day}: Video consultation timing is required`
          );
        }

        if (
          Array.isArray(
            video.slots
          )
        ) {
          for (
            const slot of
              video.slots
          ) {
            if (
              !slot.startTime ||
              !slot.endTime
            ) {
              return sendBadrequest(
                res,
                `${day}: Video start time and end time are required`
              );
            }

            if (
              !isValidTime(
                slot.startTime
              ) ||
              !isValidTime(
                slot.endTime
              )
            ) {
              return sendBadrequest(
                res,
                `${day}: Invalid video timing format. Use HH:mm`
              );
            }

            if (
              timeToMinutes(
                slot.startTime
              ) >=
              timeToMinutes(
                slot.endTime
              )
            ) {
              return sendBadrequest(
                res,
                `${day}: Video end time must be greater than start time`
              );
            }
          }

          if (
            hasOverlappingSlots(
              video.slots
            )
          ) {
            return sendBadrequest(
              res,
              `${day}: Video timings cannot overlap`
            );
          }
        }
      }
    }

    // ======================================
    // NUMERIC VALUES
    // ======================================

    const parsedExperience =
      experience !== undefined &&
      experience !== ""
        ? Number(experience)
        : 0;

    const parsedConsultationFee =
      consultationFee !==
        undefined &&
      consultationFee !== ""
        ? Number(
            consultationFee
          )
        : 0;

    const parsedAppointmentDuration =
      appointmentDuration !==
        undefined &&
      appointmentDuration !== ""
        ? Number(
            appointmentDuration
          )
        : 30;

    // ======================================
    // NUMBER VALIDATION
    // ======================================

    if (
      Number.isNaN(
        parsedExperience
      ) ||
      parsedExperience < 0
    ) {
      return sendBadrequest(
        res,
        "Experience must be a valid positive number"
      );
    }

    if (
      Number.isNaN(
        parsedConsultationFee
      ) ||
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

    // ======================================
    // DATE VALIDATION
    // ======================================

    const parsedDateOfBirth =
      new Date(dateOfBirth);

    if (
      Number.isNaN(
        parsedDateOfBirth.getTime()
      )
    ) {
      return sendBadrequest(
        res,
        "Invalid date of birth"
      );
    }

    // ======================================
    // PROFILE IMAGE
    // ======================================

    let profileImage = "";

    if (req.file) {
      profileImage =
        `/uploads/doctors/${req.file.filename}`;
    }

    // ======================================
    // CREATE DOCTOR
    // ======================================

    const doctor =
      await Doctor.create({
        profileImage,

        firstName:
          cleanFirstName,

        lastName:
          cleanLastName,

        email:
          cleanEmail,

        phone:
          cleanPhone,

        gender,

        dateOfBirth:
          parsedDateOfBirth,

        // IMPORTANT:
        // MULTI SELECT ARRAY
        specialization:
          parsedSpecialization,

        department,

        // IMPORTANT:
        // MULTI SELECT ARRAY
        qualification:
          parsedQualification,

        experience:
          parsedExperience,

        consultationFee:
          parsedConsultationFee,

        licenseNumber:
          cleanLicenseNumber,

        availability:
          parsedAvailability,

        appointmentDuration:
          parsedAppointmentDuration,

        status: true,

        address: {
          fullAddress:
            fullAddress
              ? fullAddress.trim()
              : "",

          city:
            city
              ? city.trim()
              : "",

          state:
            state
              ? state.trim()
              : "",

          pincode:
            pincode
              ? pincode.trim()
              : "",
        },
      });

    // ======================================
    // POPULATE DEPARTMENT
    // ======================================

   // ======================================
// FETCH CREATED DOCTOR
// ======================================

const createdDoctor = await Doctor.findById(doctor._id)
  .populate("department", "name code");

// Doctor create hone ke baad dobara fetch hua ya nahi
if (!createdDoctor) {
  return sendServerError(
    res,
    "Doctor was created but could not be retrieved"
  );
}

// ======================================
// SUCCESS
// ======================================

return sendcreated(
  res,
  "Doctor created successfully",
  createdDoctor
);

} catch (error) {

  console.error("========================================");
  console.error("CREATE DOCTOR ERROR:");
  console.error(error);
  console.error("========================================");

  // ======================================
  // DUPLICATE KEY ERROR
  // ======================================

  if (error.code === 11000) {

    const duplicateFields = Object.keys(
      error.keyPattern || error.keyValue || {}
    );

    if (duplicateFields.includes("email")) {
      return sendConflict(
        res,
        "A doctor with this email already exists"
      );
    }

    if (duplicateFields.includes("licenseNumber")) {
      return sendConflict(
        res,
        "A doctor with this license number already exists"
      );
    }

    return sendConflict(
      res,
      "Doctor with the provided information already exists"
    );
  }

  // ======================================
  // MONGOOSE VALIDATION ERROR
  // ======================================

  if (error.name === "ValidationError") {

    const messages = Object.values(error.errors)
      .map((err) => err.message)
      .filter(Boolean);

    return sendBadrequest(
      res,
      messages.length > 0
        ? messages.join(", ")
        : "Invalid doctor data"
    );
  }

  // ======================================
  // INVALID OBJECT ID
  // ======================================

  if (error.name === "CastError") {

    return sendBadrequest(
      res,
      `Invalid ${error.path}`
    );
  }

  // ======================================
  // JSON PARSE ERROR
  // ======================================

  if (error instanceof SyntaxError) {

    return sendBadrequest(
      res,
      "Invalid JSON data"
    );
  }

  // ======================================
  // SERVER ERROR
  // ======================================

  return sendServerError(
    res,
    error.message || "Failed to create doctor"
  );
}
}
// =====================================================
// GET ALL DOCTORS
// =====================================================

const getAllDoctors = async (req, res) => {
  try {
    // ==========================================
    // 1. QUERY VALIDATION
    // ==========================================

    if (req.query && typeof req.query !== "object") {
      return sendBadrequest(
        res,
        "Invalid request query"
      );
    }

    // ==========================================
    // 2. FETCH DOCTORS
    // ==========================================

    const doctors = await Doctor.find()
      .populate("department", "name code")
      .sort({ createdAt: -1 })
      .lean();

    // ==========================================
    // 3. EMPTY RESULT VALIDATION
    // ==========================================

    if (!Array.isArray(doctors)) {
      return sendServerError(
        res,
        "Invalid doctors data received from database"
      );
    }

    // ==========================================
    // 4. SUCCESS RESPONSE
    // ==========================================

    return sendsuccess(
      res,
      "Doctors fetched successfully",
      doctors
    );

  } catch (error) {
    console.error(
      "========================================"
    );
    console.error(
      "GET ALL DOCTORS ERROR:",
      error
    );
    console.error(
      "========================================"
    );

    // ==========================================
    // MONGOOSE ERRORS
    // ==========================================

    if (error.name === "CastError") {
      return sendBadrequest(
        res,
        `Invalid ${error.path}`
      );
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors)
        .map((err) => err.message);

      return sendBadrequest(
        res,
        messages.join(", ")
      );
    }

    // ==========================================
    // SERVER ERROR
    // ==========================================

    return sendServerError(
      res,
      error.message || "Failed to fetch doctors"
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
