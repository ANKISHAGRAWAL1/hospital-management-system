const User = require("../models/User");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

/* =========================================================
   HELPER: GET ADMIN ID
========================================================= */

const getAdminId = (req) => {
  return req.user?._id || req.user?.id;
};

/* =========================================================
   HELPER: VALIDATE ADMIN ID
========================================================= */

const isValidAdminId = (adminId) => {
  return (
    adminId &&
    mongoose.isValidObjectId(adminId)
  );
};

/* =========================================================
   HELPER: DELETE PROFILE IMAGE
========================================================= */

const deleteProfileImageFile = (profileImage) => {
  try {
    if (!profileImage) return;

    const cleanPath = String(profileImage)
      .replace(/^\/+/, "");

    const filePath = path.resolve(
      __dirname,
      "..",
      cleanPath
    );

    const projectRoot = path.resolve(
      __dirname,
      ".."
    );

    if (
      !filePath.startsWith(
        projectRoot + path.sep
      )
    ) {
      console.error(
        "Invalid profile image path:",
        profileImage
      );

      return;
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);

      console.log(
        "Old profile image deleted:",
        filePath
      );
    }
  } catch (error) {
    console.error(
      "Delete profile image file error:",
      error.message
    );
  }
};

/* =========================================================
   HELPER: ADMIN RESPONSE
========================================================= */

const formatAdminResponse = (admin) => {
  return {
    id: admin._id,
    name: admin.name,
    email: admin.email,
    phone: admin.phone,
    profileImage:
      admin.profileImage || null,
    role: admin.role,
    isActive: admin.isActive,
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
  };
};

/* =========================================================
   GET ADMIN PROFILE
========================================================= */

const getAdminProfile = async (req, res) => {
  try {
    console.log(
      "========== GET ADMIN PROFILE =========="
    );

    const adminId = getAdminId(req);

    console.log(
      "REQ.USER:",
      req.user
    );

    console.log(
      "ADMIN ID:",
      adminId
    );

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message:
          "Unauthorized. Admin ID not found",
      });
    }

    if (!isValidAdminId(adminId)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid admin ID",
      });
    }

    const admin =
      await User.findOne({
        _id: adminId,
        role: "admin",
      }).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Admin profile fetched successfully",

      admin:
        formatAdminResponse(admin),
    });
  } catch (error) {
    console.error(
      "Get admin profile error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch admin profile",
    });
  }
};

/* =========================================================
   UPDATE ADMIN PROFILE
========================================================= */

const updateAdminProfile = async (
  req,
  res
) => {
  try {
    console.log(
      "========== UPDATE ADMIN PROFILE =========="
    );

    console.log(
      "REQ.USER:",
      req.user
    );

    console.log(
      "REQ.BODY:",
      req.body
    );

    const adminId = getAdminId(req);

    console.log(
      "ADMIN ID:",
      adminId
    );

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message:
          "Unauthorized. Admin ID not found",
      });
    }

    if (!isValidAdminId(adminId)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid admin ID",
      });
    }

    const {
      name,
      email,
      phone,
    } = req.body;

    const admin =
      await User.findOne({
        _id: adminId,
        role: "admin",
      });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    /* =====================================================
       NAME
    ===================================================== */

    if (name !== undefined) {
      const cleanName =
        String(name).trim();

      if (!cleanName) {
        return res.status(400).json({
          success: false,
          message:
            "Name is required",
        });
      }

      if (cleanName.length < 2) {
        return res.status(400).json({
          success: false,
          message:
            "Name must be at least 2 characters",
        });
      }

      admin.name = cleanName;
    }

    /* =====================================================
       EMAIL
    ===================================================== */

    if (email !== undefined) {
      const cleanEmail =
        String(email)
          .trim()
          .toLowerCase();

      if (!cleanEmail) {
        return res.status(400).json({
          success: false,
          message:
            "Email is required",
        });
      }

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(cleanEmail)) {
        return res.status(400).json({
          success: false,
          message:
            "Please enter a valid email address",
        });
      }

      const existingEmail =
        await User.findOne({
          email: cleanEmail,
          _id: {
            $ne: admin._id,
          },
        });

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message:
            "Email already exists",
        });
      }

      admin.email = cleanEmail;
    }

    /* =====================================================
       PHONE
    ===================================================== */

    if (phone !== undefined) {
      const cleanPhone =
        String(phone).trim();

      if (!cleanPhone) {
        return res.status(400).json({
          success: false,
          message:
            "Phone number is required",
        });
      }

      const phoneRegex =
        /^[6-9]\d{9}$/;

      if (!phoneRegex.test(cleanPhone)) {
        return res.status(400).json({
          success: false,
          message:
            "Please enter a valid 10 digit phone number",
        });
      }

      const existingPhone =
        await User.findOne({
          phone: cleanPhone,
          _id: {
            $ne: admin._id,
          },
        });

      if (existingPhone) {
        return res.status(409).json({
          success: false,
          message:
            "Phone number already exists",
        });
      }

      admin.phone = cleanPhone;
    }

    /* =====================================================
       SAVE
    ===================================================== */

    await admin.save();

    console.log(
      "ADMIN UPDATED SUCCESSFULLY:",
      admin._id
    );

    return res.status(200).json({
      success: true,
      message:
        "Admin profile updated successfully",

      admin:
        formatAdminResponse(admin),
    });
  } catch (error) {
    console.error(
      "================================="
    );

    console.error(
      "UPDATE ADMIN PROFILE ERROR:"
    );

    console.error(error);

    console.error(
      "================================="
    );

    /* =====================================================
       DUPLICATE KEY ERROR
    ===================================================== */

    if (error.code === 11000) {
      const duplicateField =
        Object.keys(
          error.keyPattern || {}
        )[0];

      if (
        duplicateField ===
        "email"
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Email already exists",
        });
      }

      if (
        duplicateField ===
        "phone"
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Phone number already exists",
        });
      }

      return res.status(409).json({
        success: false,
        message:
          "Email or phone already exists",
      });
    }

    /* =====================================================
       VALIDATION ERROR
    ===================================================== */

    if (
      error.name ===
      "ValidationError"
    ) {
      const messages =
        Object.values(
          error.errors
        ).map(
          (err) =>
            err.message
        );

      return res.status(400).json({
        success: false,
        message:
          messages.join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to update admin profile",
    });
  }
};

/* =========================================================
   UPLOAD ADMIN PROFILE IMAGE
========================================================= */

const uploadAdminProfileImage = async (
  req,
  res
) => {
  let uploadedFilePath = null;

  try {
    console.log(
      "========== UPLOAD ADMIN PROFILE IMAGE =========="
    );

    console.log(
      "REQ.USER:",
      req.user
    );

    console.log(
      "REQ.FILE:",
      req.file
    );

    const adminId = getAdminId(req);

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message:
          "Unauthorized. Admin ID not found",
      });
    }

    if (!isValidAdminId(adminId)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid admin ID",
      });
    }

    /* =====================================================
       CHECK FILE
    ===================================================== */

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Please select a profile image",
      });
    }

    uploadedFilePath =
      req.file.path;

    /* =====================================================
       FIND ADMIN
    ===================================================== */

    const admin =
      await User.findOne({
        _id: adminId,
        role: "admin",
      });

    if (!admin) {
      if (
        uploadedFilePath &&
        fs.existsSync(
          uploadedFilePath
        )
      ) {
        fs.unlinkSync(
          uploadedFilePath
        );
      }

      return res.status(404).json({
        success: false,
        message:
          "Admin not found",
      });
    }

    /* =====================================================
       DELETE OLD IMAGE
    ===================================================== */

    const oldProfileImage =
      admin.profileImage;

    /* =====================================================
       CREATE IMAGE URL
    ===================================================== */

    const profileImage =
      `/uploads/admin/${req.file.filename}`;

    admin.profileImage =
      profileImage;

    await admin.save();

    /* =====================================================
       DELETE OLD IMAGE AFTER
       SUCCESSFUL DATABASE SAVE
    ===================================================== */

    if (
      oldProfileImage &&
      oldProfileImage !==
        profileImage
    ) {
      deleteProfileImageFile(
        oldProfileImage
      );
    }

    console.log(
      "PROFILE IMAGE UPDATED:",
      profileImage
    );

    return res.status(200).json({
      success: true,
      message:
        "Profile image uploaded successfully",

      profileImage:
        admin.profileImage,

      admin:
        formatAdminResponse(admin),
    });
  } catch (error) {
    console.error(
      "Upload admin profile image error:",
      error
    );

    /* =====================================================
       DELETE NEW FILE IF DATABASE SAVE FAILED
    ===================================================== */

    if (
      uploadedFilePath &&
      fs.existsSync(
        uploadedFilePath
      )
    ) {
      try {
        fs.unlinkSync(
          uploadedFilePath
        );

        console.log(
          "New uploaded image deleted after failure"
        );
      } catch (deleteError) {
        console.error(
          "Unable to delete uploaded file:",
          deleteError
        );
      }
    }

    if (
      error.code === 11000
    ) {
      return res.status(409).json({
        success: false,
        message:
          "Profile information already exists",
      });
    }

    if (
      error.name ===
      "ValidationError"
    ) {
      const messages =
        Object.values(
          error.errors
        ).map(
          (err) =>
            err.message
        );

      return res.status(400).json({
        success: false,
        message:
          messages.join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to upload profile image",
    });
  }
};

/* =========================================================
   REMOVE ADMIN PROFILE IMAGE
========================================================= */

const removeAdminProfileImage = async (
  req,
  res
) => {
  try {
    console.log(
      "========== REMOVE ADMIN PROFILE IMAGE =========="
    );

    const adminId = getAdminId(req);

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message:
          "Unauthorized. Admin ID not found",
      });
    }

    if (!isValidAdminId(adminId)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid admin ID",
      });
    }

    const admin =
      await User.findOne({
        _id: adminId,
        role: "admin",
      });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message:
          "Admin not found",
      });
    }

    const oldProfileImage =
      admin.profileImage;

    admin.profileImage = null;

    await admin.save();

    /* =====================================================
       DELETE FILE AFTER DB SUCCESS
    ===================================================== */

    if (oldProfileImage) {
      deleteProfileImageFile(
        oldProfileImage
      );
    }

    return res.status(200).json({
      success: true,
      message:
        "Profile image removed successfully",
      profileImage: null,
    });
  } catch (error) {
    console.error(
      "Remove admin profile image error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to remove profile image",
    });
  }
};

/* =========================================================
   CHANGE ADMIN PASSWORD
========================================================= */

const changeAdminPassword = async (
  req,
  res
) => {
  try {
    console.log(
      "========== CHANGE ADMIN PASSWORD =========="
    );

    const adminId =
      getAdminId(req);

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message:
          "Unauthorized. Admin ID not found",
      });
    }

    if (!isValidAdminId(adminId)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid admin ID",
      });
    }

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    /* =====================================================
       REQUIRED FIELDS
    ===================================================== */

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All password fields are required",
      });
    }

    /* =====================================================
       FIND ADMIN
    ===================================================== */

    const admin =
      await User.findOne({
        _id: adminId,
        role: "admin",
      });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message:
          "Admin not found",
      });
    }

    /* =====================================================
       CHECK PASSWORD EXISTS
    ===================================================== */

    if (!admin.password) {
      return res.status(400).json({
        success: false,
        message:
          "Admin password is not configured",
      });
    }

    /* =====================================================
       CURRENT PASSWORD
    ===================================================== */

    const isMatch =
      await bcrypt.compare(
        currentPassword,
        admin.password
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Current password is incorrect",
      });
    }

    /* =====================================================
       NEW PASSWORD LENGTH
    ===================================================== */

    if (
      String(newPassword).length < 6
    ) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 6 characters",
      });
    }

    /* =====================================================
       CONFIRM PASSWORD
    ===================================================== */

    if (
      newPassword !==
      confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Passwords do not match",
      });
    }

    /* =====================================================
       SAME PASSWORD CHECK
    ===================================================== */

    const isSamePassword =
      await bcrypt.compare(
        newPassword,
        admin.password
      );

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from current password",
      });