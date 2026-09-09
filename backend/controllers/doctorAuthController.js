require("dotenv").config();

const Doctor = require("../models/Doctor");
const DoctorOtp = require("../models/DoctorOtp");
const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { sendOtpEmail } = require("../serivices/emailService");

// =====================================================
// HELPER FUNCTIONS
// =====================================================

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const getOtpExpiry = () => {
  return new Date(Date.now() + 5 * 60 * 1000);
};

// =====================================================
// SEND DOCTOR OTP
// =====================================================

const sendDoctorOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const cleanEmail = String(email)
      .trim()
      .toLowerCase();

    // Find doctor
    const doctor = await Doctor.findOne({
      email: cleanEmail,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Check doctor status
    if (!doctor.status) {
      return res.status(403).json({
        success: false,
        message: "Doctor account is inactive",
      });
    }

    // Generate OTP
    const otp = generateOtp();
    const expiresAt = getOtpExpiry();

    // Delete previous OTP
    await DoctorOtp.deleteMany({
      email: cleanEmail,
    });

    // Save OTP
    const savedOtp = await DoctorOtp.create({
      email: cleanEmail,
      otp: otp,
      expiresAt: expiresAt,
    });

    console.log("================================");
    console.log("DOCTOR OTP CREATED");
    console.log("Email:", cleanEmail);
    console.log("Generated OTP:", otp);
    console.log("Saved OTP:", savedOtp.otp);
    console.log("Expires:", expiresAt);
    console.log("================================");

    // Send SAME OTP
    await sendOtpEmail(cleanEmail, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    console.error("Send doctor OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send OTP",
    });
  }
};

// =====================================================
// VERIFY DOCTOR OTP
// =====================================================

const verifyDoctorOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // -----------------------------------------------
    // Basic validation
    // -----------------------------------------------

    if (!email || otp === undefined || otp === null) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const cleanEmail = String(email)
      .trim()
      .toLowerCase();

    const enteredOtp = String(otp)
      .trim()
      .replace(/\s/g, "");

    // -----------------------------------------------
    // OTP format
    // -----------------------------------------------

    if (!/^\d{6}$/.test(enteredOtp)) {
      return res.status(400).json({
        success: false,
        message: "OTP must be a 6 digit number",
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
    // Doctor status
    // -----------------------------------------------

    if (!doctor.status) {
      return res.status(403).json({
        success: false,
        message: "Doctor account is inactive",
      });
    }

    // -----------------------------------------------
    // Find latest OTP
    // -----------------------------------------------

    const doctorOtp = await DoctorOtp.findOne({
      email: cleanEmail,
    }).sort({
      createdAt: -1,
    });

    // -----------------------------------------------
    // OTP not found
    // -----------------------------------------------

    if (!doctorOtp) {
      console.log("OTP NOT FOUND");
      console.log("Email:", cleanEmail);

      return res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new OTP",
      });
    }

    // -----------------------------------------------
    // Check expiry
    // -----------------------------------------------

    const now = Date.now();
    const expiryTime = new Date(
      doctorOtp.expiresAt
    ).getTime();

    if (
      !doctorOtp.expiresAt ||
      expiryTime <= now
    ) {
      console.log("OTP EXPIRED");
      console.log("Email:", cleanEmail);
      console.log("Expired At:", doctorOtp.expiresAt);
      console.log("Current Time:", new Date());

      await DoctorOtp.deleteOne({
        _id: doctorOtp._id,
      });

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP",
      });
    }

    // -----------------------------------------------
    // Normalize OTP
    // -----------------------------------------------

    const storedOtp = String(
      doctorOtp.otp
    ).trim();

    // -----------------------------------------------
    // DEBUG
    // -----------------------------------------------

    console.log("================================");
    console.log("OTP VERIFICATION");
    console.log("Email:", cleanEmail);
    console.log(
      "Stored OTP:",
      JSON.stringify(storedOtp)
    );
    console.log(
      "Entered OTP:",
      JSON.stringify(enteredOtp)
    );
    console.log(
      "Stored Length:",
      storedOtp.length
    );
    console.log(
      "Entered Length:",
      enteredOtp.length
    );
    console.log(
      "MATCH:",
      storedOtp === enteredOtp
    );
    console.log(
      "OTP Expiry:",
      doctorOtp.expiresAt
    );
    console.log("================================");

    // -----------------------------------------------
    // Compare OTP
    // -----------------------------------------------

    if (storedOtp !== enteredOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // -----------------------------------------------
    // OTP SUCCESS
    // -----------------------------------------------

    console.log("OTP VERIFIED SUCCESSFULLY");

    // Delete used OTP
    await DoctorOtp.deleteOne({
      _id: doctorOtp._id,
    });

    // -----------------------------------------------
    // JWT SECRET
    // -----------------------------------------------

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is missing in .env"
      );

      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    // -----------------------------------------------
    // Generate setup token
    // -----------------------------------------------

    const setupToken = jwt.sign(
      {
        id: doctor._id.toString(),
        role: "doctor",
        purpose: "doctor-setup",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m",
      }
    );

    // -----------------------------------------------
    // Success response
    // -----------------------------------------------

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      setupToken: setupToken,

      doctor: {
        id: doctor._id,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
      },
    });
  } catch (error) {
    console.error(
      "Verify doctor OTP error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to verify OTP",
    });
  }
};

// =====================================================
// RESEND DOCTOR OTP
// =====================================================

const resendDoctorOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const cleanEmail = String(email)
      .trim()
      .toLowerCase();

    // Find doctor
    const doctor = await Doctor.findOne({
      email: cleanEmail,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Check status
    if (!doctor.status) {
      return res.status(403).json({
        success: false,
        message: "Doctor account is inactive",
      });
    }

    // Generate NEW OTP
    const otp = generateOtp();
    const expiresAt = getOtpExpiry();

    // Delete old OTP
    await DoctorOtp.deleteMany({
      email: cleanEmail,
    });

    // Save new OTP
    const savedOtp = await DoctorOtp.create({
      email: cleanEmail,
      otp: otp,
      expiresAt: expiresAt,
    });

    console.log("================================");
    console.log("DOCTOR RESEND OTP");
    console.log("Email:", cleanEmail);
    console.log("Generated OTP:", otp);
    console.log("Saved OTP:", savedOtp.otp);
    console.log("Expires:", expiresAt);
    console.log("================================");

    // Send SAME OTP
    await sendOtpEmail(cleanEmail, otp);

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.error(
      "Resend doctor OTP error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to resend OTP",
    });
  }
};

// =====================================================
// SET DOCTOR CREDENTIALS
// =====================================================

const setDoctorCredentials = async (req, res) => {
  try {
    const {
      setupToken,
      password,
      confirmPassword,
    } = req.body;

    console.log("================================");
    console.log("SET DOCTOR CREDENTIALS");
    console.log("Body Keys:", Object.keys(req.body || {}));
    console.log(
      "Has Setup Token:",
      Boolean(setupToken)
    );
    console.log(
      "Has Password:",
      Boolean(password)
    );
    console.log(
      "Has Confirm Password:",
      Boolean(confirmPassword)
    );
    console.log("================================");

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

    if (password !== confirmPassword) {
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
        message: "Server configuration error",
      });
    }

    // -----------------------------------------------
    // Verify setup token
    // -----------------------------------------------

    let decoded;

    try {
      decoded = jwt.verify(
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
        message: "Invalid setup token",
      });
    }

    // -----------------------------------------------
    // Validate purpose
    // -----------------------------------------------

    if (
      decoded.purpose !==
      "doctor-setup"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid setup token",
      });
    }

    if (!decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid setup token",
      });
    }

    // -----------------------------------------------
    // Find doctor
    // -----------------------------------------------

    const doctor = await Doctor.findById(
      decoded.id
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // -----------------------------------------------
    // Check status
    // -----------------------------------------------

    if (!doctor.status) {
      return res.status(403).json({
        success: false,
        message: "Doctor account is inactive",
      });
    }

    // -----------------------------------------------
    // Already created?
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
      const firstName = String(
        doctor.firstName || "doctor"
      )
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

      const doctorId = doctor._id
        .toString()
        .slice(-6);

      doctor.username =
        `${firstName}${doctorId}`;
    }

    // -----------------------------------------------
    // Hash password
    // -----------------------------------------------

    const hashedPassword =
      await bcrypt.hash(password, 10);

    doctor.password = hashedPassword;

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
      username: doctor.username,
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
    const {
      username,
      password,
    } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Username and password are required",
      });
    }

    const cleanUsername = String(username)
      .trim()
      .toLowerCase();

    // Find doctor
    const doctor = await Doctor.findOne({
      username: cleanUsername,
    });

    if (!doctor) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid username or password",
      });
    }

    // Check status
    if (!doctor.status) {
      return res.status(403).json({
        success: false,
        message:
          "Doctor account is inactive",
      });
    }

    // Password exists?
    if (!doctor.password) {
      return res.status(401).json({
        success: false,
        message:
          "Doctor credentials are not created yet",
      });
    }

    // Compare password
    const isPasswordMatch =
      await bcrypt.compare(
        password,
        doctor.password
      );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid username or password",
      });
    }

    // JWT secret
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

    // Generate login token
    const token = jwt.sign(
      {
        id: doctor._id.toString(),
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
        phone: doctor.phone,
        username: doctor.username,
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
      message: "Unable to login",
    });
  }
};

// =====================================================
// REGISTER ADMIN
// =====================================================

const registerAdmin = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Required fields
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password and role are required",
      });
    }

    const cleanEmail = String(email)
      .trim()
      .toLowerCase();

    const cleanRole = String(role)
      .trim()
      .toLowerCase();

    // Only admin role allowed
    if (cleanRole !== "admin") {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Only admin is allowed",
      });
    }

    // Fixed admin values
    const name = "Admin";
    const username = "admin";

    // Check existing admin/email
    const existingUser = await User.findOne({
      $or: [
        { username: "admin" },
        { email: cleanEmail },
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Admin account or email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    // Create admin
    const admin = await User.create({
      name,
      username,
      email: cleanEmail,
      password: hashedPassword,
      role: "admin",
    });

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        createdAt: admin.createdAt,
      },
    });

  } catch (error) {
    console.error("Register admin error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Admin account or email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to register admin",
    });
  }
};





// =====================================================
// ADMIN LOGIN
// =====================================================

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // Find admin
    const admin = await User.findOne({
      email: cleanEmail,
      role: "admin",
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: admin._id.toString(),
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ==========================================
    // SET ADMIN AUTH COOKIE
    // ==========================================

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Admin login successful",

      admin: {
        id: admin._id,
        name: admin.name,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to login admin",
    });
  }
};
// =====================================================
// LOGOUT
// =====================================================

const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

// =====================================================
// GET ADMIN
// =====================================================

const getAdminMe = async (req, res) => {
  try {
    const admin = await User.findById(
      req.user.id
    ).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
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
// UPDATE ADMIN PROFILE
// =====================================================

const updateAdminProfile = async (
  req,
  res
) => {
  try {
    const {
      username,
      email,
    } = req.body;

    const admin = await User.findById(
      req.user.id
    );

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Update username
    if (username) {
      const cleanUsername = String(
        username
      )
        .trim()
        .toLowerCase();

      const existingUsername =
        await User.findOne({
          username: cleanUsername,
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

    // Update email
    if (email) {
      const cleanEmail = String(email)
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

      admin.email = cleanEmail;
    }

    await admin.save();

    return res.status(200).json({
      success: true,
      message:
        "Admin profile updated successfully",

      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
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
  setDoctorCredentials,
  loginDoctor,
  resendDoctorOtp,

  // Admin
  registerAdmin,
  adminLogin,
  logout,
  getAdminMe,
  updateAdminProfile,
};