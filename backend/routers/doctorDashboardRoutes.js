const express = require("express");

const {
  getDoctorDashboard,
} = require("../controllers/doctorDashboardController");

const router = express.Router();

router.get("/", getDoctorDashboard);

module.exports = router;