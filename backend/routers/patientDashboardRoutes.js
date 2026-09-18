const express = require("express");

const router = express.Router();

const {
  getPatientDashboard,
  getPatientAppointments,
  getPatientAppointmentById,
  cancelPatientAppointment,
} = require("../controllers/patientDashboardController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

router.get(
  "/",
  protect("patient"),
  authorize("patient"),
  getPatientDashboard
);

router.get(
  "/appointments",
  protect("patient"),
  authorize("patient"),
  getPatientAppointments
);

router.get(
  "/appointments/:appointmentId",
  protect("patient"),
  authorize("patient"),
  getPatientAppointmentById
);

router.patch(
  "/appointments/:appointmentId/cancel",
  protect("patient"),
  authorize("patient"),
  cancelPatientAppointment
);

module.exports = router;