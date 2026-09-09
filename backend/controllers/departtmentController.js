const Department = require("../models/Departments");

 
 

// CREATE DEPARTMENT
const createDepartment = async (req, res) => {
  try {
    const {
      name,
      code,
      description,
      location,
      headDoctor,
    } = req.body;

    // Required fields
    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: "Department name and code are required",
      });
    }

    // Check duplicate department
    const existingDepartment = await Department.findOne({
      $or: [
        { name },
        { code },
      ],
    });

    if (existingDepartment) {
      return res.status(409).json({
        success: false,
        message:
          "Department with this name or code already exists",
      });
    }

    // Create department
    const department = await Department.create({
      name,
      code,
      description,
      location,
      headDoctor,
    });

    // Success response
    return res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department,
    });

  } catch (error) {
    console.error("Create Department Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

 

// Get All Departments
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate("headDoctor", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Department
const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate("headDoctor", "name email phone");

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Department
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

    if (name) department.name = name;
    if (code) department.code = code;
    if (description !== undefined)
      department.description = description;
    if (location !== undefined)
      department.location = location;
    if (headDoctor !== undefined)
      department.headDoctor = headDoctor;

    await department.save();

    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: department,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Department Status
const updateDepartmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Boolean check
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

    res.status(200).json({
      success: true,
      message: `Department status ${
        status ? "activated" : "deactivated"
      } successfully`,
      data: department,
    });
  } catch (error) {
    console.error("Update Department Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  updateDepartmentStatus,
};

// Delete Department
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

    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  updateDepartmentStatus,
  deleteDepartment,
};