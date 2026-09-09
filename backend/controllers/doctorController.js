const Doctor = require("../models/Doctor");

const {
  sendBadrequest,
  sendConflict,
  sendsuccess,
  sendcreated,
  sendNotfound,
  sendServerError,
} = require("../utils/res");

// =====================================================
// CREATE DOCTOR
// =====================================================

const createDoctor = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      dateOfBirth,
      specialization,
      department,
      qualification,
      experience,
      consultationFee,
      licenseNumber,
      availableDays,
      startTime,
      endTime,
      appointmentDuration,
      fullAddress,
      city,
      state,
      pincode,
    } = req.body;

    // =========================
    // REQUIRED VALIDATION
    // =========================

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !gender ||
      !dateOfBirth ||
      !specialization ||
      !department ||
      !qualification ||
      !licenseNumber ||
      !availableDays ||
      !startTime ||
      !endTime ||
      !fullAddress ||
      !city ||
      !state ||
      !pincode
    ) {
      return sendBadrequest(
        res,
        "Please provide all required doctor details"
      );
    }

    // =========================
    // NAME VALIDATION
    // =========================

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();

    if (!/^[A-Za-z ]+$/.test(cleanFirstName)) {
      return sendBadrequest(
        res,
        "First name can contain only letters"
      );
    }

    if (!/^[A-Za-z ]+$/.test(cleanLastName)) {
      return sendBadrequest(
        res,
        "Last name can contain only letters"
      );
    }

    // =========================
    // EMAIL VALIDATION
    // =========================

    const cleanEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return sendBadrequest(
        res,
        "Enter valid email address"
      );
    }

    // =========================
    // PHONE VALIDATION
    // =========================

    const cleanPhone = phone.trim();

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return sendBadrequest(
        res,
        "Enter valid 10 digit mobile number"
      );
    }

    // =========================
    // GENDER VALIDATION
    // =========================

    if (!["Male", "Female", "Other"].includes(gender)) {
      return sendBadrequest(
        res,
        "Invalid gender"
      );
    }

    // =========================
    // DATE OF BIRTH
    // =========================

    const dob = new Date(dateOfBirth);

    if (isNaN(dob.getTime())) {
      return sendBadrequest(
        res,
        "Invalid date of birth"
      );
    }

    if (dob >= new Date()) {
      return sendBadrequest(
        res,
        "Date of birth must be in the past"
      );
    }

    // =========================
    // DEPARTMENT
    // =========================

    const cleanDepartment = department.trim();

    if (!cleanDepartment) {
      return sendBadrequest(
        res,
        "Department is required"
      );
    }

    // =========================
    // PROFESSIONAL DETAILS
    // =========================

    const cleanSpecialization = specialization.trim();
    const cleanQualification = qualification.trim();
    const cleanLicenseNumber = licenseNumber.trim();

    if (!cleanSpecialization) {
      return sendBadrequest(
        res,
        "Specialization is required"
      );
    }

    if (!cleanQualification) {
      return sendBadrequest(
        res,
        "Qualification is required"
      );
    }

    if (!cleanLicenseNumber) {
      return sendBadrequest(
        res,
        "License number is required"
      );
    }

    // =========================
    // EXPERIENCE
    // =========================

    const doctorExperience = Number(experience);

    if (
      isNaN(doctorExperience) ||
      doctorExperience < 0
    ) {
      return sendBadrequest(
        res,
        "Enter valid experience"
      );
    }

    // =========================
    // CONSULTATION FEE
    // =========================

    const fee = Number(consultationFee);

    if (isNaN(fee) || fee < 0) {
      return sendBadrequest(
        res,
        "Enter valid consultation fee"
      );
    }

    // =========================
    // AVAILABLE DAYS
    // =========================

    let days = availableDays;

    if (!Array.isArray(days)) {
      days = [days];
    }

    days = days
      .map((day) => day.trim())
      .filter(Boolean);

    const validDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    if (days.length === 0) {
      return sendBadrequest(
        res,
        "Please select at least one available day"
      );
    }

    const invalidDay = days.some(
      (day) => !validDays.includes(day)
    );

    if (invalidDay) {
      return sendBadrequest(
        res,
        "Invalid available day"
      );
    }

    // =========================
    // TIME VALIDATION
    // =========================

    const cleanStartTime = startTime.trim();
    const cleanEndTime = endTime.trim();

    const timeRegex =
      /^([01]\d|2[0-3]):[0-5]\d$/;

    if (!timeRegex.test(cleanStartTime)) {
      return sendBadrequest(
        res,
        "Invalid start time"
      );
    }

    if (!timeRegex.test(cleanEndTime)) {
      return sendBadrequest(
        res,
        "Invalid end time"
      );
    }

    if (cleanStartTime >= cleanEndTime) {
      return sendBadrequest(
        res,
        "End time must be greater than start time"
      );
    }

    // =========================
    // APPOINTMENT DURATION
    // =========================

    const duration = Number(
      appointmentDuration
    );

    if (![15, 30, 45, 60].includes(duration)) {
      return sendBadrequest(
        res,
        "Appointment duration must be 15, 30, 45 or 60 minutes"
      );
    }

    // =========================
    // ADDRESS
    // =========================

    const cleanFullAddress = fullAddress.trim();
    const cleanCity = city.trim();
    const cleanState = state.trim();
    const cleanPincode = pincode.trim();

    if (!cleanFullAddress) {
      return sendBadrequest(
        res,
        "Address is required"
      );
    }

    if (!cleanCity) {
      return sendBadrequest(
        res,
        "City is required"
      );
    }

    if (!cleanState) {
      return sendBadrequest(
        res,
        "State is required"
      );
    }

    if (!/^\d{6}$/.test(cleanPincode)) {
      return sendBadrequest(
        res,
        "Enter valid 6 digit pincode"
      );
    }

    // =========================
    // PROFILE IMAGE
    // =========================

    if (req.file) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(req.file.mimetype)) {
        return sendBadrequest(
          res,
          "Profile image must be JPG, PNG or WEBP"
        );
      }

      if (req.file.size > 2 * 1024 * 1024) {
        return sendBadrequest(
          res,
          "Profile image must be less than 2MB"
        );
      }
    }

    // =========================
    // CHECK EMAIL
    // =========================

    const emailExists = await Doctor.findOne({
      email: cleanEmail,
    });

    if (emailExists) {
      return sendConflict(
        res,
        "Doctor email already exists"
      );
    }

    // =========================
    // CHECK PHONE
    // =========================

    const phoneExists = await Doctor.findOne({
      phone: cleanPhone,
    });

    if (phoneExists) {
      return sendConflict(
        res,
        "Doctor phone number already exists"
      );
    }

    // =========================
    // CHECK LICENSE
    // =========================

    const licenseExists = await Doctor.findOne({
      licenseNumber: cleanLicenseNumber,
    });

    if (licenseExists) {
      return sendConflict(
        res,
        "License number already exists"
      );
    }

    // =========================
    // CREATE DOCTOR
    // =========================

    const doctor = await Doctor.create({
      profileImage: req.file
        ? `/uploads/doctors/${req.file.filename}`
        : "",

      firstName: cleanFirstName,
      lastName: cleanLastName,

      email: cleanEmail,
      phone: cleanPhone,

      gender,
      dateOfBirth: dob,

      specialization: cleanSpecialization,

      department: cleanDepartment,

      qualification: cleanQualification,

      experience: doctorExperience,

      consultationFee: fee,

      licenseNumber: cleanLicenseNumber,

      // IMPORTANT
      // Doctor model ke according direct fields
      availableDays: days,
      startTime: cleanStartTime,
      endTime: cleanEndTime,
      appointmentDuration: duration,

      status: true,

      address: {
        fullAddress: cleanFullAddress,
        city: cleanCity,
        state: cleanState,
        pincode: cleanPincode,
      },
    });

    // =========================
    // POPULATE DEPARTMENT
    // =========================

    const result = await Doctor.findById(
      doctor._id
    ).populate(
      "department",
      "name code"
    );

    // =========================
    // SUCCESS
    // =========================

    return sendcreated(
      res,
      "Doctor created successfully",
      result
    );

  } catch (error) {
  console.error("CREATE DOCTOR ERROR:", error);

  return res.status(500).json({
    success: false,
    message: error.message,
  });
}
};

// =====================================================
// GET ALL DOCTORS
// =====================================================

const getAllDoctors = async (req, res) => {
  try {

    const doctors = await Doctor.find()
      .populate(
        "department",
        "name code"
      )
      .sort({
        createdAt: -1,
      });

    return sendsuccess(
      res,
      "Doctors fetched successfully",
      doctors
    );

  } catch (error) {

    console.error(
      "Get Doctors Error:",
      error
    );

    return sendServerError(
      res,
      error.message
    );
  }
};

// =====================================================
// GET DOCTOR BY ID
// =====================================================

const getDoctorById = async (req, res) => {
  try {

    const doctor = await Doctor.findById(
      req.params.id
    ).populate(
      "department",
      "name code"
    );

    if (!doctor) {
      return sendNotfound(
        res,
        "Doctor not found"
      );
    }

    return sendsuccess(
      res,
      "Doctor fetched successfully",
      doctor
    );

  } catch (error) {

    console.error(
      "Get Doctor By ID Error:",
      error
    );

    return sendServerError(
      res,
      error.message
    );
  }
};

// =====================================================
// UPDATE DOCTOR STATUS
// =====================================================

const updateDoctorStatus = async (req, res) => {
  try {

    const { status } = req.body;

    if (typeof status !== "boolean") {
      return sendBadrequest(
        res,
        "Status must be true or false"
      );
    }

    const doctor =
      await Doctor.findByIdAndUpdate(
        req.params.id,
        {
          status,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!doctor) {
      return sendNotfound(
        res,
        "Doctor not found"
      );
    }

    return sendsuccess(
      res,
      "Doctor status updated successfully",
      doctor
    );

  } catch (error) {

    console.error(
      "Update Doctor Status Error:",
      error
    );

    return sendServerError(
      res,
      error.message
    );
  }
};

// =====================================================
// DELETE DOCTOR
// =====================================================

const deleteDoctor = async (req, res) => {
  try {

    const doctor =
      await Doctor.findByIdAndDelete(
        req.params.id
      );

    if (!doctor) {
      return sendNotfound(
        res,
        "Doctor not found"
      );
    }

    return sendsuccess(
      res,
      "Doctor deleted successfully",
      {}
    );

  } catch (error) {

    console.error(
      "Delete Doctor Error:",
      error
    );

    return sendServerError(
      res,
      error.message
    );
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctorStatus,
  deleteDoctor,
};