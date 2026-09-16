const express = require("express");

const {
  sendPatientOtp,
  verifyPatientOtp,
  completePatientProfile,
  getPatientMe,
  patientLogout,
  createPatientDependent,
  getMyPatients,
} = require("../controllers/patientAuthController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// PATIENT OTP LOGIN
// =====================================================

// Send OTP
// POST /api/auth/patient/send-otp
router.post(
  "/send-otp",
  sendPatientOtp
);

// Verify OTP
// POST /api/auth/patient/verify-otp
router.post(
  "/verify-otp",
  verifyPatientOtp
);

// =====================================================
// NEW PATIENT PROFILE
// =====================================================

// Complete patient profile after OTP verification
// POST /api/auth/patient/complete-profile
router.post(
  "/complete-profile",
  completePatientProfile
);

// =====================================================
// LOGGED-IN PATIENT
// =====================================================

// Get logged-in patient profile
// GET /api/auth/patient/me
router.get(
  "/me",
  protect("patient"),
  authorize("patient"),
  getPatientMe
);

// =====================================================
// MY PATIENTS
// =====================================================

// Get logged-in patient + added dependent patients
// GET /api/auth/patient/my-patients
router.get(
  "/my-patients",
  protect("patient"),
  authorize("patient"),
  getMyPatients
);

// =====================================================
// ADD NEW PATIENT / DEPENDENT
// =====================================================

// Add another patient under logged-in patient
// POST /api/auth/patient/dependent
router.post(
  "/dependent",
  protect("patient"),
  authorize("patient"),
  createPatientDependent
);

// =====================================================
// PATIENT LOGOUT
// =====================================================

// POST /api/auth/patient/logout
router.post(
  "/logout",
  protect("patient"),
  authorize("patient"),
  patientLogout
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;