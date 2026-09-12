const express = require("express");

const router = express.Router();

// ======================================================
// CONTROLLERS
// ======================================================

const {
  getAdminProfile,
  updateAdminProfile,
  uploadAdminProfileImage,
  removeAdminProfileImage,
  changeAdminPassword,
} = require("../controllers/adminControllerProfile");

// ======================================================
// AUTH MIDDLEWARE
// ======================================================

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// ======================================================
// PROFILE IMAGE UPLOAD
// ======================================================

const upload = require("../middleware/upload");

// ======================================================
// ADMIN PROFILE ROUTES
// ======================================================

// ======================================================
// 1. GET ADMIN PROFILE
// ======================================================
// GET /api/admin/profile

router.get(
  "/profile",
  protect,
  authorize("admin"),
  getAdminProfile
);

// ======================================================
// 2. UPDATE ADMIN PROFILE
// ======================================================
// PUT /api/admin/profile
//
// Body:
// {
//   name,
//   email,
//   phone
// }

router.put(
  "/profile",
  protect,
  authorize("admin"),
  updateAdminProfile
);

// ======================================================
// 3. UPLOAD / CHANGE PROFILE IMAGE
// ======================================================
// POST /api/admin/profile/image
//
// Content-Type:
// multipart/form-data
//
// Field name:
// profileImage

router.post(
  "/profile/image",
  protect,
  authorize("admin"),
  upload.single("profileImage"),
  uploadAdminProfileImage
);

// ======================================================
// 4. REMOVE PROFILE IMAGE
// ======================================================
// DELETE /api/admin/profile/image

router.delete(
  "/profile/image",
  protect,
  authorize("admin"),
  removeAdminProfileImage
);

// ======================================================
// 5. CHANGE ADMIN PASSWORD
// ======================================================
// PUT /api/admin/profile/password
//
// Body:
// {
//   currentPassword,
//   newPassword,
//   confirmPassword
// }

router.put(
  "/profile/password",
  protect,
  authorize("admin"),
  changeAdminPassword
);

// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;