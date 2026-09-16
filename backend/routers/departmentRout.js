const express = require("express");
const fileuploader = require("express-fileupload");

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

// =====================================================
// PUBLIC DEPARTMENT ROUTES
// =====================================================

// Get all departments
// GET /api/departments
router.get(
  "/",
  getAllDepartments
);

// Get single department
// GET /api/departments/:id
router.get(
  "/:id",
  getDepartmentById
);

// =====================================================
// ADMIN DEPARTMENT ROUTES
// =====================================================

// Create department
// POST /api/departments/creat
router.post(
  "/creat",
  fileuploader({
    createParentPath: true,
  }),
  protect("admin"),
  authorize("admin"),
  createDepartment
);

// Update complete department
// PUT /api/departments/:id
router.put(
  "/:id",
  fileuploader({
    createParentPath: true,
  }),
  protect("admin"),
  authorize("admin"),
  updateDepartment
);

// Update department status
// PATCH /api/departments/:id/status
router.patch(
  "/:id/status",
  protect("admin"),
  authorize("admin"),
  updateDepartmentStatus
);

// Delete department
// DELETE /api/departments/:id
router.delete(
  "/:id",
  protect("admin"),
  authorize("admin"),
  deleteDepartment
);

module.exports = router;