const express = require("express");

const router = express.Router();

const {
  getPatientProfile,
  updatePatientProfile,
} = require("../controllers/patientProfileController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

router.get(
  "/profile",
  protect,
  authorize("patient"),
  getPatientProfile
);

router.put(
  "/profile",
  protect,
  authorize("patient"),
  updatePatientProfile
);

module.exports = router;