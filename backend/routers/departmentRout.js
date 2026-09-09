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
  protect,
  authorize("admin"),
  getAllDepartments
);


// Get single department
router.get(
  "/:id",
  protect,
  authorize("admin"),
  getDepartmentById
);


// Create department
router.post(
  "/",
  protect,
  authorize("admin"),
  createDepartment
);


// Update complete department
router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateDepartment
);


// Update department status
router.patch(
  "/:id/status",
  protect,
  authorize("admin"),
  updateDepartmentStatus
);


// Delete department
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteDepartment
);


module.exports = router;