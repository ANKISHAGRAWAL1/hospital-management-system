const Department = require("../models/Departments");

// =====================================================
// CREATE DEPARTMENT
// =====================================================
const createDepartment = async (req, res) => {
  try {
    console.log("========================================");
    console.log("🔥 CREATE DEPARTMENT API HIT");
    console.log("Request Body:", req.body);

    const {
      name,
      code,
      description,
      location,
      headDoctor,
    } = req.body;

    // Required validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Department name is required",
      });
    }

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Department code is required",
      });
    }

    // Clean data
    const cleanName = name.trim();
    const cleanCode = code.trim().toUpperCase();
    const cleanDescription = description?.trim() || "";
    const cleanLocation = location?.trim() || "";
    const cleanHeadDoctor = headDoctor?.trim() || "";

    console.log("Clean Data:", {
      name: cleanName,
      code: cleanCode,
      description: cleanDescription,
      location: cleanLocation,
      headDoctor: cleanHeadDoctor,
    });

    // Check duplicate
    console.log("🔥 CHECKING DUPLICATE");

    const existingDepartment = await Department.findOne({
      $or: [
        { name: cleanName },
        { code: cleanCode },
      ],
    });

    if (existingDepartment) {
      console.log("❌ DUPLICATE DEPARTMENT FOUND");

      return res.status(409).json({
        success: false,
        message: "Department with this name or code already exists",
      });
    }

    console.log("✅ NO DUPLICATE FOUND");

    // Create department
    console.log("🔥 BEFORE DEPARTMENT CREATE");

    const department = await Department.create({
      name: cleanName,
      code: cleanCode,
      description: cleanDescription,
      location: cleanLocation,
      headDoctor: cleanHeadDoctor,
    });

    console.log("🔥 AFTER DEPARTMENT CREATE");
    console.log("Department ID:", department._id);

    // Send response
    console.log("🔥 BEFORE SENDING RESPONSE");

    return res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department,
    });

  } catch (error) {
    console.error("❌ CREATE DEPARTMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};


// =====================================================
// GET ALL DEPARTMENTS
// =====================================================
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: departments.length,
      data: departments,
    });

  } catch (error) {
    console.error("❌ GET ALL DEPARTMENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};


// =====================================================
// GET SINGLE DEPARTMENT
// =====================================================
const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: department,
    });

  } catch (error) {
    console.error("❌ GET DEPARTMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};


// =====================================================
// UPDATE DEPARTMENT
// =====================================================
const updateDepartment = async (req, res) => {
  try {
    const {
      name,
      code,
      description,
      location,
      headDoctor,
    } = req.body;

    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    if (name !== undefined) {
      department.name = name.trim();
    }

    if (code !== undefined) {
      department.code = code.trim().toUpperCase();
    }

    if (description !== undefined) {
      department.description = description.trim();
    }

    if (location !== undefined) {
      department.location = location.trim();
    }

    if (headDoctor !== undefined) {
      department.headDoctor = headDoctor.trim();
    }

    await department.save();

    return res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: department,
    });

  } catch (error) {
    console.error("❌ UPDATE DEPARTMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};


// =====================================================
// UPDATE DEPARTMENT STATUS
// =====================================================
const updateDepartmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (typeof status !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Status must be true or false",
      });
    }

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Department status ${
        status ? "activated" : "deactivated"
      } successfully`,
      data: department,
    });

  } catch (error) {
    console.error("❌ UPDATE DEPARTMENT STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};


// =====================================================
// DELETE DEPARTMENT
// =====================================================
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    await department.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });

  } catch (error) {
    console.error("❌ DELETE DEPARTMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};


// =====================================================
// EXPORT ALL FUNCTIONS
// =====================================================
module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  updateDepartmentStatus,
  deleteDepartment,
};