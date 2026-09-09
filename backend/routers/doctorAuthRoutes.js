const express = require("express");

const {
  registerAdmin,
  adminLogin,
  logout,
  getAdminMe,
  updateAdminProfile,

  // Doctor Auth
  sendDoctorOtp,
  verifyDoctorOtp,
  setDoctorCredentials,
  loginDoctor,
  resendDoctorOtp,
} = require("../controllers/doctorAuthController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// ADMIN AUTH
// =====================================================

// Register first admin
router.post("/register-admin", registerAdmin);

// Admin login
router.post("/admin/login", adminLogin);

// Get logged-in admin
router.get("/admin/me", protect, getAdminMe);

// Update admin profile
router.put("/admin/profile", protect, updateAdminProfile);

// Logout
router.post("/logout", logout);

// =====================================================
// DOCTOR AUTH
// =====================================================

// Send OTP to doctor email
router.post("/doctor/send-otp", sendDoctorOtp);

// Verify doctor OTP
router.post("/doctor/verify-otp", verifyDoctorOtp);

// Set doctor username/password credentials
router.post("/doctor/set-credentials", setDoctorCredentials);

// Doctor login
router.post("/doctor/login", loginDoctor);

// Resend doctor OTP
router.post("/doctor/resend-otp", resendDoctorOtp);

module.exports = router;