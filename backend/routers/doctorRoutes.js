const express = require("express");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctorStatus,
  deleteDoctor,
} = require("../controllers/doctorController");

const uploadDoctor = require("../middleware/uploadDoctor");

const router = express.Router();

// CREATE DOCTOR
// POST /api/doctors
router.post("/", protect,
  authorize("admin"),
  uploadDoctor.single("profileImage"),
  createDoctor
);

// GET ALL DOCTORS
router.get(
  "/",
  protect,
  authorize("admin"),
  getAllDoctors
);

// GET DOCTOR BY ID
router.get(
  "/:id",
  protect,
  authorize("admin"),
  getDoctorById
);

// UPDATE DOCTOR STATUS
router.patch(
  "/:id/status",
  protect,
  authorize("admin"),
  updateDoctorStatus
);

// DELETE DOCTOR
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteDoctor
);

// DOCTOR PROFILE
router.get(
  "/profile",
  protect,
  authorize("doctor"),
  async (req, res) => {
    try {
      return res.status(200).json({
        success: true,
        message: "Doctor profile accessed successfully",
        user: req.user,
      });
    } catch (error) {
      console.error("Doctor Profile Error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to access doctor profile",
      });
    }
  }
);

module.exports = router;