const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Doctor = require("../models/Doctor");

// ==========================================
// PROTECT
// ==========================================
const protect = async (req, res, next) => {
  try {
    let token;

    // ==========================================
    // 1. GET TOKEN FROM HTTP-ONLY COOKIE
    // ==========================================
    if (req.cookies) {
      token =
        req.cookies.adminToken ||
        req.cookies.doctorToken ||
        req.cookies.token;
    }

    // ==========================================
    // 2. FALLBACK: AUTHORIZATION HEADER
    // ==========================================
    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ==========================================
    // TOKEN MISSING
    // ==========================================
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Token is missing.",
      });
    }

    // ==========================================
    // VERIFY JWT
    // ==========================================
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    let account;

    // ==========================================
    // ADMIN
    // ==========================================
    if (decoded.role === "admin") {
      account = await User.findById(decoded.id).select(
        "-password"
      );
    }

    // ==========================================
    // DOCTOR
    // ==========================================
    else if (decoded.role === "doctor") {
      account = await Doctor.findById(decoded.id).select(
        "-password"
      );
    }

    // ==========================================
    // UNKNOWN ROLE
    // ==========================================
    else {
      return res.status(403).json({
        success: false,
        message: "Invalid user role.",
      });
    }

    // ==========================================
    // ACCOUNT NOT FOUND
    // ==========================================
    if (!account) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    // ==========================================
    // ADMIN ACTIVE CHECK
    // ==========================================
    if (decoded.role === "admin") {
      if (!account.isActive) {
        return res.status(403).json({
          success: false,
          message: "Your account is inactive.",
        });
      }
    }

    // ==========================================
    // DOCTOR ACTIVE CHECK
    // ==========================================
    if (decoded.role === "doctor") {
      if (!account.status) {
        return res.status(403).json({
          success: false,
          message: "Doctor account is inactive.",
        });
      }
    }

    // ==========================================
    // ATTACH USER
    // ==========================================
    req.user = account;

    // ==========================================
    // ATTACH ROLE
    // ==========================================
    req.userRole = decoded.role;

    // ==========================================
    // NEXT
    // ==========================================
    next();

  } catch (error) {
    console.error(
      "Auth Middleware Error:",
      error.message
    );

    // ==========================================
    // EXPIRED TOKEN
    // ==========================================
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please login again.",
      });
    }

    // ==========================================
    // INVALID TOKEN
    // ==========================================
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    // ==========================================
    // OTHER ERROR
    // ==========================================
    return res.status(401).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};


// ==========================================
// AUTHORIZE ROLE
// ==========================================
const authorize = (...roles) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to access this resource.",
      });
    }

    next();
  };
};


module.exports = {
  protect,
  authorize,
};