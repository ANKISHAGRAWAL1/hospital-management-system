const jwt = require("jsonwebtoken");
const User = require("../models/user");
const PatientOtp = require("../models/PatientOtp");
const { sendOtpEmail } = require("../serivices/emailService");

// ======================================================
// CONSTANTS
// ======================================================

const OTP_EXPIRY_MINUTES = 5;
const MAX_OTP_ATTEMPTS = 5;
const JWT_EXPIRES_IN = "7d";

// ======================================================
// GENERATE 6 DIGIT OTP
// ======================================================

const generateOtp = () => {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
};

// ======================================================
// OTP EXPIRY
// ======================================================

const getOtpExpiry = () => {
  return new Date(
    Date.now() +
      OTP_EXPIRY_MINUTES * 60 * 1000
  );
};

// ======================================================
// EMAIL VALIDATION
// ======================================================

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );
};

// ======================================================
// CLEAN EMAIL
// ======================================================

const normalizeEmail = (email) => {
  return email.toLowerCase().trim();
};

// ======================================================
// SEND PATIENT OTP
// POST /api/auth/patient/send-otp
// PUBLIC
// ======================================================

const sendPatientOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (
      !email ||
      typeof email !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const cleanEmail =
      normalizeEmail(email);

    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid email address",
      });
    }

    const existingUser =
      await User.findOne({
        email: cleanEmail,
      }).select(
        "_id role isActive"
      );

    if (
      existingUser &&
      existingUser.role !== "patient"
    ) {
      return res.status(409).json({
        success: false,
        message:
          "This email is already registered with another account",
      });
    }

    if (
      existingUser &&
      existingUser.role === "patient" &&
      existingUser.isActive === false
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Your account is inactive. Please contact hospital.",
      });
    }

    const otp = generateOtp();

    await PatientOtp.deleteMany({
      email: cleanEmail,
    });

    await PatientOtp.create({
      email: cleanEmail,
      otp,
      expiresAt: getOtpExpiry(),
      attempts: 0,
    });

    try {
      await sendOtpEmail(
        cleanEmail,
        otp
      );
    } catch (emailError) {
      await PatientOtp.deleteMany({
        email: cleanEmail,
      });

      console.error(
        "PATIENT OTP EMAIL ERROR:",
        emailError
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to send OTP. Please try again later.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "OTP sent successfully to your email",
    });
  } catch (error) {
    console.error(
      "SEND PATIENT OTP ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while sending OTP",
    });
  }
};

// ======================================================
// VERIFY PATIENT OTP
// POST /api/auth/patient/verify-otp
// PUBLIC
// ======================================================

const verifyPatientOtp = async (
  req,
  res
) => {
  try {
    const { email, otp } =
      req.body;

    if (
      !email ||
      typeof email !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const cleanEmail =
      normalizeEmail(email);

    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid email address",
      });
    }

    if (
      otp === undefined ||
      otp === null ||
      otp === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      });
    }

    const cleanOtp =
      String(otp).trim();

    if (
      !/^\d{6}$/.test(cleanOtp)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "OTP must be a 6 digit number",
      });
    }

    const otpRecord =
      await PatientOtp.findOne({
        email: cleanEmail,
      });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message:
          "OTP not found or already used. Please request a new OTP.",
      });
    }

    if (
      otpRecord.expiresAt <=
      new Date()
    ) {
      await PatientOtp.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(400).json({
        success: false,
        message:
          "OTP has expired. Please request a new OTP.",
      });
    }

    if (
      otpRecord.attempts >=
      MAX_OTP_ATTEMPTS
    ) {
      await PatientOtp.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(429).json({
        success: false,
        message:
          "Too many incorrect attempts. Please request a new OTP.",
      });
    }

    if (
      otpRecord.otp !== cleanOtp
    ) {
      otpRecord.attempts += 1;

      await otpRecord.save();

      const remainingAttempts =
        MAX_OTP_ATTEMPTS -
        otpRecord.attempts;

      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
        remainingAttempts,
      });
    }

    // ==================================================
    // OTP CORRECT
    // ==================================================

    let patient =
      await User.findOne({
        email: cleanEmail,
        role: "patient",
      });

    // ==================================================
    // EXISTING PATIENT
    // ==================================================

    if (patient) {
      if (
        patient.isActive === false
      ) {
        await PatientOtp.deleteOne({
          _id: otpRecord._id,
        });

        return res.status(403).json({
          success: false,
          message:
            "Your account is inactive. Please contact hospital.",
        });
      }

      if (!process.env.JWT_SECRET) {
        console.error(
          "JWT_SECRET is missing in .env"
        );

        return res.status(500).json({
          success: false,
          message:
            "Server configuration error",
        });
      }

      const token =
        jwt.sign(
          {
            id: patient._id,
            role: patient.role,
          },
          process.env.JWT_SECRET,
          {
            expiresIn:
              JWT_EXPIRES_IN,
          }
        );

      res.cookie(
        "token",
        token,
        {
          httpOnly: true,
          secure:
            process.env.NODE_ENV ===
            "production",
          sameSite:
            process.env.NODE_ENV ===
            "production"
              ? "none"
              : "lax",
          maxAge:
            7 *
            24 *
            60 *
            60 *
            1000,
        }
      );

      await PatientOtp.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(200).json({
        success: true,
        message:
          "Patient login successful",

        isNewPatient: false,
        requiresProfile: false,

        patient: {
          id: patient._id,
          _id: patient._id,
          name: patient.name,
          email: patient.email,
          phone: patient.phone,
          dateOfBirth:
            patient.dateOfBirth,
          role: patient.role,
          isActive:
            patient.isActive,
          isDependent:
            patient.isDependent ||
            false,
        },
      });
    }

    // ==================================================
    // CHECK OTHER USER ROLE
    // ==================================================

    const existingUser =
      await User.findOne({
        email: cleanEmail,
      });

    if (existingUser) {
      await PatientOtp.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(409).json({
        success: false,
        message:
          "This email is already registered with another account",
      });
    }

    // ==================================================
    // JWT SECRET CHECK
    // ==================================================

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is missing in .env"
      );

      return res.status(500).json({
        success: false,
        message:
          "Server configuration error",
      });
    }

    // ==================================================
    // CREATE SIGNUP TOKEN
    // ==================================================

    const signupToken =
      jwt.sign(
        {
          email: cleanEmail,
          purpose:
            "patient-signup",
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "10m",
        }
      );

    await PatientOtp.deleteOne({
      _id: otpRecord._id,
    });

    return res.status(200).json({
      success: true,
      message:
        "OTP verified. Please complete your profile.",

      isNewPatient: true,
      requiresProfile: true,

      signupToken,

      email: cleanEmail,
    });
  } catch (error) {
    console.error(
      "VERIFY PATIENT OTP ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while verifying OTP",
    });
  }
};

// ======================================================
// GET LOGGED-IN PATIENT
// GET /api/auth/patient/me
// PROTECTED
// ======================================================

const getPatientMe = async (
  req,
  res
) => {
  try {
    const patient =
      await User.findOne({
        _id: req.user.id,
        role: "patient",
      }).select("-password");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message:
          "Patient not found",
      });
    }

    if (
      patient.isActive === false
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Your account is inactive. Please contact hospital.",
      });
    }

    return res.status(200).json({
      success: true,
      patient,
    });
  } catch (error) {
    console.error(
      "GET PATIENT ME ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================================
// GET MY PATIENTS
// GET /api/auth/patient/my-patients
// PROTECTED
// ======================================================

const getMyPatients = async (
  req,
  res
) => {
  try {
    const loggedInPatient =
      await User.findOne({
        _id: req.user.id,
        role: "patient",
      }).select(
        "_id name email phone dateOfBirth role isActive isDependent parentPatient"
      );

    if (!loggedInPatient) {
      return res.status(404).json({
        success: false,
        message:
          "Logged-in patient not found",
      });
    }

    if (
      loggedInPatient.isActive ===
      false
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Your account is inactive. Please contact hospital.",
      });
    }

    // ==================================================
    // GET LOGGED-IN PATIENT + DEPENDENTS
    // ==================================================

    const patients =
      await User.find({
        role: "patient",
        isActive: true,

        $or: [
          {
            _id: req.user.id,
          },
          {
            parentPatient:
              req.user.id,
          },
          {
            addedBy:
              req.user.id,
          },
        ],
      })
        .select(
          "_id name email phone dateOfBirth role isActive isDependent parentPatient addedBy"
        )
        .sort({
          createdAt: 1,
        });

    return res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    console.error(
      "GET MY PATIENTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching patients",
    });
  }
};

// ======================================================
// PATIENT LOGOUT
// POST /api/auth/patient/logout
// PROTECTED
// ======================================================

const patientLogout = async (
  req,
  res
) => {
  try {
    res.clearCookie(
      "token",
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite:
          process.env.NODE_ENV ===
          "production"
            ? "none"
            : "lax",
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Patient logout successful",
    });
  } catch (error) {
    console.error(
      "PATIENT LOGOUT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error during patient logout",
    });
  }
};

// ======================================================
// COMPLETE FIRST-TIME PATIENT PROFILE
// POST /api/auth/patient/complete-profile
// PUBLIC WITH SIGNUP TOKEN
// ======================================================

const completePatientProfile =
  async (req, res) => {
    try {
      const {
        signupToken,
        name,
        email,
        dateOfBirth,
        phone,
      } = req.body;

      // ==================================================
      // VALIDATION
      // ==================================================

      if (
        !signupToken ||
        typeof signupToken !== "string"
      ) {
        return res.status(401).json({
          success: false,
          message:
            "Signup session expired. Please request OTP again.",
        });
      }

      if (
        !name ||
        !name.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Full name is required",
        });
      }

      if (
        !email ||
        !email.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Email is required",
        });
      }

      if (!dateOfBirth) {
        return res.status(400).json({
          success: false,
          message:
            "Date of birth is required",
        });
      }

      if (
        !phone ||
        !phone.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Mobile number is required",
        });
      }

      const cleanEmail =
        normalizeEmail(email);

      const cleanPhone =
        phone.replace(
          /\D/g,
          ""
        );

      if (
        !isValidEmail(cleanEmail)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please enter a valid email address",
        });
      }

      if (
        cleanPhone.length !== 10
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please enter a valid 10 digit mobile number",
        });
      }

      // ==================================================
      // VERIFY SIGNUP TOKEN
      // ==================================================

      let decoded;

      try {
        decoded =
          jwt.verify(
            signupToken,
            process.env.JWT_SECRET
          );
      } catch (error) {
        return res.status(401).json({
          success: false,
          message:
            "Signup session expired. Please request OTP again.",
        });
      }

      if (
        decoded.purpose !==
        "patient-signup"
      ) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid signup session",
        });
      }

      // ==================================================
      // VERIFIED EMAIL HAS PRIORITY
      // ==================================================

      const finalEmail =
        decoded.email
          ? normalizeEmail(
              decoded.email
            )
          : cleanEmail;

      // ==================================================
      // CHECK EXISTING EMAIL
      // ==================================================

      const existingUser =
        await User.findOne({
          email: finalEmail,
        });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message:
            "This email is already registered",
        });
      }

      // ==================================================
      // VALIDATE DOB
      // ==================================================

      const dob =
        new Date(dateOfBirth);

      if (
        Number.isNaN(
          dob.getTime()
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid date of birth",
        });
      }

      const today =
        new Date();

      today.setHours(
        0,
        0,
        0,
        0
      );

      dob.setHours(
        0,
        0,
        0,
        0
      );

      if (dob > today) {
        return res.status(400).json({
          success: false,
          message:
            "Date of birth cannot be in the future",
        });
      }

      // ==================================================
      // CREATE MAIN PATIENT
      // ==================================================

      const patient =
        await User.create({
          name: name.trim(),
          email: finalEmail,
          phone: cleanPhone,
          dateOfBirth: dob,

          password:
            `otp-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 10)}`,

          role: "patient",
          isActive: true,

          isDependent: false,
          parentPatient: null,
          addedBy: null,
        });

      // ==================================================
      // LOGIN NEW PATIENT
      // ==================================================

      const token =
        jwt.sign(
          {
            id: patient._id,
            role: patient.role,
          },
          process.env.JWT_SECRET,
          {
            expiresIn:
              JWT_EXPIRES_IN,
          }
        );

      res.cookie(
        "token",
        token,
        {
          httpOnly: true,
          secure:
            process.env.NODE_ENV ===
            "production",
          sameSite:
            process.env.NODE_ENV ===
            "production"
              ? "none"
              : "lax",
          maxAge:
            7 *
            24 *
            60 *
            60 *
            1000,
        }
      );

      return res.status(201).json({
        success: true,
        message:
          "Patient profile completed successfully",

        patient: {
          id: patient._id,
          _id: patient._id,
          name: patient.name,
          email: patient.email,
          phone: patient.phone,
          dateOfBirth:
            patient.dateOfBirth,
          role: patient.role,
          isActive:
            patient.isActive,
          isDependent: false,
          parentPatient: null,
          addedBy: null,
        },
      });
    } catch (error) {
      console.error(
        "COMPLETE PATIENT PROFILE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error while completing patient profile",
      });
    }
  };

// ======================================================
// CREATE PATIENT DEPENDENT
// POST /api/auth/patient/dependent
// PROTECTED
// ======================================================

const createPatientDependent =
  async (req, res) => {
    try {
      // ==================================================
      // LOGGED-IN PATIENT
      // ==================================================

      const parentPatient =
        await User.findOne({
          _id: req.user.id,
          role: "patient",
        });

      if (!parentPatient) {
        return res.status(404).json({
          success: false,
          message:
            "Logged-in patient not found",
        });
      }

      if (
        parentPatient.isActive ===
        false
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Your account is inactive. Please contact hospital.",
        });
      }

      // ==================================================
      // INPUT
      // ==================================================

      const {
        name,
        email,
        dateOfBirth,
        phone,
      } = req.body;

      // ==================================================
      // NAME
      // ==================================================

      if (
        !name ||
        !name.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Patient name is required",
        });
      }

      const cleanName =
        name.trim();

      if (cleanName.length < 2) {
        return res.status(400).json({
          success: false,
          message:
            "Patient name must be at least 2 characters",
        });
      }

      // ==================================================
      // EMAIL
      // ==================================================

      if (
        !email ||
        !email.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Patient email is required",
        });
      }

      const cleanEmail =
        normalizeEmail(email);

      if (
        !isValidEmail(cleanEmail)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please enter a valid patient email address",
        });
      }

      // ==================================================
      // DOB
      // ==================================================

      if (!dateOfBirth) {
        return res.status(400).json({
          success: false,
          message:
            "Date of birth is required",
        });
      }

      const dob =
        new Date(dateOfBirth);

      if (
        Number.isNaN(
          dob.getTime()
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid date of birth",
        });
      }

      const today =
        new Date();

      today.setHours(
        0,
        0,
        0,
        0
      );

      dob.setHours(
        0,
        0,
        0,
        0
      );

      if (dob > today) {
        return res.status(400).json({
          success: false,
          message:
            "Date of birth cannot be in the future",
        });
      }

      // ==================================================
      // PHONE
      // ==================================================

      if (
        !phone ||
        !phone.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Mobile number is required",
        });
      }

      const cleanPhone =
        phone.replace(
          /\D/g,
          ""
        );

      if (
        cleanPhone.length !== 10
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please enter a valid 10 digit mobile number",
        });
      }

      // ==================================================
      // CHECK EMAIL ALREADY EXISTS
      // ==================================================

      const existingUser =
        await User.findOne({
          email: cleanEmail,
        });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message:
            "This email is already registered. Please use another email address.",
        });
      }

      // ==================================================
      // CREATE DEPENDENT
      // ==================================================

      const dependent =
        await User.create({
          name: cleanName,

          email: cleanEmail,

          phone: cleanPhone,

          dateOfBirth: dob,

          password:
            `dependent-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 10)}`,

          role: "patient",

          isActive: true,

          parentPatient:
            parentPatient._id,

          addedBy:
            parentPatient._id,

          isDependent: true,
        });

      // ==================================================
      // RESPONSE
      // ==================================================

      return res.status(201).json({
        success: true,

        message:
          "New patient added successfully",

        patient: {
          id: dependent._id,
          _id: dependent._id,
          name: dependent.name,
          email: dependent.email,
          phone: dependent.phone,
          dateOfBirth:
            dependent.dateOfBirth,
          role: dependent.role,
          isActive:
            dependent.isActive,
          isDependent:
            true,
          parentPatient:
            dependent.parentPatient,
          addedBy:
            dependent.addedBy,
        },
      });
    } catch (error) {
      console.error(
        "CREATE PATIENT DEPENDENT ERROR:",
        error
      );

      if (
        error?.code === 11000
      ) {
        return res.status(409).json({
          success: false,
          message:
            "A patient with this email already exists.",
        });
      }

      return res.status(500).json({
        success: false,
        message:
          "Server error while creating new patient",
      });
    }
  };

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  sendPatientOtp,
  verifyPatientOtp,
  getPatientMe,
  getMyPatients,
  patientLogout,
  completePatientProfile,
  createPatientDependent,
};