const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

// =====================================================
// Helper: Normalize Email
// =====================================================
const normalizeEmail = (email) => {
  return String(email || "").trim().toLowerCase();
};

// =====================================================
// Helper: Validate MongoDB ObjectId
// =====================================================
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// =====================================================
// CREATE USER / PATIENT
// =====================================================
const createUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // -----------------------------
    // Validation
    // -----------------------------
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const cleanName = String(name).trim();
    const cleanEmail = normalizeEmail(email);
    const cleanPhone = phone ? String(phone).trim() : "";

    if (cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must contain at least 2 characters",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (String(password).length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // -----------------------------
    // Check Existing User
    // -----------------------------
    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // -----------------------------
    // Hash Password
    // -----------------------------
    const hashedPassword = await bcrypt.hash(
      String(password),
      12
    );

    // -----------------------------
    // Create Patient
    // -----------------------------
    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      password: hashedPassword,
      role: "patient",
    });

    return res.status(201).json({
      success: true,
      message: "Patient registered successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);

    // Duplicate MongoDB key
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
};

// =====================================================
// GET ALL USERS / PATIENTS
// =====================================================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Get all users error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// =====================================================
// GET SINGLE USER
// =====================================================
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // -----------------------------
    // Validate ID
    // -----------------------------
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // -----------------------------
    // Find User
    // -----------------------------
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get user by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

// =====================================================
// UPDATE USER
// =====================================================
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // -----------------------------
    // Validate ID
    // -----------------------------
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const {
      name,
      email,
      phone,
      role,
      password,
      ...otherData
    } = req.body;

    // -----------------------------
    // Prevent Role / Password Update
    // -----------------------------
    if (role !== undefined) {
      console.log(
        "Role update ignored for user:",
        id
      );
    }

    if (password !== undefined) {
      console.log(
        "Password update ignored in normal user update:",
        id
      );
    }

    // -----------------------------
    // Build Update Object
    // -----------------------------
    const updateData = {
      ...otherData,
    };

    if (name !== undefined) {
      const cleanName = String(name).trim();

      if (cleanName.length < 2) {
        return res.status(400).json({
          success: false,
          message: "Name must contain at least 2 characters",
        });
      }

      updateData.name = cleanName;
    }

    if (email !== undefined) {
      const cleanEmail = normalizeEmail(email);

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid email address",
        });
      }

      // Check duplicate email
      const existingUser = await User.findOne({
        email: cleanEmail,
        _id: { $ne: id },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Another user already exists with this email",
        });
      }

      updateData.email = cleanEmail;
    }

    if (phone !== undefined) {
      updateData.phone = String(phone).trim();
    }

    // -----------------------------
    // Update User
    // -----------------------------
    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update user error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};

// =====================================================
// DELETE USER
// =====================================================
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // -----------------------------
    // Validate ID
    // -----------------------------
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // -----------------------------
    // Find User
    // -----------------------------
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // -----------------------------
    // Prevent Admin Deletion
    // -----------------------------
    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin user cannot be deleted",
      });
    }

    // -----------------------------
    // Delete
    // -----------------------------
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================
module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};