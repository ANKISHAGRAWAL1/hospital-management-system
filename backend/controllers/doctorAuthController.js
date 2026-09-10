 require("dotenv").config();

const Doctor = require("../models/Doctor");
const DoctorOtp = require("../models/DoctorOtp");
const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { sendOtpEmail } = require("../serivices/emailService");

// =====================================================
// CONFIGURATION
// =====================================================

const OTP_EXPIRY_MINUTES = 5;
const MAX_OTP_ATTEMPTS = 5;

// =====================================================
// HELPER FUNCTIONS
// =====================================================

// Generate exactly 6 digit OTP
const generateOtp = () => {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
};

// OTP expiry
const getOtpExpiry = () => {
  return new Date(
    Date.now() +
      OTP_EXPIRY_MINUTES * 60 * 1000
  );
};

// Normalize email
const normalizeEmail = (email) => {
  return String(email || "")
    .trim()
    .toLowerCase();
};

// =====================================================
// SEND DOCTOR OTP
// =====================================================

const sendDoctorOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // -----------------------------------------------
    // Validate email
    // -----------------------------------------------

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const cleanEmail = normalizeEmail(email);

    // -----------------------------------------------
    // Validate email format
    // -----------------------------------------------

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid email address",
      });
    }

    // -----------------------------------------------
    // Find doctor
    // -----------------------------------------------

    const doctor = await Doctor.findOne({
      email: cleanEmail,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // -----------------------------------------------
    // Check doctor status
    // -----------------------------------------------

    if (!doctor.status) {
      return res.status(403).json({
        success: false,
        message:
          "Doctor account is inactive",
      });
    }

    // -----------------------------------------------
    // Generate ONE OTP
    // -----------------------------------------------

    const otp = generateOtp();

    const expiresAt = getOtpExpiry();

    // -----------------------------------------------
    // Delete previous OTP
    // -----------------------------------------------

    await DoctorOtp.deleteMany({
      email: cleanEmail,
    });

    // -----------------------------------------------
    // Save SAME OTP in database
    // -----------------------------------------------

    const savedOtp = await DoctorOtp.create({
      email: cleanEmail,
      otp: otp,
      expiresAt: expiresAt,
      attempts: 0,
    });

    // -----------------------------------------------
    // Development logs
    // -----------------------------------------------

    if (
      process.env.NODE_ENV !==
      "production"
    ) {
      console.log(
        "========================================"
      );

      console.log(
        "DOCTOR OTP CREATED"
      );

      console.log(
        "Email:",
        cleanEmail
      );

      console.log(
        "Generated OTP:",
        otp
      );

      console.log(
        "Saved OTP:",
        savedOtp.otp
      );

      console.log(
        "Expires:",
        expiresAt
      );

      console.log(
        "========================================"
      );
    }

    // -----------------------------------------------
    // Send SAME OTP
    // -----------------------------------------------

    await sendOtpEmail(
      cleanEmail,
      otp
    );

    // -----------------------------------------------
    // Response
    // -----------------------------------------------

    return res.status(200).json({
      success: true,
      message:
        "OTP sent successfully to your email",
      expiresIn:
        OTP_EXPIRY_MINUTES * 60,
    });
  } catch (error) {
    console.error(
      "Send doctor OTP error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to send OTP",
    });
  }
};

// =====================================================
// VERIFY DOCTOR OTP
// =====================================================

const verifyDoctorOtp = async (
  req,
  res
) => {
  try {
    const { email, otp } = req.body;

    // -----------------------------------------------
    // Validate request
    // -----------------------------------------------

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message:
          "Email and OTP are required",
      });
    }

    const cleanEmail =
      normalizeEmail(email);

    const cleanOtp =
      String(otp).trim();

    // -----------------------------------------------
    // Validate OTP format
    // -----------------------------------------------

    if (!/^\d{6}$/.test(cleanOtp)) {
      return res.status(400).json({
        success: false,
        message:
          "OTP must be a 6-digit number",
      });
    }

    // -----------------------------------------------
    // Find latest OTP
    // -----------------------------------------------

    const otpRecord =
      await DoctorOtp.findOne({
        email: cleanEmail,
      }).sort({
        createdAt: -1,
      });

    // -----------------------------------------------
    // OTP not found
    // -----------------------------------------------

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message:
          "OTP not found or already used. Please request a new OTP.",
      });
    }

    // -----------------------------------------------
    // Check expiry
    // -----------------------------------------------

    if (
      !otpRecord.expiresAt ||
      otpRecord.expiresAt.getTime() <=
        Date.now()
    ) {
      await DoctorOtp.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(400).json({
        success: false,
        message:
          "OTP has expired. Please request a new OTP.",
      });
    }

    // -----------------------------------------------
    // Check attempts
    // -----------------------------------------------

    if (
      otpRecord.attempts >=
      MAX_OTP_ATTEMPTS
    ) {
      await DoctorOtp.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(429).json({
        success: false,
        message:
          "Too many incorrect attempts. Please request a new OTP.",
      });
    }

    // -----------------------------------------------
    // DEVELOPMENT DEBUG
    // -----------------------------------------------

    if (
      process.env.NODE_ENV !==
      "production"
    ) {
      console.log(
        "========================================"
      );

      console.log(
        "VERIFY DOCTOR OTP"
      );

      console.log(
        "Email:",
        cleanEmail
      );

      console.log(
        "Entered OTP:",
        cleanOtp
      );

      console.log(
        "Database OTP:",
        otpRecord.otp
      );

      console.log(
        "OTP Match:",
        String(otpRecord.otp).trim() ===
          cleanOtp
      );

      console.log(
        "Expires:",
        otpRecord.expiresAt
      );

      console.log(
        "Attempts:",
        otpRecord.attempts
      );

      console.log(
        "========================================"
      );
    }

    // -----------------------------------------------
    // Compare OTP
    // -----------------------------------------------

    const isOtpValid =
      String(otpRecord.otp).trim() ===
      cleanOtp;

    // -----------------------------------------------
    // Invalid OTP
    // -----------------------------------------------

    if (!isOtpValid) {
      otpRecord.attempts += 1;

      await otpRecord.save();

      const remainingAttempts =
        Math.max(
          0,
          MAX_OTP_ATTEMPTS -
            otpRecord.attempts
        );

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
        remainingAttempts,
      });
    }

    // -----------------------------------------------
    // Find doctor
    // -----------------------------------------------

    const doctor =
      await Doctor.findOne({
        email: cleanEmail,
      });

    if (!doctor) {
      await DoctorOtp.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // -----------------------------------------------
    // Check doctor status
    // -----------------------------------------------

    if (!doctor.status) {
      await DoctorOtp.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(403).json({
        success: false,
        message:
          "Doctor account is inactive",
      });
    }

    // -----------------------------------------------
    // Delete OTP
    // OTP is now single-use
    // -----------------------------------------------

    await DoctorOtp.deleteOne({
      _id: otpRecord._id,
    });

    // -----------------------------------------------
    // JWT secret
    // -----------------------------------------------

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

    // -----------------------------------------------
    // Create setup token
    // -----------------------------------------------

    const setupToken =
      jwt.sign(
        {
          id: doctor._id.toString(),
          email: doctor.email,
          role: "doctor",
          purpose: "doctor-setup",
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "10m",
        }
      );

    // -----------------------------------------------
    // Success
    // -----------------------------------------------

    return res.status(200).json({
      success: true,
      message:
        "OTP verified successfully",

      setupToken,

      doctor: {
        id: doctor._id,
        firstName:
          doctor.firstName,
        lastName:
          doctor.lastName,
        email: doctor.email,
        phone: doctor.phone,
      },
    });
  } catch (error) {
    console.error(
      "Verify doctor OTP error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to verify OTP",
    });
  }
};

// =====================================================
// RESEND DOCTOR OTP
// =====================================================

const resendDoctorOtp = async (
  req,
  res
) => {
  try {
    const { email } = req.body;

    // -----------------------------------------------
    // Validate
    // -----------------------------------------------

    if (!email) {
      return res.status(400).json({
        success: false,
        message:
          "Email is required",
      });
    }

    const cleanEmail =
      normalizeEmail(email);

    // -----------------------------------------------
    // Find doctor
    // -----------------------------------------------

    const doctor =
      await Doctor.findOne({
        email: cleanEmail,
      });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message:
          "Doctor not found",
      });
    }

    // -----------------------------------------------
    // Check status
    // -----------------------------------------------

    if (!doctor.status) {
      return res.status(403).json({
        success: false,
        message:
          "Doctor account is inactive",
      });
    }

    // -----------------------------------------------
    // Generate NEW OTP
    // -----------------------------------------------

    const otp = generateOtp();

    const expiresAt =
      getOtpExpiry();

    // -----------------------------------------------
    // Delete old OTP
    // -----------------------------------------------

    await DoctorOtp.deleteMany({
      email: cleanEmail,
    });

    // -----------------------------------------------
    // Save NEW OTP
    // -----------------------------------------------

    const savedOtp =
      await DoctorOtp.create({
        email: cleanEmail,
        otp: otp,
        expiresAt: expiresAt,
        attempts: 0,
      });

    // -----------------------------------------------
    // Development logs
    // -----------------------------------------------

    if (
      process.env.NODE_ENV !==
      "production"
    ) {
      console.log(
        "========================================"
      );

      console.log(
        "DOCTOR RESEND OTP"
      );

      console.log(
        "Email:",
        cleanEmail
      );

      console.log(
        "Generated OTP:",
        otp
      );

      console.log(
        "Saved OTP:",
        savedOtp.otp
      );

      console.log(
        "Expires:",
        expiresAt
      );

      console.log(
        "========================================"
      );
    }

    // -----------------------------------------------
    // Send SAME OTP
    // -----------------------------------------------

    await sendOtpEmail(
      cleanEmail,
      otp
    );

    // -----------------------------------------------
    // Response
    // -----------------------------------------------

    return res.status(200).json({
      success: true,
      message:
        "OTP resent successfully",
      expiresIn:
        OTP_EXPIRY_MINUTES * 60,
    });
  } catch (error) {
    console.error(
      "Resend doctor OTP error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to resend OTP",
    });
  }
};

// =====================================================
// SET DOCTOR CREDENTIALS
// =====================================================

const setDoctorCredentials =
  async (req, res) => {
    try {
      const {
        setupToken,
        password,
        confirmPassword,
      } = req.body;

      // -----------------------------------------------
      // Required fields
      // -----------------------------------------------

      if (
        !setupToken ||
        !password ||
        !confirmPassword
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Setup token, password and confirm password are required",
        });
      }

      // -----------------------------------------------
      // Password match
      // -----------------------------------------------

      if (
        password !==
        confirmPassword
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Password and confirm password do not match",
        });
      }

      // -----------------------------------------------
      // Password length
      // -----------------------------------------------

      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message:
            "Password must be at least 8 characters",
        });
      }

      // -----------------------------------------------
      // JWT secret
      // -----------------------------------------------

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

      // -----------------------------------------------
      // Verify setup token
      // -----------------------------------------------

      let decoded;

      try {
        decoded =
          jwt.verify(
            setupToken,
            process.env.JWT_SECRET
          );
      } catch (error) {
        console.error(
          "Setup token verification error:",
          error
        );

        if (
          error.name ===
          "TokenExpiredError"
        ) {
          return res.status(401).json({
            success: false,
            message:
              "Setup token has expired. Please verify OTP again",
          });
        }

        return res.status(401).json({
          success: false,
          message:
            "Invalid setup token",
        });
      }

      // -----------------------------------------------
      // Validate token purpose
      // -----------------------------------------------

      if (
        decoded.purpose !==
        "doctor-setup"
      ) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid setup token",
        });
      }

      if (!decoded.id) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid setup token",
        });
      }

      // -----------------------------------------------
      // Find doctor
      // -----------------------------------------------

      const doctor =
        await Doctor.findById(
          decoded.id
        );

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message:
            "Doctor not found",
        });
      }

      // -----------------------------------------------
      // Check status
      // -----------------------------------------------

      if (!doctor.status) {
        return res.status(403).json({
          success: false,
          message:
            "Doctor account is inactive",
        });
      }

      // -----------------------------------------------
      // Already credentials created
      // -----------------------------------------------

      if (doctor.password) {
        return res.status(409).json({
          success: false,
          message:
            "Doctor credentials already created",
        });
      }

      // -----------------------------------------------
      // Generate username
      // -----------------------------------------------

      if (!doctor.username) {
        const firstName =
          String(
            doctor.firstName ||
              "doctor"
          )
            .toLowerCase()
            .replace(
              /[^a-z0-9]/g,
              ""
            );

        const doctorId =
          doctor._id
            .toString()
            .slice(-6);

        doctor.username =
          `${firstName}${doctorId}`;
      }

      // -----------------------------------------------
      // Hash password
      // -----------------------------------------------

      const hashedPassword =
        await bcrypt.hash(
          password,
          12
        );

      doctor.password =
        hashedPassword;

      await doctor.save();

      console.log(
        "Doctor credentials created:",
        doctor.username
      );

      // -----------------------------------------------
      // Success
      // -----------------------------------------------

      return res.status(200).json({
        success: true,
        message:
          "Doctor password created successfully",
        username:
          doctor.username,
      });
    } catch (error) {
      console.error(
        "Set doctor credentials error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to create doctor credentials",
      });
    }
  };

// =====================================================
// DOCTOR LOGIN
// =====================================================

const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("=================================");
    console.log("DOCTOR LOGIN REQUEST");
    console.log("Email:", email);
    console.log("Password received:", Boolean(password));
    console.log("=================================");

    // Required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Normalize email
    const cleanEmail = String(email)
      .trim()
      .toLowerCase();

    // Find doctor by email
    const doctor = await Doctor.findOne({
      email: cleanEmail,
    });

    console.log("Doctor found:", Boolean(doctor));

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check account status
    if (!doctor.status) {
      return res.status(403).json({
        success: false,
        message: "Doctor account is inactive",
      });
    }

    // Check password exists
    if (
      !doctor.password ||
      doctor.password.trim() === ""
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Password is not created yet. Please complete Create Password first.",
      });
    }

    // Compare password
    const isPasswordMatch =
      await bcrypt.compare(
        String(password),
        doctor.password
      );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // JWT secret
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing");

      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: doctor._id.toString(),
        email: doctor.email,
        role: "doctor",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Doctor login successful",
      token,
      doctor: {
        id: doctor._id,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        username: doctor.username || "",
        profileImage: doctor.profileImage || "",
        role: "doctor",
      },
    });
  } catch (error) {
    console.error(
      "Doctor login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Doctor login failed",
    });
  }
};
// =====================================================
// REGISTER ADMIN
// =====================================================

const registerAdmin = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
      role,
    } = req.body;

    // -----------------------------------------------
    // Required fields
    // -----------------------------------------------

    if (
      !email ||
      !password ||
      !role
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email, password and role are required",
      });
    }

    const cleanEmail =
      String(email)
        .trim()
        .toLowerCase();

    const cleanRole =
      String(role)
        .trim()
        .toLowerCase();

    // -----------------------------------------------
    // Only admin role
    // -----------------------------------------------

    if (cleanRole !== "admin") {
      return res.status(400).json({
        success: false,
        message:
          "Invalid role. Only admin is allowed",
      });
    }

    // -----------------------------------------------
    // Admin values
    // -----------------------------------------------

    const name = "Admin";
    const username = "admin";

    // -----------------------------------------------
    // Check existing admin
    // -----------------------------------------------

    const existingUser =
      await User.findOne({
        $or: [
          {
            username: "admin",
          },
          {
            email: cleanEmail,
          },
        ],
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "Admin account or email already exists",
      });
    }

    // -----------------------------------------------
    // Hash password
    // -----------------------------------------------

    const hashedPassword =
      await bcrypt.hash(
        password,
        12
      );

    // -----------------------------------------------
    // Create admin
    // -----------------------------------------------

    const admin =
      await User.create({
        name,
        username,
        email: cleanEmail,
        password:
          hashedPassword,
        role: "admin",
      });

    // -----------------------------------------------
    // Response
    // -----------------------------------------------

    return res.status(201).json({
      success: true,
      message:
        "Admin registered successfully",

      admin: {
        id: admin._id,
        name: admin.name,
        username:
          admin.username,
        email:
          admin.email,
        role:
          admin.role,
        createdAt:
          admin.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "Register admin error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Admin account or email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to register admin",
    });
  }
};

// =====================================================
// ADMIN LOGIN
// =====================================================

const adminLogin = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // -----------------------------------------------
    // Validate
    // -----------------------------------------------

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    const cleanEmail =
      String(email)
        .trim()
        .toLowerCase();

    // -----------------------------------------------
    // Find admin
    // -----------------------------------------------

    const admin =
      await User.findOne({
        email: cleanEmail,
        role: "admin",
      });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    // -----------------------------------------------
    // Compare password
    // -----------------------------------------------

    const isPasswordMatch =
      await bcrypt.compare(
        password,
        admin.password
      );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    // -----------------------------------------------
    // JWT secret
    // -----------------------------------------------

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

    // -----------------------------------------------
    // Generate JWT
    // -----------------------------------------------

    const token =
      jwt.sign(
        {
          id: admin._id.toString(),
          role: admin.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

    // -----------------------------------------------
    // Set cookie
    // -----------------------------------------------

    res.cookie(
      "adminToken",
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

        path: "/",
      }
    );

    // -----------------------------------------------
    // Response
    // -----------------------------------------------

    return res.status(200).json({
      success: true,
      message:
        "Admin login successful",

      admin: {
        id: admin._id,
        name: admin.name,
        username:
          admin.username,
        email:
          admin.email,
        role:
          admin.role,
      },
    });
  } catch (error) {
    console.error(
      "Admin login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to login admin",
    });
  }
};

// =====================================================
// LOGOUT
// =====================================================

const logout = async (
  req,
  res
) => {
  try {
    res.clearCookie(
      "adminToken",
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

        path: "/",
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Logout successful",
    });
  } catch (error) {
    console.error(
      "Logout error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to logout",
    });
  }
};

// =====================================================
// GET ADMIN
// =====================================================

const getAdminMe = async (
  req,
  res
) => {
  try {
    const admin =
      await User.findById(
        req.user.id
      ).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message:
          "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error(
      "Get admin error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to get admin profile",
    });
  }
};




// =====================================================
// FORGOT PASSWORD - SEND OTP
// =====================================================

const forgotDoctorPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // -----------------------------------------------
    // Validate email
    // -----------------------------------------------

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const cleanEmail = normalizeEmail(email);

    // -----------------------------------------------
    // Validate email format
    // -----------------------------------------------

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // -----------------------------------------------
    // Find doctor
    // -----------------------------------------------

    const doctor = await Doctor.findOne({
      email: cleanEmail,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "No doctor account found with this email",
      });
    }

    // -----------------------------------------------
    // Check doctor status
    // -----------------------------------------------

    if (!doctor.status) {
      return res.status(403).json({
        success: false,
        message: "Doctor account is inactive",
      });
    }

    // -----------------------------------------------
    // Check credentials
    // -----------------------------------------------

    if (!doctor.password) {
      return res.status(400).json({
        success: false,
        message:
          "Doctor account has not completed initial setup. Please use Create Password.",
      });
    }

    // -----------------------------------------------
    // Generate OTP
    // -----------------------------------------------

    const otp = generateOtp();
    const expiresAt = getOtpExpiry();

    // -----------------------------------------------
    // Remove old OTP
    // -----------------------------------------------

    await DoctorOtp.deleteMany({
      email: cleanEmail,
    });

    // -----------------------------------------------
    // Save OTP
    // -----------------------------------------------

    await DoctorOtp.create({
      email: cleanEmail,
      otp,
      expiresAt,
      attempts: 0,
    });

    // -----------------------------------------------
    // Send SAME OTP to email
    // -----------------------------------------------

    await sendOtpEmail(cleanEmail, otp);

    // -----------------------------------------------
    // Development log
    // -----------------------------------------------

    if (process.env.NODE_ENV !== "production") {
      console.log("========================================");
      console.log("DOCTOR PASSWORD RESET OTP");
      console.log("Email:", cleanEmail);
      console.log("OTP:", otp);
      console.log("Expires:", expiresAt);
      console.log("========================================");
    }

    return res.status(200).json({
      success: true,
      message: "Password reset OTP sent successfully",
      expiresIn: OTP_EXPIRY_MINUTES * 60,
    });
  } catch (error) {
    console.error(
      "Forgot doctor password error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to send password reset OTP",
    });
  }
};


// =====================================================
// FORGOT PASSWORD - VERIFY OTP
// =====================================================

const verifyDoctorResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // -----------------------------------------------
    // Validate
    // -----------------------------------------------

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const cleanEmail = normalizeEmail(email);
    const cleanOtp = String(otp).trim();

    // -----------------------------------------------
    // Validate OTP format
    // -----------------------------------------------

    if (!/^\d{6}$/.test(cleanOtp)) {
      return res.status(400).json({
        success: false,
        message: "OTP must be a 6-digit number",
      });
    }

    // -----------------------------------------------
    // Find doctor
    // -----------------------------------------------

    const doctor = await Doctor.findOne({
      email: cleanEmail,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    if (!doctor.status) {
      return res.status(403).json({
        success: false,
        message: "Doctor account is inactive",
      });
    }

    // -----------------------------------------------
    // Find latest OTP
    // -----------------------------------------------

    const otpRecord = await DoctorOtp.findOne({
      email: cleanEmail,
    }).sort({
      createdAt: -1,
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message:
          "OTP not found or already used. Please request a new OTP.",
      });
    }

    // -----------------------------------------------
    // Check expiry
    // -----------------------------------------------

    if (
      !otpRecord.expiresAt ||
      otpRecord.expiresAt.getTime() <= Date.now()
    ) {
      await DoctorOtp.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(400).json({
        success: false,
        message:
          "OTP has expired. Please request a new OTP.",
      });
    }

    // -----------------------------------------------
    // Check attempts
    // -----------------------------------------------

    if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
      await DoctorOtp.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(429).json({
        success: false,
        message:
          "Too many incorrect attempts. Please request a new OTP.",
      });
    }

    // -----------------------------------------------
    // Compare OTP
    // -----------------------------------------------

    const isOtpValid =
      String(otpRecord.otp).trim() === cleanOtp;

    if (!isOtpValid) {
      otpRecord.attempts += 1;

      await otpRecord.save();

      const remainingAttempts = Math.max(
        0,
        MAX_OTP_ATTEMPTS - otpRecord.attempts
      );

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
        remainingAttempts,
      });
    }

    // -----------------------------------------------
    // Delete OTP
    // Single-use
    // -----------------------------------------------

    await DoctorOtp.deleteOne({
      _id: otpRecord._id,
    });

    // -----------------------------------------------
    // JWT secret
    // -----------------------------------------------

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in .env");

      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    // -----------------------------------------------
    // Create RESET token
    // -----------------------------------------------

    const resetToken = jwt.sign(
      {
        id: doctor._id.toString(),
        email: doctor.email,
        role: "doctor",
        purpose: "doctor-password-reset",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m",
      }
    );

    // -----------------------------------------------
    // Response
    // -----------------------------------------------

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      resetToken,
    });
  } catch (error) {
    console.error(
      "Verify doctor reset OTP error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to verify OTP",
    });
  }
};


// =====================================================
// RESET DOCTOR PASSWORD
// =====================================================

const resetDoctorPassword = async (req, res) => {
  try {
    const {
      resetToken,
      password,
      confirmPassword,
    } = req.body || {};

    // ==========================================
    // 1. VALIDATION
    // ==========================================

    if (!resetToken || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Reset token, password and confirm password are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match",
      });
    }

    if (String(password).length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // ==========================================
    // 2. PASSWORD STRENGTH
    // ==========================================

    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least one uppercase letter",
      });
    }

    if (!/[a-z]/.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least one lowercase letter",
      });
    }

    if (!/\d/.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least one number",
      });
    }

    // ==========================================
    // 3. JWT SECRET
    // ==========================================

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in .env");

      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    // ==========================================
    // 4. VERIFY RESET TOKEN
    // ==========================================

    let decoded;

    try {
      decoded = jwt.verify(
        resetToken,
        process.env.JWT_SECRET
      );
    } catch (error) {
      console.error(
        "Reset token verification error:",
        error.message
      );

      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message:
            "Reset session has expired. Please verify OTP again.",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Invalid reset token",
      });
    }

    // ==========================================
    // 5. CHECK TOKEN PURPOSE
    // ==========================================

    if (
      decoded.role !== "doctor" ||
      decoded.purpose !== "doctor-password-reset"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid reset token",
      });
    }

    if (!decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid reset token",
      });
    }

    // ==========================================
    // 6. FIND DOCTOR
    // ==========================================

    const doctor = await Doctor.findById(decoded.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // ==========================================
    // 7. CHECK STATUS
    // ==========================================

    if (doctor.status === false) {
      return res.status(403).json({
        success: false,
        message: "Doctor account is inactive",
      });
    }

    // ==========================================
    // 8. HASH NEW PASSWORD
    // ==========================================

    const hashedPassword = await bcrypt.hash(
      String(password),
      12
    );

    doctor.password = hashedPassword;

    // ==========================================
    // 9. SAVE
    // ==========================================

    await doctor.save();

    // ==========================================
    // 10. VERIFY PASSWORD AFTER SAVE
    // ==========================================

    const passwordMatchAfterSave =
      await bcrypt.compare(
        String(password),
        doctor.password
      );

    console.log("========== PASSWORD RESET DEBUG ==========");
    console.log("Doctor ID:", doctor._id.toString());
    console.log("Doctor Email:", doctor.email);
    console.log(
      "Password saved:",
      Boolean(doctor.password)
    );
    console.log(
      "Password match after save:",
      passwordMatchAfterSave
    );
    console.log("==========================================");

    if (!passwordMatchAfterSave) {
      return res.status(500).json({
        success: false,
        message: "Password was not saved correctly",
      });
    }

    // ==========================================
    // 11. SUCCESS
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Doctor password reset successfully",
    });
  } catch (error) {
    console.error(
      "Reset doctor password error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to reset doctor password",
    });
  }
};
// =====================================================
// UPDATE ADMIN PROFILE
// =====================================================

const updateAdminProfile =
  async (req, res) => {
    try {
      const {
        username,
        email,
      } = req.body;

      const admin =
        await User.findById(
          req.user.id
        );

      if (!admin) {
        return res.status(404).json({
          success: false,
          message:
            "Admin not found",
        });
      }

      // -----------------------------------------------
      // Update username
      // -----------------------------------------------

      if (username) {
        const cleanUsername =
          String(username)
            .trim()
            .toLowerCase();

        const existingUsername =
          await User.findOne({
            username:
              cleanUsername,

            _id: {
              $ne: admin._id,
            },
          });

        if (existingUsername) {
          return res.status(409).json({
            success: false,
            message:
              "Username already exists",
          });
        }

        admin.username =
          cleanUsername;
      }

      // -----------------------------------------------
      // Update email
      // -----------------------------------------------

      if (email) {
        const cleanEmail =
          String(email)
            .trim()
            .toLowerCase();

        const existingEmail =
          await User.findOne({
            email: cleanEmail,

            _id: {
              $ne: admin._id,
            },
          });

        if (existingEmail) {
          return res.status(409).json({
            success: false,
            message:
              "Email already exists",
          });
        }

        admin.email =
          cleanEmail;
      }

      await admin.save();

      // -----------------------------------------------
      // Response
      // -----------------------------------------------

      return res.status(200).json({
        success: true,
        message:
          "Admin profile updated successfully",

        admin: {
          id: admin._id,
          username:
            admin.username,
          email:
            admin.email,
          role:
            admin.role,
        },
      });
    } catch (error) {
      console.error(
        "Update admin profile error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to update admin profile",
      });
    }
  };

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  // Doctor
  sendDoctorOtp,
  verifyDoctorOtp,
  resendDoctorOtp,
  setDoctorCredentials,
  loginDoctor,

  // Doctor Forgot Password
  forgotDoctorPassword,
  verifyDoctorResetOtp,
  resetDoctorPassword,

  // Admin
  registerAdmin,
  adminLogin,
  logout,
  getAdminMe,
  updateAdminProfile,
};