require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

// ===============================
// ROUTES
// ===============================
const departmentRoutes = require("./routers/departmentRout");
const doctorRoutes = require("./routers/doctorRoutes");
const authRoutes = require("./routers/doctorAuthRoutes");
const adminProfileRoutes = require("./routers/profileAdminRouter");
const doctorDashboardRoutes = require("./routers/doctorDashboardRoutes");
const appointmentRoutes = require("./routers/appointmentRoutes");

// ===============================
// APP
// ===============================
const app = express();

// ===============================
// DATABASE
// ===============================
connectDB();

// ===============================
// MIDDLEWARE
// ===============================

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// STATIC UPLOADS
// ===============================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ===============================
// API ROUTES
// ===============================

// Departments
app.use("/api/departments", departmentRoutes);

// Doctors
app.use("/api/doctors", doctorRoutes);

// Authentication
app.use("/api/auth", authRoutes);

// Admin Profile
app.use("/api/admin", adminProfileRoutes);

// Doctor Dashboard
app.use(
  "/api/doctor/dashboard",
  doctorDashboardRoutes
);



app.use(
  "/api/appointments",
  appointmentRoutes
);

// ===============================
// HEALTH CHECK
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hospital API is running",
  });
});

// ===============================
// SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});