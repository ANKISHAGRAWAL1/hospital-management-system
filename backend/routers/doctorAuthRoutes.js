const express = require("express");

const {
  // ==========================================
  // ADMIN AUTH
  // ==========================================
  registerAdmin,
  adminLogin,
  logout,
  getAdminMe,
  updateAdminProfile,

  // ==========================================
  // DOCTOR AUTH
  // ==========================================
  sendDoctorOtp,
  verifyDoctorOtp,
  resendDoctorOtp,
  setDoctorCredentials,
  loginDoctor,

  // ==========================================
  // DOCTOR FORGOT PASSWORD
  // ==========================================
  forgotDoctorPassword,
  verifyDoctorResetOtp,
  resetDoctorPassword,
} = require("../controllers/doctorAuthController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// ADMIN AUTHENTICATION
// =====================================================

// Register first admin
router.post(
  "/register-admin",
  registerAdmin
);

// Admin login
router.post(
  "/admin/login",
  adminLogin
);

// Get currently logged-in admin
router.get(
  "/admin/me",
  protect,
  authorize("admin"),
  getAdminMe
);

// Update logged-in admin profile
router.put(
  "/admin/profile",
  protect,
  authorize("admin"),
  updateAdminProfile
);

// Logout
router.post(
  "/logout",
  logout
);


// =====================================================
// DOCTOR FIRST-TIME ACCOUNT SETUP
// =====================================================

// Send OTP to registered doctor's email
router.post(
  "/doctor/send-otp",
  sendDoctorOtp
);

// Verify first-time setup OTP
router.post(
  "/doctor/verify-otp",
  verifyDoctorOtp
);

// Resend first-time setup OTP
router.post(
  "/doctor/resend-otp",
  resendDoctorOtp
);

// Create doctor's username and password
// This route uses the temporary setupToken
router.post(
  "/doctor/set-credentials",
  setDoctorCredentials
);


// =====================================================
// DOCTOR LOGIN
// =====================================================

// Doctor login
router.post(
  "/doctor/login",
  loginDoctor
);


// =====================================================
// DOCTOR FORGOT PASSWORD
// =====================================================

// Send password reset OTP
router.post(
  "/doctor/forgot-password",
  forgotDoctorPassword
);

// Verify password reset OTP
router.post(
  "/doctor/forgot-password/verify-otp",
  verifyDoctorResetOtp
);

// Reset doctor password
// This route uses the temporary resetToken
router.post(
  "/doctor/reset-password",
  resetDoctorPassword
);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;