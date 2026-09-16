 
const express = require("express");

const {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctorStatus,
  deleteDoctor,
} = require("../controllers/doctorController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/upload");

const router = express.Router();

// ==========================================
// GET ALL DOCTORS
// GET /api/doctors
// ==========================================

router.get("/", getAllDoctors);

// ==========================================
// UPDATE DOCTOR STATUS
// PATCH /api/doctors/:id/status
// ==========================================

router.patch(
  "/:id/status",
  protect("admin"),
  authorize("admin"),
  updateDoctorStatus
);

// ==========================================
// GET DOCTOR BY ID
// GET /api/doctors/:id
// ==========================================

router.get("/:id", getDoctorById);

// ==========================================
// CREATE DOCTOR
// POST /api/doctors
// TEMPORARILY WITHOUT AUTHENTICATION
// ==========================================

router.post(
  "/",
  upload.single("profile"),
  createDoctor
);

// ==========================================
// DELETE DOCTOR
// DELETE /api/doctors/:id
// ==========================================

router.delete(
  "/:id",
  protect("admin"),
  authorize("admin"),
  deleteDoctor
);

module.exports = router;
 
