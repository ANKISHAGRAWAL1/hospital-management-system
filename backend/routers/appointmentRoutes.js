const express = require("express");

const {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  cancelAppointment,
  getAvailableAppointmentSlots,
} = require("../controllers/appointmentController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ======================================================
// PATIENT APPOINTMENT ROUTES
// ======================================================

// Get available appointment slots
router.get(
  "/available-slots",
  getAvailableAppointmentSlots
);

// Create appointment
router.post(
  "/",
  protect("patient"),
  authorize("patient"),
  createAppointment
);

// Get logged-in patient's all appointments
router.get(
  "/my",
  protect("patient"),
  authorize("patient"),
  getMyAppointments
);

// Get single appointment
router.get(
  "/:id",
  protect("patient"),
  authorize("patient"),
  getAppointmentById
);

// Cancel appointment
router.patch(
  "/:id/cancel",
  protect("patient"),
  authorize("patient"),
  cancelAppointment
);

module.exports = router;