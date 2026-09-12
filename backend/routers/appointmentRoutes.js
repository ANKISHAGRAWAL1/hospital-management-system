const express = require("express");

const {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  cancelAppointment,
} = require("../controllers/appointmentController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();


// ======================================================
// PATIENT APPOINTMENT ROUTES
// ======================================================

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