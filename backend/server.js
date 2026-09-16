const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

const app = express();

// =====================================================
// CONFIG
// =====================================================

const PORT = process.env.PORT || 5000;

const MONGO_URI =
  process.env.MONGO_URI || process.env.MONGODB_URI;

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:3000";

if (!MONGO_URI) {
  console.error("❌ MongoDB URI is missing");
  process.exit(1);
}

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

// =====================================================
// STATIC FILES
// =====================================================

// General uploads
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// Department images
// Actual folder:
// backend/public/Departments
//
// Frontend image URL:
// http://localhost:5000/Departments/filename.jpg

app.use(
  "/Departments",
  express.static(
    path.join(
      __dirname,
      "public",
      "Departments"
    )
  )
);

// =====================================================
// ROUTES
// =====================================================

// =====================================================
// AUTHENTICATION
// =====================================================

const authRoutes = require(
  "./routers/doctorAuthRoutes"
);

const patientAuthRoutes = require(
  "./routers/patientAuthRoutes"
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/auth/patient",
  patientAuthRoutes
);

// =====================================================
// DEPARTMENTS
// =====================================================

const departmentRoutes = require(
  "./routers/departmentRout"
);

app.use(
  "/api/departments",
  departmentRoutes
);

// =====================================================
// DOCTORS
// =====================================================

const doctorRoutes = require(
  "./routers/doctorRoutes"
);

app.use(
  "/api/doctors",
  doctorRoutes
);

// =====================================================
// DOCTOR DASHBOARD
// =====================================================

const doctorDashboardRoutes = require(
  "./routers/doctorDashboardRoutes"
);

app.use(
  "/api/doctor/dashboard",
  doctorDashboardRoutes
);

// =====================================================
// ROOT
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Hospital Management System API is running",
  });
});

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message:
      `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
  (err, req, res, next) => {
    console.error(
      "❌ Server Error:",
      err
    );

    res.status(
      err.status || 500
    ).json({
      success: false,
      message:
        err.message ||
        "Internal Server Error",
    });
  }
);

// =====================================================
// START SERVER
// =====================================================

const startServer = async () => {
  try {
    await mongoose.connect(
      MONGO_URI
    );

    console.log(
      "✅ MongoDB connected"
    );

    app.listen(
      PORT,
      () => {
        console.log(
          `🚀 Server running on port ${PORT}`
        );
      }
    );
  } catch (error) {
    console.error(
      "❌ MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
};

startServer();