const User = require("../models/User");
const { uniquename } = require("../utils/helper");

const getPatientProfile = async (req, res) => {
  try {
    const patient = await User.findOne({
      _id: req.user._id,
      role: "patient",
    }).select("-password");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient profile fetched successfully",
      data: patient,
    });
  } catch (error) {
    console.log("GET PATIENT PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const updatePatientProfile = async (req, res) => {
  try {
    const patient = await User.findOne({
      _id: req.user._id,
      role: "patient",
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    const {
      name,
      email,
      phone,
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship,
    } = req.body;

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Patient name is required",
        });
      }

      patient.name = name.trim();
    }

    if (email !== undefined) {
      const cleanEmail = email.trim().toLowerCase();

      if (!cleanEmail) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      const existingUser = await User.findOne({
        email: cleanEmail,
        _id: { $ne: patient._id },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email is already registered",
        });
      }

      patient.email = cleanEmail;
    }

    if (phone !== undefined) {
      patient.phone = phone.trim();
    }

    if (dateOfBirth !== undefined) {
      patient.dateOfBirth = dateOfBirth || null;
    }

    if (gender !== undefined) {
      patient.gender = gender || null;
    }

    if (bloodGroup !== undefined) {
      patient.bloodGroup = bloodGroup || null;
    }

    if (address !== undefined) {
      patient.address = address.trim();
    }

    if (
      emergencyContactName !== undefined ||
      emergencyContactPhone !== undefined ||
      emergencyContactRelationship !== undefined
    ) {
      patient.emergencyContact = {
        name:
          emergencyContactName !== undefined
            ? emergencyContactName.trim()
            : patient.emergencyContact?.name || "",

        phone:
          emergencyContactPhone !== undefined
            ? emergencyContactPhone.trim()
            : patient.emergencyContact?.phone || "",

        relationship:
          emergencyContactRelationship !== undefined
            ? emergencyContactRelationship.trim()
            : patient.emergencyContact?.relationship || "",
      };
    }

    if (req.files?.profileImage) {
      const image = req.files.profileImage;
      const imageName = uniquename(image.name);

      await image.mv(`public/uploads/patients/${imageName}`);

      patient.profileImage = imageName;
    }

    await patient.save();

    const updatedPatient = await User.findById(patient._id).select(
      "-password"
    );

    return res.status(200).json({
      success: true,
      message: "Patient profile updated successfully",
      data: updatedPatient,
    });
  } catch (error) {
    console.log("UPDATE PATIENT PROFILE ERROR:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0];

      return res.status(400).json({
        success: false,
        message: firstError?.message || "Invalid profile data",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  getPatientProfile,
  updatePatientProfile,
};