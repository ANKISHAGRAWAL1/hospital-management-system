const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const mongoose = require("mongoose");

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

// =====================================================
// TIME HELPERS
// =====================================================

const isValidTime = (time) => {
  if (typeof time !== "string") {
    return false;
  }

  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(
    time.trim()
  );
};

const timeToMinutes = (time) => {
  if (!isValidTime(time)) {
    return null;
  }

  const [hours, minutes] = time
    .trim()
    .split(":")
    .map(Number);

  return hours * 60 + minutes;
};

const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(
    mins
  ).padStart(2, "0")}`;
};

// =====================================================
// GENERATE APPOINTMENT SLOTS
// =====================================================

const generateAppointmentSlots = (
  startTime,
  endTime,
  duration
) => {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  if (
    start === null ||
    end === null ||
    !Number.isFinite(duration) ||
    duration <= 0 ||
    end <= start
  ) {
    return [];
  }

  const slots = [];

  let current = start;

  while (current + duration <= end) {
    const slotStart = minutesToTime(current);
    const slotEnd = minutesToTime(
      current + duration
    );

    slots.push({
      startTime: slotStart,
      endTime: slotEnd,
    });

    current += duration;
  }

  return slots;
};

// =====================================================
// NORMALIZE CONSULTATION SLOTS
// =====================================================

const normalizeConsultationSlots = (
  slots,
  duration
) => {
  if (!Array.isArray(slots)) {
    return [];
  }

  const normalizedSlots = [];

  for (const slot of slots) {
    if (
      !slot ||
      !slot.startTime ||
      !slot.endTime
    ) {
      continue;
    }

    const startTime = String(
      slot.startTime
    ).trim();

    const endTime = String(
      slot.endTime
    ).trim();

    if (
      !isValidTime(startTime) ||
      !isValidTime(endTime)
    ) {
      continue;
    }

    const start = timeToMinutes(
      startTime
    );

    const end = timeToMinutes(
      endTime
    );

    if (end <= start) {
      continue;
    }

    const totalMinutes = end - start;

    if (
      totalMinutes % duration !== 0
    ) {
      continue;
    }

    const generatedSlots =
      generateAppointmentSlots(
        startTime,
        endTime,
        duration
      );

    normalizedSlots.push(
      ...generatedSlots
    );
  }

  return normalizedSlots;
};

// =====================================================
// REMOVE DUPLICATE SLOTS
// =====================================================

const removeDuplicateSlots = (
  slots
) => {
  const seen = new Set();

  return slots.filter((slot) => {
    const key = `${slot.startTime}-${slot.endTime}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);

    return true;
  });
};

// =====================================================
// SORT SLOTS
// =====================================================

const sortSlots = (slots) => {
  return [...slots].sort(
    (a, b) =>
      timeToMinutes(a.startTime) -
      timeToMinutes(b.startTime)
  );
};

// =====================================================
// CHECK OVERLAPPING SLOTS
// =====================================================

const hasOverlappingSlots = (slots) => {
  if (
    !Array.isArray(slots) ||
    slots.length < 2
  ) {
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
    const previousSlot =
      sortedSlots[i - 1];

    const currentSlot =
      sortedSlots[i];

    if (
      timeToMinutes(
        currentSlot.startTime
      ) <
      timeToMinutes(
        previousSlot.endTime
      )
    ) {
      return true;
    }
  }

  return false;
};

// =====================================================
// CHECK APPOINTMENT DURATION
// =====================================================

const isDurationValid = (
  startTime,
  endTime,
  duration
) => {
  const start =
    timeToMinutes(startTime);

  const end =
    timeToMinutes(endTime);

  if (
    start === null ||
    end === null
  ) {
    return false;
  }

  const totalMinutes = end - start;

  if (totalMinutes <= 0) {
    return false;
  }

  return (
    totalMinutes % duration === 0
  );
};

// =====================================================
// NORMALIZE FULL AVAILABILITY
// =====================================================

const normalizeAvailability = (
  availability,
  duration
) => {
  if (
    !Array.isArray(availability)
  ) {
    return [];
  }

  return availability.map(
    (dayAvailability) => {
      if (
        !dayAvailability ||
        typeof dayAvailability !==
          "object"
      ) {
        return dayAvailability;
      }

      const result = {
        ...dayAvailability,
      };

      if (
        dayAvailability.hospital &&
        dayAvailability.hospital.enabled ===
          true
      ) {
        result.hospital = {
          ...dayAvailability.hospital,
          slots: sortSlots(
            removeDuplicateSlots(
              normalizeConsultationSlots(
                dayAvailability.hospital
                  .slots,
                duration
              )
            )
          ),
        };
      }

      if (
        dayAvailability.video &&
        dayAvailability.video.enabled ===
          true
      ) {
        result.video = {
          ...dayAvailability.video,
          slots: sortSlots(
            removeDuplicateSlots(
              normalizeConsultationSlots(
                dayAvailability.video
                  .slots,
                duration
              )
            )
          ),
        };
      }

      return result;
    }
  );
};

// =====================================================
// VALIDATE AND NORMALIZE AVAILABILITY
// =====================================================

const validateAndNormalizeAvailability =
  (
    parsedAvailability,
    duration
  ) => {
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

    if (
      !Array.isArray(
        parsedAvailability
      )
    ) {
      throw new Error(
        "Availability must be an array"
      );
    }

    const normalizedAvailability =
      [];

    for (const dayAvailability of parsedAvailability) {
      if (
        !dayAvailability ||
        typeof dayAvailability !==
          "object"
      ) {
        throw new Error(
          "Invalid availability data"
        );
      }

      const {
        day,
        hospital,
        video,
      } = dayAvailability;

      if (!validDays.includes(day)) {
        throw new Error(
          `Invalid day: ${day}`
        );
      }

      if (usedDays.has(day)) {
        throw new Error(
          `${day} availability is added more than once`
        );
      }

      usedDays.add(day);

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
        throw new Error(
          `${day}: At least one consultation type must be enabled`
        );
      }

      const normalizedDay = {
        day,
      };

      // =================================================
      // HOSPITAL
      // =================================================

      if (hospitalEnabled) {
        if (
          !Array.isArray(
            hospital.slots
          ) ||
          hospital.slots.length === 0
        ) {
          throw new Error(
            `${day}: Hospital timing is required`
          );
        }

        for (const slot of hospital.slots) {
          if (
            !slot ||
            !slot.startTime ||
            !slot.endTime
          ) {
            throw new Error(
              `${day}: Hospital start time and end time are required`
            );
          }

          const startTime =
            String(
              slot.startTime
            ).trim();

          const endTime =
            String(
              slot.endTime
            ).trim();

          if (
            !isValidTime(
              startTime
            ) ||
            !isValidTime(endTime)
          ) {
            throw new Error(
              `${day}: Invalid hospital timing format. Use HH:mm`
            );
          }

          if (
            timeToMinutes(
              startTime
            ) >=
            timeToMinutes(
              endTime
            )
          ) {
            throw new Error(
              `${day}: Hospital end time must be greater than start time`
            );
          }

          if (
            !isDurationValid(
              startTime,
              endTime,
              duration
            )
          ) {
            throw new Error(
              `${day}: Hospital timing from ${startTime} to ${endTime} must be exactly divisible by the ${duration}-minute appointment duration`
            );
          }
        }

        const generatedHospitalSlots =
          sortSlots(
            removeDuplicateSlots(
              normalizeConsultationSlots(
                hospital.slots,
                duration
              )
            )
          );

        if (
          generatedHospitalSlots.length ===
          0
        ) {
          throw new Error(
            `${day}: No valid hospital appointment slots could be generated`
          );
        }

        if (
          hasOverlappingSlots(
            generatedHospitalSlots
          )
        ) {
          throw new Error(
            `${day}: Hospital timings cannot overlap`
          );
        }

        normalizedDay.hospital = {
          ...hospital,
          slots:
            generatedHospitalSlots,
        };
      }

      // =================================================
      // VIDEO
      // =================================================

      if (videoEnabled) {
        if (
          !Array.isArray(
            video.slots
          ) ||
          video.slots.length === 0
        ) {
          throw new Error(
            `${day}: Video consultation timing is required`
          );
        }

        for (const slot of video.slots) {
          if (
            !slot ||
            !slot.startTime ||
            !slot.endTime
          ) {
            throw new Error(
              `${day}: Video start time and end time are required`
            );
          }

          const startTime =
            String(
              slot.startTime
            ).trim();

          const endTime =
            String(
              slot.endTime
            ).trim();

          if (
            !isValidTime(
              startTime
            ) ||
            !isValidTime(endTime)
          ) {
            throw new Error(
              `${day}: Invalid video timing format. Use HH:mm`
            );
          }

          if (
            timeToMinutes(
              startTime
            ) >=
            timeToMinutes(
              endTime
            )
          ) {
            throw new Error(
              `${day}: Video end time must be greater than start time`
            );
          }

          if (
            !isDurationValid(
              startTime,
              endTime,
              duration
            )
          ) {
            throw new Error(
              `${day}: Video timing from ${startTime} to ${endTime} must be exactly divisible by the ${duration}-minute appointment duration`
            );
          }
        }

        const generatedVideoSlots =
          sortSlots(
            removeDuplicateSlots(
              normalizeConsultationSlots(
                video.slots,
                duration
              )
            )
          );

        if (
          generatedVideoSlots.length ===
          0
        ) {
          throw new Error(
            `${day}: No valid video appointment slots could be generated`
          );
        }

        if (
          hasOverlappingSlots(
            generatedVideoSlots
          )
        ) {
          throw new Error(
            `${day}: Video timings cannot overlap`
          );
        }

        normalizedDay.video = {
          ...video,
          slots:
            generatedVideoSlots,
        };
      }

      normalizedAvailability.push(
        normalizedDay
      );
    }

    return normalizedAvailability;
  };

// =====================================================
// PREPARE DOCTOR RESPONSE
// =====================================================

const prepareDoctorResponse = (
  doctor
) => {
  if (!doctor) {
    return doctor;
  }

  const doctorObject =
    typeof doctor.toObject ===
    "function"
      ? doctor.toObject()
      : {
          ...doctor,
        };

  const duration =
    Number(
      doctorObject.appointmentDuration
    ) || 30;

  if (
    Array.isArray(
      doctorObject.availability
    )
  ) {
    doctorObject.availability =
      normalizeAvailability(
        doctorObject.availability,
        duration
      );
  }

  return doctorObject;
};

// =====================================================
// CREATE DOCTOR
// =====================================================

const createDoctor = async (req, res) => {
  const session = await Doctor.startSession();

  let temporaryPassword = null;
  let createdDoctorId = null;

  try {
    session.startTransaction();

    // =================================================
    // REQUEST VALIDATION
    // =================================================

    if (!req.body || Object.keys(req.body).length === 0) {
      await session.abortTransaction();

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

    // =================================================
    // REQUIRED FIELDS
    // =================================================

    if (!firstName || !String(firstName).trim()) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "First name is required"
      );
    }

    if (!lastName || !String(lastName).trim()) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "Last name is required"
      );
    }

    if (!email || !String(email).trim()) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "Email is required"
      );
    }

    if (!phone || !String(phone).trim()) {
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

    if (!licenseNumber || !String(licenseNumber).trim()) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "License number is required"
      );
    }

    // =================================================
    // CLEAN DATA
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
        "Please enter a valid email address"
      );
    }

    // =================================================
    // APPOINTMENT DURATION
    // =================================================

    const parsedAppointmentDuration =
      appointmentDuration !== undefined &&
      appointmentDuration !== ""
        ? Number(appointmentDuration)
        : 30;

    if (
      !Number.isFinite(
        parsedAppointmentDuration
      )
    ) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "Appointment duration must be a valid number"
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
    // SPECIALIZATION
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

    parsedSpecialization = parsedSpecialization
      .map((item) => String(item).trim())
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
    // QUALIFICATION
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

    parsedQualification = parsedQualification
      .map((item) => String(item).trim())
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
    // EXISTING DOCTOR EMAIL
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
    // EXISTING USER EMAIL
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
    // DUPLICATE LICENSE
    // =================================================

    const existingLicense =
      await Doctor.findOne({
        licenseNumber:
          cleanLicenseNumber,
      }).session(session);

    if (existingLicense) {
      await session.abortTransaction();

      return sendConflict(
        res,
        "A doctor with this license number already exists"
      );
    }

    // =================================================
    // DEPARTMENT ID
    // =================================================

    if (
      !mongoose.isValidObjectId(
        department
      )
    ) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "Invalid department ID"
      );
    }

    // =================================================
    // DEPARTMENT
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

    if (
      existingDepartment.status === false
    ) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "Selected department is currently inactive"
      );
    }

    // =================================================
    // AVAILABILITY PARSE
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
            JSON.parse(
              availability
            );
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
    // VALIDATE AVAILABILITY
    // =================================================

    let normalizedAvailability;

    try {
      normalizedAvailability =
        validateAndNormalizeAvailability(
          parsedAvailability,
          parsedAppointmentDuration
        );
    } catch (availabilityError) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        availabilityError.message ||
          "Invalid doctor availability"
      );
    }

    // =================================================
    // EXPERIENCE
    // =================================================

    const parsedExperience =
      experience !== undefined &&
      experience !== ""
        ? Number(experience)
        : 0;

    if (
      !Number.isFinite(
        parsedExperience
      ) ||
      parsedExperience < 0
    ) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "Experience must be zero or a positive number"
      );
    }

    // =================================================
    // CONSULTATION FEE
    // =================================================

    const parsedConsultationFee =
      consultationFee !== undefined &&
      consultationFee !== ""
        ? Number(
            consultationFee
          )
        : 0;

    if (
      !Number.isFinite(
        parsedConsultationFee
      ) ||
      parsedConsultationFee < 0
    ) {
      await session.abortTransaction();

      return sendBadrequest(
        res,
        "Consultation fee must be zero or a positive number"
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
        "Please provide a valid date of birth"
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
    // TEMPORARY PASSWORD
    // =================================================

    temporaryPassword =
      crypto
        .randomBytes(8)
        .toString("base64url") +
      "@A1";

    const hashedPassword =
      await bcrypt.hash(
        temporaryPassword,
        12
      );

    // =================================================
    // CREATE USER
    // =================================================

    const user = new User({
      name: `${cleanFirstName} ${cleanLastName}`,

      email: cleanEmail,

      password: hashedPassword,

      role: "doctor",

      isActive: true,
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
        normalizedAvailability,

      appointmentDuration:
        parsedAppointmentDuration,

      status: true,

      address: {
        fullAddress: fullAddress
          ? String(
              fullAddress
            ).trim()
          : "",

        city: city
          ? String(city).trim()
          : "",

        state: state
          ? String(state).trim()
          : "",

        pincode: pincode
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
    // COMMIT
    // =================================================

    await session.commitTransaction();

    // =================================================
    // SEND EMAIL
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
          emailResult?.messageId ||
          null,
      };
    } catch (emailError) {
      // Email failure should NOT
      // make doctor creation fail.

      console.error(
        "Doctor created but email sending failed:",
        emailError.message
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
    // SUCCESS
    // =================================================

    return sendcreated(
      res,

      emailStatus.sent
        ? "Doctor created successfully and login credentials have been sent to the doctor's email"
        : "Doctor created successfully, but the login credentials email could not be sent",

      {
        doctor:
          prepareDoctorResponse(
            createdDoctor
          ),

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
    // TRANSACTION ROLLBACK
    // =================================================

    if (
      session.inTransaction()
    ) {
      await session.abortTransaction();
    }

    // =================================================
    // DUPLICATE KEY
    // =================================================

    if (error.code === 11000) {
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
    // MONGOOSE VALIDATION
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
        messages.length
          ? messages.join(", ")
          : "Please check the doctor information"
      );
    }

    // =================================================
    // INVALID OBJECT ID
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
    // INVALID JSON
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
    // UNEXPECTED SERVER ERROR
    // =================================================

    console.error(
      "Create doctor server error:",
      error
    );

    return sendServerError(
      res,
      "Unable to create doctor. Please try again."
    );
  } finally {
    await session.endSession();
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

    if (
      !Array.isArray(doctors)
    ) {
      return sendServerError(
        res,
        "Invalid doctors data received from database"
      );
    }

    const normalizedDoctors =
      doctors.map(
        (doctor) =>
          prepareDoctorResponse(
            doctor
          )
      );

    return sendsuccess(
      res,
      "Doctors fetched successfully",
      normalizedDoctors
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
    const { id } =
      req.params;

    if (
      !id ||
      !mongoose.isValidObjectId(id)
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
      prepareDoctorResponse(
        doctor
      )
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
      const { id } =
        req.params;

      const { status } =
        req.body;

      if (
        !id ||
        !mongoose.isValidObjectId(
          id
        )
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
        status
          ? "Doctor is now available for appointments"
          : "Doctor is now unavailable for appointments",
        prepareDoctorResponse(
          doctor
        )
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
    const { id } =
      req.params;

    if (
      !id ||
      !mongoose.isValidObjectId(id)
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
// EXPORT
// =====================================================

module.exports = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctorStatus,
  deleteDoctor,
};