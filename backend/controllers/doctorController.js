const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const Doctor = require("../models/Doctor");
const Departments = require("../models/Departments");
const User = require("../models/user");

const {
  sendBadrequest,
  sendConflict,
  sendsuccess,
  sendcreated,
  sendNotfound,
  sendServerError,
} = require("../utils/res");

const {
  sendDoctorCredentialsEmail,
} = require("../serivices/emailService");

const isValidTime = (time) => {
  if (typeof time !== "string") {
    return false;
  }

  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(
    time.trim()
  );
};

const timeToMinutes = (time) => {
  const [hours, minutes] = time
    .trim()
    .split(":")
    .map(Number);

  return hours * 60 + minutes;
};

const hasOverlappingSlots = (slots) => {
  if (!Array.isArray(slots) || slots.length < 2) {
    return false;
  }

  const sortedSlots = [...slots].sort(
    (a, b) =>
      timeToMinutes(a.startTime) -
      timeToMinutes(b.startTime)
  );

  for (
    let i = 1;
    i < sortedSlots.length;
    i++
  ) {
    const previousSlot = sortedSlots[i - 1];
    const currentSlot = sortedSlots[i];

    if (
      timeToMinutes(currentSlot.startTime) <
      timeToMinutes(previousSlot.endTime)
    ) {
      return true;
    }
  }

  return false;
};
 
const createDoctor = async (req, res) => {
  const session = await Doctor.startSession();

  let temporaryPassword = null;
  let createdDoctorId = null;

  try {
    session.startTransaction();

    // =================================================
    // REQUEST BODY CHECK
    // =================================================

    if (
      !req.body ||
      Object.keys(req.body).length === 0
    ) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "Doctor data is required"
      );
    }

    // =================================================
    // REQUEST DATA
    // =================================================

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

    // =================================================
    // REQUIRED FIELDS
    // =================================================

    if (
      !firstName ||
      !String(firstName).trim()
    ) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "First name is required"
      );
    }

    if (
      !lastName ||
      !String(lastName).trim()
    ) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "Last name is required"
      );
    }

    if (
      !email ||
      !String(email).trim()
    ) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "Email is required"
      );
    }

    if (
      !phone ||
      !String(phone).trim()
    ) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "Phone number is required"
      );
    }

    if (!gender) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "Gender is required"
      );
    }

    if (!dateOfBirth) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "Date of birth is required"
      );
    }

    if (!specialization) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "Specialization is required"
      );
    }

    if (!department) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "Department is required"
      );
    }

    if (!qualification) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "Qualification is required"
      );
    }

    if (
      !licenseNumber ||
      !String(licenseNumber).trim()
    ) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "License number is required"
      );
    }

    // =================================================
    // NORMALIZE DATA
    // =================================================

    const cleanFirstName = String(firstName)
      .trim()
      .replace(/\s+/g, " ");

    const cleanLastName = String(lastName)
      .trim()
      .replace(/\s+/g, " ");

    const cleanEmail = String(email)
      .trim()
      .toLowerCase();

    const cleanPhone = String(phone).trim();

    const cleanLicenseNumber = String(
      licenseNumber
    ).trim();

    // =================================================
    // EMAIL VALIDATION
    // =================================================

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "Please provide a valid email address"
      );
    }

    // =================================================
    // PARSE SPECIALIZATION
    // =================================================

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
        await session.abortTransaction();

        return sendBadrequest(
          res,
          "Invalid specialization format"
        );
      }
    }

    if (
      !Array.isArray(parsedSpecialization) ||
      parsedSpecialization.length === 0
    ) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "Please select at least one specialization"
      );
    }

    parsedSpecialization =
      parsedSpecialization
        .map((item) =>
          String(item).trim()
        )
        .filter(Boolean);

    if (
      parsedSpecialization.length === 0
    ) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "Please select at least one specialization"
      );
    }

    // =================================================
    // PARSE QUALIFICATION
    // =================================================

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
        await session.abortTransaction();

        return sendBadrequest(
          res,
          "Invalid qualification format"
        );
      }
    }

    if (
      !Array.isArray(parsedQualification) ||
      parsedQualification.length === 0
    ) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "Please select at least one qualification"
      );
    }

    parsedQualification =
      parsedQualification
        .map((item) =>
          String(item).trim()
        )
        .filter(Boolean);

    if (
      parsedQualification.length === 0
    ) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "Please select at least one qualification"
      );
    }

    // =================================================
    // CHECK EXISTING DOCTOR EMAIL
    // =================================================

    const existingDoctor =
      await Doctor.findOne({
        email: cleanEmail,
      }).session(session);

    if (existingDoctor) {
      await session.abortTransaction();

      return sendConflict(
        res,
        "A doctor with this email already exists"
      );
    }

    // =================================================
    // CHECK EXISTING USER EMAIL
    // =================================================

    const existingUser =
      await User.findOne({
        email: cleanEmail,
      }).session(session);

    if (existingUser) {
      await session.abortTransaction();

      return sendConflict(
        res,
        "A user with this email already exists"
      );
    }

    // =================================================
    // CHECK DUPLICATE LICENSE
    // =================================================

    const existingLicense =
      await Doctor.findOne({
        licenseNumber: cleanLicenseNumber,
      }).session(session);

    if (existingLicense) {
      await session.abortTransaction();

      return sendConflict(
        res,
        "A doctor with this license number already exists"
      );
    }

    // =================================================
    // VALIDATE DEPARTMENT ID
    // =================================================

    if (
      !/^[0-9a-fA-F]{24}$/.test(
        String(department)
      )
    ) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "Invalid department ID"
      );
    }

    // =================================================
    // CHECK DEPARTMENT
    // =================================================

    const existingDepartment =
      await Departments.findById(
        department
      ).session(session);

    if (!existingDepartment) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "Selected department does not exist"
      );
    }

    // =================================================
    // PARSE AVAILABILITY
    // =================================================

    let parsedAvailability = [];

    if (availability) {
      if (Array.isArray(availability)) {
        parsedAvailability =
          availability;
      } else if (
        typeof availability === "string"
      ) {
        try {
          parsedAvailability =
            JSON.parse(availability);
        } catch (error) {
          await session.abortTransaction();

          return sendBadrequest(
            res,
            "Invalid availability format"
          );
        }
      }
    }

    if (
      !Array.isArray(parsedAvailability)
    ) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "Availability must be an array"
      );
    }

    // =================================================
    // VALID DAYS
    // =================================================

    const validDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    const usedDays = new Set();

    // =================================================
    // VALIDATE AVAILABILITY
    // =================================================

    for (
      const dayAvailability of
      parsedAvailability
    ) {
      if (
        !dayAvailability ||
        typeof dayAvailability !== "object"
      ) {
        await session.abortTransaction();

        return sendBadrequest(
          res,
          "Invalid availability data"
        );
      }

      const {
        day,
        hospital,
        video,
      } = dayAvailability;

      // =================================================
      // DAY VALIDATION
      // =================================================

      if (!validDays.includes(day)) {
        await session.abortTransaction();

        return sendBadrequest(
          res,
          `Invalid day: ${day}`
        );
      }

      // =================================================
      // DUPLICATE DAY
      // =================================================

      if (usedDays.has(day)) {
        await session.abortTransaction();

        return sendBadrequest(
          res,
          `${day} availability is added more than once`
        );
      }

      usedDays.add(day);

      // =================================================
      // CONSULTATION TYPES
      // =================================================

      const hospitalEnabled =
        hospital &&
        hospital.enabled === true;

      const videoEnabled =
        video &&
        video.enabled === true;

      if (
        !hospitalEnabled &&
        !videoEnabled
      ) {
        await session.abortTransaction();

        return sendBadrequest(
          res,
          `${day}: At least one consultation type must be enabled`
        );
      }

      // =================================================
      // HOSPITAL TIMING
      // =================================================

      if (hospitalEnabled) {
        if (
          !Array.isArray(
            hospital.slots
          ) ||
          hospital.slots.length === 0
        ) {
          await session.abortTransaction();

          return sendBadrequest(
            res,
            `${day}: Hospital timing is required`
          );
        }

        for (
          const slot of hospital.slots
        ) {
          if (
            !slot ||
            !slot.startTime ||
            !slot.endTime
          ) {
            await session.abortTransaction();

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
            await session.abortTransaction();

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
            await session.abortTransaction();

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
          await session.abortTransaction();

          return sendBadrequest(
            res,
            `${day}: Hospital timings cannot overlap`
          );
        }
      }

      // =================================================
      // VIDEO TIMING
      // =================================================

      if (videoEnabled) {
        if (
          !Array.isArray(
            video.slots
          ) ||
          video.slots.length === 0
        ) {
          await session.abortTransaction();

          return sendBadrequest(
            res,
            `${day}: Video consultation timing is required`
          );
        }

        for (
          const slot of video.slots
        ) {
          if (
            !slot ||
            !slot.startTime ||
            !slot.endTime
          ) {
            await session.abortTransaction();

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
            await session.abortTransaction();

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
            await session.abortTransaction();

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
          await session.abortTransaction();

          return sendBadrequest(
            res,
            `${day}: Video timings cannot overlap`
          );
        }
      }
    }

    // =================================================
    // NUMERIC VALUES
    // =================================================

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
        ? Number(
            appointmentDuration
          )
        : 30;

    // =================================================
    // NUMBER VALIDATION
    // =================================================

    if (
      !Number.isFinite(
        parsedExperience
      ) ||
      parsedExperience < 0
    ) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "Experience must be a valid positive number"
      );
    }

    if (
      !Number.isFinite(
        parsedConsultationFee
      ) ||
      parsedConsultationFee < 0
    ) {
      await session.abortTransaction();

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
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "Appointment duration must be 15, 30, 45 or 60 minutes"
      );
    }

    // =================================================
    // DATE OF BIRTH
    // =================================================

    const parsedDateOfBirth =
      new Date(dateOfBirth);

    if (
      Number.isNaN(
        parsedDateOfBirth.getTime()
      )
    ) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "Invalid date of birth"
      );
    }

    // =================================================
    // PROFILE IMAGE
    // =================================================

    let profileImage = "";

    if (req.file) {
      profileImage =
        `/uploads/doctors/${req.file.filename}`;
    }

    // =================================================
    // GENERATE TEMPORARY PASSWORD
    // =================================================

    temporaryPassword =
      crypto
        .randomBytes(8)
        .toString("base64url") +
      "@A1";

    // =================================================
    // HASH PASSWORD
    // =================================================

    const hashedPassword =
      await bcrypt.hash(
        temporaryPassword,
        12
      );

    // =================================================
    // CREATE USER ACCOUNT
    // =================================================

    const user = new User({
      name:
        `${cleanFirstName} ${cleanLastName}`,

      email:
        cleanEmail,

      password:
        hashedPassword,

      role:
        "doctor",

      isActive:
        true,
    });

    await user.save({
      session,
    });

    // =================================================
    // CREATE DOCTOR
    // =================================================

    const doctor = new Doctor({
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

      specialization:
        parsedSpecialization,

      department,

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

      status:
        true,

      address: {
        fullAddress:
          fullAddress
            ? String(fullAddress).trim()
            : "",

        city:
          city
            ? String(city).trim()
            : "",

        state:
          state
            ? String(state).trim()
            : "",

        pincode:
          pincode
            ? String(pincode).trim()
            : "",
      },
    });

    await doctor.save({
      session,
    });

    createdDoctorId =
      doctor._id;

    // =================================================
    // COMMIT TRANSACTION
    // =================================================

    await session.commitTransaction();

    // =================================================
    // SEND CREDENTIALS EMAIL
    // =================================================

    let emailStatus = {
      sent: false,
      messageId: null,
    };

    try {
      const emailResult =
        await sendDoctorCredentialsEmail(
          cleanEmail,
          `${cleanFirstName} ${cleanLastName}`,
          temporaryPassword
        );

      emailStatus = {
        sent: true,
        messageId:
          emailResult?.messageId || null,
      };

      console.log(
        "=========================================="
      );

      console.log(
        "DOCTOR ACCOUNT EMAIL SENT"
      );

      console.log(
        "Doctor:",
        `${cleanFirstName} ${cleanLastName}`
      );

      console.log(
        "Email:",
        cleanEmail
      );

      console.log(
        "Message ID:",
        emailResult?.messageId || "N/A"
      );

      console.log(
        "=========================================="
      );
    } catch (emailError) {
      console.error(
        "=========================================="
      );

      console.error(
        "DOCTOR CREATED BUT EMAIL FAILED"
      );

      console.error(
        "Doctor ID:",
        createdDoctorId
      );

      console.error(
        "Email:",
        cleanEmail
      );

      console.error(
        "Email Error:",
        emailError.message
      );

      console.error(
        "=========================================="
      );
    }

    // =================================================
    // FETCH CREATED DOCTOR
    // =================================================

    const createdDoctor =
      await Doctor.findById(
        createdDoctorId
      ).populate(
        "department",
        "name code"
      );

    if (!createdDoctor) {
      return sendServerError(
        res,
        "Doctor was created but could not be retrieved"
      );
    }

    // =================================================
    // SUCCESS RESPONSE
    // =================================================

    return sendcreated(
      res,

      emailStatus.sent
        ? "Doctor created successfully and login credentials have been sent to the doctor's email"
        : "Doctor created successfully, but the login credentials email could not be sent",

      {
        doctor:
          createdDoctor,

        email: {
          sent:
            emailStatus.sent,

          messageId:
            emailStatus.messageId,
        },
      }
    );
  } catch (error) {
    // =================================================
    // ABORT TRANSACTION
    // =================================================

    if (
      session.inTransaction()
    ) {
      await session.abortTransaction();
    }

    // =================================================
    // ERROR LOG
    // =================================================

    console.error(
      "=========================================="
    );

    console.error(
      "CREATE DOCTOR ERROR"
    );

    console.error(
      "Name:",
      error.name
    );

    console.error(
      "Message:",
      error.message
    );

    console.error(
      "Code:",
      error.code
    );

    console.error(
      "=========================================="
    );

    // =================================================
    // DUPLICATE KEY
    // =================================================

    if (
      error.code === 11000
    ) {
      const duplicateFields =
        Object.keys(
          error.keyPattern ||
          error.keyValue ||
          {}
        );

      if (
        duplicateFields.includes(
          "licenseNumber"
        )
      ) {
        return sendConflict(
          res,
          "A doctor with this license number already exists"
        );
      }

      if (
        duplicateFields.includes(
          "email"
        )
      ) {
        return sendConflict(
          res,
          "A user or doctor with this email already exists"
        );
      }

      return sendConflict(
        res,
        "Doctor with the provided information already exists"
      );
    }

    // =================================================
    // MONGOOSE VALIDATION ERROR
    // =================================================

    if (
      error.name ===
      "ValidationError"
    ) {
      const messages =
        Object.values(
          error.errors
        )
          .map(
            (err) =>
              err.message
          )
          .filter(Boolean);

      return sendBadrequest(
        res,
        messages.length > 0
          ? messages.join(", ")
          : "Invalid doctor data"
      );
    }

    // =================================================
    // CAST ERROR
    // =================================================

    if (
      error.name ===
      "CastError"
    ) {
      return sendBadrequest(
        res,
        `Invalid ${error.path}`
      );
    }

    // =================================================
    // JSON ERROR
    // =================================================

    if (
      error instanceof
      SyntaxError
    ) {
      return sendBadrequest(
        res,
        "Invalid JSON data"
      );
    }

    // =================================================
    // SERVER ERROR
    // =================================================

    return sendServerError(
      res,
      error.message ||
        "Failed to create doctor"
    );
  } finally {
    await session.endSession();
  }
};
 


const getAllDoctors = async (
  req,
  res
) => {
  try {
    // =================================================
    // QUERY VALIDATION
    // =================================================

    if (
      req.query &&
      typeof req.query !==
        "object"
    ) {
      return sendBadrequest(
        res,
        "Invalid request query"
      );
    }

    // =================================================
    // FETCH DOCTORS
    // =================================================

    const doctors =
      await Doctor.find()
        .populate(
          "department",
          "name code"
        )
        .sort({
          createdAt: -1,
        })
        .lean();

    // =================================================
    // RESPONSE VALIDATION
    // =================================================

    if (
      !Array.isArray(doctors)
    ) {
      return sendServerError(
        res,
        "Invalid doctors data received from database"
      );
    }

    // =================================================
    // SUCCESS
    // =================================================

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

    if (
      error.name ===
      "CastError"
    ) {
      return sendBadrequest(
        res,
        `Invalid ${error.path}`
      );
    }

    if (
      error.name ===
      "ValidationError"
    ) {
      const messages =
        Object.values(
          error.errors
        )
          .map(
            (err) =>
              err.message
          )
          .filter(Boolean);

      return sendBadrequest(
        res,
        messages.join(", ")
      );
    }

    return sendServerError(
      res,
      error.message ||
        "Failed to fetch doctors"
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
    const {
      id,
    } = req.params;

    if (
      !id ||
      !/^[0-9a-fA-F]{24}$/.test(id)
    ) {
      return sendBadrequest(
        res,
        "Invalid doctor ID"
      );
    }

    const doctor =
      await Doctor.findById(
        id
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
      error.message ||
        "Failed to fetch doctor"
    );
  }
};

// =====================================================
// UPDATE DOCTOR STATUS
// =====================================================

const updateDoctorStatus =
  async (
    req,
    res
  ) => {
    try {
      const {
        id,
      } = req.params;

      const {
        status,
      } = req.body;

      if (
        !id ||
        !/^[0-9a-fA-F]{24}$/.test(id)
      ) {
        return sendBadrequest(
          res,
          "Invalid doctor ID"
        );
      }

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
          id,
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
        error.message ||
          "Failed to update doctor status"
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
    const {
      id,
    } = req.params;

    if (
      !id ||
      !/^[0-9a-fA-F]{24}$/.test(id)
    ) {
      return sendBadrequest(
        res,
        "Invalid doctor ID"
      );
    }

    const doctor =
      await Doctor.findByIdAndDelete(
        id
      );

    if (!doctor) {
      return sendNotfound(
        res,
        "Doctor not found"
      );
    }

    // =================================================
    // DELETE LINKED USER ACCOUNT
    // =================================================

    await User.findOneAndDelete({
      email: doctor.email,
      role: "doctor",
    });

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
      error.message ||
        "Failed to delete doctor"
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




 