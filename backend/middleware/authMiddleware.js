const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Doctor = require("../models/Doctor");

// ==========================================
// PROTECT
// ==========================================

const protect = (requiredRole = null) => {
  return async (req, res, next) => {
    try {
      let token = null;

      // ==========================================
      // 1. GET TOKEN FROM COOKIE
      // ==========================================

      if (requiredRole === "admin") {
        token = req.cookies?.adminToken || null;
      }

      if (requiredRole === "doctor") {
        token = req.cookies?.doctorToken || null;
      }

      if (requiredRole === "patient") {
        token = req.cookies?.token || null;
      }

      // ==========================================
      // 2. GET TOKEN FROM AUTHORIZATION HEADER
      // ==========================================

      if (!token) {
        const authHeader =
          req.headers.authorization;

        if (
          authHeader &&
          authHeader.startsWith("Bearer ")
        ) {
          token =
            authHeader.split(" ")[1];
        }
      }

      // ==========================================
      // 3. TOKEN MISSING
      // ==========================================

      if (!token) {
        return res.status(401).json({
          success: false,
          message:
            "Not authorized. Token is missing.",
        });
      }

      // ==========================================
      // 4. JWT SECRET CHECK
      // ==========================================

      if (!process.env.JWT_SECRET) {
        console.error(
          "JWT_SECRET is missing"
        );

        return res.status(500).json({
          success: false,
          message:
            "Server configuration error",
        });
      }

      // ==========================================
      // 5. VERIFY TOKEN
      // ==========================================

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // ==========================================
      // 6. CHECK TOKEN PAYLOAD
      // ==========================================

      if (!decoded?.id) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid token payload.",
        });
      }

      // ==========================================
      // 7. CHECK REQUIRED ROLE
      // ==========================================

      if (
        requiredRole &&
        decoded.role !== requiredRole
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You are not authorized to access this resource.",
        });
      }

      // ==========================================
      // 8. ADMIN
      // ==========================================

      if (decoded.role === "admin") {
        const admin =
          await User.findById(
            decoded.id
          ).select("-password");

        if (!admin) {
          return res.status(401).json({
            success: false,
            message:
              "Admin not found.",
          });
        }

        if (admin.role !== "admin") {
          return res.status(403).json({
            success: false,
            message:
              "You are not authorized to access this resource.",
          });
        }

        if (admin.isActive === false) {
          return res.status(403).json({
            success: false,
            message:
              "Your account is inactive.",
          });
        }

        req.user = admin;
        req.userId = admin._id;
        req.userRole = "admin";

        return next();
      }

      // ==========================================
      // 9. DOCTOR
      // ==========================================

      if (decoded.role === "doctor") {
        const doctor =
          await Doctor.findById(
            decoded.id
          );

        if (!doctor) {
          return res.status(401).json({
            success: false,
            message:
              "Doctor not found.",
          });
        }

        if (doctor.status === false) {
          return res.status(403).json({
            success: false,
            message:
              "Doctor account is inactive.",
          });
        }

        req.user = doctor;
        req.userId = doctor._id;
        req.userRole = "doctor";

        return next();
      }

      // ==========================================
      // 10. PATIENT
      // ==========================================

      if (decoded.role === "patient") {
        const patient =
          await User.findById(
            decoded.id
          ).select("-password");

        if (!patient) {
          return res.status(401).json({
            success: false,
            message:
              "Patient not found.",
          });
        }

        if (patient.role !== "patient") {
          return res.status(403).json({
            success: false,
            message:
              "You are not authorized to access this resource.",
          });
        }

        if (patient.isActive === false) {
          return res.status(403).json({
            success: false,
            message:
              "Your account is inactive. Please contact hospital.",
          });
        }

        req.user = patient;
        req.userId = patient._id;
        req.userRole = "patient";

        return next();
      }

      // ==========================================
      // 11. INVALID ROLE
      // ==========================================

      return res.status(403).json({
        success: false,
        message:
          "Invalid user role.",
      });
    } catch (error) {
      console.error(
        "AUTH MIDDLEWARE ERROR:",
        error.message
      );

      // ==========================================
      // TOKEN EXPIRED
      // ==========================================

      if (
        error.name ===
        "TokenExpiredError"
      ) {
        return res.status(401).json({
          success: false,
          message:
            "Token has expired. Please login again.",
        });
      }

      // ==========================================
      // INVALID TOKEN
      // ==========================================

      if (
        error.name ===
        "JsonWebTokenError"
      ) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid token.",
        });
      }

      // ==========================================
      // INVALID OBJECT ID
      // ==========================================

      if (
        error.name ===
        "CastError"
      ) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid user.",
        });
      }

      // ==========================================
      // OTHER ERROR
      // ==========================================

      return res.status(500).json({
        success: false,
        message:
          "Authentication failed.",
      });
    }
  };
};

// ==========================================
// AUTHORIZE ROLE
// ==========================================

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    if (
      !roles.includes(
        req.userRole
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to access this resource.",
      });
    }

    next();
  };
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  protect,
  authorize,
};