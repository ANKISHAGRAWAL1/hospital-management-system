const express = require("express");

const {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  updateDepartmentStatus,
  deleteDepartment,
} = require("../controllers/departtmentController.js");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware.js");

const router = express.Router();

// Get all departments
router.get(
  "/",
  protect("admin"),
  authorize("admin"),
  getAllDepartments
);

// Get single department
router.get(
  "/:id",
  protect("admin"),
  authorize("admin"),
  getDepartmentById
);

// Create department
router.post(
  "/",
  protect("admin"),
  authorize("admin"),
  createDepartment
);

// Update complete department
router.put(
  "/:id",
  protect("admin"),
  authorize("admin"),
  updateDepartment
);

// Update department status
router.patch(
  "/:id/status",
  protect("admin"),
  authorize("admin"),
  updateDepartmentStatus
);

// Delete department
router.delete(
  "/:id",
  protect("admin"),
  authorize("admin"),
  deleteDepartment
);

module.exports = router;